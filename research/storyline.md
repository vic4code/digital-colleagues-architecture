# Initiative research — Story line

Updated: 2026-09-15. Single narrative: **Time / Event → Framework mechanisms → Component integration → Phase goals → Cathay validation**. English technical terms first; Chinese explains meaning. Tables establish relationships before expandable source details.

## 01 · Time / Event

Human and Agent use the same report/meeting example. Only two contrasting examples: Time (13:30 scheduled lookup) and Event (report arrival). Time uses a clock and timeline; Event uses a report and Webhook delivery diagram with no timestamps or schedule. Human thought, Agent input and outcome change together. Remove attention/recall/thought substeps.

Chapter 1 poses the question whether these examples cover framework implementations. Chapter 2 derives its conclusion from observed mechanisms and activation conditions: the reviewed implementation paths do not require a third Trigger category. State change, Process completion and Stream data are Event. Polling detects changes; while is control flow. This classification does not claim every internal condition uses an event object or bus.

Proactivity still means generating a worthwhile, unassigned task. Time / Event supply an execution opportunity; they do not prove task discovery.

## 02 · Framework × Trigger

One visible matrix: Framework | Observed mechanism | What starts the next run? | Classification. Observed evidence precedes classification; the cross-framework Time / Event finding appears after the matrix, not in its premise. Click a framework for its representative Flow / Sequence; the homepage shows only that path and its source. Explore all mechanisms opens the selected framework in the mechanism atlas, which retains the inventory, interfaces and evidence limits.

- OpenClaw: managed heartbeat job → Scheduler → Wake admission → Agent turn. Event hooks and watchers enter compatible dispatch paths; next_check is a bounded pacing proposal.
- Hermes: Cron monitor → source hash → unchanged Skip / changed Agent. Baseline saved before execution is observation state, not successful processing.
- Claude Code: goal evaluator after turn → Continue / Stop; /loop and Channels provide other Time / Event entries.
- Codex: active goal + session idle → state lock → start_turn_if_idle. This continues an assigned goal.
- Grok Build: public creation/dispatch interface unverified; show evidence gap, do not invent execution Sequence.
- Voyager: learn while → curriculum → rollout/critic → progress/skills → next task. Completion is a useful Event abstraction; code directly continues without a timer or event bus.
- OpenBot: due routine → occurrence queue → claim/lease → worker. Lease heartbeat is ownership maintenance, not an Agent wake.

Sequence diagrams are source-path summaries, not runtime traces. Fixed revisions and official-document dates remain visible; full inventory retains interface/source links.

## 03 · Mechanism → Implementation

Select Scheduled heartbeat, Change-gated monitor, Event-triggered run, Goal continuation, Adaptive pacing or Task proposal. Each selected mechanism exposes a concrete implementation plan: Change location | Add code/control flow | Add state/contract | Next output. Reference links identify the upstream mechanism being adapted.

The original architecture keeps its coordinates. After replaces generic labels inside the original Components with numbered Code / Contract additions. The selected step explains its action in plain language; exact Code, State and Output expand beside the diagram. Action-first route buttons and Previous/Next controls keep the selected component in sync. One compact mechanism selector and an action sequence lead into a focused crop of the original architecture. Full map restores the entire original without moving components. The sidebar compares the existing responsibility with the added behavior; exact contracts expand on demand. Before is a separate existing-design view. Default After shows Change-gated monitor. No generic Component responsibility table competes with the implementation plan.

Function names such as admitWake(), compareSnapshot() and validateCompletion() are proposed host contracts, not upstream API claims. Persistent observation state and successful processing state stay distinct. P3 uses an ordinary discovery turn with Role, current evidence and proposal history. A scheduled trigger can start that turn; no dedicated curiosity API or third Trigger is required. Voyager provides a native curriculum reference, not a turnkey enterprise transplant.

## 04 · Phase goals

| Phase | Human input | Agent output | Exit criteria |
|---|---|---|---|
| P1 Scheduled | Task + Schedule | Fixed output / Skip | On time, no duplicates, explain skips |
| P2 Goal-driven | Goal + Acceptance criteria | Validated result | Complete only with evidence; otherwise Continue / Blocked / Exhausted |
| P3 Self-initiated | Vision + Role + Permissions | New proposal | No itemized assignment; grounded and relevant; Human review |

Two compact matrices stay visible: Framework × Phase (reusable building blocks, not full Phase certification) and Capability × Phase (Trigger & Admission; Context & State; Agent Runtime; Validation & Review). The Trigger taxonomy does not change across phases. Phase goals visualize who authors the work. P3 cells describe configurable discovery paths and required host additions, rather than treating lack of a dedicated inferred-follow-up feature as inability. Historical OpenClaw commitments extracted future conversation check-ins; removal did not absorb that extractor into heartbeat, and reviewed removal evidence does not state the product decision rationale. Custom heartbeat discovery is a separate composition path.

## 05 · Cathay use cases / Validation

Each role uses concrete fictional artifacts (notice/contract, dependency dates, SOP/template, or diff/ADR), a grounded task proposal and an explicit deliverable. A visible three-row acceptance sheet compares relevant evidence, irrelevant evidence and already-handled state. Each row names its setup, expected output and failure. Selecting a row updates the source facts/history and expected Proposal/Skip outcome above. These are pre-authored demonstrations, not live model evaluations. P1/P2/P3 outputs and checks expand below it.

Observability separates Proposal, Skip and Failure. Metrics cover useful proposals, missed opportunities and duplicates; engineering reliability, metrics, detailed denominators and raw Trace are grouped in one collapsed engineering validation section, after the concrete business acceptance sheet. These are hypothetical cases and pre-authored fixtures, not validated Cathay deployment results.

## Presentation change record

2026-09-15 supersedes earlier attention/recall substeps, four-layer main taxonomy, default framework inventory and wake-story vignette. The research evidence remains; the homepage now uses one trigger classification and explicit mechanism/component/phase mappings.


## Reading scope clarification

The homepage Flow is a representative implementation path, not a ranking of the framework’s mechanisms or a complete execution graph. Flow and Sequence depict that same path. Framework-wide inventory is maintained in the mechanism atlas; Grok Build is not linked to the unrelated Grok Bot reconstruction.

## P3 judgment correction · 2026-09-15

Previous homepage cells used “inferred commitments retired” or “native root-task discovery unverified” to stand in for P3 capability. That conflated a narrow persistent conversation-follow-up feature with broader role-based task discovery. Revised judgment: documented configurable agent turns can compose task discovery; native Voyager curriculum already selects tasks from environment context. Composition feasibility is not an end-to-end enterprise acceptance result. Retain historical research under its original, narrower criterion.

## Readability pass · 2026-09-15

Chapter 3 presents mechanism purpose → action sequence → original component location → expandable code/state. Chapter 4 adds a historical OpenClaw conversation → extraction/storage → due heartbeat → check-in/dismiss diagram, with tool restrictions and retirement evidence kept separate. Chapter 5 provides concrete source fixtures, proposal deliverables, positive and negative acceptance criteria, illustrative metric denominators, and visible failure/recovery checks.

## Focused reading pass · 2026-09-15

Reduce simultaneous choices and duplicate explanations. Architecture opens on the original core components in Focus mode, with Before/After deltas and full-map access. Scenario acceptance presents Input → Expected output → Pass/Fail sheet on one reading path; engineering observability and cost are secondary detail.

## Presentation edition · 2026-09-16

13 main slides and two appendices, designed for a 15–18-minute sharing session. The cover names the subject: digital colleague proactivity. Two numbered daily-life examples introduce time and events. A framework-first table labels implementation paths before the two-trigger synthesis. The three phases come before architecture: assigned execution, goal-driven planning, self-initiated task discovery.

Four architecture slides preserve original component positions and include the Tools / external services layer: Existing → Time entry → Event entry → shared Task discovery. They explicitly distinguish existing entry points from proposed orchestration and task policies. Standalone recovery and P3-recipe pages are removed; details remain in notes.

A generated editorial triptych illustrates the fictional Cathay compliance case: outsourcing notice → cloud maintenance contract → proposal to review the security attachment. The next slide observes propose / skip / verify and replay behavior. A worked numerical example computes precision (8/10), recall (8/12 independent labeled opportunities), and pre-host duplicate rate (2/12 model candidates). All numbers are hypothetical. The conclusion links trigger, phase and business validation. Appendices contain a readable interface table and the original full architecture; historical commitments is only a note, with no unsupported Orbit migration claim.
