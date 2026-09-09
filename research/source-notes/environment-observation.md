# Environment observation: acquisition and model dispatch

[Read the illustrated study](../show-me-proactive-lifecycle.html#observation-mechanics).

Source acquisition, agent wake and task selection are separate. A source may poll, subscribe, sample on game ticks, or return state after an action. Background streaming does not prove upstream push.

## Voyager

learn() requests an initial empty step. Subsequent action code reaches the local /step endpoint through the Python bridge. Observation modules read inventory, status and surrounding blocks; bot.observe() serializes and clears accumulated observations. BlockRecords samples every 100 physicsTick callbacks without invoking the LLM. The learning loop uses returned events to select tasks; game-tick waits and environment pause/unpause are distinct from cron.

A bounded Node probe with mocked game state passed inventory aggregation, voxel snapshot, 100-tick block-record sampling, and serialization/buffer-drain checks. This is not Minecraft E2E.

## OpenClaw

See [stream and condition audit](observation-openclaw.md). Stream owner supervises a configured command. Output chunks become filtered lines and batches; batches request cron execution. Stream jobs are not time-due. The command supplies the actual sensor and may itself poll. Condition watchers run on a schedule or stream batch and can decline payload execution. Heartbeat instead starts an agent turn whose tools read configured sources.

## Hermes

See [monitor caller audit](observation-hermes.md). Default ticker cadence is 60 seconds, but the job schedule controls observations. Script/URL output is hashed; first or changed values reach the agent. Baseline is saved before model execution. Unchanged subsequent data does not regenerate failed work; delivery recovery needs separate persisted pending output.

## Claude Code

[Official Monitor documentation](https://code.claude.com/docs/en/tools-reference#monitor-tool): command output or WebSocket messages enter the session as events. Commands can poll internally. Session end stops monitors. Provider/settings constrain availability. This is documentation evidence, not a public runtime-source audit. [/loop](https://code.claude.com/docs/en/scheduled-tasks) uses fixed or dynamic scheduling and may inspect sources with tools.

## Source excerpts

Exact code and pins are in [environment-observation-excerpts.json](environment-observation-excerpts.json); report details pair them with compact sequences and role explanations. Existing framework wake/continuation mechanisms remain separately documented; no universal observation loop is claimed.
