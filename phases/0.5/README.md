# Phase 0.5 — Codex-Native Edge Prototype

**Status:** 🚧 In design. Parallel track — not on the cloud progression (0 → 1 → 2 → 3).

**Scope:** A reference architecture others can implement digital colleagues from.
Runs on each user's edge device (macOS / Windows, restricted intranets included).
The agent runtime is **`codex app-server` as-is** — the Phase 0 custom dispatcher
(`server.py` + DaemonPool) is deliberately dropped. Channels: Outlook first,
Teams second. Phase 0 stays untouched as the record of the implemented prototype;
this phase is the redesigned successor on the edge track.

![Phase 0.5 architecture](./architecture.svg)

## Why this exists — and when NOT to use it

The honest question first: **why not just teach everyone codex CLI?** Because they
are different products. Codex CLI is a *personal* tool — my session, my context,
gone when I close it. A digital colleague is a *shared, persistent identity*: it has
its own mailbox, its own memory, its own audit trail, and anyone in the team can
reach it without installing anything. Three things "just teach codex" cannot give:

1. **Shared identity** — Vanessa is one colleague, not a prompt each employee re-creates
2. **Zero-install reach** — legal staff won't install a CLI (and often aren't allowed to),
   but they already send email and type in Teams
3. **Governance** — personal CLI output scatters across laptops; a colleague's every
   turn is captured in one trace (see below)

**If your audience is all engineers and codex is allowed on their machines, do not
build this — teach codex + share an AGENTS.md convention.** This track exists for
everyone else.

## Goal

A user (or their IT) runs one installer. From then on, emailing a colleague's
address (or later, @mentioning it in Teams) triggers a turn on the user's own
device, using the official codex harness, and every interaction is preserved in
a queryable trace. Nothing custom sits between the channel and the harness except
one thin adapter.

## Non-goals

- Multi-user shared colleagues on one runtime (that's Phase 1 cloud)
- Always-on when the device sleeps (accept downtime; see cloud evolution)
- Teams in v0.1 (see trade-offs — it needs a resident machine)
- Any custom orchestration: scheduling, sub-agents, tool lifecycle all stay official

## Architecture

**Own exactly one component: the channel adapter.** Everything else is the
official harness or configuration.

- **codex app-server is the runtime.** One long-running `codex app-server`
  process per device, spoken to over JSON-RPC. Sessions, turn lifecycle,
  sandboxing, tool execution, and **native agent spawning** (colleague A
  delegating to colleague B as a sub-agent) are all harness features we consume,
  not code we write. When the harness iterates, we upgrade — we don't port.
- **Personas are configuration.** Each colleague = an `AGENTS.md` + profile in
  `config.toml` + an allow-listed MCP tool set. Declared in one `colleagues.yaml`
  that the installer compiles into `~/.codex` layout. Adding a colleague is a
  config change, not a deploy.
- **Channel adapter (the owned surface).** A single small service that:
  1. polls Microsoft Graph (Outlook) with delta queries — outbound-only, works
     behind NAT / corporate proxies, no inbound port ever
  2. routes each message to the right colleague session (per-colleague address,
     per [ADR-010](../../decisions/ADR-010-email-per-colleague-identity.md))
  3. relays the reply back out, and
  4. **taps the JSON-RPC event stream as the audit source** (see traces below)
- **Installer per OS.** macOS: script installs codex + adapter, registers
  launchd agent. Windows: PowerShell + Task Scheduler (no Docker — Docker Desktop
  on corporate Windows means WSL2 + admin rights + licensing; rejected).
  Air-gapped: offline bundle (binaries + config zip), LLM endpoint pointed at
  internal vLLM. Docker image exists only for the *resident Linux box* variant.
- **LLM endpoint is config** — cloud API, Azure OpenAI, or internal vLLM per site.

## Interaction traces — how colleague activity is preserved

Two layers, both already flowing; we capture rather than invent:

| Layer | Producer | Where | Contains |
|---|---|---|---|
| **Business audit** | channel adapter (event-stream tap) | `traces/audit.jsonl` per device | who asked, via which channel, which colleague, tool calls made, approvals, what was sent back |
| **Harness rollout** | codex itself | `~/.codex/sessions/*.jsonl` | the full turn: every message, reasoning step, tool input/output |

Records in both layers share a correlation id (channel message id ↔ codex session
id), so an auditor can go from "this email reply" to the exact reasoning trace.
**Co-work is covered by the same two layers**: a native sub-agent spawn appears in
the parent's rollout (and as an event the adapter records), so A→B delegation is
one linked trace, not two orphans. The adapter ships `traces/` to a shared store
(SharePoint / S3 / network drive) on a nightly sync — that same sink becomes the
Phase 1 audit backbone later. Retention policy per
[ADR-006](../../decisions/ADR-006-audit-log-retention.md); the two-layer split is
[ADR-016](../../decisions/ADR-016-two-layer-interaction-traces.md).

## Co-work: colleagues working together

- **Same device (now):** use codex-native agent spawning. Vanessa (PM) delegates a
  sub-task to David (SA) as a sub-agent within the harness. No custom message bus,
  no fan-out trigger reimplementation — that was Phase 0's dispatcher, and it's gone.
- **Across devices / across people (later):** colleagues reach each other through
  the same channels humans use — colleague A emails colleague B's address. This
  keeps cross-device co-work on the audited path with zero new infrastructure,
  at the cost of email-grade latency. Acceptable for the edge tier.
- **When co-work outgrows this** (needs shared queues, low latency, shared memory),
  that is the signal to move those colleagues to the cloud version — not to build
  a mesh between laptops.

## Trade-offs

- **Official harness over own dispatcher.** We give up control over scheduling
  internals and accept the harness's release cadence; in exchange every line of
  orchestration code we'd otherwise maintain (and race against upstream) is
  deleted. See [ADR-015](../../decisions/ADR-015-codex-harness-own-surface.md).
  Rejected: keeping Phase 0's FastAPI dispatcher (permanent fork tax); generic
  agent frameworks (second harness to learn, same fork tax).
- **Outlook first, Teams second.** Graph delta polling is outbound-only and works
  from any device. Teams bots require an Azure Bot Service public webhook — an
  edge laptop can't receive it, and Graph chat-polling needs tenant-admin-heavy
  permissions. Teams therefore lands with the *resident machine* variant, not v0.1.
- **Device sleep = colleague offline.** Accepted. The mitigation path is the
  resident Linux box / cloud version, not keep-awake hacks.
- **Polling latency (~seconds–minute) over push.** Accepted for email-shaped work;
  the cloud version restores push.

## Evolution to the cloud version

The adapter is written to be placement-agnostic; moving up is redeployment:

1. **Edge (v0.1)** — adapter + app-server on each user's device; traces sync nightly
2. **Resident box** — same Docker pair on one always-on intranet Linux host;
   colleagues survive laptop sleep; Teams webhook becomes possible; traces
   stream instead of sync
3. **Cloud (Phase 1)** — the adapter becomes the channel-adapter layer in front of
   the Phase 1 orchestrator ([ADR-014](../../decisions/ADR-014-worker-pool-placement.md)
   pull-based pools); `traces/` sink becomes Postgres + S3 audit. Personas
   (`colleagues.yaml`) transfer unchanged.

## Deliverables (the reference repo)

Separate code repo; this document is its architectural contract:

```
digital-colleague-edge/
├── adapter/            # channel adapter (Graph polling, routing, trace tap)
├── install/            # install.sh (macOS) · install.ps1 (Windows) · offline bundle
├── colleagues.yaml     # persona declarations → compiled to ~/.codex layout
├── personas/           # AGENTS.md per colleague
└── traces/             # audit.jsonl + sync config
```

v0.1 vertical slice: **one persona + Outlook polling + OS service + linked traces.**
Prove email-in → codex turn → email-out → both trace layers correlated. Then
Windows installer, then resident-box/Teams.

## Key decisions

- [ADR-015](../../decisions/ADR-015-codex-harness-own-surface.md) — build on the
  official codex harness; own surface = channel adapter only
- [ADR-016](../../decisions/ADR-016-two-layer-interaction-traces.md) — two-layer
  interaction trace retention
- [ADR-010](../../decisions/ADR-010-email-per-colleague-identity.md) — per-colleague
  email identity (shared with the cloud track)
