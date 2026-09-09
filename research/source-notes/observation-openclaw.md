# OpenClaw observation acquisition — pinned source audit

Pin: 91ea838947d30a65f1299b05fa42071917f2a293. Code read directly from cached source, no runtime execution. Link prefix: https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/

## Native name: Automations — Stream sources
Purpose: keep an operator-authored line-producing command alive; consume output and run configured work when lines arrive.

Sequence:
1. Service starts, resumes watcher lifecycle, calls reconcileStreamWatchers (src/gateway/server-cron.ts L1582-L1595). Watcher reconcile checks enabled/trust/job flags and starts eligible owners (src/gateway/cron-stream-watchers.ts L345-L377); add/edit routes also update live owner.
2. Owner spawns schedule.command argv through process supervisor, not a model (src/gateway/cron-stream-job-owner.ts L391-L404).
3. onStdout/onStderr enqueue bytes. acceptChunk reconstructs newline-delimited records (src/gateway/cron-stream-output.ts L368-L419); acceptLine applies optional regex, batches matching lines, closes on bytes cap or quiet timeout (L422-L452).
4. Closed batch calls fireBatch with source identity (L503-L531), which calls cron.run(force, evaluateTrigger:true, streamBatch) (src/gateway/server-cron.ts L1245-L1256).
5. Optional trigger script gates batch; otherwise appended to payload. Payload can be agentTurn/systemEvent/script; stream input is NOT guaranteed to call LLM (src/cron/service/timer-execution.ts L108-L158).

Critical distinction: framework stream schedule is event-driven, never time-due: src/cron/schedule.ts L247-L250. It reacts to process output. The command itself determines how data is acquired: socket subscription, filesystem watcher, log follower, or its own polling loop. Therefore never claim continuous process implies end-to-end push/no upstream polling. Quiet batching, rate limiting, restart backoff still use timers; these timers do not periodically sample the source.

Official docs: docs/automation/cron-jobs/schedules.md L38-L57. Native WebSocket source not included in this pin; docs suggest argv bridge websocat. One running payload plus bounded pending batch; rate minimum 30 seconds; failures restart with backoff and cap. Output overflow/coalescing means this is not lossless event transport.

Business scenario (illustrative integration, not bundled connector): operator supplies a command listening to build events; process prints failed/recovered lines; OpenClaw batches, then agent investigates and reports. Outlook equivalent requires separately implemented M365 event/subscription adapter; cannot describe standard read connector as event source.

## Native name: Event triggers (condition watchers)
Purpose: headless code checks an observation and previous persisted state before starting payload.

Official docs explicitly say an every/cron schedule evaluates when due; stream schedule evaluates once per closed batch (docs/automation/cron-jobs/schedules.md L83-L107). Native word event does NOT mean every condition watcher receives external push.

Sequence: timer due OR stream batch -> run configured script with previous trigger.state and optional trigger.streamBatch -> script calls allowed tools for observation -> returns {fire,message?,state?} -> fire:false saves state and reschedules/drops batch; fire:true executes normal configured payload. Script is authored deterministic code; LLM can run downstream, it is not needed to evaluate condition.

Actual code: src/cron/trigger-script.ts L404-L450 builds tool execution bridge and runHeadless code; src/cron/service/timer-execution.ts L108-L146 passes state/batch and returns before payload for false. Official docs show gh pr checks polling every 30s (L87-L96). Good real scenario: CI changes pending to failure; query tool returns status, compare with last stored status, wake agent only on change. State comparison is authored script, not built-in universal detection.

Limits: trigger evaluation 30s/5 tools, prior JSON state max16KB; fire:false persists check state; failed fired payload does not advance returned trigger state (docs L101-L107). This helps retry but downstream actions still need idempotency.

## Three exact short snippets

### Source launch / output callbacks — src/gateway/cron-stream-job-owner.ts L396-L404
```ts
        mode: "child",
        argv: this.job.schedule.command,
        ...(this.job.schedule.cwd ? { cwd: this.job.schedule.cwd } : {}),
        env: markOpenClawExecEnv({ ...process.env }),
        stdinMode: "pipe-closed",
        captureOutput: false,
        onStdout: (chunk) => this.output.enqueueChunk("stdout", chunk, generation),
        onStderr: (chunk) => this.output.enqueueChunk("stderr", chunk, generation),
      });
```

### Not a periodic stream poll — src/cron/schedule.ts L247-L251
```ts
  if (schedule.kind === "on-exit" || schedule.kind === "stream") {
    // Event-driven trigger: never time-due. The gateway watcher calls
    // enqueueRun when the watched command exits or a stream batch closes.
    return undefined;
  }
```

### Condition prevents payload — src/cron/service/timer-execution.ts L142-L147
```ts
    if (!evaluation.fire) {
      return { status: "ok", triggerEval };
    }
    if (evaluation.message !== undefined) {
      effectiveJob = { ...job, payload: appendCronPayloadText(job.payload, evaluation.message) };
    }
```

Recommended report wording:
EN: OpenClaw stream watches a running command's output; the command supplies the actual sensor. Condition watchers run a script on a timer or stream batch and start work only when it returns fire:true.
ZH: Stream 讓背景程式持續回傳觀察；真正怎麼取得資料，由該程式決定。Condition watcher 在時間到或收到一批資料時先跑檢查程式，回傳 fire:true 才開始後續工作。
