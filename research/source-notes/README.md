# Proactive agent research — source and evidence index

Start with the [integrated visual report](../show-me-proactive-lifecycle.html#research-summary) or the [complete README edition](../README.md).

The report follows one story: an Outlook responsibility → four practical questions → native framework mechanisms → comparison → autonomous task choice → existing phases → original architecture integration → verification. Technical synthesis and design choices are expandable references within the comparison chapter. These are comparison questions, not exclusive framework categories or invented maturity phases.

## Framework implementation evidence

- [OpenClaw](openclaw.md): scheduled and event-driven execution, Heartbeat, Automations, runtime admission and separate review paths.
- [Hermes](hermes.md): recurring work, monitor checks and assigned-goal continuation.
- [OpenBot](openbot.md): routines, persisted work ownership, Bot handoffs and result delivery.
- [Grok Bot reconstruction](grok-reconstructed.md): background events and completion-driven conversation continuation; an unofficial reconstruction.
- [Voyager](voyager.md): environment observations, automatic curriculum, execution and critic feedback.
- [Codex and Claude Code](official-coding-agents.json): public implementation evidence and documented product behavior are labeled separately.
- [Official concepts and claims](official-claims.md): native names and their supporting implementation evidence.
- [Multi-mechanism inventory](mechanism-inventory.md): scheduling, external events, handoffs and completion paths within each framework.

## Cross-framework findings

- [Remembered commitments and proactive outreach](initiative-outreach.md): seven frameworks checked for context-driven initiative, recipient selection and actual outbound paths.

- [Environment observation](environment-observation.md): who starts acquisition, how source data arrives, when the model runs; includes game ticks, streams, condition scripts and Monitor.

- [Implementation synthesis](../proactive-research-summary.md): problem → approach → technology → representative implementation.
- [Design choices](design-philosophy.md): source-based interpretation, not quoted author intent or exclusive categories.
- [Autonomous task selection](autonomous-task-selection.json): who chooses the next task, separately from what wakes execution.
- [Observation to action](observation-to-action.json): source checks, change detection, agent judgment and delivery.
- [Loop and graph](loop-graph-implementation.md): repetition, continuation and workflow dependencies; graph state alone is not an external event subscription.
- [Comparison map](proactive-comparison-map.json) and [terminology](terminology.json).

## Diagrams, source excerpts and scenarios

- [Comic scene scripts](proactive-comic-scenes.json) and [playback validation](proactive-comic-validation.json): 39 mechanism-specific animations inside their matching scenarios (156 bilingual frames), with manual steps, pause and implementation links.

- [Source excerpt index](code-excerpt-index.json), [flow index](flow-diagram-index.json), and [sequence index](sequence-diagram-index.json) retain their original audited scope; the HTML also contains later additions.
- [Sequence node guide](sequence-node-guide.json): bilingual participant responsibilities; the HTML also explains Hermes monitor flowchart blocks.
- [Mechanism scenarios](mechanism-scenarios.json): concrete work examples, not executed connector tests. Outlook access and event delivery require configuration.
- Standalone diagrams: [flows](../mechanism-flows/) and [sequences](../sequence-diagrams/).

## Existing phases and proposed architecture integration

- [Phase and component mapping](phase-0.5-mapping.md): connects implementation proposals to existing project requirements.
- The report shows the [complete original architecture](../../phases/0.5/reference-architecture.svg) first, then [proactive functions on the same layout](../proactive-functions-on-original.svg), with [11 component/function mappings](proactive-functions-on-original.json).
- Original source SVGs remain unchanged. Earlier simplified exports and annotation coordinates are retained as historical research assets; the report's current architecture section uses the original-first presentation.
- [Colleague research notes/prototype](colleague-prototype.md): supporting research, not a peer framework or the authority for native framework phases.

## Adoption recommendation

[Commitment follow-up design](commitment-followup-design.md): source-backed primitives, proposed missing business state and six acceptance scenarios.

[OpenClaw-first priorities and trade-offs](adoption-priorities.json) · [Report conclusion](../show-me-proactive-lifecycle.html#adoption-conclusion). P0–P4 describe proposed build order and acceptance gates within the existing architecture, not new phase definitions or deployed capabilities.

## Validation and evidence boundaries

- [Verification plan](proactive-verification-plan.json): proposed acceptance cases, illustrative traces and component ownership; not executed runtime or connector E2E.
- [Pinned source ledger](report-source-ledger.json) and [broader collection](source-ledger.json).
- [Consolidation validation](consolidation-validation.json): overview layout, links and source-preservation checks.
- [Latest static validation](prepush-validation.json): local links, preservation of 42 source excerpts, and 153 pinned file/line references in the main report.
- [Presentation interaction checks](presentation-interaction-validation.json), [layout checks](taste-redesign-validation.json), and [presentation audit](taste-redesign-audit.md) record their respective tested revisions and scopes.
- [Isolated Hermes probes](source-probe-results.json) and [observation probes](observation-probes.json): bounded function behavior only.

Sources were inspected September 8–9, 2026. Code facts, documented product behavior, integration proposals and illustrative scenarios are distinct evidence levels. Full upstream suites and live product E2E were not run. Earlier validation files are historical checks, not proof that a newer report revision was tested.

## Task prioritization / 工作優先排序

[Mechanisms, evidence and proposed policy](prioritization.md): hard rules versus LLM judgment; ICM, CURIOUS and MAGELLAN; eligibility, ordering, feedback and acceptance checks. Updated 2026-09-10.

## 2026-09-11：同事感與持續跟進

- [同事感實作研究](colleague-experience.md)：官方 Grok Bot 與非官方重建證據分層，整合既有架構、狀態、通知與驗收。
- [OpenClaw inferred commitments](openclaw-inferred-commitments.md)：確認曾有實作，補正目前 CLI／migration 狀態，避免把推測寫成退役理由。
- 本次只補查 OpenClaw 與 Grok Bot 相關來源；其他 framework 與先前 validation 保持其原有日期和驗證範圍。

[本次驗證紀錄](colleague-experience-validation.json)：新增來源連結、研究頁展開、桌機／手機溢出與 console 檢查；不是框架功能 E2E。
