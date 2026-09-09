# Framework implementation research

[Read the rewritten bilingual report](../show-me-proactive-lifecycle.html).

The report is organized by actual codebase. It does not impose three proactivity types, a universal lifecycle or our own capability phases on the frameworks. Each panel traces a concrete execution path, native function calls, conditions, persisted state, and the producer of subsequent work. Additional scheduling or background review paths are explained separately.

## Pinned implementation audits

- [OpenClaw](openclaw.md): timer → cron heartbeat dispatch → runtime admission → inbound agent turn. Supported cron pacing, Workshop experience review, dreaming and goal storage are separate reviewed paths.
- [Hermes](hermes.md): post-turn goal evaluation and FIFO continuation; separate recurring loops and guarded background review.
- [OpenBot](openbot.md): CopilotKit/OpenBot scheduled routines, durable offers, leases, current access and lock-renewal heartbeat.
- [Grok Bot reconstruction](grok-reconstructed.md): unofficial reconstructed completion/event wakeups, automation consumption and goal-action handling. The automatic goal-action producer remains unestablished.
- [Voyager](voyager.md): exploration reference with a concrete learn/curriculum/action/critic loop.

Sources were inspected September 8–9, 2026. These low-level audits retain their factual corrections and test boundaries; they are not marketing descriptions or proof of deployed behavior.

## Evidence

- [Report source ledger](report-source-ledger.json): pinned code links used by the current report.
- [Broader research ledger](source-ledger.json): earlier collected references, not all used in the current report.
- [Link validation](source-link-validation.json): file existence and line bounds only.
- [Hermes isolated probes](source-probe-results.json): narrow function behavior, not runtime E2E.
- [Colleague notes/prototype](colleague-prototype.md): supporting research and validation code, not a peer framework or authority for native framework phases.

Prior bounded checks and their scope are documented in the audits. Full upstream suites and live product E2E were not run. Negative findings apply only to inspected paths. Source code in an unofficial reconstruction does not prove original shipped-product equivalence.

## Existing phases and proposed embedding

The report now follows four sections: native framework implementations, general comparison, existing scenario phases, and architecture integration. The phase definitions are cited from the supplied scenario/wake-cycle records, not invented as framework categories.

[Component mapping and local source evidence](phase-0.5-mapping.md) · [Final SVG](../proactive-phase-0.5-components.svg).

Upstream code facts, phase requirements and integration proposals are explicitly different evidence levels. The local adapter was read at a clean pinned snapshot; no deployment or new runtime feature was executed.
## Existing phases and proposed embedding

The report now follows four sections: native framework implementations, general comparison, existing scenario phases, and architecture integration. The phase definitions are cited from the supplied scenario/wake-cycle records, not invented as framework categories.

[Component mapping and local source evidence](phase-0.5-mapping.md) · [Final SVG](../proactive-phase-0.5-components.svg).

Upstream code facts, phase requirements and integration proposals are explicitly different evidence levels. The local adapter was read at a clean pinned snapshot; no deployment or new runtime feature was executed.

## Official descriptions and research

[Official claim-to-code review](official-claims.md) preserves project feature names, documentation, declared research and the implementation evidence. The report now presents official concepts before low-level calls.

- [Multi-mechanism inventory](mechanism-inventory.md): expanded 2026-09-09 audit, including HTTP ingress, handoffs, result relays, Kanban readiness and transport versus trigger distinctions. Supersedes earlier representative-flow-only coverage.


- [Per-mechanism diagram index](flow-diagram-index.json): 28 source-grounded diagrams, five framework highlights, separate branch/evidence-limit labels, and responsive mobile flows. SVG exports are in `research/mechanism-flows/`.

- [Design philosophy](design-philosophy.md): implementation-grounded differences and adoption implications; research synthesis, not exclusive categories or quoted author intent.
- [Terminology](terminology.json) and [presentation audit](design-audit.md): plain-language titles retain native names and evidence links.

- [Key source excerpts](code-excerpt-index.json): 37 verbatim excerpts for 28 mechanisms. Each records exact commit, source range and the diagram steps it supports. Click the bold orange diagram nodes to open the corresponding code panel.

- [Sequence diagram index](sequence-diagram-index.json): 28 diagrams with logical participants, ordered calls/results, explicit alternative branches and links to existing source excerpts. Sequence view is the default; Flowchart remains available. SVG exports are in `research/sequence-diagrams/`.

- [Colleague scenarios](mechanism-scenarios.json): 39 concrete bilingual work scenarios with required example tools, with technical implementation explained separately below each story. Illustrations, not executed tests; Outlook examples assume configured access and instructions.
- [Proactive comparison map](proactive-comparison-map.json): native mechanisms compared by proactive trigger and continuation questions; visual in `research/proactive-framework-comparison.svg`.

## Official coding agents and loop / graph audit — 2026-09-09

- [Codex and Claude Code](official-coding-agents.json): 10 additional paths; each labels public code, documented product behavior, and custom event wiring. The original source-traced mechanisms remain available.
- [Loop and graph](loop-graph-implementation.md): OpenClaw Task Flow / optional Lobster, Hermes loop / goal and Kanban dependencies. Workflow state does not itself subscribe to external events.
- Codex Automations documentation redirects to shared Scheduled tasks documentation. Supported ChatGPT web/mobile app events are not attributed to Codex CLI or desktop.
- New sequence exports are `../sequence-diagrams/cx-0.svg` through `cx-3.svg`, and `cc-0.svg` through `cc-5.svg`. These logical sequences explicitly label documentation-only internals. Existing code-excerpt and sequence indexes retain their original source-audited scope.

## Observation to action — 2026-09-09

[Observation audit](observation-to-action.json) adds Hermes Cron monitor mode, a four-product comparison of the same inbox responsibility, and examples mapped to the existing phases/components. [Original-function probe](observation-probes.json) verifies exact-hash sensitivity to timestamps and whitespace. Total visible mechanism paths: 39 (29 original-family paths + 10 official coding-agent paths). No live mailbox access or outbound messages were performed.

## Reading and verification design

- [Scenario copy](mechanism-scenarios.json): each explains the situation, trigger, configured tool and result. Named connectors are illustrative setup requirements, not new built-in capability claims.
- [Sequence node guide](sequence-node-guide.json): 140 bilingual role explanations for 38 sequence diagrams; the report separately explains Hermes monitor flowchart blocks. Click lane headers or open the role guide.
- [Architecture overview](../proactive-architecture-overview.svg): existing architecture first, with links to seven proposed integration responsibilities in the report. Full original source mapping remains in an expandable section.
- [Verification plan](proactive-verification-plan.json): nine proposed acceptance cases, four illustrative outcome traces and phase/component ownership. These are test designs, not executed connector or runtime tests. The report distinguishes them from the existing isolated source-function probes.
- [Presentation audit](taste-redesign-audit.md): layout and browser-interaction checks.

## Current architecture presentation
The report uses the original Phase 0.5 diagram with a toggleable proactive annotation layer. [Annotation positions and responsibilities](original-architecture-proactive-points.json). This supersedes the separate simplified overview for presentation; all original architecture source SVGs are unchanged.

Current presentation: original architecture first, followed by [proactive functions on the original layout](../proactive-functions-on-original.svg). The second diagram has 11 explicit function/component mappings; it replaces the toggle-only presentation.

## Autonomous work selection
[Mode-by-mode comparison](autonomous-task-selection.json) distinguishes Voyager model-generated curriculum, Claude Code built-in maintenance, configured heartbeat/loop responsibilities and existing-goal continuation. Wake-up timing is a separate design question.
