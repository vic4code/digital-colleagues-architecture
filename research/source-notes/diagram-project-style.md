# Diagram style · 專案圖表設定

本研究使用 [mingrammer/diagrams](https://github.com/mingrammer/diagrams) 0.25.1 與 Graphviz 產生可重建的技術架構 SVG / PNG。採用 generic nodes，沒有以雲端圖示暗示未部署的服務。

[diagram-design](https://github.com/cathrynlavery/diagram-design) 的層級、語意角色、有限焦點、邊界與標籤原則用於圖面設計；技術圖的生成工具仍為 diagrams。依使用者已選定的 Cream 風格覆寫預設橘色與 serif 字體：

- Background: `#fdfcf9`，Ink: `#202823`，Existing: `#eef4f1`，Proposed: `#e5f1fd`。
- Accent: `#076fc9`，Existing edge: solid，Proposed edge: dashed。
- Typography: Graphviz 排版使用 Helvetica；網頁統一 system sans-serif，英文技術名在前，中文說明放在互動面板。
- Interaction: SVG URL 指向元件鍵；網頁提供同等的文字按鈕與鍵盤操作。元件可展開、返回、切換 Before / After。
- Scope: System 頁為邏輯整合邊界；不是生產環境 deployment diagram。

這是專案設定，沒有覆寫全域 skill。現有研究圖仍保留原始證據與出處。
