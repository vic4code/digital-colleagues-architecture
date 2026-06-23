# ADR-009 — Source connectors are a distinct abstraction from channel adapters

- **Status:** Proposed
- **Date:** 2026-06-23
- **Deciders:** (architecture review)

## Context

Real business documents — contracts especially — often don't live in a system we control. They
live in SharePoint (or Teams, which stores files via SharePoint underneath). Phase 1's sketch
assumes S3 is *the* document store. That's wrong once a team's source of truth is SharePoint:
S3-as-canonical only holds if every document originates inside our platform, which won't be true
in practice. We also already have a separate concept — **channel adapters** (Phase 3) — for where
*conversations* originate (Slack, Teams, Linear, Claw3D). Microsoft Teams sits in both categories
at once (a chat channel, and a thin wrapper over SharePoint file storage), which is exactly the
sign that we're conflating two different concerns under one word.

## Decision

We split "external system integration" into two distinct abstractions that compose independently:

1. **Channel adapters** (already defined, [Phase 3](../phases/3/README.md)) — normalize *where a
   human or event triggers a turn* into a canonical Turn event. Answers "how does a colleague get
   asked to do something." Slack, Teams (as chat), Linear, Claw3D, email.
2. **Source connectors** (new) — resolve *where actual business content lives* and provide a
   uniform read/write interface over it, regardless of backend. Answers "where does the colleague
   get/put the actual document." SharePoint (via Microsoft Graph API), S3, and later anything
   else (Google Drive, a DMS, an ERP) implement the same connector interface.

A document referenced in a turn carries a `source_connector` + `source_ref` (e.g.
`sharepoint://{site_id}/{drive_id}/{item_id}`), not an assumed S3 key. S3 remains in the
architecture, but as the **default connector for content we originate ourselves** (audit
snapshots, generated drafts, working copies) — not as the only place a document can live.
This is the same "no vendor lock" principle already applied to the LLM backend
([overview/README.md](../overview/README.md) Non-negotiable #5), now applied to storage.

Microsoft Teams is registered as *two* integrations under this model: a channel adapter (chat
triggers) and, via the same Graph API credentials, a source connector (file access) — they happen
to share auth, not architecture.

## Alternatives considered

- **Keep S3 as the sole canonical store, sync SharePoint into it:** rejected as a default —
  one-way or two-way sync adds a consistency/staleness problem (which copy is authoritative when
  a lawyer edits the SharePoint copy directly?) and most teams will not accept their canonical
  document being silently mirrored into a system their compliance hasn't reviewed. Acceptable as
  an *opt-in* caching layer per ADR-007's tracker+storage durability model, not as the default.
- **Treat SharePoint purely as a channel adapter (since Teams already is one):** rejected — file
  storage and conversation triggers have different read/write semantics (versioning, permissions,
  large binary content vs. short event payloads) and forcing them through one interface would
  make the channel adapter contract significantly more complex for every other channel that has
  no file-storage dimension at all (Linear, Slack messages).

## Consequences

- **Easier:** adding a new document backend (Google Drive, a DMS) is implementing one connector
  interface, not redesigning the channel layer or the worker's document-handling logic.
- **Harder:** every document reference in the system now needs a connector-qualified address
  instead of an assumed S3 key — touches the kanban/doc MCP tool layer (`doc_*`) contract, which
  needs to be extended, not just the storage backend swapped per
  [ADR-001](./ADR-001-file-based-state-in-phase0.md)'s precedent.
- **Follow-up:** Phase 1's "Migration from Phase 0" table should note `workspace/docs/` maps to
  "S3 connector (default)," not assume S3 unconditionally; Phase 2's persona/skill library should
  record which source connectors a given colleague/tenant is permitted to read/write.
- **Accepted downside:** SharePoint via Graph API means contract content does, at read/write time,
  pass through whatever network path connects our compute to Microsoft 365 — if a team's data
  sovereignty requirement is stricter than "stays inside the M365 tenant," this needs its own
  conversation per team (related to [ADR-008](./ADR-008-vdi-presentation-only-channel.md)'s
  per-team connectivity negotiation, same shape of problem, different system).
