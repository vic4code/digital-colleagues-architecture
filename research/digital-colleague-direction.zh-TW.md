# 數位同事技術方向與後續落地建議報告

**狀態:** 產品落地建議（決策支援）。對應 build-vs-buy 會議的五個議題與後續待辦。
**英文版能力盤點:** [agent-product-landscape.md](./agent-product-landscape.md)

> **前提（重要）。** 數位同事是**既定的產品方向**,不是待決策的選項。
> 本報告要回答的是「**怎麼最快把這個產品做出來、沿路哪些牆必須撞**」,
> 而不是「要不要做」。以下所有「用現成的」建議,目的都是**把產品能量集中在
> 產品本身**,不是縮小產品野心。

> **資料可信度說明。** Codex 相關敘述已對照 OpenAI 官方文件（文末附連結）。
> OpenClaw、Hermes、Grok Bot、OpenBot 的能力描述來自我們自己的盤點研究,
> 標記為 *(研究)*；正式承諾前請再對照各家最新官方文件。產品能力表變動很快。

---

## 一、Executive Summary

數位同事已完成初步技術驗證。隨著 Codex App、Codex App Server、OpenClaw 等
Agent 能力快速成熟,**產品的邊界需要重新畫一次**:哪些是我們的產品、
哪些是供應商已經給我們的。

**核心判斷:我們做的產品是「數位同事」,不是「Agent Framework」。**

- **Agent Runtime（Codex）是供應商** —— 就像做 SaaS 產品不會自己寫資料庫。
- **OpenClaw 是中介層供應商** —— 解決「Agent 如何長期存在」。
- **我們的產品面** = Identity、Governance、Skill、Evaluation、Lifecycle、
  以及讓 BU 自己建立與管理數位同事的介面。**這才是差異化所在。**

因此建議:

- **短期** — 完成既有試點的 End-to-End,**用試點找出產品必須突破的牆**
  （不是驗證「要不要做」）。
- **中期** — **OpenClaw + Codex Runtime** 作為可客製的技術底座；
  **Codex App 作為能力 baseline 與部分場景的使用介面**。
- **長期** — 產品資源集中在
  **Identity、Governance、Skill、Evaluation、Lifecycle、BU Self-service**,
  **不重造 Agent Runtime**。

換言之:**不是「Codex App 或自研架構二選一」**,而是
**用現成的零件,做我們自己的產品** —— 依不同使用者與場景採用不同 surface,
共用同一套企業治理與能力層。

---

## 一之二、先定義:我們的產品到底是什麼

這是全篇最重要的一句話 —— 產品邊界不清,後面每個技術決策都會吵不完。

```text
┌─────────────────────────────────────────────────────────┐
│  我們的產品:數位同事平台                                  │
│  讓一個組織可以「僱用、管理、信任」一個 AI 同事            │
│                                                          │
│  · Identity      同事是誰、代表誰、負什麼責               │
│  · Skill         它會做什麼、怎麼教它、怎麼改它           │
│  · Governance    它被允許做什麼、誰核准、如何稽核         │
│  · Evaluation    它做得好不好、有沒有退步                 │
│  · Lifecycle     建立 → 上線 → 修正 → 退役               │
│  · Self-service  BU 自己就能建立與維護                    │
└─────────────────────────────────────────────────────────┘
                          ↑ 使用
┌─────────────────────────────────────────────────────────┐
│  供應商層（不自研,持續汰換）                              │
│  · OpenClaw   → Agent 如何長期存在（channel/cron/event）  │
│  · Codex      → Agent 如何完成工作（reasoning/tool/exec） │
└─────────────────────────────────────────────────────────┘
```

**推論:** 「不重造 Agent Runtime」不等於「不做產品」。
恰恰相反 —— 每一小時花在重造 runtime,就是**少一小時**花在上面那個框裡,
而上面那個框才是別人沒有、我們必須自己做的東西。

---

## 一之三、產品願景:像人一樣的虛擬同事

這是產品的北極星,也是與競品最大的差異點。

**數位同事 = 一位虛擬的人。** 他有自己的身分、自己的帳號、自己的電腦 ——
只是這些都是虛擬的。他**一開始需要 mentor 帶**,被指派工作、被檢查、被糾正；
**帶熟之後就能自主工作**。

### 入職到自主 —— 跟真人一樣的生命週期

```text
① 入職 Onboarding    工號 · 帳號 · 電腦（VM/容器）· 權限範圍 · 角色說明
        ↓
② 帶訓 Mentored      mentor 指派任務 · 每個動作都要核准 · 當場糾正
        ↓
③ 試用 Supervised    自己做 · mentor 抽查 · 只有高風險動作要核准
        ↓
④ 自主 Autonomous    例行工作完全自主 · 只有例外才升級給人
        ↓
⑤ 退役 Retire        收回帳號與權限 · 記憶與軌跡歸檔
```

### 關鍵設計:自主等級 = 核准強度的反函數

這一步把「**培養**」與「**治理**」統一成同一個機制,而不是兩套系統:

| 自主等級 | 核准要求 | Mentor 介入 | 對應真人 |
|---|---|---|---|
| L0 帶訓 | 每個動作都要核准 | 每件事 | 新人跟著做 |
| L1 試用 | 寫入/對外動作要核准 | 抽查 | 試用期 |
| L2 自主 | 只有高風險動作要核准 | 看報表 | 轉正 |
| L3 資深 | 例外才升級 | 只看異常 | 獨當一面 |

**同一個 agent 可以在不同技能上處於不同等級** —— 就像真人可以在 A 業務獨當一面、
在 B 業務還是新手。**升級的依據是 Evaluation 的實際表現**,不是時間到了就升。

### 這對架構的意義

| 願景要素 | 架構後果 |
|---|---|
| 有自己的帳號 | L2 System Identity（service account / OAuth）**必要**,不是選配 |
| 有自己的電腦 | 需要**隔離的執行環境**（VM / 容器），動作才可歸屬、可稽核 |
| Mentor 帶訓 | 需要 **mentor 介面**:指派、審核、糾正、看軌跡 |
| 漸進自主 | 需要 **autonomy level** 當一等公民,直接驅動 approval policy |
| 會變強 | 需要 **Evaluation + Memory/Skill 沉澱**（糾正要能變成下次的能力） |

⚠️ **與「Identity 與 Compute 解耦」的關係（澄清）:**
「解耦」的意思是**不要為了給 Persona 就急著開一台實體機**,
而不是「同事不該有自己的電腦」。正確的說法是:
**身分一定是自己的;運算環境是可選的實作** —— 依風險等級決定給共用沙箱、
容器、還是專屬 VM。等到同事要**自主對外行動**時,隔離的執行環境就變成必要,
因為那時「這個動作是誰做的」必須查得到。

---

## 一之四、「現成工具好像已經能解決 BU 問題了」—— 這是好事,也是探針

發展過程中我們一直看到:某些 BU 問題,現成工具（Codex App、各種 SaaS AI 功能）
好像就解掉了。**這不是壞消息,要用對方式解讀。**

### 正確的處理:讓工具先去解,不要擋

- BU 現在就能拿到價值 → **就讓他們用**,不要等我們的平台。
- 擋住 BU 用工具去換「都要走我們平台」,會同時失去信任與時間。
- 我們反而應該**主動推薦**工具給適合的場景。

### 更重要的:把它當成產品邊界的探針

> **工具解得掉的 = commodity,從 roadmap 拿掉。
> 工具解不掉的 = 我們的產品。**

現成工具的天花板,恰好就是「工具」與「同事」的分界線:

| 現成工具的限制 | 為什麼變成我們的產品 |
|---|---|
| 一次性、**要人主動發起** | 同事要**長期存在、自己醒來**做事 |
| 綁在**個人帳號**上 | 同事要有**組織身分**,人離職了同事還在 |
| **沒有權責歸屬** | 出事要查得到「是誰、憑什麼權限做的」 |
| **不會累積** | 教過的東西要留下來,下次自己會 |
| 沒有 mentor / 漸進自主 | 同事要**能被託付**,而且會愈來愈能被託付 |
| 跨系統**要人手動接** | 同事要能自己串起整段工作 |

### 判斷式（每個場景都用這個問）

> **如果一個 BU 問題,用現成工具 ＋ 一個人願意每次去按,就能解決
> → 那不是我們的產品,推薦他們去用。**
>
> **如果它需要「一個能被託付、被管理、被稽核、會變強的角色」
> → 那才是數位同事。**

### 誠實的風險（要跟主管講）

如果試點跑完發現**所有場景都落在前者**（工具 ＋ 一個人按就夠），
那產品的正當性就必須重新檢視 —— 這正是**先跑 pilot E2E** 的意義:
不是驗證「要不要做」,而是**找出哪些問題只有「同事」能解**,
並用這些問題定義產品的第一版範圍。

目前看起來會落在後者的訊號:法務合約審閱（要權責、稽核、長期一致性）、
主動式 PM（要長期存在與主動性）—— 這兩個場景值得優先驗證。

---

## 二、分層:產品邊界畫在哪一層

數位同事 = **長期存在、有角色、有能力、有權限邊界的 AI Actor**。
底層 runtime 可替換。逐層決定「**這層是我們的產品,還是供應商的零件**」:

```text
數位同事 Digital Colleague
├─ Identity / Persona / Role          ← 它是誰
├─ Memory / Skills / Routine          ← 它知道什麼、累積什麼能力
├─ Channel / Trigger / Proactivity    ← 怎麼被找到、怎麼自己醒來
├─ Governance / Approval / Audit      ← 被允許做什麼、可稽核
├─ Agent Runtime                      ← 怎麼思考與執行（可替換）
└─ Tools / MCP / Computer Use         ← 它能碰什麼
```

**推論:** 六層都要有,但**不是六層都要自己做**。
上面四層（Identity、Memory/Skill、主動性、Governance）是**我們的產品**,
別人給不了我們要的樣子；下面兩層（Runtime、Tools）是**零件**,
現成方案最強,自己重造只會排擠產品開發的資源。

---

## 三、五個議題的回答

### 議題一:Codex App 能不能直接拿來做數位同事?

**部分場景可以,而且應該拿來當 baseline；但不能直接等同完整數位同事。**

Codex App 特別適合（UI、自然語言互動、Skill、Automation 已相對成熟）:

- 法務、治理、BA 等非工程人員
- Interactive knowledge work、文件分析、Research
- 建立 Skill、建立 Automation、個人工作效率提升

但若數位同事需要以下能力,Codex App 本身**無法完整覆蓋**:

- 自己收信 / 自己發信
- 在 Teams 中有獨立身份
- 長期背景運作、主動監控事件
- 企業特定 Permission / Audit

**建議:** Codex App 定位為「**BU / Knowledge Worker 的 AI 工作介面**」與
**能力 baseline**（用來比較我們做得夠不夠好）。

⚠️ **不要誤讀成「有 Codex App 就不用做產品」。**
Codex App 給的是**個人生產力工具**;我們要做的是**組織僱得起、管得動、
信得過的數位同事**（身分、權責、治理、生命週期、BU 自助）。
兩者是**互補**:Codex App 可以是其中一種 surface,但它不會替我們回答
「這位同事是誰、能動哪些系統、誰核准、出事查得到嗎」。

---

### 議題二:目前的 OpenClaw + Codex 架構還有必要嗎?

**有,而且技術責任邊界相當清楚。**

```text
Teams / Outlook / Enterprise Channel
                ↓
             OpenClaw
      Identity / Session / Trigger
        Cron / Heartbeat / Event
                ↓
         Codex App Server
                ↓
          Codex Agent Runtime
      Reasoning / Skill / Tool / File
```

| OpenClaw 負責 | Codex 負責 |
|---|---|
| Agent 長期存在 | Reasoning |
| Channel、Session routing | Thread |
| Cron、Heartbeat、Event trigger | Tool execution、File / Shell |
| Notification | Skill、Plugin |
| 外層 approval / orchestration | Computer Use、Native compaction |

**所以目前架構不是重複 Codex,而是:**
> **OpenClaw 管「同事如何存在」,Codex 管「同事如何完成工作」。**

**建議:** 保留 OpenClaw + Codex Runtime,作為**需要企業整合、主動式運作、
獨立身份**場景的主要技術路線。**不建議再自行重做 Agent loop。**

#### 補充:Codex App vs Codex App Server 的實際差異（已查證）

兩者跑**同一個 Codex harness**（同模型、同 agent loop）。差別:

- **App Server** = harness 的雙向 JSON-RPC API:threads、turns、tools、shell、
  files、skills、plugins、approvals、sandbox、streamed events。
  這已是**大部分真正「Codex 會做事」的能力**,且是 headless、可嵌入的。
- **Codex App** = App Server **加上**閉源產品層:桌面 UI、Projects、
  worktree orchestration、diff/terminal UX、Automation UX、Remote Control、
  通知、OS 整合、部分產品專屬 state。

**結論:`App Server ≠ 完整的 Codex App 產品`。** OpenClaw + App Server 可重現
大部分「Codex 做事的能力」,但**不會自動重現** Codex App 的 UX 與產品
orchestration —— 那個落差正是後面第六節「產品化 gap」要補的東西。

---

### 議題三:一般使用者到底要用什麼介面?

**這是最容易混在一起的問題 —— 必須把兩種角色拆開。**

| 角色 | 做什麼 | 用什麼 |
|---|---|---|
| **Builder / Maintainer** | 建立 Skill、修改 Workflow、Debug、調整 Agent、管理 Automation | Codex App / CLI / VS Code / 管理平台 |
| **End User** | 「找某位數位同事幫我工作」 | Teams / Outlook / Email / Web |

```text
Builder    → Codex App / 管理介面
End User   → Teams / Outlook / Email
```

**建議:** 不要要求所有人都用同一個介面。兩者**共用同一組 Enterprise Skill、
Identity 與 Governance**。（這與 ADR-019「人只有一個互動介面」一致:
ADR-019 約束的是*終端使用者*那一側,不是開發者工具。）

---

### 議題四:數位同事需不需要「獨立身份」?

**不是所有 Agent 都需要。建議拆成三層 Identity,逐層判斷。**

| 層級 | 內容 | 何時需要 |
|---|---|---|
| **L1 · Role Identity** | Role、Persona、Skill、Memory | **基本上都應該有** |
| **L2 · System Identity** | Service account、OAuth、Permission、Audit trail | Agent 可**自主操作企業系統**時 |
| **L3 · Human-facing Identity** | Teams: Legal Digital Colleague<br>Email: legal-agent@company | Agent 要**自己對外發信、自己找其他人、不經主人完成工作**時 |

**與產品願景的關係:** 我們的目標是「像人一樣的虛擬同事」——
**終局是 L1+L2+L3 都有**（身分、帳號、電腦）。但**不必第一天就全給**:
依同事的自主等級逐步開通,就像真人新人也是逐步取得系統權限。

> **身分一定是自己的;運算環境是可選的實作。**
> 早期用共用沙箱即可；等同事要**自主對外行動**時,隔離的執行環境
> （容器 / 專屬 VM）就變成必要 —— 因為那時「這個動作是誰做的」必須查得到。

---

### 議題五:最大的 blocker 到底是什麼?

**不是 Agent 能不能做,而是:正式上線後誰維護、怎麼維護 —— Day-2 Operation。**

必須有答案的問題:

- 誰是 Owner?誰更新 Skill?誰處理 Agent 故障?
- 誰負責 runtime upgrade?誰管帳號?誰管設備 / VM?
- 誰處理權限?誰看 audit log?誰負責 performance regression?

**這個問題會直接決定 architecture 選擇。**

---

## 四、不同維護模式 → 不同技術方案

| 情境 | 維護者 | 適合方案 | 理由 |
|---|---|---|---|
| **A** | AI Team 維護 | OpenClaw + Codex App Server / CLI-based | 高度客製、易整合、可控 runtime、能做企業特殊功能 |
| **B** | BU 自己維護 | Codex App / Productized Bot Management UI | 自然語言操作、Skill 好管、Automation 易懂、不碰程式與 infra |
| **C** | **BU 使用、中央平台維護** | **混合（建議）** | 最現實的中長期模型 |

**情境 C —— 建議的 Operating Model:**

```text
Central AI Team   → Runtime / Governance / Platform
BU Builder        → Skill / Scenario
General User      → Teams / Outlook
```

---

## 五、各試點場景建議

### 1. 法務合約審閱

```text
收到合約 → 取得附件 → 合約審閱 → 標示問題 → Human Review → 回信
```

**需要:** Outlook integration · Event trigger · Skill · File manipulation ·
Approval · Audit
**建議方案:** **OpenClaw + Codex Runtime**（Codex App 作為能力 baseline 比較）
**驗證重點:** 準確率 · 合約重點標示正確率 · End-to-End success rate ·
Human correction rate · 維護成本

### 2. 科技治理 / Research 類型

主要是搜尋、分析、文件整理、報告、建立小工具 —— 偏 Interactive Knowledge Work。
**建議方案:** **直接以 Codex App 作 baseline。**
只有當未來需要**定期監控、主動提醒、長期記憶**時,才加 OpenClaw。

### 3. PM / 主動式 Agent

```text
每天看 Project status → 發現 blocker → 找負責人 → 主動提醒 → 整理 daily summary
```

**核心需求:** Persistent · Cron · Heartbeat · Event · Channel
**建議方案:** **OpenClaw 為主要 orchestration layer。**
這類型是**目前 OpenClaw 相較純 Codex App 最有價值的場景。**

### 4. BU 自己建立數位同事

**最大 gap 不在 backend,而在 UX。** BU 不可能直接維護 OpenClaw config、
`CODEX_HOME`、MCP、YAML/JSON、Cron、Thread mapping。

需要補一個 **Digital Colleague Management UI**:

```text
Create Colleague → 設 Role → 設 Skill → 設 Routine → Test → Deploy → 看 Activity → Correct
```

競品參考:Grok Bot、Hermes Bot Mode、OpenBot *(研究)* —— 它們證明這個市場成立,
也標示出我們必須做得更好的地方（尤其 mentor 帶訓與漸進自主,是它們較弱的一塊）。

---

## 六、目標技術架構（收斂方向）

```text
                    Digital Colleague
                           │
          ┌────────────────┼────────────────┐
       Identity         Persona           Owner
          └────────────────┼────────────────┘
                           │
                   Colleague Profile
          ┌────────────────┼────────────────┐
       Memory            Skill           Routine
          └────────────────┼────────────────┘
                           │
                    OpenClaw Layer
         ┌─────────────────┼─────────────────┐
      Channel           Trigger          Governance
 Teams / Outlook   Cron / Event / HB  Approval / Policy
         └─────────────────┼─────────────────┘
                           │
                   Codex App Server
                           │
                    Codex Runtime
          ┌────────────────┼────────────────┐
       Computer           MCP            Files
                           │
                   Enterprise Systems
```

### 覆蓋矩陣 — 誰覆蓋哪一層

圖例:● 強 · ◐ 部分 · ○ 幾乎沒有 · *(研究 = 未驗證)*

| 能力層 | Codex App | Codex App Server | OpenClaw | Hermes | Grok Bot | OpenBot |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| Identity / Persona / Role | ◐ | ○ | ● | ◐ | ● | ◐ |
| Memory / Skills / Routine | ◐ | ◐ | ◐ | ● | ● | ◐ |
| Channel / Trigger / Proactivity | ◐ | ○ | ● | ● | ◐ | ◐ |
| Governance / Approval / Audit | ◐ | ◐ | ◐ | ○ | ○ | ● |
| Agent Runtime | ● | ● | ○ | ● | ● | ◐ |
| Tools / MCP / Computer Use | ● | ● | ◐ | ◐ | ● | ◐ |
| **產品 UX（建立/編輯/部署）** | ● | ○ | ○ | ◐ | ● | ◐ |

*(圖形化版本:[agent-product-matrix.svg](./agent-product-matrix.svg))*

**一句話總結各家貢獻:**
> **Codex** 給「腦與執行」· **OpenClaw** 給「生命週期與主動性」·
> **Hermes** 給「學習模型」· **Grok Bot** 給「AI 同事的產品 UX」·
> **OpenBot** 給「企業治理的架構形狀」。

---

## 七、真正需要補的三塊

Backend agent capability 已經足夠。缺的是這三塊:

### 1. Productization
Create Bot · Manage Persona · Manage Skill · Manage Routine · Observe ·
Correct · Deploy　*(競品參考:Grok Bot、Hermes Bot Mode)*

### 2. Agent Learning　*(競品參考:Hermes)*
```text
Experience → Reflection → Memory / Skill → Evaluation → Reuse
```
**先從 Memory / Skill refinement 做,不需要一開始就做複雜 RL。**

### 3. Enterprise Governance　*(競品參考:OpenBot)*
```text
Agent Action → Policy → Permission → Approval → Audit → Execute
```
**必須明確做到 Role 與 Capability 分離:**
一個 Agent 是「法務同事」,**不代表它自動擁有所有法務系統權限**。

---

## 八、維運必須知道的 state 邊界:`.codex` vs `.state`

```text
OpenClaw / 外層 wrapper
├─ .state/                 ← 外層系統狀態:我們「怎麼管理 Codex」
│  └─ session↔thread 對照 · process/PID · 連線狀態 · broker/lifecycle metadata
│
└─ Codex App Server
   └─ ~/.codex/            ← Codex canonical state:Codex「自己記得的東西」
      └─ auth · config · sessions/threads · state DB · memories · goals · skills · plugins
```

- `~/.codex/` = **Codex 自己的家** —— 同事持久的「大腦狀態」。
- `.state/` = **外層系統的帳本**,記錄它怎麼跑 Codex,可重建。
- ⚠️ `~/.codex/state_*.sqlite` **仍屬 Codex canonical state**,雖然名字有 state,
  但**不是**外層的 `.state/`。

**維運推論:** 一個同事的可攜性 = `~/.codex/` ＋ workspace 檔的可攜性。
這直接影響「換機器 / 換 VM / 誰維護」的成本 —— 也就是議題五的 Day-2 問題。

---

## 九、建議主管拍板的五個方向

**大前提:數位同事是既定產品方向。以下是「產品邊界怎麼畫」,不是「要不要做」。**

1. **確認產品定義** —— 我們做的是「**組織僱得起、管得動、信得過的虛擬同事**」
   （身分／帳號／電腦、mentor 帶訓、漸進自主、治理、生命週期）,
   **不是**再做一套 Agent Framework。
2. **Runtime 用現成的** —— Codex App Server + OpenClaw 為技術底座,
   **不自研 Agent loop**。省下的能量全部投入產品層。
3. **Codex App 納入正式 baseline** —— 當能力對照組,也當部分場景的使用介面；
   BU 現在就能用現成工具解掉的問題,**推薦他們去用,不要擋**。
4. **短期先跑 Pilot E2E** —— 目的是**找出「只有同事能解、工具解不掉」的問題**,
   用它定義產品第一版範圍;先不要投入大量長期 platform engineering。
5. **同步定義 Day-2 owner / operating model** —— 維運模式決定架構選擇,
   也決定產品要不要做 BU 自助介面。

---

## 十、後續執行順序

| Step | 做什麼 | 產出 |
|---|---|---|
| **1** | 完成現有 Pilot 的 E2E | 確認 Agent 到底能不能把工作做好 |
| **2** | 建立 Baseline:每個主要 Pilot 都與 Codex App 比較 | Accuracy · Task success · User effort · Developer effort · Maintenance effort · Cost |
| **3** | 確認 Operating Model | 每個場景定義 Builder / User / Owner / Maintainer |
| **4** | 補 Enterprise Gap | 只補現成產品沒有、但公司真的需要的能力 |
| **5** | **定義產品第一版範圍** | 依前面結果決定各層 Adopt / Integrate / Build,並鎖定 v1 產品範圍 |

**Step 5 的重點:** 產品要做是既定的;要用前四步的實際結果來決定
**產品的邊界畫在哪** —— 哪些層直接採用、哪些整合、哪些自己做。
特別是:**工具解得掉的場景從 roadmap 移除,把 v1 集中在只有「同事」能解的問題。**

---

## 十一、給主管的一句話結論

> **我們要做的產品是「數位同事」,不是「Agent Framework」。**
> Runtime 直接用現成的（Codex + OpenClaw）,把全部產品能量投入
> **身分、治理、技能、評估、生命週期,以及 mentor 帶訓到漸進自主的機制** ——
> 那才是別人給不了、而組織真正需要的東西。

現成工具能幫 BU 解決的問題,**就讓他們用**;工具解不掉的部分,
正好定義了我們產品的第一版範圍。這樣既保留既有技術投資,
也避免與快速成熟的 Agent Product 重複開發,
同時把資源集中在「**讓一個組織能夠僱用、管理、信任一位虛擬同事**」
這件真正的差異化能力上。

---

## 資料來源

- [Unlocking the Codex harness: the App Server](https://openai.com/index/unlocking-the-codex-harness/) — App Server 是共用 Codex harness 之上的 JSON-RPC 介面。
- [Introducing the Codex app](https://openai.com/index/introducing-the-codex-app/) — 產品層（桌面 UI、projects、automation）。
- [Codex app-server 開發者文件](https://learn.chatgpt.com/docs/app-server.md) · [Codex MCP](https://learn.chatgpt.com/docs/extend/mcp.md)
- OpenClaw / Hermes / Grok Bot / OpenBot 各列為**我們的盤點研究**,承諾前請對照各家最新文件驗證。
