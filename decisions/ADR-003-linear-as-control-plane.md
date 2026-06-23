# ADR-003 — Linear as control plane for task dispatch, not as system of record

- **Status:** Proposed
- **Date:** 2026-06-23
- **Deciders:** (architecture review)

## Context

Phase 0 already syncs a Linear sprint board bidirectionally with the local kanban, and a Linear
issue assignment auto-dispatches an agent turn (see [Phase 0](../phases/0/README.md)). We need to
decide what role Linear plays going forward: is it just a UI, or is it load-bearing
infrastructure? The temptation is to let Linear become the place where everything lives, because
it already has issues, states, assignees, and a nice UI legal can use.

## Decision

Linear is a **control plane**: a human-facing surface for *dispatching* work to colleagues and
*observing* status. It is **not** the system of record and **not** the runtime. The authoritative
state of a turn (claim state, audit, outputs) lives in Postgres + S3
([ADR-004](./ADR-004-worker-pool-externalized-state.md), [ADR-006](./ADR-006-audit-log-retention.md)).
Linear assignment → orchestrator → SQS → worker is the dispatch path; Linear is one ingress among
several (Claw3D being the other in Phase 1), not the spine. In Phase 1 the Phase 0 polling sync is
replaced by **Linear webhooks → orchestrator**, same semantics, lower latency, less API load.

## Alternatives considered

- **Linear as the system of record (store everything in Linear, treat its API as our DB):**
  rejected. Couples our correctness to a third-party's availability, rate limits, and data model;
  makes the legal audit story depend on a vendor we don't control ([ADR-006](./ADR-006-audit-log-retention.md)
  needs immutable, retention-controlled storage Linear can't promise); and locks us to Linear
  forever. Violates [overview](../overview/README.md) Non-negotiable #5.
- **Drop Linear entirely, build our own board in Claw3D:** rejected for Phase 1. Linear is
  already the surface non-3D-savvy stakeholders (legal) actually use, and rebuilding sprint/board
  UX is wasted effort while a perfectly good control plane exists.
- **Linear as control plane, our store as system of record (chosen):** keeps the surface humans
  like, keeps authority where we can audit and control it, and keeps Linear swappable for another
  tracker behind the same internal claim-state machine.

## Consequences

- **Easier:** humans get a familiar dispatch/observability surface for free; the same internal
  claim-state machine ([ADR-007](./ADR-007-symphony-inspired-orchestration.md)) serves both Linear
  and Claw3D ingress; Linear is replaceable.
- **Harder:** two-way sync between Linear state and our internal claim state is a real consistency
  problem (Phase 0 resolved it with "Linear wins" + dirty-flag push; Phase 1 webhooks reduce but
  don't eliminate the race). Mapping Linear assignees to colleague identities (`AGENT_TO_EMAIL`
  today) needs a real identity mapping in the `colleagues` table.
- **Follow-up:** define the webhook ingress and its idempotency in ADR-004's dispatch design;
  decide whether non-Linear tenants in [Phase 2](../phases/2/README.md) get a different control
  plane behind the same abstraction.
- **Accepted downside:** sync logic is permanent complexity for as long as Linear is a surface.
  We accept it because the alternative (humans dispatching through our own immature UI) is worse.
