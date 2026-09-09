# Research

Scratchpad for exploring questions before they become ADRs. Low formality on purpose
— the point is to lower the activation energy for writing things down.

When a research note matures into a decision, distill it into an ADR and either
delete the note or link to the ADR from the top of it.

Planned topics:

- Memory architectures (per-agent vs per-tenant vs shared)
- Multi-tenant isolation patterns
- Codex vs Claude vs open models — capability and cost comparison
- [Historical channel-selection research](./channel-selection.md) — evidence and
  alternatives that informed, and were superseded by, ADR-019's single-interface model
- Stateful vs stateless colleagues — when to use which
- `/goal` as autonomy boundary for long-running agents

## Proactive agent implementation study

- [Compact research summary](./proactive-research-summary.md) — problem → approach → technology → implementation evidence.

- [Interactive lifecycle report](./show-me-proactive-lifecycle.html) — framework mechanisms, autonomous task selection, source excerpts, phase planning, original architecture integration, and verification. English with Traditional Chinese explanations; open the HTML locally after cloning.
- [Source audit and evidence](./source-notes/README.md) — pinned implementations and validation records.
