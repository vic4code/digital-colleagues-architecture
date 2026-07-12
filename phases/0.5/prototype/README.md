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

| File | What it is |
|---|---|
| `adapter/core.py` | router (sender gate → tag → thread map), lifecycle + idempotency, trace tap — channel-agnostic |
| `adapter/mailbox.py` | Outlook channel: `MockMailbox` (runs anywhere) behind the same interface as the real thing |
| `adapter/graph.py` | **real Outlook** — MSAL device-code auth + delta poll / reply / move-to-Processed, implemented |
| `adapter/teams.py` | Teams channel: `MockTeamsChat` (in the demo) + `GraphTeamsChat` (delegated polling, v0.2 stub) |
| `adapter/codex_client.py` | JSON-RPC seat — spawn + stdio, published method names; `MockCodex` fakes the same stream |
| `adapter/config.py` | `colleagues.yaml` — identity of record |
| `colleagues.yaml`, `personas/` | persona = template; instance = template × owner |

Channels implement one interface (`poll_new` / `send_reply` / `mark_processed`)
and messages carry `colleague_tag()` — email routes on the plus-address, Teams
on a leading `@vanessa`. A Teams chat is a thread: one dedicated chat = one
persistent session with that colleague.

## Going real

1. **Outlook (v0.1)** — `pip install msal requests`, register a public-client
   app (delegated `Mail.ReadWrite`, `Mail.Send`, `offline_access`), point
   `GraphOutlook` at it. The code is written; it needs your tenant to run.
2. **codex** — swap `MockCodex` for `CodexAppServer`; regenerate schemas with
   `codex app-server generate-ts` on every upgrade and diff (ADR-015)
3. **Service** — wrap `Adapter.run_cycle()` in `while True: sleep(poll_seconds)`,
   register with launchd / Task Scheduler
4. **Teams (v0.2)** — implement `GraphTeamsChat.poll_new/send_reply` (endpoints
   named in the class); add `Chat.Read` + `ChatMessage.Send` to the same
   sign-in; list watched chat ids in `adapter.toml [teams]`
5. Keep `demo.py` green — it is the executable form of the spec's semantics
   (FIFO, same-thread-same-session, sender gate, single rejection per message)
