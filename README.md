# 🎮 Screeps AI - 完全自動化リポジトリ

> Screeps AI code repository with **full automation** - no API keys required!

[![GitHub Actions](https://img.shields.io/badge/Automation-GitHub%20Actions-blue)](https://github.com/tadanobutubutu/screeps/actions)
[![Status](https://img.shields.io/badge/Status-Active-green)](.github/workflows)
[![Free Tier](https://img.shields.io/badge/Cost-¥0%20Forever-brightgreen)](https://github.com/pricing)

## 🚀 特徴

- ✅ **完全無料**: パブリックリポジトリはGitHub Actions無制限
- 🤖 **完全自動化**: 放置で自動改善・拡張
- 📊 **リアルタイム監視**: ゲーム状況をGitHubで確認
- 🆕 **自動拡張**: 新しいロールが週次で追加
- 💰 **コスト監視**: 使用量自動最適化

## 💰 無料枠情報

### GitHub Actions (パブリックリポジトリ)

- ✅ **実行時間**: 無制限
- ✅ **同時実行数**: 20ジョブ
- ✅ **タイムアウト**: 6時間/ジョブ
- ✅ **ストレージ**: 500MB (Artifact)

### 📈 使用量監視

**自動最適化システム**が稼働中：

1. **毎日チェック** - 9:00 JSTに使用量確認
2. **自動最適化** - 高負荷時に頻度を自動調整
3. **アラート** - 異常検知時にIssue自動作成

**現在の使用状況**: [⁠`USAGE_REPORT.md`](./USAGE_REPORT.md)

### 🔧 自動最適化例

使用量が閾値を超えると自動で：
- 15分間隔 → 1時間間隔
- 毎時実行 → 6時間間隔
- 非重要ワークフローの一時停止

## 📊 ゲーム状況

**現在の状況を確認**: [⁠`GAME_STATUS.md`](./GAME_STATUS.md)

15分ごとに自動更新されるリアルタイムレポート：
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

### 監視・メンテナンス

| ワークフロー | 実行頻度 | 機能 |
|------------|---------|------|
| ⏱️ **Game Monitor** | 15分ごと* | ゲーム状況取得・エラー検出 |
| 🔧 **Auto-Fix Errors** | エラー検出時 | 自動修正・PR作成 |
| 💰 **Usage Monitor** | 毎日 9:00 JST | 使用量監視・自動最適化 |
| 🔒 **Security Monitor** | 毎日 3:00 JST | セキュリティスキャン |
| 📚 **Doc Updater** | コード変更時 | ドキュメント自動更新 |
| 🚀 **Deploy** | main push時 | 自動デプロイ |

*高負荷時は自動で時間間隔に変更

詳しくは [⁠`WORKFLOWS.md`](./WORKFLOWS.md) を参照してください。

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
3. GitHubリポジトリ Settings → Secrets で `SCREEPS_PROD_TOKEN` に設定
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
├── CONSOLE_LOGS.md        # コンソールログ
├── USAGE_REPORT.md        # 使用量レポート
├── WORKFLOWS.md           # ワークフロー詳細説明
└── game-history/          # 日付別履歴
```

## 📚 ドキュメント

- [⁠`WORKFLOWS.md`](./WORKFLOWS.md) - 自動化ワークフローの詳細
- [⁠`GAME_STATUS.md`](./GAME_STATUS.md) - リアルタイムゲーム状況
- [⁠`CONSOLE_LOGS.md`](./CONSOLE_LOGS.md) - コンソール出力
- [⁠`USAGE_REPORT.md`](./USAGE_REPORT.md) - GitHub Actions使用量
- [⁠`SECURITY.md`](./SECURITY.md) - セキュリティポリシー

## ✨ 特徴詳細

### 🔧 ルールベース自動改善

- `console.log` の削除
- `var` を `const` に変更
- 非効率なループの最適化
- メモリクリーンアップの自動追加

### 🎲 ランダム実験

毎週以下のいずれかを自動追加：
- 📊 パフォーマンスモニター
- 🧭 パスファインディングキャッシュ
- 🎯 スマートスポーン優先度
- 🛡️ タワー最適化
- ⚡ エネルギー効率トラッキング

### 🆕 自動ロール作成

毎週新しいロールを自動生成して `main.js` に統合します。

### 🔧 エラー自動修正

エラー検出時に自動で：
1. エラーパターンを分析
2. 修正を適用
3. PRでレビュー依頼
4. 安全なら自動マージ

## 👨‍💻 貢献

改善提案やバグ報告はIssuesでお願いします。

## 📝 ライセンス

MIT License

---

**Enjoy your fully automated Screeps experience!** 🎮🤖

*完全無料・完全自動・ゼロメンテナンス*
