# Overview

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
