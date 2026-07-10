# ✨ ACE (Autonomous Colony Engine) – 自律型スクリープレイヤーAI


<!-- AUTO-PACKAGE-BADGES:START -->
<!-- Auto-generated package badges -->

![npm version](https://img.shields.io/npm/v/screeps-ai?style=flat-square&logo=npm&color=blue) ![npm downloads](https://img.shields.io/npm/dw/screeps-ai?style=flat-square&color=brightgreen) ![npm license](https://img.shields.io/npm/l/screeps-ai?style=flat-square) [![Deployed](https://img.shields.io/badge/deployed-1.0.0-blue?style=flat-square)](https://www.npmjs.com/package/screeps-ai)

<!-- AUTO-PACKAGE-BADGES:END -->
> “自動化を設計し、コードを自ら改善するシステム。 未来は私たちの芽生えたAIに委ねられる。”  

[![Build Status](https://github.com/your-org/ace/workflows/ci/badge.svg)](https://github.com/your-org/ace/actions)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Coverage](https://img.shields.io/coveralls/your-org/ace/master.svg)](https://coveralls.io/github/your-org/ace)
[![AI Powered](https://img.shields.io/badge/AI-Powered-ff69b4.svg)](https://your-org.github.io/ace)

---

## 🚀 ACE の概要

ACE（Autonomous Colony Engine）は、スクリーپのオンラインバトルを自律的に強化するAIプロジェクトです。  
- **34** 台の自動化ワークフローを駆使し、コードベースを 24 時間年間監視  
- **10** 種類の動的ロール（Guardian、Auto‑Coder、Governance など）で機能を網羅  
- **24,658 行** のコードで、単一リポジトリにて自己修復・自己進化を実現  

コアは 3 つのエージェントにより構成され、インフラはすべて非同期に動作しながら自己完結的な振る舞いを行います。

---

## 🧩 システムアーキテクチャ (詳細)

```
graph TD
    A[AI Guardian] -->|Issue Creation| B[AI Auto-Coder]
    B -->|Pull Request| C[AI Repo Governance]
    C -->|Doc Update| A
    A -->|Security Scan| A
    B -->|Test Run| B
    C -->|Branch Cleanup| C
```

🔶 **Guardian(監視)**  
- **Gitleaks + CodeQL + SonarCloud** を実行し、コード改ざんやセキュリティホールを検知。  
- **Jest** でユニットテストを走らせ、カバレッジを 100% へ促進。  
- 発見次第、GitHub Issue を自動生成し、ステータスを `security` とラベル付。

🔶 **Auto‑Coder(修復)**  
- 生成された Issue を解析し、**自動修正・テスト作成**を実施。  
- コンフリクト解消は GPT‑系の LLM により行い、**PR を自動マージ**。  
- マージ後は **ブランチをクリーンアップ**、CI/CD パイプラインを再実行。

🔶 **Governance(統治)**  
- README・CHANGELOG を **AI が動的に生成**し、変更履歴を即時反映。  
- 不要ブランチの検出と削除、**新規クリープロールの提案**を行い、リポジトリを最適化。  

リーン・リード・オフィス（LoC）からアジャイル栄華を繰り返す。各エージェントは独立しつつも、**トリガー・ループ**で継続的にリファクタリングを実行。

---

## ⚙️ コアテクノロジー

| テクノロジー | 役割 | 実装ポイント |
|--------------|------|--------------|
| **LLM (Generative Language Model)** | コード生成、コンフリクト解決、ドキュメント更新 | `ai-coder-service` 内の `gen_code.py` |
| **GitHub Actions** | CI/CD、Issue/PR 自動化 | `ci.yml`, `auto-coder.yml`, `governance.yml` |
| **OpenAI API** | プロンプトエンジン | 外部接続パラメータは `secrets.GITHUB_TOKEN` と `OPENAI_API_KEY` |
| **SonarCloud/CodeQL** | 静的解析 | `sonar-project.properties` でプロジェクト全体をカバー |
| **Supabase** | フロントエンドに統計・ログを提供 | `supabase-js` v2.110.2 (現在) |
| **Coveralls** | コードカバレッジ 100% 目標 | `.coveralls.yml` |
| **Dependabot** | セキュリティ自動修正 | `dependabot.yml` で `security` & `version-update` |
| **Docauto** | README・CHANGELOG 生成 | `docs/generate.py` |

これらが連携し、`issue