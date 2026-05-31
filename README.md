# 🎮 Screeps AI - 完全自動化リポジトリ

> Screeps AI code repository with **full automation** - no API keys required!

[![GitHub Actions](https://img.shields.io/badge/Automation-GitHub%20Actions-blue)](https://github.com/tadanobutubutu/screeps/actions)
[![Workflows](https://img.shields.io/badge/Workflows-36-green)](.github/workflows)
[![Roles](https://img.shields.io/badge/Roles-9-orange)](./)
[![Lines](https://img.shields.io/badge/Lines-7192-purple)](./)

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

### 📋 稼働中のワークフロー (36個)

- **AI Code Maintenance** (`ai-code-maintenance.yml`) - 定期実行
- **👤 Auto Assign Issues and PRs** (`auto-assign.yml`) - イベント駆動
- **🆕 Auto Create New Roles** (`auto-create-roles.yml`) - 定期実行
- **Auto Merge PRs - Force Merge All** (`auto-merge-pr.yml`) - 定期実行
- **📚 Auto Update Documentation** (`auto-update-docs.yml`) - イベント駆動
- **🔖 Auto Zenodo DOI Release** (`auto-zenodo-release.yml`) - 定期実行
- **🚀 Unified CI (Lint, Test, Coverage & Analysis)** (`ci.yml`) - 定期実行
- **🔍 Dependency Review** (`dependency-review.yml`) - イベント駆動
- **Deploy GitHub Pages Dashboard** (`deploy-pages.yml`) - イベント駆動
- **Deploy to Screeps PTR** (`deploy-ptr.yml`) - イベント駆動
- **Deploy to Screeps PTR** (`deploy.yml`) - イベント駆動
- **✨ Discussion Auto-Implement** (`discussion-auto-implement.yml`) - イベント駆動
- **🚨 Emergency: Restore API Mode** (`emergency-api-restore.yml`) - 定期実行
- **🚨 Error Threshold Monitor** (`error-threshold-monitor.yml`) - 定期実行
- **Fix undici - Regenerate package-lock.json** (`fix-undici-lockfile.yml`) - イベント駆動
- **⏱️ Game Monitor (Hybrid Mode)** (`game-monitor-15min.yml`) - 定期実行
- **gitStream** (`gitstream.yml`) - イベント駆動
- **🎫 Issue Management** (`issue-management.yml`) - イベント駆動
- **JAIPilot Generate** (`jaipilot-generate.yml`) - イベント駆動
- **Junie** (`junie.yaml`) - イベント駆動
- **Label Sync** (`label-sync.yml`) - イベント駆動
- **OpenCode AI Agent** (`opencode.yml`) - イベント駆動
- **🏷️ PR Auto Labeler** (`pr-labeler.yml`) - イベント駆動
- **🎲 Random Experiment** (`random-experiment.yml`) - 定期実行
- **Release Agent** (`release-agent.yml`) - イベント駆動
- **📦 Release Drafter** (`release-drafter.yml`) - イベント駆動
- **Gitleaks** (`secret-scanning.yml`) - イベント駆動
- **Sentinel Tests** (`sentinel-tests.yml`) - イベント駆動
- **🗑️ Stale Issue and PR Management** (`stale.yml`) - 定期実行
- **Supabase KeepAlive** (`supabase-keepalive.yml`) - 定期実行
- **Test Minimal Workflow** (`test-minimal.yml`) - イベント駆動
- **📚 Update Wiki** (`update-wiki.yml`) - イベント駆動
- **Validate Versions** (`validate-versions.yml`) - イベント駆動
- **📊 Weekly Quality Report** (`weekly-quality-report.yml`) - 定期実行
- **👋 Welcome Bot** (`welcome.yml`) - イベント駆動
- **🔧 Workflow Health Monitor** (`workflow-health-monitor.yml`) - 定期実行

詳しくは [`WORKFLOWS.md`](./WORKFLOWS.md) を参照してください。

## 🐛 実装済みロール (9個)

1. **attacker** - `role.attacker.js`
2. **builder** - `role.builder.js`
3. **explorer** - `role.explorer.js`
4. **harvester** - `role.harvester.js`
5. **medic** - `role.medic.js`
6. **repairer** - `role.repairer.js`
7. **scout** - `role.scout.js`
8. **transporter** - `role.transporter.js`
9. **upgrader** - `role.upgrader.js`

## 📈 統計情報

- 📄 **JSファイル数**: 37
- 📝 **総コード行数**: 7192
- 🔄 **ワークフロー数**: 36
- 🎭 **ロール数**: 9

*最終更新: 2026-05-31*

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
├── .github/workflows/     # 自動化ワークフロー (36個)
├── role.*.js              # クリープロール (9個)
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
- [`META-CHANGELOG.md`](./META-CHANGELOG.md) - システム変更履歴
- [`SECURITY.md`](./SECURITY.md) - セキュリティポリシー

## ✨ 主な機能

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

## 👨‍💻 貢献

改善提案やバグ報告はIssuesでお願いします。

## 📝 ライセンス

MIT License

---

**Enjoy your fully automated Screeps experience!** 🎮🤖

*このREADMEは自動更新されます - 最終更新: 2026-05-31T17:31:53.222Z*
