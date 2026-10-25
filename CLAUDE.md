# 給 Claude 的工作規則

- 遊戲本體在 `src/game.html`，修改都改這個檔；改完執行 `sh tools/build.sh` 產生 `index.html`，不要直接手改 `index.html`。
- 每次修改後執行 `node tools/smoke.js`，8 種玩法都要顯示 ok、沒有 page errors 才能 commit。
- **每次修改都要更新 `NOTES.md`**：在「更新紀錄」最上面加一筆（日期＋改了什麼），並同步調整「目前進度」「設計決定」「還沒做的想法」。
- 新功能或玩法有變動時，也要更新 `README.md` 的玩法表。
- repo 裡不要放任何個資：不寫使用者或家人的名字、職業、email、所在地等。
- 口訣字幕一律繁體中文；介面和台詞要有中文、英文兩份。
- GitHub Pages 從 `main` 分支發布；使用者要更新公開網站時，再把工作分支同步到 `main`。
