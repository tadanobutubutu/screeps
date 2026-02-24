# 🤖 自動化ワークフロー説明

このリポジトリには、GitHub Actionsを使った完全自動化システムが組み込まれています。
**外部APIキー不要**で、完全無料で動作します。

## 🎯 稼働中のワークフロー

### 1. 🔧 Rule-Based Auto-Improve
**実行頻度**: 6時間ごと  
**ファイル**: `.github/workflows/rule-based-improve.yml`

**機能**:
- コード最適化ルールを自動適用
- `console.log` の削除（パフォーマンス向上）
- `var` を `const` に変更
- 非効率な `for-in` ループを最適化
- 死んだクリープのメモリクリーンアップを追加
- `undefined` チェックを厳密に

**出力**:
- 最適化された `.js` ファイル
- `last-rule-improvement.json` （適用されたルールの記録）

**使い方**:
```bash
# 手動実行
# GitHub Actionsタブ → Rule-Based Auto-Improve → Run workflow
```

---

### 2. 🎨 Auto-Format & Lint
**実行頻度**: 毎日 2:00 AM JST  
**ファイル**: `.github/workflows/auto-format.yml`

**機能**:
- ESLintでコード品質チェック
- Prettierでコードフォーマット統一
- Screeps専用のグローバル変数設定

**ESLintルール**:
- `prefer-const`: 再代入しない変数は `const`
- `no-var`: `var` を使わない
- `eqeqeq`: `===` を使う
- `curly`: 制御構造には必ずブレース

**Prettier設定**:
- シングルクォート
- 4スペースインデント
- 100文字行幅

**出力**:
- 整形された `.js` ファイル
- `.eslintrc.json`
- `.prettierrc.json`
- `format-report.txt`

---

### 3. 🎲 Random Experiment
**実行頻度**: 毎週日曜日 4:00 AM JST  
**ファイル**: `.github/workflows/random-experiment.yml`

**機能**:
毎週ランダムに1つの実験的機能を追加します。

**実験カタログ**:
1. 📊 **パフォーマンスモニター** - CPUとメモリ使用量の追跡
2. 🧼 **パスファインディングキャッシュ** - 古い経路キャッシュのクリーンアップ
3. 🎯 **スポーン優先度改善** - ニーズに応じた自動優先度調整
4. 🛡️ **タワー最適化** - スマートなターゲット選択
5. ⚡ **エネルギー効率トラッキング** - 部屋ごとの効率監視

**出力**:
- 機能が追加された `main.js`
- `last-experiment.json` （実験の記録）

---

### 4. 🆕 Auto Create New Roles
**実行頻度**: 毎週月曜日 3:00 AM JST  
**ファイル**: `.github/workflows/auto-create-roles.yml`

**機能**:
新しいロールファイルを自動生成し、`main.js` に統合します。

**作成可能なロール** (合計7種類):
1. 🛡️ **defender** - 部屋を防衛する戦闘クリープ
2. ⛏️ **miner** - ソースの隣に固定して採掘
3. 🏴 **claimer** - 新しい部屋をクレーム
4. 🌎 **remoteHarvester** - 隣の部屋からエネルギーを持ち帰り
5. ❤️‍🩹 **healer** - 傷ついたクリープを回復
6. 📍 **scout** (改良版) - 周辺を探索してマップ化
7. ⚡ **powerHarvester** - Power Bankを攻撃

**出力**:
- 新しい `role.{name}.js` ファイル
- 更新された `main.js` (自動インポート追加)
- `last-role-creation.json`

**進行状況**:
7週間で全てのロールが揃います。

---

### 5. 📊 Game Status Reporter
**実行頻度**: 毎時  
**ファイル**: `.github/workflows/game-status-reporter.yml`

**機能**:
Screeps APIからゲーム情報を取得し、GitHubに記録します。

**取得する情報**:
- 👤 プレイヤー情報 (GCL, CPU, Credits)
- 🏰 所有部屋 (RCL, エネルギー)
- 🐛 クリープ統計 (数、ロール別内訳)
- 💾 メモリ使用率

**出力**:
- `GAME_STATUS.md` - 最新状況（毎時上書き）
- `game-history/YYYY-MM-DD.md` - 日付別履歴

**使い方**:
[`GAME_STATUS.md`](./GAME_STATUS.md) を開くだけで、リアルタイムのゲーム状況が確認できます。

---

### 6. 🚀 Deploy to Screeps PTR
**実行タイミング**: `main` ブランチへの push 時  
**ファイル**: `.github/workflows/deploy.yml`

**機能**:
- PTRサーバーへ自動デプロイ
- 本番サーバーへのデプロイもサポート

**必要なSecret**:
- `SCREEPS_TOKEN` - PTR用
- `SCREEPS_PROD_TOKEN` - 本番用 (オプション)

---

## 🛠️ その他のワークフロー

### 🧐 AI Strategy Analyzer
**ステータス**: 稼働中  
**実行頻度**: 6時間ごと  
**ファイル**: `.github/workflows/ai-strategy-analyzer.yml`

コロニーのニーズを分析し、戦略的推奨事項を生成します。

### 🏆 Daily Creep Leaderboard
**ステータス**: 稼働中  
**実行頻度**: 毎日 18:45 JST  
**ファイル**: `.github/workflows/daily-leaderboard.yml`

毎日異なるチャレンジを生成します。

---

## 🚀 クイックスタート

### 1. 自動化を有効化
全てのワークフローは事前に設定済みで、自動的に実行されます。

### 2. 手動実行
```bash
# GitHubリポジトリを開く
# Actionsタブをクリック
# 実行したいワークフローを選択
# "Run workflow" ボタンをクリック
```

### 3. ゲーム内での統合

```javascript
// main.js
const strategyMemory = require('strategy-memory');
const dailyChallenge = require('daily-challenge');

module.exports.loop = function() {
  // 戦略ロード (100 tickごと)
  if (Game.time % 100 === 0) {
    strategyMemory.loadStrategy();
  }
  
  // 戦略ブリーフィング表示 (500 tickごと)
  if (Game.time % 500 === 0) {
    strategyMemory.displayBriefing();
  }
  
  // チャレンジ表示 (500 tickごと)
  if (Game.time % 500 === 0) {
    dailyChallenge.displayChallenge();
  }
  
  // 既存のコード...
};
```

---

## 📊 メリット

- ✅ **完全無料** - 外部APIキー不要
- ✅ **自動改善** - 放置でコードが進化
- ✅ **リアルタイム監視** - ゲーム状況をGitHubで確認
- ✅ **自動拡張** - 新しいロールが週次で追加
- ✅ **学習ツール** - AIがどのようにScreepsにアプローチするか見られる

---

## 🔧 カスタマイズ

ワークフローYAMLファイルを編集することでカスタマイズできます：

- **スケジュール変更**: `cron` 式を修正
- **ルール追加**: `rule-based-improve.yml` に新しいパターン追加
- **実験追加**: `random-experiment.yml` に新しい実験追加
- **ロール追加**: `auto-create-roles.yml` にテンプレート追加

---

## 📝 注意事項

- 全てのワークフローはGitHub Actionsで動作
- ローカル環境不要
- コミットされたファイルは自動でプッシュ
- Actionsタブで実行履歴を確認可能
- テスト用に手動実行も可能

---

**AI強化されたScreeps体験をお楽しみください！** 🎮🤖
