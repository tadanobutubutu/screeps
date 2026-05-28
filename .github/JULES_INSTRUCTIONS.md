# Jules AI Agent Instructions

> **重要**: このファイルはJulesおよびすべてのAIコーディングエージェントへの指示書です。必ずこのルールに従ってください。

---

## ❌ 絶対にやってはいけないこと

### GitHub Actions のバージョン番号を勝手に変更しない

以下のアクションは **現在存在する最新バージョン** が決まっています。
存在しないバージョンに「アップグレード」しないでください。

| Action                                 | ✅ 正しい最新バージョン | ❌ 絶対に使わない        |
| -------------------------------------- | ----------------------- | ------------------------ |
| `actions/checkout`                     | `@v4`                   | `@v5`, `@v6`, `@v7` 以上 |
| `actions/setup-node`                   | `@v4`                   | `@v5`, `@v6` 以上        |
| `actions/setup-python`                 | `@v5`                   | `@v6`, `@v7` 以上        |
| `actions/upload-artifact`              | `@v4`                   | `@v5`, `@v6` 以上        |
| `actions/download-artifact`            | `@v4`                   | `@v5`, `@v6` 以上        |
| `actions/cache`                        | `@v4`                   | `@v5`, `@v6` 以上        |
| `actions/github-script`                | `@v7`                   | `@v8`, `@v9` 以上        |
| `peter-evans/create-pull-request`      | `@v7`                   | `@v8` 以上               |
| `stefanzweifel/git-auto-commit-action` | `@v5`                   | `@v6` 以上               |

### ルール

- ワークフローファイル (`.github/workflows/*.yml`) のアクションバージョンを変更する場合は、**必ずGitHub公式マーケットプレイスで実在を確認**してから変更する。
- 確認せずにバージョン番号を推測して書き換えることを**禁止**する。
- 現在動作しているバージョン番号は変更しない（変更する理由がない限り）。

---

## ✅ コード改善時のガイドライン

### Screeps AIコードの改善

- `src/` ディレクトリ内のJavaScriptファイルを改善する際は、Screeps APIの制約を考慮すること。
- CPU効率を最優先にすること（Screepsは1ティックあたりのCPU制限がある）。
- メモリ使用量を最小限にすること。
- 変更後も既存の動作を破壊しないこと。

### ワークフローの改善

- ワークフローを改善する際は、既存の動作を維持しつつ改善すること。
- シークレット名（`GEMINI_API_KEY`, `SCREEPS_TOKEN` など）は勝手に変更しない。
- `runs-on: ubuntu-latest` は変更しない。

---

## 📋 このリポジトリの構成

- `src/` - Screeps AIのメインコード
- `.github/workflows/` - GitHub Actionsワークフロー（多数）
- `package.json` - Node.js設定

---

_このファイルはAIエージェントへの指示を目的として作成されています。_
