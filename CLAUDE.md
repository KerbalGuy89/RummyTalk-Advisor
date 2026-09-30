# Rummy Talk Scorekeeper

Single-file, offline HTML scorekeeper for two-player Hollywood (3-column) gin rummy as
described on https://rummytalk.com. Shared with non-technical players by emailed zip and, for phones,
the GitHub Pages site: https://kerbalguy89.github.io/RummyTalk-Advisor/

Public repo: never commit personal info, family details, local paths or secrets. Commit with the
GitHub noreply email (set in this repo's local git config).

## Files
- `index.html` — the whole app (HTML + CSS + JS, no dependencies, no build step). Open it in any browser.
- `docs/build-guide.js` — generates the user guide .docx (`npm run guide`). Keep its wording in sync with
  button labels and warning text in index.html.
- `package.ps1` — `npm run package` builds `dist/Gin Scorekeeper.zip` (app renamed to
  `Gin Scorekeeper.html` + guide) for emailing. Needs PowerShell 7; `dist/` is gitignored.

## Sharing gotchas
- Opening the html from inside a zip on Windows runs it from a Temp folder, so scores are lost. The app
  detects `.zip/` in the file URL and shows a red warning. It also warns when localStorage is blocked.
- Phones can't use the emailed file; they use the GitHub Pages link (served from `main`, repo root;
  `.nojekyll` so files are served as-is).
- First launch (no saved state) opens Settings so players name themselves.

## Scoring model (see `scoreHand`, `compute`, `colValue` in index.html)
- Hand: knock = opp deadwood − knocker deadwood; gin = opp deadwood + 25; undercut (opp ≤ knocker,
  ties included) = difference + 25 to the defender.
- Boxes: 1 per hand won (setting `handBox`) + bonus boxes (gin 2, undercut 1).
- Knock card ♠ (optionally ♥) doubles the hand's points and boxes.
- Columns: each win enters every open column the winner has already entered plus the next open
  column they haven't. Column closes when a player reaches the target (250).
- Column value = winner score + 250 game bonus + score diff + box diff × 25; ×2 shutout; game 3 ×2.
- Net rounds to nearest 500 (configurable); money = points × cents/point ÷ 100.
- All rules are settings; hands are stored raw and replayed, so changing a setting re-scores everything.

## State
- `localStorage` key `rummytalk-score-v1` (current game, settings, saved-game ledger).
- Export/Import JSON backup buttons in the ledger section.

## Testing
Open `index.html` and run `window.__selfTest()` in the console — asserts the scoring engine
against hand-worked examples from rummytalk.com.
