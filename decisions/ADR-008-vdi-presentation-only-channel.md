# ADR-008 — VDI is a presentation-only channel, never an execution target

- **Status:** Proposed
- **Date:** 2026-06-23
- **Deciders:** (architecture review)

## Context

Some colleague users (legal, and likely other regulated teams) can only work from a locked-down
VDI: connection-restricted (limited or no general internet egress), resource-restricted (thin
client, not meant to run long-lived processes), and any local coding-agent CLI present is
sandboxed to read-only (cannot write, cannot spawn subprocesses freely). We need to decide where
agent execution is allowed to happen relative to this constraint.

## Decision

**Agent execution (orchestrator, worker pool, `codex app-server` / Claude Code processes) never
runs on a VDI image.** A VDI is treated purely as a thin presentation channel: it renders a web
frontend (Claw3D or equivalent) that talks to the orchestrator over HTTPS, exactly like any other
browser client. All compute stays in infrastructure the VDI never executes code on — cloud
(Phase 1 AWS stack) or a separate internal server tier, but not the end-user's desktop session.

The only open question per VDI deployment is the **network path** from VDI to orchestrator, not
the execution model:

1. **IT can allow-list one specific HTTPS endpoint** from the VDI's egress rules — orchestrator
   can live anywhere (cloud or on-prem) reachable through that one rule.
2. **IT cannot allow any outbound rule to an external domain** — place a small reverse-proxy
   relay inside the corporate network that the VDI *can* reach, which itself forwards (over an
   already-approved VPN/Direct Connect/PrivateLink) to the orchestrator. The VDI never knows or
   cares whether the orchestrator is in the cloud or on-prem behind that relay.

Either way, this requires a connectivity conversation with IT, not an architecture change.

## Alternatives considered

- **Run a local Codex/Claude Code CLI directly inside the VDI session, driven by the user:**
  rejected — read-only sandboxing on the VDI means it can't write outputs or call tools reliably,
  and even if it could, resource limits make it a poor place to run a long-lived agent process.
  This also reintroduces Phase 0's per-machine SPOF problem, just relocated to a worse machine.
- **Require all VDI-bound teams to get a dedicated on-prem orchestrator deployment:** not
  rejected, but not the default — only needed if connectivity (1) above is truly impossible, in
  which case the relay pattern (2) is normally sufficient without standing up a parallel stack.

## Consequences

- **Easier:** VDI is just another entry in [Phase 3's channel list](../phases/3/README.md) — no
  change to orchestrator/worker design. Onboarding a VDI-bound team is a network/firewall
  conversation, not an engineering project.
- **Harder:** every new VDI-bound team needs its own connectivity negotiation with their IT —
  this doesn't scale as a one-time integration, it's a per-team rollout step.
- **Follow-up:** if connectivity truly cannot be established for some team (no allow-list, no
  relay path accepted by IT), that team needs a fully on-prem deployment of the Phase 1 stack —
  revisit at that point, don't pre-build it speculatively.
