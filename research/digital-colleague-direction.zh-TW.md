# 數位同事:產品定位、差異化、風險與維運

**狀態:** 產品方向建議。數位同事是**既定產品方向**,本文回答的是
「產品邊界怎麼畫、差異在哪、有什麼風險、誰維運」,不是「要不要做」。
**英文版能力盤點:** [agent-product-landscape.md](./agent-product-landscape.md)

> **可信度:** Codex 敘述對照 OpenAI 官方文件（文末）。
> OpenClaw／Hermes／Grok Bot／OpenBot 為我們的盤點研究,承諾前請再查證。

---

## TL;DR

| 問題 | 答案 |
|---|---|
| **我們做什麼** | 「**這家公司的同事**」—— 組織僱得起、管得動、信得過的虛擬同事。**不是** agent framework,**不是**更強的 AI 工具。 |
| **跟競品差在哪** | 兩個軸:**個人 → 組織**（競品優化「給個人的強 AI」,我們優化「組織僱用的 AI」）、**能力 → 信任**（競品拚能力,我們累積信任）。 |
| **要不要主打「互動感」** | **擬人化是門面（要做好,但廠商都有）,關係感是實質（越合作越好用,抄不走）。** 賣「它是一位同事」,靠「它跟你合作越久越好用」撐住。 |
| **最大風險** | ① 治理層可能在錯的高度（真實執行邊界在 Codex sandbox 內）② 漸進自主依賴 Evaluation,量不出來就是劇場。 |
| **最大成本** | **Mentor 的人力時間**（不能外包給 AI Team）＋ 兩個上游的經常性升級。 |
| **成功／失敗指標** | **人工覆核率隨時間下降。** 半年後還是 100% 要人看 → 產品失敗,該收掉。 |

---

## 一、產品定位:產品邊界畫在哪

```text
┌────────────────────────────────────────────────────┐
│  我們的產品：數位同事                                │
│  讓組織能「僱用、管理、信任」一位虛擬同事             │
│  Identity · Skill · Governance · Evaluation ·       │
│  Lifecycle · BU Self-service                        │
└────────────────────────────────────────────────────┘
                       ↑ 使用（不自研,持續汰換）
┌────────────────────────────────────────────────────┐
│  供應商層                                            │
│  OpenClaw → 同事「如何存在」（channel/cron/event）   │
│  Codex    → 同事「如何完成工作」（reason/tool/exec） │
└────────────────────────────────────────────────────┘
```

**「不重造 Agent Runtime」≠「不做產品」。** 相反 —— 每一小時花在重造 runtime,
就少一小時花在上面那個框,而那才是別人給不了的。

**什麼不是我們的產品:** agent 推理品質、tool calling／computer use、聊天介面、
單一任務自動化。這些廠商會贏,而且會免費變強 —— 對我們是好事。

---

## 二、差異化:跟競品的定位差異

### 兩個定位軸

| 軸 | 競品 | 我們 |
|---|---|---|
| **對象** | 給**個人**的強 AI | **組織**僱用的 AI（有 owner、有權責、有治理） |
| **競爭點** | **能力**（更強模型、更多工具、持久電腦） | **信任累積**（被帶訓、被評估、可稽核、漸進自主） |

### 逐一對照

| 競品 | 它的定位 | 我們的差異 |
|---|---|---|
| **Codex App** | 個人生產力工具 | 我們是**組織資產**（人走了同事還在） |
| **Grok Bot** | 一位很強的個人 AI coworker（押注**深度**） | 我們把同事放進**組織的權責結構**裡 |
| **OpenBot** | 企業治理平台（治理「工具」） | 我們把治理綁在**「同事」這個實體**上＋mentor 培養 |
| **Hermes** | agent 自己變聰明 | 我們累積的是**組織知識**,不是模型能力 |

### 檢驗方法（每個功能都問一次）

> **如果 OpenAI 明天發布這個功能,我們的東西還有價值嗎?**
> - 「跟 agent 聊天」「更漂亮的介面」「又一個整合」→ **一發布就死,不是差異化**
> - 「一位被法務帶了半年、懂我們審查標準、稽核軌跡合規認可的同事」→ **還在,這才是**

### 護城河的分級（誠實版）

| 等級 | 內容 |
|---|---|
| **真護城河** | ① 累積的組織知識（搬不走、無法預先內建）② 跨系統的單一角色（跨廠商邊界,沒人有動機做）③ 可稽核的權責鏈（廠商給 log,不給我們合規要的證據鏈） |
| **6–12 個月領先** | ④ mentor→漸進自主 —— **機制可被抄,但已累積的帶訓成果抄不走** |
| **不是差異化（但仍要做好）** | ⑤ 組織身分 —— 部分廠商已在做 agent service account ⑥ 擬人化門面 —— 必要的入口體驗,不是護城河 |

### 「同事的互動感」要不要強調?——直接回答

**要區分兩件事:**

| | 是什麼 | 建議 |
|---|---|---|
| **擬人化的互動感** | 名字、個性、頭像、講話自然 | ✅ **要做好,是必要的門面** —— 讓人願意把它當同事。但廠商都有,**不是差異化**;只有門面沒有裡子就變成 fancy |
| **關係感（累積）** | 它記得、它變強、你不用重講、你敢越交越多 | ✅ **這才是要主打的** |

> **一句話:用「它是一位同事」進場（門面),用「它跟你合作越久越好用」留下（實質）。**

**同事之間的互動（A2A）呢?—— 有競品實證:先不要做。**
查了 [grok-bot-0.18-reconstructed](https://github.com/b-nnett/grok-bot-0.18-reconstructed)：
這個高度產品化的 AI coworker **完全沒有 bot-to-bot 協定**,是單一 agent ＋ provider 路由;
它的 `node-agent-coordinator` 協調的是**管線**（inference-router、mcp-bridge、port）,
不是多個 agent。它把資源投在**持久電腦**（Remote Box／Docker connector）＋ MCP 工具。

> **競品押注「深度」（把一位同事做強）而非「廣度」（多位同事協調）。**
> 推論:**持久執行環境 ＋ skill library 應排在任何多同事協調之前。**
> 若要把差異化放在「同事之間」,那是**還沒有人驗證過的賭注** —— 別當主打。
> *(可信度:社群逆向重建的桌面版 0.18,非官方原始碼,商用版可能不同。)*

### Roadmap 的推論

> **優先做「會累積的」,不做「功能」。**
> 會累積 = skill 沉澱、mentor 的每次糾正、稽核歷史、信任等級。
> 不會累積 = 再接一個整合、更漂亮的 UI、又一個 automation。
> **mentor 機制是累積的引擎** —— 每糾正一次就變成組織的永久能力。

---

## 三、產品願景:像人一樣的虛擬同事

同事有自己的身分、帳號、電腦（虛擬的）。**先由 mentor 帶,帶熟後自主。**

```text
① 入職  工號·帳號·電腦·權限   →  ② 帶訓  每個動作要核准
→ ③ 試用  抽查·高風險才核准    →  ④ 自主  只有例外才升級
→ ⑤ 退役  收回權限·記憶歸檔
```

### 關鍵設計:自主等級 = 核准強度的反函數

**把「培養」與「治理」統一成同一個機制,不是兩套系統。**

| 自主等級 | 核准要求 | 對應真人 |
|---|---|---|
| L0 帶訓 | 每個動作 | 新人跟著做 |
| L1 試用 | 寫入／對外動作 | 試用期 |
| L2 自主 | 只有高風險 | 轉正 |
| L3 資深 | 例外才升級 | 獨當一面 |

同一位同事**可在不同技能上處於不同等級**;升級依據是 **Evaluation 實測**,不是時間到。

### 反 fancy 的那把尺

> **工具:人做事,AI 輔助 —— 工作量還在人身上。
> 同事:AI 做事,人審核 —— 工作量轉移了。
> 人如果還是每個產出都要從頭看,那就只是 fancy 的工具。**

**價值兌現的那一刻 = 人可以不看了。** 所以 mentor→自主不是加分項,是**價值交付機制本身**。

| 成功指標 | 失敗長什麼樣 |
|---|---|
| **人工覆核率下降** | 半年後仍 100% 要人看 → **產品失敗,誠實收掉** |
| 單位任務人工分鐘數下降 | 沒降 → 只是換方式做同樣的事 |
| 同類任務結果差異下降 | 沒降 → 知識沒沉澱 |
| Mentor 糾正次數下降 | 沒降 → 學習迴路沒作用 |

---

## 四、目前架構與風險

```text
Teams / Outlook / Channel  →  OpenClaw（identity·session·cron·event·approval）
                           →  Codex App Server  →  Codex Runtime（reason·tool·file·MCP）
```

**這不是重複 Codex** —— OpenClaw 管「同事如何存在」,Codex 管「同事如何完成工作」。
（補充:`App Server ≠ 完整 Codex App`;App Server 是 harness 的 JSON-RPC 介面,
Codex App 另有閉源產品層 —— 桌面 UI、Projects、Automation UX 等。已查證。）

| # | 風險 | 緩解 |
|---|---|---|
| **R1 ⚠️ 治理層高度可能不對** | 治理放在 OpenClaw 層,但真實動作發生在 **Codex 內部**（tool call／shell）—— 只管入口不等於管到內部,真正的執行邊界是 Codex 的 sandbox。**等於部分治理委託給供應商。** | 高風險動作走**我們自己的 MCP tool** 而非 shell;**先問合規部門接不接受** |
| **R2 ⚠️ 漸進自主依賴 Evaluation** | 量不出「夠好了」,自主等級就是憑感覺,**整個 mentor→自主模型變劇場**。 | 從**單一場景的小型評測集**開始（法務可標註的樣本）;先做 Memory/Skill refinement,不要一開始做複雜 RL |
| R3 雙上游依賴 | Codex app-server 官方標示 experimental;兩者都快速演進,**升級是經常性成本** | 版本 pin ＋ 相容性測試;每季固定排升級 |
| R4 抽象會洩漏 | 「Codex 像資料庫」不完全成立 —— 模型行為變了,skill 行為**無聲跟著變** | 關鍵 skill 要有回歸測試（也是 Evaluation 的一部分） |
| R5 中介層單點 | 若資安否決 OpenClaw,那層就得自己做 | 自架 ＋ 憑證由我們的 broker 管;預估「若沒有它,自己做要多久」 |
| R6 上下夾擊的時間窗 | Codex App 往上吃、OpenBot／Grok Bot 往下吃 | 能量集中在「會累積」的部分,不跟廠商拚功能 |

**R1、R2 是現在就要決定的;其餘是可管理的工程成本。**

---

## 四之二、選 App Server + OpenClaw,比起直接用 Codex App 缺什麼?

**這是選這條路要付的帳,先講清楚。**（Codex App = App Server ＋ 閉源產品層）

| 缺口 | 影響 | 嚴重度 |
|---|---|---|
| **Diff／Review UX** | 看 agent 改了什麼、跑了什麼指令的專業檢視 | 🟢 **已補上 —— 我們已自建前端,看得到狀態與產出**（見下方） |
| **Automation UX（GUI）** | Codex App 用畫面設定自動化;我們是 config／cron → **BU 自己設不了** | 🔴 高（＝我們說的 BU self-service gap） |
| **桌面 UI** | 開箱即用的對話介面。我們要自己做或用 runtime 的 web UI,品質未必等同 | 🟠 中 |
| **Projects／Worktree 管理** | 多案子並行的工作區管理（例如多份合約同時審）要自己管 | 🟠 中 |
| **官方支援與相容性** | App Server 官方標示 **experimental** —— **breaking change 的風險由我們承擔**,不是官方保證 | 🟠 中（長期成本） |
| 通知／OS 整合 | 桌面通知;我們改用 Teams／Telegram | 🟡 低（使用者本來就在 Teams） |
| Remote Control | 從手機看／介入同事 | 🟡 低（要的話自己做） |
| 生態與上手 | 官方文件／社群 vs 我們自己的組合知識,新人要學我們的 | 🟡 低但持續 |

### 關於 Review UX:已經自建,剩下的是打磨

> **更正（依實作現況）:review UX 我們已經有自建前端,mentor 看得到同事的狀態與產出,
> 這不再是缺口。**

它之所以重要,是因為產品最核心的迴圈就是「mentor 審核產出」:審核體驗差 → mentor
不願意帶 → 自主等級升不上去 → 人工覆核率不下降。既然前端已經在了,**接下來的重點
從「要不要做」變成「夠不夠好用」** —— 審一份要幾分鐘、能不能一眼看出改了什麼、
能不能直接在上面給糾正並沉澱成 skill。建議把它當**持續優化項**而非待補缺口。

**真正還沒補的最高優先缺口是 Automation UX（GUI）** —— BU 自己設不了自動化,
這才是現在擋住 self-service 的那一個。

### 換到什麼（平衡看）

Headless／無人值守（Codex App 要有人開著）· 多同事多 persona 管理 ·
Channel 整合（Teams／Outlook 進得來）· 主動性（cron／heartbeat／webhook）·
企業治理的掛載點 · 不綁單一供應商的 UI。

**這些正是「數位同事」與「個人工具」的分野 —— 所以這筆帳付得有道理,
但要知道自己在付。**

### 💡 仍值得驗證的省力做法（假設,未證實）

Codex App 與 app-server **共用同一個 harness 與 `~/.codex`**。
若 OpenClaw 驅動 app-server 產生的 thread,**mentor 也能直接用 Codex App 打開來審核**。

> 我們已有自建 review 前端,所以這不再是「補缺口」,而是**多一條深度審核的路**:
> 日常審核走我們的前端,需要看細部 diff／終端輸出時退到 Codex App。
> 成立 → 省下自建深度 diff 檢視的工;不成立 → 照現有前端繼續打磨即可。

---

## 四之三、為什麼 Codex App 穩、app-server connector 不穩?（已查證,非臆測）

### 根因:**Codex App 是「配對出貨」,我們的組合天生會版本漂移**

Codex App 內含與它一起測過的 app-server —— **版本不會漂**。
我們的組合是 **OpenClaw 與 Codex 各自獨立更新**,而
**app-server 協定本身沒有版本協商機制**,所以漂移不會被擋下來,
而是變成難懂的執行期錯誤。

> **官方 README 查證結果:**
> - `initialize` **沒有版本欄位** —— 「client 必須適應 server 實作的任何版本」
> - **零穩定性承諾** —— 沒有 backwards compatibility 聲明、沒有 deprecation policy、
>   沒有 breaking change 時間表；deprecated 的（如 `thread/rollback`）只寫「即將移除」,無日期
> - 大量方法標 **experimental**（`thread/turns/list`、`thread/items/list`、
>   `server/diagnostics`、`thread/queue/*`）,需 `capabilities.experimentalApi: true` 才可用

### 具體的 mismatch 類型與症狀

| # | Mismatch | 症狀 | 對策 |
|---|---|---|---|
| **M1** | **協定漂移（無版本協商）** | `Timed out waiting for initialize` —— 同類整合中**最常被回報的問題** | **自己做版本檢查**（官方沒有,只有 feature request）;不在支援範圍就**啟動時明確報錯**,不要等 runtime 崩 |
| **M2** | **Experimental feature key 不符** | 未知／無效 feature key → **app-server 直接不可用**（如 `invalid experimental feature key apps_mcp_path_override`） | 啟動時用 **`experimentalFeature/list` 探測**我們依賴的 feature 是否存在且在預期 stage（beta／underDevelopment／stable）,**不要硬編** |
| **M3** | **無 breaking-change 保證** | 升級後某方法行為變了或消失 | **只用 stable 面**;真要用 experimental 就**隔離在一層 adapter**,方便替換 |
| **M4** | **傳輸層異常斷線** | `app-server websocket closed (1006)`（CLI 正常但連線掛掉） | 自動重連 ＋ **`thread/resume` 續跑**,**不要重跑整個 turn**（會重複動作） |
| **M5** | **背壓** | `-32001 Server overloaded; retry later` | **指數退避 ＋ jitter**（官方要求）;turn 併發設上限 —— 我們的 triage gate 正好在做這件事 |
| **M6** | **遠端／舊版本未自動處理** | 遠端 app-server 版本太舊,桌面端不會自動更新或重啟 | 部署時**把 Codex 版本當成工件的一部分**,不要讓它自動更新 |

### 維運對策（建議直接納入實作規範）

1. **版本 pin ＋ 相容矩陣** —— 維護「OpenClaw 版本 × Codex 版本」的已驗證組合表,
   **Codex 不自動更新**,升級走排程。
2. **啟動自檢** —— 版本檢查 ＋ `experimentalFeature/list` 能力探測,
   **不符就拒絕啟動並明確報錯**（把 M1／M2 從「半夜隨機壞」變成「升級時當場擋下」）。
3. **升級煙霧測試** —— 每次升級跑一組 E2E（收信→turn→動作→回覆→trace 完整）。
4. **重連語意** —— 斷線用 `thread/resume` 續,不重跑;動作要冪等。
5. **每季固定排升級** —— 這是**經常性成本,要編進人力規劃**。

> ⚠️ **這驗證了風險 R3(雙上游依賴)不是理論,是已經在發生的維運成本。**
> **「用現成的」不等於「免費」** —— 我們省下造 runtime 的成本,
> 換來的是**版本相容性的經常性成本**。這筆帳要誠實編列。

### 對「mentor 用 Codex App 審核」那個省力做法的影響

⚠️ 該做法有**自身的版本風險**:Codex App 會**自動更新**,若其狀態格式與我們
**pin 住的 app-server** 分歧,共用 `~/.codex` 可能出現不相容甚至污染。
**驗證時要同時測「版本偏移」情境**,不能只測 happy path。

*資料來源:openai/codex app-server README、issues #30378／#25607／#20492,
以及同類整合（T3 Code）的相容性問題回報。*

---

## 五、維運模式

### 三個角色（缺一不可)

| 角色 | 誰 | 關鍵問題 |
|---|---|---|
| **Mentor／Owner**（業務面） | **懂該業務的人**（法務的同事只能法務帶,**不能外包給 AI Team**） | 指派·審核·糾正·決定升級。**這是新增工時,不是自動化** |
| **維運**（技術面） | 中央 AI Team／IT | **半夜壞了誰修?** 沒人修 → 主動式價值直接打折 |
| **使用者** | BU 一般同仁 | 只透過 Teams／Outlook 用,不碰設定 |

**建議的 Operating Model:** 中央 AI Team 顧 runtime／平台 → BU 出 mentor 顧 skill／場景 →
一般使用者只用。**但這要求中央長期扛 Day-2 —— 是承諾,不是技術選型。**

⚠️ **每個試點必須指名一位 mentor,並確認其主管同意這算他的工作。沒指名到人就不要開始。**

### 最被低估的三個成本

1. **Mentor 的人力時間** —— 帶到能自主可能是**數十小時人工**。
   **建議明列進每位同事的 onboarding 預算,不要藏在「導入」裡。**
2. **上游升級** —— 兩個快速演進的依賴,可能每季處理一次,要編進人力規劃。
3. **主動式同事的 token** —— cron／heartbeat 讓成本從「用多少付多少」變**固定月費**。
   這正是 triage gate（deliver-only 不進 LLM）要解的 —— **它是成本結構的必要設計,不是優化。**

其他固定成本:執行環境（VM／容器）、帳號授權、webhook 訂閱續訂（**漏續會無聲失效**）。

### 什麼時候該用工具而不是做同事

優勢**只在**這五條成立時存在:① 量夠大 ② 標準必須一致 ③ 知識必須留下
④ 要能稽核 ⑤ **發起者不是使用者**（工作從外面來）。

> **五條都不成立 → 用現成工具。這是正確答案,不是失敗。**
> 現在該驗證的是:**目前試點有幾個真的滿足?**（用實測,不要用假設）

### 該收掉的條件（先寫下來,免得被沉沒成本綁架）

找不到 mentor ／ 沒人扛 Day-2 ／ 五條件都不成立 ／ **人工覆核率不下降** ／
Evaluation 做不出來。

---

## 六、多位同事:先做什麼、先不做什麼

**核心原則:協作是橫向的,責任是縱向到人的。**

```text
   人類 Owner              人類 Owner
        │ 負責                  │ 負責
   ┌────┴────┐            ┌────┴────┐
   │ 同事 A  │←─ 協作 ─→ │ 同事 B  │
   └─────────┘            └─────────┘
```

**A 找 B 幫忙,責任仍在 A 的 owner 身上。** 不能出現「A 說是 B 做的」。
**不要做 AI 組織圖**（AI 主管管 AI 下屬）—— 放大錯誤率、模糊責任,
而且 runtime 內部本來就有 multi-agent。
我們要的階層是**已設計好的「自主等級 ＋ 人類 owner」**,比組織圖精確也更好治理。

| 要素 | 何時做 |
|---|---|
| 每位同事有指定的**人類 owner** | **第一天** |
| **組織世界觀**（公司·術語·組織圖·政策·流程）＝ 共享單一來源 | **第二位同事出現時**（否則政策更新要改 N 個同事,且同事間認知會不一致） |
| **Skill library**（skill 是組織資產,不是同事私有） | 第二位同事出現時（否則 N 位同事 = N 倍維護） |
| 協作走 **channel／共享工作區**（人看得懂,軌跡天然存在） | 第一個真實跨同事需求出現時 |
| **A2A protocol** | **先不要** —— 競品都沒押注（見第二節） |

⚠️ **最容易犯的錯:第一位同事還沒證明價值,就先建「多同事協作平台」。**

---

## 七、建議與執行順序

### 給主管拍板的五件事

1. **確認產品定義** —— 做「組織僱得起、管得動、信得過的虛擬同事」,不是 agent framework。
2. **Runtime 用現成的** —— Codex App Server ＋ OpenClaw,**不自研 agent loop**,省下的能量全投產品層。
3. **Codex App 納入 baseline** —— 當能力對照組與部分場景介面;**BU 用現成工具能解的,推薦他們去用,不要擋**。
4. **先跑 Pilot E2E** —— 目的是找出「**只有同事能解、工具解不掉**」的問題,用它定義 v1 範圍。
5. **同步定義 Day-2 owner** —— 維運模式決定架構選擇,也決定要不要做 BU 自助介面。

### 五步

| Step | 做什麼 | 產出 |
|---|---|---|
| 1 | 完成現有 Pilot E2E | 同事到底能不能把工作做好 |
| 2 | 與 Codex App 建 baseline | Accuracy·Task success·User effort·Maintenance effort·Cost |
| 3 | 確認 Operating Model | 每場景定義 Builder／User／Owner／Maintainer |
| 4 | 補 Enterprise Gap | **只補**現成產品沒有、公司真的需要的 |
| 5 | 定義產品 v1 範圍 | 各層 Adopt／Integrate／Build;**工具解得掉的從 roadmap 移除** |

### 試點場景建議

| 場景 | 建議 | 為什麼 |
|---|---|---|
| **法務合約審閱** | OpenClaw ＋ Codex | 要權責、稽核、長期一致性（五條件多數成立） |
| **主動式 PM** | OpenClaw 為主 | 要長期存在與主動性 —— **OpenClaw 相較純 Codex App 最有價值的場景** |
| 治理／Research | **直接用 Codex App** | 偏 interactive knowledge work,工具就夠 |
| BU 自建同事 | 需補 Management UI | 最大 gap 在 UX 不在 backend |

### 三塊真正要補的（backend 能力已足夠）

1. **產品化** —— 建立同事·管 Persona／Skill／Routine·觀察·糾正·部署
2. **Agent Learning** —— 經驗→反思→記憶／技能→評估→重用（**先做 Memory/Skill refinement**）
3. **企業治理** —— Action→Policy→Permission→Approval→Audit→Execute
   （**必須做到 Role 與 Capability 分離**:是「法務同事」不代表自動擁有所有法務系統權限）

---

## 一句話結論

> **我們做的是「這家公司的同事」,不是「更好的 agent」。**
> Runtime 用現成的,把全部產品能量投入**身分、治理、技能、評估、生命週期,
> 以及 mentor 帶訓到漸進自主的機制** —— 那才是別人給不了、組織真正需要的。
>
> **賣點不是「它像個人」,是「它跟你合作越久越好用」。**

---

## 資料來源

- [Unlocking the Codex harness: the App Server](https://openai.com/index/unlocking-the-codex-harness/)
- [Introducing the Codex app](https://openai.com/index/introducing-the-codex-app/)
- [Codex app-server 文件](https://learn.chatgpt.com/docs/app-server.md) · [Codex MCP](https://learn.chatgpt.com/docs/extend/mcp.md)
- [grok-bot-0.18-reconstructed](https://github.com/b-nnett/grok-bot-0.18-reconstructed)（社群逆向重建,非官方）
- `.codex`（Codex canonical state）vs `.state`（外層 orchestration 帳本）的維運邊界:
  見[英文版 §5](./agent-product-landscape.md)
- OpenClaw／Hermes／Grok Bot／OpenBot 為我們的盤點研究,承諾前請查證
