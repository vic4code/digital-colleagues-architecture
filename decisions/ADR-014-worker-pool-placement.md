# ADR-014 — Worker pool placement: federated, pull-based pools by location

- **Status:** Proposed
- **Date:** 2026-06-23
- **Deciders:** (architecture review)

## Context

Two real constraints push against a single central worker pool: (1) some teams have data that
cannot leave the corporate network (the strict reading of the VDI constraint,
[ADR-008](./ADR-008-vdi-presentation-only-channel.md)), so compute must run where the data is; and
(2) the desktop fleet is OS-heterogeneous — Windows internally, macOS externally. A natural but
dangerous instinct is to run the agent runtime *on each end-user machine* and "call into" those
edge processes from a central dispatcher. We need to decide where agent execution is allowed to
run and how work reaches it.

## Decision

Agent execution always runs in **homogeneous Linux containers**, organized as **one or more worker
pools placed by location** — e.g. a cloud pool (AWS, [ADR-002](./ADR-002-fargate-not-eks.md)) plus,
where data sovereignty requires it, an **on-prem pool** of Linux servers inside the corporate
network. We do **not** run agents on individual end-user machines (Windows VDI, macOS laptops).

Two rules make this work:

1. **Edge/on-prem pools pull, they are never called into.** A pool behind NAT/firewall opens an
   *outbound* connection to the control plane and pulls eligible turns from a queue (the
   self-hosted-CI-runner pattern; also Symphony's optional SSH-worker model). The orchestrator
   never initiates a connection *to* an edge node.
2. **Routing by data residency.** The orchestrator decides which pool's queue a turn goes to based
   on whether the work's data is allowed to leave its network. Identity (persona/memory) stays
   central or is replicated into the network that needs it; the *pool placement*, not per-machine
   execution, is what satisfies sovereignty.

OS heterogeneity is thereby confined: end-user machines are presentation-only (a browser, ADR-008),
so Windows-vs-macOS is irrelevant there; the execution layer is uniformly Linux.

## Alternatives considered

- **Agent runtime on each end-user machine, dispatcher calls into them:** rejected. (a) Maximizes
  OS heterogeneity — the codex/Claude Code harness would have to work on Windows + macOS + Linux,
  multiplying sandbox/path/shell differences (recall the prototype's Linux-only bubblewrap and
  macOS port-check issues). (b) Availability becomes "is that laptop awake and online." (c) Pushes
  credentials and attack surface onto the least-controlled machines. (d) Re-pins a colleague's
  identity to a specific machine — undoing the entire Phase 1 thesis ([ADR-004](./ADR-004-worker-pool-externalized-state.md)).
  (e) "Calling into" a process behind NAT/firewall doesn't work without a tunnel anyway.
- **Single central cloud pool only:** rejected as insufficient *when* a team's data legally cannot
  leave its network — no amount of encryption-in-transit satisfies "data does not leave." Fine as
  the default for teams without that constraint.
- **Federated, pull-based pools by location (chosen):** keeps execution OS-homogeneous and
  controlled, keeps identity as data, and satisfies sovereignty by placing a pool inside the
  network rather than by scattering agents across desktops.

## Consequences

- **Easier:** data-sovereign teams get a path (on-prem pool) without a separate product; OS
  heterogeneity never reaches the execution layer; edge pools work behind firewalls because they
  pull; the cloud pool stays the simple default for everyone else.
- **Harder:** secrets must be delivered to and rotated in the on-prem pool (not just central
  Secrets Manager); identity/state access from an on-prem pool to central stores (or a replicated
  copy in-network) is a real connectivity+consistency problem to design; observability/tracing must
  span cloud + on-prem pools; operating non-cloud Linux servers is ops work the cloud pool avoids.
- **Follow-up:** define the pull protocol and pool-eligibility/queue-routing rules; decide whether
  on-prem pools get a replicated identity store or reach back to a central one; specify secret
  delivery/rotation for on-prem; tie this into [Phase 3](../phases/3/README.md) (where multi-
  location and on-prem first become real) and the queue/event-bus port from [ADR-013](./ADR-013-capability-oriented-logical-architecture.md).
- **Accepted downside:** more than one place to run and operate workers. We accept that
  operational cost only for teams whose data residency *forces* it; everyone else stays on the
  single cloud pool.
