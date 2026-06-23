# ADR-011 — ALB + orchestrator as the gateway, not AWS API Gateway

- **Status:** Proposed
- **Date:** 2026-06-23
- **Deciders:** (architecture review)

## Context

Phase 1 needs an edge in front of the stateless orchestrator: TLS termination, WAF, auth
(Cognito/JWT), load balancing across the 2–N orchestrator Fargate tasks, and health checks. AWS
offers two obvious front doors — Application Load Balancer (ALB) and API Gateway. We need to pick
one and be clear about what "the gateway" even refers to here, because the agent turn traffic is
long-lived streaming (SSE), not short request/response.

## Decision

The "gateway" role is played by **ALB (network edge) + the Orchestrator API (application edge)
together** — we do **not** put AWS API Gateway in front of the orchestrator in Phase 1.

- **ALB** does TLS termination, WAF, Cognito/JWT validation at the edge, load balancing across
  orchestrator tasks (target group → Fargate tasks), and health checks.
- **Orchestrator API** does the application-layer gateway work: routing, per-channel request
  normalization into canonical turns, dispatch decisions, and holding the SSE connection open to
  the client while a worker processes the turn.

Worker tasks sit behind neither — they are SQS consumers with no inbound port
([ADR-004](./ADR-004-worker-pool-externalized-state.md)).

## Alternatives considered

- **AWS API Gateway in front of the orchestrator:** rejected for Phase 1. (1) Agent turns stream
  for a long time over SSE; API Gateway's timeouts and streaming constraints fight long-lived
  connections, whereas ALB handles them cleanly. (2) Its value-add — per-request billing, API
  keys, usage plans, third-party developer management — solves a problem we don't have: this is
  our own thin frontend calling our own orchestrator, not a public API for external developers.
  (3) ALB is the container-native partner for ECS Fargate (target group binds directly to tasks).
- **CloudFront + ALB:** not rejected, just out of scope for Phase 1 single-region — add a CDN
  layer later if static-asset delivery or global edge caching becomes a need. It doesn't change
  the gateway decision.
- **ALB + orchestrator-as-application-gateway (chosen):** simplest thing that does TLS/WAF/auth/LB
  for a streaming, first-party, single-region workload.

## Consequences

- **Easier:** long-lived SSE just works; one fewer managed service to configure and pay
  per-request for; ALB ↔ Fargate is the well-trodden path.
- **Harder:** if we later expose a *public, third-party* programmatic API (the Webhook/API
  channel listed in [Phase 3](../phases/3/README.md)), API Gateway's quota/key/throttle features
  become genuinely useful — at that point we add it *on that specific path*, not by re-fronting
  the whole orchestrator. This ADR should be revisited (not reversed) when that need is real.
- **Follow-up:** Phase 3 should decide whether the external Webhook/API channel gets its own API
  Gateway in front, separate from the human-facing ALB path.
- **Accepted downside:** auth/throttling for any future external API is not "free from the edge"
  the way API Gateway would give it — we take that on deliberately rather than adopt API Gateway's
  whole model prematurely.
