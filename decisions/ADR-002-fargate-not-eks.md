# ADR-002 — Fargate for Phase 1, not EKS / Kubernetes

- **Status:** Proposed
- **Date:** 2026-06-23
- **Deciders:** (architecture review)

## Context

Phase 1 needs to ship a production-grade legal MVP on AWS within ~2 months, with no SPOF on the
worker layer and the ability to autoscale. The original prototype instinct was "one container per
colleague, lifecycle-managed by Kubernetes." We need to decide the compute substrate before
writing any infrastructure, because it shapes everything downstream (networking, scaling,
operational burden, who can run it).

## Decision

We will run the stateless orchestrator API and the worker pool on **ECS Fargate**. No Kubernetes
in Phase 1. Colleagues are data (a row + persona + memory), executed by interchangeable Fargate
worker tasks pulling turns off SQS — not one long-lived container per colleague. EKS is deferred
to [Phase 3](../phases/3/README.md) and reserved *only* for the small subset of genuinely
stateful, long-running colleagues (on-call monitor, meeting copilot), if and when they exist.

## Alternatives considered

- **EKS / Kubernetes from day one (one Deployment or StatefulSet per colleague):** rejected for
  Phase 1. It encodes the wrong mental model — "colleague = deployed service" — which we
  explicitly reject ([overview](../overview/README.md) Non-negotiable #3). It also adds a control
  plane, node management, and a body of operational knowledge (upgrades, CNI, RBAC, autoscaler
  tuning) that one team cannot carry alongside shipping a product in two months. Premature for
  ~20 concurrent turns.
- **EC2 + a process manager (systemd / supervisor):** rejected. Cheaper per-hour but reintroduces
  host management, patching, and bespoke autoscaling — solving infrastructure problems Fargate
  already solves, to save money we aren't spending at this scale.
- **Lambda for the worker turns:** rejected. Agent turns can be long-running and stream tool
  calls; the 15-minute ceiling and cold-start/streaming friction make Lambda a poor fit for the
  worker. May revisit for short, bursty channel-adapter ingress later.
- **Fargate (chosen):** stateless, autoscales on queue depth, no host to manage, IAM-native, and
  it makes "the worker is disposable and identity lives elsewhere" the path of least resistance.

## Consequences

- **Easier:** no cluster to operate; scaling is a service-autoscaling policy on SQS depth; the
  worker-is-disposable model falls out naturally; one engineer can run it.
- **Harder:** less control over scheduling/bin-packing than k8s; per-task cost is higher than
  dense EC2 packing at large scale (irrelevant at Phase 1 volume, revisit in Phase 3).
- **Follow-up:** [ADR-004](./ADR-004-worker-pool-externalized-state.md) defines the worker-pool +
  externalized-state model this assumes. Phase 3 must define the Fargate-vs-EKS split for the
  stateful-colleague subset rather than moving everything to EKS.
- **Accepted downside:** if a future need forces Kubernetes, the orchestrator/worker containers
  port over (they're just containers), but the surrounding IaC (ECS services, task defs) is
  rewritten. We accept that re-platforming cost as cheaper than carrying k8s now.
