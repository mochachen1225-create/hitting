// Smoke test: plays every mode to the end and reports page errors.
// Usage: node tools/smoke.js   (needs Playwright + Chromium; run from the repo root)
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 760 }, hasTouch: true });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve('index.html'));
  await p.click('[data-lang="zh"]');
  await p.click('#toModes');
  for (const m of ['darts', 'slipper', 'burn', 'nail', 'tear', 'crumple', 'water', 'shake']) {
    await p.evaluate(id => startMode(id), m);
    await p.waitForTimeout(200);
    await p.evaluate(() => damage(G, 999));
    await p.waitForTimeout(2600);
    await p.mouse.click(195, 400);          // skip the sunrise finale
    await p.waitForTimeout(300);
    if (await p.evaluate(() => !!(G && G.coat))) await p.click('#catSkip');
    await p.waitForTimeout(2500);
    const scr = await p.evaluate(() => screen);
    console.log(m.padEnd(8), scr === 'result' ? 'ok' : 'STUCK on ' + scr);
  }
  console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no page errors');
  await b.close();
  process.exit(errs.length ? 1 : 0);
})();
