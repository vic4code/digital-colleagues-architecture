# Framework evidence to existing phases and architecture

Updated 2026-09-09. This follows the requested order: native implementation review, general comparison, existing phase requirements, then proposed component integration. It does not treat our phases as framework-native modes.

## Phase sources

Definitions come from `shane01526/agent_initiate` at `919aae63c20504610443adf3ac47666173b056fb`, `2026_08/scenerios/scenario-pm.md` sections 6–8 and `2026_09/wake-cycle-design.html:334`.

- Phase 1: fixed cadence, predefined outputs, deterministic/no-model checks, auditable run/skip records; no autonomous continuation or new scope.
- Phase 2: human-defined goal, executable completion evidence, token/time/turn caps, explicit exhaustion and bounded continuation. Draft-only restrictions remain.
- Phase 3: event-anchored task proposals, private inbox, independent relevance/diversity/rejection gates, initial silence and feedback. Full proactivity does not mean unrestricted external actions.

These are scenario requirements, not proof of implemented phase completion. The colleague prototype contains partial generation, scoring, feedback and native-goal integration; September documents identify additional identity/reconciliation/writeback work.

## Existing architecture and inspected local binding

Architecture: `vic4code/digital-colleagues-architecture` at `9b84c64bf466174efbdff91b0cfca3862090c718`, Phase 0.5 C3 and ADR-018/020.

Local prototype: `/Users/cfh00886479/projects/prjt-digital-colleague-prototype`, clean snapshot `bb7101c3cfca32ea2982268de47958bea648df98`.

- `src/gateway/standalone.ts:563` calls `runtime.respond`.
- `src/runtime/openclaw-gateway.ts:184` implements the managed `/v1/responses` binding.
- `docs/runtime-controller-and-state.md:21` distinguishes external core, local adapter and deployment configuration.

This confirms the application-to-runtime seam, not deployed feature parity with the upstream research snapshots.

## Integration ownership

1. Scheduler/Ingress: reuse time/event transport; persist source/occurrence identity.
2. Event Normalizer/Triage Policy: deterministic admission, no-model status paths, event provenance.
3. Persona + Skill Loader: task/output/goal/proposal instructions; bounded domain skills, not prompt-only enforcement.
4. Session / Thread Mapper + App-server Client: reuse runtime/harness continuation and ownership. Verify actual completion hook and next-turn producer.
5. Approval + Audit Policy: run/skip records; evidence and three-axis budget gates; independent proposal gates. Enforce within the controlling runtime/harness where internal work is visible.
6. Colleague State: map existing stores and add verified missing business records for evidence, proposals and feedback.
7. Interaction Client/MCP: private inbox and read/reject feedback; evidence tools during turns. Preserve the scenario's external-write restrictions.

See `../proactive-phase-0.5-components.svg` for the final integration diagram. Dashed policy integration is proposed work, not a new controller service or verified deployed implementation.
