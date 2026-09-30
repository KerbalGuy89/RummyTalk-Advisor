# Rummy Talk Scorekeeper

Single-file, offline HTML scorekeeper for two-player Hollywood (3-column) gin rummy as described on
https://rummytalk.com. Users are non-technical. They use the GitHub Pages site
(https://kerbalguy89.github.io/RummyTalk-Advisor/, served from `main`, repo root) or an emailed zip.

Public repo: never commit personal info, family details, local paths or secrets. Commit with the
GitHub noreply email (set in this repo's local git config).

## Commands
- `npm test`: scoring engine tests. Run before every commit.
- `npm run build`: writes `dist/Gin Scorekeeper - User Guide.docx` and `dist/Gin Scorekeeper.zip` for emailing.

## Files
- `index.html`: the whole app. `<script id="engine">` holds the pure scoring engine (`GinEngine`);
  the second script is the UI. No dependencies, no build step.
- `manifest.webmanifest`, `icon-192.png`, `icon-512.png`: home-screen install for the web version.
- `tools/engine.test.js`: loads the engine block straight from index.html and tests it.
- `tools/build.js`: the guide content plus the zip. The zipped app is `Gin Scorekeeper.html` minus the
  web-only manifest/icon links. Guide wording must match button labels and messages in index.html.
- `.nojekyll`: Pages serves files as-is. `dist/` is gitignored.

## Scoring model (GinEngine in index.html)
- Hand: knock = opp deadwood − knocker deadwood; gin = opp deadwood + 25; undercut (opp ≤ knocker,
  ties included) = difference + 25 to the defender. `checkHand` rejects impossible hands
  (knocker deadwood over 10 usually means the numbers were swapped; deadwood over 98).
- Boxes: 1 per hand won (setting `handBox`) + bonus boxes (gin 2, undercut 1).
- Knock card ♠ (optionally ♥) doubles the hand's points and boxes.
- Games: each win enters every open game the winner has already entered plus the next open game
  they haven't. A game closes when a player reaches the target (250).
- Game value = winner score + 250 game bonus + score diff + box diff × 25; ×2 shutout; game 3 ×2.
- Net rounds to nearest 500 (configurable); money = points × cents/point ÷ 100.
- Hands are stored raw and replayed, so changing a setting re-scores the game in progress.

## State
- `localStorage` key `rummytalk-score-v1`: `{ players, settings, hands, ledger }`.
  Ledger entry: `{ endedAt, players, hands, points, dollars }` (signed; positive = player 1 won).
- Saves from older versions (extra fields) still load. Import validates every hand with `checkHand`.

## Sharing gotchas
- Opening the html from inside a zip on Windows runs it from a Temp folder, so scores are lost. The app
  detects `.zip/` or `AppData/Local/Temp/` in the file URL and shows a red warning. It also warns when
  localStorage is blocked.
- The web link and the zipped file keep separate scores (different origins). The guide says pick one.
- On iOS the home-screen app has its own storage, separate from Safari, so the guide says to add it
  to the home screen before entering names.
- First launch (no saved state) opens Settings with a welcome line. Scoring rules sit in a collapsed
  `<details>`, so new users only see names and stakes.
