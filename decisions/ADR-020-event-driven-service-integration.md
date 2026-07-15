# ADR-020 — Event-driven service integration: webhook, not MCP; reuse off-the-shelf

- **Status:** Accepted
- **Date:** Phase 0.5 design
- **Deciders:** architecture owner
- **Builds on:** [ADR-019](./ADR-019-single-interaction-surface.md) (services are tools, not channels)

## Context

The colleague was passive: it only checked a service when a human asked. We
want services to **wake** it — a calendar invite, a new mail, a punch-clock
deadline — so it decides whether to act or notify without being prompted each
time. ADR-019 established services as bidirectional tools; this ADR defines the
**inbound** direction.

A tempting wrong turn: use MCP for this. MCP is bidirectional in protocol
(a server can send `notifications/*`), but in practice it answers "where does
the agent fetch data when it needs it," and server-push needs a live session —
the moment the agent's session ends, nothing can reach it. MCP is the wrong
tool for "a service had an event; go wake an agent."

## Decision

**Inbound events are a webhook job, not an MCP job.** The pipeline, built from
off-the-shelf pieces rather than bespoke code:

1. **Sources.** Where a service offers native push, use it: Microsoft Graph
   subscriptions (Outlook), Google Calendar `watch()`, Gmail watch. These carry
   a **~7-day TTL and must be auto-renewed** — a scheduled renewal job is part
   of the design, not an afterthought.
2. **Ingress.** A small always-on **webhook receiver** (public HTTPS) verifies
   signature + source, and de-duplicates. For sources with **no native push**
   (punch-clock, periodic work summaries), a **scheduler (cron / heartbeat)**
   plays the same role — time-driven instead of event-driven.
3. **Triage gate — deterministic, not the LLM.** A rule decides "does this need
   agent reasoning?" **No →** *deliver-only*: forward the notice (e.g. to
   Telegram/Slack) with no LLM turn, saving tokens. **Yes →** spawn a bounded
   agent session with the event as context.
4. **Outcome.** The agent acts/replies through the **same integration**
   (outbound), or returns **`[SILENT]`** when nothing is worth interrupting the
   human for — an explicit anti-notification-fatigue convention.

Event-driven and time-driven **coexist**; both feed the one triage gate. All of
it rides the ADR-019 access/permission/audit boundary: webhook content is
untrusted input (sig + dedup + allow-lists), and every event → task → action
shares one correlation id.

## Alternatives considered — framework capabilities compared

| Capability | OpenClaw | Hermes Agent | Codex |
|---|---|---|---|
| Generic inbound webhook | ✅ (config route, HMAC + IP allow-list) | ✅ + **dynamic subscribe** (no restart) | ⚠️ GitHub-only (Triggers) |
| Gmail push | ✅ native (`gmail watch`) | self-build route | ✗ |
| Calendar push | ⚠️ self-wire Google `watch()` | self-build route | ✗ |
| Token-saving passthrough | — | ✅ `deliver_only` | — |
| Anti-fatigue | — | ✅ `[SILENT]` convention | — |
| No-push fallback | ✅ heartbeat (~30 min) | ✅ cron + reasoning | ✅ Automations (polling) |

**Chosen borrowings:** the receiver + native-push model (OpenClaw-style), and
**`deliver_only` + `[SILENT]`** (Hermes-style) as the token/fatigue controls.
We do not adopt any one framework wholesale; we reuse the patterns. Rejected:
MCP notifications (needs a live session), and building a bespoke event bus
(the off-the-shelf receiver + native subscriptions already do it).

## Consequences

**Easier:** the colleague becomes proactive with almost no new infrastructure —
a receiver on existing compute plus vendor push subscriptions; `deliver_only`
keeps the common case free of LLM cost; `[SILENT]` keeps it from becoming spam.

**Harder:** subscription **TTL renewal** is now a reliability requirement
(a missed renewal silently stops events); the webhook receiver needs a public
HTTPS endpoint (dev: a tunnel; prod: existing always-on host); the triage rules
are worth real design effort — they are where token spend and notification
fatigue are actually won or lost.

**Follow-up implied:** the diagram shows this pipeline; the implementation repo
picks the concrete receiver, wires each service's push + renewal, and writes the
triage rules. Names in the comparison table stay here (ADR), not on diagrams
(brand neutrality, ADR-018).
