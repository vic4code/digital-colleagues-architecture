# Hermes source review — 2026-09-08

Pinned commit: `fef0e16fe19b79ded929209f87c7434270b03825` (committer 2026-09-08T06:22:15Z). Source root: `/tmp/proactive-agent-research-20260908/source/hermes/hermes-agent-fef0e16fe19b79ded929209f87c7434270b03825`.

Link prefix for every file/line below: `https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/`.

This is a source reading plus three isolated probes of actual extracted functions. It is not an installed-runtime E2E test. `python3 -m pytest --version` failed: No module named pytest. No dependency installation attempted.

## Corrections to a documentation-only account

1. **Self-paced is lexical backoff, not learned attention.** `hermes_cli/loops.py:364-373` lowercases text, strips clock strings, dates AND all numeric durations, normalizes whitespace, then SHA-256 hashes it. `complete_tick:583-596` compares only that digest: identical doubles delay to ceiling; changed resets floor. Actual function probes: `latency 2 seconds` and `latency 40 seconds` produce identical digest; `No deployment change` and `Deployment remains unchanged` produce different digests. Thus meaningful timing regressions can disappear, while paraphrases can reset the clock. No embeddings, uncertainty or information-gain calculation exists in this path.
2. **Goal “unchanged workspace” is not content equality.** `hermes_cli/goals.py:370-391` fingerprints only `git rev-parse HEAD` plus `git status --porcelain`. The actual extracted function was run in a temporary git repository: change tracked `a.txt` to `broken`, fingerprint; change it to `fixed`, fingerprint: equal. Both statuses are ` M a.txt`. `_check_gates:1272-1326` therefore may replay the old failed result and increment attempts even after a content fix. This can prematurely pause a valid repair. Do not present the gate optimization as reliable proof that no work changed.
3. **Judge failures have earlier stop controls.** `goals.py:42-45,1474-1510`: consecutive parse failures stop at 3; transport errors at 5. A transient error fails open to continue, but “only the 20-turn cap stops broken judging” is outdated/incomplete.
4. **20-turn accounting counts ordinary user turns too.** `GoalManager.evaluate_after_turn:1437-1462` increments `turns_used` for real messages and synthetic continuation turns; the parameter `user_initiated` does not alter this increment. Parked waits return before increment. It is not a budget of 20 extra autonomous turns plus unlimited user turns.
5. **Automatic review is eligible post-turn, not every turn.** Default memory interval 10 user-role turns; skill interval 10 agent iterations. Interval can be disabled; actual tool use resets counters. A successful-looking nonempty final response and no interruption are required for automatic fork spawning, but there is no general semantic quality test for the lesson before the review is asked to judge it.

## End-to-end heartbeat path

- `hermes_cli/heartbeat.py:18-27`: injected prompt carries recurring instruction plus “do not invent work”. This is a behavioral prompt, not a deterministic no-op classifier.
- `HeartbeatState.is_due:83-90`, `HeartbeatManager.due_prompt:200-214`: active/elapsed test; admission immediately saves new anchor and increments `fire_count`. Missed intervals coalesce by anchoring at now.
- `gateway/run_goals.py:116-167`: `_heartbeat_poll_once` iterates watched sessions; `_heartbeat_poll_watch` re-resolves current session, checks adapter availability, running/active state and queued user messages BEFORE claiming; creates synthetic event and routes `adapter.handle_message`.
- `gateway/run_goals.py:169-196`: a gateway-wide periodic poller restores watches then polls. Tick opportunity is still time-driven.
- `gateway/run_heartbeat_acceptance.py:12-35`: after normal routing, lineage must be original session or its compression child; check again against current non-suspended session. `gateway/run_turn.py:309-310,1955-1962` calls ownership checks and sets `_heartbeat_execution_started` immediately before agent runner admission.
- `gateway/run_heartbeat_acceptance.py:39-44` + `HeartbeatManager.abandon_fire:216-231`: refund only an exact admission attempt that never entered agent runner, provided persisted state still matches the claim and remains active. Fire count proves execution admission, not success or delivery. This is stronger and more precise than merely “one heartbeat every N minutes.”

## Goal judge, continuation and evidence gates

- `hermes_cli/goals.py:870-930` `judge_goal`: constructs auxiliary-model input from goal (truncated 2,000 chars), most recent final response (4,000 chars), optional completion contract/subgoals and owned background processes/delegation counts. It does not independently read the produced artifact or full tool trace. Contract evidence is prompt-based unless a shell quality gate is configured.
- `goals.py:393-412` `run_gate`: shell command, timeout, exit code; keeps last output tail. `_check_gates:1272-1326` gates precede LLM judge; fail means short circuit, replay output into continuation; passes reset attempts. Retry test is `attempts > max_retries`: default three retries permits initial attempt plus three failures, not exactly three total executions. Replayed cached failures also increment attempts. Fingerprint limitation above applies.
- `goals.py:1437-1533`: active check → waiting check → increment turn → gates → judge → wait/blocked/done handling → persistent failure thresholds → turn cap → render continuation prompt. A blocked verdict pauses, not completes. `done` can be accepted on last-budget turn; judge is checked before exhaustion pause.
- `gateway/run_goals.py:309-330` `_run_post_turn_hooks` skips goal judging on empty interrupted/error output but still releases a loop tick. `_post_turn_goal_continuation:262-307` runs synchronous judge off the event loop and pushes continuation through adapter FIFO; real queued messages retain priority. The agent is repeatedly given user-role continuation prompts; it is not a continuously active neural process.
- `tests/hermes_cli/test_goal_gates.py:161-242`: failing gate short-circuits judge, passing gates permit judge, retry exhaustion and fingerprint change/cache are tested. The cache tests mock `workspace_fingerprint` as `fp-1/fp-2`; they do not establish that real content edits necessarily change the fingerprint. Tests inspected, not run.

## Loop scheduling and stopping

- `hermes_cli/loops.py:429-459`: setting requires nonempty prompt, defaults self-paced if no interval; starts due immediately.
- `loops.py:486-525`: `fire_tick` increments count before execution, saves `awaiting_response`, provisional next due; no overlap while awaiting. `abandon_tick` refunds count after injection failure but leaves provisional schedule (does not force instant retry).
- `loops.py:538-599`: completion precedence: model `LOOP_COMPLETE` marker → optional --until judge → requested times cap (done) → configured max_ticks (paused) → schedule next from end-of-turn. A model self-stop marker can terminate before an --until judge is evaluated; do not describe --until as an unbypassable external evidence gate.
- `loops.py:468-476`: resume sets next due within min(previous delay,5s), but does not reset `ticks_fired`. Unlike goal resume's reset-budget behavior, resuming a budget-exhausted loop does not replenish its counter; next completed tick can pause again.
- `loops.py:602-615`: active, nonparked goal blocks loop tick to avoid interleaving and consuming goal budget. Waiting/paused/done goals allow loops.
- `gateway/run_goals.py:368-434`: watcher resolves route/adapter, checks running agent and goal blocking, claims tick, sends synthetic event; slash-command loops complete immediately through separate path.
- `tests/hermes_cli/test_loops.py:341-364,375-521,575-604`: tests overlap prevention, markers/caps/judge failures, doubled delays, timestamp normalization and goal blocking. No selected test demonstrates semantic change detection; lexical behavior is intentional.

## Learning trigger → fork → allowed mutation

- `agent/agent_init.py:1239-1263,1307-1309`: default memory and skill intervals are 10, overridable.
- `agent/turn_context.py:564-581,854`: hydrate memory counter from historical user-role count modulo interval; `_tick_memory_nudge` requires available memory tool/store, advances and resets when due. Synthetic user turns may count because the mechanism is role/turn based, not human-presence detection.
- `agent/turn_iteration_prep.py:115-117`: increments `_iters_since_skill` when iteration is prepared and skill_manage exists. Comment says tool-calling iterations, but this increment occurs before provider output is known; it is not a count of successfully executed tools.
- `agent/tool_executor.py:677-683`: invoking memory or skill_manage resets respective counters before actual execution result is known. A failed tool execution can still postpone nudge eligibility.
- `agent/turn_finalizer.py:591-622`: checks skill threshold, resets counter, then nonempty final response + not interrupted + not skip_background_review + due-memory-or-skill causes spawn. Counter reset precedes spawn eligibility; interruptions/disabled review can consume an eligibility opportunity without saving a lesson.
- `run_agent.py:737-766`: automatic review suppressed in delegates, respects enabled switch, structurally clones message snapshot; local managed model may defer until idle. Explicit focused /refine takes a different path. `768-813` allocates tracked thread/run and bounded preemption requeue behavior.
- `agent/background_review.py:145-155`: 16 maximum review iterations, 600,000 aggregate input-token budget default (configurable; <=0 disables input limit). The 600k is aggregate input, not output budget or total cost guarantee.
- `background_review.py:845-897`: fork disables its own nudges (prevents recursive learning forks), disables provider session finalization, inherits cached prompt/history on same-model path; alternate-model route uses digest.
- `background_review.py:937-974,993-1043`: dispatch whitelist permits memory/skills and read_file/search_files; extras must already exist in parent's schema. Runtime denies terminal/general writing; it is not just a prompt request. Only memory/skill tools mutate learned artifacts in default review.
- `tools/skill_manager_guards.py:164-238`: code denies pinned/external/bundled/hub/user-owned non-curator skills; missing provenance fails closed. Read-before-write guard demands exact target read in this review. Thus learning changes a constrained user-visible library, not arbitrary code or model weights.
- `tools/memory_tool.py:64-80`: approval decision may allow, block or stage. IMPORTANT caveat: import failure of write_approval module returns None (fail-open). Do not call the approval boundary unconditionally fail-closed.
- `background_review.py:356-362,368-395`: prompt prohibits saving unsuccessful methods as reliable workflows, while pushing active learning and updating relevant skills. These are LLM instructions, not experimental validation of lesson truth.
- `tests/run_agent/test_background_review.py:270-422,464-611`: inspected tests cover delegate suppression, enabled switch, snapshot isolation and live-turn preemption. No runtime tests run in this research environment.

## Search for open-ended exploration mechanism

Searched actual Python under `agent/`, `hermes_cli/`, `gateway/`, `tools/` for curiosity, intrinsic_reward, information_gain, spontaneous, self_generated and exploration. No scheduler/policy implementing endogenous root-goal selection, uncertainty reduction, curiosity rewards or research-question generation found in these examined execution paths.

An instructive positive hit is `agent/prompt_builder.py:129-138`: maintainer comment says models UNDER-explore by default and forbids restoring an exploration-thrift line. `hermes_cli/default_soul.py:3-17` deliberately aligns default persona. That is **permission for sufficient task exploration through prompt design**, not an implemented spontaneous curiosity policy. It should temper a claim that Hermes actively discourages exploration; it discourages unnecessary heartbeat busywork while allowing deeper user-task investigation.

Actual identity construction: `agent/system_prompt.py:491-493` chooses profile SOUL when `load_soul_identity` or context files enabled, otherwise fallback `DEFAULT_AGENT_IDENTITY`. `agent/prompt_builder.py:1440-1473` loads profile-pinned SOUL, strips legacy bot protocol, scans and truncates; missing/failed read yields fallback. Therefore custom SOUL may replace this default, and the UNDER-explore sentence itself is a maintainer code comment, not text shown to the model. The implemented effect is removal of the prior thrift sentence from both fallback and seeded SOUL.

Conclusion: Hermes implements externally seeded persistent goals, adaptive lexical pacing, foreground-prioritized wakeups and bounded experience consolidation. It can choose next actions and reflect without another user message. The source examined does not show a default endogenous objective generator or intrinsic-motivation exploration controller. This is scoped negative evidence, not a proof of absence across all plugins/extensions.

## Probe results (actual functions extracted by AST; no algorithm reimplementation)

```
DIGEST_CHANGED_DURATION_COLLIDES True
DIGEST_PARAPHRASE_NOT_EQUAL True
FINGERPRINT_CONTENT_CHANGE_WITH_SAME_STATUS_COLLIDES True
/opt/homebrew/opt/python@3.14/bin/python3.14: No module named pytest
```

The fingerprint probe initialized a disposable temp git repo, committed a tracked file, changed its contents twice while preserving dirty-status shape, and called the pinned function both times. No source edits were made. Treat findings as reproducible implementation properties; deployed impact depends on configured gates/loops and actual workload.

## Expanded mechanism inventory — 2026-09-09

See [mechanism-inventory.md](mechanism-inventory.md) for additional entry, event, continuation and maintenance paths. Earlier representative flows do not enumerate all mechanisms. New entries are static source traces, not additional live runtime tests.

## Cron monitor mode — observation gate (2026-09-09)

See observation-to-action.json and observation-probes.json. check_monitor compares exact source-output hashes before agent setup; first observation also runs. Baseline persistence precedes downstream execution and logs failures, so it is not a delivery acknowledgement or a reliable retry ledger. A script wakeAgent=false gate is distinct from monitor hash comparison.
