// Publishes the website https://kerbalguy89.github.io/RummyTalk-Advisor/ to the gh-pages branch.
// Run: npm run deploy (runs the tests first). Pages serves gh-pages, so the main branch keeps only
// the app, the guide and this folder. The site is the app as index.html, plus the home-screen
// manifest and icons from web/. gh-pages is rebuilt from scratch and force-pushed every time.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const git = (args, cwd) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();

// The downloadable app runs from a local file, so the web-only tags are added here instead.
function siteHtml() {
  const html = fs.readFileSync(path.join(ROOT, 'Gin Scorekeeper.html'), 'utf8');
  const anchor = '<link rel="icon"';
  if (!html.includes(anchor)) throw new Error('Gin Scorekeeper.html has no <link rel="icon"> to add the web links next to');
  return html.replace(anchor, '<link rel="manifest" href="manifest.webmanifest">\n<link rel="apple-touch-icon" href="icon-192.png">\n' + anchor);
}

const email = git(['config', 'user.email'], ROOT);
if (!email.endsWith('@users.noreply.github.com')) throw new Error(`Refusing to publish: commits must use the GitHub noreply email, not ${email}`);
const name = git(['config', 'user.name'], ROOT);
const remote = git(['remote', 'get-url', 'origin'], ROOT);
const source = git(['rev-parse', '--short', 'HEAD'], ROOT);

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gin-site-'));
try {
  fs.writeFileSync(path.join(dir, 'index.html'), siteHtml());
  for (const f of fs.readdirSync(path.join(__dirname, 'web'))) fs.copyFileSync(path.join(__dirname, 'web', f), path.join(dir, f));
  fs.writeFileSync(path.join(dir, '.nojekyll'), '');

  git(['init', '-q', '-b', 'gh-pages'], dir);
  git(['config', 'user.email', email], dir);
  git(['config', 'user.name', name], dir);
  git(['add', '-A'], dir);
  git(['commit', '-q', '-m', `Publish site from main ${source}`], dir);
  git(['push', '-q', '--force', remote, 'gh-pages'], dir);
  console.log(`Published main ${source} to gh-pages: ${fs.readdirSync(dir).filter(f => f !== '.git').join(', ')}`);
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}
