# OpenClaw: deciding to contact a person

Read-only source audit. Pin 91ea838947d30a65f1299b05fa42071917f2a293.
URL prefix https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/

## Finding
OpenClaw exposes a real proactive message action in an ordinary model turn: the model can supply target/message and channel. A configured Heartbeat/Automation can provide a standing responsibility rather than a hardcoded per-event condition; model reasoning can then decide that asking a person is the appropriate next tool action. This is compositional capability, not evidence of a separate spontaneous-idea generator or automatic discovery of all possible recipients.

Five primary code ranges:
1. src/auto-reply/heartbeat.ts L6-L15: literal default heartbeat instructions follow monitor scratch; explicitly avoid inventing/rehashing prior-chat open loops; NO_REPLY when nothing needs attention; structured response notify true/false.
2. src/infra/heartbeat-runner-prompt.ts L102-L131: collects selected agent system events and reads monitor scratch from store. Inputs come from pending events/configured stored responsibility, not an idle novelty search in this path.
3. src/agents/system-prompt.ts L593-L617: model-facing Messaging instructions explicitly say proactive send/channel action uses message; send requires target + message; source-less proactive sends need channel. Thus the model is told how to initiate communication, not merely how to render a fixed notification.
4. src/agents/tools/message-tool-execution.ts L597-L635: constructs action params and invokes runMessageActionForTool with configured routing, requester authorization, session/run identity; comment explicitly permits source-less scheduled and ambient sends as ordinary message actions. This proves actual outbound execution path, not just a prompt promise.
5. src/agents/tools/goal-tools.ts L95-L117: create_goal exposed only on explicit user/system request by tool description; execute records supplied objective scoped to session. Instruction constraint is model-facing; no semantic authorization parser in these lines. This cannot be cited as an automatic new-root-goal generator.

Official framing corroboration: docs/gateway/heartbeat.md L75-L106. Default delivery owner route is configured, not model-ranked human selection. Default prompt narrow; proactive behavior opt-in; docs suggest an explicitly scheduled human check-in job for occasional anything-you-need messages. Custom heartbeat prompt permitted. Normal heartbeat uses same system prompt as regular turns.

Accurate sequence (configured initiative, inferred capability from composition):
Configured standing responsibility + wake -> agent sees context and uses tools -> model decides it needs clarification or has a useful suggestion -> message(action=send,target=person,message=question,channel=...) -> routing/policy-aware message execution.

Illustrative scenario, not an observed bundled Outlook integration: responsibility = help unblock the project; tools reveal a missing review before a deadline; agent decides to ask the responsible reviewer for an update, selects a known permitted target, sends via message. No prewritten if-review-missing rule is required if judgment is delegated in the responsibility prompt, but source access, scope and contact permissions still need configuration.

Scoped boundary: searched audited heartbeat prompt/preflight, cron mechanisms, system prompt and goal tools for curiosity, spontaneous idea, new/root goal and initiative logic. These paths provide context-driven model turns, outgoing messaging and explicit goal storage. They do not establish a dedicated always-on idea generator or recipient-ranking subsystem. Do not generalize absence to all plugins or future versions, and do not describe default install as spontaneously checking in.

Recommended compact conclusion:
EN: OpenClaw can let the model decide to contact someone during an enabled proactive turn. The built-in pieces are wake + configured context + message tooling; a separate self-generated agenda is not part of the audited default heartbeat path.
ZH: OpenClaw 可以在主動回合裡，由模型判斷要不要找人、對已知對象提出問題。已實作的是喚醒、責任脈絡與傳訊工具的組合；預設 Heartbeat 不是自己不斷產生新議題的機制。
