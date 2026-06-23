# Architecture Decision Records

Each decision lives in its own file: `ADR-NNN-short-slug.md`.

| # | Title | Status |
|---|---|---|
| 000 | [Template](./ADR-000-template.md) | — |
| 001 | [File-based state in Phase 0](./ADR-001-file-based-state-in-phase0.md) | Accepted |
| 002 | [Fargate for Phase 1, not EKS / Kubernetes](./ADR-002-fargate-not-eks.md) | Proposed |
| 003 | [Linear as control plane, not system of record](./ADR-003-linear-as-control-plane.md) | Proposed |
| 004 | [Worker pool with externalized state](./ADR-004-worker-pool-externalized-state.md) | Proposed |
| 005 | [Human-in-the-loop gates for contract output](./ADR-005-human-in-the-loop-gates.md) | Proposed |
| 006 | [Audit log storage and retention](./ADR-006-audit-log-retention.md) | Proposed |
| 007 | [Symphony-inspired orchestration model for Phase 1+](./ADR-007-symphony-inspired-orchestration.md) | Proposed |
| 008 | [VDI is a presentation-only channel](./ADR-008-vdi-presentation-only-channel.md) | Proposed |
| 009 | [Source connectors distinct from channel adapters](./ADR-009-source-connectors-distinct-from-channels.md) | Proposed |
| 010 | [Email dispatch addresses the colleague, not a shared inbox](./ADR-010-email-per-colleague-identity.md) | Proposed |
| 011 | [ALB + orchestrator as the gateway, not AWS API Gateway](./ADR-011-alb-not-api-gateway.md) | Proposed |
| 012 | [Worker → orchestrator streaming return path](./ADR-012-streaming-return-path.md) | Proposed |

## Conventions

- One decision per file. Decisions don't get rewritten — they get superseded by a new ADR.
- Status: `Proposed` → `Accepted` → `Superseded by ADR-NNN` (or `Rejected`, `Deprecated`)
- Keep under 1 page. If it doesn't fit, the decision isn't sharp enough yet.
- Link liberally: `[ADR-007](./ADR-007-...)` from any markdown in the repo.
