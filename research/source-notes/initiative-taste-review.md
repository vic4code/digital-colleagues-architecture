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
