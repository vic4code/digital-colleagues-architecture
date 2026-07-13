# ADR-017 — The initiator test: channels are justified by who initiates, not by reach

- **Status:** Accepted
- **Date:** Phase 0.5 design review
- **Deciders:** architecture owner

## Context

Midway through Phase 0.5 the design survived every technical challenge
(MCP-as-channel, cron+exec, official-extension risk) but failed a smell test
from its own author: for a single user triggering their own laptop, mailing
`me+vanessa@` is strictly worse than opening the codex app and running a
skill. The discomfort was real and needed a principle, not a rationalization.

The root confusion: "how I interact with AI" (an interface question — apps,
voice, OS-embedded assistants keep improving) versus "who can hand work to a
persistent actor" (a coordination question — identity, addressability,
queueing, audit). Channel integrations answer the second question only. Built
for the first, they are pure overhead.

## Decision

**A channel integration is justified if and only if the initiator is not the
user.** Concretely, build channel/adapter machinery only when at least one
holds:

1. work arrives from someone else (a customer's mail, a teammate's request,
   another agent's delegation),
2. work arrives from something else (a schedule, a webhook, a workflow), or
3. the person reaching the colleague cannot or will not install the agent app.

When the initiator is always the user, the correct architecture is the
official app + skills + MCP tools — no adapter, no channel, no apology.

Consequences for Phase 0.5 scope: the personal email loop is **demoted from
v0.1 shipping plan to reference implementation**. The prototype stays in the
repo as the executable proof of the adapter spec; it is built for real when
the first not-user initiator or first can't-install user actually appears
(the legal scenario satisfies both). Nothing is built "to be ready".

## Alternatives considered

- **Ship the personal email loop anyway (dogfooding).** Rejected: dogfooding a
  coordination system with a population of one initiator tests nothing the
  design actually claims, and its awkwardness would read as evidence against
  the architecture rather than against the mis-scoped pilot.
- **Kill the channel architecture entirely, bet on vendor apps/OS assistants.**
  Rejected: vendor surfaces keep solving the interface question ever better,
  but an OS-embedded assistant is personal by construction — it cannot be a
  team's shared, addressable, audited colleague. The exit clauses in ADR-015
  already cover the day vendors ship the coordination layer natively.

## Consequences

**Easier:** scope disputes end with one question — "who initiates?"; the repo
stops implying that engineers who can run codex should route themselves
through email; effort concentrates on the scenario the design was always for.

**Harder:** no incremental self-serve rollout path; the first real deployment
starts with a real second party (a team, a customer-facing mailbox), which
raises the stakes of the first pilot.

**Follow-up implied:** Phase 0.5 README leads with the initiator test; the
legal MVP (Phase 1) remains the first deployment whose initiators genuinely
are not the user.
