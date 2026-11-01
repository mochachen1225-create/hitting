// Renders the trailer's sticker captions (transparent PNGs, 1080 wide) and the 1080x1920 end card.
// Usage: node tools/trailer/cards.js <workdir>   (run from the repo root)
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { serve } = require('../serve');
const OUT = path.resolve(process.argv[2] || 'trailer-work');
const CAPS = {
  zh: { hook: '生活中總有一個小人…', slap: '啪！', name: '把名字寫在紙小人上', slipper: '藍白拖 30 秒打 100 下！', burn: '拿蠟燭追著燒', nail: '釘在神木上', tear: '撕成 60 片！',
        beans: '鬼出去！福進來！', poe: '擲筊問神明：退散了嗎？', cat: '貓貓神下凡祈福', sunrise: '神清氣爽～', talisman: '領一張專屬符咒傳給朋友' },
  en: { hook: 'Everyone has that ONE petty person...', slap: 'SMACK!', name: 'Write their name on a paper man', slipper: '100 slipper slaps in 30 seconds!', burn: 'Chase it with a candle',
        nail: 'Nail it to a sacred tree', tear: 'Shred it into 60 pieces!', beans: 'Demons out! Luck in!', poe: 'Ask the gods: is it gone?', cat: 'The Cat God blesses you',
        sunrise: 'Ahh, refreshing~', talisman: 'Share your own talisman' }
};
const FONTS = '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@900&family=Noto+Serif+TC:wght@900&family=Luckiest+Guy&display=swap" rel="stylesheet">';

(async () => {
  const srv = await serve('.');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const lang of ['zh', 'en']) {
    const dir = `${OUT}/caps/${lang}`; fs.mkdirSync(dir, { recursive: true });
    let i = 0;
    for (const [key, text] of Object.entries(CAPS[lang])) {
      const bg = i++ % 2 ? '#d8402e' : '#ffd34d', rot = (i % 2 ? -2.5 : 2);
      await p.setContent(`${FONTS}<style>body{margin:0;background:transparent;width:1080px}
        .wrap{display:flex;justify-content:center;padding:40px 30px}
        .cap{transform:rotate(${rot}deg);background:${bg};border:6px solid #111;border-radius:22px;padding:18px 34px;max-width:940px;box-shadow:0 12px 0 rgba(0,0,0,.35);
          font:${key === 'slap' ? (lang === 'en' ? "190px 'Luckiest Guy'" : "900 210px 'Noto Sans TC'") : lang === 'en' ? "62px 'Luckiest Guy'" : "900 66px 'Noto Sans TC'"};line-height:1.15;color:#fff;text-align:center;letter-spacing:${lang === 'en' ? '1px' : '2px'};
          -webkit-text-stroke:12px #111;paint-order:stroke fill}</style><div class="wrap"><div class="cap" id="c">${text}</div></div>`);
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(300);
      await (await p.$('.wrap')).screenshot({ path: `${dir}/cap_${key}.png`, omitBackground: true });
    }
    // end card
    await p.setContent(`${FONTS}<style>body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#100e18;font-family:'Noto Sans TC'}
      .bg{position:absolute;inset:0;background:url(${srv.url}assets/bg-menu.webp) center/cover;filter:brightness(.45) blur(2px)}
      .fu{position:absolute;left:50%;top:520px;width:520px;transform:translateX(-50%) rotate(4deg);filter:drop-shadow(0 30px 40px rgba(0,0,0,.6))}
      .man{position:absolute;left:120px;top:1010px;width:300px;transform:rotate(-10deg);filter:drop-shadow(0 20px 20px rgba(0,0,0,.5))}
      .slip{position:absolute;left:330px;top:930px;width:140px;transform:rotate(-30deg)}
      .t{position:absolute;top:150px;width:100%;text-align:center;font:900 170px 'Noto Serif TC';color:#f6f1e4;text-shadow:8px 8px 0 #d8402e}
      .e{position:absolute;top:370px;width:100%;text-align:center;font:84px 'Luckiest Guy';color:#ffd34d;-webkit-text-stroke:10px #111;paint-order:stroke fill}
      .line{position:absolute;top:1540px;width:100%;text-align:center;font:900 54px 'Noto Sans TC';color:#fff}
      .url{position:absolute;top:1660px;width:100%;text-align:center;font:900 40px 'Noto Sans TC';color:#ffd34d}
      .fine{position:absolute;top:1760px;width:100%;text-align:center;font:900 28px 'Noto Sans TC';color:rgba(246,241,228,.7)}</style>
      <div class="bg"></div><div class="t">小人退散</div><div class="e">Begone, Petty People!</div>
      <img class="fu" src="${srv.url}assets/talisman-art-1.webp"><img class="man" src="${srv.url}assets/paperman.webp"><img class="slip" src="${srv.url}assets/slipper.webp">
      <div class="line">${lang === 'en' ? '10 silly ways · Free in your browser' : '10 種退散法・免費・瀏覽器就能玩'}</div>
      <div class="url">mochachen1225-create.github.io/hitting</div>
      <div class="fine">${lang === 'en' ? 'Just for fun. No real curses.' : '純屬娛樂，傳說改編'}</div>`);
    await p.evaluate(() => Promise.all([document.fonts.ready, ...[...document.images].map(i => i.decode().catch(() => {}))]));
    await p.waitForTimeout(400);
    await p.screenshot({ path: `${dir}/endcard.png` });
  }
  await b.close(); srv.close();
  console.log('captions and end cards in', OUT + '/caps');
})();
