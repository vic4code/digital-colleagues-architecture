# digital-colleagues-architecture

Architecture exploration for the digital colleague platform — independent from any
single code repository. This repo tracks how the system evolves from a single-machine
prototype to an enterprise-grade, multi-channel platform serving 1000+ agents.

## Why a separate repo

The prototype (`prjt-digital-staff`) is one snapshot in a longer story. Code repos
come and go as we rewrite for scale; the **thinking** — why we chose what we chose,
what we considered, where we're heading — needs to outlive any single codebase.

This repo is the place to:

- Study how the architecture should evolve (research over implementation)
- Record decisions as ADRs so future-me knows the context
- Maintain canonical architecture diagrams that survive code rewrites
- Plan migrations between phases

## Phases

| # | Phase | Status | Goal |
|---|---|---|---|
| 0 | [Prototype](./10-phase0-prototype/) | ✅ Running | Prove the idea on a single machine |
| 1 | [Legal MVP](./20-phase1-legal-mvp/) | 🚧 In design | First production scenario: contract review |
| 2 | [Generalized Platform](./30-phase2-generalized/) | ⏳ Planned | Multi-scenario, multi-department |
| 3 | [Enterprise & Multi-Channel](./40-phase3-enterprise/) | ⏳ Planned | 1000+ agents, Slack/Teams/Linear/Email, HA |
| 4 | [Terraform / IaC](./50-phase4-terraform/) | ⏳ Planned | Production-grade IaC, multi-env, DR |

Phases are cumulative — Phase 2 builds on Phase 1, not replaces it. Each phase has
its own README explaining the goal, the architecture, and the migration from the
previous phase.

## Reading order

1. **Start here:** [`00-overview/`](./00-overview/) — what we're building, glossary, audiences
2. **See where we are:** [`10-phase0-prototype/`](./10-phase0-prototype/) — current running system
3. **See where we're going:** [`20-phase1-legal-mvp/`](./20-phase1-legal-mvp/) onwards
4. **Understand the why:** [`decisions/`](./decisions/) — Architecture Decision Records
5. **Cross-phase concerns:** [`flows/`](./flows/) (end-to-end workflows), [`research/`](./research/) (scratchpad)

## Conventions

- All diagrams are **SVG** (renders inline on GitHub, diffable in PRs, hand-editable in Penpot/Boxy SVG)
- One file per concern. Phase READMEs link to relevant ADRs and diagrams
- Number folders with gaps (00, 10, 20…) so we can insert later phases without renaming
- See [`STYLE.md`](./STYLE.md) for diagram conventions and writing guidelines

## Status (as of repo creation)

- Phase 0 prototype is in production for legal contract review review (manual)
- Phase 1 is being designed; target ship in ~2 months
- Phases 2–4 are sketched directionally; details fill in as Phase 1 lands
