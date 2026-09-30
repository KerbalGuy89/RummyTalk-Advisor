// Builds "Gin Scorekeeper - User Guide.docx" into dist/. Run: npm run guide
// Keep the wording in sync with the button labels in index.html.
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, LevelFormat,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, Footer, PageNumber,
} = require('docx');

const GREEN = '1D5A43';
const SHADE = 'F1ECE0';
const MUTED = '5F6862';
const HTML_NAME = 'Gin Scorekeeper.html';
const WEB_LINK = 'https://kerbalguy89.github.io/RummyTalk-Advisor/';

// "**bold**" inline markup -> TextRuns
function runs(text, base = {}) {
  return text.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map(part =>
    part.startsWith('**') ? new TextRun({ ...base, text: part.slice(2, -2), bold: true }) : new TextRun({ ...base, text: part }));
}
const p = (text, opts = {}) => new Paragraph({ children: runs(text, opts.run), spacing: { after: 120 }, ...opts.para });
const h1 = text => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
const h2 = text => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });

let listInstance = 0;
const steps = items => {
  const inst = ++listInstance;
  return items.map(t => new Paragraph({ numbering: { reference: 'steps', level: 0, instance: inst }, children: runs(t), spacing: { after: 80 } }));
};
const bullets = items => items.map(t => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: runs(t), spacing: { after: 80 } }));

const callout = (label, text) => new Paragraph({
  children: [new TextRun({ text: label + '  ', bold: true, color: GREEN }), ...runs(text)],
  shading: { type: ShadingType.CLEAR, fill: SHADE, color: 'auto' },
  border: { left: { style: BorderStyle.SINGLE, size: 24, color: GREEN, space: 10 } },
  indent: { left: 240, right: 120 },
  spacing: { before: 160, after: 200 },
});

const TABLE_W = 9360;
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: 'D9D2C2' };
function table(headers, rows, widths) {
  const mk = (text, i, head) => new TableCell({
    width: { size: widths[i], type: WidthType.DXA },
    shading: head ? { type: ShadingType.CLEAR, fill: GREEN, color: 'auto' } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    borders: { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder },
    children: [new Paragraph({ children: runs(text, head ? { bold: true, color: 'FFFFFF' } : {}) })],
  });
  return new Table({
    width: { size: TABLE_W, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((t, i) => mk(t, i, true)) }),
      ...rows.map(r => new TableRow({ cantSplit: true, children: r.map((t, i) => mk(t, i, false)) })),
    ],
  });
}
const gap = () => new Paragraph({ spacing: { after: 120 }, children: [] });

const children = [
  // ---------- title ----------
  new Paragraph({ children: [new TextRun({ text: 'Gin Scorekeeper', bold: true, size: 52, color: GREEN })], spacing: { after: 60 } }),
  new Paragraph({ children: [new TextRun({ text: 'User Guide', size: 32, color: MUTED })], spacing: { after: 240 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: GREEN, space: 8 } } }),
  p('Gin Scorekeeper replaces the paper score sheet for two-player Hollywood gin rummy (RummyTalk rules). You enter each hand. It fills in all three games, counts boxes, applies spade doubles and works out who owes whom. It runs in a web browser. There is no account, no internet connection needed and nothing to install.'),
  p('**What\'s in the zip file**'),
  ...bullets([
    `**${HTML_NAME}** — the scorekeeper itself.`,
    '**Gin Scorekeeper - User Guide.docx** — this guide.',
  ]),
  callout('Quick start', `Extract the zip. Double-click ${HTML_NAME}. Type the two names and tap Save. Record every hand as you play.`),

  // ---------- 1 ----------
  h1('1. Set it up on a computer'),
  h2('Windows'),
  ...steps([
    'Save the zip file from the email to your computer. It usually goes to your **Downloads** folder.',
    'Right-click the zip file and choose **Extract All…**',
    'Click **Browse**, choose your **Documents** folder, then click **Extract**.',
    `Open the new **Gin Scorekeeper** folder and double-click **${HTML_NAME}**. It opens in your web browser. If Windows asks which app to use, choose **Microsoft Edge** or **Google Chrome**.`,
    'Press **Ctrl+D** to bookmark the page so it\'s easy to find next time.',
  ]),
  h2('Mac'),
  ...steps([
    'Save the zip file from the email. It goes to your **Downloads** folder.',
    'Double-click the zip file. A **Gin Scorekeeper** folder appears next to it.',
    'Drag that folder into **Documents**.',
    `Open the folder, right-click **${HTML_NAME}**, choose **Open With**, then **Google Chrome**. Chrome is recommended. Safari may work too.`,
    'Press **Command+D** to bookmark the page.',
  ]),
  callout('Important', 'Scores are saved inside your web browser, tied to that one file. Leave the file where you put it, always open it with the same browser, and never open it from inside the zip. If a red box appears at the top of the page, see section 11.'),

  // ---------- 2 ----------
  h1('2. Set it up on a phone or tablet'),
  p('Phones can\'t keep scores for a file opened from an email or zip. On a phone, use this web link instead:'),
  new Paragraph({ children: [new TextRun({ text: WEB_LINK, bold: true, color: GREEN, size: 26 })], spacing: { after: 160 }, indent: { left: 240 } }),
  h2('iPhone or iPad'),
  ...steps([
    'Open the link above in **Safari**.',
    'Tap the **Share** button (the square with an arrow pointing up).',
    'Tap **Add to Home Screen**, then **Add**.',
    'From now on, open it from the **Gin Score** icon on your home screen.',
  ]),
  h2('Android'),
  ...steps([
    'Open the link above in **Chrome**.',
    'Tap the **⋮** menu in the top-right corner.',
    'Tap **Add to Home screen** (on some phones it says **Install app**), then **Add**.',
    'From now on, open it from the new icon on your home screen.',
  ]),

  // ---------- 3 ----------
  h1('3. First launch: names and stakes'),
  ...steps([
    'The **Settings** window opens by itself the first time.',
    'Under **Players**, type the two players\' names.',
    'Under **Stakes**, set **Cents per point**. 1 means a penny a point.',
    'Leave the other rules alone unless your group plays differently (see section 9).',
    'Tap **Save**.',
  ]),
  p('You can change any of this later with the **Settings** button at the top of the screen.'),

  // ---------- 4 ----------
  h1('4. Record a hand'),
  p('Do this after every hand.'),
  ...steps([
    'Under **Record a hand**, tap the name of the player who knocked or went gin.',
    'Tap **Knock** or **Gin**.',
    'For a knock, type the knocker\'s count in **Knocker\'s deadwood**. For gin this box is hidden, so skip it.',
    'Type the other player\'s count in **Other player\'s deadwood**. For a knock, use their count after lay-offs.',
    'If the knock card was a spade, tap **♠**. The whole hand counts double. The other suits are optional and change nothing.',
    'Check the grey box. It shows who scores, how many points and boxes, and which games the score goes into.',
    'Tap **Record hand**.',
  ]),
  callout('Undercuts', 'You never enter an undercut yourself. Record the knock as usual. If the other player\'s deadwood is equal to or lower than the knocker\'s, the app gives them the undercut and the bonus automatically.'),
  p('On a computer you can press **Enter** to move from the first box to the second, and **Enter** again to record the hand.'),
  p('If **Record hand** is greyed out, the grey box tells you what is missing.'),

  // ---------- 5 ----------
  h1('5. Read the screen'),
  ...bullets([
    '**Game cards (top of the screen).** One card per game. Each shows both players\' points and boxes, a bar showing progress toward 250, and who is leading. A finished game turns grey and shows who won it and what it\'s worth. Game 3 is marked **×2** because it counts double.',
    '**Score sheet.** One row per hand, like the paper sheet. Each player has a column for each game (G1, G2, G3). The big number is the running total. The small +number underneath is what that hand added. A circled number is bonus boxes from a gin or undercut. **★** marks the hand that won a game. Striped cells belong to games that are already finished.',
    '**Settle up.** What each finished game is worth, with the math shown. While games are still being played, it shows who would owe what if everything ended right now. That part is only an estimate.',
    '**Ledger.** Every finished game you have saved, plus the overall balance, for example "Joe owes Bill $12.50 overall".',
  ]),

  // ---------- 6 ----------
  h1('6. Fix a mistake'),
  ...bullets([
    '**The last hand is wrong:** tap **Undo**, tap **OK**, then enter it again.',
    '**An earlier hand is wrong:** tap the **×** at the end of its row on the score sheet, then tap **OK**. Every score after it is recalculated. Then enter the hand again.',
    '**Wrong names or stakes:** tap **Settings**.',
  ]),
  p('A hand you enter again always goes to the bottom of the sheet. Because the order of wins decides which games a score goes into, fix mistakes as soon as you spot them.'),

  // ---------- 7 ----------
  h1('7. Finish a game and start the next'),
  ...steps([
    'The match ends when all three games have been won. A green **Game over** banner shows who owes whom.',
    'Settle up.',
    'Tap **Save to ledger & start next game**. The result is added to the **Ledger** and a fresh sheet starts.',
  ]),
  p('**Stopping partway through.** Closing the browser is safe. The game in progress is still there next time you open it.'),
  p('**New game** (top of the screen) throws away the game in progress after asking you first. It is not saved to the ledger.'),

  // ---------- 8 ----------
  h1('8. How the scoring works'),
  p('The app does all of this for you. It is here so everyone at the table can check the numbers.'),
  table(['Result', 'Points', 'Boxes'], [
    ['Knock', 'Other player\'s deadwood minus the knocker\'s', '1'],
    ['Gin', 'Other player\'s deadwood + 25', '1 + 2 bonus'],
    ['Undercut (a tie counts as one)', 'The difference + 25, to the other player', '1 + 1 bonus'],
    ['Knock card is a spade', 'Double the points for that hand', 'Doubled'],
  ], [2600, 4760, 2000]),
  gap(),
  ...bullets([
    '**Which games a win goes into.** A player\'s first win goes in Game 1, their second in Games 1 and 2, and every win after that in all three. Once a game is won it takes no more points.',
    '**Winning a game.** The first player to reach 250 in that game wins it.',
    '**What a game is worth.** The winner\'s score + 250 game bonus + the difference between the two scores + 25 for every box the winner is ahead. If the loser scored nothing in that game (a shutout), it is worth double. Game 3 is always worth double.',
    '**The payout.** Add the three games together (a game the other player won counts against you), round to the nearest 500, then multiply by the cents per point. Example: 5,005 rounds to 5,000, which at 1¢ a point is $50.00.',
    '**Knock limit.** The app does not check the knock limit set by the knock card. The players do that at the table.',
  ]),

  // ---------- 9 ----------
  h1('9. Change the rules'),
  p('Tap **Settings**. The defaults are the RummyTalk rules. **Reset to defaults** puts them back.'),
  table(['Setting', 'Default', 'What it does'], [
    ['Gin bonus (points)', '25', 'Points added for going gin'],
    ['Gin bonus boxes', '2', 'Extra boxes for going gin'],
    ['Undercut bonus (points)', '25', 'Points added for an undercut'],
    ['Undercut bonus boxes', '1', 'Extra boxes for an undercut'],
    ['Every hand won is worth 1 box', 'On', 'Turn off if only gins and undercuts earn boxes'],
    ['Knock card suits that double', 'Spades only', 'Can also be spades and hearts, or none'],
    ['Points to win a game', '250', 'Target score for each of the three games'],
    ['Game bonus', '250', 'Added to the value of each game won'],
    ['Value per box', '25', 'Points per box when a game is valued'],
    ['Game 3 counts double', 'On', 'Doubles the value of the third game'],
    ['Shutout doubles the game', 'On', 'Doubles a game when the loser scored 0 in it'],
    ['Cents per point', '1', 'The stakes'],
    ['Round final score to', 'Nearest 500', 'Can also be nearest 100, or no rounding'],
  ], [3300, 1700, 4360]),
  gap(),
  p('Changes re-score the game in progress straight away. Games already in the ledger keep their original result.'),

  // ---------- 10 ----------
  h1('10. Back up and move scores between devices'),
  p('Scores are kept on each device, inside the browser. They do **not** sync between phones or computers, so have one person keep score for each game.'),
  h2('Save a backup'),
  ...steps([
    'Scroll down to **Ledger**.',
    'Tap **Export backup**. A file named **gin-scores-(date).json** is saved to your Downloads.',
    'Keep it somewhere safe. Emailing it to yourself works.',
  ]),
  h2('Restore a backup or move to another device'),
  ...steps([
    'Open Gin Scorekeeper on the device you want the scores on.',
    'Tap **Import backup** and choose the .json file.',
    'Tap **OK**.',
  ]),
  callout('Warning', 'Importing replaces everything on that device, including its ledger.'),
  p('**Scores are erased if you:**'),
  ...bullets([
    'Clear your browser history or "cookies and site data".',
    'Play in a private or incognito window.',
    'Open it from inside the zip file.',
  ]),
  p('**Scores seem to vanish (but come back when you undo it) if you:**'),
  ...bullets([
    `Move or rename ${HTML_NAME}.`,
    'Open it in a different browser from last time.',
  ]),

  // ---------- 11 ----------
  h1('11. Troubleshooting'),
  table(['Problem', 'Fix'], [
    ['Red box: "You opened this from inside the zip file"', 'Close the window. Right-click the zip, choose **Extract All**, and open the extracted copy (section 1).'],
    ['Red box: "This browser is not saving scores"', 'You are in a private or incognito window, or a phone\'s file viewer. Open it in a normal browser window. On a phone, use the web link in section 2.'],
    ['My scores are gone', 'Check that you opened the same file in the same browser as before. If they are still missing, use **Import backup** with your latest backup (section 10).'],
    ['The file opens as text, code or in the wrong program', `Right-click ${HTML_NAME}, choose **Open with**, then **Google Chrome** or **Microsoft Edge**.`],
    ['**Record hand** is greyed out', 'Read the grey box above it. Usually a player or a deadwood count is missing.'],
    ['Message: "Zero deadwood is gin"', 'Tap **Gin** instead of **Knock**.'],
    ['I entered a hand wrong', 'See section 6.'],
  ], [3600, 5760]),
];

const doc = new Document({
  creator: 'Gin Scorekeeper',
  title: 'Gin Scorekeeper User Guide',
  styles: {
    default: { document: { run: { font: 'Calibri', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 30, bold: true, color: GREEN },
        paragraph: { spacing: { before: 400, after: 140 }, keepNext: true, keepLines: true, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, color: '2B2B2B' },
        paragraph: { spacing: { before: 220, after: 100 }, keepNext: true, keepLines: true, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'steps', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 360 } }, run: { bold: true, color: GREEN } } }] },
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 360 } }, run: { color: GREEN } } }] },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: 'Gin Scorekeeper User Guide  ·  Page ', color: MUTED, size: 18 }),
        new TextRun({ children: [PageNumber.CURRENT], color: MUTED, size: 18 }),
      ] })] }),
    },
    children,
  }],
});

const out = path.join(__dirname, '..', 'dist', 'Gin Scorekeeper - User Guide.docx');
fs.mkdirSync(path.dirname(out), { recursive: true });
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(out, buf); console.log('Wrote', out); });
