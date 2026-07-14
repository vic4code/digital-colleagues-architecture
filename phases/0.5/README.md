# Phase 0.5 — Digital Colleague on OpenClaw + Codex

**Status:** 📐 Design note. The **implementation lives in a separate code repo**
(this repo is architecture only). Parallel track — not on the cloud progression
(0 → 1 → 2 → 3).

**One line:** a digital colleague is a **customized OpenClaw persona running on
the Codex engine**, given real accounts (Gmail, Slack, …) and a skill that lets
it pick up work from any of those channels and schedule the tasks itself.

![Phase 0.5 layering](./architecture.svg)

## What this replaced (and why)

Earlier drafts of Phase 0.5 hand-built a channel adapter — poller, router,
scheduler, JSON-RPC client, trace tap — around `codex app-server`. That work is
**retired** ([ADR-018](../../decisions/ADR-018-adopt-openclaw-codex.md)):
**OpenClaw already is that layer.** Building it ourselves was reconstructing a
shipped product by hand. See the teardown decision for the full reasoning.

## The stack — three layers, we own the middle of one

| Layer | Provided by | We do |
|---|---|---|
| **Engine** — agent loop, thread resume, tool continuation, compaction | **Codex** (`app-server`, via OpenClaw's codex-harness plugin) | nothing — use it |
| **Runtime** — channels, chat/web UI, session files, approvals, transcript | **OpenClaw** | configure it |
| **Persona** — `SOUL.md` / `IDENTITY.md`, Soul·Body·Faculty·Skill | OpenClaw persona format | **author it — this is the colleague** |
| **Skills** — what the colleague can do, incl. task intake & scheduling | OpenClaw skills + MCP tools | **write the few we need** |

The colleague *is* data: a persona plus a skill set. The runtime and engine are
off-the-shelf. Our surface shrinks from "a service" to "a persona + a handful of
skills" — the ADR-015 principle, taken one layer further.

## The one thing worth designing: multi-channel intake + self-scheduling

OpenClaw gives channels; the behaviour we actually want to add is: **the
colleague notices work arriving on any of its accounts (mail, Slack, a Notion or
kanban change), queues it as tasks, works them, and reports back on a channel** —
without a human forwarding each item. This is a **skill** (task intake +
dispatch), not new infrastructure. The old "dispatcher" idea becomes exactly this
skill; nothing about it is a bespoke service.

Open design questions for that skill (to answer against OpenClaw's real
capabilities, in the code repo — not to over-spec here):

- Does OpenClaw already surface Gmail/Slack as first-class channels, or do those
  come in as MCP tools the intake skill polls? (verify before designing)
- Where does the task queue live — an OpenClaw session artifact, or the
  colleague's own workspace file?
- Scheduling trigger: OpenClaw event → skill, or a skill that wakes on a timer
  and sweeps its accounts? (the initiator test decides which is worth building)

## The initiator test still governs scope

[ADR-017](../../decisions/ADR-017-initiator-test.md) holds: build the
multi-channel intake only where **the initiator is not you** — a teammate, a
customer, another system, or someone who can't run the agent app. If the only
initiator is yourself, talk to the colleague in its web chat (OpenClaw gives you
that for free) and skip the intake plumbing until a real second party appears.

## Short-term vs long-term (unchanged in spirit)

- **Short term — the colleague as your local분신.** OpenClaw + codex-harness on
  your own device, one persona, its own Gmail/Slack accounts. Mail it or DM it;
  it runs on your machine's compute. This is the boss-facing demo.
- **Long term — centralized.** The same persona deployed to an always-on cloud
  runtime; hand it tasks by mail/Slack and it works them unattended. Persona and
  skills transfer unchanged — the move is a deployment change, and it rejoins the
  Phase 1 cloud line.

## Where the implementation goes

A separate code repo (e.g. `digital-colleague`) holds the OpenClaw config, the
`SOUL.md`/`IDENTITY.md` persona, the intake/scheduling skill, and account setup.
This repo keeps only the thinking: this note, the layering diagram, and the ADRs
([017](../../decisions/ADR-017-initiator-test.md),
[018](../../decisions/ADR-018-adopt-openclaw-codex.md)).
