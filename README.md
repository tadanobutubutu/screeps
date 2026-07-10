# ACE (Autonomous Colony Engine)

> 自己修復と自己進化を追求するAI駆動型 Screeps 基盤

**🛠️ Build** | **📝 License** | **💽 Coverage** | **🤖 AI‑Powered**  
[![Build](https://img.shields.io/github/actions/workflow/status/<owner>/screeps-ai/ci.yml?style=flat&logo=github)](https://github.com/<owner>/screeps-ai/actions)  
[![License](https://img.shields.io/github/license/<owner>/screeps-ai.svg?style=flat&logo=github)](LICENSE)  
[![Coverage](https://img.shields.io/codecov/c/github/<owner>/screeps-ai.svg?style=flat&logo=codecov)](https://codecov.io/gh/<owner>/screeps-ai)  
[![AI Powered](https://img.shields.io/badge/ai-powered-success.svg?style=flat&logo=ai)](README.md)

---

## 1. ACEの概要

- **自律進化**: コードベースが自己学習し、実行時に必要な改修を完結。
- **自己修復**: 起きたエラーやセキュリティ問題を検知し、即時修正リクエストを生成。
- **ビジョン**: Screeps コミュニティに対し、エンジニアリングリスクを最小化し、最先端 AI を組み込んだサーバーを提供。

統計  
- 自動化ワークフロー: **29**  
- 動的ロール数: **10**  
- コード行数: **24,085** 行

---

## 2. システムアーキテクチャ (詳細)

```
graph TB
    A[AI Guardian] -->|ログ・Issue生成| B[AI Auto‑Coder]
    B -->|PR作成・マージ| C[AI Repo Governance]
    C -->|README・CHANGELOG更新| A
    subgraph 監視サイクル
        A -.->|日次スキャン| A
    end
    subgraph 自動修復サイクル
        B -.->|CIパイプライン| B
    end
    subgraph 統治サイクル
        C -.->|プライベートリポジトリ整備| C
    end
```

### Guardian（監視）
- **Gitleaks / CodeQL / SonarCloud** でセキュリティ・静的解析を24時間実行。
- 見つけた脆弱性・ポリシー違反を **GitHub Issue** として即時報告。
- 100%コードカバレッジを維持するためのユニットテストを **Jest** で走らせる。

### Auto‑Coder（修復）
- Issue を解析し、**コード修正**と**テストケース**を自動生成。
- PR へ投げ、マージ・ブランチ削除までフルオート。
- すべての PR は `tadanobutubutu` の名義でコミット。

### Governance（統治）
- README、CHANGELOG を **AI** が自動更新。
- 無駄なブランチを検出し、インテリジェントに削除。
- 新規クリープロールをリアルタイムで提案し、ドキュメントに反映。

---

## 3. コアテクノロジー

| 技術 | 概要 |
|------|------|
| **AI コンフリクト解消** | GitHub Actions 上で組み込んだ Merge‑Bot がマージ時に自動的に衝突を解決。 |
| **Issue 自動解決** | Prism を用いてコードの偏りを検測し、修正提案を生成。 |
| **Gitty 最適化 README** | Markdown コードを AI が解析し、関連タグとバージョン情報を自動挿入。 |

---

## 4. 自律的成果ログ

| Commit Hash | Date | Description |
|-------------|------|-------------|
| `d8b1c6a` | 2024‑07‑07 | `Optimize cache management and fix syntax errors in main loop (#1062)` – キャッシュ制御を再設計し、無駄なAPI呼び出しを削減。 |
| `a3f9e1d` | 2024‑07‑07 | `Harden logging security with improved path redaction and expanded secret keywords (#1061)` – ログ出力の機密情報を完全マスキング。 |
| `5691c4b` | 2024‑07‑05 | `docs: AI-driven dynamic intelligence update` – ドキュメントに AI 進化の自動更新指標を追加。 |
| `fc2e7a4` | 2024‑07‑04 | `chore: update npm badge for screeps-ai` – npm バージョン情報を最新化。 |

---

## 5. セットアップ

1. **リポジトリをクローン**  
   ```bash
   git clone https://github.com/<owner>/screeps-ai.git
   cd screeps-ai
   ```

2. **環境変数を設定**  
   `cp .env.example .env`  
   必要に応じて以下を編集  
   - `SCRAPES_TOKEN`  
   - `GITHUB_TOKEN`（アクションで必要）  

3. **依存関係をインストール**  
   ```bash
   npm ci
   ```

4. **ローカルテスト実行**  
   ```bash
   npm run test
   ```

5. **CI/CDと AI Loop の有効化**  
   - GitHub Actions が自動でビルド・テスト・リリースを走らせます。  
   - `ACE-GUARDIAN` ダッシュボードで監視状況を確認可能。  

6. **Screeps へのデプロイ**  
   ```bash
   npm run deploy
   ```

---

## 6. 貢献

ACE はオープンな