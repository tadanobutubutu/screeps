# 🎮 Screeps AI - 完全自動化リポジトリ

> **API不要・GitHub Syncモード** - 完全無料・完全自動・ゼロメンテナンス

[![GitHub Actions](https://img.shields.io/badge/Automation-GitHub%20Actions-blue)](https://github.com/tadanobutubutu/screeps/actions)
[![GitHub Sync](https://img.shields.io/badge/Mode-GitHub%20Sync-green)](https://docs.screeps.com/commit.html)
[![Free Forever](https://img.shields.io/badge/Cost-¥0%20Forever-brightgreen)](https://github.com/pricing)
[![No API](https://img.shields.io/badge/API-Not%20Required-orange)](./SETUP.md)

## 🚀 特徴

- ✅ **API完全不要**: GitHub Syncで自動同期
- 💰 **完全無料**: パブリックリポジトリはGitHub Actions無制限
- 🤖 **完全自動**: エラー修正・コード改善・セキュリティスキャン
- 🔄 **完全放置**: 何もしなくてOK
- 🔒 **安全**: 多層セキュリティ監視
- 🆕 **自動拡張**: 新機能・新ロールが週次で追加

## 📡 GitHub Syncモード

**APIトークン不要！**

```
GitHubリポジトリ (main)
  ↓ push
GitHub Actions
  ↓ 自動整形・エラーチェック
Screepsが自動同期
  ↓ 5-10分
ゲーム内で実行
```

**メリット**:
- ✅ トークン管理不要
- ✅ APIレート制限なし
- ✅ セットアップ簡単
- ✅ 完全無料

## ⚡ クイックスタート

### 1. 🔗 GitHub連携

1. [Screeps.com](https://screeps.com) でログイン
2. Account Settings → Git → Connect to GitHub
3. このリポジトリ `tadanobutubutu/screeps` を選択
4. Branch: `main` を選択
5. Save

### 2. 🎮 スポーン

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
- 🌍 explorer - 周达探査

**自動追加予定** (毎週月曜):
- 🛡️ defender - 防衛
- ⛏️ miner - 固定採掘
- 🏴 claimer - 領土拡張
- 🌎 remoteHarvester - 遠隔採取

## 📊 ゲーム状況の確認

### Screepsコンソールで

```javascript
// 統計情報
Game.time              // 現在tick
Game.gcl.level         // GCLレベル
Object.keys(Game.creeps).length  // クリープ数

// エラー確認
Memory.logs.filter(l => l.level === 'error')

// ログ統計
require('utils.logging').getStats()
```

### GitHubで

- 📊 [GAME_STATUS.md](./GAME_STATUS.md) - ステータス
- 📝 [CONSOLE_LOGS.md](./CONSOLE_LOGS.md) - ログ
- 💰 [USAGE_REPORT.md](./USAGE_REPORT.md) - 使用量
- 🔒 [SECURITY_REPORT.md](./SECURITY_REPORT.md) - セキュリティ

## 📚 ドキュメント

- [⁠`SETUP.md`](./SETUP.md) - 詳細セットアップ手順
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
- ✅ API: 不要
- ✅ 外部サービス: 不要

**総コスト: ¥0**

## ❓ FAQ

**Q: APIトークンは必要？**  
A: 不要です！GitHub Syncを使用します。

**Q: コストは？**  
A: 完全無料です！

**Q: 何もしなくていい？**  
A: はい！完全放置でOK。

**Q: エラーが起きたら？**  
A: 15分以内に自動修正されます。

**Q: セキュリティは？**  
A: 5層防御システムで毎日監視。

## 👨‍💻 貢献

Issues・PR歓迎！

## 📝 ライセンス

MIT License

---

## 🎉 まとめ

✅ **API不要** - GitHub Syncで自動同期  
✅ **完全無料** - 永久に無料  
✅ **完全自動** - エラー修正・コード改善  
✅ **完全放置** - 何もしなくてOK  
✅ **安全安心** - 多層セキュリティ  

**楽しんでください！** 🎮🤖✨

*GitHub Sync Mode - No API Tokens Required - Completely Free Forever*
