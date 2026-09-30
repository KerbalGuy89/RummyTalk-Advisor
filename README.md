# Gin Scorekeeper

A scorekeeper for two-player Hollywood gin rummy, following the [RummyTalk](https://rummytalk.com) rules.
Enter each hand and it fills in all three games, counts boxes, applies spade doubles and works out who owes whom.

**Use it:** https://kerbalguy89.github.io/RummyTalk-Advisor/

It works on phones, tablets and computers, with no account, tracking or server. Scores stay in your own browser.
On a phone, open the link and choose "Add to Home Screen".

## For maintainers

The app is the single file `index.html`. With Node installed:

- `npm test` checks the scoring engine.
- `npm run build` makes the user guide and the zip for emailing, in `dist/`.
