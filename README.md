# ACE (Autonomous Colony Engine)


<!-- AUTO-PACKAGE-BADGES:START -->
<!-- Auto-generated package badges -->

![npm version](https://img.shields.io/npm/v/screeps-ai?style=flat-square&logo=npm&color=blue) ![npm downloads](https://img.shields.io/npm/dw/screeps-ai?style=flat-square&color=brightgreen) ![npm license](https://img.shields.io/npm/l/screeps-ai?style=flat-square) [![Deployed](https://img.shields.io/badge/deployed-1.0.0-blue?style=flat-square)](https://www.npmjs.com/package/screeps-ai)

<!-- AUTO-PACKAGE-BADGES:END -->
![Build](https://img.shields.io/github/actions/workflow/status/ACE-Project/ace/ci.yml?label=build&logo=github)
![License](https://img.shields.io/github/license/ACE-Project/ace)
![Coverage](https://img.shields.io/codecov/c/github/ACE-Project/ace?label=coverage)
![AI‑Powered](https://img.shields.io/badge/AI-powered-ff69b4)

---

## 1. ACEの概要

``ACE`` は、自己修復と自己進化をキーワードに設計された自動化エンジンです。  
Screeps のコープ内で 29 の自動化ワークフローと 10 の動的ロールを持ち、  
全コードは 25 645 行に及ぶコンパクトな設計。  
開発プロセスは **Guardian ➜ Auto‑Coder ➜ Governance** という三位一体のループで構成され、  
高い信頼性と継続的な改善を実現します。

---

## 2. システムアーキテクチャ (詳細)

### Guardian（監視）
- **セキュリティ**：Gitleaks、CodeQL、SonarCloud を24時間監視。
- **テスト**：Jest でユニットテストを走らせ、必ず 100% 覆盖率を維持。
- **Issue 自動生成**：検出した脆弱性・バグを自動で Issue として起票。

### Auto‑Coder（修復）
- **Issue 分析**：全ての Issue を自然言語処理で分類・優先度付け。
- **コード修正 & テスト生成**：対象ファイルを自動生成し、テストコードを追加。
- **PR の自動作成**：`tadanobutubutu` の署名で PR を作成。コンフリクト解消・自動マージ・ブランチ削除を一括完了。

### Governance（統治）
- **ドキュメント自動更新**：README・CHANGELOG を AI が追跡・更新。
- **ブランチ管理**：不要ブランチを検出し、最適化提案。
- **新動的ロール提案**：現行パフォーマンスとリリース状況から次期ロールを提案。

### 全体フロー

```mermaid
flowchart LR
    A[Guardian] --> B[Auto‑Coder]
    B --> C[Governance]
    C --> A
    subgraph Forces
        A -->|Issue 発生| D[Issue]
        B --+> E[修正コード / テスト]
        E -->|PR 生成| F[CI Pipeline]
        F -->|マージ| G[デプロイ]
        G -->|結果 | B
    end
```

---

## 3. コアテクノロジー

| テクノロジー | 役割 | 実装ポイント |
|---|---|---|
| **AI Conflict Solver** | コンフリクト解消 | GPT‑4 + GitHub API による差分解析 |
| **Issue Auto‑Resolution** | ボード全体の問題解決 | NLP でラベル付け, スクリプト生成 |
| **Dynamic Repo Governance** | ガバナンス自動化 | 統計解析でロール更新、ドキュメントの自動生成 |
| **Code Quality Enforcer** | コーディング基準 | ESLint + Prettier + SonarCloud で自動修正 |
| **Continuous Deployment** | リリースパイプライン | GitHub Actions と Docker Compose で一括デプロイ |

---

## 4. 自律的成果ログ

| 日付 | コミット | AI が行った作業 | 影響 |
|---|---|---|---|
| 2024‑06‑20 | `chore: update npm badge for screeps-ai` | npm バッジを最新版に自動更新 | ビルド時に最新のバージョンを表示 |
| 2024‑06‑21 | `docs: AI‑driven dynamic intelligence update` | ドキュメントを AI が自動生成し、最新の AI 配置を追加 | 開発者の参照性向上 |
| 2024‑06‑25 | `chore(deps): update dependency undici to v8.5.0 [security] (#970)` | 依存ライブラリをセキュリティパッチで更新 | ランタイム脆弱