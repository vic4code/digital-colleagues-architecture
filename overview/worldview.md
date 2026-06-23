# Worldview — what a digital colleague fundamentally is

This document exists because the concept is genuinely abstract, and it's worth being honest
about that instead of hiding it behind diagrams. Read this before any phase doc.

## The core claim

**A digital colleague is a role, not a session.**

Claude and Codex are already extraordinary minds on demand. That's not in dispute — when you
open a session, you get a colleague-grade collaborator right now. But that mind has no
existence *between* your prompts. It doesn't continue thinking when you close the window. It
can't be reached except by you personally opening a door to it. It isn't a "someone" the rest
of an organization can refer to, route work to, or check in on — it only exists as an
extension of whoever is currently typing to it.

The platform's entire job is to give that mind **continuity of existence as a role**:

- A name and a place in the org (Vanessa is the PM, Claire reviews contracts)
- A queue of incoming work that doesn't require you personally to hand it over
- A memory that survives across sessions, processes, and machines
- The ability for *other people, and other agents*, to reach it and observe its state —
  not just the one human who happened to open the first session

This is the actual answer to "isn't Claude already my digital colleague?" — yes, for you,
right now, in this window. The platform is what turns "a mind I can talk to" into
"a colleague the organization can work with," whether or not you're the one currently
looking at it.

## The four capabilities that make this real, not just rebranding

These map directly to the four things raised as the differentiators, and each one is a real
piece of engineering, not a marketing word:

1. **Group.** Colleagues address each other, hand off work, and can be reasoned about as a
   team — not N independent chat windows that happen to share a company name.
2. **Multimodal / voice triggering.** A colleague is reachable through whatever channel a
   human is already in (voice, Slack, Linear, Claw3D) without becoming a different colleague
   each time. The channel is metadata, not identity. (See [flows/channel-routing.svg](../flows/channel-routing.svg).)
3. **Scheduling / proactivity.** A colleague can act because a schedule, an event, or its own
   plan triggered it — not only because a human just typed a message. This is the load-bearing
   difference between "assistant you summon" and "colleague who has a job."
4. **Autonomous task intake + independent reasoning, in role.** A colleague can receive new
   work without a human personally routing it (a Linear assignment, an inbound email), reason
   about it using its own persistent context, and act *within the bounds of its role* — not
   with unconstrained free will, but with the same bounded discretion a human employee has
   inside their job description.

None of these four exist in a bare Codex/Claude Code session. All four require the
orchestration layer this repo is designing.

## Where this is genuinely fuzzy (not yet resolved — flagged honestly)

- **What "independent reasoning" means operationally is undefined.** Is it periodic
  re-planning against a goal (cheap, bounded, inspectable)? Self-initiated action with no
  trigger at all (expensive, much harder to bound, closer to the generative-agents/AgentSociety
  research framing we explicitly rejected for production use)? We have not picked a model.
  This is the single most important open question in this document — it determines whether
  Non-negotiable #1 (human-in-the-loop) and "autonomous reasoning" are compatible or in tension.
- **Voice/always-on presence is a different beast than "another channel."** Treating voice as
  just another channel adapter (current design) assumes request/response. An always-listening
  presence implies continuous audio processing, a different privacy model, and probably a
  different trigger architecture (wake-word / ambient attention) than "colleague replies when
  spoken to." We haven't decided which of these voice actually means yet.
- **What triggers proactive action is unspecified.** Calendar tick? Linear webhook? The
  colleague's own reflection loop deciding something is worth surfacing (à la generative_agents'
  planning/reflection pattern)? Each implies a very different runtime — a cron-like scheduler is
  simple and boring; a self-initiated reflection loop is the hardest, least bounded thing in
  this entire document.
- **The boundary of "one colleague" vs "the org chart" is undrawn.** At what point does a
  colleague's role get split into two? We have no model yet for when a colleague should be
  decomposed, beyond "currently it's just Vanessa and David, hardcoded."
- **How much standing/continuous compute a colleague consumes when no one is asking it
  anything is unknown.** "Exists as a role" could mean "spun up on demand, looks continuous
  from outside" (cheap) or "actually running a loop all the time" (not cheap, not obviously
  necessary). We have defaulted to the former implicitly but never said so explicitly.

## Risks

- **Scope-creep risk.** Voice, scheduling, and autonomous initiative are each a real project on
  their own. Building all three before the basic group/dispatch problem (Phase 1) is solid is
  exactly the premature-generalization trap the phase structure in this repo exists to avoid.
  None of the four capabilities above should be staffed before Phase 1 ships.
- **Trust/safety risk — this is the sharp edge.** Every unit of "independent reasoning" we add
  is a unit of erosion against Non-negotiable #1 (human-in-the-loop for high-stakes work). The
  more a colleague "thinks for itself," the harder it is to guarantee a human saw the decision
  before it had effect. This isn't a detail to solve later — it has to be designed in lockstep
  with whatever autonomy model we pick, or we will ship something we can't safely operate in
  legal/contract contexts specifically.
- **Accountability risk.** If a colleague takes initiative inside its role and is wrong, who
  is responsible — the colleague's "owner," the team that wrote its persona, the platform? This
  is an organizational question, not just a technical one, and legal will ask it before
  granting any autonomy beyond reactive Q&A.
- **Cost/runaway risk.** Proactive, always-reasoning agents have a fundamentally different cost
  profile than request/response agents. Without a hard ceiling (this is exactly what `/goal`
  and bounded continuation turns in [ADR-007](../decisions/ADR-007-symphony-inspired-orchestration.md)
  are for), "the colleague keeps thinking" can become "the colleague keeps spending."
- **Conceptual risk — anthropomorphizing past what's useful.** "Role, not session" is a useful
  design metaphor. It stops being useful the moment it's used to justify giving a colleague
  open-ended free will instead of a tightly scoped, auditable automation boundary. The research
  projects surveyed (AgentSociety, OASIS, generative_agents) optimize for believable autonomous
  behavior *because that's their research goal*; we are explicitly not optimizing for that, and
  language that implies otherwise will mislead design decisions later.
