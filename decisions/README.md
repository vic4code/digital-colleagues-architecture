# Architecture Decision Records

Each decision lives in its own file: `ADR-NNN-short-slug.md`.

| # | Title | Status |
|---|---|---|
| 000 | [Template](./ADR-000-template.md) | — |
| 001 | [File-based state in Phase 0](./ADR-001-file-based-state-in-phase0.md) | Accepted |
| 007 | [Symphony-inspired orchestration model for Phase 1+](./ADR-007-symphony-inspired-orchestration.md) | Proposed |
| 008 | [VDI is a presentation-only channel](./ADR-008-vdi-presentation-only-channel.md) | Proposed |
| 009 | [Source connectors distinct from channel adapters](./ADR-009-source-connectors-distinct-from-channels.md) | Proposed |

## Conventions

- One decision per file. Decisions don't get rewritten — they get superseded by a new ADR.
- Status: `Proposed` → `Accepted` → `Superseded by ADR-NNN` (or `Rejected`, `Deprecated`)
- Keep under 1 page. If it doesn't fit, the decision isn't sharp enough yet.
- Link liberally: `[ADR-007](./ADR-007-...)` from any markdown in the repo.
