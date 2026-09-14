# Initiative homepage: taste review

Design read: existing Cream research site for a technical/business audience; preserve the site shell and architecture assets, use diagrams and progressive disclosure. DESIGN_VARIANCE 3 / MOTION_INTENSITY 2 / VISUAL_DENSITY 4. Native HTML, CSS, SVG and JavaScript; no new framework.

## Audit and decisions

- Shared system: cream-site.css, system sans-serif, cream background #f6f3ee, blue #076fc9, thin neutral borders. Remove homepage-only green token overrides. Keep logo, header links, routes, focus states and legacy anchors.
- Problem: prose and tables dominate, and task continuation was presented as task discovery. Lead with observation × responsibility → proposed work. Put execution and continuation downstream.
- Preserve five-part top-down navigation. Use a paired reasoning diagram, trigger-to-discovery flow, original architecture with an overlay, interactive evidence fixture, and counterfactual verification diagram. Technical SVG assets carry meaning; no decorative photography is needed.
- Before/After: retain phases/0.5/reference-architecture.svg coordinates and components. Before is the documented architecture, not a statement of deployed feature completeness. After adds dashed annotations, not a new generic block diagram or new services. Existing framework controller and app-server boundaries stay visible.
- Reduce default-visible prose. Move framework/source limitations into expandable evidence. Keep proposed/fixture labels next to diagrams.
- Scope: homepage integration with the existing research visual system; do not silently redesign every research route.

## Validation

Chrome / Playwright: 320, 768, 1024 and 1440 px checked; no page overflow. Before/After toggle, original SVG hover, click-to-expand, proposed component selection, report/risk/quiet fixtures, responsibility toggle, keyboard focus/Enter and legacy anchors passed. No page errors. Visually reviewed desktop hero, original-architecture overlay, scenario fixture and mobile hero screenshots. Static links, SVG parsing and whitespace checks are recorded in initiative-home-validation.json.

Contextual pre-flight: light theme matches the research site; shared cream/blue typography and 8/12/16 px radii; original architecture colors preserve existing semantic ownership. No new external assets, framework, decorative icons, parallax, score bars or animation loop. Numbered chapters remain for the user-requested five-part research order. Table content is secondary disclosure, not the landing layout. Dark-theme styling is not introduced into this existing light-only research site. This is a browser rendering/interaction check, not a backend capability validation.


## Human-first visual revision · 2026-09-14

- 用生成的同事插畫、報表與會議物件、思考泡泡取代六個文字流程框。
- 敘事先從人注意到、聯想到、產生新工作，再映射 Agent；不是以 timer 定義人的認知。
- 保留 Cream 與 cobalt 配色；圖片等比顯示，技術文字預設收合。
- 有限播放可暫停；切換頁籤或離開畫面停止；reduced-motion 停用轉場。
- 移除架構數字徽章，元件選擇依原圖空間順序排列，hover 與點擊保留。
- Chrome 已驗證 file URL、320/768/1440 寬度、契機切換、三個時刻、播放暫停、架構展開，零 page errors。
