# Supporting research: colleague notes and validation prototype

Scope: `agent_initiate` is a research repository, not an agent framework. The following review concerns only the validation prototype bundled with its notes. It must not be used as a peer-framework capability assessment.

Pinned revision: `919aae63c20504610443adf3ac47666173b056fb` in `shane01526/agent_initiate`.

[run_round.py](https://github.com/shane01526/agent_initiate/blob/919aae63c20504610443adf3ac47666173b056fb/2026_08/proactive_agent/run_round.py#L24) loads the active charter, collects events, calls admission, persists admitted events and retrieves material, then drives generation and downstream processing. The configured dry-run branch uses deterministic mock generation; it cannot prove model effectiveness.

[scheduler.should_run_now()](https://github.com/shane01526/agent_initiate/blob/919aae63c20504610443adf3ac47666173b056fb/2026_08/proactive_agent/scheduler.py#L68) checks enabled/paused state, seed, elapsed time, idle time, and material count. Its return is a structured admission result. However, [the caller](https://github.com/shane01526/agent_initiate/blob/919aae63c20504610443adf3ac47666173b056fb/2026_08/proactive_agent/run_round.py#L74) supplies max(idle_h, min_idle_hours), making NotIdle unreachable through that normal call. Pure-function tests alone would not prove integration-level idle gating.

load_charter() reads the full vision file, with an empty string if it does not exist. It does not implement the proposed role_card projection or SHA validation. The later W2/W3 design should not be reported as existing behavior on the strength of its diagram.

The scenario documents define three proposed capability phases: fixed cadence, bounded pursuit of human-defined goals, and discovering work to propose. The September W0–W7 design describes a wake lifecycle and marks identity projection and reconciliation as additions. These are requirements and comparison vocabulary, not code evidence of a complete Phase 2 or Phase 3 controller. The prototype's generation and proposal tables also mean a phase label alone is an imprecise description of its implemented behavior.

The repository’s deterministic test script was run on 2026-09-08: 90/90 checks passed. These checks do not exercise live model calls or external runtime goal continuation. No production, autonomy, security, or enterprise-audit acceptance claim is made.


## Two distinct implemented paths

[CLI cmd_round](https://github.com/shane01526/agent_initiate/blob/919aae63c20504610443adf3ac47666173b056fb/2026_08/proactive_agent/cli.py#L270) optionally checks budget and starts an adapter for live mode, then invokes a single run_round. [Generation](https://github.com/shane01526/agent_initiate/blob/919aae63c20504610443adf3ac47666173b056fb/2026_08/proactive_agent/generator.py#L105) starts a constrained thread and requests structured proposals. The round resolves event anchors, filters candidates, delivers qualifying proposals to the inbox, and commits schedule state. The inspected CLI is not itself a resident scheduler daemon.

[CLI cmd_explore](https://github.com/shane01526/agent_initiate/blob/919aae63c20504610443adf3ac47666173b056fb/2026_08/proactive_agent/cli.py#L363) takes a human objective, applies a host budget preflight, and invokes [explore_via_goal](https://github.com/shane01526/agent_initiate/blob/919aae63c20504610443adf3ac47666173b056fb/2026_08/proactive_agent/generator.py#L139). It creates an external-runtime goal, waits, queries its status, audits usage, and closes the adapter. The external runtime owns continuation. The inspected command does not automatically feed its free-text output into another round, even though the module documentation proposes using it as retrieval material.

Correction to a phase-only description: model proposal generation, anchors, and rejection filtering already exist. Native-goal invocation also exists. Saying all goal-related or work-proposal behavior is only planned would be too broad. These components do not establish full completion of the later scenario acceptance requirements.

## Scoring is not independent truth verification

The proposal schema includes model-supplied relevance, frequency, diversity, recency, consolidation, and richness. score_one clamps and weights these values. The deterministic gate can be reproduced from identical inputs, while the inputs themselves can vary or be wrong. In this implementation, source diversity contributes to the total; it is not an independent mandatory diversity threshold. The separate scenario design must not be substituted for this actual scorer behavior.

## Executed validation

Command: python3 tests/test_all.py in 2026_08/proactive_agent. Result: 90/90 checks passed. Scope: local deterministic checks with fixtures and temporary databases. No live model, external runtime, goal side-effect probe, or production workflow was run. The caller-level idle-gating limitation remains despite the passing suite.
