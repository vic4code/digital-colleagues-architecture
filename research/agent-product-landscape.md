# Agent product landscape — build-vs-buy for digital colleagues

**Status:** Decision-support survey. Feeds the build-vs-buy meeting follow-ups.

> **Premise.** Shipping digital colleagues is a **committed product direction**,
> not an open question. This survey answers *"where do we draw the product
> boundary so we ship fastest"* — every "take it off the shelf" recommendation
> exists to **concentrate product effort on the product**, not to shrink ambition.
> The product is a *digital colleague* (identity, governance, skills, evaluation,
> lifecycle, mentor→autonomy), **not an agent framework**; Codex and OpenClaw are
> **suppliers**, the way a SaaS product doesn't write its own database.
> Hermes Bot Mode, Grok Bot, and OpenBot are **competitors** in this space — we
> learn from them, we don't source from them.

**One sentence:** the question is *not* "which agent framework do we pick"; it is
*"which capability layers are our product, which are commodity parts, and who
maintains the result."* This doc gives the layer model, a per-product comparison
with architecture components and trade-offs, and direct answers to the meeting's
open questions. The full product-facing recommendation (zh-TW) is in
[digital-colleague-direction.zh-TW.md](./digital-colleague-direction.zh-TW.md).

> **Sourcing note.** Codex claims are checked against OpenAI's docs (linked at the
> end). Claims about OpenClaw, Hermes, Grok Bot, and OpenBot come from our own
> landscape research and are marked *(research)* — verify against each vendor's
> current docs before any commitment. Product capability tables move fast.

---

## 1. A digital colleague is layers, not one product

A digital colleague is a **long-lived AI actor with a role, capabilities, and a
permission boundary.** The runtime underneath is replaceable. Decompose it:

```text
Digital Colleague
├─ Identity / Persona / Role          ← who it is
├─ Memory / Skills / Routine          ← what it knows & can do over time
├─ Channel / Trigger / Proactivity    ← how it is reached & how it wakes itself
├─ Governance / Approval / Audit      ← what it is allowed to do, provable
├─ Agent Runtime                      ← how it thinks & executes (replaceable)
└─ Tools / MCP / Computer Use         ← what it can touch
```

**Design consequence:** we do not need to *build* all six. We need to decide, per
layer, *keep / off-the-shelf / build-thin*. Most of the value we'd add is in the
top four (identity, memory-as-product, proactivity, governance); the bottom two
(runtime, tools) are where off-the-shelf is strongest.

---

## 2. What each product actually solves

| Product | What it is | Core strength | Architecture components |
|---|---|---|---|
| **Codex App** | Full agent *product* (desktop/web/IDE) | Product UX: projects, diff/terminal UX, automation UX, review, multi-agent, computer use | Desktop UI · projects · worktree orchestration · notifications · OS integration · **+ everything App Server has** |
| **Codex App Server** | Codex's runtime / harness API (JSON-RPC) | The real agent capability, headless & embeddable | thread · turn · tool · shell · file · skills · plugins · approval · sandbox · streamed events |
| **OpenClaw** *(research)* | Outer orchestration around a runtime | Persistent agent: channels, lifecycle, proactivity | identity · session routing · cron/heartbeat · event/webhook · approval/routing · workspace files |
| **Hermes Agent** *(research)* | Autonomous agent runtime | **Agent learning** & memory | memory · skills · agent learning loop · cron/heartbeat · profile |
| **Hermes Bot Mode** *(competitor)* | Profile → "a colleague" wrapper | Turns a profile into a persistent AI coworker identity | profile packaging · persistent presence |
| **Grok Bot** *(competitor)* | Productized AI coworker | **Coworker product UX** | Bot · persistent computer · Skill · Routine · teach-by-demonstration · **no bot-to-bot protocol** (see note) |
| **OpenBot** *(competitor)* | Open AI-coworker platform | **Enterprise governance** | governance gateway · audit · permission · computer isolation |

### Evidence: a productized AI coworker ships **no** agent-to-agent layer

A community reconstruction of Grok Bot 0.18 desktop
([grok-bot-0.18-reconstructed](https://github.com/b-nnett/grok-bot-0.18-reconstructed))
shows a **single-agent architecture with provider routing** — no bot-to-bot
protocol, no delegation, no team coordination. Its `node-agent-coordinator`
coordinates *plumbing* (renderer ↔ main ↔ host ↔ providers: `inference-router`,
`routed-mcp-bridge`, port clients), not multiple agents. What it does invest in
is a **persistent computer** (remote box / local Docker connectors), MCP tools,
and provider routing.

**Read:** the productized competitor bet on **depth** (make one colleague
capable, give it its own computer) over **breadth** (many colleagues
coordinating). This is direct support for deferring A2A, and for sequencing a
persistent execution environment + skill library *before* any multi-colleague
coordination. *(Caveat: a community reconstruction of a desktop build, not
official source; the commercial product may differ.)*

### Codex App vs Codex App Server — the crux of build-vs-buy

Both run the **same Codex harness** (same models, same agent loop). The split:

- **App Server** = the harness exposed as a bidirectional JSON-RPC API: threads,
  turns, tools, shell, files, skills, plugins, approvals, sandbox, streamed
  events. This is *most of the real "Codex can do things" capability*, headless.
- **Codex App** = App Server **plus** a closed-source product layer: desktop UI,
  projects, worktree orchestration, diff/terminal UX, automation UX, remote
  control, notifications, OS integration, some product-specific state.

**Therefore:** `App Server ≠ the full Codex App product`. OpenClaw + App Server
can reproduce most of *what Codex does*, but **not automatically** the Codex App
*UX and product orchestration*. That gap is exactly what a "Digital Colleague
product layer" would add — or what Codex App gives you for free if you adopt it.

---

## 3. Coverage matrix — who covers which layer

Legend: ● strong · ◐ partial · ○ little/none · *(research = unverified)*

| Layer | Codex App | Codex App Server | OpenClaw | Hermes | Grok Bot | OpenBot |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| Identity / Persona / Role | ◐ | ○ | ● | ◐ | ● | ◐ |
| Memory / Skills / Routine | ◐ | ◐ (skills/plugins) | ◐ | ● | ● | ◐ |
| Channel / Trigger / Proactivity | ◐ (automation) | ○ | ● | ● | ◐ | ◐ |
| Governance / Approval / Audit | ◐ | ◐ (approval/sandbox) | ◐ | ○ | ○ | ● |
| Agent Runtime | ● | ● | ○ (wraps one) | ● | ● | ◐ |
| Tools / MCP / Computer Use | ● | ● | ◐ (via runtime) | ◐ | ● | ◐ |
| **Product UX (build/edit/deploy)** | ● | ○ | ○ | ◐ | ● | ◐ |

*(A rendered version of this matrix is in [`agent-product-matrix.svg`](./agent-product-matrix.svg).)*

**Read-off:** no single product is strong across all rows. The bottom two rows
(runtime, tools) are commoditized — Codex wins there and we should not rebuild
them. The differentiated value lives in the top rows, spread across OpenClaw
(proactivity), Hermes (learning), Grok Bot (product UX), OpenBot (governance).

---

## 4. Recommended layer ownership

The synthesis, as a one-liner per contributor:

> **Codex** gives *brain + execution*. **OpenClaw** gives *lifecycle +
> proactivity*. **Hermes** gives the *learning model*. **Grok Bot** gives the
> *AI-coworker product UX*. **OpenBot** gives the *enterprise governance* shape.

So our decision is **not** "pick a new framework." It is:

| Layer | Recommendation | Rationale |
|---|---|---|
| Agent Runtime | **Off-the-shelf: Codex App Server** | Commodity, best-in-class, don't rebuild |
| Tools / MCP / Computer Use | **Off-the-shelf: Codex + MCP** | Same |
| Channel / Trigger / Proactivity | **Keep in OpenClaw** | It already solves persistence/cron/webhook |
| Identity / Persona | **Author (workspace files)** | This *is* the colleague; thin, ours |
| Memory / Learning | **Build-thin, borrow Hermes patterns** | The real gap #2 |
| Governance / Approval / Audit | **Build-thin, borrow OpenBot patterns** | The real gap #3, enterprise-blocking |
| Product UX (build/edit/deploy) | **Decide by maintainer (see §6)** | Codex App vs a thin colleague console |

**The three real gaps** (not agent capability — that's covered):

1. **Productization** — create colleague · edit persona · manage skill/routine ·
   teach/correct · view activity · deploy/retire. *(borrow Grok Bot, Hermes Bot Mode)*
2. **Agent learning** — experience → reflection → memory/skill → evaluation →
   reuse. *(borrow Hermes)*
3. **Enterprise governance** — action → policy → approval → audit → execute.
   *(borrow OpenBot)*

---

## 5. `.codex` vs `.state` — don't conflate them

The single most important state distinction:

```text
OpenClaw / wrapper
├─ .state/                 ← OUTER system state: how we manage Codex
│  └─ session↔thread map · process/PID · connection · broker/lifecycle metadata
│
└─ Codex App Server
   └─ ~/.codex/            ← CODEX canonical state: what Codex remembers
      └─ auth · config · sessions/threads · state DB · memories · goals · skills · plugins
```

- `~/.codex/` = **Codex's own home** — the colleague's durable brain-state.
- `.state/` = the **outer system's bookkeeping** of how it runs Codex.
- Note: `~/.codex/state_*.sqlite` is *still Codex canonical state* despite the
  name — it is **not** the outer `.state/`. Back up and migrate `~/.codex/`
  as the colleague's identity+memory; treat `.state/` as reconstructable.

**Ops consequence:** portability of a colleague = portability of `~/.codex/`
(+ the authored workspace files). This matters for the Day-2 / VM question below.

---

## 6. Answers to the meeting's open questions

**Q1 — Can Codex App be *a* way to implement a digital colleague?**
Yes, as a candidate, not a wholesale replacement. For non-engineers (legal,
governance), Codex App's UI + natural-language operation + Skills/Automation is
far more usable than VS Code/CLI. It is **not** automatically a full digital
colleague (no independent identity, org governance, or unattended cross-user
work out of the box). Keep it on the shortlist *per scenario and per maintainer*.

**Q2 — Separate "developer interface" from "end-user interface."**
- *Developers* may use Codex App / CLI / VS Code / our current custom stack.
- *End users* likely never touch Codex — they reach the colleague through Teams /
  Outlook / a dedicated colleague surface. This is exactly ADR-019 (one
  interaction surface for humans). The dev tool and the end-user surface are
  **different decisions**; don't let one dictate the other.

**Q3 — Does the colleague need an independent identity?**
Not all agents do. Split identity into three levels and decide per level:

| Level | What it is | Needed when |
|---|---|---|
| **L1 · Role identity** | role, persona, skills, memory | **essentially always** |
| **L2 · System identity** | service account, OAuth, permissions, audit trail | the agent **operates enterprise systems on its own** |
| **L3 · Human-facing identity** | `Legal Digital Colleague` in Teams, `legal-agent@company` | the agent **mails out on its own, approaches others, or completes work without its owner in the loop** |

Key corollary: **decouple identity from compute.** "Has a persona" must not imply
"needs its own machine and its own accounts." (L3 is the ADR-017 initiator test
in another form.)

**Q4 — The real blocker is Day-2 ops, not capability.**
If a colleague needs a dedicated Windows machine / VM running long-term, the
unanswered questions are organizational: who maintains it, who powers it on, how
are its accounts managed, who handles failures, who may change it. **These must
have owners before go-live, even if the tech works.** Portability (§5:
`~/.codex/` + workspace files) reduces but does not remove this.

**Q5 — Validate by real-scenario head-to-head before committing.**
Take a real task (e.g. legal contract review / highlighting) and compare our
current custom colleague vs Codex App on: **completion rate · accuracy ·
efficiency · maintenance cost.** If Codex App already solves it better, do **not**
build a bespoke runtime just to preserve the "digital colleague" story.

---

## 7. The decision rule (meeting conclusion)

> **Don't pick the full long-term architecture first. Confirm the maintainer
> first, then choose the architecture that suits that maintainer — and validate
> with a real-scenario head-to-head before committing.**

- Maintainer = **AI Team** → the current high-customization CLI / custom stack is
  acceptable (flexible, they can operate it).
- Maintainer = **legal / governance / a BU itself** → a friendlier product like
  Codex App is likely the better fit.

## 8. Follow-ups (owners TBD)

1. Trade-off write-up: Codex App vs current architecture *(this doc — refine with
   the head-to-head numbers)*.
2. Confirm the future **maintenance owner** with governance / stakeholders.
3. Confirm **Windows VM / dedicated-device** deployment feasibility (Day-2).
4. Run the **head-to-head test** on a real legal scenario (Q5 metrics).
5. Decide whether the colleague needs an **independent enterprise identity** (Q3).

---

## Sources

- [Unlocking the Codex harness: the App Server](https://openai.com/index/unlocking-the-codex-harness/) — App Server is the JSON-RPC surface over the shared Codex harness.
- [Introducing the Codex app](https://openai.com/index/introducing-the-codex-app/) — the product layer (desktop UI, projects, automation).
- [Codex app-server (developer docs)](https://learn.chatgpt.com/docs/app-server.md) · [Codex MCP](https://learn.chatgpt.com/docs/extend/mcp.md).
- OpenClaw / Hermes / Grok Bot / OpenBot rows are *our landscape research* — verify against each vendor's current docs before commitment.
