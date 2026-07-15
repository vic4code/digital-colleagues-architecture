# ADR-020 — Separate webhook ingress from MCP tool execution

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

A tempting wrong turn is to draw one undifferentiated "SaaS ↔ app-server" line.
Codex app-server and MCP solve different parts of that relationship. App-server
is the client control API for thread/turn lifecycle and streamed agent events.
MCP connects the Codex host to tools and context during that lifecycle. Neither
is, by itself, a durable public ingress that converts an arbitrary SaaS webhook
into a new Codex turn.

## Decision

Use two explicit paths that converge at the agent turn.

### Inbound wake-up path — webhook + app-server client

1. **Sources.** Where a service offers native push, use it: Microsoft Graph
   subscriptions (Outlook), Google Calendar `watch()`, Gmail watch. These carry
   service-specific expiry and **must be renewed** — a scheduled renewal job is
   part of the design, not an afterthought.
2. **Ingress.** A small always-on **webhook receiver** (public HTTPS) verifies
   signature + source, and de-duplicates. For sources with **no native push**
   (punch-clock, periodic work summaries), a **scheduler (cron / heartbeat)**
   plays the same role — time-driven instead of event-driven.
3. **Runtime triage gate — deterministic, not the LLM.** The Runtime Controller
   decides "does this need agent reasoning?" **No →** *deliver-only*: forward
   the notice (e.g. to Telegram/Slack) with no LLM turn, saving tokens.
   **Yes →** continue to the app-server bridge.
4. **App-server bridge.** The runtime is an app-server client. For accepted
   events it calls `thread/start` or `thread/resume`, then `turn/start`; it keeps
   reading notifications until `turn/completed`.

### Outbound action path — app-server turn + MCP tool

During the turn, the Codex host uses its configured MCP client to invoke an MCP
server/tool adapter. That adapter calls the SaaS API over HTTPS with scoped
credentials. The agent can search, create, update, send, or reply through the
same logical integration, subject to approvals. If no human notification is
needed, it returns **`[SILENT]`**.

This is "through app-server" in the lifecycle/control sense, but not a direct
app-server-to-SaaS connector: the MCP server/tool adapter owns the SaaS API
contract. The webhook receiver owns external wake-up ingress.

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
**MCP alone as the wake-up path** (it does not define the durable
webhook-to-`turn/start` bridge), and building a bespoke event bus (the
off-the-shelf receiver + native subscriptions already do it).

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

## Sources checked

- [Codex app-server](https://learn.chatgpt.com/docs/app-server.md): clients
  initialize a connection, start/resume threads, start turns, and consume
  streamed notifications.
- [Codex MCP](https://learn.chatgpt.com/docs/extend/mcp.md): Codex connects to
  STDIO or Streamable HTTP MCP servers for tools and context.
