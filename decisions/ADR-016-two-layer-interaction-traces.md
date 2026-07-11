# ADR-016 — Two-layer interaction trace retention

- **Status:** Proposed
- **Date:** Phase 0.5 design
- **Deciders:** architecture owner

## Context

Digital colleagues only work as *governed* colleagues: every interaction — who
asked, what the colleague did, which tools it touched, what it sent back, and
which colleague delegated to which — must be preserved and correlatable. With
ADR-015 removing our custom dispatcher, we no longer own a single choke point
that sees everything; we must define where traces come from in a harness-native
architecture, on edge devices that are sometimes offline.

## Decision

Retain traces in **two layers with one correlation id**, capturing what already
flows rather than inventing an interception layer:

1. **Business audit layer** — the channel adapter is a JSON-RPC client and
   therefore already receives the harness event stream (agent messages, tool
   calls, approvals). It appends each event to `traces/audit.jsonl`:
   `{trace_id, channel, requester, colleague, session_id, event, ts}`.
2. **Harness rollout layer** — codex itself writes full session rollouts
   (`~/.codex/sessions/*.jsonl`): every message, reasoning step, tool I/O.
   We treat these as the forensic source of truth and never re-serialize them.

The correlation id links a channel message id to a codex session id, so an
auditor traverses reply → audit record → full rollout. **Co-work traces need no
extra machinery:** a native sub-agent spawn appears in the parent session's
rollout and event stream, so A→B delegation is one linked trace; cross-device
co-work rides the channels and is captured as ordinary channel traffic.

Each device syncs `traces/` (and rotated rollouts) to a shared store
(SharePoint / S3 / network share) nightly. That sink is the same audit backbone
Phase 1 formalizes into Postgres + S3 (ADR-006 governs retention periods).

## Alternatives considered

- **Audit only in the adapter (one layer).** Simpler, but loses reasoning detail
  the rollouts already contain — and legal review needs the "why", not just the "what".
- **Proxy/wrap the LLM API to log everything centrally.** Sees tokens, not
  semantics (no tool-call structure, no session boundaries); breaks with harness
  streaming changes; another fork tax.
- **Real-time streaming to a central collector from day one.** Wrong for edge —
  devices are offline daily; nightly sync with local durability is honest.

## Consequences

**Easier:** zero custom instrumentation inside the runtime; audit survives
adapter bugs (rollouts still exist) and vice versa; the Phase 1 migration is a
sink swap, not a schema invention.

**Harder:** traces sit on user devices until sync — device loss loses up to a
day (mitigate: sync on adapter start too); two formats to correlate at query
time; `~/.codex/sessions` layout is upstream-owned and may change between
harness versions (pin + adapt the shipper per release).

**Follow-up implied:** the shared store needs access control before the first
non-pilot user — rollouts contain full document contents.
