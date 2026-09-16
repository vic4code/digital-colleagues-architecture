# 講者備註 · 數位同事主動性

18 頁主線＋3 頁附錄，約 15–18 分鐘。主線服務現場講解；介面細節與證據留在附錄及備註。


<a id="slide-1"></a>

## 01 · 自己想到，  值得做的事

我們希望數位同事能做到一件事：沒有人逐件交辦，仍然提出有根據的新工作。先從生活中的買牛奶理解，再進入法遵示意案例：新公告 N-17 出現，Agent 為什麼會想到契約 C-042 值得檢視？先從人的主動出發，查各框架機制，再接回原架構，最後談做到什麼程度、怎麼驗收。重點是「工作由誰想到」，而不只是讓同一個任務跑更多輪。

講圖：指向主張與主線方向；這頁先不解釋任何排程工具。

轉場：先從生活想起：沒人叫你買牛奶，你怎麼想到要補貨？

來源：本研究的情境類比，不是人類認知模型的實驗結論。


<a id="slide-2"></a>

## 02 · 時間到了、事件發生， 人就可能想到該做的事

先用買牛奶理解。左邊：週末到了，你想到該檢查家裡缺什麼，檢查冰箱才發現牛奶沒了。右邊：你打開冰箱，直接發現牛奶快喝完了。兩邊都沒有人叫你買牛奶，你卻自己想到該補貨。差別是左邊由時間帶起檢查，右邊由事件帶起想法。

講圖：左邊指週末日曆，右邊指冰箱前快空的牛奶瓶，最後指「該買牛奶了」。Event 不加入時鐘或日期，保持差異清楚。

轉場：換成 Agent，哪些實作機制能提供這樣的思考機會？先看框架真的怎麼啟動下一輪，再歸納。

來源：生活示意類比，不是人類認知模型的實驗結論。


<a id="slide-3"></a>

## 03 · 從框架實作歸納：  Time-based / Event-based

先指左邊的實作證據，再指右邊結論。OpenClaw、Hermes、Claude 與 OpenBot 的排程或巡檢，在時間條件成立後啟動；Hooks、Channels 在通知抵達後執行；Codex active-goal 路徑依 thread idle 接續，Voyager 在 rollout 回傳後選下一題。因此，本次已確認路徑可歸納為 Time-based／Event-based，沒有找到必須另立的第三類啟動原因。

這是工程分類：timer 本身也能視作事件，但本研究把定時觀察與非時間事件分開，便於比較延遲、成本與恢復。Internal event 不表示框架真的使用 event bus；Voyager 是持續執行的 while loop。這也不宣稱人類認知只有兩種機制。Grok Build 的公開可重驗入口不足，沒有拿它補滿結論。

講圖：排程到期 → Time；通知／完成／閒置 → Event。最後讀研究結論，不逐項唸名詞。

轉場：Time／Event 是啟動原因；同一類入口，各框架用了哪些不同的實作 Pattern？

來源：[Trigger audit 與固定原碼](../source-notes/proactive-trigger-mechanisms.md)、[OpenClaw audit](../source-notes/openclaw.md)、[Hermes audit](../source-notes/hermes.md)、[Voyager curriculum](https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/agents/curriculum.py#L240)。


<a id="slide-4"></a>

## 04 · 各框架主要靠什麼機制？

這六列是可以組合的代表性 Pattern，不是六種互斥的 Trigger，也不是市場使用率排名。Scheduled job 到期派送；Heartbeat 讀現況再判斷；Hermes monitor 先比較 hash；Hooks／Channels 把通知帶進 session；Goal continuation 推進既定目標；Voyager curriculum 選下一題。各框架的持久性與停止條件不相同，不能因共用名稱就視為相同實作。這頁先看分工，可呼叫介面與查核路徑留在附錄機制表。

講圖：先帶前三列如何組合，再對比最後兩列「續既定目標」與「選新題」。

轉場：既然同一個 Agent turn 可以承載不同工作政策，下一頁看：誰決定這一輪要做什麼？

來源：[OpenClaw scheduler](https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/src/cron/service/timer-scheduler.ts#L55)、[Hermes cronjob tool](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/tools/cronjob_tools.py#L525)、[Hermes monitor](../source-notes/observation-hermes.md)、[Claude scheduling](https://code.claude.com/docs/en/scheduled-tasks)、[Claude Channels](https://code.claude.com/docs/en/channels)、[OpenBot routine interface](https://github.com/CopilotKit/OpenBot/blob/7b94a0b802732e6491634160cf9ed3fcfb813424/server/src/plugins/builtin-routines.ts#L74)、[Goal／Voyager 固定路徑](../source-notes/proactive-trigger-mechanisms.md)。


<a id="slide-5"></a>

## 05 · 喚醒提供機會，  任務政策決定做什麼

這是今天最重要的分界。人可以設定「定期檢視授權來源，找出值得處理的契約問題」，而不指定每份契約。到了時間，Agent 讀到職責、N-17 和契約現況，自己提出 C-042 值得查證。人設定觀察時間，不代表人已經決定每一次的工作。要讓這件事可靠，普通 agent turn 還需接上 context、查證、去重與人審。這是依公開介面推導的組合方案。

講圖：先指 Entry，再停在 Context 與 Discovery；口頭先不用尚未定義的 Phase 代號。

轉場：這條從觀察到新提案的路，應該接在我們哪幾個元件？

來源：[Task discovery definition and recipes](../source-notes/phase-task-discovery.md)。


<a id="slide-6"></a>

## 06 · Before：原架構已有哪些元件

先看原架構的位置。Workspace 提供職責和規則，Controller 處理 session 與派工，Triage 管路由和批准需求，Codex 執行，MCP 連授權來源。接下來三頁都保持同一張圖、同一個元件位置；藍色標出當頁要增加的責任。這張 Before 是設計基線，不等於所有契約都已上線。要補的，是主動觀察、狀態保存與對帳如何穿過這些元件。

講圖：先定位 workspace、runtime、integration 三層。翻頁時不要重新介紹原圖；讓觀眾追藍色修改。

轉場：先接 Time：定期讀公告，再分開管理來源變化與未完成工作。

來源：[Phase 0.5 reference architecture](../../phases/0.5/reference-architecture.svg)。


<a id="slide-7"></a>

## 07 · Time entry：先比變化，再派工作

Time 路徑先看正常運作。Scheduler 到期，MCP 讀來源，Triage 比較版本；沒有新變化就記 Skip，有變化就保存 Pending work，再由 Controller 派送。Pending 與來源是否變化要分開，來源沒變也不能丟掉未完成工作。這頁的藍色是我們要補的責任，不代表框架已替我們接好。恢復的交易契約稍後單獨講，不在這張架構圖一次塞完。

講圖：沿 Scheduler → MCP → Triage → Controller；只講正常路徑與 Pending 的存在。

轉場：若來源可以直接通知，就換成 Event 入口，沿用相同 Runtime。

來源：[Hermes baseline 寫入時點與限制](../source-notes/observation-hermes.md)、[固定 monitor.py](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/cron/monitor.py#L125)、[本案宿主整合提案](../proactive-integration.js)。同交易保存與 recovery 契約為本簡報建議增量，尚未實作。


<a id="slide-8"></a>

## 08 · Event entry：通知抵達，走同一套 Runtime

Event 是替代入口，不是接在 Time 後面的下一道工序。通知抵達後，Ingress 驗來源、去重並保存事件識別；Controller 找到角色或等待中的工作，再經 Triage 檢查交給 Codex。輸出先是 Observation context，還不是新任務。可靠派送以事件識別、重試與冪等處理建立，不能把簡化圖解讀成跨故障的 exactly-once 執行保證。

講圖：圖的位置不變，只追新入口與共用元件；指出 event_id／source_ref／dedup_key。

轉場：入口接好仍不會自行選題；下一頁才讓模型從現況提出候選工作。

來源：[Proposed component contracts](../proactive-integration.js)、[Codex app-server turn/start and outputSchema](https://developers.openai.com/codex/app-server/)。

介面來源：[OpenClaw hooks](https://docs.openclaw.ai/automation/webhook)、[Component integration proposal](../proactive-integration.js)。此頁是本架構的 proposed integration。


<a id="slide-9"></a>

## 09 · Discovery：模型提候選，宿主驗證

兩種入口都可以接這個 Discovery contract。Controller 組裝 Role、Evidence 與 History，Codex 產生帶對象、建議工作與引用的 Candidate，或回傳有理由的 No-op。MCP 提供查證材料，宿主檢查引用是否可解析、權限與同版本重複，才保存到 Inbox 交人審。Schema 正確不等於證據正確，Candidate 也不是已批准任務。這些是 proposed host contracts，沒有宣稱原框架全部原生提供。

講圖：沿 Workspace → Codex → MCP → Triage／Inbox；只用三個欄位解釋候選，不念 JSON。

轉場：這條路做到一半停了怎麼辦？先分清看過資料與完成工作。

來源：[共用 Discovery contract](../source-notes/phase-task-discovery.md)、[Codex app-server](https://developers.openai.com/codex/app-server/)、[本架構整合提案](../proactive-integration.js)。


<a id="slide-10"></a>

## 10 · 看過資料， 不代表工作已完成

Hermes 已查 monitor 路徑會在模型執行前保存 hash；若 downstream 失敗，下輪 Unchanged 不會只靠這個 gate 重建未完成工作。這是該路徑的取捨，不是斷言整個產品一定丟件。我們提出不同的宿主契約：把 Observation 與 Pending work 同交易保存，再執行；Proposal 用穩定識別冪等保存，最後才推進 Processed cursor。沒有新版本，也要重試可恢復的 Pending。重播可能再次執行，但不得因此多建立同一版本的提案。這是待實作的設計，不是已完成的恢復證明。

講圖：按同交易保存、冪等產物、最後 Cursor 三個順序講；不要在此頁再跑 Event 或機制比較。

轉場：執行與恢復責任清楚後，再用三個 Phase 定義 Agent 能決定多少工作。

來源：[Hermes monitor 查核](../source-notes/observation-hermes.md)、[本案整合契約](../proactive-integration.js)、[實作與驗收](../source-notes/initiative-implementation-guide.md)。同交易保存、冪等提案與恢復驗收為本案提案，尚未實作驗證。


<a id="slide-11"></a>

## 11 · 三個 Phase， 差在工作決定權

P1，人指定任務與時間，Agent 執行，產生固定產物。P2，人給目標與驗收，Agent 決定怎麼完成；新的步驟仍屬同一件交辦工作。P3，人給職責與權限，Agent 根據證據找到未逐件交辦的新工作，先提出來讓人決定。三者都能用 Time／Event，差別在工作決定權，不是更換觸發器。這是能力成熟度，也不要和 repo 的部署 Phase 編號混用。

講圖：沿上方工作決定權方向看三個輸入，再看三種不同產物。

轉場：第三階段能先用哪些既有介面組起來？

來源：[Original three-phase planning](https://github.com/shane01526/agent_initiate/blob/main/2026_08/scenerios/scenario-legal.md)、[Definition clarification](../source-notes/phase-task-discovery.md)。


<a id="slide-12"></a>

## 12 · Self-initiated 可以組合，  不必等一個專用自主工具

OpenClaw 的 custom heartbeat、Hermes 的 cronjob_manage prompt／skills、Claude 的 loop.md／CronCreate、Codex 的 turn/start，以及 OpenBot 的 routine instruction，都能承載角色觀察與候選生成。這是由可配置介面推導的組合方案，並非本次已逐家跑完企業驗證。Voyager 有原生環境選題，但企業資料、評估與授權仍要另接。共同缺口是證據驗證、提案狀態、跨輪去重與人審；缺少專用自主工具，不能直接推論做不到選題。

講圖：每家只讀 recipe 名稱；共同待補能力只說一次。Grok 公開介面空缺留在來源說明。

轉場：把介面落到同一個法遵案例，人最後會收到什麼？

來源：[Hermes cronjob_manage](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/tools/cronjob_tools.py#L525)、[Claude loop.md](https://code.claude.com/docs/en/scheduled-tasks)、[Codex app-server](https://developers.openai.com/codex/app-server/)、[OpenBot create_routine](https://github.com/CopilotKit/OpenBot/blob/7b94a0b802732e6491634160cf9ed3fcfb813424/server/src/plugins/builtin-routines.ts#L74)、[Voyager curriculum](https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/agents/curriculum.py#L240)。


<a id="slide-13"></a>

## 13 · 一則新公告，  想到該檢視哪份契約

人只給「檢視待續約契約」的職責，沒有指定 C-042。示意公告 N-17 適用 A 類委外、要求核對附件 X；C-042 屬於 A 類，而附件清單沒有 X。Agent 因此建議檢視這份契約，交付公告與附件對照。法遵人員確認是否適用，Agent 不代替人下法遵結論。這個例子要看的是來源關係如何產生未逐件交辦的工作；資料是示意，沒有接實際內部契約。

講圖：先指兩份資料的 A 類與 X，再指提案與交付物。

轉場：如果我們只改一個條件，Agent 是否會跟著改判？

來源：[Authored scenario fixtures](../story-home.js)、[Original legal scenario](https://github.com/shane01526/agent_initiate/blob/main/2026_08/scenerios/scenario-legal.md)。


<a id="slide-14"></a>

## 14 · 改一個條件，  提案也應該跟著改變

保持公告、角色與模型設定一致，一次只改一項。原始案例應提出有來源的檢視建議；把分類 A 改 B，就不應再提同一工作；移除附件清單，應先查證或記證據不足，不能把未知當作缺件；加入同版本已結案紀錄，應保留紀錄而不重提。這四列測選題、相關性、Grounding 與 Reconciliation。它們是預期行為，並非本次模型已通過的測試結果。

講圖：從原始案例依序看三個變因；每列只比較輸入差異與應有輸出。

轉場：判斷要對，寫入中斷也要能接回來。下一頁故意讓它停在兩個位置。

來源：[驗收與指標基礎](../source-notes/initiative-implementation-guide.md)、[Discovery contract](../source-notes/phase-task-discovery.md)、[Hermes baseline 分析](../source-notes/observation-hermes.md)。控制變因與寫入點故障注入為新增實驗設計，未執行。


<a id="slide-15"></a>

## 15 · 故意在寫入點中斷，  確認恢復後不漏、不重提

這頁驗第十頁提出的恢復契約。中斷 A：Hash 與 Pending 的交易已提交，模型尚未完成就停機；重啟必須找回 Pending，不能因來源 hash 沒變就漏跑。中斷 B：Proposal 已保存但 Cursor 尚未更新；重播應命中同一穩定提案識別，不新增第二份，再補完成進度。交易內中斷要整筆回滾，來源讀取失敗則留下 Error，不能當成沒有新資料。這是故障注入的驗收設計，尚未執行，不是對外副作用的 exactly-once 保證。

講圖：按寫入順序，先指中斷 A，再指中斷 B；分清交易內回滾與交易後恢復。

轉場：可靠性之外，還要證明這套選題政策比固定清單多找到有用工作。

來源：[Hermes monitor 查核](../source-notes/observation-hermes.md)、[本案整合契約](../proactive-integration.js)、[實作與驗收](../source-notes/initiative-implementation-guide.md)。同交易保存、冪等提案與恢復驗收為本案提案，尚未實作驗證。


<a id="slide-16"></a>

## 16 · 和固定清單比較，  是否多找到有用的工作？

用同一批盲測案例、模型、工具、預算與 Time trigger 做配對比較。A 是盲測前固定的工作清單，B 改成 Role＋Evidence＋History，觀察是否多找到有用的未交辦工作；不要讓 A 使用刻意弱化的清單，也不要看完結果才修改它。C 只移除模型看得到的 History，保留宿主去重與權限護欄，分析模型候選的重複以及宿主攔截數。這是在比較任務政策與歷史，不是在比較 Time／Event。分組、匹配規則與盲評方式要預先定義，重跑後報跨次變異。

講圖：先說共同控制條件，再比較 A／B，最後比較 B／C。這頁不展開指標分母。

轉場：實驗最後要看的不是產出多少，而是有用、漏判與重複各自的分母。

來源：[指標與實作狀態](../source-notes/initiative-implementation-guide.md)、[選題定義與角色契約](../source-notes/phase-task-discovery.md)。分組、盲評與消融設計為本簡報提案，尚未執行。


<a id="slide-17"></a>

## 17 · 看有用、漏判與重複，  不只看產出多少

Precision 在這個實驗指有用提案占已評閱提案，由業務人員依預定標準盲評；未評閱樣本另列並報覆蓋率。Recall 用人工標註的機會當分母，不能只從 Agent 自己產物推估。Duplicate rate 在宿主去重前計算重複候選占所有模型候選，另報被攔截數與 Inbox 重複，才能分辨模型與護欄的效果。分母為零記 N/A，不是百分之百。另保留 No-op、Error、成本與所有失敗回合；不是把失敗硬塞進每個比例，而是不得從整體報告靜默排除。這裡沒有實測數字或自行編定的及格門檻。

講圖：逐一指分子與分母；停在 Recall 的人工標註與 Duplicate 的去重前邊界。

轉場：有了驗收與量測方式，就可以把下一步收斂到一個可跑的角色和來源。

來源：[指標與實作狀態](../source-notes/initiative-implementation-guide.md)、[選題定義與角色契約](../source-notes/phase-task-discovery.md)。分組、盲評與消融設計為本簡報提案，尚未執行。


<a id="slide-18"></a>

## 18 · 先把一條路跑完整，  再增加自主程度

下一個 Gate 是一個角色、一條授權來源和私有提案。先把入口、可靠狀態、角色與歷史接好，再跑正反例、故障注入與配對盲評。要證明能找到未逐件交辦的工作、說得出證據與不做的原因，中斷後也能恢復且不重提。原研究 P1 的九十項測試與兩次真實整合是歷史報告，這次未重跑，不代表國泰場景已驗證；企業 P2、P3 仍是規劃與待驗證整合。

講圖：沿找到、說明、恢復三個結果；不要用更多框架數量作為完成標準。

轉場：主線到這裡。附錄依序放機制與介面表、歷史 commitments，以及完整原圖。

來源：[實作狀態](../source-notes/initiative-implementation-guide.md)、[Phase 定義](../source-notes/phase-task-discovery.md)。


<a id="slide-19"></a>

## 19 · 機制、可用介面與執行語意

這頁供問答查介面，不必再把主線講一遍。Scheduled job 的 CronCreate、create_routine、cronjob_manage 與 OpenClaw Cron 各有 session、持久性與到期政策；Heartbeat 可和排程共用底層；Monitor 在讀來源後加 hash gate；Hooks／Channels 是事件注入。Goal continuation 的評估與停止機制因框架不同，Codex 的 on_thread_idle → continue_if_idle 只屬已查的 Codex 路徑。Voyager curriculum 在 rollout 後依環境選題，但不是企業提案管理器。這些是代表性可查路徑，不是市場排名或全部擴充能力。

講圖：依提問定位單一列；右欄是代表語意，不是所有框架共用 sequence。

轉場：如果問題是過去是否做過對話自行抽取待辦，下一頁看歷史 commitments。

來源：[OpenClaw scheduler](https://github.com/openclaw/openclaw/blob/91ea838947d30a65f1299b05fa42071917f2a293/src/cron/service/timer-scheduler.ts#L55)、[Hermes cronjob tool](https://github.com/NousResearch/hermes-agent/blob/fef0e16fe19b79ded929209f87c7434270b03825/tools/cronjob_tools.py#L525)、[Hermes monitor](../source-notes/observation-hermes.md)、[Claude scheduling](https://code.claude.com/docs/en/scheduled-tasks)、[Claude Channels](https://code.claude.com/docs/en/channels)、[OpenBot routine interface](https://github.com/CopilotKit/OpenBot/blob/7b94a0b802732e6491634160cf9ed3fcfb813424/server/src/plugins/builtin-routines.ts#L74)、[Goal／Voyager 固定路徑](../source-notes/proactive-trigger-mechanisms.md)。


<a id="slide-20"></a>

## 20 · 舊 inferred commitments 怎麼做，後來移除了什麼

這是更窄的歷史功能：對話後可能背景抽取跟進事項，保存 due window 與 session／target，到期由 heartbeat 決定問一次近況或略過。舊到期回合沒有工具，不能現場查證交付物是否完成。後來 extractor 和 delivery 被移除；heartbeat 不會自動接替舊抽取器。移除紀錄沒有完整決策理由，不能直接說是成本高或騷擾。自訂角色選題與復活這個子系統，是兩回事。

講圖：只在被問到從對話抽取／退役時使用。續約對話是示意，不是真實使用者紀錄。

轉場：如果問題是這些能力應放哪裡，下一頁可回到完整原圖定位。

來源：[Historical design](https://github.com/openclaw/openclaw/blob/1a34950d9c517325f61d7e9b2367c839845c64d9/docs/concepts/commitments.md)、[Removal commit](https://github.com/openclaw/openclaw/commit/4b0151682ef4cbcf5360fd79cc73b44c62a0c911)、[Retirement audit](../source-notes/openclaw-inferred-commitments.md)。


<a id="slide-21"></a>

## 21 · 完整原架構

這是沒有裁切的 reference architecture，供討論定位。上層是同一個人機互動入口，中間是 workspace、Controller、Triage 與 Codex，下層是服務事件和 MCP 工具，權限與稽核跨越各層。主線的幾張 After 都沿用這些位置；新增的是觀察、狀態與控制契約，而不是另外發明一個常駐的靈感服務。這張是原設計責任圖，不是完整部署驗證。

講圖：依提問指元件，不必重新講完整架構；Time、Event 和 Discovery 的差異可返回第 7–9 頁。

轉場：討論時請指定一個元件或一個驗收條件，我們就能具體確認下一步。

來源：[Phase 0.5 reference architecture](../../phases/0.5/reference-architecture.svg)。
