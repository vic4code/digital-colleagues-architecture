# Initiative research — Story line

Updated: 2026-09-15. Single narrative: **Time / Event → Framework mechanisms → Component integration → Phase goals → Cathay validation**. English technical terms first; Chinese explains meaning. Tables establish relationships before expandable source details.

## 01 · Time / Event

Human and Agent use the same report/meeting example. Only two contrasting examples: Time (13:30 scheduled lookup) and Event (report arrival). Time uses a clock and timeline; Event uses a report and Webhook delivery diagram with no timestamps or schedule. Human thought, Agent input and outcome change together. Remove attention/recall/thought substeps.

Chapter 1 poses the question whether these examples cover framework implementations. Chapter 2 derives its conclusion from observed mechanisms and activation conditions: the reviewed implementation paths do not require a third Trigger category. State change, Process completion and Stream data are Event. Polling detects changes; while is control flow. This classification does not claim every internal condition uses an event object or bus.

Proactivity still means generating a worthwhile, unassigned task. Time / Event supply an execution opportunity; they do not prove task discovery.

## 02 · Framework × Trigger

One visible matrix: Framework | Observed mechanism | What starts the next run? | Classification. Observed evidence precedes classification; the cross-framework Time / Event finding appears after the matrix, not in its premise. Click a framework for its representative Flow / Sequence; expand Mechanisms & source for the full inventory and evidence limits.

- OpenClaw: managed heartbeat job → Scheduler → Wake admission → Agent turn. Event hooks and watchers enter compatible dispatch paths; next_check is a bounded pacing proposal.
- Hermes: Cron monitor → source hash → unchanged Skip / changed Agent. Baseline saved before execution is observation state, not successful processing.
- Claude Code: goal evaluator after turn → Continue / Stop; /loop and Channels provide other Time / Event entries.
- Codex: active goal + session idle → state lock → start_turn_if_idle. This continues an assigned goal.
- Grok Build: public creation/dispatch interface unverified; show evidence gap, do not invent execution Sequence.
- Voyager: learn while → curriculum → rollout/critic → progress/skills → next task. Completion is a useful Event abstraction; code directly continues without a timer or event bus.
- OpenBot: due routine → occurrence queue → claim/lease → worker. Lease heartbeat is ownership maintenance, not an Agent wake.

Sequence diagrams are source-path summaries, not runtime traces. Fixed revisions and official-document dates remain visible; full inventory retains interface/source links.

## 03 · Mechanism → Component

Reuse the original architecture coordinates. Before describes Existing design; After describes Proposed integration with separate hover/click text.

- Polling Scheduler: Schedule / next_due / occurrence / Monitor hash / Adaptive pacing.
- Event Ingress: Validation / Dedup / Event envelope / source cursor / completion routing.
- Runtime Controller: Durable dispatch / active goal / Checkpoint / Resume.
- Triage: Admission / Budget / Completion validator / Proposal gate.
- Workspace and State contracts: Role card / Permissions / Waiting / Completed / Proposal history.
- Codex app-server: Fixed output → Goal execution → Task proposal, by Phase.
- MCP and Interaction: Evidence verification / approved action / Proposal inbox / Accept / Reject / Snooze.

State schemas and loaders are proposed responsibilities, not extra existing services. Codex reference design and separately researched OpenClaw prototype must not be conflated. Remove the wake-story vignette; engineering wake-cycle remains available through its original source link.

## 04 · Phase goals

| Phase | Human input | Agent output | Exit criteria |
|---|---|---|---|
| P1 Scheduled | Task + Schedule | Fixed output / Skip | On time, no duplicates, explain skips |
| P2 Goal-driven | Goal + Acceptance criteria | Validated result | Complete only with evidence; otherwise Continue / Blocked / Exhausted |
| P3 Self-initiated | Vision + Role + Permissions | New proposal | No itemized assignment; grounded and relevant; Human review |

Two compact matrices stay visible: Framework × Phase (reusable building blocks, not full Phase certification) and Capability × Phase (Trigger & Admission; Context & State; Agent Runtime; Validation & Review). The Trigger taxonomy does not change across phases.

## 05 · Cathay use cases / Validation

Each role shows Event → Context → Proposal → Human review, plus a concrete Negative control. P1/P2/P3 outputs and checks expand below it.

Observability separates Proposal, Skip and Failure. Metrics cover useful proposals, missed opportunities and duplicates; detailed denominators and raw Trace expand. These are hypothetical cases and pre-authored fixtures, not validated Cathay deployment results.

## Presentation change record

2026-09-15 supersedes earlier attention/recall substeps, four-layer main taxonomy, default framework inventory and wake-story vignette. The research evidence remains; the homepage now uses one trigger classification and explicit mechanism/component/phase mappings.
