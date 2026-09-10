# Initiative, remembered commitments and contacting people

Question: can an agent remember yesterday’s promise and decide to ask its owner whether it is done, without an itemized reminder instruction?

Assessment separates contextual model decisions, recipient-selecting tools and default background agenda generation. A capability assembled from tools/prompts is not evidence of an implemented commitment tracker, and none of these source paths establishes subjective consciousness.

## OpenClaw

Model-decided outreach is supported within configured responsibility.
設定職責後，可讓模型判斷是否主動找人。

Prompt exposes proactive message(target, message, channel); execution performs routed sending. Default Heartbeat does not infer old-chat tasks.
Prompt 明訂主動傳訊方式，工具會實際送出；但預設 Heartbeat 不從舊對話自行推導待辦。

Possible by composition: supply relevant memory/tools, a follow-up responsibility and contact authorization. Not a bundled promise-tracking subsystem.
可由既有能力組合：提供相關記憶／工具、追蹤責任與聯絡授權；不是內建完整的承諾追蹤器。

[Source](https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/src/agents/system-prompt.ts#L593-L617)

## Hermes

Can judge findings within an assigned instruction; default cross-platform outreach is restricted.
可在交代的任務內判斷發現；預設限制模型跨平台主動傳訊。

send_message is intentionally not model-registered. Cron delivers to configured targets; opt-in MCP exposes messages_send(target,message).
send_message 刻意不註冊為模型工具；Cron 送至設定對象，另可啟用 MCP messages_send。

A dynamic-contact design needs explicitly connected messaging; a scheduled final reply alone does not let the model choose Alex.
若要自行選 Alex 聯絡，須另外接好可用傳訊介面；排程結果送達不等於模型選人。

[Source](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/tools/send_message_tool.py#L22-L24)

## Grok Bot reconstruction

Explicit Initiative guidance generates grounded next-step suggestions.
明確有 Initiative 指令，能提出有根據的下一步。

The prompt asks the model to notice useful patterns and act in scope or offer a nudge; it also constrains unsolicited contact.
Prompt 要模型留意工作脈絡、在範圍內行動或提議；同時限制擅自聯絡他人。

Supports a context-grounded suggestion during a turn. The inspected local code does not establish independent idle-memory scanning and autonomous outreach.
支援回合內依脈絡提議；已查核本機程式未建立「閒置掃描記憶後自行聯絡」的完整路徑。

[Source](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/runner/system-prompt.ts#L235-L248)

## OpenBot

The model can select a permitted specialist Bot and formulate its task.
模型可選獲准協作的專家 Bot，提出要它做的工作。

message_bot accepts bot, task, constraints and expected result; grants and run limits govern handoff.
message_bot 接收 bot、task、限制與成果要求，派工受權限與執行上限控制。

Concrete Bot-to-Bot delegation within work; not a built-in human commitment reminder.
是工作中的 Bot 對 Bot 派工，不是內建的真人承諾追問功能。

[Source](https://github.com/CopilotKit/OpenBot/blob/7b94a0b802732e6491634160cf9ed3fcfb813424/server/src/agents/handoff-tool.ts#L24-L44)

## Voyager

The curriculum model generates exploration tasks.
Curriculum 模型會產生探索任務。

Observations/history enter an LLM; parsed next_task drives execution, alongside explicit startup/inventory rules.
觀察與歷史交給模型，解析 next_task 後執行；也有起始與背包規則。

Positive task-generation evidence in Minecraft, not a human-contact workflow.
Minecraft 中有明確任務生成實作，並非聯絡真人的流程。

[Source](https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/agents/curriculum.py#L278-L305)

## Codex

The audited goal path advances an existing objective.
已查核 goal 路徑推進既有目標。

continue_if_idle loads a stored active goal and starts another eligible turn.
continue_if_idle 讀取有效目標，啟動下一個符合條件的回合。

Memory retrieval, commitment extraction and outbound contact need a configured workflow/tools; /goal alone does not implement them.
讀記憶、找承諾與對外聯絡要有設定的流程／工具；/goal 本身不實作這整套能力。

[Source](https://github.com/openai/codex/blob/634ebc1865c6ac840ed3ba118f040d527bf4b55d/codex-rs/ext/goal/src/runtime.rs#L399-L458)

## Claude Code

Bare /loop chooses work within built-in maintenance.
空白 /loop 在內建維護範圍內選工作。

Official docs prioritize unfinished work, current PR issues, then cleanup; scope does not expand into new initiatives.
官方順序為未完成工作、目前 PR、清理；不擴大成範圍外的新計畫。

Concrete bounded work selection, not a general autonomous colleague-contact feature.
有具體的限定範圍選工作能力，並非通用的自動找同事追問功能。

[Source](https://code.claude.com/docs/en/scheduled-tasks#run-the-built-in-maintenance-prompt)

## Detailed audit and scope

- [OpenClaw](initiative-openclaw.md): prompt plus routed message execution; default heartbeat is narrow.
- [Hermes](initiative-hermes.md): default model messaging registration excluded; opt-in MCP is separate.
- [Grok reconstruction](initiative-grok.md): explicit task-scoped Initiative and contact restrictions; local host evidence only.

Source revisions are pinned in links. Claude is official-documentation evidence. This pass inspected source; no live memory-to-contact scenario, email or messaging action was executed. Missing completion evidence must not be treated as proof that a person failed to do the work.
