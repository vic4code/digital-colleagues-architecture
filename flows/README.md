# Flows

End-to-end workflows that cut across phases. Each flow is one SVG + (eventually) a short markdown
explaining the steps, actors, and where human-in-the-loop gates live.

## Available

- [`contract-review.svg`](./contract-review.svg) — Legal contract review end-to-end. Intake → Claire reads + queries precedent → drafts review + risk report → human-in-the-loop gate → finalize. Applies from Phase 1 onward.
- [`channel-routing.svg`](./channel-routing.svg) — How the same colleague is reachable from Slack, Linear, Email, and Claw3D with shared identity and memory. Applies from Phase 3 onward (channel adapter layer).

## Planned

- `agent-collaboration.svg` — How colleagues hand work to each other (Phase 1 fan-out pattern formalized)
- `auth-and-session.svg` — Identity, login, session lifecycle (Phase 2+)
- `busy-and-queueing.svg` — The "instant hold-on" reply + pending ticket pattern (lifted from Phase 0)
