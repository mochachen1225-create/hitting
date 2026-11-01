#!/bin/sh
# Wraps src/game.html (the page body, as published to the Claude artifact) into a standalone index.html.
# Usage (from the repo root):
#   sh tools/build.sh                         -> index.html for GitHub Pages (with AI art)
#   NO_AI=1 sh tools/build.sh src/game.html out.html  -> build that skips the AI art (Newgrounds)
SRC="${1:-src/game.html}"; OUT="${2:-index.html}"; BASE="https://mochachen1225-create.github.io/hitting/"
VER="$(cat VERSION 2>/dev/null)"
if ! grep -q "const VERSION='$VER'" "$SRC"; then echo "warning: VERSION ($VER) does not match the VERSION constant in $SRC" >&2; fi
{
printf '<!doctype html>\n<html lang="zh-Hant">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
printf '<title>小人退散 Begone, Petty People!</title>\n<meta name="description" content="打小人手機小遊戲：拖鞋打、燒掉、釘草人、撒豆、燒替身等 10 種方式退散小人，打完領一張專屬符咒。A silly folklore mini-game: banish a paper petty person 10 ways and get your own talisman.">\n'
printf '<meta property="og:type" content="website">\n<meta property="og:site_name" content="小人退散 Begone, Petty People!">\n<meta property="og:title" content="小人退散｜打小人手機小遊戲 Begone, Petty People!">\n'
printf '<meta property="og:description" content="10 種方式退散小人，打完領一張專屬符咒，傳給朋友一起神清氣爽～ Banish a paper petty person 10 ways, then share your talisman.">\n'
printf '<meta property="og:url" content="%s">\n<meta property="og:image" content="%sog.png">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="小人退散：拖鞋打臭小人和一張黃色符咒">\n' "$BASE" "$BASE"
printf '<link rel="manifest" href="manifest.webmanifest">\n<link rel="icon" type="image/png" href="icon-192.png">\n<link rel="apple-touch-icon" href="icon-180.png">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-title" content="小人退散">\n<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n'
printf '<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:image" content="%sog.png">\n<meta name="theme-color" content="#100e18">\n' "$BASE"
if [ -n "$NO_AI" ]; then printf '<script>window.NO_AI_ART=true</script>\n'; fi
printf '<style>:root{padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)}body{margin:0;font:14px system-ui}img{max-width:100%%}[hidden]{display:none!important}</style>\n</head>\n<body>\n'
cat "$SRC"
printf '\n</body>\n</html>\n'
} > "$OUT"
