# Proactive research storyline / 主動性研究主線

[Read the integrated visual report](show-me-proactive-lifecycle.html#research-summary).

## 1. Start with a workday / 先從日常情境開始

“Keep an eye on Outlook during working hours. Tell me when a customer email needs my attention.”
「上班時間幫我留意 Outlook。客戶來信有需要我處理的事情，再提醒我。」

At the next check, the colleague reads a customer email asking for a reply today, checks related information, and prepares a private reminder with the source link. Nothing needs attention? No notification.
下一次查看時，同事讀到要求今天回覆的客戶郵件，就查資料、整理附原信連結的私人提醒。沒事就不打擾。

This scenario requires configured Outlook access, checking instructions and notification delivery; it is not a native connector claim for every framework.

## 2. Ask four questions / 拆成四個問題

1. **What starts the check? / 他怎麼知道該去看？** A scheduled check or a configured event.
2. **What deserves attention? / 他怎麼知道要不要管？** Read the actual message and judge against the assigned responsibility.
3. **What happens next? / 需要處理時怎麼做？** Use tools to gather context and prepare the output.
4. **Is it finished? / 做一半或做完之後呢？** Continue, wait, or finish and deliver as appropriate.

These explain the example, not a universal runtime lifecycle or project phases.

## 3–8. Follow the evidence back to our design / 從實作回到我們的設計

| Chapter / 段落 | Question / 要回答的問題 |
|---|---|
| [3. Frameworks / 各框架實作](show-me-proactive-lifecycle.html#frameworks) | Which native mechanisms implement the behavior? / 官方機制如何做到？ |
| [4. Comparison / 比較](show-me-proactive-lifecycle.html#comparison) | Which problems does each technique solve? / 技術分別解決什麼問題？ |
| [5. Task selection / 自己選工作](show-me-proactive-lifecycle.html#self-directed-work) | Can it choose tasks beyond an itemized assignment? / 沒逐件交辦，能自己選什麼工作？ |
| [6. Existing phases / 既有階段](show-me-proactive-lifecycle.html#project-phases) | What behavior must each phase deliver? / 各階段要交付什麼行為？ |
| [7. Architecture / 原架構接合](show-me-proactive-lifecycle.html#embedding) | Which existing component owns each function? / 功能放在哪個既有元件？ |
| [8. Verification / 驗證](show-me-proactive-lifecycle.html#verification) | Did the right work happen, and was the reminder useful? / 有沒有做對、提醒有沒有用？ |

## Technical reference / 技術對照

An agent can start, assess and advance work without a new instruction at every step.
讓 agent 不必每一步都等人下指令，也能開始工作、判斷狀況並推進任務。

These are reusable implementation techniques, not exclusive framework categories or project phases.

| Problem / 問題 | Approach / 做法 | Technology / 技術 | Evidence / 實例 |
|---|---|---|---|
| Start without a new message<br>沒人來問，也能開始工作 | Scheduled checks or incoming events wake execution.<br>定期查看，或收到事件後開始處理。 | Cron / Heartbeat / Webhook / event subscription | [OpenClaw Heartbeat](show-me-proactive-lifecycle.html#flow-claw-0) · [Automations](show-me-proactive-lifecycle.html#flow-claw-1) · [HTTP hooks](show-me-proactive-lifecycle.html#flow-claw-2) · [Hermes Cron](show-me-proactive-lifecycle.html#flow-hermes-0) · [Webhooks](show-me-proactive-lifecycle.html#flow-hermes-1) |
| Avoid unnecessary runs<br>資料沒變，不必重做 | Run on the first observation or changed content; skip unchanged results.<br>首次取得資料或內容有變，才交給 agent；沒變就略過。 | Monitor script / URL + saved baseline（上次結果）+ hash comparison（內容比對） | [Hermes Cron monitor](show-me-proactive-lifecycle.html#flow-hermes-8) |
| Decide whether to act or notify<br>看到資訊，判斷要不要處理、提醒 | Read source data; apply the configured responsibility and delivery rules.<br>讀取來源資料，依交代的責任判斷；沒事就保持安靜。 | Connector / tool + prompt + model judgment + silence marker（不通知標記） | [OpenClaw Heartbeat](show-me-proactive-lifecycle.html#flow-claw-0) · [Hermes monitor + delivery](show-me-proactive-lifecycle.html#flow-hermes-8) |
| Continue after background work<br>背景工作做完，自動接下一步 | Deliver the result back to the waiting conversation or requester.<br>把背景成果送回等待中的對話或派工者，接續原本工作。 | Completion event + durable queue / result relay | [Grok completion revivals](show-me-proactive-lifecycle.html#flow-gr-2) · [OpenBot result relay](show-me-proactive-lifecycle.html#flow-ob-2) |
| Finish an assigned goal<br>回合結束，目標還沒完成 | Use goal state to decide whether to continue, wait or stop.<br>保存目標進度，決定繼續、等待或停止。 | Goal state（目標進度）+ post-turn / idle continuation（回合結束或閒置後續跑） | [Hermes /goal](show-me-proactive-lifecycle.html#flow-hermes-4) · [Codex /goal](show-me-proactive-lifecycle.html#flow-cx-1) |
| Choose work within a responsibility<br>不用逐件交辦，在範圍內找事做 | Select work using built-in maintenance priorities.<br>依內建優先順序追未完成工作、目前 PR，再找 bug 或簡化。 | Maintenance prompt + tools + model selection + dynamic schedule | [Claude Code /loop](show-me-proactive-lifecycle.html#flow-cc-0) |
| Generate exploration tasks<br>依環境與成果，自己選新任務 | Propose a task, act, verify the outcome and select again.<br>觀察環境、選任務、執行與驗證，再決定下一件事。 | Automatic curriculum（選新任務）+ environment feedback + critic（成果檢查）+ skill library | [Voyager Automatic curriculum](show-me-proactive-lifecycle.html#flow-v-0) |

**Wake-up timing is separate from task selection.** OpenClaw supports both scheduled and event-driven paths. A timer can wake an agent that chooses its next task; a loop may repeat an assigned task.

**何時開始工作，和誰決定工作，是兩件事。** 排程、事件、完成通知解決執行時機；職責、目標與 curriculum 決定要做什麼。

## Continue reading / 完整研究

- [Framework mechanisms and code excerpts](show-me-proactive-lifecycle.html#frameworks)
- [General comparison](show-me-proactive-lifecycle.html#comparison)
- [Implementation design choices](show-me-proactive-lifecycle.html#philosophy)
- [Autonomous task selection](show-me-proactive-lifecycle.html#autonomous-task-selection)
- [Existing phase requirements](show-me-proactive-lifecycle.html#project-phases)
- [Original architecture and proposed integration](show-me-proactive-lifecycle.html#embedding)
- [Verification and observation plan](show-me-proactive-lifecycle.html#verification)
- [Source notes and evidence index](source-notes/README.md)

Scope: inspected source revisions and official documentation. Framework mechanisms may overlap. Grok evidence is an unofficial reconstruction; integration and acceptance tests are proposals, not executed production capabilities.
