#!/bin/sh
# Wraps src/game.html (page body, as published to the Claude artifact) into the standalone index.html for GitHub Pages.
# Usage: sh tools/build.sh   (run from the repo root)
SRC="${1:-src/game.html}"; OUT="${2:-index.html}"; BASE="https://mochachen1225-create.github.io/hitting/"
{
printf '<!doctype html>\n<html lang="zh-Hant">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
printf '<title>小人退散｜打小人手機小遊戲</title>\n<meta name="description" content="拖鞋打、燒掉、釘草人、撕碎、射飛鏢、泡水、揉爛、搖到暈，8 種方式退散小人，打完領一張專屬符咒。">\n'
printf '<meta property="og:type" content="website">\n<meta property="og:site_name" content="小人退散">\n<meta property="og:title" content="小人退散｜打小人手機小遊戲">\n'
printf '<meta property="og:description" content="8 種方式退散小人，打完領一張專屬符咒，傳給朋友一起神清氣爽～">\n'
printf '<meta property="og:url" content="%s">\n<meta property="og:image" content="%sog.png">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="小人退散：拖鞋打臭小人和一張黃色符咒">\n' "$BASE" "$BASE"
printf '<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:image" content="%sog.png">\n<meta name="theme-color" content="#100e18">\n' "$BASE"
printf '<style>:root{padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)}body{margin:0;font:14px system-ui}img{max-width:100%%}[hidden]{display:none!important}</style>\n</head>\n<body>\n'
cat "$SRC"
printf '\n</body>\n</html>\n'
} > "$OUT"
