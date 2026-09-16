# Codex: scheduling and native goal are separate mechanisms

Checked 2026-09-16 for presentation slides 3 and 9.

| Surface | What is provided | Trigger classification |
| --- | --- | --- |
| App Automations / Scheduled tasks | A recurring schedule starts background work; results can be reviewed in Scheduled. Tasks can run independently or inside an existing chat. | Time |
| App-server native goal | `thread/goal/set`, `get`, and `clear` manage the persisted goal also surfaced by TUI `/goal`. An active goal can initiate and continue turns when the thread is idle. | Internal Event / continuation |

The official [Scheduled tasks documentation](https://learn.chatgpt.com/docs/automations?surface=app) supports recurring schedules, custom RRULEs, background project execution, and reviewing runs. Local project tasks require the computer and desktop app to remain running and the project to be available. This App capability is not evidence of a same-named app-server cron RPC.

The official [app-server goal documentation](https://learn.chatgpt.com/docs/app-server#manage-a-thread-goal) documents `threadId`, `objective`, `status`, and `tokenBudget`, and the persisted goal state. A new objective resets usage accounting; updates to the same nonterminal objective can preserve it. Completion criteria can be included in `objective`, but prose alone is not a business validator.

The previously audited [goal runtime](https://github.com/openai/codex/blob/634ebc1865c6ac840ed3ba118f040d527bf4b55d/codex-rs/ext/goal/src/runtime.rs#L399) establishes the idle continuation path. Setting an active goal can start work; apply host permission and budget checks before setting it. Do not describe a token budget as a precise monetary hard cap.

## Proposed use in our architecture

- P1: Scheduler stores schedule plus fixed task, then dispatches a turn. App Automations is an alternative ready-made entry, not an additional scheduler for the same work.
- P2: Use native goal directly for the assigned objective and completion conditions. Controller retains case-to-thread mapping, pending evidence, checkpoint, and business acceptance. Waiting for external evidence should suspend work rather than busy-loop.
- P3: Workspace role policy and authorized context support discovering new work. Validate and authorize the candidate, then native goal can execute it. Goal continuation itself does not establish self-initiated task discovery.

This is an integration proposal. It does not claim that P2/P3 have been deployed or that an App automation was created during this review.
