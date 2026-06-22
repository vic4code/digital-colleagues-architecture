# ADR-001 — File-based state in Phase 0

- **Status:** Accepted
- **Date:** Phase 0 (retroactive)
- **Deciders:** prototype team

## Context

The Phase 0 prototype needed a way to store shared state across multiple agents
(messages, kanban, documents, audit, pending queue) on a developer laptop, with
the constraint that the whole system had to run with **zero infrastructure** —
no database server, no message broker, no cloud account required.

## Decision

We will store all shared state as JSON / JSONL files on the local filesystem,
under `workspace/` (business data) and `runtime/` (system scratch). Concurrency
is handled with `fcntl` file locks where needed.

## Alternatives considered

- **SQLite.** Embedded, no server, would have given us proper transactions and
  queries. Rejected because the prototype needed human-readable, tail-able,
  grep-able state files for debugging — and because adding any binary format made
  the "look at what the agent did" feedback loop slower.
- **Local Postgres / Redis.** Production-shaped, but violates the "zero infra"
  rule and adds setup friction that would have slowed prototype iteration.
- **In-memory only.** Simpler but loses all history on restart, including the
  audit log — unacceptable even for a prototype with legal use cases.

## Consequences

**What gets easier:**

- Debugging: `tail -f`, `jq`, `cat` all just work
- Setup: clone the repo, run `start.sh`, done
- Persistence: file system survives restarts; the busy-queue `pending.jsonl` keeps
  tickets across server restarts atomically
- Inspection: `/kanban/view` and `/audit/view` are just file renderers

**What gets harder:**

- Multi-host: file-based state pins the whole system to one machine
- Concurrency at scale: file locks are fine for 2 colleagues, will not survive 20
- Cross-region / HA: impossible with this design

**Follow-up implied:**

- Phase 1 must externalize state (Postgres + S3 + SQS) before we can run multiple
  worker hosts or autoscale
- The MCP tool interface (`doc_*`, `kanban_*`, `message_*`) was deliberately
  designed to hide the storage, so the migration is a backend swap, not a
  prompt-and-tool rewrite

**Accepted downside:** the prototype cannot be a starting point for the production
system at the storage layer. Phase 1 will replace this layer wholesale.
