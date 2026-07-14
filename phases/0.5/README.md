# Phase 0.5 — Digital Colleague: layered persona on the Codex engine

**Status:** 📐 Design note. The **implementation lives in a separate code repo**
(this repo is architecture only). Parallel track — not on the cloud progression
(0 → 1 → 2 → 3).

**One line:** a digital colleague is a **layered persona running on the Codex
engine through an agent runtime**, given real accounts (Gmail, Slack, …) and a
skill that lets it pick up work from any of those channels and schedule the
tasks itself.

We **borrow the persona layer model** — Soul · Body · Faculty · Skill, the
"spirit" of an open-source agent framework (named in
[ADR-018](../../decisions/ADR-018-adopt-openclaw-codex.md)) — but the persona
*content*, the *skills*, and the whole **access-and-permission design are ours**.
The framework is a design reference, not a brand we ship and not a black-box
dependency that quietly holds our credentials.

![Phase 0.5 layering](./architecture.svg)

## What this replaced (and why)

Earlier drafts of Phase 0.5 hand-built a channel adapter — poller, router,
scheduler, JSON-RPC client, trace tap — around `codex app-server`. That work is
**retired** ([ADR-018](../../decisions/ADR-018-adopt-openclaw-codex.md)): an
existing agent framework already *is* that layer, so building it ourselves was
reconstructing a shipped product by hand. See the teardown decision for the full
reasoning and the framework it names.

## The stack — three layers, we own the middle of one

| Layer | Provided by | We do |
|---|---|---|
| **Engine** — agent loop, thread resume, tool continuation, compaction | **Codex** `app-server` (via the runtime's codex-harness plugin) | nothing — use it |
| **Runtime** — channels, chat/web UI, session files, approvals, transcript | off-the-shelf agent gateway | configure it |
| **Persona** — `SOUL.md` / `IDENTITY.md`, Soul·Body·Faculty·Skill | borrowed layer model | **author it — this is the colleague** |
| **Skills** — what the colleague can do, incl. task intake & scheduling | our code + MCP tools | **write the few we need** |
| **Access & permissions** — credentials, scopes, sandbox, audit | **ours to design** | **spell it out; security reviews it** |

The colleague *is* data: a persona plus a skill set. The runtime and engine are
off-the-shelf; the persona layer model is borrowed. What is genuinely ours is
two things: the **skills**, and the **access-and-permission design** — the ADR-015
principle taken one layer further, plus the security surface no framework hands
you for free.

## The one thing worth designing (behaviour): multi-channel intake + self-scheduling

The runtime gives channels; the behaviour we want to add is: **the colleague
notices work arriving on any of its accounts (mail, Slack, a Notion or kanban
change), queues it as tasks, works them, and reports back on a channel** —
without a human forwarding each item. This is a **skill** (task intake +
dispatch), not new infrastructure. The old "dispatcher" idea becomes exactly this
skill; nothing about it is a bespoke service.

Open design questions (answer against the runtime's real capabilities, in the
code repo — not to over-spec here):

- Are Gmail/Slack first-class channels of the runtime, or do they arrive as MCP
  tools the intake skill polls? (verify before designing)
- Where does the task queue live — a runtime session artifact, or the
  colleague's own workspace file?
- Scheduling trigger: a runtime event → skill, or a skill that wakes on a timer
  and sweeps its accounts? (the initiator test decides which is worth building)

## The other thing worth designing (security): access & permissions

A colleague with its own Gmail + Slack + reach into internal services is a real
security surface — this is what "資安疑慮" actually points at, and no framework
answers it for you. Spell out, and put in front of security review:

- **Credential custody.** OAuth tokens and API keys live in a secrets store (OS
  keychain locally, a secrets manager in cloud) — never in persona files, config,
  logs, or traces. The runtime uses them at execution time only.
- **Least privilege.** Each account and each MCP tool gets the minimal scope the
  colleague actually needs — per colleague, not a shared god-token.
- **Sandbox + approval bounds.** Codex-native `sandbox_mode` bounds what the
  colleague can touch; `approval_policy` bounds what it does unattended. These
  are the blast-radius controls if a persona is prompt-injected.
- **Audit.** Every tool call and channel action is logged (Codex rollouts + a
  business trace) so "what did it do, on whose behalf" is always answerable.
- **Runtime trust boundary — the review target.** The runtime is the process
  that holds real-account tokens. If it is third-party, *that* is what security
  reviews: prefer **self-hosting** it or fronting credentials with a **broker you
  control**, rather than handing an external service standing access to company
  accounts. Borrowing the *design* (the persona layers) carries no such risk;
  running someone else's *binary with your tokens* does — keep the two decisions
  separate.

## The initiator test still governs scope

[ADR-017](../../decisions/ADR-017-initiator-test.md) holds: build the
multi-channel intake only where **the initiator is not you** — a teammate, a
customer, another system, or someone who can't run the agent app. If the only
initiator is yourself, talk to the colleague in its web chat (the runtime gives
you that for free) and skip the intake plumbing until a real second party appears.

## Short-term vs long-term (unchanged in spirit)

- **Short term — the colleague as your local 分身.** The runtime + codex-harness
  on your own device, one persona, its own Gmail/Slack accounts. Mail it or DM it;
  it runs on your machine's compute. This is the boss-facing demo.
- **Long term — centralized.** The same persona deployed to an always-on cloud
  runtime; hand it tasks by mail/Slack and it works them unattended. Persona and
  skills transfer unchanged — the move is a deployment change, and it rejoins the
  Phase 1 cloud line.

## Where the implementation goes

A separate code repo (e.g. `digital-colleague`) holds the runtime config, the
`SOUL.md`/`IDENTITY.md` persona, the intake/scheduling skill, and account setup.
This repo keeps only the thinking: this note, the layering diagram, and the ADRs
([017](../../decisions/ADR-017-initiator-test.md),
[018](../../decisions/ADR-018-adopt-openclaw-codex.md)).
