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

## 一之五、差異化、Trade-off 與維運成本（主管一定會問的三題）

### A. 其他工具做得到很多 —— 但做不到什麼?

先誠實分類,不要把「還沒做」當成「做不到」:

| 類別 | 內容 | 判斷 |
|---|---|---|
| **結構性做不到** | ① **累積的組織知識** —— 廠商產品每個客戶都從零開始;我們的同事被帶了半年後,知道我們的合約範本、我們一定會 flag 的條款、我們的語氣。**這無法預先內建,也搬不走。**<br>② **跨系統的單一角色** —— 廠商工具通常綁在自己生態（Outlook 的 copilot 活在 Outlook）。一位同事橫跨 Outlook＋Teams＋內部系統,共用**同一個身分、同一份記憶、同一條稽核軌跡** —— 跨越廠商邊界,沒有單一廠商有動機做。<br>③ **可稽核的權責鏈** —— 誰授權這位同事、權限範圍誰核准、產出誰覆核、任何決定能不能重建。廠商給的是 log,不是**我們合規框架要的證據鏈**。 | **真正的護城河** |
| **設計領先,但可被抄** | ④ **mentor 帶訓 → 漸進自主** —— 多數工具是二元的（要嘛每步都要人核准,要嘛全自動）。綁定實測表現的漸進信任很少見,但**廠商抄得動**。 | **約 6–12 個月領先,不是護城河 —— 但被抄走的是「機制」,抄不走的是「已經累積的帶訓成果」** |
| **有爭議,廠商已在做** | ⑤ **組織身分** —— 部分廠商已支援 agent 的 service account / bot identity。我們的差別在「同事是**組織的一級實體**」(有主管、有權責歸屬),那是治理構造,不只是功能。 | **不要當成主要賣點** |

**檢驗方法（每個功能都用這個問）:**

> **如果 OpenAI 明天發布這個功能,我們的東西還有價值嗎?**
> - 「跟 agent 聊天」→ 一發布就死。**不是差異化。**
> - 「一位被法務帶了半年、懂我們審查標準、稽核軌跡合規部門認可的同事」
>   → 廠商發布再強的 agent,這個還在。**這才是差異化。**

**一句話:**
> **我們的產品不是「更好的 agent」,是「這家公司的同事」。
> 別人賣的是能力;我們累積的是這個組織的身分、知識與信任。**

**對 roadmap 的意義:優先做「會累積的」,而不是「功能」。**
會累積 = skill 沉澱、mentor 的每次糾正、稽核歷史、信任等級。
不會累積 = 再接一個整合、更漂亮的 UI、又一個 automation。
**mentor 機制的戰略價值就在這裡:它是累積的引擎** —— 每糾正一次,
就變成組織的永久能力。

---

### B. 目前架構的 Trade-off 與風險（誠實版）

| # | 風險 | 說明 | 緩解 |
|---|---|---|---|
| **R1** | **雙上游依賴** | 同時依賴 OpenClaw 與 Codex,兩者都在快速演進;Codex app-server 官方標示為 experimental。**升級是經常性成本,不是一次性。** | 版本 pin + 相容性測試套件;每季固定排升級 |
| **R2** | **抽象會洩漏** | 「Codex 像資料庫一樣是供應商」這個比喻**不完全成立** —— 資料庫有穩定的 SQL 標準,agent harness 沒有。Codex 換模型行為,我們 skill 的行為會**無聲地跟著變**。 | 每個關鍵 skill 要有回歸測試（這也是 Evaluation 的一部分） |
| **R3** | **治理層的高度可能不對** ⚠️ | 我們把 governance 放在 OpenClaw 層,但 agent 的真實動作發生在 **Codex 內部**（tool call、shell）。**只管入口不等於管到內部** —— 真正的執行邊界是 Codex 自己的 sandbox/approval。等於我們把一部分治理**委託給供應商的實作**。 | 高風險動作走 MCP tool（我們自己的邊界）而非 shell;稽核以「兩層 trace」對齊;**要先問合規部門接不接受** |
| **R4** | **中介層的單點風險** | 若資安否決 OpenClaw,中介層就消失,那層（channel／lifecycle／cron）就得自己做 —— 正是我們說不做的那層。 | 自架 + 憑證由我們的 broker 管;預先評估「若沒有它,自己做要多久」 |
| **R5** | **上下夾擊的時間窗** | Codex App 持續往上吃（automation、skills、computer use）,OpenBot／Grok Bot 往下吃（治理、bot 管理 UI）。**窗口是真的,但不是無限的。** | 產品能量集中在「會累積」的部分,不跟廠商拚功能 |
| **R6** | **漸進自主依賴 Evaluation —— 這是最難的技術賭注** ⚠️ | 「這位同事在合約審查上夠好了可以升級」需要**可測量的 ground truth**。**量不出來,自主等級就是憑感覺,整個 mentor→自主模型就變成劇場。** | 從**單一場景的小型評測集**開始（法務可標註的樣本）;先做 Memory/Skill refinement,不要一開始就做複雜 RL |

**R3 與 R6 是兩個真正需要現在就決定的風險** —— 其餘是可管理的工程成本。

---

### C. 維運成本（不要低估的部分）

**每位同事的固定成本**

| 項目 | 說明 |
|---|---|
| 執行環境 | 若每位同事要「自己的電腦」,就是 N 台 VM／容器 |
| 帳號與授權 | 每位同事的 M365／Google seat、各系統帳號 |
| **LLM token** | 主動式同事的 cron／heartbeat **會持續消耗** |
| 訂閱續訂 | 每個整合的 webhook TTL 都要監控續訂,**漏續會無聲失效** |

**平台的持續成本**

| 項目 | 說明 |
|---|---|
| **上游升級** | 兩個快速演進的依賴,可能每季都要處理 —— **經常性成本** |
| Skill 維護 | 服務 API 改版、公司流程變更 |
| **Mentor 的人力時間** | 帶一位同事到能自主,可能是**數十小時的人工** |
| 稽核與合規回應 | 每次稽核都要能重建軌跡 |
| 故障處理 | 誰半夜起來修（＝議題五的 Day-2） |

**最被低估的三個:**

1. **Mentor 的人力時間** —— 這是產品的隱藏成本,而且**不能外包給 AI Team**:
   必須是懂業務的人（法務的同事只能法務帶）。
   **建議:把它明列進每位同事的 onboarding 預算,不要藏在「導入」裡。**
2. **上游升級** —— 兩個依賴 × 快速演進 = 經常性工程投入,要編進人力規劃。
3. **主動式同事的 token 成本** —— cron/heartbeat 讓成本從「用多少付多少」
   變成**固定月費**。這正是 triage gate（deliver-only 不進 LLM）要解的問題,
   **它不是優化,是成本結構的必要設計。**

---

## 一之六、壓力測試:誰管、誰維運,以及「這不只是 fancy」要怎麼證明

這一節刻意寫成反方視角。**如果以下問題答不出來,產品就還不該做** ——
這不是技術問題。

### A. 誰管理數位同事?（業務面 —— 這是新增的工作量,不是自動化）

**必須是懂那個業務的人。法務的同事只能法務帶,不能外包給 AI Team。**

Mentor / Owner 要做:指派工作 · 審核產出 · 糾正錯誤 · 決定何時升級自主等級。

⚠️ **這是真實的新增工時,不是既有工作的自動化。**
帶一位同事到能自主,可能是數十小時的人工投入。
**如果業務方不願意投入這個時間,產品就不成立** —— 這比任何技術風險都致命。

**必須先確認的事:** 每個試點場景,**指名一位 mentor**,並確認他的主管
同意這段時間算他的工作。沒有指名到人,就不要開始。

### B. 誰維運?（技術面 —— Day-2）

| 職責 | 誰 | 未回答就會踩雷 |
|---|---|---|
| VM／容器、上游升級、故障排除 | AI Team 或 IT | **半夜壞了誰修?** 沒人修 → 主動式的價值直接打折 |
| 帳號、權限、憑證 | IT／資安 | 同事的帳號誰開、誰收回 |
| Skill 更新（流程／API 變更） | Mentor ＋ AI Team | 流程改了誰負責改 skill |
| 稽核回應 | 合規 ＋ AI Team | 稽核要軌跡時誰去撈 |

**最現實的模型（前面第四節的情境 C）:**
中央 AI Team 顧 runtime／平台,BU 出 mentor 顧 skill／場景,一般使用者只用。
**但這要求中央團隊願意長期扛 Day-2** —— 這是承諾,不是技術選型。

---

### C. 「比起直接用現成工具,優勢到底是什麼?」—— 條件式回答

**先講最誠實的話:如果只是「人自己開工具做事」就夠用,那就用工具,不要做平台。**

實際比較（以法務合約審閱為例）:

| | 工具路線 | 數位同事路線 |
|---|---|---|
| 流程 | 法務收到合約 → 開工具 → 拖進去 → 問 → 看結果 → 自己回信 | 合約寄到同事信箱 → 自動審 → 標好問題 → 人覆核 → 回信 |
| 誰發起 | **每次都要人動手** | 工作自己進來 |
| 一致性 | 每個人問法不同,結果不同 | 標準固定 |
| 知識 | 「我們的標準」存在各人自己的 prompt 裡 | **組織資產,人走了還在** |
| 稽核 | 軌跡在個人帳號 | 集中、可稽核 |

**優勢只在以下條件成立時才存在（五條,全部要問）:**

1. **量夠大** —— 手動發起的成本 × 次數 > 平台建置＋維運成本
2. **標準必須一致** —— 不同人做出不同結果是問題（法務／合規尤其）
3. **知識必須留下** —— 人員流動時,標準不能跟著走
4. **要能稽核** —— 會有人問「為什麼這樣判斷」
5. **發起者不是使用者** —— 工作從外面來（客戶信、系統事件）,不是自己想到才做

> **五條都不成立 → 用工具。這是正確答案,不是失敗。**
> 目前試點場景中,**有幾個真的滿足這五條?** 這要去驗證,不要用假設的。

---

### D. 反 fancy 檢驗:工作量有沒有真的轉移?

這是整份報告最重要的一句話:

> **工具:人做事,AI 輔助 —— 工作量還在人身上。
> 同事:AI 做事,人審核 —— 工作量轉移了。**
>
> **如果人還是每個產出都要從頭看,那就只是 fancy 的工具。**

所以價值兌現的那一刻,是**人可以不看了** —— 也就是自主等級真的升上去的時候。
這也是為什麼 mentor→自主不是加分項,而是**價值交付的機制本身**。

**可量測的成功指標（建議直接拿這個對主管承諾）:**

| 指標 | 意義 | 失敗長什麼樣 |
|---|---|---|
| **人工覆核率隨時間下降** | 工作量真的在轉移 | 半年後還是 100% 要人看 → **產品失敗** |
| 單位任務的人工分鐘數下降 | 省下的時間是真的 | 沒降 → 只是換個方式做同樣的事 |
| 一致性（同類任務結果差異）下降 | 標準真的固定住了 | 沒降 → 知識沒沉澱 |
| Mentor 糾正次數隨時間下降 | 同事真的在變強 | 沒降 → 學習迴路沒作用 |

**如果第一個指標半年後沒有下降,應該誠實收掉,而不是加功能。**

---

### E. 什麼時候不該做這個產品（收掉的條件）

明確寫出來,避免沉沒成本綁架決策:

- 找不到願意投入時間的 **mentor**（業務方不 buy-in）
- 沒有團隊願意長期扛 **Day-2**
- 試點場景**五個條件都不成立**（工具就夠用）
- **人工覆核率不下降**（工作量沒有轉移)
- Evaluation 做不出來 → 自主等級只能憑感覺 → 治理無法交代

---

## 一之七、多位同事:互動性、擴展性、組織層級、組織世界觀

從「一位同事」推到「一群同事」。這裡有一個很吸引人的陷阱要先拆掉。

### A. 先拆陷阱:不要做「AI 組織圖」

最誘人的想像是:AI 主管管 AI 下屬、同事之間開會、自組織的 agent 團隊。
**現階段這是幻想,而且會主動製造問題:**

- 多層代理會**放大錯誤率**（每層都可能誤解上一層）
- **責任變模糊** —— A 交辦給 B、B 做錯了,誰負責?
- 大量機制,換到的價值通常「一個好同事＋好工具」就能達成
- 廠商的 runtime 內部**本來就有 multi-agent**,我們再疊一層是重工

**真實的需求 vs 幻想:**

| 真實需求 | 幻想 |
|---|---|
| 一個同事需要另一個的專業（法務審約時要財務看金額條款） | AI 主管管 AI 下屬 |
| 工作要**升級**給人或轉給別的同事（escalation） | 同事之間開會 |
| 所有同事共享**組織知識**（政策、術語、誰是誰） | 自組織的 agent 團隊 |
| **skill 不要重複建設**（10 個同事不該有 10 份「怎麼寄信」） | 完整的 AI 組織圖 |

### B. 核心原則:協作是橫向的,責任是縱向到人的

人類組織有層級,是因為**溝通頻寬有限**。AI 沒有頻寬問題,
但**更需要問責歸屬**。所以:

> **同事的「組織」不是為了分工效率,是為了問責。**

```text
       人類 Owner / Mentor              人類 Owner / Mentor
              │ 負責                            │ 負責
        ┌─────┴─────┐                    ┌─────┴─────┐
        │  同事 A   │ ←── 協作(橫向) ──→ │  同事 B   │
        │ 自主等級  │                    │ 自主等級  │
        └───────────┘                    └───────────┘
```

**不是** AI 主管 → AI 下屬。

**推論（很重要）:A 找 B 幫忙,責任仍在 A 的 owner 身上。**
**責任不能委託給另一個同事** —— 不可以出現「A 說是 B 做的」這種推卸。
每條責任鏈最終都必須落到**一個人**身上。

**這也讓「組織層級」有了正確答案:**
我們需要的不是 AI 的階層,而是已經設計好的 **自主等級 ＋ 人類 owner**。
同一個同事在不同技能上可以有不同等級 —— 這比組織圖更精確,也更好治理。

### C. 互動機制:刻意保持「人看得懂」

同事之間怎麼互動,有四種選擇:

| 方式 | 效率 | 可觀察性 | 評價 |
|---|---|---|---|
| 透過各自的人 | 最低 | 最高 | 太慢,失去意義 |
| **透過 channel（A 寄信／訊息給 B）** | 中 | **高** | ✅ **建議起點** |
| **透過共享工作區（A 在看板開卡給 B）** | 中 | **高（有狀態）** | ✅ **建議起點** |
| 直接 A2A protocol | 最高 | 低（黑箱） | 治理會反對,之後再說 |

**建議:同事之間的協作,刻意保持與人類協作相同的形式。**
理由不是技術限制,是**治理選擇** —— 讓 agent 之間的協作**跟人之間一樣可觀察**。
軌跡天然存在,而且人看得懂。等到真的證明太慢,再考慮 A2A。

### D. 擴展性:兩種,常被搞混

**① 同事數量的擴展（1 → 100 位）**
關鍵原則:**同事是 data,不是 service**（Phase 2/3 已定調）——
新增一位同事應該是「加一筆設定」,不是「部署一個服務」。

**② 能力的擴展（一位同事會的事變多）—— 更常被忽略**
如果每位同事的 skill 各寫各的,N 位同事 = **N 倍維護成本**。正確做法:

```text
組織 Skill Library（共享、版本化）
   ├─ 合約條款檢查      ├─ 寄信與回覆
   ├─ 風險標示           └─ 會議摘要
        ↓ 組合
一位同事 = Persona ＋ 選用的 Skills ＋ 權限範圍 ＋ 自主等級
```

**這直接接回差異化:組織的 skill library 是會累積的資產,是護城河。**
Skill 是**組織資產**,不是某位同事的私有財。

### E. 組織世界觀:共享層 vs 個人記憶

「組織世界觀」= 所有同事對這個組織的**共同認知**:公司做什麼、術語、
產品名、誰是誰、政策紅線、流程（合約要誰簽、什麼走什麼流程）。

**這必須是共享層,不能是每位同事各自的記憶。** 否則:
- 政策更新要改 N 位同事
- 同事之間對同一件事**認知不同** → 災難（尤其法務／合規）

```text
組織世界觀（共享,單一來源）        個人記憶（每位同事自己的）
├─ 公司／產品／術語                 ├─ 我處理過的案子
├─ 組織圖:誰負責什麼                ├─ 我的 mentor 教過我什麼
├─ 政策與紅線                       ├─ 這位使用者的偏好
└─ 標準流程                         └─ 我在這個技能上的表現紀錄
```

跟人類組織一樣:**公司手冊是共享的,個人經驗是自己的。**

### F. 對架構的意義,以及什麼時候才做

| 要素 | 架構後果 | 何時做 |
|---|---|---|
| 共享組織世界觀 | 需要**組織知識的單一來源**,所有同事讀同一份 | **第二位同事出現時就要有**,否則之後很難收拾 |
| Skill library | Skill 與同事**解耦**,可版本化、可複用 | 第二位同事出現時 |
| 協作走 channel／共享工作區 | 不需要新機制,用既有的 | 第一個真實的跨同事需求出現時 |
| 責任鏈到人 | 每位同事**必須有指定的人類 owner** | **第一天** |
| A2A protocol | 需要 identity／permission／audit 的對等機制 | **先不要做** —— 等 channel 方式證明太慢 |

⚠️ **最容易犯的錯:第一位同事還沒證明價值,就先建「多同事協作平台」。**
順序應該是:**一位同事跑通 → 第二位出現時建共享層 → 真的需要協作時才建協作。**

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
