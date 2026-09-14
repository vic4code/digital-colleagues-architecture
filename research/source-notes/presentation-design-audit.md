# 研究站重設：敘事與視覺

## 互動頁人物修正（2026-09-11）

互動頁改用 unDraw「Shared Workspace」插畫，保留原始 `800 / 258.032` 比例。移除原本 160% 放大、負位移裁切、頭部與手臂分別旋轉及覆蓋身體的浮動狀態條。人物完整呈現，動態改在情境對話與狀態變化；減少動態偏好會停用過場。來源與改色紀錄見 `assets/colleague-workspace-provenance.txt`。

已檢查 1440、1024、390px 下的比例、五種情境、播放／顯示完整對話及 reduced motion；見 [互動頁驗證](interaction-portrait-validation.json)。

## 目前版本：封面構圖、字型與術語修訂（2026-09-11）

- 首頁改為更小的標題、較窄的內容寬度與單一工作場景，移除中央分隔、斜紋及巨幅人物。首頁插畫改編自 Katerina Limpitsouni 的 unDraw「Sharing Ideas」，來源與改色紀錄保存在 `assets/team-sharing-provenance.txt`；下方較早的原創人物記錄只適用於仍使用該素材的其他情境頁。
- 73 份含文字的研究 SVG 明確設定與頁面相同的 sans-serif font stack。獨立 SVG 不再依賴 HTML 的字型繼承。產生閱讀頁時會再次正規化字型。
- 首頁先區分持續運作、monitoring 與 spontaneous retrieval，再使用 OpenClaw 的 Agent loop、Heartbeat、Cron、Webhooks。Hermes 與 Grok 重建的名稱分開呈現，完整對照見 [Framework terminology](framework-terminology.md)。
- 研究詞彙遵守英文原詞在前、中文說明在後；人的認知研究詞彙與框架原詞不互相冒用。

## 前一版本：Cream 全站改版（2026-09-11）

使用者提供 TypeUI Cream 截圖後，主入口由簡報改為可捲動的圖像敘事。下面的早期設計紀錄保留作歷史，不代表目前畫面。

- 導覽順序：人的線索與意圖 → Agent 的運算機會與決策 → 同事配合 → 框架實作 → 完整研究書架。
- 主頁、六幕人物情境、五種互動實驗、機制圖譜、書架與 61 個全文閱讀頁使用同一套 Cream 導覽、字級、藍色重點與暖白表面。
- 人物是本專案原創的分層 SVG，使用 CSS 移動頭部、手臂與工作介面。首頁與互動實驗室可暫停人物動態；減少動態偏好會停用動畫。不是下載或複製 TypeUI 的人物原稿。
- 情境會依資料齊全、需要跟進、剛剛問過走不同路徑。等待不能演成完成；對話播放只改前端顯示。
- 實作正文由 Markdown 編譯為 HTML，並在機制頁提供離線 bundle。保留 34 篇研究與 27 篇關聯專案文件的完整內容、章節、表格、程式與引用。
- 舊十頁簡報保存在 `research-deck.html`，原始互動流程示意保存在 `mechanism-simulation.html`；不作為主要入口。

設計參考：[TypeUI](https://github.com/bergside/typeui)、[Cream 範例](https://typeui.sh/design-skills/cream)、[UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)、[frontend-slides](https://github.com/zarazhangrui/frontend-slides)、[ppt-master](https://github.com/hugohe3/ppt-master)。這些是版面、插畫與呈現方式的參考，不是 Agent 行為的研究證據。未匯出 PPTX，也未使用 OpenSlides runtime。

前端檢查見 [Cream 驗證紀錄](cream-site-validation.json)：桌面／手機七個主要頁型、39 個機制、七個框架正文、五種互動情境及搜尋。驗證不等同上游框架實測。此輪新增首頁主張沿用 [人的主動研究](human-to-agent.md) 與 [觸發比較](proactive-trigger-mechanisms.md) 的來源；沒有把 UI 模擬當成新研究發現。

## 早期迭代紀錄

日期：2026-09-11。使用 design-taste-frontend skill；使用者明確要求 overhaul，並指出資訊多而散。

## Design read

給主管的編輯式 HTML 簡報；一頁一個論點，以示意圖和同一個工作案例串起兩條研究主線。不是 dashboard，也不聲稱使用 OpenSlides 套件。

Dials：variance 6 / motion 3 / density 2。原頁約 3 / 1 / 6；主要改善資訊密度、敘事與字級，不增加裝飾。

## Before

- 保留：兩條主線、暖橘／中性色、全部研究文字與來源、原互動情境、鍵盤可用與舊網址。
- 問題：長段落和方框同權；入口仍像文件索引；示範、實作限制和原始碼同時出現；閱讀路徑容易分岔。
- 既有頁面：index.html → 主動研究、互動情境 → Markdown／source-notes。無需刪除來源或重命名公開路徑。

## After

8 頁固定敘事：兩個問題 → 觸發 → 觀察後的動作 → framework 品質 → 互動感 → 合作情境 → 共用脈絡 → 最小落地。

- 簡報主頁取代索引式入口；原深入研究仍從「查看依據」與最後一頁進入。
- 顯示當前章節、頁碼、上下頁；支援方向鍵、Home／End、全螢幕與 URL 深連結。
- 示意情境是研究圖解，明確標示；不仿造產品截圖，不使用無關照片來裝飾。
- 原生 CSS／JavaScript，無額外套件或遠端字型。簡報為單一淺色主題；暖橘只標示 agent 判斷與當前項目。
- 每頁敘事各有構圖：開場雙題、流程圖、時鐘與結果、對照表、章節轉場、對話、共用資料、收束。
- 動效只用短淡入／位移；reduced-motion 時取消。手機用自然高度，桌機一頁一屏；列印展示全部頁面。

## 證據範圍

這次只重排與重設已完成研究，沒有重新宣稱所有 framework 最新狀態。來源／重建限制留在依據面板和完整研究。視覺設計不增加「自我意識」等能力主張。


## 2026-09-11 · Hierarchy / Before–After integration

新增 proactivity.html 統一閱讀層級：Human cognition → Mechanisms → Before / After → Scenarios → Verification。首頁與共用導覽改指研究地圖；同事的一天保留於延伸情境。

技術架構由 mingrammer/diagrams 0.25.1 產生 10 張 SVG / PNG，支援版本切換、五個層級視圖、可點擊元件與原碼摘錄。Before 固定於 prototype commit bb7101c3cfca；After 僅將配置、業務跟進與驗收標為 proposed。研究頁提供四個國泰內部協作假設與 local fixture demo；未執行實際 runtime／provider 投遞。

Framework 頁新增 Flow / Sequence 與 pinned source 並排，清楚限制 excerpt coverage。完整 Markdown 正文仍內嵌於網站。字體與配色沿用 Cream；diagram-design 原則採專案樣式，不覆寫全域 skill。


## 2026-09-11 · Workday illustration repair

使用者指出「同事的一天」仍有不自然的人體。查到此頁仍內嵌舊人物，頭、前臂與後臂以不同 transform-origin 旋轉，名牌以 absolute positioning 覆蓋腳部。

改用已採用於互動頁的 unDraw Shared Workspace 完整插畫（provenance 在 assets 目錄），保留原始 800 / 258.032 比例。移除舊肢體 keyframes；情境資訊、完整插畫、回覆／成果與名牌各自走 normal flow。回合切換只對回饋卡片做短暫淡入。保留六幕、三條情境分支、播放、來源對話框与 reduced-motion 操作。
