# ADR-004 — Worker pool with externalized state, not per-agent containers

- **Status:** Proposed
- **Date:** 2026-06-23
- **Deciders:** (architecture review)

## Context

This is the core Phase 1 architectural move and the reason Phase 0 doesn't scale. In Phase 0 each
colleague is a long-lived `codex app-server` subprocess; "is David busy" lives in that process's
memory (`_turn_lock`), and David's identity is pinned to one machine. To get HA, autoscaling, and
multi-host operation, we have to break the assumption that a colleague *is* a running process.

## Decision

A colleague is **data** (a row in `colleagues` + persona + memory + permissions). Execution is
performed by a pool of **stateless, interchangeable Fargate workers** ([ADR-002](./ADR-002-fargate-not-eks.md))
that pull turns from **SQS**. A worker loads the target colleague's persona and memory from
Postgres/S3 at turn start, runs the turn (spawning a `codex app-server` scoped to that turn in an
isolated, path-safe workspace per [ADR-007](./ADR-007-symphony-inspired-orchestration.md)), writes
results back to shared state, and is then free for any other colleague's turn. Dispatch state
moves from in-memory locks to an explicit **claim-state machine** on a Postgres `pending_tickets`
table (`Unclaimed → Claimed → Running → RetryQueued → Released`, per ADR-007). Both ingress paths
(Linear webhook per [ADR-003](./ADR-003-linear-as-control-plane.md), Claw3D push) funnel into the
same claim-state machine.

## Alternatives considered

- **Per-agent container, one long-lived process per colleague (Phase 0 model, lifted to k8s):**
  rejected. Doesn't autoscale (idle colleagues hold resources; busy ones can't borrow capacity),
  pins identity to a pod, loses thread context on restart, and caps colleague count at what fits
  on the fleet. It's Phase 0's SPOF relocated, not solved. (See also [ADR-002](./ADR-002-fargate-not-eks.md).)
- **Keep in-memory busy state, just run more orchestrator replicas:** rejected. Two replicas with
  independent in-memory locks will double-dispatch the same turn. State must be externalized for
  any horizontal scale to be correct.
- **Stateless worker pool + externalized claim state (chosen):** any worker handles any
  colleague's turn; scaling is queue-depth-driven; restart loses nothing because authority is in
  Postgres/S3; correctness comes from one authority serializing claims.

## Consequences

- **Easier:** autoscale on SQS depth; no SPOF on the worker layer; restart recovery is free
  (re-derive from tracker + claim rows, per ADR-007); adding a colleague is `INSERT`, not deploy.
- **Harder:** per-turn cold-load of persona/memory adds latency vs. a warm resident process —
  needs caching and a sensible memory-fetch strategy (informed by the memory work flagged in
  [Phase 2](../phases/2/README.md)). Exactly-once-ish dispatch requires careful claim/visibility-
  timeout handling on SQS.
- **Follow-up:** specify the SQS message schema, visibility timeout, and dead-letter policy;
  specify how a long, multi-turn conversation keeps thread continuity across workers (the thread
  lives in shared state, the worker is transient); define the `colleagues` and `pending_tickets`
  schemas concretely.
- **Accepted downside:** more moving parts than Phase 0's single process. We accept that
  complexity as the irreducible cost of HA + horizontal scale.
