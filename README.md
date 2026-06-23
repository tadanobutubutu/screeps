# ACE (Autonomous Colony Engine)

![GitHub Workflow Status](https://github.com/<ユーザー>/<リポジトリ>/workflows/CI/badge.svg) ![License](https://img.shields.io/github/license/<ユーザー>/<リポジトリ>) ![Coverage](https://img.shields.io/endpoint?url=https://coveralls.io/repos/github/<ユーザー>/<リポジトリ>/badge.json) ![AI Powered](https://img.shields.io/badge/AI-powered-yes-brightgreen)

ACE は **自律進化・自己修復** を核に持つ Screeps 開発プラットフォームです。  
既に 29 の自動化ワークフローと 10 の動的ロールを構築し、コードは 25,645 行に達します。  
各エージェントが 24 時間体制で統合され、安心かつ継続的に AI を駆使してコードベースを進化させます。   

---

## 1. ACE の概要

- **ビジョン**  
  Screeps サーバー上で動く Colony を、AI の力で完結に管理し、ユーザーがコードを書くだけで自動運用、検証、改善が完結する環境を実現します。  
- **特徴**  
  - **自律** – すべての Issue と PR が AI が把握し、必要な修正を行います。  
  - **自己修復** – コードのバグ、テスト失敗、セキュリティリスクが発見されるとすぐに対処。  
  - **拡張性** – 10 の動的ロール（エージェントは Cloud 日本語を想定して設計されています）は追加・削除が簡単です。  

---

## 2. システムアーキテクチャ (詳細)

ACE は **Guardian → Auto‑Coder → Governance** の 3 つのエージェントで構成され、以下のような継続的ループを形成します。  

| フェーズ | 主要なタスク | 生成されるアウトプット | 受け取る入力 |
|----------|--------------|------------------------|--------------|
| Guardian | コードベース、CI／CD の状態監視 | Issue  (安全性・品質告知) | リポジトリの全イベント |
| Auto‑Coder | Issue に対してコード修正・テスト作成 | PR (修正とテスト) | Issue と既存コード |
| Governance | PR 試合・マージ・ブランチ整理 | README 更新、変更履歴 | PR の成果 |

上記のプロセスは ```mermaid``` で可視化し、外部リンクにて示すとします。（コードブロックは省略されているため、リンク先に描画される Mermaid 画像を参照してください。)

```
URL: https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggdGFnIFtQXSBOd19XIFxuICBtZSBmaWxlIGVuYW1lclxuICBkZWNvbW1lbmNlIC0tPiAgL3JvZGVmdC91c2VyZXJzXHUwMnxuICBtZSBmcmVkIC0tPiBwaGVuaW5nIC0tPiBtZSBtYW5hZ2VzXHxuICBtZSBhbGwgIC0