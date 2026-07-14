# ADR-019 — One interaction surface; surrounding services are bidirectional tools

- **Status:** Accepted
- **Date:** Phase 0.5 architecture review
- **Deciders:** architecture owner
- **Supersedes:** [ADR-008](./ADR-008-vdi-presentation-only-channel.md),
  [ADR-009](./ADR-009-source-connectors-distinct-from-channels.md),
  [ADR-010](./ADR-010-email-per-colleague-identity.md),
  [ADR-017](./ADR-017-initiator-test.md)
- **Refines:** [ADR-018](./ADR-018-adopt-openclaw-codex.md)

## Context

Earlier diagrams treated Claw3D, Slack, Teams, email, Linear, and voice as peer
channels in front of the colleague. That is technically implementable, but it
creates the wrong product model: every surrounding service appears to be another
place where a person must learn how to talk to the agent.

People do not become different colleagues when they use a phone or send mail.
They have one identity and one primary face-to-face relationship; phones, inboxes,
calendars, and work systems are tools they use to exchange information and do work.
The digital colleague should follow the same model.

## Decision

From Phase 0.5 onward, each digital colleague exposes **one human-facing
interaction surface**. This is the only component called a **channel**.

Outlook, Gmail, Slack, Teams, Linear, Notion, calendars, and future enterprise
systems are **bidirectional integrations/tools**, not channels:

- service events can trigger or resume the colleague;
- the colleague can read, search, create, update, send, and reply through the
  same integration, subject to its permissions;
- persona, skills, and policy decide when to use an integration; the user does
  not choose a routing adapter before asking for work;
- every inbound event and outbound action is normalized, authorized, and audited
  at the tool boundary.

The single interaction surface is replaceable (web app, desktop app, embodied UI,
or another approved presentation), but only one is presented in a deployment.
Changing that surface is a presentation binding, not a new colleague or a new
business integration.

## Alternatives considered

- **One adapter per human-facing service.** Rejected: it makes service topology
  part of the user experience, duplicates conversation semantics, and encourages
  channel-specific identities.
- **Keep email/Slack as channels only for non-user initiators.** Rejected: the
  initiator distinction is useful for triggers, but does not require a second
  interaction model. An inbound message is a service event; a reply is a tool
  action.
- **Let every integration implement its own task semantics.** Rejected: task
  intake, prioritization, approval, and scheduling belong to the colleague's
  skills and policy, not vendor adapters.

## Consequences

**Easier:** the mental model and diagrams collapse to one relationship between a
person and a colleague; new enterprise services add capabilities without adding
new ways to operate the colleague; inbound and outbound behavior share one
permission and audit boundary.

**Harder:** integrations must support both event intake and actions, not read-only
connectors; service-originated content remains untrusted and needs prompt-injection
controls; the runtime needs a durable event-to-task path even when nobody has the
interaction surface open.

**Follow-up implied:** Phase 0.5 and every later phase must draw one interaction
surface plus a bidirectional integration/tool layer. Phase 3 scales integrations,
workers, and governance; it is no longer a "multi-channel" milestone.
