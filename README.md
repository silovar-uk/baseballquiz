# NPB QUIZ CLUB

NPBを「基本ルールは知っている」状態から、もう一段詳しくなるためのブラウザ完結クイズ。

## 学習設計

- 現役7：歴史3を目安にした「今日の10問」
- 4択中心＋○×・選手当て・並べ替え
- 現役NPB / MLB挑戦組 / 12球団 / NPB史 / 数字で見る野球 / 観戦解像度
- 選手問題は所属暗記だけでなく、投打・入団経路・プレースタイルまで扱う
- 球団問題は名称変遷だけでなく、球団文化・育成・ボールパーク戦略まで扱う
- 不正解に加えて「正解したけど自信なし」も復習対象にできる
- 復習記録は `localStorage` のみに保存
- 復習間隔は 1日 → 3日 → 7日 → 14日 → 30日
- 不正解または「自信なし」で最初のステップへ戻る
- 5段階を通過すると「卒業済み」
- サーバー送信なし

## ファイル

- `index.html` — 画面構造
- `styles.css` — 基本UI
- `enhancements.css` — 追加UI
- `questions.js` — 初期問題データ
- `questions-extra.js` — 選手像・球団文化の追加学習セット
- `app-v2-state.js` — 保存・復習スケジュール
- `app-v2-quiz.js` — 出題・回答・「自信なし」処理
- `app-v2-ui.js` — ダッシュボード・復習ノート
- `favicon.svg` — favicon
- `app.js` — 初版ロジック（現在は読み込まない）

## 問題追加

既存セットを触らず増やす場合は `questions-extra.js` に追加します。

```js
window.QUIZ_QUESTIONS.push({
  id: "unique-id",
  category: "current",
  level: 2,
  type: "choice",
  q: "問題文",
  options: ["正解", "誤答1", "誤答2", "誤答3"],
  answer: 0,
  explanation: "解説",
  source: "https://..."
});
```

`answer` は `options` の0始まりのインデックスです。

## 復習データ

ブラウザの `localStorage` に保存します。既存の `npb-quiz-club:v1` を継続利用するため、初版で蓄積した復習データはそのまま引き継ぎます。

- `wrongCount`: 不正解回数
- `uncertainCount`: 「自信なし」回数
- `stage`: 復習ステップ
- `dueAt`: 次回復習日時
- `lastReason`: 直近で復習入りした理由

## GitHub Pages

`main` ブランチ直下を GitHub Pages の公開元に設定すれば、そのまま静的サイトとして動作します。
