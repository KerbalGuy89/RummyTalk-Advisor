// Scoring engine tests. Run: npm test
// Loads the <script id="engine"> block straight out of index.html, so the page and the tests
// always exercise the same code.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const block = html.match(/<script id="engine">([\s\S]*?)<\/script>/);
assert.ok(block, 'index.html must contain <script id="engine">');
const E = vm.runInNewContext(`${block[1]}\nGinEngine`);
const S = { ...E.DEFAULTS };
// Values made inside the sandbox have their own Array prototype; copy them before deep-comparing.
const plain = v => JSON.parse(JSON.stringify(v));

const knock = (knocker, kn, opp, suit = null) => ({ knocker, type: 'knock', kn, opp, suit });
const gin = (knocker, opp, suit = null) => ({ knocker, type: 'gin', kn: 0, opp, suit });

test('hand scoring matches the RummyTalk worked example', () => {
  const res = E.compute([knock(0, 8, 20), gin(0, 14), knock(0, 8, 7), gin(0, 30, 'S')], S);
  const [r1, r2, r3, r4] = res.rows;
  assert.equal(r1.r.pts, 12); assert.deepEqual(plain(r1.hit), [0]);
  assert.equal(r2.r.pts, 39); assert.deepEqual(plain(r2.hit), [0, 1]);
  assert.equal(r3.r.winner, 1); assert.equal(r3.r.kind, 'undercut'); assert.equal(r3.r.pts, 26); assert.deepEqual(plain(r3.hit), [0]);
  assert.equal(r4.r.pts, 110); assert.equal(r4.r.bonusBoxes, 4); assert.deepEqual(plain(r4.hit), [0, 1, 2]);
  assert.deepEqual(plain(res.cols.map(c => c.score[0])), [161, 149, 110]);
});

test('a tie counts as an undercut worth the bonus only', () => {
  const r = E.scoreHand(knock(0, 5, 5), S);
  assert.equal(r.winner, 1);
  assert.equal(r.pts, 25);
});

test('only the configured suits double a hand', () => {
  assert.equal(E.scoreHand(knock(0, 2, 12, 'H'), S).pts, 10);
  assert.equal(E.scoreHand(knock(0, 2, 12, 'H'), { ...S, doubleSuits: 'SH' }).pts, 20);
  assert.equal(E.scoreHand(knock(0, 2, 12, 'S'), { ...S, doubleSuits: '' }).pts, 10);
});

test('game value: RummyTalk example, game 3 double, shutout double', () => {
  const col = { score: [279, 115], boxes: [9, 2], winner: 0 };
  assert.equal(E.colValue(col, 1, S).value, 868);
  assert.equal(E.colValue(col, 2, S).value, 1736);
  assert.equal(E.colValue({ score: [260, 0], boxes: [6, 0], winner: 0 }, 0, S).value, (260 + 250 + 260 + 150) * 2);
});

test('a first win after game 1 closes starts in game 2', () => {
  const res = E.compute([gin(0, 30), knock(1, 2, 10)], { ...S, target: 50 });
  assert.equal(res.cols[0].closed, true);
  assert.deepEqual(plain(res.rows[1].hit), [1]);
});

test('full game settles to the right money', () => {
  const hands = [knock(0, 8, 20), gin(0, 14), knock(0, 8, 7), gin(0, 30, 'S'), knock(1, 3, 15),
    gin(0, 40, 'S'), gin(1, 50), gin(0, 60, 'S')];
  const res = E.compute(hands, S);
  assert.equal(res.over, true);
  const st = E.settle(res, S);
  assert.deepEqual(plain(st.parts.map(p => p.value)), [1119, 1146, 2740]);
  assert.equal(st.net, 5005);
  assert.equal(st.projNet, st.net);
  assert.equal(E.roundPts(st.net, S), 5000);
  assert.equal(E.dollars(5000, S), 50);
});

test('games in progress count only toward the estimate', () => {
  const st = E.settle(E.compute([knock(0, 4, 20)], S), S);
  assert.equal(st.net, 0);
  assert.ok(st.projNet > 0);
});

test('rounding to the nearest 500, 100 or not at all', () => {
  assert.equal(E.roundPts(6252, S), 6500);
  assert.equal(E.roundPts(6100, S), 6000);
  assert.equal(E.roundPts(-6252, S), 6500);
  assert.equal(E.roundPts(6252, { ...S, rounding: 100 }), 6300);
  assert.equal(E.roundPts(6252, { ...S, rounding: 0 }), 6252);
});

test('impossible hands are rejected with a reason', () => {
  assert.equal(E.checkHand(knock(0, 5, 20)), '');
  assert.equal(E.checkHand(gin(1, 0)), '');
  assert.match(E.checkHand(knock(0, 25, 5)), /swapped/);
  assert.match(E.checkHand(knock(0, 0, 5)), /gin/);
  assert.match(E.checkHand(knock(0, 5, 120)), /98/);
  assert.match(E.checkHand(knock(0, 2.5, 10)), /whole number/);
  assert.match(E.checkHand({ ...knock(0, 5, 20), knocker: 2 }), /who knocked/);
  assert.match(E.checkHand({ ...knock(0, 5, 20), suit: 'X' }), /suit/);
});
