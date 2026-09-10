# Design philosophy differences

Research synthesis from pinned code, not exclusive categories or quoted author intent.

## OpenClaw

Bring different triggers into controlled execution. A scheduled monitor, HTTP wake, command exit or event stream can enter managed execution paths. Shared runtime rules decide whether and where work runs.

Implication: The implementation emphasizes integrating many wake sources. Reliable triggering still needs an instruction or goal to decide what is useful.

Evidence: Heartbeat (see mechanism-inventory.md), Automations · stream (see mechanism-inventory.md), Automations · condition watchers (see mechanism-inventory.md)

## Hermes

Give recurring work and unfinished goals different controls. Cron, session heartbeat and loop repeat assigned work in different contexts. /goal adds a post-turn decision about continuing, waiting, pausing or finishing.

Implication: The implementation makes continuation explicit. Adoption requires choosing the right mode and configuring its completion checks and limits.

Evidence: Cron / cronjob (see mechanism-inventory.md), Loop · /loop, /proactive (see mechanism-inventory.md), Persistent Goals · /goal (see mechanism-inventory.md)

## OpenBot

Keep assigned work attributable and durable. Routines and Bot handoffs become persisted queue work. Claims, leases and current identity checks govern execution; answers can return through a durable relay.

Implication: The implementation emphasizes work ownership across time and Bots. This supports reliable delegation, but does not itself choose new unassigned objectives.

Evidence: Routines (see mechanism-inventory.md), Bot handoff · message_bot (see mechanism-inventory.md), Handoff result relay (see mechanism-inventory.md)

## Grok Bot reconstruction

Keep a conversation responsive to background developments. Automation occurrences and completed background work can re-enter a transcript as queued follow-ups. Ownership and duplicate checks control revival.

Implication: The inspected host code emphasizes resuming ongoing context. This is evidence from an unofficial reconstruction, not proof of the original product’s complete design.

Evidence: Automation fire consumer (see mechanism-inventory.md), Completion revivals (see mechanism-inventory.md)

## Voyager

Use outcomes to choose what to try next. The critic supplies success feedback; iterative prompting repairs attempts; the curriculum uses progress and world state to propose another task.

Implication: The implementation explicitly selects new exploration tasks. Its autonomy is bounded by the Minecraft research environment and configured learning loop.

Evidence: Automatic curriculum (see mechanism-inventory.md), Iterative prompting + self-verification (see mechanism-inventory.md)