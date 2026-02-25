# 🔒 Security Policy

## ✅ 修正完了しました！

**2026-02-25**: 全てのCode Injection脆弱性を修正しました。

### 修正内容

1. ✅ **auto-fix-issues.yml** - Code injection修正
2. ✅ **auto-label-issues.yml** - Code injection修正  
3. ✅ **prevent-null-errors.yml** - Permissions追加 & Code injection修正

## 🛡️ セキュリティ対策

### 多層防御システム

This project uses multiple layers of security:

#### Layer 1: CodeQL Analysis
- 毎日自動スキャン
- Critical/High/Mediumの脆弱性検出
- JavaScriptセキュリティパターン

#### Layer 2: Dependency Scanning
- Dependabotによる自動更新
- 脆弱性のある依存関係検出
- 自動PR作成

#### Layer 3: Secret Scanning
- APIキー、トークンの漏洩防止
- コミット前チェック
- 自動アラート

#### Layer 4: Workflow Security
- 最小権限の原則
- `permissions`明示的に定義
- Code injection対策

#### Layer 5: Code Quality
- 自動フォーマット
- Nullチェック強制
- エラーハンドリング

## 🐛 修正された脆弱性

### Code Injection (Critical) - 全件修正済み

**問題**: ユーザー入力がシェルコマンドに直接渡される

**Before** (危険):
```yaml
run: |
  TITLE="${{ github.event.issue.title }}"
  echo "$TITLE" | grep -qi "error"  # ❗ Injection可能
```

**After** (安全):
```yaml
run: |
  # jqで安全にパース
  gh issue view $ISSUE_NUMBER --json title,body | jq -r '.title' > content.txt
  grep -qi 'error' content.txt  # ✅ 安全
```

**修正方法**:
1. ユーザー入力をファイルに書き込み
2. ファイルを解析
3. GitHub CLIを使用

### Workflow Permissions (Medium) - 修正済み

**問題**: `permissions`が明示的に定義されていない

**修正**:
```yaml
permissions:
  contents: read      # 読み取りのみ
  issues: write       # Issue更新
  pull-requests: write # PR作成
```

## 📊 セキュリティステータス

| カテゴリ | ステータス | 最終チェック |
|---------|---------|------------|
| Code Injection | ✅ 修正済み | 2026-02-25 |
| Permissions | ✅ 修正済み | 2026-02-25 |
| Dependencies | ✅ 最新 | 毎日 |
| Secrets | ✅ 安全 | 連続監視 |
| Code Quality | ✅ 優良 | 毎日 |

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

❌ **DON'T**:
- ハードコードしない
- コミットに含めない
- ログに出力しない

### 3. 依存関係

✅ **DO**:
- 定期的に更新
- Dependabot有効化
- 脆弱性スキャン

❌ **DON'T**:
- 古いバージョン使用
- 未検証パッケージ

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
- **毎週**: Nullエラーチェック
- **毎月**: 依存関係レビュー
- **連続**: Secretスキャン

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
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## ✅ セキュリティステータスサマリ

**現在の状況**: ✅ **安全**

- Code Injection: ✅ 修正済み
- Permissions: ✅ 設定済み
- Secrets: ✅ 保護済み
- Dependencies: ✅ 最新
- Monitoring: ✅ アクティブ

**最終更新**: 2026-02-25

---

**🔒 安全な開発環境を維持しています！**
