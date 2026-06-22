# Phase 0 — Prototype

**Status:** ✅ Running. In use by the legal team (manually, low volume).

**Code repo:** `prjt-digital-staff` (Azure DevOps)

## Goal

Prove that the "digital colleague" concept works end-to-end on a single machine,
with the lowest possible infrastructure cost, before committing to cloud architecture.

## Architecture

![Phase 0 architecture](./architecture.svg)

Single FastAPI process. Two hardcoded colleagues (Vanessa = PM, David = SA). Each
colleague is a long-running `codex app-server` subprocess managed by a `DaemonPool`.
All shared state — documents, kanban, messages — lives as JSON/JSONL files on disk.
Frontend is the Claw3D 3D virtual office.

## What works well

- **Zero infrastructure.** One process, one filesystem. Easy to run on a laptop or a single EC2.
- **File-based collaboration is surprisingly capable.** `workspace/messages/messages.jsonl`
  + a fan-out trigger is enough to make two colleagues coordinate.
- **Busy queue (`pending.jsonl`) is well-designed** — the `queued → running → done` state
  machine with atomic claim survives restarts and won't double-process.

## What won't survive into Phase 1

- **Single FastAPI process is the SPOF.** No HA, no horizontal scale.
- **File-based state means single host.** Can't run two workers safely.
- **Per-agent long-lived subprocess.** Doesn't scale beyond ~10 colleagues per host;
  no way to autoscale; restart loses thread context.
- **Hardcoded `KNOWN_AGENTS`.** Adding a colleague requires code change + redeploy.
- **No auth, no tenancy, no RBAC.** Fine for one team, not for enterprise.

## What we want to keep

- The **fan-out trigger pattern** (server detects `message_send` → spawns recipient turn)
- The **busy-queue state machine** — translates directly to SQS-based architecture
- The **Claw3D UX** — 3D office is the differentiator, not a throwaway
- The **MCP tool layer** — `doc_*`, `kanban_*`, `message_*`, `memory_*` are the right
  abstraction; the implementation behind them just gets swapped out
- The **persona-as-data approach** (`agents/<id>/cwd/AGENTS.md` + `memory/`)

## Migration path

See [Phase 1](../20-phase1-legal-mvp/) for the next step.
