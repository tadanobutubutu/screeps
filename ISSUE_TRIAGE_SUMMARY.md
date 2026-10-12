# Issue Triage Summary — fixed-in-code issues closed

Date: 2026-10-12
Branch: `cline/ma28gjvc`
Repo state checked: `main` @ `f17afcf`

## What was done

Closed **571 open issues** that were already fixed in code but had never been closed.
Every closure carries an evidence comment. Closed with `state_reason=completed`.

| Set | Count | Criterion (all verified against the working tree) |
|-----|------:|---------------------------------------------------|
| A | 437 | Issue title carries the maintainer-bot marker `— FIXED` (e.g. `Address accessibility issues from insight report — FIXED in main.js`). The tracked comment is gone from `main.js`. |
| B | 127 | The tracked task-marker block in the issue body marks **every** item as fixed (`✓ FIXED: ...`, `DONE: ...`). Marker gone from `main.js`. |
| C | 6 | Non-bot CI/lint issues re-verified as fixed in the current tree. |
| extra | 1 | `#256738` — missed by the first pass, found by the independent audit (ARIA role fix present at `main.js:289-291`). |

Kind C issues: `#253559`, `#253560`, `#253561`, `#253562`, `#253563` (syntax errors in
`daily-challenge.js`, `deploy.js`, `main.js`, `memory.visualizer.js`, `utils.emotions.js` — all
now pass `node --check`) and `#258130` (`globals@^17.13.0` added to `package.json`, consumed by
`eslint.config.js`).

## How candidates were found

* `automaintainer-bot` files one issue per task-marker comment; the issue body embeds
  `<!-- task-marker hash: H -->` where `H = sha1("<file>:<marker text>")`. That hash was
  reproduced for every candidate (100% match) as an integrity check.
* The maintainer renames an issue title to `... — FIXED in <file>` once the marker is resolved.
  437 such issues were still open → fixed in code, not yet closed.
* Candidates were accepted only when the tracked marker is **absent** from the current tree
  (verified with `git grep -F` over all 563 A/B candidates by the independent audit).

## Deliberately left OPEN (not fixed in code)

* Issues whose task-marker is only incidental, e.g. `This is the existing code that needs to be
  preserved` (107 issues) — the subject is code preservation, not a fix.
* Issues that only matched a *stemmed* search for `fix` (e.g. `#84542 Add/fix 2 landmark issues
  ...`) — no completion marker, and the named handlers (`validateLandmarkStructure`,
  `validateLandmarkAttributes`) do not exist in the current tree.
* Non-bot issues still reproducible: `#258177`, `#258175`, `#258176`, `#258174` (parse errors
  still present), `#258147`, `#253564` (`test:coverage` script still missing from
  `package.json`), `#258146` (duplicate `id="main-content"` still in `Dashboard.tsx`),
  `#254685` (workflows still use mutable action tags), the accessibility `REACT_*` issues
  (`docs/dependency-graph.html` still has no `lang`, still has `<a href="#">`, table has no
  `caption`/`th[scope]`, `Dashboard.tsx` still renders 3 `<main>`), the AI-role requests,
  the periodic scan reports and `#5` (Renovate dependency dashboard).

## Note / caveat

An early commit of this branch tracked the agent scratch directory `.issuework/` (raw issue
dumps). The repository's own scanner picked those files up and auto-created ~132 issues whose titles are the scanner phrase plus the scratch file path. Those are artefacts, not defects: they are **not** closed here.
The scratch directory is no longer tracked (see commit `ac919d9`), so no further such issues
should be generated.
