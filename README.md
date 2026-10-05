# 🎮 Screeps AI and Automation

> Screeps AI bot and supporting GitHub Actions automation.

[![Workflow files](https://img.shields.io/badge/Workflow%20files-33-green)](./.github/workflows)
[![Role files](https://img.shields.io/badge/Role%20files-10-orange)](#-ロールファイル-10個)
[![Root JS lines](https://img.shields.io/badge/Root%20JS%20lines-6094-purple)](#-統計情報)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 特徴

- 🤖 **自動化ワークフロー**: メンテナンス、デプロイ、レポートなどのタスクをGitHub Actionsで実行
- 🔑 **設定要件**: 外部サービスを使うワークフローでは必要なトークンやSecretsを設定
- 📊 **ゲーム状況の記録**: 状況レポートをリポジトリ上で確認
- 🆕 **ロール作成の提案**: スケジュール実行でロール作成Issueを作成

## 📊 ゲーム状況

**現在の状況を確認**: [`GAME_STATUS.md`](./GAME_STATUS.md)

毎時のスケジュール実行で更新を試みるゲーム状況レポート：
- 👤 プレイヤー情報 (GCL, CPU, Credits)
- 🏰 所有部屋の状況
- 🐛 クリープ統計
- 💾 メモリ使用率

## 🤖 自動化システム

### 📋 ワークフローファイル (33個)

- **AI Auto-Coder (Full Lifecycle Agent)** (`ai-autocoder.yml`)
- **AI Code Maintenance** (`ai-code-maintenance.yml`)
- **AI Repo Governance (Intel & Maintenance)** (`ai-governance.yml`)
- **AI Sentinel (Ultimate Security & Quality Shield)** (`ai-guardian.yml`)
- **👤 Auto Assign Issues and PRs** (`auto-assign.yml`)
- **Continuous Quality & Coverage Monitor** (`auto-issue.yml`)
- **Auto Merge PRs - Force Penetration (Instant CI)** (`auto-merge-pr.yml`)
- **Instant Merge Single Incoming PR** (`auto-merge-single-pr.yml`)
- **🤖 Auto PR from Issues** (`auto-pr-from-issues.yml`)
- **🔖 Auto Zenodo DOI Release** (`auto-zenodo-release.yml`)
- **🔍 Dependency Review** (`dependency-review.yml`)
- **Deploy GitHub Pages Dashboard** (`deploy-pages.yml`)
- **Deploy to Screeps PTR** (`deploy.yml`)
- **🚨 Emergency: Restore API Mode** (`emergency-api-restore.yml`)
- **Fix undici - Regenerate package-lock.json** (`fix-undici-lockfile.yml`)
- **⏱️ Game Monitor (Hybrid Mode)** (`game-monitor-15min.yml`)
- **gitStream** (`gitstream.yml`)
- **🎫 Issue Management** (`issue-management.yml`)
- **JAIPilot Generate** (`jaipilot-generate.yml`)
- **Label Sync** (`label-sync.yml`)
- **🏷️ PR Auto Labeler** (`pr-labeler.yml`)
- **🎲 Random Experiment** (`random-experiment.yml`)
- **Release Agent** (`release-agent.yml`)
- **📦 Release Drafter** (`release-drafter.yml`)
- **Security Autofix (Dependabot & npm audit)** (`security-autofix.yml`)
- **🗑️ Stale Issue and PR Management** (`stale.yml`)
- **Supabase KeepAlive** (`supabase-keepalive.yml`)
- **🧪 Test Auto PR System** (`test-api.yml`)
- **🧪 Test Auto PR System** (`test-auto-pr.yml`)
- **TestDriver.ai Tests** (`testdriver.yml`)
- **📚 Update Wiki** (`update-wiki.yml`)
- **Validate Versions** (`validate-versions.yml`)
- **📊 Weekly Quality Report** (`weekly-quality-report.yml`)

詳しくは [`WORKFLOWS.md`](./WORKFLOWS.md) を参照してください。

## 🐛 ロールファイル (10個)

1. **attacker** - `role.attacker.js`
2. **builder** - `role.builder.js`
3. **explorer** - `role.explorer.js`
4. **harvester** - `role.harvester.js`
5. **healer** - `role.healer.js`
6. **medic** - `role.medic.js`
7. **repairer** - `role.repairer.js`
8. **scout** - `role.scout.js`
9. **transporter** - `role.transporter.js`
10. **upgrader** - `role.upgrader.js`

## 📈 統計情報

- 📄 **ルート直下のJSファイル数**: 43
- 🔄 **ワークフローファイル数**: 33
- 🎭 **ロールファイル数**: 10
- 📝 **ルート直下のJS行数**: 6094

*最終更新: 2026-10-03*

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
├── .github/workflows/     # 自動化ワークフロー (33個)
├── role.*.js              # クリープロール (10個)
├── utils.*.js             # ユーティリティ関数
├── main.js                # メインループ
├── deploy.js              # デプロイスクリプト
├── GAME_STATUS.md         # ゲーム状況レポート
├── WORKFLOWS.md           # ワークフロー詳細説明
└── game-history/          # 日付別履歴
```

## 📚 ドキュメント

- [`WORKFLOWS.md`](./WORKFLOWS.md) - 自動化ワークフローの詳細
- [`GAME_STATUS.md`](./GAME_STATUS.md) - ゲーム状況レポート
- [`META-CHANGELOG.md`](./META-CHANGELOG.md) - システム変更履歴
- [`SECURITY.md`](./SECURITY.md) - セキュリティポリシー

## ✨ 主な機能

### 🔧 ルールベース自動改善

- `console.log` の削除
- `var` を `const` に変更
- 非効率なループの最適化
- メモリクリーンアップの自動追加

### 🎲 ランダム実験

毎週、次の候補から1つを選び、同じ変更がまだない場合に `main.js` への追加を試みます：
- 📊 パフォーマンスモニター
- 🧭 パスファインディングキャッシュ
- 🎯 スマートスポーン優先度
- 🛡️ タワー最適化
- ⚡ エネルギー効率トラッキング

### 🆕 自動ロール作成

毎週、新しいロールの追加を提案するIssueを作成します（ロール自体の自動生成・統合ではありません）。

## 👨‍💻 貢献

改善提案やバグ報告はIssuesでお願いします。

## 📝 ライセンス

MIT License

---

**Enjoy your Screeps experience!** 🎮🤖

*このREADMEは生成スクリプトで更新されます - 最終更新: 2026-10-03T15:48:17.069Z*
