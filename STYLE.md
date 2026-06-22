# Style guide

How to write and draw consistently across this repo.

## Diagrams

**Format:** SVG only. PNGs and PDFs are not allowed as source — they don't diff
and they're not editable. If a tool exports only PNG, find another tool.

**Layout pattern (use the same skeleton across phases so diagrams compare cleanly):**

- Tier 1 (top): users, frontends, channels
- Tier 2: orchestrator / API gateway
- Tier 3: agent runtime
- Tier 4 (side): persistent state (DB, S3, files)

Vertical flow for the main path, horizontal grouping for siblings, side panel for
shared resources.

**Color system — 2 ramps max:**

- Neutral grays for infrastructure / non-business components
- Warm orange (`#fff7ed` fill, `#fdba74` border, `#c2410c` accent) for agents/digital colleagues
- That's it. No third color unless it encodes meaning (and then add a legend)

**Typography:**

- 13px / weight 500 — labels
- 11px / weight 400 — subtitles
- 10px monospace — ports, identifiers, code

**Edges:**

- Solid 1.2px gray — synchronous calls
- Dashed 1.2px gray — async / file-based / out-of-band
- Solid 1.3px orange — agent ↔ tool interactions
- Always use arrow markers; never an unlabeled line

**File naming:** kebab-case, descriptive, no version suffix.
`current.svg` not `current-v2.svg`. Git is the version history.

## Writing

**Phase READMEs** answer four questions in this order:
1. Goal — what is this phase trying to achieve?
2. Architecture — what does it look like? (link to SVG)
3. Trade-offs — what did we accept / reject?
4. Migration — how do we get here from the previous phase?

**ADRs** follow the format in `decisions/ADR-000-template.md`.
Keep them under 1 page. Decision + context + alternatives considered + consequences.

**Voice:** opinionated and direct. Future-you will thank present-you for stating
positions clearly rather than hedging. "We chose X because Y, and we accept Z" is
better than "X was selected after consideration of various factors."
