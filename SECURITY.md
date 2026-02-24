# 🔒 Security Policy

## 🚨 Reporting a Vulnerability

セキュリティ上の脆弱性を発見した場合は、以下の方法で報告してください：

### 報告方法

1. **GitHub Security Advisories** (推奨)
   - リポジトリの Security タブから "Report a vulnerability" をクリック
   - 非公開で安全に報告できます

2. **Issue** (公開されても問題ない場合)
   - 軽微な問題や改善提案はIssueで報告可能

### 報告する情報

- 📝 **説明**: 脆弱性の詳細
- 🔄 **再現手順**: 可能であれば
- 💥 **影響**: 予想されるリスク
- 🔧 **修正案**: あれば

### 対応タイムライン

- **24時間以内**: 受領確認
- **7日以内**: 初期調査完了
- **30日以内**: 修正または回避策提供

---

## 🛡️ セキュリティ監視システム

このリポジトリは多層的なセキュリティ監視システムを備えています。

### 1️⃣ CodeQL Analysis
**実行**: Push時 + 毎週水曜 21:51 JST

- 🔍 高度な静的コード分析
- 🚨 既知の脆弱性パターン検出
- 📊 Securityタブで結果確認可能

### 2️⃣ Comprehensive Security Monitor
**実行**: Push時 + PR時 + 毎日 3:00 JST

#### 📦 Dependency Scanning
- `npm audit` による依存パッケージの脆弱性チェック
- CVEデータベースとの照合
- Critical/High脆弱性の自動検出

#### 🔑 Secret Scanning
以下のパターンを自動検出：
- APIキーのハードコード
- パスワードの平文保存
- 秘密鍵のリポジトリ内存在
- AWSアクセスキー
- GitHub Personal Access Token

#### 🛡️ Code Security Analysis
危険なコードパターンを検出：
- `eval()` の使用
- `innerHTML` の使用（XSSリスク）
- 動的 `require()` の使用
- 危険なファイル操作

#### 🔐 Workflow Security
GitHub Actionsのセキュリティチェック：
- ハードコードされたSecretの検出
- ピン留めされていないActionの検出
- 過剰な権限設定の確認
- `pull_request_target` の安全性確認

### 📊 Security Report

毎回のスキャン後、`SECURITY_REPORT.md` が生成されます：
- スキャン結果のサマリ
- 発見された問題の詳細
- 推奨される修正方法

---

## 🔒 セキュリティベストプラクティス

### 👨‍💻 開発者向け

#### 1. Secret管理
```javascript
// ❌ ダメな例
const apiKey = "sk-1234567890abcdef";

// ✅ 良い例
const apiKey = process.env.API_KEY;
```

**ルール**:
- 絶対にSecretをコードにハードコードしない
- GitHub Secretsを使用する
- `.env` ファイルは `.gitignore` に追加

#### 2. 依存パッケージ
```bash
# 定期的にアップデート（自動化済み）
npm audit
npm audit fix
```

**ルール**:
- 信頼できるパッケージのみ使用
- 定期的なアップデート
- 脆弱性発見時は迅速に対応

#### 3. コード品質
```javascript
// ❌ 危険
eval(userInput);

// ✅ 安全
const result = safeFunction(userInput);
```

**ルール**:
- `eval()` を使わない
- ユーザー入力は必ず検証・サニタイズ
- 最小権限の原則

#### 4. GitHub Actions
```yaml
# ❌ ダメな例
uses: actions/checkout@master

# ✅ 良い例
uses: actions/checkout@v4
```

**ルール**:
- Actionのバージョンをピン留め
- 必要最小限の権限を付与
- Secretは `${{ secrets.NAME }}` で参照

---

## 📚 サポートされるバージョン

| バージョン | サポート状況 | セキュリティアップデート |
|----------|----------|------------------|
| Latest (main) | ✅ 完全サポート | ✅ 提供されます |
| Previous releases | ⚠️ 部分的 | ⚠️ 重大な問題のみ |
| Archived versions | ❌ 未サポート | ❌ 提供されません |

---

## 🐛 既知の問題と制限事項

### Screeps API依存
- Screeps公式APIに依存しています
- APIトークンはGitHub Secretsで管理されます
- トークンは定期的にローテーションすることを推奨

### GitHub Actionsの制限
- パブリックリポジトリでは無料で利用可能
- 月間実行時間に制限あり（通常問題なし）

---

## 📞 連絡先

### 緊急のセキュリティ問題
- **GitHub Security Advisories** (推奨)
- Repository Issues (公開されてもOKな場合）

### 一般的な問い合わせ
- GitHub Issues
- GitHub Discussions

---

## 🔗 リソース

### 公式ドキュメント
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)

### リポジトリ内ドキュメント
- [`WORKFLOWS.md`](./WORKFLOWS.md) - ワークフロー詳細
- [`README.md`](./README.md) - プロジェクト概要
- `SECURITY_REPORT.md` - 最新のスキャン結果

---

## 🎓 セキュリティチェックリスト

コードをコミットする前に：

- [ ] Secretや認証情報が含まれていないか
- [ ] 新しい依存パッケージは信頼できるか
- [ ] `eval()` や危険な関数を使っていないか
- [ ] ユーザー入力は適切に検証されているか
- [ ] 機密情報は適切に保護されているか

---

**最終更新**: 2026-02-25  
**バージョン**: 2.0

*セキュリティは継続的なプロセスです。定期的にこのドキュメントを確認してください。*
