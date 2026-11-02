# 給 Claude 的工作規則

- 遊戲本體在 `src/game.html`，修改都改這個檔；改完執行 `sh tools/build.sh` 產生 `index.html`，不要直接手改 `index.html`。
- 每次修改後執行 `node tools/smoke.js`，每個玩法（含親手畫符）都要顯示 ok、沒有 page errors 才能 commit。
- **每次修改都要更新 `NOTES.md`**：在「更新紀錄」最上面加一筆（日期＋改了什麼），並同步調整「目前進度」「設計決定」「還沒做的想法」。
- 新功能或玩法有變動時，也要更新 `README.md` 的玩法表。
- repo 裡不要放任何個資：不寫使用者或家人的名字、職業、email、所在地等。程式註解、commit 訊息、NOTES、文件、遊戲內所有會公開的地方都不寫作者名字，署名一律寫「摩卡與貓貓小隊」。
- 口訣字幕一律繁體中文；介面和台詞要有中文、英文兩份。
- GitHub Pages 從 `main` 分支發布；使用者要更新公開網站時，再把工作分支同步到 `main`。
- 改版要升版本號：`VERSION` 檔和 `src/game.html` 的 `const VERSION` 一起改（`tools/build.sh` 不一致會警告），並在 `CHANGES.md` 最上面寫玩家看得懂的中英更新說明。
- 上架檔用 `sh tools/package.sh` 產生（`dist/`，不進 git）；截圖和封面用 `node tools/make-promo.js` 重拍。
- 上架和宣傳由「總編」對話排程；新功能或大改動完成後用 send_message 通知總編（版本號、一兩句玩家看得懂的修改、itch／Newgrounds 要不要更新）。
- 所有新內容（介面、台詞、圖鑑、成就、上架文案）都要中英兩份；AI 生成的素材要在 README 和 `docs/itch-page.md` 照實標示。
