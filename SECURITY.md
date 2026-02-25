# 🔒 Security Policy

## ✅ 修正完了しました！

**2026-02-25**: 全てのCode Injection脆弱性を修正し、追加のセキュリティワークフローを導入しました。

## 🛡️ セキュリティシステム

### 6層防御システム

This project uses multiple layers of security:

#### Layer 1: CodeQL Analysis 🔍
- 毎日自動スキャン
- Critical/High/Mediumの脆弱性検出
- JavaScriptセキュリティパターン
- Code injection検出

#### Layer 2: Dependency Review 📚
- **NEW!** PRごとに依存関係レビュー
- 脆弱性のあるパッケージ検出
- ライセンスチェック
- 非推奨パッケージ警告

#### Layer 3: Secret Scanning 🔑
- **NEW!** Gitleaksによるシークレットスキャン
- APIキー、トークンの漏洩検出
- コミット履歴全体をスキャン
- 毎日自動実行

#### Layer 4: Code Quality ✨
- **NEW!** ESLintによるコード品質チェック
- Screeps API対応設定
- 複雑度チェック
- TODO/FIXME検出
- コードメトリクス

#### Layer 5: Dependabot 🤖
- **NEW!** 自動依存関係更新
- GitHub Actions更新
- npmパッケージ更新
- 毎週月曜日自動実行
- グループ更新でPR数削減

#### Layer 6: Workflow Security 🔒
- 最小権限の原則
- `permissions`明示的に定義
- Code injection対策
- 安全なファイル処理

## 📊 セキュリティステータス

| カテゴリ | ステータス | 最終チェック | 頑度 |
|---------|---------|------------|------|
| Code Injection | ✅ 修正済み | 2026-02-25 | 毎プッシュ |
| Permissions | ✅ 修正済み | 2026-02-25 | 毎プッシュ |
| Dependencies | ✅ 自動更新 | 毎週 | 自動 |
| Secrets | ✅ 監視中 | 毎日 | 自動 |
| Code Quality | ✅ 優良 | 2026-02-25 | 毎プッシュ |
| License | ✅ チェック中 | PR毎 | 自動 |

## 🔒 セキュリティベストプラクティス

### 1. Workflowセキュリティ

✅ **DO**:
```yaml
# 安全な方法
permissions:
  contents: read
  
run: |
  gh issue view $NUMBER --json title | jq -r '.title' > file.txt
  grep 'pattern' file.txt
```

❌ **DON'T**:
```yaml
# 危険！
run: |
  TITLE="${{ github.event.issue.title }}"
  echo "$TITLE" | grep 'pattern'
```

### 2. Secret管理

✅ **DO**:
- GitHub Secretsを使用
- `.gitignore`にシークレット追加
- 環境変数で管理
- Gitleaksで定期スキャン

❌ **DON'T**:
- ハードコードしない
- コミットに含めない
- ログに出力しない

### 3. 依存関係

✅ **DO**:
- Dependabot有効化
- 定期的に更新
- 脆弱性スキャン
- 許可ライセンスのみ使用

❌ **DON'T**:
- 古いバージョン使用
- 未検証パッケージ
- GPLライセンス

### 4. コード品質

✅ **DO**:
- ESLint使用
- Nullチェック必須
- エラーハンドリング
- コードレビュー

❌ **DON'T**:
- 警告無視
- エラー無視
- TODO放置

## 🐛 修正された脆弱性

### Code Injection (Critical) - 全件修正済み

**問題**: ユーザー入力がシェルコマンドに直接渡される

**修正方法**:
1. ユーザー入力をファイルに書き込み
2. ファイルを解析
3. GitHub CLIを使用
4. jqでJSONパース

## 🚨 脆弱性報告

### セキュリティ問題を発見した場合

1. **公開しない**: IssueではなくPrivateで報告
2. **GitHub Security Advisories使用**:
   - Security → Advisories → New draft
3. **詳細な情報提供**:
   - 脆弱性の種類
   - 影響範囲
   - 再現手順
   - 推奨修正方法

### 自動対応

セキュリティIssueが作成されると：

1. ✅ 自動ラベル付け (`security`, `urgent`)
2. ✅ 優先度高設定
3. ✅ 自動修正試行 (可能な場合)
4. ✅ 通知送信

## 🛠️ メンテナンス

### 定期チェック

- **毎日**: CodeQLスキャン
- **毎日**: Secretスキャン
- **毎週**: Nullエラーチェック
- **毎週**: Dependabot更新
- **PR毎**: 依存関係レビュー
- **PR毎**: コード品質チェック

### 自動修正システム

セキュリティ問題は自動修正システムで処理：

```
脆弱性検出
  ↓
Issue自動作成
  ↓
ラベル: security, urgent
  ↓
自動修正トリガー
  ↓
PR作成
  ↓
レビュー & マージ
  ↓
解決✅
```

## 📚 参考資料

- [GitHub Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [Gitleaks](https://github.com/gitleaks/gitleaks)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## ✅ セキュリティステータスサマリ

**現在の状況**: ✅ **非常に安全**

- Code Injection: ✅ 修正済み
- Permissions: ✅ 設定済み
- Secrets: ✅ 監視中
- Dependencies: ✅ 自動更新
- Code Quality: ✅ チェック中
- License: ✅ 検証中
- Monitoring: ✅ 24/7

**最終更新**: 2026-02-25

---

**🔒 エンタープライズレベルのセキュリティを維持しています！**
