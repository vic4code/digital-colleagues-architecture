# Research

Scratchpad for exploring questions before they become ADRs. Low formality on purpose
— the point is to lower the activation energy for writing things down.

When a research note matures into a decision, distill it into an ADR and either
delete the note or link to the ADR from the top of it.

Notes:

- [**數位同事 Overview:能做什麼、缺什麼、我們的邊界**](./overview.zh-TW.md)
  (zh-TW) — **從這裡開始。** 一頁看懂 Codex App 能做什麼、缺什麼、我們的護城河與
  產品邊界,含完整能力比較表與[能力雷達圖](./capability-radar.zh-TW.svg),
  以及兩個已查證的技術現實（版本漂移、工具授權產品化落差）。
- [**Agent product landscape — build-vs-buy**](./agent-product-landscape.md) —
  layer model, per-product comparison + trade-offs + architecture components,
  coverage matrix ([svg](./agent-product-matrix.svg)), and direct answers to the
  build-vs-buy meeting's open questions (maintainer-first, head-to-head validation).
- [**數位同事技術方向與後續落地建議報告**](./digital-colleague-direction.zh-TW.md)
  (zh-TW) — the management-facing recommendation report: executive summary,
  answers to the five meeting issues, maintenance-mode → architecture mapping,
  per-pilot recommendations, target architecture, the three gaps to fill, and the
  five decisions to take to leadership.

Planned topics:

- Memory architectures (per-agent vs per-tenant vs shared)
- Multi-tenant isolation patterns
- Codex vs Claude vs open models — capability and cost comparison
- [Historical channel-selection research](./channel-selection.md) — evidence and
  alternatives that informed, and were superseded by, ADR-019's single-interface model
- Stateful vs stateless colleagues — when to use which
- `/goal` as autonomy boundary for long-running agents
