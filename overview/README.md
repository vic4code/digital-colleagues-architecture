# Overview

**Start here if the whole concept still feels abstract:** [worldview.md](./worldview.md) is the
honest version — the core claim, what's genuinely unresolved, and the risks. This document below
is the reference version once the worldview lands.

## What we're building

A platform of **digital colleagues** — AI agents with distinct personas, skills, and
memory who collaborate with humans (and each other) on real work, starting with
**legal contract review** and generalizing to any business scenario.

The vision: a 1000-person company has 100s–1000s of digital colleagues, each backed
by an LLM agent with persistent identity, persistent memory, scoped permissions,
and the ability to take meaningful actions in our systems on behalf of the team.

## What this is **not**

- Not a chatbot platform — agents are colleagues, not assistants behind a chat box
- Not a one-shot RPA replacement — agents reason and adapt, not script-follow
- Not autonomous — humans stay in the loop for high-stakes decisions (especially legal)

## Relationship to Codex / Claude Code

Codex (`app-server`) and Claude Code are **single-agent execution runtimes**. They solve
"run a session, call tools, stream turns back" — for one agent, one process, one machine.
They have no concept of other agents, no idea what host they're running on, and no built-in
way to dispatch work across a fleet. They are the engine, not the organization.

A **digital colleague** is a layer above that: a persistent identity (persona + memory +
scoped permissions, stored as data) that is *backed by* one of these runtimes at any given
moment, but is not *the same thing as* the runtime instance executing it. The platform's job
is to take many such runtimes and make them behave like an observable, dispatchable group —
not a pile of unrelated single-player tools.

Concretely, the platform adds three things no agent runtime provides on its own:

1. **Group interaction.** Colleagues message each other and hand off work (the fan-out
   pattern). A bare Codex session has no notion that another agent even exists.
2. **Observability across the group.** The orchestrator tracks who's busy, who's idle, how
   long a turn has been running, whether something is stuck — state that lives outside any
   single runtime process, because the runtime itself only knows about itself.
3. **Cross-machine, cross-network dispatch.** A colleague's identity is decoupled from the
   specific process and machine executing it right now. If the host running "David" goes
   away, a new worker on a different host can pick up "David" — same persona, same memory,
   same permissions — because identity lives in shared state, not in a process.

One sentence: **Codex/Claude Code answers "how do I get one agent to finish one piece of
work"; the digital colleague platform answers "how do I turn many such agents into a managed
organization with identity, observability, and dispatch."** The runtime is a replaceable part
of the platform, not the platform itself — this is also the substance behind Non-negotiable #5
below (no vendor lock).

## Audiences for this repo

| Audience | Reads | Cares about |
|---|---|---|
| Engineering team | All of it | How it works, trade-offs, migration |
| Architects / staff eng | Phase 1+, ADRs | Why these choices, what we rejected |
| Legal / compliance | Phase 1 context + contract-review flow | Auditability, data flow, human-in-the-loop |
| Leadership | Overview + phase summaries | Cost, timeline, risk |

## Glossary

| Term | Meaning |
|---|---|
| **Digital colleague / staff** | An LLM agent with a persistent persona, scoped tools, and memory |
| **Agent** | The runtime side of a digital colleague (the executing process / worker) |
| **Persona** | The colleague's identity, role, voice, and behavior rules (data, not code) |
| **Session** | A conversation thread with one colleague (or one task run) |
| **Memory** | Persistent state across sessions: facts, preferences, prior decisions |
| **Skill** | A bundled capability the colleague can invoke (e.g. `contract-review`, `brd-writing`) |
| **Workspace** | Shared business artifacts (docs, kanban, messages) all colleagues see |
| **Channel** | How humans reach colleagues: Claw3D, Slack, Teams, Linear, email, etc. |
| **Goal** | A success criterion that bounds an agent's autonomous loop |
| **Codex / Claude Code / app-server** | Vendor agent runtimes we build on (no vendor lock at the platform layer) |
| **Linear sprint board** | The current control plane for task dispatch and status |

## Non-negotiables

These hold across **every** phase. They are not implementation details, they are
product constraints.

1. **Human-in-the-loop for high-stakes work.** Legal contract output, financial
   actions, anything customer-facing — agent proposes, human approves. Always.
2. **Auditability.** Every action by every colleague is logged: who, what, when,
   based on what context, with what permissions. Immutable.
3. **Identity, memory, and tools are data.** A digital colleague is not a deployed
   service. Adding a colleague is a config change, not a CI/CD push.
4. **Channels are pluggable.** The same colleague is reachable from Claw3D, Slack,
   Linear, etc. — different interface, same identity and memory.
5. **No vendor lock at the platform layer.** Codex today, maybe Claude or open
   models tomorrow. The orchestrator owns the agent abstraction.
