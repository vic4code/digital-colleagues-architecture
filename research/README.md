# Research

Scratchpad for exploring questions before they become ADRs. Low formality on purpose
— the point is to lower the activation energy for writing things down.

When a research note matures into a decision, distill it into an ADR and either
delete the note or link to the ADR from the top of it.

Notes:

- [**Agent product landscape — build-vs-buy**](./agent-product-landscape.md) —
  layer model, per-product comparison + trade-offs + architecture components,
  coverage matrix ([svg](./agent-product-matrix.svg)), and direct answers to the
  build-vs-buy meeting's open questions (maintainer-first, head-to-head validation).

Planned topics:

- Memory architectures (per-agent vs per-tenant vs shared)
- Multi-tenant isolation patterns
- Codex vs Claude vs open models — capability and cost comparison
- [Historical channel-selection research](./channel-selection.md) — evidence and
  alternatives that informed, and were superseded by, ADR-019's single-interface model
- Stateful vs stateless colleagues — when to use which
- `/goal` as autonomy boundary for long-running agents
