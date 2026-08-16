# NPB QUIZ CLUB

NPBを「基本ルールは知っている」状態から、もう一段詳しくなるためのブラウザ完結クイズ。

## 学習設計

- 現役7：歴史3を目安にした「今日の10問」
- 4択中心＋○×・選手当て・並べ替え
- 現役NPB / MLB挑戦組 / 12球団 / NPB史 / 数字で見る野球 / 観戦解像度
- 間違えた問題だけ `localStorage` に保存
- 復習間隔は 1日 → 3日 → 7日 → 14日 → 30日
- 復習で再度間違えると最初のステップへ戻る
- 5段階を通過すると「卒業済み」
- サーバー送信なし

## ファイル

- `index.html` — 画面構造
- `styles.css` — UI
- `questions.js` — 問題データ
- `app.js` — クイズ・復習ロジック

## 問題追加

`questions.js` の `QUIZ_QUESTIONS` に追加します。

```js
{
  id: "unique-id",
  category: "current",
  level: 2,
  type: "choice",
  q: "問題文",
  options: ["正解", "誤答1", "誤答2", "誤答3"],
  answer: 0,
  explanation: "解説",
  source: "https://..."
}
```

`answer` は `options` の0始まりのインデックスです。

## GitHub Pages

`main` ブランチ直下を GitHub Pages の公開元に設定すれば、そのまま静的サイトとして動作します。
