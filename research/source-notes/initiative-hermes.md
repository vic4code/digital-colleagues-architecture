# Hermes: initiative and recipient selection

Audit pin: `NousResearch/hermes-agent@fef0e16fe19b79ded929209f87c7434270b03825`.

**Conclusion:** The audited default session heartbeat is a recurring assigned instruction, not an idle new-root-goal generator. Hermes can generate useful findings or questions within that instruction and publish scheduled final responses to configured delivery targets. Its messaging implementation supports dynamic target strings, but **send_message is deliberately not an ordinary agent-callable tool at this pin**. The opt-in Hermes MCP server exposes messages_send to an external caller; that is a separate enabled surface, not proof of a default spontaneous-recipient selector.

## Five primary evidence ranges

1. **Recurring duty, no invented work** — [hermes_cli/heartbeat.py:22–26](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/hermes_cli/heartbeat.py#L22-L26): template inserts `{prompt}` and explicitly says if nothing meaningful for this instruction, stop; `do not invent work`. Required nonempty prompt is enforced at 167–175. Default root SOUL.md is one line of response-style instructions, with no independent proactive task-generation loop.

2. **Cron judges report vs silence; runtime delivers** — [cron/scheduler_prompt.py:190–200](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/cron/scheduler_prompt.py#L190-L200): final response auto-delivered, do not use send_message or deliver yourself; `[SILENT]` alone suppresses delivery. Recipient routing is configured: scheduler_delivery.py:835–864 selects failure_deliver or deliver, defaults local, resolves targets. Generating a question in final text is possible; deciding a new human recipient is not this cron instruction's delivery mechanism.

3. **No default agent messaging tool** — [tools/send_message_tool.py:22–24](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/tools/send_message_tool.py#L22-L24): explicit registration boundary; comment lists cron delivery, hermes send CLI, kanban notifier and opt-in MCP as helper users. Independently confirmed toolsets.py:180–182 and absence of registry registration. Do not infer model exposure from SEND_MESSAGE_SCHEMA constant retained later in file for plugin compatibility.

4. **Positive dynamic-target surface: opt-in MCP** — [mcp_serve.py:600–624](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/mcp_serve.py#L600-L624): messages_send(target,message) resolves platform identifiers / friendly names and calls sending helper. Tool registration verified at 686–704; channels_list supplies directories. A calling agent can select a target through this enabled interface; the helper does not generate the reason or decide whom to approach.

5. **Goal continuation is gated by existing goal** — [hermes_cli/goals.py:1437–1451](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/hermes_cli/goals.py#L1437-L1451): evaluate_after_turn returns inactive with no continuation when no active goal exists. Further confirmed next_continuation_prompt() at 1521–1533 returns None absent active state, otherwise builds prompt from saved goal. Scoped statement: these heartbeat / goal paths implement instructed re-entry and continuation; they do not create root objectives while unassigned.

## Suggested report wording

**Hermes — useful initiative within an assigned instruction.** The heartbeat re-enters a nonempty task prompt and tells the agent not to invent work. Cron lets the model choose report or silence, while the runtime routes the final response to configured destinations. Dynamic cross-platform messaging exists through CLI / opt-in MCP; it is not exposed as the default agent's send_message tool at this audited revision.

中文：Hermes 的主動性先有交代範圍。Heartbeat 重跑設定的指令，沒事就停止；Cron 讓模型決定有沒有值得回報的內容，由系統送往已設定的對象。跨平台指定對象發送有 CLI／選用 MCP 介面，但本次版本不把 send_message 當作預設 agent 工具。

**Implementation implication (recommendation, not native feature claim):** To add “discover an issue → choose relevant person → ask privately,” define discovery responsibility, recipient resolution and allowed messaging surface explicitly. Delivery transport alone does not supply spontaneous goal generation or a recipient-selection policy.
