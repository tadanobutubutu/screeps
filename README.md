# 🎮 Screeps AI - 完全自動化リポジトリ

> **ハイブリッドモード** - GitHub Sync + API Stats - 完全無料・完全自動

[![GitHub Actions](https://img.shields.io/badge/Automation-GitHub%20Actions-blue)](https://github.com/tadanobutubutu/screeps/actions)
[![Hybrid Mode](https://img.shields.io/badge/Mode-Hybrid-green)](https://docs.screeps.com/commit.html)
[![Free Forever](https://img.shields.io/badge/Cost-¥0%20Forever-brightgreen)](https://github.com/pricing)
[![API Optional](https://img.shields.io/badge/API-Optional-orange)](./SETUP.md)

## 🚀 特徴

- 🔄 **ハイブリッド**: GitHub Syncデプロイ + API統計
- 📊 **リアルタイム統計**: GCL・CPU・クリープ数
- 📝 **コンソールログ**: GitHubでいつでも確認
- 💰 **完全無料**: パブリックリポジトリはGitHub Actions無制限
- 🤖 **完全自動**: エラー修正・コード改善・セキュリティスキャン
- 🔄 **完全放置**: 何もしなくてOK

## 📊 ハイブリッドモード

**両方のいいとこ取り！**

```
GitHubリポジトリ (main)
  ↓ push
GitHub Actions
  ↓ 自動整形・エラーチェック
Screepsが自動同期 (GitHub Sync)
  ↓ 5-10分
ゲーム内で実行

同時に...

GitHub Actions (15分ごと)
  ↓ APIで統計取得
GAME_STATUS.md 更新
  ↓ リアルタイム統計
CONSOLE_LOGS.md 更新
  ↓ コンソールログ
```

**メリット**:
- ✅ デプロイ: GitHub Sync (トークン不要)
- ✅ 統計: API (リアルタイム)
- ✅ ログ: API (GitHubで確認)
- ✅ セットアップ簡単
- ✅ 完全無料

## ⚡ クイックスタート

### 1. 🔗 GitHub連携 (必須)

1. [Screeps.com](https://screeps.com) でログイン
2. Account Settings → Git → Connect to GitHub
3. このリポジトリ `tadanobutubutu/screeps` を選択
4. Branch: `main` を選択
5. Save

### 2. 🔑 APIトークン設定 (オプション)

**リアルタイム統計・コンソールログを有効にするには**:

1. [Screeps.com](https://screeps.com) → Account Settings → API Access
2. "Generate Token" をクリック
3. トークンをコピー
4. GitHubリポジトリ → Settings → Secrets and Variables → Actions
5. "New repository secret" をクリック
6. Name: `SCREEPS_PROD_TOKEN`
7. Value: [トークンをペースト]
8. "Add secret" をクリック

⚠️ **トークンなしでも動きます** - 統計・ログなしでデプロイのみ

### 3. 🎮 スポーン

1. Screepsで部屋を選ぶ
2. Spawnをクリック
3. 自動化システムが起動！

詳しくは [⁠`SETUP.md`](./SETUP.md) を参照

## 🤖 自動化システム

### 🔧 コード改善 (完全自動)

| 機能 | 頻度 | 説明 |
|------|------|------|
| 🔧 ルールベース最適化 | 6時間ごと | 非効率コードを自動修正 |
| 🎨 自動整形 | 毎日 2:00 | ESLint + Prettier |
| 🎲 ランダム実験 | 毎週日曜 | 新機能をランダム追加 |
| 🆕 ロール自動生成 | 毎週月曜 | 新ロールを自動作成 |

### 🔧 エラー自動修正 (プランB)

```
エラー発生
  ↓ Memory.logsに記録
自動検出 (15分ごと*)
  ↓ パターン分析
修正適用
  ↓ PR自動作成
レビュー
  ↓ 安全なら自動マージ
デプロイ
  ↓ GitHub Sync
解決✅
```

*高負荷時は時間間隔に自動調整

### 🔒 セキュリティ (5層防御)

1. **CodeQL** - 高度な静的分析
2. **Dependency Scan** - 脆弱性チェック
3. **Secret Scan** - 機密情報漏洩検知
4. **Code Pattern** - 危険パターン検知
5. **Workflow Security** - Actionsセキュリティ

詳細: [⁠`SECURITY.md`](./SECURITY.md)

### 💰 使用量自動最適化

- 毎日使用量チェック
- 高負荷時に自動で頻度削減
- 超高負荷時にIssue自動作成

現在の状況: [⁠`USAGE_REPORT.md`](./USAGE_REPORT.md)

## 🐛 実装済みロール

現在 8種類のロールが稼働中：

- 🌾 harvester - エネルギー採取
- ⬆️ upgrader - Controller強化
- 🛠️ builder - 建築
- 🔧 repairer - 修理
- 🔍 scout - 探索
- 💊 medic - 回復
- 🚚 transporter - 輸送
- 🌍 explorer - 周達探査

**自動追加予定** (毎週月曜):
- 🛡️ defender - 防衛
- ⛏️ miner - 固定採掘
- 🏴 claimer - 領土拡張
- 🌎 remoteHarvester - 遠隔採取

## 📊 ゲーム状況の確認

### GitHubで (推奨)

- 📊 [GAME_STATUS.md](./GAME_STATUS.md) - **リアルタイム統計**
  - GCLレベル
  - CPU使用量
  - Credits
  - クリープ数
  - ロール別分布
  
- 📝 [CONSOLE_LOGS.md](./CONSOLE_LOGS.md) - **コンソールログ**
  - 最新50件のログ
  - エラー・警告・情報
  - ログ統計

- 💰 [USAGE_REPORT.md](./USAGE_REPORT.md) - 使用量
- 🔒 [SECURITY_REPORT.md](./SECURITY_REPORT.md) - セキュリティ

### Screepsコンソールで

```javascript
// 統計情報
Game.time
Game.gcl.level
Game.cpu.getUsed()
Object.keys(Game.creeps).length

// エラー確認
Memory.logs.filter(l => l.level === 'error')

// ログ統計
require('utils.logging').getStats()
```

## 📚 ドキュメント

- [⁠`SETUP.md`](./SETUP.md) - 詳細セットアップ手順
- [⁠`ERROR_HANDLING.md`](./ERROR_HANDLING.md) - エラー対応完全ガイド
- [⁠`WORKFLOWS.md`](./WORKFLOWS.md) - ワークフロー詳細
- [⁠`SECURITY.md`](./SECURITY.md) - セキュリティポリシー
- [⁠`LICENSE`](./LICENSE) - MIT License

## ✨ 主な機能

### 🔧 コード最適化
- console.log 削除
- var → const 変換
- ループ最適化
- メモリクリーンアップ

### 🎲 実験機能
- パフォーマンスモニター
- パスファインディングキャッシュ
- スマートスポーン優先度
- タワー最適化

### 🔧 自動修正
- Null参照エラー
- 未定義関数エラー
- 参照エラー

## 💰 コスト

**完全無料・永久無料**

- ✅ GitHub Actions: 無制限 (パブリックリポジトリ)
- ✅ GitHub Sync: 無料
- ✅ API: 無料 (オプション)
- ✅ 外部サービス: 不要

**総コスト: ¥0**

## ❓ FAQ

**Q: APIトークンは必須？**  
A: いいえ！トークンなしでもデプロイは動きます。統計・ログが欲しい場合のみ設定。

**Q: コンソールログをGitHubで見れる？**  
A: はい！APIトークンを設定すればCONSOLE_LOGS.mdで確認できます。

**Q: リアルタイム統計は？**  
A: APIトークン設定でGAME_STATUS.mdに15分ごと更新されます。

**Q: コストは？**  
A: 完全無料です！

**Q: エラーが起きたら？**  
A: 15分以内に自動修正されます。

**Q: 完全放置でいい？**  
A: はい！全て自動です。

## 👨‍💻 貢献

Issues・PR歓迎！

## 📝 ライセンス

MIT License

---

## 🎉 まとめ

✅ **ハイブリッド** - デプロイ + 統計 + ログ  
✅ **完全無料** - 永久に無料  
✅ **完全自動** - エラー修正・コード改善  
✅ **完全放置** - 何もしなくてOK  
✅ **安全安心** - 多層セキュリティ  

**楽しんでください！** 🎮🤖✨

*Hybrid Mode: GitHub Sync Deploy + API Stats & Logs - Completely Free Forever*
