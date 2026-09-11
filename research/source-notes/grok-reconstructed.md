# Grok Bot 0.18: reconstructed implementation review

Inspected on 2026-09-08 at commit `a9f633e09d49a85829b8236331b9e21f7e612634` in `b-nnett/grok-bot-0.18-reconstructed`.

## Provenance and scope

This is an unofficial reconstruction with extensions, not original vendor source. [PROVENANCE.md](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/PROVENANCE.md#L1) identifies a macOS Grok Bot 0.18 application, an Anysphere bundle identity, and a Cursor-hosted installer. These are repository provenance claims. The original binary, signature, and behavioral equivalence were not independently validated. They must not be generalized to an xAI cloud controller or another product sharing a Grok name.

The repository also adds inference routing and a local Docker option. A readable implementation and its tests can establish reconstruction behavior; they cannot alone establish which behavior existed in the shipped application. The reviewed source directory was compared with the pinned Git revision and has no diff. Large installer preservation assets were not needed for this review.

## Automation delivery: defined work arrives from scheduling infrastructure

[extension.ts:73](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/extensions/automations/extension.ts#L73) wires cloud-definition synchronization, a fire consumer, notification drains, and local event listeners. Reconciliation calls fireConsumer.tick; local Slack/GitHub event handling passes through SandTriggerHub and its scheduling-authority checks. This does not establish a locally implemented cloud cron service.

[SandAutomationFireConsumer.tick:72](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/extensions/automations/sand-automation-fire-consumer.ts#L72) prevents overlapping polls, checks readiness/backoff, polls backend fire events, tracks running/completed/reported states, and acknowledges reported work on later polls. deliver resolves current target definitions, reuses existing completed outcomes, rejects disabled or changed definitions, and validates event-trigger matching before invoking execution. Delivery errors can leave work available for later retry. This is not unconditional exactly-once side-effect delivery.

[AutomationRunPath.fireAutomation:109](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/extensions/transcript/automation-run-path.ts#L109) checks execution availability, prevents duplicate in-flight non-event firings, resolves the background session, and applies the background spend guard where applicable. It records run state and enqueues a background-lane turn. The current automation builds the prompt; runner.run receives hidden and isSilenceAllowed. Group automations branch into a different execution path. Finally it records run status, updates automation state and telemetry, and releases the in-flight marker.

The important boundary is defined automation versus new objective selection. These functions consume configured work and event context. They do not independently generate a new root objective.

## Event and completion wakes: continue owned work without a fresh user message

[BackgroundWakes:359](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/extensions/transcript/background-wakes.ts#L359) appends timeline events, queues eligible wakes when the agent is not running, batches pending material, resolves background sessions, and invokes runBackgroundWake. Group sessions are excluded from this event path.

[CompletionRevivals:99](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/extensions/transcript/completion-revivals.ts#L99) has distinct subagent and shell completion queues. The subagent path deduplicates pending completions by subagent identity. runSubagentRevival constructs a result-bearing prompt and enqueues an exclusive background run with silence allowed.

Quiet-origin prompts distinguish a standing-order result from work the user is waiting for. They ask the model to report useful change or actionable results and otherwise remain silent. This is model guidance, not a deterministic information-value classifier.

[RunScheduler.pump:199](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/extensions/transcript/run-scheduler.ts#L199) prioritizes queued user tasks over agent and background tasks. Its watchdog can interrupt a wedged run and later release the logical slot. escapeWedgedRun retains the unsettled promise as a zombie while scheduling proceeds. Queue progress therefore does not prove physical cancellation or unlimited freedom from overlapping work.

[PendingWakeRearm:99](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/extensions/transcript/pending-wake-rearm.ts#L99) restores eligible persisted watches and prunes stale markers. A lost in-process subagent produces an interrupted/unknown-state completion notice; it is not represented as successfully resumed execution. These persistence semantics belong to completion watches, not arbitrary autonomous missions.

## Goal continuation: handler exists, automatic producer not established

[agent/index.ts:72](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/packages/agent/index.ts#L72) registers GoalContinuationActionHandler. [adaptAction:84](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/packages/agent/actions/goal-continuation-action-handler.ts#L84) validates an active goal's UUID and conversation/session ownership. After three prior continuations without counted tools, it pauses the goal and deactivates the clock. Otherwise it increments continuation counters, updates active-time accounting, and constructs simulated user input containing the objective.

handle delegates to the ordinary user-message handler under tool-counting middleware. Counted tool activity clears the idle streak. handleModelStep can clear it based on generated tool descriptors, before actual execution; this is an especially weak proxy for useful progress. The three-idle-turn guard is not a total continuation budget or proof that work has stalled semantically.

Searching the inspected source for goalContinuationAction and its handler found registration, dispatch support, type definitions, and handler logic. It did not establish a producer that automatically submits the next action after every turn. The diagram therefore starts at receipt of that action and has no asserted automatic loop-back edge. This is deliberately narrower than calling the reconstruction a proven repeat-until-done goal scheduler.

## Exploration interpretation

The inspected runner, transcript, and agent-core paths support configured work, event-triggered follow-up, and continuation actions. No intrinsic-reward, curiosity-score, or information-gain task generator was found in those paths. Task-level proactive prompt guidance exists; it is not equivalent to a root-goal generator. Custom extensions, model behavior, and remote services remain outside this negative conclusion.

Interpretation from code: the reconstruction emphasizes resuming useful work from explicit triggers while managing ownership, silence, and interruption. This is an inference, not an authenticated author statement.

## Executed checks

Seven checks directly imported unchanged TypeScript pure functions under Node's type stripping:

1. Identical conversation/id wake is deduplicated.
2. Same-conversation group wake replaces its predecessor.
3. Same group key in a different conversation does not replace it.
4. Mismatched goal session ownership is rejected.
5. Matching legacy conversation ownership is accepted.
6. Active elapsed time adds time since the clock anchor.
7. Deactivation accrues time and clears the anchor.

Result: 7/7 passed. Files: [wake merge](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/packages/agent-exec/wakeup/index.ts#L1), [goal-state helpers](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/packages/agent-core/goal-continuation.ts#L1).

No dependency installation, full test suite, model call, app launch, cloud scheduler execution, goal-handler integration test, or original-binary comparison was performed.

## Expanded mechanism inventory — 2026-09-09

See [mechanism-inventory.md](mechanism-inventory.md) for additional entry, event, continuation and maintenance paths. Earlier representative flows do not enumerate all mechanisms. New entries are static source traces, not additional live runtime tests.

## Official product context, checked 2026-09-11

The [official Grok Bot page](https://x.ai/news/introducing-grok-bot) describes persistent follow-up, learned routines and Bot coordination. This supports product intent independently of the reconstruction, but does not authenticate this repository or establish implementation parity. [Colleague experience synthesis](colleague-experience.md) maps official claims, reconstruction mechanisms and our proposed implementation separately.
