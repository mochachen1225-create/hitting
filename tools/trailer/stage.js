// Plays scripted moments of the real game and saves sharp frames for the trailer (no screen recording: it is blurry).
// Game time runs on Playwright's fake clock, advanced 1/15 s per frame, so slow high-res screenshots still give a steady 15 fps.
// Usage: node tools/trailer/stage.js <zh|en> <workdir>   (run from the repo root after `sh tools/build.sh`)
// Writes <workdir>/<lang>/<shot>.jpg for stills and <shot>.json (frame list with timestamps) for bursts.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { serve } = require('../serve');
const lang = process.argv[2] || 'zh', OUT = path.resolve(process.argv[3] || 'trailer-work', lang);
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const srv = await serve('.');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 400, height: 800 }, deviceScaleFactor: 2.4, locale: lang === 'en' ? 'en-US' : 'zh-TW' });
  const p = await ctx.newPage();
  await p.clock.install({ time: new Date('2026-11-01T12:00:00') });
  const wait = ms => p.clock.runFor(ms);
  const FPS = 15;
  const still = async name => p.screenshot({ path: `${OUT}/${name}.jpg`, type: 'jpeg', quality: 88 });
  // burst: call act() between frames for `secs`, record each frame's time
  const burst = async (name, secs, act) => {
    const frames = [];
    for (let i = 0; i < Math.round(secs * FPS); i++) {
      await act(i);
      await wait(1000 / FPS);
      const f = `${OUT}/${name}_${String(i).padStart(3, '0')}.jpg`;
      await p.screenshot({ path: f, type: 'jpeg', quality: 82 });
      frames.push([f, i / FPS]);
    }
    fs.writeFileSync(`${OUT}/${name}.json`, JSON.stringify(frames));
  };
  const clean = () => p.evaluate(() => { $('#hint').style.visibility = 'hidden'; });
  const man = () => p.evaluate(() => G && G.m && !G.done ? [G.m.x, G.m.y] : [200, 380]);

  await p.goto(srv.url); await wait(1500);
  await p.click(`[data-lang="${lang}"]`);
  await p.fill('#nameIn', lang === 'en' ? 'Mean Boss' : '慣老闆'); await wait(600); await still('name');
  await p.click('#toModes'); await wait(400);

  await p.evaluate(() => startMode('slipper')); await clean(); await wait(300);
  await burst('slipper', 3.2, async i => { if (i % 2 === 0) { const [x, y] = await man(); await p.mouse.click(x, y); } });

  await p.evaluate(() => startMode('burn')); await clean(); await wait(300);
  await p.mouse.move(200, 700); await p.mouse.down();
  await burst('burn', 2.6, async () => { const [x, y] = await man(); await p.mouse.move(x + 6, y + 70, { steps: 2 }); });
  await p.mouse.up();

  await p.evaluate(() => startMode('nail')); await clean(); await wait(300);
  await burst('nail', 2.6, async i => { if (i % 5 === 0) { const [x, y] = await man(); await p.mouse.click(x, y + (Math.random() - .5) * 50); } });

  await p.evaluate(() => startMode('tear')); await clean(); await wait(300);
  await burst('tear', 2.6, async i => { if (i % 4 === 0) { const y = 220 + Math.random() * 380, a = Math.random() * Math.PI; await p.mouse.move(200 - Math.cos(a) * 190, y - Math.sin(a) * 110); await p.mouse.down(); await p.mouse.move(200 + Math.cos(a) * 190, y + Math.sin(a) * 110, { steps: 3 }); await p.mouse.up(); } });

  await p.evaluate(() => { show('play'); startPoe(() => {}); }); await clean(); await wait(300);
  await p.evaluate(() => { G.streak = 2; });
  await burst('poe', 2.6, async i => { if (i === 1) { await p.mouse.click(200, 600); await p.evaluate(() => { G.blocks[0].face = 'flat'; G.blocks[1].face = 'round'; }); } });

  await p.evaluate(() => { show('play'); startCat(); G.catImg = IMG.cat_orange || G.catImg; }); await clean(); await wait(2700); await still('cat');

  await p.evaluate(() => startMode('crumple')); await wait(150);
  await p.evaluate(() => { G.t = 9.4; damage(G, 999); });
  for (let k = 0; k < 60 && await p.evaluate(() => screen) !== 'result'; k++) {
    await wait(250);
    const step = await p.evaluate(() => !G ? '' : (G.skip || G.coat) ? 'skip' : G.sub ? 'sunrise' : '');
    if (step === 'skip') await p.click('#catSkip'); else if (step === 'sunrise') await p.mouse.click(200, 400);
  }
  await wait(3200); await still('result');
  await b.close(); srv.close();
  console.log('frames in', OUT);
})();
