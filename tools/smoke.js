// Smoke test: plays every mode to the end and reports page errors.
// Usage: node tools/smoke.js   (needs Playwright + Chromium; run from the repo root)
const path = require('path');
const { chromium } = require('playwright');
const { serve } = require('./serve');
(async () => {
  const srv = await serve('.');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 760 }, hasTouch: true });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(srv.url);
  await p.click('[data-lang="zh"]');
  await p.click('#toModes');
  for (const m of ['darts', 'slipper', 'burn', 'nail', 'tear', 'crumple', 'water', 'shake']) {
    await p.evaluate(id => startMode(id), m);
    await p.waitForTimeout(200);
    await p.evaluate(() => damage(G, 999));
    await p.waitForTimeout(2600);
    // step through the finale: sunrise -> moon blocks -> (cat god) -> result
    for (let k = 0; k < 40 && await p.evaluate(() => screen) !== 'result'; k++) {
      await p.waitForTimeout(250);
      const step = await p.evaluate(() => !G ? '' : (G.skip || G.coat) ? 'skip' : G.sub ? 'sunrise' : '');
      if (step === 'skip') await p.click('#catSkip');
      else if (step === 'sunrise') await p.mouse.click(195, 400);
    }
    await p.waitForTimeout(300);
    const scr = await p.evaluate(() => screen);
    console.log(m.padEnd(8), scr === 'result' ? 'ok' : 'STUCK on ' + scr);
  }
  console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no page errors');
  await b.close();
  srv.close();
  process.exit(errs.length ? 1 : 0);
})();
