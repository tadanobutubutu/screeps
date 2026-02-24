# 🎮 Screeps AI - 完全自動化リポジトリ

> Screeps AI code repository with **full automation** - no API keys required!

[![GitHub Actions](https://img.shields.io/badge/Automation-GitHub%20Actions-blue)](https://github.com/tadanobutubutu/screeps/actions)
[![Status](https://img.shields.io/badge/Status-Active-green)](.github/workflows)

## 🚀 特徴

- ✅ **API不要**: 外部APIキー不要で完全無料
- 🤖 **完全自動化**: 放置で自動改善・拡張
- 📊 **リアルタイム監視**: ゲーム状況をGitHubで確認
- 🆕 **自動拡張**: 新しいロールが週次で追加

## 📊 ゲーム状況

**現在の状況を確認**: [`GAME_STATUS.md`](./GAME_STATUS.md)

毎時自動更新されるリアルタイムレポート：
- 👤 プレイヤー情報 (GCL, CPU, Credits)
- 🏰 所有部屋の状況
- 🐛 クリープ統計
- 💾 メモリ使用率

## 🤖 自動化システム

### コード改善ワークフロー

| ワークフロー | 実行頻度 | 機能 |
|------------|---------|------|
| 🔧 **Rule-Based Auto-Improve** | 6時間ごと | コード最適化ルールを適用 |
| 🎨 **Auto-Format & Lint** | 毎日 2:00 JST | ESLint + Prettier で自動整形 |
| 🎲 **Random Experiment** | 毎週日曜 4:00 JST | 実験的機能をランダム追加 |
| 🆕 **Auto Create Roles** | 毎週月曜 3:00 JST | 新しいロールファイルを自動生成 |

### その他の自動化

| ワークフロー | 実行頻度 | 機能 |
|------------|---------|------|
| 📊 **Game Status Reporter** | 毎時 | Screeps APIからゲーム状況取得 |
| 🚀 **Deploy to Screeps PTR** | mainブランチpush時 | 自動デプロイ |

詳しくは [`WORKFLOWS.md`](./WORKFLOWS.md) を参照してください。

## 🐛 実装済みロール

- 🌾 **harvester** - エネルギー採取
- ⬆️ **upgrader** - コントローラー強化
- 🛠️ **builder** - 建築
- 🔧 **repairer** - 修理
- 🔍 **scout** - 探索
- 💊 **medic** - 回復
- 🚚 **transporter** - 輸送
- 🌍 **explorer** - 周辺探査

### 自動生成予定のロール

以下のロールが週次で自動追加されます：
- 🛡️ **defender** - 防衛
- ⛏️ **miner** - 固定採掘
- 🏴 **claimer** - 領土拡張
- 🌎 **remoteHarvester** - 遠隔採取
- ❤️‍🩹 **healer** - 回復支援
- 📍 **scout** (改良版) - マップ探索
- ⚡ **powerHarvester** - Power Bank攻略

## 🔧 セットアップ

### 1. Steam版購入後

1. Screeps公式サイトでログイン
2. Account Settings → API Access でトークン生成
3. GitHubリポジトリ Settings → Secrets で `SCREEPS_TOKEN` に設定
4. mainブランチにpushすれば自動デプロイ開始

### 2. ローカル開発 (オプション)

```bash
git clone https://github.com/tadanobutubutu/screeps.git
cd screeps
npm install
```

## 📁 ファイル構成

```
.
├── .github/workflows/     # 自動化ワークフロー
├── role.*.js              # クリープロール
├── utils.*.js             # ユーティリティ関数
├── main.js                # メインループ
├── deploy.js              # デプロイスクリプト
├── GAME_STATUS.md         # リアルタイムゲーム状況
├── WORKFLOWS.md           # ワークフロー詳細説明
└── game-history/          # 日付別履歴
```

## 📚 ドキュメント

- [`WORKFLOWS.md`](./WORKFLOWS.md) - 自動化ワークフローの詳細
- [`GAME_STATUS.md`](./GAME_STATUS.md) - リアルタイムゲーム状況
- [`SECURITY.md`](./SECURITY.md) - セキュリティポリシー

## ✨ 特徴詳細

### 🔧 ルールベース自動改善

- `console.log` の削除
- `var` を `const` に変更
- 非効率なループの最適化
- メモリクリーンアップの自動追加

### 🎲 ランダム実験

毎週以下のいずれかを自動追加：
- 📊 パフォーマンスモニター
- 🧼 パスファインディングキャッシュ
- 🎯 スマートスポーン優先度
- 🛡️ タワー最適化
- ⚡ エネルギー効率トラッキング

### 🆕 自動ロール作成

毎週新しいロールを自動生成して `main.js` に統合します。

## 👨‍💻 貪献

改善提案やバグ報告はIssuesでお願いします。

## 📝 ライセンス

MIT License

---

**Enjoy your fully automated Screeps experience!** 🎮🤖
