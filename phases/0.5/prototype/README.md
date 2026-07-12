# Edge adapter — runnable prototype

A working skeleton of the [adapter spec](../adapter-spec.md), small enough to
read in one sitting (~350 lines). Runs with **zero dependencies** (Python 3
stdlib only): the cloud mailbox and codex are mocked behind the same
interfaces the real backends implement.

```
python3 demo.py
```

## What the Outlook experience looks like

The demo simulates the full journey from [adapter-flow.svg](./adapter-flow.svg):

```
you (phone) ──mail──▶ victor+vanessa@company.com          ① send a task
                          │  (sits in the cloud inbox)
laptop poll cycle ────────┘                                ② ≤15 s later
  → turn: Vanessa on thread 11201866 (session conv-vanessa-001)
  ← replied on thread, original → Processed
  ✗ rejected (sender not allow-listed): mallory@elsewhere.com

your inbox:                                                ③ the reply
  From: Vanessa
  Subj: Re: Contract review workflow
  | Here's my take on “Contract review workflow”: …
  | — Vanessa (digital colleague)

you reply on the same thread                               ④ same session
  → turn: Vanessa on thread 11201866 (session conv-vanessa-001)   ← SAME id
```

Everything lands in `.demo-run/`: the simulated mailbox (`inbox/`, `sent/`,
`processed/`), the SQLite state (thread map + processed ids), and
`traces/audit.jsonl` — the business-audit layer of ADR-016, one JSON line per
event including the stranger's rejected attempt.

## Layout → spec mapping

| File | Spec section |
|---|---|
| `adapter/mailbox.py` | §0 the mailbox is in the cloud; §2 mailbox-as-queue; `GraphMailbox` names the two real REST calls |
| `adapter/codex_client.py` | §1 JSON-RPC seat — spawn + stdio, five requests / five events; `MockCodex` fakes the same stream |
| `adapter/core.py` | §1 router (sender gate → +tag → thread map), §2 lifecycle + idempotency, ADR-016 trace tap |
| `adapter/config.py` | §4 `colleagues.yaml` — identity of record |
| `colleagues.yaml`, `personas/` | persona = template; instance = template × owner |

## Going real (v0.1 checklist)

1. `GraphMailbox`: implement the three named endpoints with MSAL device-code
   auth (token → OS keychain)
2. `CodexAppServer`: already speaks the boundary; pin method names to your
   codex release and verify against the IDE extension source (ADR-015)
3. Wrap `Adapter.run_cycle()` in a `while True: sleep(poll_seconds)` loop,
   register with launchd / Task Scheduler
4. Keep `demo.py` green — it is the executable form of the spec's semantics
   (FIFO, same-thread-same-session, sender gate, single rejection per message)
