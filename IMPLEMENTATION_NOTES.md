# タスク2: Issue 自動解決 PR 作成システム実装ノート

## 実装概要

GitHub Issue を自動的に検出し、Claude AI を使用して Issue を分析し、修正 PR を自動作成するシステムを実装しました。

## 実装ファイル

### 1. `.github/workflows/auto-pr-from-issues.yml`

- **目的**: Issue イベント監視とワークフロー実行
- **トリガー**:
    - Issue opened/reopened
    - 手動実行（workflow_dispatch）
- **処理フロー**:
    1. コードをチェックアウト
    2. Node.js セットアップ
    3. `auto-pr-generator.js` を実行
    4. `add-contributor.js` を実行

### 2. `scripts/auto-pr-generator.js`

- **目的**: Issue 分析と自動 PR 作成
- **主要機能**:
    - Issue 詳細情報の取得（GitHub API）
    - Claude API による Issue 分析
    - 修正コード生成
    - Fix ブランチ作成とコミット
    - PR 作成

**Claude の分析内容**:

- 根本原因の特定
- 重要度評価（critical/high/medium/low）
- 影響を受けるファイルの識別
- 具体的な修正コード提案
- テスト方法の提案

### 3. `scripts/add-contributor.js`

- **目的**: Issue 作成者を自動的に Contributor に追加
- **主要機能**:
    - GitHub API からユーザー情報を取得
    - `.all-contributorsrc` に登録
    - README を自動更新
    - 変更をコミット・プッシュ

### 4. `.github/workflows/test-auto-pr.yml`

- **目的**: PR 作成時の自動検証
- **テスト内容**:
    - スクリプトの構文チェック
    - ESLint によるリント
    - ハードコードされたシークレットの検査
    - ワークフロー定義の検証

### 5. `docs/AUTO_PR_SYSTEM.md`

- **目的**: ユーザー向けドキュメント
- **内容**:
    - システム概要
    - アーキテクチャ図
    - セットアップ手順
    - トラブルシューティング
    - 今後の改善予定

## 技術スタック

| コンポーネント   | 技術                   |
| ---------------- | ---------------------- |
| ワークフロー     | GitHub Actions         |
| API 連携         | GitHub API, Claude API |
| スクリプト言語   | JavaScript (Node.js)   |
| Contributor 管理 | all-contributors       |
| 自動化テスト     | GitHub Actions         |

## 主な特徴

### 1. 外部ユーザー対応

- Issue 作成者の国籍や地域に関係なく対応
- GitHub アカウントがあれば Contributor に追加可能

### 2. AI による知的な分析

- Claude Opus モデルを使用した高度な分析
- 単純なコードサーチ・置換ではなく、セマンティックな理解

### 3. 完全自動化

- Issue 作成から PR 作成、Contributor 追加まで自動
- 人的介入不要

### 4. 検証・テスト機構

- 構文チェック
- セキュリティチェック
- リント検査

## 環境変数設定

GitHub Secrets に以下を設定：

```
ANTHROPIC_API_KEY: {your-api-key}
```

`GITHUB_TOKEN` は GitHub が自動提供

## 使用例

### 例1: バグ Report Issue

**ユーザーが作成した Issue:**

```
Title: Screeps Script crashes when Memory.creeps is undefined
Body:
When I run my creep manager, it crashes with "Cannot read property 'name' of undefined"
The error occurs in main.js line 45
```

**システムの動作:**

1. Claude が Issue を分析
2. Memory.creeps の null チェック不足を特定
3. 修正コード生成：`if (!Memory.creeps) Memory.creeps = {};`
4. `fix/issue-XXX-memory-creeps` ブランチ作成
5. PR #YYY を自動作成
6. Issue 作成者を Contributor に追加

### 例2: Feature Request Issue

システムは機能追加リクエストにも対応します：

1. Claude が要件を理解
2. 実装案を生成
3. 新機能コードを作成
4. テスト方法を提案

## 動作フロー図

```
┌─────────────────────┐
│ User creates Issue  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────┐
│ GitHub Actions Workflow Triggered│
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│ auto-pr-generator.js            │
│  1. Fetch issue details         │
│  2. Send to Claude API          │
│  3. Get analysis & code         │
│  4. Create fix branch           │
│  5. Create PR                   │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│ add-contributor.js              │
│  1. Get user info               │
│  2. Add to .all-contributorsrc  │
│  3. Update README               │
│  4. Commit & push               │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────┐
│ PR Ready for Review │
└─────────────────────┘
```

## セキュリティ考慮事項

### ✅ 実装済み

- API キーを環境変数で管理
- ハードコードされたシークレットなし
- GitHub Token スコープ制限

### ⚠️ 追加検討事項

- Issue コンテンツのサニタイズ（今後）
- レート制限ハンドリング（今後）
- エラーハンドリング強化（今後）

## テスト戦略

### 単体テスト（今後実装予定）

- GitHub API モック
- Claude API モック

### 統合テスト

- テストリポジトリで実行
- 本番運用前の動作確認

### E2E テスト

- 実際の Issue を作成
- 生成される PR を確認

## 今後の改善

### Phase 2

- [ ] Issue テンプレートの自動解析
- [ ] より正確な修正コード生成
- [ ] 複数ファイル修正対応
- [ ] Conflict 自動解決

### Phase 3

- [ ] 修正の品質スコアリング
- [ ] 自動テスト実行
- [ ] CI/CD 統合
- [ ] Notification 機能

### Phase 4

- [ ] 複数言語対応
- [ ] カスタムプロンプト指定
- [ ] Issue の自動分類
- [ ] Priority 判定

## 参考リンク

- [Claude API](https://docs.anthropic.com/en/docs/about-claude/latest-models)
- [GitHub API](https://docs.github.com/en/rest)
- [GitHub Actions](https://docs.github.com/en/actions)
- [all-contributors](https://allcontributors.org/)

## 実装者ノート

このシステムは、開発効率を大幅に向上させることを目標としています。Issue の自動化によって、開発チームは高度な問題解決に専念できます。

セキュリティと品質を最優先としながら、継続的な改善を進めていく予定です。
