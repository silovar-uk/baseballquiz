# NPB QUIZ CLUB

NPBを「基本ルールは知っている」状態から、もう一段詳しくなるためのブラウザ完結クイズ。

## 学習設計

- 現役・MLBを中心に、球団・歴史・制度・指標・観戦知識を混ぜた「今日の10問」
- 4択中心＋○×・選手当て・並べ替え
- 現役NPB / MLB挑戦組 / 12球団 / NPB史 / 数字で見る野球 / 観戦解像度 / 制度・大会
- 選手問題は所属暗記だけでなく、投打・入団経路・プレースタイル・キャリアまで扱う
- 球団問題は名称変遷だけでなく、球団文化・育成・ボールパーク戦略まで扱う
- 不正解に加えて「正解したけど自信なし」も復習対象にできる
- 復習記録は `localStorage` のみに保存
- 復習間隔は 1日 → 3日 → 7日 → 14日 → 30日
- 不正解または「自信なし」で最初のステップへ戻る
- 5段階を通過すると「卒業済み」
- サーバー送信なし

## 毎日の学習

「今日の学習」は次の1セットです。

1. 日替わりの5人（NPB 3人 + MLB 2人）の選手ファイルを読む
2. その5人だけの確認クイズを5問解く
3. 復習期限が来た問題だけ解く

同じ日は同じ5人を表示します。

## 選手名鑑 v4

- **74人収録**
  - NPB 60人：12球団 × 5人
  - MLB日本人 14人
- 選手名 / 球団 / 特徴で検索
- NPB / MLBで絞り込み
- 球団・MLBチームで絞り込み
- 各選手に以下を収録
  - 所属・ポジション・投打
  - 「まず覚える特徴」
  - 覚え方
  - 2026年の見どころ
  - 主な実績・代表歴
  - キャリア年表
  - 複数の公式情報リンク
  - 情報確認日
- 選手ごとの確認問題を自動生成

選手情報の確認基準日は **2026-08-17**。NPBは NPB.jp の2026年度選手一覧・球団別成績、MLBは MLB.com の選手プロフィール・International Players を中心に確認しています。

## LEVEL / XP

- 全体LEVEL / XP
- ジャンル別LEVEL / XP
- 通常クイズ：正解 / 不正解のどちらでも学習XPを加算
- Daily Five：選手ファイル閲覧・確認クイズ・完了でXPを加算
- ジャンル別LEVELは 80 XP ごとに1段階アップ

## 主なファイル

- `index.html` — 画面構造・読み込み順
- `styles.css` — 基本UI
- `enhancements.css` — 復習・自信なしUI
- `progression.css` — Daily Five / 全体XP
- `player-detail-v4.css` — 選手名鑑 / 学習フロー / ジャンル別LEVEL
- `questions.js` — 初期問題データ
- `questions-extra.js` — 選手像・球団文化の追加問題
- `questions-systems.js` — FA / ドラフト / CSなど制度・大会
- `players-npb-central-v4.js` — セ・リーグ30選手
- `players-npb-pacific-v4.js` — パ・リーグ30選手
- `players-mlb-v4.js` — MLB日本人14選手
- `player-questions-v4.js` — 選手プロフィールから確認問題を生成
- `app-v2-state.js` — 保存・復習スケジュール
- `app-v2-quiz.js` — 出題・回答・「自信なし」処理
- `app-v2-ui.js` — ダッシュボード・復習ノート
- `app-v3-learning.js` — Daily Five / 全体XP / LEVEL
- `app-v4-learning.js` — 全選手名鑑 / 毎日の学習フロー / ジャンル別LEVEL
- `favicon.svg` — favicon
- `app.js` — 初版ロジック（現在は読み込まない）
- `players.js` — v3選手データ（現在は読み込まない）

## 問題追加

手動で問題を増やす場合は `questions-extra.js` などに追加します。

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
- `progress.xp`: 全体XP
- `progress.categoryXp`: ジャンル別XP
- `progress.playerSeen`: 初見の選手ファイル
- `progress.dailyFiveCompleted`: Daily Five完了日

## GitHub Pages

`main` ブランチ直下を GitHub Pages の公開元に設定すれば、そのまま静的サイトとして動作します。
