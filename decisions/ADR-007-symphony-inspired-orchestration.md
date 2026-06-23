# ADR-007 — Symphony-inspired orchestration model for Phase 1+

- **Status:** Proposed
- **Date:** 2026-06-23
- **Deciders:** (architecture review)

## Context

[OpenAI Symphony](https://github.com/openai/symphony) (Apache-2.0) is a reference design for
exactly our problem: poll an issue tracker (Linear), spawn isolated coding-agent runs, manage
work instead of supervising agents. We need Phase 1 to ship fast (~2 months) on AWS *and* stay
maintainable as we add colleagues and channels. Symphony's spec (`SPEC.md`) encodes patterns
that are directly portable to our orchestrator/worker design without forcing us into Elixir or
its repo-checkout-per-issue model (we don't run one-shot coding tasks; our colleagues run
recurring conversational/document-review turns).

## Decision

We adopt five patterns from Symphony's design into Phase 1, layered on our existing
SQS + Postgres + S3 stack (no new infra):

1. **Workflow-as-data.** Each colleague gets a versioned config (front matter: tracker binding,
   polling, workspace, hooks, agent settings) + prompt template, checked into the repo —
   extending today's `AGENTS.md` persona file rather than replacing it. Adding a colleague stays
   a data change, not a code change, and now covers dispatch behavior too, not just persona text.
2. **Explicit internal claim-state machine**, distinct from Linear's own issue states:
   `Unclaimed → Claimed → Running → RetryQueued → Released`. Implemented as a status column on
   the Postgres `pending_tickets` table (already planned in [Phase 1](../phases/1/README.md)).
   This replaces the looser `queued → running → done` semantics inherited from Phase 0's
   `pending.jsonl` with something that has a defined retry/release path.
3. **Tracker + S3 as durable source of truth; orchestrator state is a rebuildable cache.**
   We do not need the orchestrator's in-memory dispatch state to survive a restart — on boot it
   re-derives active work from Linear (active issues) and Postgres (claim rows), the same way
   Symphony recovers without a persistent scheduler DB. This lowers the durability bar for the
   orchestrator itself and lets us ship Phase 1 without solving exactly-once dispatch from day one.
4. **Per-turn isolated workspace with path-safety invariants.** Every worker turn gets a
   sanitized, contained scratch path (`[A-Za-z0-9._-]` identifiers only; resolved path MUST be a
   strict subdirectory of a workspace root). Adopted directly as a worker hardening rule for
   Fargate tasks handling contract documents.
5. **Bounded continuation turns.** A worker MAY continue the same live thread for follow-up turns
   (cheaper, keeps context) up to a configured `max_turns`, re-checking the source ticket/session
   state before continuing. This is a concrete implementation of the `/goal` autonomy boundary —
   long-running colleague behavior gets a hard ceiling instead of running indefinitely on trust.

We do **not** adopt Symphony's workspace-population/Git-checkout model (irrelevant — we don't
check out a repo per issue) or its Elixir reference implementation itself.

## Alternatives considered

- **Build our own state machine from scratch:** would likely converge on something similar after
  a few iterations of "what state is this ticket actually in." Not picked — no reason to
  re-derive a model an already-shipped system validated.
- **Adopt Symphony wholesale (run its Elixir service as our orchestrator):** rejected. Symphony
  is scoped to one-shot coding-task execution per issue; our colleagues are long-lived personas
  handling recurring conversational and document turns across two ingress channels (Claw3D +
  Linear), not just tracker-polled coding tasks. Wrong shape for our problem.
- **Keep Phase 0's loose `queued/running/done` semantics as-is into Phase 1 (chosen previously,
  revised here):** workable but doesn't give a clean release/retry boundary; superseded by the
  5-state model above.

## Consequences

- **Easier:** onboarding a new colleague (data file, not code); reasoning about what a ticket's
  dispatch state actually is; restart recovery (no need for the orchestrator's own state to be
  perfectly durable); cost control on long-running colleagues via bounded continuation turns.
- **Harder:** need to design and document our own front-matter schema for the colleague config
  (Symphony's schema is tracker/coding-agent specific; ours must also describe Claw3D-originated
  dispatch, which Symphony doesn't have).
- **Follow-up:** Phase 1's "Key design decisions to capture as ADRs" list should reference this
  ADR when ADR-004 (worker pool with externalized state) is written — the claim-state machine
  belongs in that design.
- **Accepted downside:** two ingress paths (Linear poll, Claw3D push) must both funnel into the
  same internal claim-state machine; this mapping isn't free and needs its own short design note
  when ADR-004 is written.
