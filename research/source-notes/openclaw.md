# OpenClaw source review — 2026-09-08

Pinned revision: `91ea838947d30a65f1299b05fa42071917f2a293` (2026-09-08T07:23:11Z). Local full source: `/tmp/proactive-agent-research-20260908/source/openclaw/openclaw-91ea838947d30a65f1299b05fa42071917f2a293`.
GitHub link prefix for every reference below: `https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/` + path + `#L<n>`.

## Main corrections to documentation-only conclusions

1. `create_goal` explicit-user/system requirement and `blocked` only after three matching blocker turns are **model instructions**, not provenance-checking / blocker-counting code. The state transition enforces nonempty objective, one existing goal, terminal state and token accounting. Do not label the semantic requirements hard security gates.
2. Durable Goal is not itself a repeat-until-done scheduler. Start/resume creates a continuation input; active goal is injected into subsequent inbound turns. Full `src` search found `continuationTurns` only initialized to zero in `goals-transitions.ts:105` (excluding fixtures/tests), no increment/automatic continuation controller under that field. No goal-related invocation in scanned agent-runner finalization surfaces. This is bounded negative evidence, not proof every harness/extension lacks independent continuation.
3. OpenClaw has an additional human-inspired **dreaming** memory mechanism. Its diary can form associations among existing fragments, but the traced diary path produces text, not a goal/task or environment-exploration action. Do not omit this mechanism; do not mistake poetic surprise language for intrinsic-reward computation.

## 1. Heartbeat: actual caller chain and admission

`src/cron/service/timer-execution.ts:161-216` handles heartbeat payloads and migrated heartbeat tasks. Constructs `source: interval`, `intent: scheduled` (or `task`), resolves target agent and calls `state.deps.requestHeartbeatAndWait` at 198. It converts settled heartbeat status to cron ok/error/skipped.

`src/infra/heartbeat-wake.ts:12-20` aliases this API to the shared session-event wake bus. `src/infra/session-event-wake.ts:498` enqueues an awaited wake; `:380-404` owns timer/handler dispatch, `:322-346` invokes the current handler under abort/owner-generation protection. `heartbeat-wake.ts:29-30` installs the handler.

`src/infra/heartbeat-runner-scheduler.ts:startHeartbeatRunner:48` registers `run` at 394. The targeted/broadcast path calls `runOneAgent` (:232), checks `evaluateWakeDeferral` (:239), then `runOnce` (:269). Retryable busy skips do not acquire cooldown (:300); accepted/failed attempts update per-agent bookkeeping. Targeted unscheduled wakes are allowed through an explicit branch (:323-348) without enrolling the agent in recurring scheduling.

`src/infra/heartbeat-cooldown.ts:93-154` implements intent-based admission. Explicit manual intent bypasses deferral (:94). Constants are minimum 30 seconds (:20), flood window 60 seconds (:26), five-start threshold (:27); ordinary event/task policies differ from authoritative scheduled ticks. These are code gates, not prompt requests.

`src/infra/heartbeat-runner-run.ts:29-36` calls `resolveHeartbeatWakeStage` then `prepareHeartbeatRunStage`. `heartbeat-runner-execution.ts:124-167` validates configured agent, global wake enablement, interval/targeted exception, and active hours (cron transport has its own exception). Busy checks occur at :191, :217, :233, :274, :290, :304, :312; route rejection at :367. This is not simply timer → LLM unconditionally.

Once admitted, `heartbeat-runner-run.ts:73-121` constructs the internal prompt and source metadata then calls normal inbound dispatch; marks `isHeartbeat`, carries abort/timeout and optional lightweight context, and routes delivery through `deliverHeartbeatDispatch`. Model judgment occurs after this runtime boundary.

**Design implication:** scheduler supplies opportunities; runtime controls admission; model decides useful action from supplied state/prompt. Turning off recurring cadence is not equivalent to disallowing all event-driven turns.

## 2. Adaptive next_check: complete proposal propagation

`src/cron/isolated-agent/run.ts:213-214` registers the current job with `pacingEnabled` in run context. `src/agents/tools/cron-tool.ts:649-665` accepts `next_check` only with scoped jobId and runId, parses positive duration, calls registry.

`src/infra/agent-run-registry.ts:332-341` requires matching currently running job and pacing enabled, then stores the latest proposal; `:345-356` consumes/deletes it. This is a real runtime-scoped capability check.

After `executeCronRun` and `finalizeCronRun`, `src/cron/isolated-agent/run.ts:297-304` consumes the proposal; attaches it only if status is ok, and discards it on exceptions. `src/cron/service/timer-execution.ts:437` propagates `nextCheck` to scheduler outcome.

`src/cron/service/timer-outcomes.ts:481-510` applies it only for enabled, successful, paced jobs; `src/cron/pacing.ts:39-54` clamps delay to declared min/max, based on run **end** time. Trigger safety floor outranks pacing bound at :500-504. Persists a `pacedNextRunAtMs` marker; outcome writes pass through `timer-outcome-finalization.ts:240` to `applyOutcomeToStoredJob` (:647). Failed jobs take normal error backoff (:434 onward), not the model proposal.

**Prompt versus code:** cron tool description `cron-tool.ts:203,210` explicitly teaches self-wakeup / continue-later / adaptive polling. The model chooses its desired delay; code checks provenance, bounds and successful execution. This is self-adjusted attention timing, not autonomous goal generation.

Tests read, not executed: `src/agents/tools/cron-tool.pacing.test.ts:31-102` checks scoped proposal, single consumption, no-pacing rejection, other-job rejection, out-of-run rejection, shared-run separation. `src/cron/service/timer.pacing.test.ts:355,370` checks trigger floor and failed-run discard.

## 3. Goal: persistent objective and continuation semantics

`src/agents/tools/goal-tools.ts:95-117`: tool description says explicit request only; execute reads objective/budget and calls `createSessionGoal`. No explicit-request evidence parameter/check is present there.

`src/config/sessions/goals.ts:147-169` updates persistent session goal using `buildCreatedSessionGoal`; `goals-transitions.ts:78-106` checks nonempty/no-existing, assigns UUID, status active, baseline and continuationTurns=0. `:37-75` accounts fresh token usage and transitions active → budget_limited. `:109-164` rejects changing completed goals; resume of limited goals resets budget baseline.

`goal-tools.ts:122-141` exposes only complete/blocked status updates; the three-blocked-turn rule is tool description, while `buildUpdatedSessionGoalStatus` has no recurrence counter. These distinctions matter for governance.

`src/auto-reply/reply/commands-goal.ts:171,191` returns continuation prompts for start/resume; `:242-244` rewrites command input and returns goalContinuation into the ordinary reply path. `src/gateway/server-methods/sessions-goal.ts:104-125` routes UI resume through `handleSessionGoalResumeChat` in chat-send-handler. `src/auto-reply/reply/inbound-meta.ts:25-42` only injects active goal, bounded to 200 characters, into incoming context; paused/blocked/limited/complete goals are omitted. No independent scheduler is introduced by these functions.

**Conclusion:** goal keeps target sticky. It does not demonstrate an open-ended agent that invents its own goals, nor alone guarantee automatic next-turn continuation after a final answer.

## 4. Workshop: event-triggered autonomous learning chain

`src/agents/embedded-agent-runner/run/attempt-finalize.ts:321-365` emits agent-end side effects for eligible non-detached attempts. Detached maintenance avoids agent_end so it cannot recursively generate successor review work. It captures a completed transcript-entry anchor, actual model facts and available Workshop tool.

`src/agents/harness/agent-end-side-effects.ts:38-59` reads the exact active anchor and calls `scheduleSkillExperienceReview`; `experience-review-default.ts:6-25` supplies system-active check and rereads current config before preparing/reviewing the candidate.

`src/skills/workshop/experience-review-scheduler.ts:14-24` sets 10 model iterations, 30-second idle window, max 32 pending candidates, excluded trigger/session categories. `isEligibleContext:85-107` requires resolved model, actual Workshop availability, no compaction, appropriate foreground session. `schedule:159-259` excludes provider errors/off mode/shallow turns/missing source; subsequent work resets quiet timer. `arm:114-153` validates generation, defers while active or review already in flight, deletes pending before one run, records failure rather than indefinite retry. This is actual timer/state-machine behavior.

`experience-review.ts:105-114` independently admits detached root work. `:122-140` chooses off/auto/propose and private session, auto execution root at Workshop directory, propose mutation budget 1. `:184-205` fences deleted/replaced source session, changed permission mode, stale transcript anchor and auto mode revocation. `:225-258` invokes `runSkillWorkshopReview`, strips foreground delivery capability, inherits permission mode, restricts tools, uses captured provider/model and configured timeout. `:276-294` distinguishes completed/proposed/nothing; completed means successful review execution, not guaranteed file change.

**Meaning:** the system initiates reflection without a new user prompt, grounded in previous work, and can choose what procedure to improve. It is procedural artifact learning, not parameter learning or self-generated external missions. Numeric two-roundtrip usefulness criteria in review prompt are model-evaluated heuristics, not measured benefit enforcement.

Test read: `experience-review.test.ts:143-166` fake timers assert no review at 29,999 ms and one review after 30,000 ms; :237 defers while active; :486 drops failed review; :511 excludes ineligible runs. No node_modules/vitest exists in fresh archive, so no upstream tests executed; no dependencies installed.

## 5. Alternative human-inspired mechanism: dreaming

Search of `src` and `extensions` (non-test TS) for curiosity/intrinsic reward/information gain/novelty/surprise found relevant dreaming narrative plus unrelated wording. This does not exhaust possible synonyms or third-party extensions.

`extensions/memory-core/index.ts:236` registers dreaming; `extensions/memory-core/src/dreaming.ts:132-155` builds a managed cron isolated agentTurn with internal token, lightweight context and no delivery. `:914-948` service reconciles it at startup. `:957-997` before_agent_reply checks trigger type and actual managed sentinel/event, then runs promotion. `:583-640` inspects promotion candidates and components (recall, query diversity, recency, consolidation, conceptual). `:671-705` can generate a diary narrative from selected memories. This is a maintenance workflow using relevance/promotability, not utility scoring of external explorations.

`dreaming-narrative.ts:37-61` asks for surprising associations and first-person poetic diary; `:245-297` calls `subagent.complete` with narrative prompt and 60-second timeout then appends result. `:326-361` skips no-input work and optionally detaches via microtask. The inspected path has no call to createGoal, add automation, external research or task queue based on narrative output. It writes a diary. Other dreaming phases exist and were searched, but not exhaustively reviewed, so do not claim entire dreaming subsystem is merely cosmetic: memory consolidation is substantive, diary persona is presentation.

## Evidence scope and confidence

High confidence for caller chains, runtime state transitions and prompt/code distinction above. Reviewed core functions plus supporting caller slices and relevant assertions; no live deployment or provider runs. Negative conclusion: within the inspected native trigger, pacing, goal, Workshop and narrative paths, no novelty/information-gain objective generator choosing new external missions was found. Explicit schedules, durable user objectives, authored policies and evidence-driven maintenance account for observed proactive behavior. Plugins/model behavior may add more, and absence across all possible extensions is not established.


## Timer entry clarified (2026-09-09)

The scheduled heartbeat path starts before the payload dispatcher. `src/cron/service/timer-scheduler.ts:55` armTimer reads nextWakeAtMs, computes a bounded delay and calls setCronTimer. At line 115, setCronTimer uses in-process setTimeout; the callback invokes onTimer. onAdmittedTimer (line 170 onward) loads and reserves due jobs before execution. `timer-execution.ts:161` then branches on payload.kind === "heartbeat" or a migrated heartbeat task and calls requestHeartbeatAndWait. The payload describes job behavior; it is not the timer. Wake admission can skip model execution. Event/manual wake entry can bypass the scheduled entry. Rearming belongs to the scheduler and can happen while jobs execute, so a diagram must not imply it only happens after the agent returns.

## Official concept restored (2026-09-09)

Same-commit `docs/gateway/heartbeat.md:10-23` explicitly defines Heartbeat as a system-owned automation whose cadence is owned by the Automations scheduler, without a separate fallback timer. `src/cron/heartbeat-monitor.ts:71-120` projects config into a system-owned job (`schedule.kind=every`, `payload.kind=heartbeat`, `sessionTarget=main`). The timer-first diagram was incomplete at the feature level; the report now starts with configuration and the monitor job before tracing scheduler/runner code. See [official claim-to-code review](official-claims.md) for version-specific documentation and source links.

## Expanded mechanism inventory — 2026-09-09

See [mechanism-inventory.md](mechanism-inventory.md) for additional entry, event, continuation and maintenance paths. Earlier representative flows do not enumerate all mechanisms. New entries are static source traces, not additional live runtime tests.
