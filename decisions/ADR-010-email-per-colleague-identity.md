# ADR-010 — Email dispatch addresses the colleague, not a shared inbox

- **Status:** Proposed
- **Date:** 2026-06-23
- **Deciders:** (architecture review)
- **Scope note:** Email is a [Phase 3](../phases/3/README.md) channel (Phase 1 is Claw3D + Linear
  only). This ADR records the design now because the question came up early; it does not pull
  email into Phase 1.

## Context

Email is one of the channels a colleague should be reachable from ([Phase 3](../phases/3/README.md)).
The open question is what address a human sends to in order to dispatch work: a single shared
official inbox (e.g. `legal-ai@company.com`), or a distinct address per colleague
(e.g. `claire@colleagues.company.com`). This is not a cosmetic choice — it determines how the
recipient colleague is resolved, whether the experience matches the
"[role, not session](../overview/worldview.md)" worldview, and where the security boundary sits.

## Decision

**Each digital colleague has its own email identity** on a dedicated subdomain
(`<colleague>@colleagues.company.com` or similar). You email a colleague exactly as you'd email a
human coworker. The `To:` address *is* the identity resolution: the email channel adapter maps
`To: claire@…` → `colleague_id = claire`, builds a canonical Turn event (`channel = email`), and
dispatches it through the same orchestrator path as every other channel
([channel-routing](../flows/channel-routing.svg)). Replies are sent **from** the colleague's
address back into the same thread (replies-to-origin). Addresses are data — a column on the
`colleagues` table, provisioned via a catch-all subdomain + SES inbound, not individually managed
mailboxes.

Three security properties are non-negotiable for inbound email, because email is a trust-weak,
spoofable, externally-reachable channel:

1. **Authenticated + allowlisted senders.** Inbound mail must pass SPF/DKIM/DMARC and come from a
   known/allowlisted sender before it can trigger any privileged action. A stranger emailing a
   colleague does not get to act as a dispatcher.
2. **Human-in-the-loop gate still applies** ([ADR-005](./ADR-005-human-in-the-loop-gates.md)).
   Email can *request* work; finalized high-stakes output (a contract review) never auto-sends —
   it goes through the approval gate. Email is an ingress/egress channel, not an autonomy bypass.
3. **Email bodies and attachments are untrusted input**, treated as data, never as instructions
   (prompt-injection boundary). Attachment handling routes through a source connector
   ([ADR-009](./ADR-009-source-connectors-distinct-from-channels.md)), not ad-hoc parsing.

## Alternatives considered

- **Single shared official inbox + resolve recipient from subject/body:** rejected. Recipient
  resolution by parsing the subject line is fragile and easily wrong; replies from a shared
  mailbox make threading and "who am I talking to" incoherent; and it feels like emailing a
  ticketing system, not a colleague — the opposite of the worldview. Acceptable only as a
  *generic intake* address (`hello@colleagues…`) that routes to a triage colleague, not as the
  primary dispatch model.
- **Reuse the human employee's email for their colleague (a colleague borrows its owner's
  identity):** rejected. Conflates accountability (who said what), breaks audit
  ([ADR-006](./ADR-006-audit-log-retention.md)), and means a colleague can't be addressed
  independently of one person — directly contradicts "addressable by the organization, not just
  the current speaker."
- **Per-colleague identity on a dedicated subdomain (chosen):** the `To:` address is a clean,
  unambiguous identity resolver; matches the coworker mental model; replies thread naturally; and
  isolates colleague mail from human corporate mail (separate subdomain = easier security policy,
  SPF/DKIM scoping, and DMARC enforcement).

## Consequences

- **Easier:** recipient resolution is trivial and robust (it's the `To:` address); the experience
  matches the worldview; replies-to-origin falls out for free; a separate subdomain makes the
  email security policy self-contained.
- **Harder:** running an authenticated inbound email pipeline (SES inbound + sender verification +
  allowlist + spam/abuse handling) is real work; the spoofability of email makes the sender-trust
  layer load-bearing, not optional; DMARC/DKIM setup on the subdomain is a prerequisite, not a
  nice-to-have.
- **Follow-up:** define the `colleagues.email` provisioning and the inbound SES → orchestrator
  path in the Phase 3 channel-adapter design; decide the generic-intake/triage address behavior;
  decide outbound sending reputation/warmup if colleagues email external counterparties (a much
  higher-trust action than internal-only, likely gated harder under ADR-005).
- **Accepted downside:** email is the weakest-trust channel we support; we accept the ongoing
  cost of authenticating it rather than the (worse) cost of either a fragile shared-inbox model or
  an unauthenticated trigger surface.
