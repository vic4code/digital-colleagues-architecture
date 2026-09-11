# Prioritization / 下一件事為什麼先做？

Updated 2026-09-10. [Visual chapter](../show-me-proactive-lifecycle.html#prioritization).

## Four separate decisions

| Decision | Question | Evidence to inspect |
|---|---|---|
| Wake / 喚醒 | 何時開始一個回合？ | Timer、event、completion、init 後持續 loop |
| Generate / 產生候選 | 有哪些事情可做？ | 職責、環境、未完成承諾、模型提案 |
| Prioritize / 選擇 | 為什麼 A 比 B 先做？ | 硬規則、prompt、分數、排序或抽樣機率 |
| Learn / 更新 | 成敗如何改變下次選擇？ | Context 更新、成功率統計、學習中的模型參數 |

這四項是比較維度，不是強制 pipeline。直接輸出一個任務的 LLM 可以隱式取捨，無須先建立候選池。Init 後反覆觀察與選任務，本身不足以證明更強的優先排序。

## Voyager: rules plus implicit model judgment

Pinned implementation: `55e45a880755d0c8c66ca7fb5fe7962ac8974f89`.

- **硬規則先行**：起始任務固定取得木頭；背包使用至少 33 格時，進入收納／箱子分支。
- **一般路徑**：把環境、背包、完成與失敗紀錄放進 context，要求 LLM 直接輸出下一個 Task。
- **取捨依據**：新穎、難度可行、資源與前置需求、避免無意義重複；prompt 沒有定義這些條件間的數值權重。
- **更新方式**：成敗紀錄影響後續 context；成功程式可存入 skill library。這不等於訓練一個 priority predictor。
- **查核邊界**：所檢查的選任務路徑沒有明確候選池、逐項打分、排序佇列或 information-gain optimizer。不能由這個局部結論推論所有擴充都沒有排序能力。

Sources: [curriculum prompt](https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/prompts/curriculum.txt), [curriculum implementation](https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/agents/curriculum.py), [prior execution-loop audit](voyager.md).

## What the existing framework evidence supports

| Reviewed mechanism | Selection mechanism | What the evidence does not establish |
|---|---|---|
| Voyager curriculum | 硬規則 + LLM 依 context 選一個探索任務 | 明確數值排序或學習中的優先預測器 |
| Claude Code bare /loop | 官方維護指引的先後順序：未完成工作、目前 PR，再找 bug／簡化；模型具體選工作 | 全域多目標效用最佳化 |
| OpenClaw Heartbeat | 在設定職責中判斷是否處理／通知 | Heartbeat 本身就有跨責任候選池與業務排序 |
| Hermes /loop, /goal; Codex /goal | 重複指令或判斷既定目標是否需要接續 | Continue / wait / stop 等同多目標 ranking |
| OpenBot routines / handoff | 消費排程／派工工作，模型可選協作 Bot | Queue、lease 或路由順序等同任務價值排序 |
| Grok reconstruction | RunScheduler 讓 queued user tasks 優先於 agent/background tasks；回合內依 initiative 指引提議 | 執行通道順序不等同業務效用排序；重建不代表原產品完整 policy |

This table summarizes the bounded existing audits, not a fresh full-framework audit. Sources: [task-selection comparison](../show-me-proactive-lifecycle.html#autonomous-task-selection), [initiative evidence](initiative-outreach.md), [OpenBot audit](openbot.md), [Grok audit](grok-reconstructed.md). Absence of evidence here is not a claim that an entire framework has no scheduler priorities.

## Intrinsic motivation with a measurable signal

These are research mechanisms, not deployed features of our architecture. Primary paper descriptions were checked on 2026-09-10; experiments were not reproduced.

| Research | Signal and selection | Boundary |
|---|---|---|
| [ICM — Pathak et al., 2017](https://arxiv.org/abs/1705.05363) | 行動結果在 learned feature space 中的預測誤差形成 intrinsic reward，驅動 RL 探索 | 這是探索獎勵，不是工作佇列的 priority score；誤差也不等同 information gain |
| [CURIOUS — Colas et al., ICML 2019](https://arxiv.org/abs/1810.06284) | 以 absolute learning progress 偏向選擇值得練習的目標；能力退步時也能重新關注 | 不是只挑成功率最高或正向進步最快；需要能力／學習歷程訊號 |
| [MAGELLAN — Gaven et al., ICML 2025](https://arxiv.org/abs/2502.07709v3) | Online RL 中學習預測 competence 與 learning progress，利用目標語意關係泛化，調整 goal prioritization | 有訓練中的能力預測；不同於僅把歷史放回固定 LLM 的 prompt |

Learning progress 示意（不是論文精確估計式）：比較前後兩個觀察窗口的成功率。A：90%→90%，B：20%→60%，C：0%→0%，D：80%→40%。B 有進步，D 有退步；absolute LP 會讓兩者都值得注意。單次失敗、樣本數不同或題目變簡單，都可能讓粗略成功率差失真。

「內在」指訊號由 agent 的預測／學習過程產生；選擇這種獎勵與訓練目標仍是設計決策。這些研究沒有證明主觀慾望，也不保證學習價值等於業務價值。

## Proposed workplace prioritization

**Proposal / 尚未實作。** Request Triage & Priority 負責比較候選工作，Colleague State 保存決策與結果，Runtime Controller 執行。探索任務使用獨立預算，避免新穎性壓過已承諾工作。

1. **Eligibility**：先排除已完成、重複、缺授權、缺前置成果、尚在等待的工作；缺條件的項目保存為 blocked/waiting。
2. **Candidates**：收集既有承諾、來源事件與職責內提案，附 work ID、來源、deadline、影響、依賴、成本估計、最近處理時間。
3. **Ordering**：先套明訂責任／SLA 等級；同級先比較到期時間，再用等待時間避免長期飢餓，以穩定 work ID 打破平手。LLM 可提供分類與理由，但分類須可追溯、可修正。這是示範 policy，不是已採用決策。
4. **Selection record**：保存本次候選、選中項、延後／排除原因、policy 版本。完成、來源改變或期限接近時重新評估；重新排序不代表可直接中斷正在執行的動作。
5. **Feedback**：驗證成果、接受／退回、漏件、延遲與成本。先修正規則；只有取得足夠可靠資料後，才評估學習式排序。

示例：今天到期的客戶回覆草稿先做；月報缺上游檔案先列 waiting；沒有期限的改善研究進探索預算。只有一個可執行候選時，直接選它，無需製造候選或複雜分數。

## Verification before claiming prioritization

- 提供兩個可執行候選，記錄為何先做其中一個；改 deadline 後確認選擇依 policy 改變。
- 高重要性但缺依賴的任務不占住 executor；新成果到達後恢復 eligibility。
- 在持續新事件下檢查低等級工作的最長等待時間；必要時設定升級規則。
- 證明成敗回饋改變的是 context、統計、規則或參數中的哪一項；不要把寫入 memory 一概稱作學會排序。
- 比較 FIFO、固定規則、LLM 選擇與學習式選擇的漏件率、準時率、人工接受率及成本；本研究尚未執行此比較。
