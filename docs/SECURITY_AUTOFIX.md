# Security Autofix System (Task 5)

Dependabot / npm audit ベースの **無料** セキュリティ自動修正パイプラインです。

## 構成

| ファイル                                 | 役割                                      |
| ---------------------------------------- | ----------------------------------------- |
| `.github/workflows/security-autofix.yml` | 定期監査・修正PR作成・Dependabot PRテスト |
| `scripts/security-autofix.mjs`           | `npm audit fix` + レポート生成            |
| `.github/dependabot.yml`                 | セキュリティグループ・ラベル連携          |

## フロー

1. **毎日 12:00 JST** — `npm audit` → 自動修正 → テスト → 変更があれば PR 作成
2. **未解決の moderate 以上** — 重複しない Issue を起票（タスク1連携用）
3. **Dependabot PR** — マージ前に `npm test` を実行し PR にコメント

## 手動実行

```bash
# GitHub Actions → Security Autofix → Run workflow
```

## ローカル検証

```bash
npm ci
node scripts/security-autofix.mjs
npm test
```

## 他タスクとの境界

- **タスク3 (Antigravity)**: 本 PR のマージは `feature/perfect-merge` 完成後に相互レビューで実施
- **タスク1 (OpenCode)**: 未解決 Issue は Guardian 監視の入力として利用可能
