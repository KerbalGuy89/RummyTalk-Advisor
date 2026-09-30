# Technical stuff

Players don't need anything in this folder. The app is `Gin Scorekeeper.html` one level up, and the
web version is at https://kerbalguy89.github.io/RummyTalk-Advisor/.

With Node installed, run these from inside this folder:

- `npm install` once, to fetch the two libraries the build uses.
- `npm test` checks the scoring engine.
- `npm run build` rebuilds `Gin Scorekeeper - User Guide.docx` and `Gin Scorekeeper.zip` (the file to email) in the top-level folder.
- `npm run deploy` publishes the website to the `gh-pages` branch, which GitHub Pages serves.
