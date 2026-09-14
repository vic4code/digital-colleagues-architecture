# Framework terminology · 框架原生術語與中文說明

用詞核對：2026-09-11。技術名詞先使用來源中的英文原詞，接著提供中文說明。中文是解釋，不另創元件名稱；不同框架的近似功能也不直接改成同一個「官方名稱」。

## OpenClaw · Official documentation

| Source term · 英文原詞 | 中文說明 | 來源與邊界 |
|---|---|---|
| **Agent loop** | 一輪工作由輸入到動作、回覆與保存的執行流程。 | [Agent loop](https://docs.openclaw.ai/concepts/agent-loop)。文件描述 per-session serialized run；不是永不停歇的自主思考。 |
| **intake → context assembly → model inference → tool execution → streaming → persistence** | 接收輸入 → 組裝上下文 → 模型推理 → 執行工具 → 串流輸出 → 保存狀態。 | 同上，沿用文件開頭的階段名稱。這是 OpenClaw 的流程描述，不是跨框架統一 API。 |
| **Heartbeat** | 週期啟動回合，讀取情境後判斷是否需要回報。 | [Heartbeat](https://docs.openclaw.ai/gateway/heartbeat)。有執行與投遞條件，不能直接等同每次都發通知。 |
| **Cron** | 安排定時或重複工作。 | [Cron jobs](https://docs.openclaw.ai/automation/cron-jobs)。與 Heartbeat 的情境檢查用途分開說明。 |
| **Webhooks** | 外部 HTTP 請求進入系統並觸發對應工作。 | [Webhooks](https://docs.openclaw.ai/automation/webhook)。不要與 internal hooks、plugin hooks 混為一談。 |
| **Hooks** | 命令或生命週期事件的擴充處理。 | [Agent loop: Hooks](https://docs.openclaw.ai/concepts/agent-loop#hooks)。內部 hooks 與外部 HTTP webhooks 是不同機制。 |
| **steer / followup / collect / interrupt** | 新訊息接入目前工作、後續回合、合併處理或中斷重開等 queue modes。 | [Command queue](https://docs.openclaw.ai/concepts/queue)。仍以模式、channel 與版本的實際支援為準。 |

## Hermes · Pinned source

固定版本：`fef0e16fe19b79ded929209f87c7434270b03825`。以下把程式路徑、類別與原始研究已查核的名稱分開標示；不聲稱所有字樣都是行銷文件的功能標題。

| Source term · 英文原詞 | 中文說明 | 來源與邊界 |
|---|---|---|
| **HeartbeatManager / HeartbeatState** | 判斷 heartbeat 是否到期，提供週期指令並保存排程狀態。 | [hermes_cli/heartbeat.py](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/hermes_cli/heartbeat.py)。這裡是程式識別字。 |
| **monitor mode / check_monitor** | 先取得 script 或 URL 輸出，比對 hash，決定是否進一步呼叫模型。 | [cron/monitor.py](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/cron/monitor.py)。hash 差異不是語意重要性判斷。 |
| **self-paced loop** | 依回應 digest 是否重複調整後續間隔。 | [hermes_cli/loops.py](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/hermes_cli/loops.py)；[查核與限制](hermes.md)。不是 learned attention。 |
| **GoalManager.evaluate_after_turn** | 回合後評估既有 goal，依狀態、預算與 gate 決定如何接續。 | [hermes_cli/goals.py](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/hermes_cli/goals.py)。程式方法名，不代表自動產生新根目標。 |

## Grok Bot · Unofficial reconstruction

以下只描述 `b-nnett/grok-bot-0.18-reconstructed` 在 `a9f633e09d49a85829b8236331b9e21f7e612634` 的程式名稱。它不能證明 [xAI Grok Bot 官方產品](https://x.ai/news/introducing-grok-bot) 採用相同後端、類別或 API。[來源身分與限制](grok-reconstructed.md)

| Source term · 英文原詞 | 中文說明 | 固定重建來源 |
|---|---|---|
| **AutomationRunPath.fireAutomation** | 接收到 automation firing 後，檢查條件並安排背景回合。 | [automation-run-path.ts](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/extensions/transcript/automation-run-path.ts#L109) |
| **BackgroundWakes** | 保存事件與待處理內容，在條件允許時安排背景工作。 | [background-wakes.ts](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/extensions/transcript/background-wakes.ts#L359) |
| **CompletionRevivals** | 將 subagent 或 shell 的完成結果帶回等待接續的工作。 | [completion-revivals.ts](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/extensions/transcript/completion-revivals.ts#L99) |
| **SendMessage** | 送出使用者可見訊息；模型內文或背景執行不直接代表已送達。 | [system-prompt.ts](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/runner/system-prompt.ts#L82)；[互動研究](colleague-experience.md) |

## Human cognition · 人的認知研究用語

這些原詞來自認知研究，不套成 OpenClaw、Hermes 或 Grok 的元件名稱。

| Research term · 英文原詞 | 中文說明 | 來源 |
|---|---|---|
| **Prospective memory** | 記住稍後要執行的意圖，常譯為前瞻記憶。 | [Einstein et al., 2005](https://pubmed.ncbi.nlm.nih.gov/16131267/) |
| **Monitoring** | 刻意留意待辦所需的線索。 | 同上。 |
| **Spontaneous retrieval** | 適當線索出現時，自發想起意圖。 | 同上。 |
| **Self-generated thought** | 內在生成的思考，包括回憶、未來模擬等。 | [Andrews-Hanna et al., 2014](https://pmc.ncbi.nlm.nih.gov/articles/PMC4039623/) |

## Writing rules · 本研究的寫法

1. 第一次出現用「**英文原詞 · 中文說明**」，程式識別字保留大小寫與拼字。
2. 每個框架詞彙旁提供來源，區分官方文件、固定原始碼、非官方重建。
3. 普通中文用來解釋情境；不把編輯整理的「想起、判斷、接上」寫成框架元件名。
4. `time`、`event`、`loop` 可以作工程描述，但必須指明正在討論啟動條件、執行控制，還是人的認知比喻。


## Intake / Handoff · 不把所有「接手」視為同一件事

- **Intake**：接收輸入並開始一個工作流程；沿用 [OpenClaw Agent loop](https://docs.openclaw.ai/concepts/agent-loop) 的階段名稱。
- **Handoff result relay**：工作移交後的結果回傳；見 [OpenBot 固定版本實作](openbot.md)。僅使用者交辦，不足以推論發生 agent handoff。
- **on-exit**：completion event 的一種，不與 Time / Event 放在互斥同層。見 [OpenClaw Automations](https://docs.openclaw.ai/cron-jobs)。
- **Observation**：行為責任，可能由 timer 或事件啟動；**Agent loop**：正在執行的控制循環。
- **Follow-up records / Scenario verification**：本專案 proposed integration 的描述，不冒充 framework 原生 API／enum。

[完整階層研究與 Before / After](proactivity-architecture-guide.md)。
