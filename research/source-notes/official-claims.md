# Official concepts and implementation evidence

Added 2026-09-09. Project documentation is retained alongside source inspection. A feature definition is not a runtime test; a research result is not a reproduced experiment. Same-commit documentation is preferred over mixing online docs from another version.

## OpenClaw Heartbeat: direct answer

At the inspected commit, docs/gateway/heartbeat.md explicitly defines heartbeat as a system-owned automation. resolveHeartbeatMonitorPlan in src/cron/heartbeat-monitor.ts:71 projects heartbeat configuration to an every schedule, payload.kind heartbeat, and main-session target. The Automations scheduler uses setTimeout; no separate heartbeat fallback timer is described. Manual/event wakes remain a separate available entry when recurring cadence is disabled.

The earlier timer-first diagram omitted this feature/configuration layer. The current diagram starts at Heartbeat configuration and the system-owned monitor.

## Claim-to-code ledger

### openclaw/openclaw — Heartbeat

Project claim: The docs define Heartbeat as a system-owned automation for periodic agent turns. Its cadence is owned by the Automations scheduler; there is no separate fallback timer.

Documentation: https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/docs/gateway/heartbeat.md#L10

Code evidence: resolveHeartbeatMonitorPlan projects config into an every schedule with a heartbeat payload and main-session target. timer-scheduler.ts supplies the actual setTimeout.

Source: https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/src/cron/heartbeat-monitor.ts#L71

Status: Supported in inspected code / 已讀程式支持

### openclaw/openclaw — Automations / cron

Project claim: The project describes a built-in scheduler that persists work and delivers results. The automations CLI is primary; cron remains an alias.

Documentation: https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/docs/automation/cron-jobs.md#L12

Code evidence: armTimer / onTimer schedule and select work. The heartbeat branch is one payload route, not every automation.

Source: https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/src/cron/service/timer-scheduler.ts#L55

Status: Supported in inspected code / 已讀程式支持

### openclaw/openclaw — Skill Workshop

Project claim: Docs distinguish governed generated-skill proposals from automatic background learning that may directly maintain Workshop files.

Documentation: https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/docs/tools/skill-workshop.md#L12

Code evidence: The review path uses configured off/auto/propose behavior, eligibility and tool restrictions. Do not assume every background change requires a proposal.

Source: https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/src/skills/workshop/experience-review.ts#L122

Status: Supported in inspected code / 已讀程式支持

### openclaw/openclaw — Dreaming

Project claim: The project documents background memory consolidation and synthesis.

Documentation: https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/docs/concepts/dreaming.md#L1

Code evidence: The inspected promotion/diary paths maintain memory artifacts. They do not establish a new external-goal generator.

Source: https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/extensions/memory-core/src/dreaming.ts#L583

Status: Supported in inspected code / 已讀程式支持

### NousResearch/hermes-agent — Persistent Goals /goal

Project claim: The docs call this a Ralph-loop adaptation: keep a standing objective across turns and inject continuation after judging the latest response. They credit Codex as inspiration and describe Hermes as an independent implementation.

Documentation: https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/website/docs/user-guide/features/goals.md#L7

Code evidence: A real post-turn hook evaluates GoalManager and queues a synthetic event. Waiting, gates, budgets and error paths qualify the broad “after every turn” description.

Source: https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/gateway/run_goals.py#L262

Status: Supported in inspected code / 已讀程式支持

### NousResearch/hermes-agent — Recurring Loops /loop, /proactive

Project claim: Docs distinguish timer-driven recurring prompts from judge-driven goals. /proactive is an alias; fixed and self-paced cadences are documented.

Documentation: https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/website/docs/user-guide/features/loops.md#L7

Code evidence: complete_tick checks stop markers and limits; normalized reply digests affect pacing. The digest is lexical, not a semantic progress evaluator.

Source: https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/hermes_cli/loops.py#L538

Status: Supported in inspected code / 已讀程式支持

### NousResearch/hermes-agent — Session Heartbeats /heartbeat

Project claim: One recurring instruction re-enters the current session when idle. Docs credit Prime-Agent as inspiration.

Documentation: https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/website/docs/user-guide/features/heartbeat.md#L7

Code evidence: The watcher checks session/adapter and running/queued state before injecting a synthetic turn.

Source: https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/gateway/run_goals.py#L116

Status: Supported in inspected code / 已讀程式支持

### NousResearch/hermes-agent — Scheduled Tasks / cron

Project claim: Docs advertise durable unattended jobs, fresh sessions and a script-only no-agent mode.

Documentation: https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/website/docs/user-guide/features/cron.md#L7

Code evidence: Expanded audit: tick / due-job claim → run_one_job → run_job → fresh AIAgent; no_agent branches before agent construction. Remote provider fire shares run_one_job. Static source trace, not live end-to-end verification.

Source: https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/cron/scheduler.py#L2301

Status: Source path traced; runtime not exercised / 已追蹤程式路徑，未執行完整 runtime

### NousResearch/hermes-agent — Self-improving / learning loop

Project claim: The project positions Hermes as a self-improving agent with memory/skill learning. Its uniqueness claim is a marketing assertion, not a finding of this study.

Documentation: https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/README.md#L20

Code evidence: Constrained review and guarded skill updates support artifact-level learning. This does not demonstrate model-weight training or prove exclusivity.

Source: https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/agent/background_review.py#L937

Status: Supported in inspected code / 已讀程式支持

### CopilotKit/OpenBot — Routines

Project claim: Standing instructions run on a schedule as the requesting user, with current permissions. The docs name limits and a repeated-failure disable rule.

Documentation: https://github.com/CopilotKit/OpenBot/blob/7b94a0b802732e6491634160cf9ed3fcfb813424/docs/routines.md#L1

Code evidence: The runner reloads context/access and records outcomes. The due sweep and queue implement scheduled ownership.

Source: https://github.com/CopilotKit/OpenBot/blob/7b94a0b802732e6491634160cf9ed3fcfb813424/server/src/routines/runner.ts#L72

Status: Supported in inspected code / 已讀程式支持

### CopilotKit/OpenBot — Missed-window handling

Project claim: Docs say missed windows are not replayed as old outputs, but describe advancing stale occurrences one by one.

Documentation: https://github.com/CopilotKit/OpenBot/blob/7b94a0b802732e6491634160cf9ed3fcfb813424/docs/routines.md#L51

Code evidence: The inspected code instead advances an out-of-grace schedule from now. Preserve the intended skip policy; prefer code for the exact recovery algorithm.

Source: https://github.com/CopilotKit/OpenBot/blob/7b94a0b802732e6491634160cf9ed3fcfb813424/server/src/routines/sweep.ts#L135

Status: Documentation/code discrepancy / 文件與程式細節有差異

### b-nnett/grok-bot-0.18-reconstructed — Reconstruction provenance

Project claim: The supplied repository describes reconstructed Grok Bot 0.18 source and additional extensions. It is not a vendor-authored specification for xAI services.

Documentation: https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/PROVENANCE.md#L1

Code evidence: Completion/event follow-up is visible in this reconstruction. Original-binary parity and a vendor claim about this behavior are unverified.

Source: https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/extensions/transcript/completion-revivals.ts#L99

Status: Reconstructor claim only / 僅重建者說明

## Voyager authors’ research

The project page and paper define automatic curriculum, skill library and iterative prompting. The authors describe the curriculum as an in-context form of novelty search. Source inspection supports the component mapping; reported Minecraft results are author experiments, not this review’s measurements.

https://voyager.minedojo.org/

https://arxiv.org/abs/2305.16291

## Source tier

OpenClaw/Hermes/OpenBot: maintainer-authored documentation, not treated as peer-reviewed research. Voyager: authors’ project and paper. Grok Bot 0.18 repository: unofficial reconstruction, not an authenticated vendor specification.
