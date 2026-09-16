# 講者備註 · 數位同事主動性

13 頁主線＋2 頁附錄，約 15–18 分鐘。主線服務現場講解；介面細節與證據留在附錄及備註。


<a id="slide-1"></a>

## 01 · 數位同事  如何做到主動性？

這場分享討論數位同事如何做到主動性。先回到人的生活例子，再從框架實作歸納啟動機制，接上我們的三階段規劃與既有架構，最後用國泰法遵的虛構案例說明如何驗收。

今天的「主動」重點是沒有逐件交辦，Agent 仍能發現值得做的新工作。自動續跑已交辦任務是其中一種自主能力，但與自行選題不同。

轉場：先暫時放下框架，看看人什麼時候會自己想到要做事。


<a id="slide-2"></a>

## 02 · 先回到人： 什麼時候會主動？

兩個生活例子刻意保持同一個結果。第一個是到了週末，主動查看家裡缺什麼；第二個沒有設定檢查時間，是看到牛奶快空了才想到要買。重點是時間到了或事件發生，都可能讓人想到該做的事。

這是生活類比，不是人類認知的完整分類。下一頁回到框架實作，看看軟體實際提供哪些機制。


<a id="slide-3"></a>

## 03 · 先看框架： 主動性是怎麼啟動的？

這頁是主線的實作證據：先看每家代表路徑，再看右邊 Trigger 標籤。OpenClaw 的 Heartbeat／Cron 是時間入口，Hooks 是通知入口。Hermes monitor 先由時間啟動，hash 變化是是否進模型的 gate；Goal judge 則在回合後評估既定目標。Claude Code 的 CronCreate／loop、Channels 與 Goal 分別提供排程、訊息及回合後續接。

Codex 這頁只取 Active-goal 的 thread idle 路徑，列 Event 不代表產品沒有其他排程入口。OpenBot routine 到期入列，handoff 與結果抵達也會帶來工作。Voyager 在 rollout 回傳後直接沿 learn() 迴圈選題；完成事件是分類抽象，不是聲稱原碼有 Event bus。這些是固定查核範圍的代表做法，不是市場排名或完整能力盤點；Grok Build 尚缺可重驗公開介面，不補進確定結論。

講圖：由 Framework、執行路徑，讀到 Trigger label；選排程、變化 gate、完成續接三種代表講，不必逐格朗讀。

轉場：把剛才的啟動條件抽出來，可以歸納成兩類；下一頁也分清 Trigger 和執行機制。

來源：[OpenClaw scheduler](https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/src/cron/service/timer-scheduler.ts#L55)、[Hermes cronjob tool](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/tools/cronjob_tools.py#L525)、[Hermes monitor](../source-notes/observation-hermes.md)、[Claude scheduling](https://code.claude.com/docs/en/scheduled-tasks)、[Claude Channels](https://code.claude.com/docs/en/channels)、[OpenBot routine interface](https://github.com/CopilotKit/OpenBot/blob/7b94a0b802732e6491634160cf9ed3fcfb813424/server/src/plugins/builtin-routines.ts#L74)、[Goal／Voyager 固定路徑](../source-notes/proactive-trigger-mechanisms.md)。

補充來源：[Codex app-server](https://developers.openai.com/codex/app-server/)、[Voyager curriculum](https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/agents/curriculum.py#L240)。Codex active-goal 控制流依上述固定路徑 audit；app-server 文件支持整合介面，不替代該原碼證據。


<a id="slide-4"></a>

## 04 · 從這些實作，歸納出 兩類 Trigger

這是從前頁已檢視的執行路徑做的工程分類，不是所有框架能力的窮盡性定理。Time是掛鐘或相對時間條件；Event包含通知抵達、狀態改變或程序完成。持續運行的迴圈是控制流，不一定有獨立排程器或事件匯流排。

Polling是怎麼偵測，不是第三類Trigger。Hermes的例子是timer先讓monitor讀來源，hash改變才進模型，啟動與gate是兩層。Goal則回答既定目標要不要續行。

轉場：有了啟動機制，不代表已經會自己選題。我們的三個Phase要增加的是工作決定權。


<a id="slide-5"></a>

## 05 · 回顧我們的三個 Phase： 按技術完成度推進

這頁回顧既有的三個Phase，不是另訂一套排程表。階段以技術完成度區分，並非以時間切。P1人给內容和節律，用心跳輪詢或定時排程產出指定工作，有驗證版實作。P2人只給目標和完成判定，Agent監控狀態、規劃與續做，目前只有規劃。P3人給抽象願景、角色、權限與知識庫，Agent從對話或現況推斷未被交辦的新工作，目前只有規劃。

每個階段都要review目標、技術開發重點、達標標準與刻意不做；先問「沒過代表什麼」。P1到期沒產物，P2目標沒達卻停，P3只能做指定事項，都不是同一種失敗。

原2026-08/09調研的「業界目前是零」，限定五框架、公開可調用介面，以及從對話自行推斷且持久跟進的嚴格判準；它不是所有角色巡檢或企業P3的普遍結論。Heartbeat prompt可組合發現新任務，但組合可行不等於已驗收。此處保留我們的階段定義與成熟度，歷史判準在附錄註記。

來源：[原三階段情境](https://github.com/shane01526/agent_initiate/blob/main/2026_08/scenerios/scenario-legal.md)。

轉場：原架構已經有啟動入口；接著看要在哪些元件補上這三階段需要的實作。


<a id="slide-6"></a>

## 06 · 原架構已具備  Webhook 與 Scheduler

先介紹現有設計，不把既有Webhook和Scheduler說成這次新發明。Workspace定義角色；Controller管理session與dispatch；Triage負責分類與批准；Codex app-server跑Agent；MCP串接資料與動作。圖中保留Service integration與最下方外部工具服務，UI與橫向audit在此聚焦圖省略，完整圖在附錄。

原架構有主動性的入口責任；這是 Existing design，不是部署證明。入口存在不代表 P2／P3 的任務狀態、發現政策與驗收已完成。

轉場：先看Time路徑，借用框架中的排程與monitor做法。


<a id="slide-7"></a>

## 07 · Time： 排程、檢查、派工怎麼接？

借鏡Cron的到期派工與Hermes monitor的hash gate。Scheduler決定何時；MCP讀來源；Triage用確定性條件判斷是否要開turn；Controller選對role/session與任務模式。

不是所有Scheduled job都必須有新資料才執行：固定到期產物、due follow-up、尚未完成的Pending work仍可能要跑。Hash unchanged不能抹掉待辦。提案設計應讓observation與pending work原子保存，產物以唯一鍵冪等保存後才更新cursor；詳情留講稿，不另佔主線。

來源：[Hermes monitor](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/cron/monitor.py#L125)。monitor的hash寫入先於模型呼叫，不能直接當成我們的完成狀態。

轉場：來源能推送時，不必等下一次polling。


<a id="slide-8"></a>

## 08 · Event： 通知與完成狀態怎麼接？

外部事件借鏡OpenClaw Hooks、Claude Channels：來源驗證、重送去重、規格化事件，再交role/session與權限判斷。內部事件如turn完成或thread idle由Runtime Controller接住，不必繞外部Webhook。

這是 Time 路徑的替代入口，不是下一道必經工序。P2 宿主應保存 goal、completion criteria 與 progress；Time 也能檢查同一組狀態。事件抵達或turn完成後，讀最新狀態、評估是否完成，才決定continue、wait或complete。Codex active-goal與Voyager rollout的續接是不同具體實作；此頁是整合提案，不宣稱工具有同名新增API。

來源：[OpenClaw Hooks](https://docs.openclaw.ai/automation/webhook)、[Claude Channels](https://code.claude.com/docs/en/channels)。

轉場：Time或Event進來後，若我們只給職責，Agent該怎麼發現新任務？


<a id="slide-9"></a>

## 09 · Time / Event 之後： 用任務政策滿足 P1–P3

P3可以由Time trigger達成，但timer本身只提供推理機會。Controller需要載入role、evidence、history；Discovery instruction要求找值得做的新工作，允許沒有候選。模型輸出target、evidence refs、reason、priority rationale與proposed deliverable。

Codex宿主可用turn/start＋outputSchema；OpenClaw可設定custom heartbeat prompt；Claude可用loop/CronCreate；Hermes用cronjob_manage配合prompt/skills；OpenBot用routine instructions。Voyager原生有curriculum選題，但企業permission、proposal lifecycle與人審仍需另外接。這些是組合路徑，不是企業P3已驗收的證明。

Triage在宿主驗證來源存在、符合角色範圍、同版本議題是否已處理，並用政策評估priority。Model提供排序理由，不可自行升級權限。提案送人審；No-op也應有具名原因。

來源：[Codex app-server](https://developers.openai.com/codex/app-server/)、[Claude scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks)、[Phase task discovery](../source-notes/phase-task-discovery.md)。

轉場：把這條Discovery路徑放進法遵案例。

本頁三個模式共享元件，不是把P1/P2都叫做Discovery。P1執行已指定工作；P2保存goal/completion criteria/progress並續行；P3才用role/evidence/history推導新候選。前兩頁只回答何時啟動，本頁回答啟動後選哪一種工作政策。優先級由政策與證據判斷，不等於新增權限。


<a id="slide-10"></a>

## 10 · 治理同事審閱 CAB： 先看完整工作流程

使用者指定改為治理同事審閱CAB文件。提供的截圖暫存路徑不存在，因此本頁先以通用CAB審閱骨架示意，不能當作國泰現行流程已查證。CAB-042核心服務版本更新也是虛構案件。

五步：接收案件及版本、核對完整性、審閱風險與證據、追蹤補件並重審、整理意見交CAB人員決策。文件可包括部署計畫、測試紀錄、回復計畫；此例回復計畫有寫，但驗證紀錄未附，代表需要查證，不直接等於不能回復。治理同事不能自行核准上線。

先講流程，暫不把流程本身叫主動性：人按下審閱按鈕，也會走這五步。下一頁才用觸發來源和交辦紀錄，標出哪些啟動是主動的。


<a id="slide-11"></a>

## 11 · 主動性觀測點： 它在哪裡自己啟動？

這頁跟上一頁節點對齊，觀測的是自主啟動而非生成多少文字。四個觀測點：進件前的定時查詢、進件後自啟審閱、補件期限的主動追蹤、風險審閱中自行提出跨案工作。

第一格「有新案件嗎」不能變成每個tick都騷擾人：有權限時先查清單。只有拿不到清單而且政策允許、沒有已回覆或snooze，才在合適時機詢問。外部訊息須依通道與審批授權；此簡報是預期能力，不表示已自動寄送。

第二格新案即自啟審閱，第三格期限到即跟進，主要證明P1/P2的主動執行。若人本來就規定這些動作，不能當作P3。

第四格用虛構CAB-042/CAB-043：兩件變更共用資料庫而且部署時窗重疊，原本沒交辦跨案檢查，Agent從脈絡提出聯合影響評估的新工作；這才驗P3選題。資料關聯只是建議檢視，不直接斷言一定衝突。這個新證據可由Event抵達，也可由Time巡檢發現。

Trace至少含wake_source、scheduled_at/received_at、case/version、human request id或未交辦註記、action_start、reason/evidence、dedup_key、outcome。只有Agent自稱「我主動」不算證據。


<a id="slide-12"></a>

## 12 · 驗收主動行為： 有啟動、有克制、能恢復

本頁數字全部是假設，用來說明主動行為如何量測，並非產品現況或國泰pilot結果。每個分母是獨立測試集，不是同一批案件一路縮減。

Time：10次应执行的排程都有可追溯的执行结果或具名skip。由测试集事先规定其中3次有需处理案件，3次都启动；另外7次正确安静结束。只看10/10有log仍不足，要比对结果是否正确。只有無案件清單權限、具授權而且符合冷卻規則的fixture應詢問。

Event：10個合格、唯一的新案件版本，9個在首次事件抵達後60秒內開始審閱，1個逾時留在分母。重送不增加分母，另計它是否造成重複審閱。

Follow-up：4個截止、未回覆且不在snooze的案件，在截止後30分鐘内产生合规跟进。已回覆、未到期或snooze中是負例，誤催必須另外計。

Recovery：5個注入故障的可恢復工作，在服務恢復後5分鐘內達預期終態。Pending後中斷應恢復；Proposal後中斷應命中同一唯一鍵，不新增產物。記錄同一工作ID並對帳，不能用新run掩蓋舊失敗。

前三項驗主動執行，第四項驗可靠性，仍不能直接證明P3。P3用事前人工標註的4個未交辦治理機會，Agent發現3個、漏1個；同時盲評證據與實用性，記錄誤提/重複/成本，不能用Agent自己的產物當機會分母。小樣本只示範算法；正式穩定性需固定模型與權限、重跑、報告樣本數和變異。


<a id="slide-13"></a>

## 13 · 讓數位同事主動，  從這三件事開始

三個結論：從Time/Event啟動；依既有三Phase逐步增加責任；用CAB流程中真正自主啟動的節點與負例驗收。第一個試做限定治理同事、CAB案件來源、可追溯審閱與提案。治理同事不代替CAB核准；對外追問走已授權通道。

區分主動執行和自主選題：新案自審、規則催辦可驗P1/P2；未交辦的跨案影響評估才是P3候選。主要成功不是講出更多話，而是該啟動時啟動、該安靜時安靜、失敗能恢复，且找出有據的新工作。

CAB原圖未讀到，本示意流程需與現行規範對齊。附錄供查核框架入口與完整原架構。


<a id="slide-14"></a>

## 14 · 框架查核表： 介面與採用方式

這是附錄的查核與採用表，依問題定位單一框架即可。OpenClaw 的 Heartbeat config／Cron／Hooks 能承載自訂角色巡檢；Hermes cronjob_manage 的 monitor_script／monitor_url 提供變化 gate，但完成狀態要另外管理。Claude 的 CronCreate／loop／Channels 把工作帶進 turn，選題仍取決於任務政策。各家排程持久性、session 作用域與停止條件不同。

Codex 的宿主接 Trigger，用 turn/start＋outputSchema 收候選，再驗引用與政策；Active goal 是既定目標續行。OpenBot create_routine／result relay 提供持久派工與結果回送，不自動等於選題政策。Voyager propose_next_task／learn() 已有環境選題，企業權限、證據與人審仍需另接。可組合不等於本次已逐家完成企業 P3 驗證。

頁底的歷史補充只在被問到 inferred commitments 時展開：它曾背景抽取對話跟進候選，保存 due window／session／target，到期由 heartbeat 決定 check-in 或 dismiss。舊到期回合沒有工具，無法現場查完成證據。Extractor 與 delivery 後來被移除；未查得併入 Orbit 的依據，不能把現行 heartbeat 巡檢當成自動接替。已查移除紀錄未說明完整產品決策原因，不能自行歸因成本或騷擾。這些都是有範圍的證據結論，不是宣告所有主動性不可行。

講圖：上方依框架查入口，下方單獨說明歷史功能；不再重講主線的六列機制。

轉場：若問題是這些能力在我們架構的什麼位置，最後一頁提供完整原圖。

來源：[OpenClaw scheduler](https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/src/cron/service/timer-scheduler.ts#L55)、[Hermes cronjob tool](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/tools/cronjob_tools.py#L525)、[Hermes monitor](../source-notes/observation-hermes.md)、[Claude scheduling](https://code.claude.com/docs/en/scheduled-tasks)、[Claude Channels](https://code.claude.com/docs/en/channels)、[OpenBot routine interface](https://github.com/CopilotKit/OpenBot/blob/7b94a0b802732e6491634160cf9ed3fcfb813424/server/src/plugins/builtin-routines.ts#L74)、[Goal／Voyager 固定路徑](../source-notes/proactive-trigger-mechanisms.md)。

來源：[Historical design](https://github.com/openclaw/openclaw/blob/1a34950d9c517325f61d7e9b2367c839845c64d9/docs/concepts/commitments.md)、[Removal commit](https://github.com/openclaw/openclaw/commit/4b0151682ef4cbcf5360fd79cc73b44c62a0c911)、[Retirement audit](../source-notes/openclaw-inferred-commitments.md)。

補充來源：[Codex app-server](https://developers.openai.com/codex/app-server/)、[Voyager curriculum](https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/agents/curriculum.py#L240)。


<a id="slide-15"></a>

## 15 · 完整原架構

這是完整原架構，包含主線省略的互動介面與橫向權限/稽核。主線四頁僅裁切視窗，未改動元件相對位置。

可點擊圖面開啟原始SVG放大閱讀。

這是 reference design，不是已部署所有能力的證明。

來源：[Phase 0.5 reference architecture](../../phases/0.5/reference-architecture.svg)。
