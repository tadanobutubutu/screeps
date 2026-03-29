# Screeps AI

[Screeps](https://screeps.com/) 向けの自律型 AI Bot。ロールベースのクリープ管理、適応型負荷制御、防衛システム、感情・ゲーミフィケーション機能を搭載しています。

## 主な機能

### ロールシステム

8種類のクリープロールを搭載し、コロニーの状況に応じて自動でスポーンを制御します。

| ロール | 説明 |
|--------|------|
| Harvester | エネルギーの採掘・運搬 |
| Upgrader | コントローラーのアップグレード |
| Builder | 建設サイトの構築 |
| Repairer | 構造物の修理 |
| Transporter | エネルギーの輸送（上級） |
| Scout | マップ偵察（上級） |
| Medic | クリープの回復（上級） |
| Explorer | 未知の部屋の探索（上級） |

### 適応型負荷制御（Adaptive System）

CPU/メモリの使用状況に応じて、動作モードを自動切替します。

- **EMERGENCY** — 最低限の機能のみ（メモリクリーンアップ中心）
- **MINIMAL** — 基本ロール + 防衛
- **NORMAL** — 感情システム・ログ有効化
- **FULL** — ビジュアルエフェクト・ゲーミフィケーション・自動進化すべて有効

### その他のシステム

- **防衛マネージャー** — 敵侵入時の自動防衛
- **感情システム** — クリープが感情を持ち、相互作用する
- **ゲーミフィケーション** — XP・レベル・マイルストーンの追跡
- **メモリビジュアライザー** — メモリ使用量のスナップショット・履歴・バックアップ
- **自動進化** — 長期的な戦略の自動最適化
- **チュートリアルモード** — Screeps チュートリアルの自動進行

## セットアップ

```bash
# 依存関係のインストール
npm install

# ビルド（Rollup）
npm run build

# テスト
npm test
```

### デプロイ

`screeps.yml` にデプロイ設定があります。GitHub の `main` ブランチへの push で自動デプロイが走ります（`.github/workflows/deploy.yml`）。

## コンソールコマンド

ゲーム内コンソールから以下のコマンドが使えます。

```
help()       — コマンド一覧
adaptive()   — 適応システムのダッシュボード
mode(0-3)    — 動作モードの手動切替
e()          — 感情の統計
m()          — メモリ統計
g()          — ゲーミフィケーションダッシュボード
evo()        — 自動進化ダッシュボード
```

## プロジェクト構成

```
main.js                 — エントリーポイント（ゲームループ）
role.*.js               — 各ロールのロジック
defense.manager.js      — 防衛システム
system.adaptive.js      — 適応型負荷制御
utils.*.js              — ユーティリティ（ログ、メモリ、統計など）
gamification.js         — ゲーミフィケーション
auto.evolution.js       — 自動進化
visual.effects.js       — ビジュアルエフェクト
memory.visualizer.js    — メモリビジュアライザー
tutorial.auto.js        — チュートリアル自動化
tests/                  — Jest テスト
wiki/                   — ドキュメント
```

## CI/CD & 自動化

GitHub Actions による自動化が充実しています。

- コード品質チェック（ESLint, SonarCloud）
- セキュリティスキャン（Gitleaks, Checkmarx）
- テスト・カバレッジ（Jest, Codecov）
- 自動デプロイ
- 依存関係の自動更新（Renovate, Dependabot）
- PR の自動ラベリング・自動マージ

詳細は [BOTS.md](BOTS.md)・[WORKFLOWS.md](WORKFLOWS.md) を参照してください。

## ドキュメント

- [Wiki](wiki/) — アーキテクチャ、ロールシステム、トラブルシューティングなど
- [API リファレンス](API_REFERENCE.md)
- [Contributing ガイド](CONTRIBUTING.md)
- [セキュリティポリシー](SECURITY.md)

## ライセンス

CC0-1.0 (パブリックドメイン)
<!-- pr test 1774816593 -->
