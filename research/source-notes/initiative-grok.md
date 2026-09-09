# Grok Bot reconstruction: initiative and outbound action

Scope: user-specified non-official reconstruction, pinned a9f633e09d49a85829b8236331b9e21f7e612634. Read-only inspected actual local source. These are reconstruction capabilities, not proof of proprietary backend behavior.

## Result
There IS a more substantive initiative pattern than merely consuming a user-authored schedule: model prompt guidance explicitly tells it to infer implicit recurring needs, create future routines when unambiguous, and choose cadence around usefulness. It also has actual SendMessage and SendToAgent action executors. This supports 'infer a useful follow-up from the user's needs; arrange a future wake; decide whether to surface the outcome' and 'choose a relevant teammate inside a user goal'. It does NOT establish uncaused new root goals or consciousness.

## Concrete evidence
All links prefix https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/

1. source/host/automations/automation.ts#L19-L35
   renderAutomationsSystemPrompt describes routines as saved prompt + cron/event trigger, running while user is away (29). Line 31 instructs model to catch implicit recurring needs; create when unambiguous, otherwise propose. 32 gives update_state target routine/create, name, future-self prompt and schedule or trigger. 33 says write intent, not frozen tool recipe. 35 says select cadence around useful delivery, not maximal frequency.
   Interpretation: inferred future standing task, grounded in user request. Not a hardcoded list of all individual future actions, but future inference remains prompted and scheduled/event-driven.

2. source/host/extensions/transcript/automation-run-path.ts#L178-L239
   Enqueues exclusive session run (180); records automation source (184-186); obtains current automation (219-220); builds wake prompt from saved automation + event batch and runner.run (226-227); hidden and isSilenceAllowed true (229-230).
   Interpretation: runtime consumer of configured/inferred routine, not a spontaneous thought generator.

3. source/host/runner/system-prompt.ts#L82-L100
   84 calls routine/background completion a hidden self-initiated wake; work first and message only when outcome worth surfacing. Terminology 'self-initiated' here still denotes explicit routine/completion mechanisms. 99 allows silence for scheduled runs with no new findings.

4. source/host/runner/tools/send-message-tool.ts#L67-L98
   Real action: builds output (74), refuses delivery while awaiting user selection (78-79), invokes deps.onSendMessage (82), returns timestamp and message id. This sends to current user's chat, not arbitrary email recipients. Widgets can ask user to act; widget build is42 and documentation16-17.

5. source/host/runner/tools/sand-agent-management-tools.ts#L99-L125
   Real SendToAgent target_id and message go to resolved.sendToAgent (120-124). Description105: asynchronous message wakes peer/group; requires serving user's goal; one relevant recipient may be ordinary work; fan-out requires explicit user request. It is agent/group messaging, not human email. Parameter choice is model-generated, not a fixed recipient list.

6. source/host/runner/system-prompt.ts#L164-L167
   Connected external actions via GetMcpTools then CallMcpTool; instruction165 checks for duplicate mutations before replay. Actual email-specific schema/transport is remote connector dependent. Do NOT equate SendMessage with send_email or claim this source verifies autonomous arbitrary-recipient email sending.

7. source/packages/agent/actions/goal-continuation-action-handler.ts#L84-L143
   Reads and validates existing goalState, adapts synthetic continuation wake, invokes existing userMessageActionHandler. Searches across source find type, registration, lifecycle and consumer, not an automatic root-goal producer. Keep as handler evidence only.

## Plain-language formulation
它會從你講過的需求推導「這件事值得定期幫你留意」，自己建立 routine；之後被喚醒時，模型判斷有沒有值得通知你的結果，也能選擇相關 Bot 派工。但 inspected reconstruction does not implement an independently motivated root-goal generator. Triggerless is not the same as no new user message.

## Strongest additional finding: explicit Initiative prompt
source/host/runner/system-prompt.ts#L236-L248:
- `## Initiative` at242. 243 instructs model to infer user context, think ahead to what user will want, grounded in real observed opportunity; act if clearly safe/in scope, otherwise offer one brief nudge naming signal.
-244 repeated manual task -> offer standing routine, citing repetitions.
-246 completed task -> offer recurring or next-step version once.
-247 repo/calendar/asking pattern -> propose small workflow tied to noticed thing.
-248 explicitly scopes initiative to task handed by user.
-237 lists sending among consequential actions deserving asking;239 prohibits preemptive messaging teammates/people to get ahead of missing user input in collaborative work.
Thus model-level grounded initiative is genuinely present as a prompt policy; not just a queue consumer. Do not flatten to 'no goal generation whatsoever'. It does not establish an always-running idle memory-scan or unconstrained human outreach.

User's exact case (remember yesterday Alex promised something and independently ask Alex): runtime can supply context and model can infer such a follow-up during active/woken work, but inspected source does not implement a dedicated commitment-extraction -> due-check -> independently selected human email-recipient -> unapproved send pipeline. SendToAgent is peer Bot not Alex's email. Policy instead supports proposing follow-up and existing authorized work; no new user message is not no runtime wake.
