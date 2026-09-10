# Hermes — Cron monitor mode: observe cheaply before waking the agent

Pinned code: `NousResearch/hermes-agent@fef0e16fe19b79ded929209f87c7434270b03825`.

**User-facing conclusion:** A configured script or URL reads the environment on scheduled runs. Hermes compares the returned text before starting a model: unchanged → no model or notification; first observation or change → model receives the current output and, on later changes, a diff. This is scheduled change detection, not autonomous choice of a new source or exploration objective.

**Exact execution chain:** Default `InProcessCronScheduler.start()` calls `cron_tick(..., sync=False)` then waits (healthy default 60 s). `tick()` selects due jobs, advances recurring schedules and submits workers. Worker calls `run_job()` → `_prepare_job_prompt()` → `_apply_monitor_gate()` → `check_monitor()` → `_run_monitor_source()` → configured script or bounded HTTP GET. A changed result is injected into `extra_prompt`; only then `run_job()` imports/builds AIAgent. The 60 s ticker is scheduler cadence, NOT necessarily the user's monitor frequency; the job's schedule determines due status.

## Three exact snippets

1. `cron/scheduler_provider.py:408-411` (default interval at 369-370; wait at 438):
```python
                    cron_tick(
                        verbose=False, adapters=adapters, loop=loop, sync=False,
                        can_dispatch=can_dispatch,
                    )
```
2. `cron/monitor.py:137-145`:
```python
    new_hash = hash_monitor_output(output)
    raw_state = job.get("monitor_state")
    last_hash = raw_state.get("last_output_hash") if isinstance(raw_state, dict) else None

    if last_hash is not None and new_hash == last_hash:
        return MonitorOutcome(ok=True, changed=False)

    first_run = last_hash is None
    old_output = "" if first_run else _read_last_output(job_id)
```
3. `cron/monitor.py:166-167`:
```python
    _persist_monitor_state(job_id, new_hash, output)
    return MonitorOutcome(ok=True, changed=True, first_run=first_run, context_block=context_block)
```

## Verified details and trade-offs
- Input is `monitor_script` or `monitor_url` (script takes precedence): `cron/monitor.py:107-118`. URL GET: 30 s timeout, first 256 KiB decoded as UTF-8 with replacement; `25-28,88-100`.
- SHA-256 hashes UTF-8 encoded returned text without whitespace/timestamp normalization: `44-46`. Stable output matters: timestamps or unstable ordering cause additional model runs even if business meaning is unchanged.
- First observation DOES invoke agent; it adds `Monitor Baseline (first run)` with no previous diff: `144-157`. Subsequent change gets unified diff (max 4,000 chars) plus current output (max 8,000 chars): `25-26,147-164`.
- Source failure is not change, leaves baseline untouched: `133-135`; gate produces explicit error/alert response without starting agent: `cron/scheduler.py:1321-1332`.
- Unchanged preserves a run ledger document but uses `SILENT_MARKER` to suppress delivery: `cron/scheduler.py:1333-1338`. Agent import follows early gates: `2323-2326`.
- Baseline hash and snapshot are persisted BEFORE model execution, not after successful notification: `cron/monitor.py:128-130,166-185`. Trade-off: suppresses repeated alerts after downstream failure; unchanged next scheduled observation will not by itself regenerate the same model work. Treat observation state separately from pending work / delivery acknowledgement if adopting this design. Persistence failures log warnings instead of failing the gate (`77-85,174-185`).
- Example (proposed connector wiring, not bundled Outlook connector proof): A script queries Outlook through the chosen integration and prints stable message IDs + fields. Cron runs it on schedule. If output changes, agent receives the new snapshot and diff and decides whether to notify. No change means no model call. Monitoring still needs configured access and a source; it does not discover arbitrary systems unaided.

## Pinned source links
- https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/cron/scheduler_provider.py#L361-L438
- https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/cron/scheduler.py#L3798-L3837
- https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/cron/scheduler.py#L1307-L1344
- https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/cron/scheduler.py#L2033-L2045
- https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/cron/scheduler.py#L2320-L2326
- https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/cron/monitor.py#L88-L118
- https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/cron/monitor.py#L125-L185
