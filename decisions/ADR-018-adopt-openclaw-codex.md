# ADR-018 — Adopt OpenClaw + Codex; retire the hand-built channel adapter

- **Status:** Accepted
- **Date:** Phase 0.5 teardown
- **Deciders:** architecture owner
- **Narrows:** [ADR-015](./ADR-015-codex-harness-own-surface.md)

## Context

Phase 0.5 spent significant effort specifying and prototyping a channel adapter
around `codex app-server`: a poller, content-based router, turn scheduler,
JSON-RPC client, approval responder, and trace tap, with an Outlook/Teams
mailbox-as-queue design. During review it surfaced that **OpenClaw already
ships this layer.** Its codex-harness plugin runs agent turns through Codex's
`app-server` (Codex owns thread resume, tool continuation, compaction,
execution) while OpenClaw owns channels, session files, model selection,
approvals, media, the visible transcript, and a persona system
(`SOUL.md` / `IDENTITY.md`, the Soul·Body·Faculty·Skill model).

In other words, the thing we were hand-building is a rebuild-by-hand of a
shipped product. ADR-015 said "own surface = channel adapter only"; that was
still one layer too greedy.

## Decision

Build digital colleagues as **customized OpenClaw personas on the Codex
engine.** Adopt the stack wholesale:

- **Codex** — the agent engine (via OpenClaw's codex-harness plugin). Own nothing.
- **OpenClaw** — the runtime: channels, chat/web UI, sessions, approvals,
  persona loading. Configure, don't build.
- **Persona** — authored in OpenClaw's format. This *is* the colleague.
- **Skills** — the only code we write, and only the few we actually need —
  chiefly a multi-channel task-intake + self-scheduling skill (the old
  "dispatcher" idea, demoted to a skill).

The hand-built adapter (`adapter-spec.md`, `adapter-flow.svg`,
`channel-protocol.svg`, the `prototype/` package) is deleted. Implementation
moves to a **separate code repo**; this architecture repo keeps only the design
note and ADRs.

## Alternatives considered

- **Keep the hand-built adapter (ADR-015 as written).** Rejected: a permanent
  maintenance burden reconstructing OpenClaw's channel + persona layers, racing
  two upstreams (Codex *and* the capabilities OpenClaw already provides).
- **OpenClaw's built-in harness instead of Codex.** Rejected for now: the team's
  agent work and conventions are Codex-native; the codex-harness plugin lets us
  keep Codex as the engine while gaining OpenClaw's runtime. Revisit only if the
  plugin proves limiting.
- **Wait for a vendor "digital colleague" product.** Rejected: the customization
  (our persona, our accounts, our intake skill, our deployment) is exactly the
  part no vendor ships; that is where our work legitimately is.

## Consequences

**Easier:** our surface collapses to persona + a handful of skills; channels,
UI, session lifecycle, approvals, and compaction come for free; the boss-facing
demo is a configuration exercise, not a build.

**Harder:** a hard dependency on OpenClaw's release cadence and its channel
coverage — whether Gmail/Slack are first-class channels or arrive as MCP tools
must be verified in the code repo before the intake skill is designed. We take
on learning a second framework's conventions on top of Codex's.

**Follow-up implied:** ADR-015's "own surface" is narrowed from "channel
adapter" to "persona + skills." ADR-017 (initiator test) still gates whether the
intake skill is built at all. The retired adapter's ideas (at-least-once,
sender allow-list, two-layer traces in ADR-016) become *requirements to check
OpenClaw against*, not things we implement.
