# 主動的觸發與進階機制：time、event 之外到底還有什麼？

查核：2026-09-11。回到 [研究入口](../README.md) · [高層互動圖](../show-me-proactive-lifecycle.html#proactive-overview)。本次重新閱讀下列固定版本的代表路徑及目前官方文件，不宣稱完整窮舉所有 plugin。

## 給決策者的答案

**喚醒層用 time／event 足夠描述我們的設計。進階功能多半改進觀察、判斷、記憶、接續與可靠性，沒有另外創造一種無來源的「念頭」。** 有些工作持續在執行，不是每一步都重新喚醒。

這個分類是工程抽象，不是關於人類意識的結論。「event」若定義得足夠廣，本來就能包含 timer；我們分開列，是因為定時 polling 與被動接收通知的延遲、成本和恢復方式不同。

## 三個不同層次，不混在同一張觸發清單

| 層次 | 要回答的問題 | 實例 |
|---|---|---|
| 開始／恢復 | 這輪為什麼有執行機會？ | timer、新訊息、工作完成、thread idle |
| 執行控制 | 已在工作的程式怎麼走下一步？ | while loop、工具結果、workflow dependency、continue／wait／stop |
| 任務政策 | 現在做什麼、下次要看什麼？ | prompt 推論、候選排序、curriculum、記憶反思、learning progress |

`while` 迴圈直接下一次迭代，不需要存在一個 event bus。可以在高層把「前一步完成」視作內部事件，但不能把這個抽象寫成實際採用了事件中介軟體。

## 七個框架：剝掉名稱後的機制

| 框架／查核路徑 | 執行機會怎麼來 | 多做的部分 | 沒有因此證明什麼 |
|---|---|---|---|
| OpenClaw Heartbeat／Automations | 排程到期；符合條件的事件請求 wake | 背景容量、scope、模型判斷與選擇性投遞；eligible pacing 接受 next-check delay | 不等於內建通用承諾管理器；inferred commitments 已移除 |
| Hermes cron monitor／loop／goal | 定時；loop／goal 接續既有執行 | 來源 hash gate、重複回應退避、goal 判斷與限制 | hash 不是語意價值分數；接續不等於產生根目標 |
| OpenBot routines | due sweep 找到到期工作，放入 queue 給 worker | stale window、排程 occurrence 身分、claim／去重 | queue priority 不代表模型知道哪件工作最有價值 |
| Grok Bot 0.18 非官方重建 | automation fire、背景結果、Bot 訊息等事件 | 從持續需求建立 routine；completion 回到等待對話；安靜執行與 SendMessage 分離 | 不能用重建碼證明官方 backend；goal handler 存在不等於已找到自動 producer |
| Codex /goal 固定版本 | `on_thread_idle` → `continue_if_idle` → `start_turn_if_idle` | active goal、deferral、thread 存活與狀態鎖檢查 | 不是另一個外界觀察來源，也不表示另有獨立 completion judge |
| Claude Code 官方文件 | /loop 等時間；/goal 在回合後評估，等待時另有 idle check-in | 動態間隔、Monitor、獨立小模型評估完成條件 | Monitor 背景腳本仍可能 polling；評估器不自行讀檔或執行命令 |
| Voyager | `learn()` 持續 while，前一 rollout 結束後選下一任務 | 環境／成敗 context → curriculum 選題；成功程式保存為 skill | 不需要 cron；也不是不需執行中的程式就自己生成任務 |

各列來源見下方固定路徑。Claude Code 為 2026-09-11 官方文件契約；其他原始碼以列出的 SHA 為準，未宣稱與所有最新發行版一致。

## 具體有哪些值得借鏡的進階設計？

### 1. 先便宜地看，再決定要不要叫模型

Hermes `cron/monitor.py` 先執行已設定的 script 或 URL，hash 與上次一樣就 early return；改變才提供輸出／diff 給後續 agent。這降低空轉模型成本，但 timestamp、排序變動可能造成假變化；baseline 在模型成功前保存，也不能當作送達成功的證據。

來源：[monitor.py L125](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/cron/monitor.py#L125) · [完整 caller 與限制](observation-hermes.md)。

### 2. 模型選下次何時再看

OpenClaw 的 eligible pacing path 把 `nextCheck.delayMs` 經 pacing 限制轉成下一次執行時間；不是所有工作都無條件接受。Claude Code 的動態 `/loop` 也依狀況選間隔。這是「決策生成排程」，之後仍由 timer 執行。Hermes self-paced loop 則以回應 digest 是否重複調整節奏，不等於對環境計算 information gain。

來源：[OpenClaw timer-outcomes.ts L481](https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/src/cron/service/timer-outcomes.ts#L481) · [Hermes loops.py L580](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/hermes_cli/loops.py#L580) · [Claude Code scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks)。

### 3. 完成不是一句話：有接續與評估

Codex 固定版本在 idle 時檢查既有 active goal，使用狀態鎖防止目標在讀取／啟動之間改變，再嘗試開下一輪。Grok 重建會把背景完成結果排回對話。Claude Code `/goal` 則明確描述每輪後另有小模型判斷條件，未達成再開回合；該評估器依賴對話已呈現的證據，不獨立執行驗證。

來源：[Codex runtime.rs L399](https://github.com/openai/codex/blob/634ebc1865c6ac840ed3ba118f040d527bf4b55d/codex-rs/ext/goal/src/runtime.rs#L399) · [Grok completion-revivals.ts L99](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/extensions/transcript/completion-revivals.ts#L99) · [Claude Code goal](https://code.claude.com/docs/en/goal)。

### 4. 整理記憶、產生未來工作

OpenClaw dreaming 在查核版本建立 managed cron job，並限定相關 heartbeat／cron trigger 進入整理；記憶排序／整理是回合裡的工作。Grok 重建的 routine prompt 鼓勵把明確持續需求保存為未來指令與 trigger。兩者可讓未來更有脈絡，但不是「模型在休眠時自行思考」。

來源：[dreaming.ts L132](https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/extensions/memory-core/src/dreaming.ts#L132)、[trigger gate L477](https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/extensions/memory-core/src/dreaming.ts#L477) · [Grok initiative audit](initiative-grok.md)。

### 5. 自己選下一個任務，不是新增喚醒種類

Voyager `learn()` 先取環境，再在迴圈中呼叫 `propose_next_task`、`rollout`，用結果更新歷史與 skill。一般 curriculum 路徑依 prompt 選題，有初始／背包條件等硬分支。價值在「如何選題並累積能力」，不是擺脫時間、事件與控制流。

來源：[voyager.py L295](https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/voyager.py#L295) · [curriculum.py L240](https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/agents/curriculum.py#L240)。

### 6. 更研究型的設計確實存在，但要說出實際多了什麼

Generative Agents 的 reflection trigger 檢查累積重要性計數是否到門檻，再從記憶產生反思。這是執行中的條件判斷，可以抽象為狀態事件；不靠外部新訊息，也不是無因的觸發。其小鎮社交模擬與企業工作交付是不同驗證場景。

來源：[作者論文](https://arxiv.org/abs/2304.03442) · [reflect.py L135 固定版本](https://github.com/joonspk-research/generative_agents/blob/fe05a71d3e4ed7d10bf68aa4eda6dd995ec070f4/reverie/backend_server/persona/cognitive_modules/reflect.py#L135)。

MAGELLAN 在 online RL 中學習預測 competence／learning progress，用來選擇值得練習的目標。這確實比一次 prompt 判斷更複雜，但屬於學習政策，不是新的通知來源；本研究未重現論文實驗，也沒有證明它比簡單 scheduler 更適合催交檔案。[作者論文](https://arxiv.org/abs/2502.07709) · [研究型排序比較](prioritization.md)。

## 可靠性不是裝飾，但也不是神祕的自主性

OpenBot `offerDueRoutines` 處理到期 occurrence、過期視窗及交付 queue；worker claim 確保多個程序不隨意重做同一工作。Grok 的 background wake 做 batching、ownership 與等待回接。這些工程影響是否能可靠長時間運作，值得比較；不應為了說明簡單，就把它們全部說成「只是 cron、沒有價值」。

來源：[OpenBot sweep.ts L135](https://github.com/CopilotKit/OpenBot/blob/7b94a0b802732e6491634160cf9ed3fcfb813424/server/src/routines/sweep.ts#L135)、[queue.ts L268](https://github.com/CopilotKit/OpenBot/blob/7b94a0b802732e6491634160cf9ed3fcfb813424/server/src/work/queue.ts#L268) · [Grok background-wakes.ts L359](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/a9f633e09d49a85829b8236331b9e21f7e612634/source/host/extensions/transcript/background-wakes.ts#L359)。

## 對本專案的選擇

先採「定時查看＋既有職責＋來源工具＋持久工作狀態＋模型判斷＋有根據的動作」。等實際問題出現再加：資料沒變但成本高 → change gate；時效不足 → event；事情做一半斷掉 → completion 接續；重複通知 → 去重與送達紀錄；找錯工作 → 改責任與判斷依據。

「主動」和「互動像同事」是兩條研究主線。前者回答如何自行開始、推進；後者回答如何接話、打斷、交接、保持共同脈絡。見 [同事互動研究](../colleague-interaction.md)。

驗證範圍：原始碼靜態呼叫路徑、官方文件及論文；沒有執行上游完整 runtime、雲端產品、Minecraft 或真人訊息 E2E。
