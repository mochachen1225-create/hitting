# 小人退散

打小人的手機網頁小遊戲。輸入你想退散的對象，選一種方式把紙小人打到爛掉，最後領一張專屬符咒，傳給朋友一起神清氣爽。

**直接玩**：<https://mochachen1225-create.github.io/hitting/>（手機、電腦都可以，手指和滑鼠都能操作）

## 玩法

1. 開場選中文或 English。
2. 輸入對象的名字或稱呼。不填就叫「臭小人」。名字會寫在紙小人身上，只存在你自己的瀏覽器。
3. 從 8 種退散法自己挑一種，或按「隨機抽一個」。
4. 每局最長 60 秒（拖鞋是 30 秒計時賽）。小人會逃、會閃、會嗆你，要追著打。
5. 打完畫面轉成日出，「神清氣爽～」。
6. 偶爾會遇到貓貓神下凡祈福：抓住會逃跑的小魚乾，拖去獻給牠，運勢升級成上上籤。
7. 領取符咒圖，用「分享符咒圖」傳到 LINE、Threads 或任何 App。

## 8 種退散法

| 玩法 | 怎麼操作 | 過關條件 |
|---|---|---|
| 射飛鏢 | 從下往上滑，射出飛鏢 | 射中 10 次 |
| 拖鞋打 | 追著亂跑的小人點下去，口訣字幕跟著打的速度跑 | 30 秒內打 100 下拿金拖鞋獎（70 下銀、40 下銅） |
| 燒掉 | 按住拖著蠟燭追，火一離開就熄 | 燒成灰 |
| 釘草人 | 點小人敲釘子；一指按住它、另一指敲會更準 | 釘滿 10 根 |
| 撕碎 | 手指劃過就撕開，也能兩指往外拉 | 撕成 60 片 |
| 揉爛丟掉 | 在小人身上來回搓成紙團，再往上甩進飄來飄去的垃圾桶 | 投進垃圾桶 |
| 泡水 | 抓住小人拖進水裡壓著，它會躲手指、會溜走 | 泡到爛掉 |
| 搖到暈 | 搖手機，或抓住罐子用力甩 | 撞罐子 20 下 |

## 符咒圖

每局結束都會產生一張 1080×1500 的符咒圖：

- 草書「敕令」，中間的符文是「小人退散」的注音 ㄒㄧㄠˇ ㄖㄣˊ ㄊㄨㄟˋ ㄙㄢˋ
- 兩側長紅條、皺紙紋、隨機吉祥話印章
- 寫上你退散的對象、退散方式和今日運勢

## 檔案

| 檔案 | 用途 |
|---|---|
| `index.html` | 完整遊戲，單一檔案，GitHub Pages 直接開這個 |
| `src/game.html` | 遊戲本體原始檔，修改都改這裡 |
| `tools/build.sh` | 把 `src/game.html` 包成 `index.html`，加上分享預覽標籤 |
| `tools/smoke.js` | 自動把 8 種玩法各玩到結束，檢查有沒有錯誤 |
| `og.png` | 貼連結到社群時的預覽圖（1200×630） |
| `NOTES.md` | 開發進度、設計決定、還沒做的想法 |

修改流程：改 `src/game.html` → `sh tools/build.sh` → `node tools/smoke.js` → 更新 `NOTES.md`。

## 素材來源

**圖像**：紙小人、拖鞋、飛鏢、蠟燭、神木、垃圾桶、罐子、貓貓神、符咒等所有圖案，都是用 Canvas 程式即時畫出來的，沒有使用外部圖片。

**音效**：全部用 Web Audio API 即時合成（拍打、火焰、敲釘、撕紙、水花、貓叫、呼嚕等），沒有錄音檔，也沒有人聲。

**字型**（皆由 Google Fonts 提供，SIL Open Font License 1.1）：

| 字型 | 用在 |
|---|---|
| Noto Serif TC | 標題、口訣字幕 |
| Noto Sans TC | 介面文字 |
| Liu Jian Mao Cao（劉建毛草） | 符咒上的草書 |
| Zhi Mang Xing（志莽行書） | 草書缺字時的備用 |
| LXGW WenKai TC（霞鶩文楷 TC） | 符咒上的注音符文和名字 |

**文字內容**：打小人口訣、小人台詞、運勢籤、印章吉祥話都是原創的搞笑版本，不是傳統口訣。

**玩法靈感**（各地「對付小人」的民俗）：

- 香港驚蟄打小人（鵝頸橋神婆用鞋拍打紙小人、祭白虎）→ 拖鞋打、口訣字幕、貓貓神（取代白老虎）
- 日本丑時參拜（把稻草人釘在神社神木上）→ 釘草人
- 古羅馬英國巴斯的詛咒板（把控訴丟進聖泉）→ 泡水
- 厄瓜多跨年燒舊年人偶、拉丁美洲復活節燒猶大 → 燒掉

參考資料：
- [驚蟄打小人 源於粵港澳大灣區習俗](https://www.ourchinastory.com/zh/1132)
- [Ushi no Koku Mairi – hyakumonogatari](https://hyakumonogatari.com/2013/01/03/ushi-no-koku-mairi-shrine-visit-at-the-hour-of-the-ox/)
- [Bath curse tablets – Wikipedia](https://en.wikipedia.org/wiki/Bath_curse_tablets)
- [New Year's effigies in Ecuador – Atlas Obscura](https://atlasobscura.com/articles/new-years-effigies-ecuador)
- [Burning of Judas – Wikipedia](https://en.wikipedia.org/wiki/Burning_of_Judas)

## 隱私

遊戲沒有後端、不蒐集資料。輸入的名字和語言、音效設定只存在玩家自己瀏覽器的 localStorage；分享符咒圖時，圖片由玩家自己決定傳給誰。
