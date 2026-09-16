# 數位同事主動性 · 分享簡報

13 頁主線＋2 頁附錄，約 15–18 分鐘。固定 1920 × 1080 畫布；內容查核截至 2026-09-15。

- [開啟簡報](index.html)：可離線播放。
- [PDF](digital-colleague-initiative.pdf)：15 頁，分享與播放備援。
- [講者備註](speaker-notes.html)：逐頁講稿、轉場與來源。
- [研究正文](../index.html)：完整互動圖與調研細節。

操作：方向鍵／Page Up、Page Down 換頁；Space 下一頁；Home、End 跳到主線首末頁；A 切換附錄；F 全螢幕；O 投影片總覽；N 開啟當頁講稿。網址的 `#7` 可直接開啟第 7 頁。

## 講解順序

生活例子 → 六框架機制表（Time／Event 標籤）→ Trigger 歸納 → 三個 Phase → 原架構四頁連續對照 → CAB 治理審閱流程 → 主動性觀測點 → 觸發與恢復驗收 → 三點結論。

架構四頁保持原圖座標：Before → Time entry → Event entry（替代入口）→ 共用 Task discovery。轉場保留位置，支援 reduced motion。每頁關鍵內容直接顯示，PDF 不依賴 hover 或動畫。架構保留 Tools／外部服務層。附錄收錄介面查核表與完整架構；歷史 commitments 只保留表下註記。

CAB-042／CAB-043 是虛構案例；提供的 CAB 原圖暫存路徑失效，目前流程為待確認示意。架構新增能力與驗收實驗是設計提案，並非已驗證的國泰部署成效。

## 編輯與視覺來源

`deck.json` 是內容與講稿來源。執行 `python3 research/slides/build_deck.py` 產生簡報 HTML 與兩種講稿。`presentation.css` 管理視覺，`viewport-base.css` 管理固定畫布，`slides.js` 管理播放。變更後需以 Chrome 重新檢查各頁並輸出 PDF 與 `assets/previews/` 縮圖。

採用 Presentations skill 的單頁論點與圖像層級、[Frontend Slides](https://github.com/zarazhangrui/frontend-slides) 的固定畫布原則，以及 [Taste Skill](https://github.com/leonxlnx/taste-skill/tree/ccbc15639c97057cbfcf32ecebc38ef716e4bb37/skills/taste-skill) 的排版與 redesign review。保留研究頁奶油白／藍色識別；深色集中於封面、核心主張、結尾。生活照片為生成示意；CAB 流程以可編輯 SVG 圖示與 HTML 繪製。Frontend Slides 授權見 `LICENSE.frontend-slides`。
