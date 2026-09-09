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

## Conclusion: adoption priorities / 結論：實作取捨與優先序

**Adopt OpenClaw’s proactive patterns first; fill specific gaps within our existing architecture.**
**先採用 OpenClaw 的 proactive 設計，再針對缺口補強。**

Integration proposal, not deployed functionality. P0–P4 are build priorities, not project phase definitions.

| Priority | Build / 做什麼 | Trade-off / 取捨 | Ready when / 驗收 |
|---|---|---|---|
| P0 · Make each run reliable<br>先讓一次工作可靠 | Stable work IDs, persisted status, deduplication, retry and delivery tracking.<br>穩定工作 ID、保存進度、去重、重試與送達紀錄。<br>Runtime Controller · Colleague State · Audit | More foundation work upfront; every trigger reuses it.<br>前期多做基礎控制，後續排程與事件共用。 | One occurrence produces one result; restart recovers pending work.<br>同一事件只產生一份結果；重啟能接回未完成工作。 |
| P1 · Start with scheduled checks<br>先做排程與定期查看 | Use OpenClaw-style Heartbeat / Automations to run a bounded Outlook responsibility.<br>參考 OpenClaw Heartbeat／Automations，在指定時段查看限定範圍的郵件。<br>Polling Scheduler → Runtime Controller → Skills / Tools | Simple rollout, but polling has latency and query/model cost. Bound scope and frequency.<br>容易落地，但有查看間隔與查詢／模型成本；先限制範圍與頻率。 | Useful mail yields a source-linked reminder; ordinary mail stays quiet.<br>重要郵件提醒一次並附原信；一般郵件不打擾。 |
| P2 · Add events where latency matters<br>需要即時反應，再接事件 | Use OpenClaw-style HTTP hooks; share the same execution path. Keep low-frequency reconciliation.<br>參考 OpenClaw HTTP hooks，共用執行路徑；保留低頻巡查補漏。<br>Event Ingress · Subscription Renewal · Runtime Controller | Faster response, but subscriptions, duplicates and missed events need handling.<br>反應更快，但要處理訂閱續期、重送與漏事件。 | Duplicate delivery starts one task; reconciliation recovers missed items.<br>事件重送只啟動一份工作；巡查能找回漏掉的項目。 |
| P3 · Continue only when work requires it<br>長任務需要時，再補續跑 | Resume on completion; persist goal state and explicit continue / wait / stop rules.<br>完成事件接回工作；保存目標，明訂繼續、等待與停止條件。<br>Runtime Controller · Colleague State · Engine completion events | Less human prompting, but runaway retries and cost need enforced limits.<br>減少人工催辦，但要限制重試與成本，避免無效續跑。 | Stop on verified completion or limit; waiting work resumes from its result.<br>完成或到達上限即停；等待工作收到結果才接續。 |
| P4 · Propose new work within a scope<br>最後才讓它在職責內找事做 | Start with bounded maintenance priorities and private proposals; evaluate curriculum only for exploration needs.<br>先設定職責與優先順序，產生私人提案；確有探索需求，再評估 curriculum。<br>Skills · Request Triage & Priority · Colleague State · Interaction surface | More initiative, but usefulness is harder to verify; collect accept / reject feedback first.<br>自主程度提高，但價值更難驗證；先收集接受／退回回饋。 | Proposals have evidence, fit the role and respect prior rejection.<br>提案有來源、符合職責，也會參考先前退回原因。 |

[Full recommendation, targeted reinforcements and implementation links](show-me-proactive-lifecycle.html#adoption-conclusion).

保留既有元件邊界：Scheduler／Ingress 喚醒、Runtime Controller 管執行、Skills 定義責任、Tools 接系統、Colleague State 保存進度。以實際問題決定補強：重看資料成本高才加前置比對；長任務卡住才加續跑；例行責任穩定後再試行私人任務提案。
