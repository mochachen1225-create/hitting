// Store screenshots (English and Chinese) and the itch.io cover, taken from the real game.
// Usage: node tools/make-promo.js   (run from the repo root after `sh tools/build.sh`; needs Playwright + Chromium)
const fs = require('fs');
const { chromium } = require('playwright');
const { serve } = require('./serve');

async function playUntilResult(p) {
  for (let k = 0; k < 60 && await p.evaluate(() => screen) !== 'result'; k++) {
    await p.waitForTimeout(250);
    const step = await p.evaluate(() => !G ? '' : (G.skip || G.coat) ? 'skip' : G.sub ? 'sunrise' : '');
    if (step === 'skip') await p.click('#catSkip'); else if (step === 'sunrise') await p.mouse.click(195, 400);
  }
}

(async () => {
  const srv = await serve('.');
  const b = await chromium.launch();
  for (const lang of ['en', 'zh']) {
    const dir = `promo/${lang}`; fs.mkdirSync(dir, { recursive: true });
    const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: lang === 'en' ? 'en-US' : 'zh-TW' })).newPage();
    const shot = async name => p.screenshot({ path: `${dir}/${name}.jpg`, type: 'jpeg', quality: 86 });
    await p.goto(srv.url); await p.waitForTimeout(2600); await shot('01-title');
    await p.click(`[data-lang="${lang}"]`); await p.fill('#nameIn', lang === 'en' ? 'Mean Boss' : '慣老闆'); await p.click('#toModes'); await p.waitForTimeout(500); await shot('02-menu');
    // slipper mid-combo
    await p.evaluate(() => startMode('slipper')); await p.waitForTimeout(400);
    for (let i = 0; i < 14; i++) { const [x, y] = await p.evaluate(() => [G.m.x, G.m.y]); await p.mouse.click(x, y); await p.waitForTimeout(70); }
    await shot('03-slipper');
    // nails on the sacred tree
    await p.evaluate(() => startMode('nail')); await p.waitForTimeout(300);
    for (let i = 0; i < 4; i++) { const [x, y] = await p.evaluate(() => [G.m.x, G.m.y + (Math.random() - .5) * 60]); await p.mouse.click(x, y); await p.waitForTimeout(260); }
    await p.waitForTimeout(200); await shot('04-nail');
    // bean toss in flight
    await p.evaluate(() => startMode('beans')); await p.waitForTimeout(300);
    for (let i = 0; i < 6; i++) { const [x, y] = await p.evaluate(() => [G.m.x, G.m.y]); await p.mouse.click(x, y); await p.waitForTimeout(340); }
    await p.waitForTimeout(120); await shot('05-beans');
    // the Cat God
    await p.evaluate(() => { show('play'); startCat(); }); await p.waitForTimeout(2600); await shot('06-catgod');
    // a finished round with the shareable talisman
    await p.evaluate(() => startMode('burn')); await p.waitForTimeout(200); await p.evaluate(() => { G.t = 9.6; damage(G, 999); });
    await playUntilResult(p); await p.waitForTimeout(2800); await shot('07-result');
    await p.close();
  }

  // itch.io cover 630x500: painted talisman, the paper man and the English title
  const p = await b.newPage({ viewport: { width: 390, height: 760 } });
  await p.goto(srv.url); await p.waitForTimeout(500);
  const url = await p.evaluate(async () => {
    const img = await ART_WAIT.fu1, bg = await ART_WAIT.menu;
    await document.fonts.load(`900 80px ${FONT_D}`, '小人退散');
    const c = document.createElement('canvas'); c.width = 630; c.height = 500; const x = c.getContext('2d');
    x.fillStyle = '#100e18'; x.fillRect(0, 0, 630, 500);
    if (bg) { const sc = 630 / bg.width; x.drawImage(bg, 0, (500 - bg.height * sc) / 2, 630, bg.height * sc); x.fillStyle = 'rgba(14,11,22,.5)'; x.fillRect(0, 0, 630, 500); }
    if (img) { x.save(); x.translate(470, 250); x.rotate(.06); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 30; const sx = img.width * .055, sy = img.height * .03, sw = img.width * .89, sh = img.height * .94, k = 440 / sh; x.drawImage(img, sx, sy, sw, sh, -sw * k / 2, -220, sw * k, sh * k); x.restore(); }
    const m = newMan(0, 0, 1); m.name = ''; m.face = 'hit'; m.bruises = [[-18, -8, 12], [16, 22, 10]];
    x.save(); x.translate(330, 330); x.rotate(-.12); x.scale(.95, .95); drawManLocal(x, m); x.restore(); drawSlipper(x, 375, 230, -.5, .8, 1);
    x.textAlign = 'left'; x.fillStyle = '#d8402e'; x.font = `900 76px ${FONT_D}`; x.fillText('小人退散', 30, 112); x.fillStyle = '#f6f1e4'; x.fillText('小人退散', 26, 108);
    x.font = `900 34px ${FONT_D}`; x.fillStyle = '#ecc24c'; x.fillText('Begone,', 30, 160); x.fillText('Petty People!', 30, 200);
    x.font = `700 17px ${FONT_B}`; x.fillStyle = 'rgba(246,241,228,.9)'; ['10 silly ways to banish', 'a paper troublemaker,', 'then share your talisman'].forEach((l, i) => x.fillText(l, 30, 400 + i * 24));
    return c.toDataURL('image/png');
  });
  fs.writeFileSync('promo/cover-itch.png', Buffer.from(url.split(',')[1], 'base64'));
  await b.close(); srv.close();
  console.log('wrote promo/en, promo/zh, promo/cover-itch.png');
})();
