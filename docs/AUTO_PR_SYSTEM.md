# 🤖 Issue 自動解決 PR 作成システム

## 概要

このシステムは、GitHub Issues を自動的に検出し、Claude AI を使用して Issue を分析し、自動で修正 PR を作成します。

## 機能

- ✅ Issue の自動監視（Issue 作成時）
- ✅ Claude AI による Issue 分析
- ✅ 自動で修正コードを生成
- ✅ 修正ブランチと PR を自動作成
- ✅ Issue 作成者を Contributor に追加
- ✅ 外部ユーザーの Issue にも対応

## アーキテクチャ

```
GitHub Issue (opened) 
    ↓
[GitHub Actions Workflow]
    ↓
[Issue Details を取得]
    ↓
[Claude API で分析]
    ↓
[修正コード生成]
    ↓
[Fix ブランチ作成 + コミット]
    ↓
[PR 作成]
    ↓
[Issue 作成者を Contributor 追加]
```

## 環境変数

GitHub Actions ワークフローで以下を設定してください：

```yaml
ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## ワークフロー

### 1. Issue 検出トリガー

ワークフロー: `.github/workflows/auto-pr-from-issues.yml`

**トリガー条件:**
- Issue が新規作成された時 (`issues.opened`)
- Issue が再オープンされた時 (`issues.reopened`)
- 手動実行時（`workflow_dispatch` で issue_number を指定）

### 2. Issue 分析と PR 生成

スクリプト: `scripts/auto-pr-generator.js`

**処理フロー:**
1. Issue の詳細情報を GitHub API から取得
2. Claude API に Issue を送信し、分析を要求
3. Claude が以下を生成：
   - 根本原因分析
   - 重要度評価（critical/high/medium/low）
   - 影響を受けるファイルの特定
   - 修正コード
   - テスト方法の提案
4. 修正をファイルに適用
5. Fix ブランチを作成（`fix/issue-{number}-{slug}`）
6. コミット作成
7. PR を作成

### 3. Contributor 追加

スクリプト: `scripts/add-contributor.js`

**処理フロー:**
1. Issue 作成者の情報を GitHub API から取得
2. `.all-contributorsrc` に Contributor として登録
3. README を更新（all-contributors CLI を使用）
4. 変更をコミット・プッシュ

## Claude API の分析プロンプト

システムは以下の JSON 形式での回答をリクエストします：

```json
{
  "rootCause": "根本原因の分析",
  "severity": "critical|high|medium|low",
  "affectedFiles": ["path/to/file1.js", "path/to/file2.js"],
  "suggestedFix": {
    "description": "修正の簡潔な説明",
    "changes": [
      {
        "file": "path/to/file.js",
        "change": "変更内容の説明",
        "code": "実際のコード"
      }
    ]
  },
  "testSuggestion": "修正後のテスト方法"
}
```

## セットアップ手順

### 1. GitHub Secrets を設定

リポジトリの Settings → Secrets and variables → Actions で以下を追加：

```
ANTHROPIC_API_KEY = <your-api-key>
```

`GITHUB_TOKEN` は GitHub が自動的に提供します。

### 2. ワークフローが実行されるのを確認

新しい Issue を作成すると、ワークフローが自動的にトリガーされます。

## 制限事項と注意点

- 🔄 **複雑な Issue**: 極めて複雑な Issue では、Claude が完全な修正コードを生成できない場合があります。その場合、PR はドラフト状態で作成されます。
- 🔐 **セキュリティ**: Issue の内容には機密情報が含まれないようにしてください（Claude API に送信されます）。
- ⚠️ **自動修正の精度**: 生成されたコードは必ずレビューしてください。自動生成なので 100% の正確性は保証されません。
- 🚫 **External Issues**: 外部リポジトリの Issue には対応していません。

## トラブルシューティング

### ワークフローが実行されない

1. `.github/workflows/auto-pr-from-issues.yml` の permissions を確認
2. `ANTHROPIC_API_KEY` が正しく設定されているか確認
3. Actions タブでワークフローの実行ログを確認

### PR が作成されない

1. Claude の回答が JSON 形式でない可能性があります
2. Issue の内容が Claude にとって処理困難な形式の可能性があります
3. GitHub API エラーがないか確認してください

### Contributor が追加されない

1. `.all-contributorsrc` が存在するか確認
2. ユーザー情報が取得可能か確認
3. README の構文を確認

## 今後の改善予定

- [ ] Issue テンプレートの自動検出
- [ ] より高度なコンフリクト解決アルゴリズム
- [ ] Issue カテゴリ別の自動分類
- [ ] 修正の信頼度スコアリング
- [ ] 複数言語対応
- [ ] カスタム分析プロンプトの指定機能

## 参考リンク

- [GitHub Issues API](https://docs.github.com/en/rest/issues)
- [Claude API Documentation](https://docs.anthropic.com/en/docs/about-claude/latest-models)
- [all-contributors](https://allcontributors.org/)
