# 🎮 Screeps AI - AI強化完全自動化リポジトリ

> **AIパワーで完全自動化** - GitHub Copilot統合 - 完全無料・ゼロメンテナンス

[![GitHub Actions](https://img.shields.io/badge/Automation-GitHub%20Actions-blue)](https://github.com/tadanobutubutu/screeps/actions)
[![AI Powered](https://img.shields.io/badge/AI-GitHub%20Copilot-purple)](https://github.com/features/copilot)
[![Hybrid Mode](https://img.shields.io/badge/Mode-Hybrid-green)](https://docs.screeps.com/commit.html)
[![Free Forever](https://img.shields.io/badge/Cost-¥0%20Forever-brightgreen)](https://github.com/pricing)

## 🚀 特徴

- 🤖 **AIパワー**: GitHub Copilotがエラー修正・コード改善
- 🔄 **ハイブリッド**: GitHub Syncデプロイ + API統計
- 📊 **リアルタイム統計**: GCL・CPU・クリープ数
- 📝 **コンソールログ**: GitHubでいつでも確認
- 💰 **完全無料**: GitHub Actions無制限
- 🔄 **完全放置**: 何もしなくてOK

## 🤖 AI強化システム

### 1. 🐛 AIエラー自動修正

**GitHub Copilotがエラーを分析・修正**

```
インゲームでエラー発生
  ↓ Memory.logsに記録
AIがエラーを分析 (30分ごと)
  ↓ パターン認識
  ↓ 根本原因特定
  ↓ 最適な修正方法を選択
Copilotが修正を適用
  ↓ コード変更
  ↓ テスト
  ↓ PR作成
レビュー & マージ
  ↓ 自動デプロイ
解決✅
```

**対応可能なエラー**:
- ✅ Null参照エラー
- ✅ 未定義関数
- ✅ 参照エラー
- ✅ ロジックエラー
- ✅ パフォーマンス問題
- ✅ その他あらゆるエラー

### 2. ✨ AIコード改善

**12時間ごとにコード品質を向上**

```
AIがコードを分析
  ↓ メトリクス計測
  ↓ 問題箇所特定
Copilotが改善提案
  ↓ パフォーマンス最適化
  ↓ 可読性向上
  ↓ ベストプラクティス適用
PR作成
  ↓ レビュー
  ↓ マージ
コード品質向上✨
```

**改善項目**:
- 🧹 console.log削除
- ⚡ var→const/let変換
- 📝 JSDocコメント追加
- 🛡️ エラーハンドリング
- 🚀 パフォーマンス最適化
- 🎯 Screepsベストプラクティス

### 3. 🔧 従来型自動修正 (バックアップ)

**パターンマッチングで基本的な修正**

- シンプルなエラーは即座に修正
- AIが必要な場合のバックアップ

## 📊 ハイブリッドモード

**両方のいいとこ取り！**

```
GitHubリポジトリ
  ↓ GitHub Sync (トークン不要)
Screepsゲーム

同時に...

GitHub Actions
  ↓ API (オプション)
GAME_STATUS.md (統計)
CONSOLE_LOGS.md (ログ)
```

## ⚡ クイックスタート

### 1. GitHub連携 (必須)

1. [Screeps.com](https://screeps.com) → Account Settings → Git
2. Connect to GitHub
3. リポジトリ: `tadanobutubutu/screeps`
4. Branch: `main`
5. Save

### 2. APIトークン (オプション)

**統計・ログを有効にするには**:

1. Screeps.com → API Access → Generate Token
2. GitHub Secretsに `SCREEPS_PROD_TOKEN` として設定

### 3. スポーン & 放置

それだけ！あとはAIが全部やります。

## 🤖 自動化システム一覧

| システム | 方式 | 頻度 | 機能 |
|--------|------|------|------|
| 🤖 **AIエラー修正** | Copilot | 30分 | あらゆるエラーをAIが修正 |
| ✨ **AIコード改善** | Copilot | 12時間 | コード品質をAIが向上 |
| 🔧 **パターン修正** | ルール | 15分 | シンプルなエラー修正 |
| 🎨 **自動整形** | ツール | 毎日 | ESLint + Prettier |
| 🎲 **実験機能** | ランダム | 毎週 | 新機能追加 |
| 🆕 **ロール生成** | テンプレート | 毎週 | 新ロール作成 |
| 🔒 **セキュリティ** | 5層防御 | 毎日 | 脆弱性スキャン |
| 💰 **使用量最適化** | 自動 | 毎日 | 負荷管理 |

## 📊 ゲーム状況確認

### GitHubで (推奨)

- 📊 [GAME_STATUS.md](./GAME_STATUS.md) - リアルタイム統計
- 📝 [CONSOLE_LOGS.md](./CONSOLE_LOGS.md) - コンソールログ
- 🐛 [ERROR_HANDLING.md](./ERROR_HANDLING.md) - エラー対応ガイド
- 💰 [USAGE_REPORT.md](./USAGE_REPORT.md) - 使用量

### Screepsコンソールで

```javascript
Game.time              // 現在tick
Game.gcl.level         // GCL
Memory.logs.slice(-10) // 最近10ログ
```

## 🐛 実装済みロール

8種類のロール + AIが適宜追加：

- 🌾 harvester - エネルギー採取
- ⬆️ upgrader - Controller強化
- 🛠️ builder - 建築
- 🔧 repairer - 修理
- 🔍 scout - 探索
- 💊 medic - 回復
- 🚚 transporter - 輸送
- 🌍 explorer - 探査

## 📚 ドキュメント

- [⁠`SETUP.md`](./SETUP.md) - セットアップ手順
- [⁠`ERROR_HANDLING.md`](./ERROR_HANDLING.md) - エラー対応ガイド
- [⁠`WORKFLOWS.md`](./WORKFLOWS.md) - ワークフロー詳細
- [⁠`SECURITY.md`](./SECURITY.md) - セキュリティ

## 💰 コスト

**完全無料・永久無料**

- ✅ GitHub Actions: 無制限
- ✅ GitHub Copilot: 無料 (パブリックリポジトリ)
- ✅ GitHub Sync: 無料
- ✅ API: 無料 (オプション)

**総コスト: ¥0**

## ❓ FAQ

**Q: AIが何をする？**  
A: エラー分析・修正・コード改善を自動で実行。

**Q: 本当に何もしなくていい？**  
A: はい！GitHub連携だけであとはAIが全部やります。

**Q: エラーが起きたら？**  
A: 30分以内にAIが分析・修正します。

**Q: コード品質は？**  
A: AIが12時間ごとに自動改善します。

**Q: コストは？**  
A: 完全無料です！

## 👨‍💻 貢献

Issues・PR歓迎！

## 📝 ライセンス

MIT License

---

## 🎉 まとめ

✅ **AIパワー** - Copilotがエラー修正・コード改善  
✅ **ハイブリッド** - デプロイ + 統計 + ログ  
✅ **完全無料** - 永久に無料  
✅ **完全自動** - AIが全部やる  
✅ **完全放置** - 何もしなくてOK  
✅ **安全安心** - 5層セキュリティ  

**楽しんでください！** 🎮🤖✨

*AI-Powered Complete Automation - GitHub Copilot Integration - Completely Free Forever*
