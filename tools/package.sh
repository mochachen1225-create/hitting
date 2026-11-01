#!/bin/sh
# Builds upload-ready zips for itch.io (with AI art) and Newgrounds (no AI art) into dist/.
# Works on macOS and Linux; needs only sh and zip. Run from the repo root: sh tools/package.sh
set -e
VER="$(cat VERSION)"
rm -rf dist && mkdir -p dist/itch dist/newgrounds

# itch.io: the full game, AI art included (tick "AI Generated Graphics" on the upload form)
sh tools/build.sh src/game.html dist/itch/index.html
cp -R assets dist/itch/assets
cp manifest.webmanifest icon-180.png icon-192.png icon-512.png dist/itch/
(cd dist/itch && zip -qr "../xiaoren-tuisan-itch-v$VER.zip" .)

# Newgrounds: no AI art; every scene uses its hand-drawn version
NO_AI=1 sh tools/build.sh src/game.html dist/newgrounds/index.html
cp icon-180.png icon-192.png icon-512.png dist/newgrounds/
(cd dist/newgrounds && zip -qr "../xiaoren-tuisan-newgrounds-v$VER.zip" .)

ls -lh dist/*.zip
