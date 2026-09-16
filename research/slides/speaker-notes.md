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

## 05 · 三個 Phase： 從執行，到自己選題

P1是人指定內容和節律，Agent交出固定產物。P2 人給目標與完成條件，Agent 監控狀態、規劃步驟；定期檢查、資料到齊或上一步完成後，都可以評估要續做、等待或回報。P3不預先指定每件任務，Agent按角色、證據、歷史與優先級發現新工作，再交人審。

P2不是Event、P3也不是新的Trigger。三個Phase都可以用Time或Event；差別在任務來源與決策範圍。Phase是原規劃的能力演進，不宣稱目前全部完成。

轉場：接下來回到原架構，指出每個Phase要在哪些元件補能力。


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

## 09 · P3： 在原架構補上 Task discovery

P3可以由Time trigger達成，但timer本身只提供推理機會。Controller需要載入role、evidence、history；Discovery instruction要求找值得做的新工作，允許沒有候選。模型輸出target、evidence refs、reason、priority rationale與proposed deliverable。

Codex宿主可用turn/start＋outputSchema；OpenClaw可設定custom heartbeat prompt；Claude可用loop/CronCreate；Hermes用cronjob_manage配合prompt/skills；OpenBot用routine instructions。Voyager原生有curriculum選題，但企業permission、proposal lifecycle與人審仍需另外接。這些是組合路徑，不是企業P3已驗收的證明。

Triage在宿主驗證來源存在、符合角色範圍、同版本議題是否已處理，並用政策評估priority。Model提供排序理由，不可自行升級權限。提案送人審；No-op也應有具名原因。

來源：[Codex app-server](https://developers.openai.com/codex/app-server/)、[Claude scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks)、[Phase task discovery](../source-notes/phase-task-discovery.md)。

轉場：把這條Discovery路徑放進法遵案例。


<a id="slide-10"></a>

## 10 · 國泰法遵情境： 新公告，帶出一項新工作

這是國泰法遵角色的虛構示例，N-17與雲端維運契約 C-042 並非真實監理公告或契約。人只設定「協助檢視待續約契約」，沒有指名C-042。

公告N-17提到資訊委外需要核對資安附件。Agent透過MCP找出雲端維運契約 C-042 屬於資訊委外，且附件清單未列資安附件，於是提出檢視它是否需要補件的新工作，交付公告段落與附件清單對照。清單未列不等於實際缺件，更不等於違規；法遵人員確認適用性。圖中的勾記代表審閱符號，不代表已批准。

若人已指定「追到C-042資料齊備」，那是P2；這裡用P3驗選題。

轉場：怎麼證明它不是看到任何公告都亂提工作？下一頁只改一個條件。


<a id="slide-11"></a>

## 11 · 觀測主動性： 條件改變，提案也要改變

這頁是預期驗收結果，尚未執行模型實測。第一條trace示意要保存的關聯：來源版本、對象版本、模型候選、提案與人審結果。

三份fixture每次只改一個欄位。資訊委外契約＋清單未列資安附件時可提出核對建議；改成一般採購應skip；附件清單移除後應verify，不能把未知判成缺件。

最後測同版本已結案再送事件，應命中相同議題、無第二份提案。重啟時也要這樣測：Pending保存後中斷，重啟應恢復；Proposal已存後中斷，應命中唯一鍵再補cursor。驗的是可恢復與冪等產物，不宣稱所有步驟exactly-once。

記錄wake_source、source/version、candidate、decision/reason、proposal id、review與cost。觀測模型重複要保留去重前candidate，否則宿主擋掉重複會掩蓋模型行為。

轉場：行為正確還要有數字，下一頁用同一批假設資料直接算。


<a id="slide-12"></a>

## 12 · 用一批數字， 算出主動性是否有用

全部是假設數據，用來示範算法，不是實測。模型共產出12候選，其中2個重複由宿主擋掉。剩10個全數評閱，8個有用且各自對應一個不同的機會，2個無用。Precision=8/10=80%。

人工在測試前獨立標註12個有效機會，Agent找到8個，Recall=8/12≈67%，漏了4個。這裡「12人工機會」與「12模型候選」碰巧相同，並非同一個分母來源。Duplicate=2/12≈17%，必須在host去重之前算；Inbox可以零重複而模型仍有重複。

正式pilot需事先定義有用性，業務盲評，固定相同資料、模型、權限與預算，比較固定清單和Discovery，重跑報告變異。移除模型可見 history的ablation也要保留host guards；否則不是單一變項實驗。Error、No-op、成本與評閱覆蓋率另外報，不可以消失。小樣本示例不能證明production穩定。

轉場：最後把機制、實作、驗收收成一張總結。


<a id="slide-13"></a>

## 13 · 讓數位同事主動，  從這三件事開始

總結：Time/Event是啟動條件；三個Phase增加的是工作決定權；原架構已有入口，新增能力集中在Controller脈絡/任務狀態、Codex Discovery與Triage驗證。

第一個試做聚焦法遵角色、一個公告來源與私人提案匣，不直接對外寄送、不自動下法遵結論。先讓來源引用、相關性、去重與人審可追溯，再用共同案例集比較有用、漏判與重複。

狀態界線：原研究 P1 有 reference prototype 與歷史測試報告，本次未重跑，也不代表國泰業務效果已驗證；P2／P3 的企業整合仍待實作與驗收。

主線到此，附錄只供問答時查介面與完整架構。


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
