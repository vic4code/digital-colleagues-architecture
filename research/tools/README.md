# Research frontend build

Research pages are static and use local assets. Markdown remains the source of the full reading pages.

```sh
python3 -m venv /tmp/research-render-venv
/tmp/research-render-venv/bin/pip install Markdown==3.8.2
/tmp/research-render-venv/bin/python research/tools/build_reading.py
python3 -m http.server 8766 --bind 127.0.0.1
```

Open `http://127.0.0.1:8766/research/index.html`.

- `site_shell.py` owns shared navigation used by the reading generator. Top-level HTML contains static copies of this navigation so no runtime framework or fetch is needed.
- `build_reading.py` generates full article pages, the library search index, and the offline implementation document bundle.
- `../cream-site.css` owns shared visual tokens and navigation. Page-specific Cream styles handle the home, library, explorer and interaction lab.
- `../assets/team-sharing.svg` and `../assets/colleague-workspace.svg` are adapted unDraw illustrations (provenance beside the assets). The workday also uses the complete Shared Workspace artwork. The original `colleague-character.svg` is retained as a legacy asset.
- `../research-deck.html` preserves the earlier slide format. `../mechanism-simulation.html` preserves its embedded diagram source. The primary journey is the new homepage.

Validation reports describe frontend checks only. They do not establish upstream framework behavior, message delivery, or backend conformance.

## Hierarchical research and Before / After

`../proactivity.html` owns the six-level reading route. `proactivity-data.js` separates existing, external and proposed components. `implementation-excerpts.js` contains pinned, read-only source snapshots. No runtime request or provider message is sent by its local scenario demo.

Rebuild architecture SVG / PNG with Python 3, Graphviz (`dot` on PATH), and `diagrams==0.25.1`:

```sh
python3 -m venv /tmp/proactive-diagrams-venv
/tmp/proactive-diagrams-venv/bin/pip install diagrams==0.25.1
mkdir -p research/architecture-diagrams
cd research/architecture-diagrams
/tmp/proactive-diagrams-venv/bin/python ../tools/build_architecture.py
```

The generator also rebuilds `architecture-diagrams.js` for offline inline SVG interaction. Re-run `build_reading.py` afterwards to update content-versioned asset links. Architecture source and SVG / PNG downloads are linked from the interactive page.

`build_source_snapshots.py` reads Git blobs at prototype commit `bb7101c3cfca32ea2982268de47958bea648df98`; it requires the sibling `prjt-digital-colleague-prototype` checkout containing that commit. It does not read credentials or modify that repository. The generated browser bundle works without access to the private repo.

Framework Flow / Sequence views share a pinned source pane via `mechanism-code.js`. Excerpt coverage is limited to the steps recorded in `source-notes/code-excerpt-index.json`; missing excerpts are explicitly labelled.
