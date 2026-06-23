# ADR-012 — Worker → orchestrator streaming return path

- **Status:** Proposed
- **Date:** 2026-06-23
- **Deciders:** (architecture review)

## Context

[ADR-004](./ADR-004-worker-pool-externalized-state.md) decouples the orchestrator from workers via
SQS: the orchestrator enqueues a turn, a worker dequeues and runs it. SQS is the right tool for
*one-way dispatch*. But the user watching Claw3D expects to see the colleague's output stream in
live (token by token, tool call by tool call) over an SSE connection the orchestrator holds open.
SQS does not carry events *back* to the specific orchestrator task holding that user's connection.
The [Phase 1 diagram](../phases/1/architecture.svg) shows "SSE stream" on the orchestrator and
"stream events" on the worker but glosses the path between them. This ADR fills that gap.

## Decision

Workers publish turn events to a **low-latency pub/sub channel keyed by turn/session id**; the
orchestrator task holding the client's SSE connection **subscribes** to that key and forwards
events to the browser. The pub/sub layer is **Redis (ElastiCache) Pub/Sub** in Phase 1.

- Channel key: `turn:{turn_id}` (or `session:{session_id}`).
- Worker → publishes incremental events (tokens, tool-call start/finish, status) as it runs.
- Orchestrator → on accepting the request, subscribes to that key before/at enqueue time, relays
  each event out over SSE, and closes the subscription when the turn reaches a terminal state.
- **Durable state still goes to Postgres/S3** (ADR-004) — pub/sub carries the *live* stream only;
  it is not the source of truth. A late-joining or reconnecting client replays from the durable
  record, then resubscribes for the tail. This keeps the stream loss-tolerant: dropping a pub/sub
  event degrades liveness, never correctness.

## Alternatives considered

- **Poll Postgres for new events:** rejected as the primary path — polling adds latency and DB
  load, and "stream live tokens" by polling is a bad fit. Postgres remains the durable record and
  the replay source on reconnect, just not the live transport.
- **A second SQS queue worker → orchestrator:** rejected. SQS has no fan-out-to-the-right-
  subscriber semantics; the event must reach the *one specific* orchestrator task holding the
  socket, and SQS competing consumers can't target that. (SNS/EventBridge have the same
  wrong-shape problem for per-connection routing.)
- **WebSocket API Gateway managing connections:** rejected for Phase 1 — pulls in API Gateway we
  deliberately avoided ([ADR-011](./ADR-011-alb-not-api-gateway.md)) and adds a connection store;
  heavier than Redis Pub/Sub for first-party SSE.
- **Sticky-session the user directly to the worker:** rejected. Workers have no inbound port and
  are disposable (ADR-004); binding a user's live connection to a specific worker reintroduces the
  per-process coupling Phase 1 exists to remove.
- **Redis Pub/Sub relay (chosen):** simple, low-latency, fan-out by key, and keeps workers
  port-less and the orchestrator as the only socket-holder.

## Consequences

- **Easier:** workers stay stateless and port-less; any orchestrator task can serve any client;
  live streaming is decoupled from durable writes; stream loss degrades gracefully (replay from
  Postgres) rather than corrupting state.
- **Harder:** adds ElastiCache/Redis to the Phase 1 footprint (one more managed dependency to run,
  secure, and pay for); requires defining the event schema and the reconnect/replay protocol
  (replay durable tail from Postgres, then resubscribe).
- **Follow-up:** specify the turn-event schema (shared by durable log and pub/sub); define the
  reconnect handshake; decide Redis Pub/Sub vs. Redis Streams if at-least-once replay of the
  *live* channel (not just the durable record) turns out to be needed; revisit at
  [Phase 3](../phases/3/README.md) scale (10k+ concurrent turns) whether Pub/Sub fan-out holds or
  needs sharding.
- **Accepted downside:** one more piece of infrastructure than "just SQS + Postgres + S3." We
  accept it because live streaming is core to the Claw3D experience and there is no clean way to
  do per-connection event routing with the dispatch queue alone.
