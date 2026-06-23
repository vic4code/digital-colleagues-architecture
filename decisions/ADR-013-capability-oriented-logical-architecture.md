# ADR-013 — Capability-oriented logical architecture; clouds are bindings

- **Status:** Proposed
- **Date:** 2026-06-23
- **Deciders:** (architecture review)

## Context

The phase diagrams (notably [Phase 1](../phases/1/README.md)) are drawn in AWS nouns — RDS, S3,
SQS, Fargate, ALB, Cognito. That's correct for *a deployment*, but it quietly binds the
*architecture itself* to one vendor, which conflicts with two things we already committed to:
[Non-negotiable #5](../overview/README.md) (no vendor lock) and serving on-prem / VDI-bound teams
([ADR-008](./ADR-008-vdi-presentation-only-channel.md)). Separately, persona / memory / skill —
the things that actually make a colleague a colleague — were only present implicitly ("rows in
Postgres, prompts in S3") rather than as first-class components.

## Decision

We maintain a **cloud-agnostic logical (capability) architecture** as the canonical model
([overview/logical-architecture.md](../overview/logical-architecture.md)). Components are named by
capability (Gateway, Dispatch queue, Persona store, …), not by product. Each phase and each
environment is a **binding** of that model onto concrete technology: Phase 1 is the AWS binding;
on-prem is another binding of the *same* model. The logical model is the contract; a cloud
provider is a supplier of implementations for it.

Two concrete consequences of this stance:

1. **Persona, Memory, Skill, Permission, and Secret are first-class capability components** — a
   "Colleague Identity Plane" — not implementation trivia. They appear in the logical diagram as
   their own boxes regardless of the fact that Phase 1 happens to back several of them with the
   same Postgres instance.
2. **The queue and the event/stream bus are accessed through a thin port (interface).** SQS and
   Redis have no drop-in on-prem equivalent, so "SQS vs RabbitMQ / NATS" must be a binding detail
   behind an interface, not a choice baked into the orchestrator's code. Every other capability is
   a near-direct substitution (Postgres↔Postgres, S3↔MinIO, Secrets Manager↔Vault).

## Alternatives considered

- **AWS-native from the start, no logical layer:** rejected. Fastest to draw and to ship one
  deployment, but it makes the architecture un-portable by construction, breaks the no-vendor-lock
  commitment, and leaves on-prem/VDI teams with no path. The cost of the logical layer is low; the
  cost of un-baking AWS later is high.
- **Full portability everywhere (abstract every service behind a provider interface, ship
  multi-cloud from day one):** rejected as over-engineering. We do *not* abstract everything — we
  bind concretely per phase (Phase 1 really is AWS, with real RDS/S3/SQS) and only keep the
  *logical model* as the portable contract, plus a thin port on the two capabilities (queue, event
  bus) that genuinely lack drop-in equivalents. Portability is a documented mapping, not a
  runtime abstraction tax on every call.
- **Capability model as canonical + per-environment bindings (chosen):** keeps shipping velocity
  (Phase 1 uses AWS directly) while keeping the architecture itself vendor-neutral and on-prem
  viable.

## Consequences

- **Easier:** reasoning about the system without AWS knowledge; onboarding an on-prem/VDI team
  (swap the binding column, not the design); swapping any single managed service; explaining the
  system to non-AWS stakeholders (legal, leadership).
- **Harder:** the logical model and its binding table must be *maintained* — every new
  capability needs both a logical box and its bindings, and we must actively resist AWS specifics
  leaking into the logical model (e.g. "an SQS message attribute" appearing in a capability-level
  description is a smell).
- **Follow-up:** phase diagrams should each state which logical capabilities they bind and how;
  the queue/event-bus port interface needs to be specified when [ADR-004](./ADR-004-worker-pool-externalized-state.md)
  and [ADR-012](./ADR-012-streaming-return-path.md) are implemented, so the on-prem binding is
  real and not just a table entry.
- **Accepted downside:** a small amount of indirection and doc-maintenance overhead, in exchange
  for an architecture that isn't hostage to one cloud. For a platform meant to outlive any single
  codebase (the whole premise of this repo), that trade is clearly worth it.
