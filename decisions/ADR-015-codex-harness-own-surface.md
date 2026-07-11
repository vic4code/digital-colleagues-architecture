# ADR-015 — Build on the official codex harness; own surface = channel adapter only

- **Status:** Proposed
- **Date:** Phase 0.5 design
- **Deciders:** architecture owner

## Context

Phase 0 proved the digital-colleague concept with a custom dispatcher: a FastAPI
`server.py` owning session mapping, turn queueing, subprocess lifecycle
(DaemonPool), and message fan-out. Since then the official codex harness
(`codex app-server`) has grown native equivalents for all of it — session and
turn lifecycle over JSON-RPC, sandboxing, MCP tool wiring, and agent spawning
(sub-agents). Every line of our dispatcher now competes with an upstream team
iterating faster than we can.

Phase 0.5 also needs a defensible answer to "why not just teach everyone codex
CLI?" — the answer (shared identity, zero-install reach via channels, governance)
implies our value is *around* the harness, not inside it.

## Decision

The Phase 0.5 runtime is an **unmodified `codex app-server`**. We delete the
custom dispatcher. The only components we own are:

1. the **channel adapter** — channel I/O (Graph/Outlook first), mailbox→colleague
   routing, reply relay, and the audit tap on the JSON-RPC event stream
2. the **installer** — per-OS packaging that compiles `colleagues.yaml` into
   `~/.codex` configuration (personas as `AGENTS.md` + config profiles)

Orchestration features we need but the harness lacks are feature requests or
waiting games, not forks. Colleague co-work on one device uses native sub-agent
spawning; cross-device co-work goes through channels (colleague A emails
colleague B), never a custom mesh.

## Alternatives considered

- **Keep the Phase 0 dispatcher.** Full control, but a permanent fork tax: we
  re-implement (and re-debug) everything upstream ships for free, forever.
- **Generic agent frameworks (LangGraph etc.).** Same fork tax plus a second
  harness to learn; abandons the codex-native persona/tool conventions Phase 0
  validated.
- **No platform — teach codex CLI.** Right answer for all-engineer audiences;
  fails for zero-install users, shared identity, and centralized traces.

## Consequences

**Easier:** orchestration codebase drops to ~one small service; harness upgrades
are consumed, not ported; co-work arrives with the harness's sub-agent roadmap.

**Harder:** we accept the harness's release cadence and behavioral changes;
scheduling internals are a black box; if upstream drops or breaks app-server
JSON-RPC semantics, the adapter must chase it (pin versions per release to
mitigate).

**Follow-up implied:** ADR-016 defines where traces live given we no longer own
the dispatch path. The adapter must stay placement-agnostic (edge → resident box
→ cloud) so this decision carries into Phase 1's channel-adapter layer.
