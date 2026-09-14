# Proactivity · 從認知到 Before / After 架構

本篇是互動研究的完整文字版。先從 [研究地圖](../proactivity.html) 看層級，再到 [Before / After](../proactivity.html#architecture/before/system) 點選架構元件。英文優先；中文用來說明語意。以下 taxonomy 是研究組織方式，不宣稱是任何框架的標準分類。

## Human cognition · 人怎麼想起一件事

人持續運作，但「正在運作」與「為什麼現在想起這件事」是兩個問題。時間經過本身不是充分的因果解釋。

- **Prospective memory**：記得未來要執行的意圖。
- **Monitoring**：有目的地留意時間或相關線索。
- **Spontaneous retrieval**：在適合的線索出現時，意圖被喚回，不必每次都持續費力監看。
- **Self-generated thought**：持續活動中仍可浮現與眼前工作不同的內在想法。

[Einstein et al. (2005)](https://pubmed.ncbi.nlm.nih.gov/16131267/) 比較 monitoring 與 spontaneous retrieval；[Andrews-Hanna et al. (2014)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4039623/) 討論 self-generated thought；[Christoff et al. (2009)](https://pubmed.ncbi.nlm.nih.gov/19433790/) 研究 ongoing task 中 mind wandering 與網路參與。這些不是「人腦就是 cron」的證據。人到 agent 的對照是工程類比，並非神經科學等同關係。

## Mechanism taxonomy · 工程上分四層

| Layer | 原詞與例子 | 工程責任 |
| --- | --- | --- |
| Trigger | Cron、Heartbeat、Webhook、user request、on-exit | 何時开始／喚醒工作 |
| Observation | Tool execution、monitor mode | 讀取環境、比較狀態、形成可用證據 |
| Execution | Agent loop、Iterative prompting | 在一個 run 內持續推論、呼叫工具、接收結果、停止 |
| State / Delivery | Task phase、receipt、artifact | 接續進度、去重、保存成果、辨識投遞結果 |

**Time / Event** 足以作為常見外部入口的高層抽象，但不是完整的 agent 執行理論。正在執行的程式可以接著做下一步，不必等待新的 timer。**on-exit** 是 completion event；**Observation** 可以由 timer 或 event 啟動；自適應下一次檢查仍可落到 scheduler。比較時不要把這些不同層級平鋪成互斥類別。

[OpenClaw Agent loop](https://docs.openclaw.ai/concepts/agent-loop) 描述 intake、context assembly、model inference、tool execution、streaming、persistence。[Heartbeat](https://docs.openclaw.ai/gateway/heartbeat) 與 [Cron jobs](https://docs.openclaw.ai/cron-jobs) 是不同用途的工作啟動機制。`Agent loop` 不等於每個 idle session 都永遠呼叫模型。

**Intake** 表示進來的工作被接收。**Handoff** 是工作移交；本研究 [OpenBot](openbot.md) 的 Handoff result relay 是具體實作，不能把所有中文「接手」都直接翻成 handoff。`Lease heartbeat` 用於續租，不等同 Agent Heartbeat。

其他實作請沿固定版本來源查：[Hermes](hermes.md)、[Grok reconstructed](grok-reconstructed.md)、[Voyager](voyager.md)、[Framework terminology](framework-terminology.md)。Grok 重建來源不是 xAI 官方產品保證。

## Historical experiment · Inferred commitments

[OpenClaw Inferred commitments](openclaw-inferred-commitments.md) 曾用背景抽取推斷未來跟進，再交給 Heartbeat。這增加「追蹤什麼」的推斷，而不是第三種神祕觸發器。抽取與投遞已退役，CLI 留下歷史資料清理功能。不能把歷史護欄當成現有功能，也不能從護欄反推並斷言官方退役理由。

## Before · 原始碼已有什麼

檢查對象：本架構專案的 [Phase 0.5](../../phases/0.5/README.md)，以及同層 prototype repo `prjt-digital-colleague-prototype`，固定 commit `bb7101c3cfca32ea2982268de47958bea648df98`。本次為 source inspection，沒有啟動整條 runtime integration。

| Component | Source | 已見責任 |
| --- | --- | --- |
| LocalColleagueService | `src/runtime/local-service.ts:849–877` | dispatch / dispatchAutomation、admitted work、fresh readiness check |
| StandaloneGateway | `src/gateway/standalone.ts:535–568` | 同 thread 的 promise queue，呼叫 runtime.respond |
| OpenClawGatewayRuntime | `src/runtime/openclaw-gateway.ts:184–214` | POST /v1/responses、provider turn 的受限 agent 路由 |
| M365InboundRuntime | `src/m365/inbound-runtime.ts:109–143` | validateEvent、in-flight dedup、durable receipt 命中處理 |
| M365InboundReceiptStore | `src/m365/inbound-receipts.ts:45–68` | has / record / projection / listProjections；metadata-only |
| ProactiveTaskPhase | `src/events/events.ts:15–33` | received、triaging、awaiting_approval、sending、cancelling、cancelled、completed、failed |

所有上表摘錄已內嵌在網頁，與 hash／固定 commit 一起產生在 `implementation-excerpts.js`，不依賴讀者存取私人 repo。

現有路徑是 Interaction Client → LocalColleagueService → StandaloneGateway → OpenClawGatewayRuntime → 外部 OpenClaw `/v1/responses`。此 managed profile 使用 Codex harness；`codex-direct` 是替代 profile，不是串接的下一層。外部 Runtime Controller 核心不在 prototype 裡；distributed gateway 仍為設計 stub。

Microsoft Graph webhook 與 delta polling 已有接入和狀態。Before 不能畫成只有聊天。Task state、receipt 與 artifact 各有責任，receipt 命中也不自動證明外部投遞 exactly-once。

## After · 整合提案

1. **Cron / Heartbeat configuration**：定義 standing duty 與執行時間。確認部署固定的外部 OpenClaw 版本與 profile 暴露的原生排程、completion 接口；上游存在不等於本地已接好。
2. **Follow-up records**：本專案提案的業務資料，並非 framework 原生類別。保存 owner、deadline、task reference、上次追問與證據、下次檢查條件。不要把 waiting 虛構成現有 enum。
3. **Scenario verification**：針對一件完整工作定義成功與失敗證據。重用已有 ingress、admission、runtime adapter、task state 與 artifacts。

圖中 native wake / next check 的虛線是待確認契約，並非可直接呼叫的已實作 API。State 層圖是資料責任關聯，不代表每條箭頭都是程式呼叫。Application 圖中 admission 是接入控制邊界；`assertAutomationAdmission` 不是 `dispatchAutomation` 的直接內部呼叫。

## Scenarios · 國泰情境假設

優先假設為內部專案／營運協作，尚未由業務確認，不含金融決策或外部客戶自動承諾。

| Scenario | Before 重用 | After 新增／驗證 | Acceptance |
| --- | --- | --- | --- |
| Meeting preparation | M365 tools、runtime、artifact | 會前檢查、缺件清單、owner 與上次追問 | 齊全不催、問過不重問、briefing 有來源 |
| Progress check | automation admission、provider scope、task projection | standing duty、阻礙判定、頻率及停止條件 | 沒變不通知、正確 owner、取消停止 |
| Inbound request | M365 ingress、receipt、artifact | 業務分類與交付標準 | 跨 webhook / polling 去重、受限工具權限 |
| Completion follow-up | task state、artifact | completion binding、產物驗證、投遞契約 | exit 0 不等於業務完成；失敗保存成果 |

網站的 local demo 只模擬 Meeting preparation 的明確規則：讀取失敗 → RETRY；資料齊 → PREPARE；剛問過 → WAIT；否則 → ASK。這些 action label 是示範結果，不宣稱為 OpenClaw enum，也不實際寄信。

## Verification · 怎麼驗證與衡量

分開四個證據層級：Source inspection、Isolated probes、Scenario integration、Production reliability。

既有 [probe results](source-probe-results.json) 來自原樣抽取的 Hermes 函式，發現 digest / fingerprint 碰撞；不含 installed Hermes、模型呼叫或 E2E。不能擴大解釋為 runtime 已壞掉或整合驗證已完成。

Proposed integration acceptance：

- **Duplicate event**：Webhook 與 polling 同時到，只接受一次有效工作；投遞去重另驗證。
- **No change / stale input**：不必通知時保持安靜，過期 snapshot 不假裝即時。
- **Read failure**：工具失敗保留未知狀態，不把讀不到當成缺件。
- **Crash / restart**：逐一注入崩潰點；恢復工作而不重複副作用。
- **Delivery failure**：保留已生成成果與待送狀態，不因 observed receipt 丟掉交付。
- **Cancellation / changed request**：舊工作停止，新要求保留版本與驗收標準。
- **Scope / budget**：錯對象與越權投遞被拒，額度耗盡有可追蹤的停止原因。

Production metrics 應量測 accepted trigger 到有效結果的延遲、重複投遞率、恢復率、錯誤對象、成本、打擾率。尚無本次量測 baseline，不先捏造 SLO 達標百分比。

## Diagram tooling

[mingrammer/diagrams](https://github.com/mingrammer/diagrams) 0.25.1 產生技術架構，圖源在 `research/tools/build_architecture.py`。可輸出 SVG / PNG；互動由前端處理 SVG node link，並提供文字按鈕。設計角色與閱讀層級参考 [diagram-design](https://github.com/cathrynlavery/diagram-design)；[專案風格設定](diagram-project-style.md) 保留既有 Cream 配色與一致字體。

網頁圖提供 Before / After、元件展開、原碼摘錄與來源邊界。完整文件在站內讀取，不需要跳回原始 Markdown。
