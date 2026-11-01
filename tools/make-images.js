// Renders the share preview (og.png) and home-screen icons from the game's own drawing code.
// Usage: node tools/make-images.js   (run from the repo root after `sh tools/build.sh`; needs Playwright + Chromium)
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { serve } = require('./serve');
const save = (file, dataUrl) => fs.writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));

(async () => {
  const srv = await serve('.');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 760 } });
  await p.goto(srv.url);
  await p.click('[data-lang="zh"]');
  await p.waitForTimeout(300);

  // home-screen icon: the paper man's worried, cocky face on cinnabar, with a slipper coming in
  for (const size of [180, 192, 512]) {
    save(`icon-${size}.png`, await p.evaluate(async size => {
      await Promise.all([ART_WAIT.manTex, ART_WAIT.slipperImg]);
      const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d');
      const bg = x.createLinearGradient(0, 0, size, size); bg.addColorStop(0, '#e2513c'); bg.addColorStop(1, '#a8241a');
      x.fillStyle = bg; x.fillRect(0, 0, size, size);
      const k = size / 512;
      x.save(); x.translate(250 * k, 345 * k); x.rotate(-0.08); x.scale(2.75 * k, 2.75 * k);
      const m = newMan(0, 0, 1); m.name = ''; m.face = 'smug'; drawManLocal(x, m); x.restore();
      drawSlipper(x, 362 * k, 185 * k, 0.7, 1.1 * k, 1);
      return c.toDataURL('image/png');
    }, size));
  }

  // 1200x630 share preview
  save('og.png', await p.evaluate(async () => {
    const img = await ART_WAIT.fu1, bgArt = await ART_WAIT.menu; await Promise.all([ART_WAIT.manTex, ART_WAIT.slipperImg]);
    await document.fonts.load(`900 120px ${FONT_D}`, '小人退散打手機小遊戲種法');
    const c = document.createElement('canvas'); c.width = 1200; c.height = 630; const x = c.getContext('2d');
    const bg = x.createLinearGradient(0, 0, 0, 630); bg.addColorStop(0, '#1c1828'); bg.addColorStop(1, '#0b0a12'); x.fillStyle = bg; x.fillRect(0, 0, 1200, 630);
    if (bgArt) { const sc = 1200 / bgArt.width; x.drawImage(bgArt, 0, (630 - bgArt.height * sc) / 2, 1200, bgArt.height * sc); x.fillStyle = 'rgba(14,11,22,.55)'; x.fillRect(0, 0, 1200, 630); }
    const rg = x.createRadialGradient(360, 300, 0, 360, 300, 520); rg.addColorStop(0, 'rgba(216,64,46,.28)'); rg.addColorStop(1, 'rgba(216,64,46,0)'); x.fillStyle = rg; x.fillRect(0, 0, 1200, 630);
    for (let i = 0; i < 60; i++) { x.fillStyle = `rgba(246,241,228,${Math.random() * .3})`; x.beginPath(); x.arc(Math.random() * 1200, Math.random() * 630, Math.random() * 2.5 + .5, 0, 7); x.fill(); }
    x.save(); x.translate(930, 320); x.rotate(.07); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 40; x.shadowOffsetY = 14;
    const sx0 = img.width * .055, sy0 = img.height * .03, sw = img.width * .89, sh = img.height * .94, k = 580 / sh; x.drawImage(img, sx0, sy0, sw, sh, -sw * k / 2, -290, sw * k, sh * k); x.restore();
    const m = newMan(0, 0, 1); m.name = '臭小人'; m.face = 'hit'; m.bruises = [[-20, -10, 14], [18, 20, 12], [0, -75, 10]];
    x.save(); x.translate(640, 360); x.rotate(-.12); x.scale(1.25, 1.25); drawManLocal(x, m); x.restore();
    drawSlipper(x, 700, 250, -.5, 1.05, 1);
    x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.fillStyle = '#d8402e'; x.font = `900 128px ${FONT_D}`; x.fillText('小人退散', 64, 236);
    x.fillStyle = '#f6f1e4'; x.fillText('小人退散', 58, 230);
    x.font = `700 34px ${FONT_B}`; x.fillStyle = '#ecc24c'; x.fillText('打小人手機小遊戲', 64, 300);
    x.font = `400 26px ${FONT_B}`; x.fillStyle = 'rgba(246,241,228,.85)';
    ['拖鞋打・燒掉・釘草人・撕碎・射飛鏢', '泡水・揉爛・搖到暈・撒豆・燒替身', '還能親手畫符，打完領專屬符咒'].forEach((l, i) => x.fillText(l, 64, 370 + i * 42));
    x.font = `700 22px ${FONT_B}`; x.fillStyle = 'rgba(169,163,191,.9)'; x.fillText('BEGONE, PETTY PEOPLE', 64, 560);
    return c.toDataURL('image/png');
  }));

  await b.close();
  srv.close();
  console.log('wrote og.png, icon-180.png, icon-192.png, icon-512.png');
})();
