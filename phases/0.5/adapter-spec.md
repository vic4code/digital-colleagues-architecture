# Channel adapter — internals & configuration spec

Companion to [README.md](./README.md). This is the "many details" document: what
the adapter actually does inside, and everything a deployment must configure.
The adapter is the only component we own (ADR-015), so this file plus
`colleagues.yaml` **is** the implementation contract.

## 1. Internal structure

Five loops/components sharing one small local state store:

```
┌──────────────────────────── adapter process ────────────────────────────┐
│  poller ──▶ inbox queue ──▶ router ──▶ turn runner (×N) ──▶ reply relay │
│                │                            │                            │
│                └──────── state store ◀──────┤ (JSON-RPC events)          │
│                     (SQLite, single file)   └──▶ trace writer            │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Poller.** Personal mode (v0.1): **one** Graph delta query on the user's own
  mailbox (default 15 s), filtering to messages addressed to a colleague
  plus-tag; everything else is ignored. (Resident-box variant: one delta query
  per colleague mailbox.) Delta tokens are persisted, so a restart resumes
  where it left off instead of re-reading the mailbox. New messages land in
  the inbox queue as normalized `IncomingTurn` records.
- **Router.** Maps address → colleague and email thread → codex conversation.
  Personal mode routes on the plus-tag (`me+vanessa@…` → `vanessa`, from
  `colleagues.yaml`); if the tenant has plus addressing disabled, fallback is
  a subject tag (`[vanessa] …`). Threading key: Graph `conversationId` (falls
  back to `In-Reply-To`/`References`). First message of a thread ⇒
  `newConversation` with that colleague's profile; later messages ⇒ resume the
  mapped conversation.
- **Turn runner (the core).** A pool of N workers (default 2 on edge). Each
  runs one turn as a state machine (§2) over the app-server JSON-RPC
  connection: send the user turn, consume the event stream, answer approval
  requests per policy (§3), collect the final message.
- **Reply relay.** Sends the colleague's answer back via Graph `sendMail` on
  the same thread, then marks the triggering message as processed (moves it to
  a `Processed` folder — the mailbox itself is the work queue).
- **Trace writer.** Appends every JSON-RPC event to `traces/audit.jsonl` with
  the correlation id (ADR-016). Not optional, not configurable-off.

**State store** (one SQLite file — the only adapter-owned persistent state):
`delta_tokens`, `thread_map` (email thread ↔ conversation id), `processed`
(message ids, for idempotency), `inflight` (turns being run), `dead_letter`.

## 2. Message lifecycle (at-least-once, idempotent)

```
discovered → claimed → turn_running → replying → done
     ↑           │            │
     └── crash ──┴────────────┘→ retry (max 3) → dead_letter → notify owner
```

- The mailbox is the queue: a message only leaves `claimed` when the reply has
  been sent AND the message moved to `Processed`. Crash anywhere before that ⇒
  next poll re-discovers it; the `processed` table stops double-replies.
- A turn that dies mid-run (app-server restart) is retried from scratch — turns
  must therefore be **effectively idempotent**: tools that mutate external
  systems (e.g. `kanban_*`) take an idempotency key derived from the message id.
- After 3 failures the message goes to `dead_letter` and the adapter emails the
  *requester* ("Vanessa couldn't process this; her operator has been notified")
  and the *operator* (owner address in config). No silent drops, ever.
- Per-conversation serialization: one turn at a time per thread; parallel
  threads to the same colleague are fine (sessions are cheap, ADR-015).

## 3. Approval policy — native knobs, not a custom engine

Codex already has two orthogonal, per-profile controls: `sandbox_mode`
(`read-only` / `workspace-write` / `danger-full-access`) bounds what the agent
*can touch*, and `approval_policy` (`untrusted` / `on-failure` / `on-request` /
`never`) decides *when it asks a human*. We do *not* build an allow-list engine
on top (that would violate ADR-015); each colleague declares a native pair in
`colleagues.yaml` and the installer compiles it into their config.toml profile:

- **Advisor colleagues (v0.1 default):** `workspace-write` + `never` — free to
  act inside the sandbox, never blocks waiting for an approval nobody will see.
  The sandbox, not an approval prompt, is the safety boundary.
- **Read-only colleagues:** `read-only` + `never` — for pure Q&A personas.
- **Operator colleagues (v0.2):** `workspace-write` + `on-request` — the only
  case where the adapter handles approval callbacks: it emails the requester
  "Vanessa wants to run X — reply APPROVE" and resumes the turn on approval.
  Every approval exchange lands in the trace.

Exact mode names are pinned per codex release along with the binary (ADR-015).

## 4. Configuration surface — everything a deploy must provide

Two files plus a secrets layer. The installer materializes all of it.

**`adapter.toml`** (non-secret; per device):

```toml
[graph]
tenant_id   = "…"
auth        = "device_code"        # edge default; "client_credentials" on resident box
poll_seconds = 15

[runtime]
codex_bin    = "/usr/local/bin/codex"   # pinned version (ADR-015)
max_turns    = 2                        # concurrent turn workers
workspace    = "~/DigitalColleagues"    # where colleagues read/write files

[llm]                                   # what codex config.toml gets pointed at
provider  = "azure_openai"              # or "openai" | "internal_vllm"
base_url  = "https://…"                 # required for azure/vllm

[traces]
dir       = "~/DigitalColleagues/traces"
sync      = "sharepoint"                # or "s3" | "none" (air-gapped: none + manual)
sync_url  = "https://…"

[operator]
email = "you@company.com"               # dead-letter + health notifications
```

**`colleagues.yaml`** (identity of record — version-controlled, shared):

```yaml
colleagues:
  - id: vanessa                         # personal mode: reached at me+vanessa@…
    persona: personas/vanessa/AGENTS.md
    tools: [docs-v1, kanban-v1]         # MCP allow-list
    sandbox_mode: workspace-write       # native codex knobs (§3)
    approval_policy: never
    model: gpt-5.2                      # per-colleague override allowed
```

**Secrets — three kinds, none in files:**

| Secret | Obtained | Stored |
|---|---|---|
| Graph token (personal mode: **one**, for the user's own mailbox) | device-code sign-in during install | OS keychain (Keychain / DPAPI / libsecret) |
| LLM credential (`OPENAI_API_KEY` / Azure key, or ChatGPT login) | `codex login` or key paste during install | codex's own auth store / keychain; injected as env at service start |
| MCP tool credentials (e.g. kanban API) | install prompts, per tool | OS keychain |

Rules: secrets never appear in `adapter.toml`, `colleagues.yaml`, logs, or
traces (trace writer redacts `Authorization` fields). Air-gapped deploys point
`[llm]` at internal vLLM — no key leaves the network, possibly none at all.

**Graph auth model — the one real IT decision:**

- **Edge / personal (v0.1): delegated, device-code, one sign-in.** The adapter
  only ever touches the user's own mailbox (colleagues are plus-tags on it),
  so install runs a single device-code sign-in as the user. Scopes:
  `Mail.ReadWrite`, `Mail.Send`, `offline_access`. No admin consent, no new
  mailboxes provisioned — deployable without any platform-team involvement.
- **Resident box (v0.2+): application permissions.** One app registration,
  client credential on one managed machine, scoped by `ApplicationAccessPolicy`
  to exactly the colleague mailboxes. Cleaner, but needs tenant-admin consent —
  which is why it is not the v0.1 path.
- Rejected: client credentials distributed to every laptop (secret sprawl).

## 5. Install flow (what the installer actually does)

1. Install pinned `codex` binary + adapter binary
2. Read `colleagues.yaml` → write `~/.codex/config.toml` profiles + personas
3. Prompt: LLM credential (`codex login` / API key) → keychain
4. Graph device-code sign-in as the user (one sign-in covers all colleagues) → keychain
5. Write `adapter.toml`; create workspace + traces dirs
6. Register services (launchd / systemd / Task Scheduler): `codex app-server`
   and the adapter, restart-on-crash, start-on-boot
7. Smoke test: mail `me+<colleague>@…` for each colleague → expect reply + both
   trace layers correlated; print result

Uninstall reverses it (services, keychain entries, optionally data dirs).

## 6. Failure modes summary

| Failure | Behavior |
|---|---|
| Device asleep | Colleague offline; mail queues in mailbox; drains on wake |
| app-server crash | OS restarts it; in-flight turns retried via §2; history in rollouts |
| Adapter crash | OS restarts; delta token + processed table resume cleanly |
| Graph token expired | Adapter emails operator; colleague auto-replies "temporarily offline" if mail still readable, else silent until re-auth |
| LLM endpoint down | Retry with backoff within the turn; then §2 retry path |
| Poison message (always crashes turn) | 3 strikes → dead_letter → both parties notified |
