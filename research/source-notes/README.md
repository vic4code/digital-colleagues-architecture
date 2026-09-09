# Proactive agent research — source and evidence index

Start with the [integrated visual report](../show-me-proactive-lifecycle.html#research-summary) or the [compact research summary](../proactive-research-summary.md).

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

- [Implementation synthesis](../proactive-research-summary.md): problem → approach → technology → representative implementation.
- [Design choices](design-philosophy.md): source-based interpretation, not quoted author intent or exclusive categories.
- [Autonomous task selection](autonomous-task-selection.json): who chooses the next task, separately from what wakes execution.
- [Observation to action](observation-to-action.json): source checks, change detection, agent judgment and delivery.
- [Loop and graph](loop-graph-implementation.md): repetition, continuation and workflow dependencies; graph state alone is not an external event subscription.
- [Comparison map](proactive-comparison-map.json) and [terminology](terminology.json).

## Diagrams, source excerpts and scenarios

- [Source excerpt index](code-excerpt-index.json), [flow index](flow-diagram-index.json), and [sequence index](sequence-diagram-index.json) retain their original audited scope; the HTML also contains later additions.
- [Sequence node guide](sequence-node-guide.json): bilingual participant responsibilities; the HTML also explains Hermes monitor flowchart blocks.
- [Mechanism scenarios](mechanism-scenarios.json): concrete work examples, not executed connector tests. Outlook access and event delivery require configuration.
- Standalone diagrams: [flows](../mechanism-flows/) and [sequences](../sequence-diagrams/).

## Existing phases and proposed architecture integration

- [Phase and component mapping](phase-0.5-mapping.md): connects implementation proposals to existing project requirements.
- The report shows the [complete original architecture](../../phases/0.5/reference-architecture.svg) first, then [proactive functions on the same layout](../proactive-functions-on-original.svg), with [11 component/function mappings](proactive-functions-on-original.json).
- Original source SVGs remain unchanged. Earlier simplified exports and annotation coordinates are retained as historical research assets; the report's current architecture section uses the original-first presentation.
- [Colleague research notes/prototype](colleague-prototype.md): supporting research, not a peer framework or the authority for native framework phases.

## Validation and evidence boundaries

- [Verification plan](proactive-verification-plan.json): proposed acceptance cases, illustrative traces and component ownership; not executed runtime or connector E2E.
- [Pinned source ledger](report-source-ledger.json) and [broader collection](source-ledger.json).
- [Consolidation validation](consolidation-validation.json): overview layout, links and source-preservation checks.
- [Latest static validation](prepush-validation.json): local links, preservation of 42 source excerpts, and 153 pinned file/line references in the main report.
- [Presentation interaction checks](presentation-interaction-validation.json), [layout checks](taste-redesign-validation.json), and [presentation audit](taste-redesign-audit.md) record their respective tested revisions and scopes.
- [Isolated Hermes probes](source-probe-results.json) and [observation probes](observation-probes.json): bounded function behavior only.

Sources were inspected September 8–9, 2026. Code facts, documented product behavior, integration proposals and illustrative scenarios are distinct evidence levels. Full upstream suites and live product E2E were not run. Earlier validation files are historical checks, not proof that a newer report revision was tested.
