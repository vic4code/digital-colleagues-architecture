# 數位同事技術方向與後續落地建議報告

**狀態:** 建議報告（決策支援）。對應 build-vs-buy 會議的五個議題與後續待辦。
**英文版能力盤點:** [agent-product-landscape.md](./agent-product-landscape.md)

> **資料可信度說明。** Codex 相關敘述已對照 OpenAI 官方文件（文末附連結）。
> OpenClaw、Hermes、Grok Bot、OpenBot 的能力描述來自我們自己的盤點研究,
> 標記為 *(研究)*；正式承諾前請再對照各家最新官方文件。產品能力表變動很快。

---

## 一、Executive Summary

數位同事已完成初步技術驗證。但隨著 Codex App、Codex App Server、OpenClaw 等
Agent 能力快速成熟,下一階段**不宜再預設「一定要完整自研一套 Agent Platform」**,
而應回到實際使用情境,確認不同角色需要什麼能力,再決定各層採用現成產品或自研。

建議方向收斂為:

- **短期** — 先完成既有試點的 End-to-End 驗證。
- **中期** — 以 **OpenClaw + Codex Runtime** 作為可客製的技術底座,
  同時把 **Codex App 作為 BU 自助式工作的 baseline**。
- **長期** — 數位同事聚焦在 **Identity、Governance、Skill、Evaluation、Lifecycle**,
  而**不是**重新打造 Agent Runtime。

換言之:**現階段不是「Codex App 或自研架構二選一」**,而是依不同使用者與場景
採用不同 surface,**共用企業治理與能力層**。

---

## 二、先講清楚:數位同事是「分層」,不是一個產品

數位同事 = **長期存在、有角色、有能力、有權限邊界的 AI Actor**。
底層 runtime 可替換。逐層決定「保留 / 用現成 / 薄建」:

```text
數位同事 Digital Colleague
├─ Identity / Persona / Role          ← 它是誰
├─ Memory / Skills / Routine          ← 它知道什麼、累積什麼能力
├─ Channel / Trigger / Proactivity    ← 怎麼被找到、怎麼自己醒來
├─ Governance / Approval / Audit      ← 被允許做什麼、可稽核
├─ Agent Runtime                      ← 怎麼思考與執行（可替換）
└─ Tools / MCP / Computer Use         ← 它能碰什麼
```

**推論:** 我們不需要自己做全部六層。真正能加值的是上面四層；
下面兩層（runtime、tools）正是現成方案最強、最不該重造的地方。

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

**建議:** Codex App 定位為「**BU / Knowledge Worker 的 AI 工作介面**」,
而非數位同事的唯一 runtime。

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

**建議:** 不要把「有 Persona」與「一定要一台獨立電腦 / 一組獨立帳號」綁在一起。
> **Identity 應與 Compute 解耦。**

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

可參考:Grok Bot、Hermes Bot Mode、OpenBot *(研究)*

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
Correct · Deploy　*(參考 Grok Bot、Hermes Bot Mode)*

### 2. Agent Learning　*(參考 Hermes)*
```text
Experience → Reflection → Memory / Skill → Evaluation → Reuse
```
**先從 Memory / Skill refinement 做,不需要一開始就做複雜 RL。**

### 3. Enterprise Governance　*(參考 OpenBot)*
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

1. **Codex App 納入正式 baseline**,不另外重做相同能力。
2. **保留 OpenClaw + Codex Runtime**,作為 Enterprise Digital Colleague 的主要 PoC 架構。
3. **短期優先驗證 End-to-End 是否真的解決 user problem**,
   不要先投入大量長期 platform engineering。
4. **同步定義 Day-2 owner / operating model** —— architecture 最終選擇應配合未來維護者。
5. **下一階段自研重點不再是 Agent Runtime**,而是:
   Digital Identity · Enterprise Skill · Governance · Evaluation · Lifecycle · BU Self-service。

---

## 十、後續執行順序

| Step | 做什麼 | 產出 |
|---|---|---|
| **1** | 完成現有 Pilot 的 E2E | 確認 Agent 到底能不能把工作做好 |
| **2** | 建立 Baseline:每個主要 Pilot 都與 Codex App 比較 | Accuracy · Task success · User effort · Developer effort · Maintenance effort · Cost |
| **3** | 確認 Operating Model | 每個場景定義 Builder / User / Owner / Maintainer |
| **4** | 補 Enterprise Gap | 只補現成產品沒有、但公司真的需要的能力 |
| **5** | 再決定長期架構 | 依前面結果決定各層 Adopt / Integrate / Build |

**Step 5 的重點:** 不是現在先預設「自研 / Codex App 哪個一定是答案」,
而是用前面四步的實際結果來決定。

---

## 十一、給主管的一句話結論

> **數位同事不需要重新打造一套完整 Agent Framework。**
> 短期以 **Codex 驗證工作能力**、**OpenClaw 補長期存在與企業整合**,
> 並將真正的自研資源集中在
> **Identity、Governance、Skill、Evaluation 與 Lifecycle**。

這樣既能保留現有技術投資,也能避免與快速成熟的 Agent Product 重複開發,
同時保留未來企業數位同事真正需要的差異化能力。

---

## 資料來源

- [Unlocking the Codex harness: the App Server](https://openai.com/index/unlocking-the-codex-harness/) — App Server 是共用 Codex harness 之上的 JSON-RPC 介面。
- [Introducing the Codex app](https://openai.com/index/introducing-the-codex-app/) — 產品層（桌面 UI、projects、automation）。
- [Codex app-server 開發者文件](https://learn.chatgpt.com/docs/app-server.md) · [Codex MCP](https://learn.chatgpt.com/docs/extend/mcp.md)
- OpenClaw / Hermes / Grok Bot / OpenBot 各列為**我們的盤點研究**,承諾前請對照各家最新文件驗證。
