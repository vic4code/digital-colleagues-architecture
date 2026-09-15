# Speaker notes · Digital colleague initiative

14 頁主線，約 15 分鐘，含看圖、換頁與停頓；另有 2 頁問答附錄。每頁口說約 30–60 秒。先用買牛奶的生活例子理解主動性，再用 N-17 公告 × C-042 契約示意案例說明工作情境；來源供會後查閱，不必念出。

Architecture continuity：第 6 頁是 Before；第 7、8 頁是 Time／Event **替代入口**；第 9 頁是兩者共用的 Task discovery。固定原圖位置，保留共用元件；藍色表示當頁新增責任，不表示已部署。

## 01 · The question — 自己想到值得做的事

我們希望數位同事能做到一件事：沒有人逐件交辦，仍然提出有根據的新工作。先從生活中的買牛奶理解，再進入法遵示意案例：新公告 N-17 出現，Agent 為什麼會想到契約 C-042 值得檢視？先從人的主動出發，查各框架機制，再接回原架構，最後談做到什麼程度、怎麼驗收。重點是「工作由誰想到」，而不只是讓同一個任務跑更多輪。

講圖：指向主張與五段主線；這頁先不解釋任何排程工具。

轉場：先從生活想起：沒人叫你買牛奶，你怎麼想到要補貨？

來源：本研究的情境類比，不是人類認知模型的實驗結論。

## 02 · Human → Agent — 生活中的兩種入口

先用買牛奶理解。左邊：週末到了，你想到該檢查家裡缺什麼，檢查冰箱才發現牛奶沒了。右邊：你打開冰箱，直接發現牛奶快喝完了。兩邊都沒有人叫你買牛奶，你卻自己想到該補貨。差別是左邊由時間帶起檢查，右邊由事件帶起想法。

講圖：左邊指週末日曆，右邊指冰箱前快空的牛奶瓶，最後指「該買牛奶了」。Event 不加入時鐘或日期，保持差異清楚。

轉場：換成 Agent，哪些實作機制能提供這樣的思考機會？先看框架真的怎麼啟動下一輪，再歸納。

來源：生活示意類比，不是人類認知模型的實驗結論。

## 03 · Framework evidence — 先追下一輪怎麼開始

這張表先看原碼和可用介面，再做分類。OpenClaw、Hermes、Claude Code 有排程與事件路徑。Codex 這次追的是 active goal 在 session idle 時續行。Voyager 則在 rollout 回傳後，由 while 直接選下一題；可以把完成條件抽象為內部 Event，但不是說它有 event bus。Grok Build 的公開建立介面還有空缺，因此不代填。結論只涵蓋本次確認的路徑。

講圖：只帶三種代表：排程／通知、idle continuation、rollout completion；不逐列朗讀。

轉場：名字很多，但這些機制其實各自負責不同部分。

來源：[OpenClaw](../source-notes/openclaw.md)、[Hermes](../source-notes/hermes.md)、[Trigger audit](../source-notes/proactive-trigger-mechanisms.md)、[Voyager curriculum](https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/agents/curriculum.py#L240)。

## 04 · Mechanism relationships — 各自負責什麼

Cron 決定排程，Heartbeat 是一種巡檢回合，Polling 是讀來源、發現變化的方法；它們可以組合在同一條路徑。Time 到期後，可以先讀來源、比較，再決定是否叫模型。Event 路徑先驗來源、去重，再過 admission。狀態門檻、程序完成和串流資料，也可以構成事件條件。Goal loop 則是既定目標的續行控制，和觸發入口是不同問題。

講圖：沿 Time 一排走，再沿 Event 一排走，最後落在兩排共用的 Agent turn。

轉場：Trigger 讓一輪開始，但誰決定這輪值得做什麼？

來源：[OpenClaw scheduler](https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/src/cron/service/timer-scheduler.ts#L55)、[Hermes monitor](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/cron/monitor.py)、[Claude scheduling](https://code.claude.com/docs/en/scheduled-tasks)。

## 05 · Key insight — 定期觀察，也能想到新工作

這是今天最重要的分界。人可以設定「定期檢視授權來源，找出值得處理的契約問題」，而不指定每份契約。到了時間，Agent 讀到職責、N-17 和契約現況，自己提出 C-042 值得查證。人設定觀察時間，不代表人已經決定每一次的工作。要讓這件事可靠，普通 agent turn 還需接上 context、查證、去重與人審。這是依公開介面推導的組合方案。

講圖：先指 Entry，再停在 Context 與 Discovery；口頭先不用尚未定義的 Phase 代號。

轉場：這條從觀察到新提案的路，應該接在我們哪幾個元件？

來源：[Task discovery definition and recipes](../source-notes/phase-task-discovery.md)。

## 06 · Before — 保留原元件，補連接方式

先看原架構的位置。Workspace 提供職責和規則，Controller 處理 session 與派工，Triage 管路由和批准需求，Codex 執行，MCP 連授權來源。接下來三頁都保持同一張圖、同一個元件位置；藍色標出當頁要增加的責任。這張 Before 是設計基線，不等於所有契約都已上線。要補的，是主動觀察、狀態保存與對帳如何穿過這些元件。

講圖：先定位 workspace、runtime、integration 三層。翻頁時不要重新介紹原圖；讓觀眾追藍色修改。

轉場：先接 Time：定期讀公告，有變化才交給 Agent。

來源：[Phase 0.5 reference architecture](../../phases/0.5/reference-architecture.svg)。

## 07 · Time entry — Change-gated monitor

第一條路從 Scheduler 到期開始。MCP 讀公告來源，Triage 比較版本；沒變化就留下 Skip，有變化才由 Controller 派送。這裡 observed_hash 和 processed_cursor 要分開：看過某個版本，不代表那批資料已成功處理。產物可靠保存後，才推進處理進度。這是我們要補的宿主契約；零模型回合也仍有輪詢、網路和儲存成本。

講圖：順著 1 Scheduler、2 MCP、3 Triage、4 Controller，停在 hash 與 cursor 的區別。

轉場：如果來源能直接通知，就換 Event 入口，後面的執行元件仍沿用。

來源：[Integration proposal](../proactive-integration.js)、[Hermes monitor source](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/cron/monitor.py)。參考機制不代表直接照抄其 baseline 語意。

## 08 · Event entry — Alternative entry，不是下一道工序

這頁不是接在 polling 後面的下一步，而是另一個入口。N-17 更新通知先到 Ingress，驗證、去重並保存來源識別；Controller 找到對應角色，Triage 檢查後交給 Codex。同一通知重送，不應重複派工。這時得到的是 Observation context，還不是 Agent 已經產生新工作。Time 和 Event 可以各自把觀察送進同一套 runtime。

講圖：指 Alternative entry，再指 event_id、source_ref、dedup_key；原元件位置保持不動。

轉場：入口接好還不夠，接下來才讓 Agent 從 N-17 想到未指定的 C-042。

來源：[Proposed component contracts](../proactive-integration.js)、[Codex app-server turn/start and outputSchema](https://developers.openai.com/codex/app-server/)。

介面來源：[OpenClaw hooks](https://docs.openclaw.ai/automation/webhook)、[Component integration proposal](../proactive-integration.js)。此頁是本架構的 proposed integration。

## 09 · Task discovery — 兩種入口共用的後續能力

不論從 Time 或 Event 進來，選題都需要這段。Workspace 帶進職責、新證據與提案歷史；Codex 產生候選工作；MCP 取得查證材料；Triage 與宿主檢查引用、相關性、重複和授權，才送人審。Candidate 不等於已核准任務。Accept、Reject、Snooze 要分開記，避免把延後學成永久否決。圖上的資料契約是整合提案，仍需在宿主實作。

講圖：沿四個藍色元件走；強調這是兩種入口共用的 discovery，不是新的觸發器。

轉場：同一組元件能承擔不同程度的決定權，接著用三個 Phase 定義。

來源：[Proposed component contracts](../proactive-integration.js)、[Codex app-server turn/start and outputSchema](https://developers.openai.com/codex/app-server/)。

角色選題與企業化缺口：[Task discovery recipes](../source-notes/phase-task-discovery.md)。

## 10 · Phase goals — 誰決定工作

P1，人給工作清單與時間，Agent 執行固定工作。P2，人給目標與驗收條件，Agent 自己拆步驟、執行，未達標則在限制內繼續，或以 Blocked、Exhausted 停下。P3，人給職責與權限，Agent 從證據產生未逐件交辦的新工作提案。這三個階段都能用 Time／Event。Phase 分的是能力成熟度，不是部署時程；P2 的新步驟仍然屬於已交辦目標。

講圖：先橫讀 Human 列，比較人給的指令；再看深藍 Agent 列，從執行既定工作到產生新候選。最後指 P3 的新提案與人決定。

轉場：第三階段不用等一個專用自主工具，哪些現有介面能先組起來？

來源：[Original three-phase planning](https://github.com/shane01526/agent_initiate/blob/main/2026_08/scenerios/scenario-legal.md)、[Definition clarification](../source-notes/phase-task-discovery.md)。

## 11 · Framework × P3 — 可組合，不等於已驗收

OpenClaw 可以自訂 heartbeat prompt，Hermes 排程 prompt 或 discovery skill，Claude 用 loop.md 或 CronCreate，Codex 由宿主發起帶 outputSchema 的 turn，OpenBot 用 routine instruction。Voyager 則已有環境選題的 curriculum。這些是不同程度的 building blocks；我們仍要補證據、持久提案、去重與人審。沒有專用選題按鈕，不代表做不到；有可組合介面，也不表示完整企業能力已驗收。

講圖：每家只點 recipe，不逐格念；共同待補能力讀一次即可。Grok Build 保留介面查核空缺。

轉場：現在把組合方案放回同一個案例，看人最後會收到什麼。

來源：[Hermes cronjob_manage](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/tools/cronjob_tools.py#L525)、[Claude loop.md](https://code.claude.com/docs/en/scheduled-tasks)、[Codex app-server](https://developers.openai.com/codex/app-server/)、[OpenBot create_routine](https://github.com/CopilotKit/OpenBot/blob/7b94a0b802732e6491634160cf9ed3fcfb813424/server/src/plugins/builtin-routines.ts#L74)、[Voyager curriculum](https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/agents/curriculum.py#L240)。

## 12 · Cathay scenario — N-17 連到 C-042

人給的職責是協助檢視待續約契約，沒有指定去查 C-042。示意公告 N-17 說 A 類委外需核對附件 X；契約 C-042 的分類是 A 類，但清單沒有 X。Agent 因此提出檢視建議，交付公告條文與契約附件的對照，讓法遵人員確認適用性。它找到的是未逐件交辦的工作，而不是代替法遵下結論。這裡都用示意資料，沒有接真實內部契約。

講圖：先指出兩份 evidence 的關聯，再讀 proposal 和具體交付物。

轉場：能提出一次還不夠；條件不成立或工作已處理時，也必須不提。

來源：[Authored scenario fixtures](../story-home.js)、[Original legal scenario](https://github.com/shane01526/agent_initiate/blob/main/2026_08/scenerios/scenario-legal.md)。

## 13 · Acceptance — 三種條件加恢復測試

第一種，有相關新證據、沒有逐件交辦，應找到 C-042 並附來源。第二種，把契約改成不適用的 B 類，就不應再提。第三種，同版本議題已結案，沒有新差異，也不應重提。再故意重送事件、中途重啟、讓來源失敗，檢查是否重派、丟工作或假裝沒變化。這些是驗收規格，還不是已執行的業務測試；有用性仍要讓業務人員評閱。

講圖：帶三列 PASS／FAIL 後，再指三個故障注入。避免只用生成提案數當成果。

轉場：下一個 gate，就是把這些條件放進一條真的能跑的 prototype。

來源：[Acceptance fixtures and expected outputs](../story-home.js)、[Validation and metrics](../source-notes/initiative-implementation-guide.md)。這些是驗收規格與預編示範，未執行本次業務模型測試。

## 14 · Next gate — 一個角色，一條完整路徑

建議收斂在一個角色、一條來源和私有提案入口。先接穩 Scheduler／Ingress、比對、去重與預算，再補角色投影、對帳及提案歷史，最後用固定資料 replay、人工評閱和故障注入驗證。看有用、漏判、重提三件事：漏判需要人工標註機會，不能只靠線上產物算。原研究 P1 有驗證版與測試報告；這次沒重跑，P2、P3 仍待實作。

講圖：沿 Build、Context、Validate，最後指三個指標分母。主線到這裡結束。

轉場：主線先到這裡；若要追問歷史機制或原圖位置，後面有兩頁附錄。

來源：[Implementation status and gaps](../source-notes/initiative-implementation-guide.md)、[Phase recipes and limits](../source-notes/phase-task-discovery.md)。原研究 90 項測試與兩次真實整合是歷史報告，未在本次重跑，也不代表國泰業務效果已驗證。

## 15 · Appendix A — Historical inferred commitments

這是更窄的歷史功能：對話後可能背景抽取跟進事項，保存 due window 與 session／target，到期由 heartbeat 決定問一次近況或略過。舊到期回合沒有工具，不能現場查證交付物是否完成。後來 extractor 和 delivery 被移除；heartbeat 不會自動接替舊抽取器。移除紀錄沒有完整決策理由，不能直接說是成本高或騷擾。自訂角色選題與復活這個子系統，是兩回事。

講圖：只在被問到從對話抽取／退役時使用。續約對話是示意，不是真實使用者紀錄。

轉場：如果問題是這些能力應放哪裡，下一頁可回到完整原圖定位。

來源：[Historical design](https://github.com/openclaw/openclaw/blob/1a34950d9c517325f61d7e9b2367c839845c64d9/docs/concepts/commitments.md)、[Removal commit](https://github.com/openclaw/openclaw/commit/4b0151682ef4cbcf5360fd79cc73b44c62a0c911)、[Retirement audit](../source-notes/openclaw-inferred-commitments.md)。

## 16 · Appendix B — Full reference architecture

這是沒有裁切的 reference architecture，供討論定位。上層是同一個人機互動入口，中間是 workspace、Controller、Triage 與 Codex，下層是服務事件和 MCP 工具，權限與稽核跨越各層。主線的幾張 After 都沿用這些位置；新增的是觀察、狀態與控制契約，而不是另外發明一個常駐的靈感服務。這張是原設計責任圖，不是完整部署驗證。

講圖：依提問指元件，不必重新講完整架構；Time、Event 和 Discovery 的差異可返回第 7–9 頁。

轉場：討論時請指定一個元件或一個驗收條件，我們就能具體確認下一步。

來源：[Phase 0.5 reference architecture](../../phases/0.5/reference-architecture.svg)。
