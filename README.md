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
| 0 | [Prototype](./phases/0/) | ✅ Running | Prove the idea on a single machine |
| 1 | [Legal MVP](./phases/1/) | 🚧 In design | First production scenario: contract review |
| 2 | [Generalized Platform](./phases/2/) | ⏳ Planned | Multi-scenario, multi-department |
| 3 | [Enterprise & Multi-Channel](./phases/3/) | ⏳ Planned | 1000+ agents, Slack/Teams/Linear/Email, HA |
| 4 | [Terraform / IaC](./phases/4/) | ⏳ Planned | Production-grade IaC, multi-env, DR |

Phases are cumulative — Phase 2 builds on Phase 1, not replaces it. Each phase has
its own README explaining the goal, the architecture, and the migration from the
previous phase.

## Reading order

1. **Start here:** [`overview/worldview.md`](./overview/worldview.md) — the core concept, what's
   genuinely unresolved, and the risks, before any architecture diagram
2. **Then:** [`overview/README.md`](./overview/README.md) — what we're building, glossary, audiences
3. **See where we are:** [`phases/0/`](./phases/0/) — current running system (prototype)
4. **See where we're going:** [`phases/1/`](./phases/1/) onwards (legal MVP → enterprise)
5. **Understand the why:** [`decisions/`](./decisions/) — Architecture Decision Records
6. **Cross-phase concerns:** [`flows/`](./flows/) (end-to-end workflows), [`research/`](./research/) (scratchpad)

## Conventions

- All diagrams are **SVG** (renders inline on GitHub, diffable in PRs, hand-editable in Penpot/Boxy SVG)
- One file per concern. Phase READMEs link to relevant ADRs and diagrams
- Phases live under `phases/`, numbered `0/1/2/…` — insertions are rare; if needed, rename together
- See [`STYLE.md`](./STYLE.md) for diagram conventions and writing guidelines

## Status (as of repo creation)

- Phase 0 prototype is in production for legal contract review review (manual)
- Phase 1 is being designed; target ship in ~2 months
- Phases 2–4 are sketched directionally; details fill in as Phase 1 lands
