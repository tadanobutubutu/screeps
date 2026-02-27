# はじめに

このガイドでは、Screeps AI自動化システムのセットアップと実行方法を説明します。

## 前提条件

1. SteamでScreepsゲームを購入済み
2. GitHubアカウント
3. Gitの基本的な知識

## セットアップ手順

### 1. GitHub同期設定（必須）

1. [Screeps.com](https://screeps.com) にアクセスし、Steamアカウントでログイン
2. **アカウント設定** > **Git** に移動
3. **GitHubに接続** をクリック
4. GitHubアクセスを承認
5. リポジトリを選択: `tadanobutubutu/screeps`
6. ブランチを設定: `main`
7. **保存** をクリック

これだけです！基本機能にはAPIトークンは不要です。

### 2. APIトークン設定（任意）

GitHubでリアルタイムの統計とコンソールログを確認するには:

1. Screeps.com > **アカウント設定** > **APIアクセス** に移動
2. **トークンを生成** をクリック
3. トークンをコピー
4. GitHubリポジトリに追加:
   - **Settings** > **Secrets and variables** > **Actions** に移動
   - **New repository secret** をクリック
   - 名前: `SCREEPS_PROD_TOKEN`
   - 値: [トークンを貼り付け]
   - **Add secret** をクリック

### 3. 最初のスポーン

1. Screepsゲームを開く
2. ワールドマップでルームを選択
3. **スポーン** をクリック
4. 自動化システムが自動的に開始されます

## 仕組み

### デプロイフロー

```
mainブランチにプッシュ
  |
GitHub Actions
  - コードフォーマット
  - セキュリティスキャン
  - エラーチェック
  |
Screepsが自動同期（5〜10分）
  |
ゲーム内でコードが実行
```

### 監視フロー

```
ゲーム内でエラー発生
  |
Memory.logsに記録
  |
GitHub Actionsが検出（15分）
  |
自動修正を適用
  |
PRを作成してマージ
  |
自動的にデプロイ
```

## セットアップの確認

### GitHub同期の確認

```bash
# 小さな変更を加える
echo "# Test sync" >> README.md
git add README.md
git commit -m "Test sync"
git push origin main

# 5〜10分待ってScreepsコンソールを確認
```

### ゲーム内の確認

Screepsコンソールを開く:

```javascript
// 現在のティックを確認
Game.time

// クリープ数を確認
Object.keys(Game.creeps).length

// 最近のログを確認
Memory.logs.slice(-10)

// エラーを確認
Memory.logs.filter(l => l.level === 'error')
```

## 次のステップ

- [アーキテクチャ概要](./Architecture-Overview)を読んでシステムを理解する
- [自動化システム](./Automation-Systems)で自動実行されるものを確認する
- [ロールシステム](./Role-System)でクリープの動作を理解する
- [エラーハンドリング](./Error-Handling)でエラー管理を確認する

## ヘルプが必要ですか？

- [トラブルシューティング](./Troubleshooting)を確認
- [よくある質問](./FAQ)を読む
- [イシュー](https://github.com/tadanobutubutu/screeps/issues)を作成

---

[ホーム](./Home) | [次へ: アーキテクチャ概要](./Architecture-Overview)
