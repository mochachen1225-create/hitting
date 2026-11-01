# itch.io 上架資料 / Store page kit

版本 Version：見 `VERSION`（目前 1.0.0）

## 上傳設定 Upload settings

| 項目 | 設定 |
|---|---|
| Kind of project | HTML |
| 上傳檔 | `dist/xiaoren-tuisan-itch-v<版本>.zip`（`sh tools/package.sh` 產生），勾「This file will be played in the browser」 |
| Embed options | Viewport 414 × 896、勾 Mobile friendly、Orientation: Portrait、勾 Fullscreen button |
| Classification | Games · Genre: Action / Other |
| Pricing | Free（或 No payments） |
| Generative AI disclosure | **Yes**，勾三項：AI Generated Graphics（背景、符咒、貓貓神由 Google Gemini／Flow 生成）、AI Generated Code（程式由 Claude Code 撰寫）、AI Generated Text & Dialog（介面文字、台詞、圖鑑由 Claude 撰寫，經人工挑選修改）。另外勾 AI Generated Sound（遊戲兩首背景音樂與廣告兩首配樂由 Google 的 AI 音樂工具生成；音效是程式即時合成） |
| Cover image | `promo/cover-itch.png`（630 × 500） |
| Screenshots | `promo/en/*.jpg`（英文介面，780 × 1688） |
| Trailer | `promo/trailer-en.mp4`（直式 28 秒）；itch 只收 YouTube／Vimeo 連結，要先上傳 YouTube 再貼網址 |

Newgrounds 用 `dist/xiaoren-tuisan-newgrounds-v<版本>.zip`：沒有 AI 圖也沒有 AI 音樂，所有場景、紙小人、拖鞋都用程式繪製版本。

## 標題 Title

Begone, Petty People! (小人退散)

## 一句話 Short description（itch 限 140 字元左右）

EN: Banish a paper troublemaker 10 silly ways, toss moon blocks, feed the Cat God, and share your own talisman.

中：用 10 種好笑的方式退散紙小人，擲筊、餵貓貓神，打完領一張專屬符咒。

## 介紹 Description

**English**

Got a petty person in your life? Write their name (or just "Stinky Jerk") on a paper man and banish them, folklore style.

- **10 ways to banish**: slap with a slipper, throw darts, chase with a candle, nail to a sacred tree, shred, crumple and toss, soak, shake in a jar, Setsubun bean toss, and a Taiwanese bad-luck transfer.
- **Draw your own talisman** with your finger and stick it on the paper man's forehead.
- **Toss moon blocks** to ask the gods if it worked. Three holy cups in a row upgrades your fortune.
- **Feed the Cat God** dried fish (if you can catch it).
- **Daily challenge**: one mode and one twist per day, the same for everyone. Keep your streak.
- **Grades, records, 23 achievements and a folklore codex** to unlock.
- **Share your talisman** as an image, with your score and today's fortune.

Plays in the browser on phone or desktop, in English or Traditional Chinese. Each round takes under a minute.

*Just for fun: the folklore notes are playful retellings, not history or religious advice, and nothing here has any real effect. No real curses.*

**中文**

生活中總有那麼一個小人？把他的名字（或直接叫「臭小人」）寫在紙小人身上，用各地傳說的方式把他退散。

- **10 種退散法**：拖鞋打、射飛鏢、拿蠟燭燒、釘在神木上、撕碎、揉爛丟掉、泡水、關進罐子搖、節分撒豆、台灣祭改燒替身。
- **親手畫符**：手指畫一道符，貼在小人額頭上。
- **擲筊問神明**：連續三個聖筊，運勢升級。
- **貓貓神下凡**：抓住會逃的小魚乾獻給牠。
- **今日挑戰**：每天一題，全世界同一題，累積連續天數。
- **評級、紀錄、23 個成就、民俗圖鑑**等你收集。
- **分享符咒圖**，附上成績和今日運勢。

手機、電腦瀏覽器都能玩，中文、英文都有，一局不到一分鐘。

*純屬娛樂：習俗介紹都是傳說與遊戲改編，不是真實歷史或宗教建議，也沒有任何效力。*

## 操作 Controls

EN: Touch or mouse. Tap, swipe, drag and draw; each mode shows a one-line hint. On phones, shake works in the Shake mode.

中：手指或滑鼠都可以。點、滑、拖、畫，每一關開頭都有一行提示；手機可以真的搖手機。

## 標籤建議 Suggested tags

`folklore` `mobile` `casual` `stress-relief` `funny` `short` `taiwan` `asian` `browser` `touch`

## 製作與素材 Credits

- 企劃、試玩、拍板：貓貓工作室
- 程式與文字：Claude Code（AI）撰寫
- 美術：場景背景、符咒、貓貓神由 Google Gemini 與 Google Flow 生成；紙小人、道具、特效為程式繪製
- 音效：全部用 Web Audio 即時合成，沒有錄音或人聲
- 背景音樂：〈Ascent of the Jade Throne〉〈Steps of the Jade Fox〉，AI 生成
- 字型：Noto Serif TC、Noto Sans TC、Liu Jian Mao Cao、Zhi Mang Xing、LXGW WenKai TC（SIL Open Font License 1.1）

感謝玩家回報 / Thanks to everyone who reports bugs.
