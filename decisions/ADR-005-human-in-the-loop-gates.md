# ADR-005 — Human-in-the-loop gates for contract output

- **Status:** Proposed
- **Date:** 2026-06-23
- **Deciders:** (architecture review, legal stakeholder)

## Context

[Overview](../overview/README.md) Non-negotiable #1 says humans stay in the loop for high-stakes
work. Phase 1 *is* the high-stakes case: legal contract review. We need to decide this concretely
— not "be careful," but where exactly in the turn lifecycle a human approval is mandatory, what
the colleague is and isn't allowed to do without it, and how the gate is enforced rather than
merely encouraged. The [worldview](../overview/worldview.md) risk section is explicit that every
unit of autonomy erodes this guarantee, so the gate must be structural.

## Decision

A colleague **proposes**; a human **approves**; only then does output become final or leave the
system. For contract review specifically: the colleague may read, analyze, draft a review, and
produce a risk report freely — but the transition to a *finalized* artifact (the thing a lawyer
relies on, sends, or files) requires an explicit human approval action recorded in the audit log
([ADR-006](./ADR-006-audit-log-retention.md)). The gate is enforced at the **tool/state layer**,
not the prompt: there is no tool path by which a colleague marks its own output final. The
finalize action is a separate, human-only operation. This is the gate drawn as step ⑪ in
[flows/contract-review.svg](../flows/contract-review.svg).

## Alternatives considered

- **Prompt-level instruction ("always ask a human before finalizing"):** rejected as the *sole*
  mechanism. Prompts are guidance, not guarantees; a single prompt regression or jailbreak
  removes the safety property. The gate must exist even if the model misbehaves.
- **Approve every turn / every tool call:** rejected as too heavy — it makes the colleague
  useless for the 90% of work (reading, drafting, iterating) that is low-stakes and reversible,
  and trains humans to rubber-stamp. Gate the irreversible/high-stakes transition, not everything.
- **Confidence-threshold auto-approval (auto-finalize when the model is "sure"):** rejected for
  Phase 1 legal. Model confidence is not a legal accountability mechanism, and "the AI was
  confident" is not a defensible answer to a lawyer or regulator.
- **Propose/approve gate enforced structurally (chosen):** the colleague does all the work up to
  the gate; the irreversible step is mechanically reserved for a human.

## Consequences

- **Easier:** a clear, auditable accountability story for legal/compliance ("a named human
  approved this, here's the record"); the colleague stays useful for everything before the gate.
- **Harder:** the product must make the approval step low-friction or humans will route around it;
  defining "finalized vs. draft" precisely per scenario is real design work (legal is clear;
  generalizing to [Phase 2](../phases/2/README.md) scenarios needs a per-workflow gate definition).
- **Follow-up:** Phase 2's workflow templates must carry the gate as a first-class step, not bolt
  it on; define who is *authorized* to approve (ties into Phase 2 RBAC); decide gate behavior for
  any future proactive/autonomous colleague (the worldview's open question — autonomy and this
  gate are in direct tension and must be designed together).
- **Accepted downside:** colleagues are deliberately *not* fully autonomous on high-stakes output.
  That is the point, not a limitation.
