# ADR-006 — Audit log storage and retention for legal compliance

- **Status:** Proposed
- **Date:** 2026-06-23
- **Deciders:** (architecture review, legal/compliance stakeholder)

## Context

Legal work has a non-negotiable audit requirement ([overview](../overview/README.md)
Non-negotiable #2): every action by every colleague must be recorded — who, what, when, on what
context, with what permissions — and that record must be tamper-evident and retained for a
legally defined period. Phase 0 writes `audit.jsonl` on local disk, which satisfies "we log
things" but not "the log is immutable and provably complete." Phase 1 must make the audit story
defensible to a regulator or in litigation.

## Decision

Audit events are written to an **append-only, immutable store**: Postgres for queryable recent
audit (with append-only constraints — no `UPDATE`/`DELETE` granted to the application role) and
**S3 with Object Lock (compliance mode) + KMS encryption** for the durable, tamper-evident record,
plus **CloudTrail** for the infrastructure-level "who touched what" layer. Retention is set to the
legally required period (assume **7 years** until legal confirms otherwise — this is the one
number in this ADR that must be validated with the actual stakeholder, not defaulted). Every
human approval gate ([ADR-005](./ADR-005-human-in-the-loop-gates.md)) and every finalized output
writes an audit record; the finalize action is not complete until its audit write is durable.

## Alternatives considered

- **Keep `audit.jsonl` on disk / in normal S3:** rejected. A writable log is not tamper-evident;
  "trust us, we didn't edit it" is not an audit posture. Object Lock makes immutability a property
  of the storage, not a promise of the application.
- **Third-party audit/SIEM SaaS as system of record:** rejected for the authoritative copy —
  reintroduces vendor dependency for a legally load-bearing artifact ([ADR-003](./ADR-003-linear-as-control-plane.md)
  made the same call for Linear). May *additionally* ship events to a SIEM for ops, but the
  authoritative record stays in storage we control with provable retention.
- **Postgres only (no Object Lock layer):** rejected. A privileged DB user can still alter rows;
  Postgres serves query convenience, S3 Object Lock serves the immutability guarantee. We want
  both, with S3 as the tamper-evident authority.
- **Append-only Postgres + S3 Object Lock + CloudTrail (chosen):** queryable, immutable, and
  covers both application-level and infrastructure-level audit.

## Consequences

- **Easier:** a defensible compliance answer; recent audit is queryable for support/debugging;
  immutability is enforced by infrastructure, not discipline.
- **Harder:** immutable storage means mistakes are also permanent (a buggy audit writer fills the
  record with noise you cannot delete) — the audit *schema* and writer need care before go-live;
  Object Lock retention cannot be shortened once set, so the retention number must be right.
- **Follow-up:** **confirm the actual retention period with legal** (7 years is a placeholder);
  define the audit event schema; define legal-hold handling ([Phase 3](../phases/3/README.md)
  lists this) and data-subject/deletion-request handling where it conflicts with immutability
  (a real GDPR-vs-immutability tension to resolve, not wave away).
- **Accepted downside:** immutable, long-retained storage has ongoing cost and operational
  rigidity. For a legal use case this is required, not optional.
