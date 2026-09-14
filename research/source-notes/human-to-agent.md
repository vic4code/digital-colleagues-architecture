# 從人的主動行為到 Agent 實作

本節是研究簡報的起點：先說明人如何想起待辦，再提出工程上的功能對照。不是以 scheduler 模擬腦部構造。

## Prospective memory · 前瞻記憶：人如何想起一件事

Prospective memory（前瞻記憶）是記住稍後要執行的意圖。實驗支持：人可能採取 monitoring（刻意監測線索），也可能在適當線索出現時發生 spontaneous retrieval（自發提取意圖）；兩者的依賴程度隨任務條件而不同。因此，「想到要問 Alex 進度」不必先假定有一個定期掃描所有待辦的心智程序。

來源：[Einstein et al. (2005), Multiple processes in prospective memory retrieval](https://pubmed.ncbi.nlm.nih.gov/16131267/)，五個實驗，區分監測與自發提取。

Self-generated thought（內在生成的思考）還包含回憶、未來模擬與社會情境思考。相關綜述描述 default network 與其他系統的動態配合；不能簡化為一個固定的「靈感模組」，也不能將每次內在聯想都視為有目的的跟進承諾。

來源：[Andrews-Hanna et al. (2014), The default network and self-generated thought](https://pmc.ncbi.nlm.nih.gov/articles/PMC4039623/)，綜述。

## Loop 與 trigger 分別回答什麼

把人理解為持續運作的系統，是工程比喻。它說明感知、注意、記憶與內在思考可以持續交互影響；不代表已證明有一個固定頻率、輪流掃描全部待辦的 `while` 程式。上列認知研究分別支持 monitoring、spontaneous retrieval 與 self-generated thought。

在軟體描述中，要分開問：「執行如何接續？」與「這次因為什麼輸入而開始處理？」OpenClaw **Agent loop** 描述每個 session 的序列化執行流程；**Heartbeat** 描述週期檢查；**Webhooks** 描述由外部 HTTP 請求觸發工作。它們是不同範圍的原生用語，不能把 Agent loop 直接解讀為永不停歇的背景思考。

來源：[OpenClaw Agent loop](https://docs.openclaw.ai/concepts/agent-loop)、[Heartbeat](https://docs.openclaw.ai/gateway/heartbeat)、[Webhooks](https://docs.openclaw.ai/automation/webhook)。跨框架的用詞依 [術語來源表](framework-terminology.md) 分開對照。

## 如何轉成工程設計

以下是設計抽象，並非以上研究直接驗證的軟體架構：

| 行為問題 | Agent 可實作的零件 |
| --- | --- |
| 何時重新注意這件事？ | 排程、外部事件、內部完成事件，或現有迴圈接續 |
| 記得原本要做什麼？ | 意圖、任務狀態、對話與工作記憶 |
| 現在值得做嗎？ | 最新觀察、角色範圍、規則與模型判斷 |
| 該開口還是等待？ | 投遞工具、對象、節制與重複抑制 |
| 下次如何接上？ | 結果證據、等待條件、下一次檢查時間 |

「時間持續流動」是物理描述，不能推出「所有念頭都由 timer 啟動」。time/event 是有用的工程啟動分類；執行中的 agent 可直接在迴圈內推進，不必每步等待新事件。

## 前端呈現

- [研究簡報](../index.html#human)：人物情境與人／Agent 功能對照。
- [完整機制圖譜](../mechanisms.html)：39 個已整理的機制或證據邊界，涵蓋七個框架；情境、步驟、分支、流程、時序與來源。
- [同事互動](../show-me-colleague-interaction.html)：接手、修正、群組、交接與日常互動。

圖譜資料整理自現有機制清單、流程索引、時序索引與 coding agent 研究資料；它是靜態路徑追查的瀏覽介面，不是執行紀錄或產品功能完整性保證。
