# 數位同事主動性：Story line

更新：2026-09-14。首頁採五段、top-down 展開。統一 Cream 風格，主畫面用圖與短句，技術與證據在下一層。

**Time／Event 喚起 → 框架怎麼實作 → 我們的 W0–W7 → 三個主動性 Phase → 國泰情境與驗證。**

## 01｜主動性的入口：Time ＋ Event

同畫面對照人與 Agent：線索 → 連到職責／記憶 → 想到值得做的事。

主張：time／event 解釋何時有觀察與思考機會；職責 × 證據 × 推論解釋想到什麼。自主性不能只靠排程，也不能把 goal 續跑當自行發現新工作。

小問題：狀態門檻、程序完成與串流資料抵達都是 Event。while 是控制流，polling 是偵測方式，均不另列第三種觸發來源；環境與記憶是選題輸入。

## 02｜框架實作：名字不同，責任不同

可切換流程圖：Polling／Heartbeat／Cron job／Event trigger／Loop–Voyager。

- Polling：間隔到期 → 讀來源 → hash／版本差異 → 必要才推論。
- Heartbeat：設定節律 → monitor job → wake admission → 巡檢回合。
- Cron：規則＋時區 → next due → occurrence queue → claim／執行。
- Event：通知 → 驗證／去重 → 關聯 → wake／turn。
- Voyager：learn loop → curriculum 選題 → rollout → 更新進度 → 下一輪。

展開後列可調用介面、內部路徑、原始碼。討論：polling 可藏在 event adapter 後面；heartbeat 不是 lease；cron 不必是 OS crontab；wait_ticks 不是選題 cron。

框架表以 config／tool／CLI／RPC 入口判定。Grok Build 與非官方 Grok Bot 重建分列；快照、現在文件與組合提案分開。

## 03｜我們的原架構，接上 W0–W7

Before／After 使用 [Phase 0.5 原圖](../phases/0.5/reference-architecture.svg)，元件不移位；hover 說明，點擊固定並展開責任／接線／來源。

W0 喚醒 → W1a 撈事件 → W1b 零模型准入 → W2 role_card → W3 對帳 → W4 有界檢索 → W5 執行 → W6 私有提案 → W7 寫回。

W2 身分投影與 W3 對帳標示原 repo 缺口；W7 cursor 最後更新。沒有假設另造一個常駐的想法產生服務。

## 04｜三個 Phase：人給的越來越少

| Phase | 人給什麼 | Agent 自己決定什麼 | 原專案狀態 |
|---|---|---|---|
| 1 固定節律 | 做什麼＋何時做 | 固定產物，不自行續跑／找事 | 有驗證版 |
| 2 半主動／目標驅動 | 目標＋完成標準 | 步驟、有界接續，達標／阻塞／耗盡停止 | 規劃 |
| 3 全主動／自主跟進 | 願景＋角色／權限／知識庫 | 自行推斷值得跟進的事，形成有據提案 | 規劃 |

以使用者提供的 Notion 導讀及 repo `scenario-legal.md` §§6–8 為準。這是技術成熟度，**不是部署 Phase 0–4**；time／event 可用於三個階段。

主圖之後一張框架 × Phase 表。每格列介面、可借用技術、還缺什麼；「有零件」不代表整階段達標。嚴格 P3 的五家歸零限於原研究判準與快照，不宣稱全市場沒有探索能力。

## 05｜國泰場景：怎麼用、怎麼證明

四個角色可切換：法務／法遵、PM、人資、架構師。每個角色同屏對照 P1 固定產物、P2 指定目標、P3 自行找事，點開驗收。

觀測圖：wake_source → anchor → proposal／skip_reason → inbox／feedback → outcome／cursor。

三個可切換分支：有據提案、正常靜默、喚醒失效。前兩者有可追查紀錄；第三者要由獨立觀測器發現到期卻沒有紀錄。

驗收從「沒過代表什麼」出發：去重、並發、角色 sha、等待對帳、硬預算、validator、錨點、退回／延後、cursor 恢復。量測提案品質與覆蓋率，而不是把模型呼叫數當主動性。

來源、實作路徑與指標定義：[實作導讀](source-notes/initiative-implementation-guide.md)。


## 2026-09-14：從人的「想到」開場

首頁先呈現同事看到新報表、想起下午會議、自己想到先核對簡報的插畫情境；右側同步對照 Agent。可切換「看到新報表／快到開會時間」與三個思考時刻。Time／Event 的抽象在人的情境之後展開。架構圖維持原元件位置，移除數字徽章，側欄按原圖由上而下排列；執行生命週期另見 W0–W7。


## 第二章修訂：框架 → 機制 → 實作

先選 OpenClaw、Hermes、Claude Code、Codex、Grok Build；另附 Voyager 的選題研究與 OpenBot 可靠派工。每家呈現主要機制及判定界線，點開看介面、原碼路徑與證據。Polling 等術語降為補充，避免先拿例子當成完整分類。見 [本輪查核](source-notes/framework-chapter-review.md)。


## 喚醒流程的閱讀順序

先用報表 v3 與下午會議呈現：收到線索 → 程式判斷是否要跑 → 載入角色與工作進度 → 查證並提出建議 → 收件匣與寫回。沒有新資料，在模型前結束並留下原因。W0–W7 為工程階段代號，移至展開對照；自主選題屬 Phase 3 提案，不能把流程骨架視為已實作。


## Agent team review：可讀性與 insight · 2026-09-14

三路獨立 review（敘事、研究判準、桌機與手機視覺）後，第二章先說研究發現，再逐家標示工作來源與實作；第三章先指出角色、進度與提案接線，再讀原圖；第四章以人的交辦語句對照三階段，技術矩陣收合；第五章先呈現角色如何由線索提出檢視建議，再區分提案、正確靜默與故障。工程 trace 與欄位不再預設露出。

核心判斷：節律調整不等於選題；目標續跑不等於發現新工作；評估主動性要同時看有用、漏掉與重複。
