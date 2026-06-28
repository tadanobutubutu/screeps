# ACE (Autonomous Colony Engine) – Screeps AI プロジェクト  
![Build Status](https://github.com/screeps-ai/ace/actions/workflows/ci.yml/badge.svg)  
![License](https://img.shields.io/github/license/screeps-ai/ace.svg)  
![Coverage](https://img.shields.io/codecov/c/github/screeps-ai/ace.svg)  
![NPM Version](https://img.shields.io/npm/v/screeps-ai.svg)  
![AI‑Powered](https://img.shields.io/static/v1?label=Powered&message=AI&color=brightgreen)  

---

## ACE の概要  
ACE は、Screeps コミュニティの自律進化を実現する AI‑主導型エンジンです。  
- 29 本の自動化ワークフロー  
- 10 本の動的ロール  
- 25 645 行のコード  

24 時間をかけて自己修復と学習を繰り返し、コードベースを常に最適化します。  

---

## システムアーキテクチャ (詳細)  

``mermaid
graph TD
  subgraph Guardian
    G1(Gitleaks) -->|検知| Co1(自動 Issue 作成)
    G2(CodeQL) --> Co1
    G3(SonarCloud) --> Co1
    G4(Jest) --> Co2(テスト結果)
    G5(Coverage) -.->|100% 目標達成| Co2
  end

  subgraph Auto‑Coder
    Co1 -->|分析| AC1(自動修正)
    AC1 -->|PR 作成| AC2(自動マージ)
    AC2 -->|ブランチ削除| AC3(クリーンアップ)
    Co2 -->|レポート| AC2
  end

  subgraph Governance
    AC2 -->|変更監視| Gov1(README 更新)
    AC2 -->|データ収集| Gov2(動的ロール提案)
    Gov1 -->|自動メンテナンス| G1
    Gov2 -->|CI 設定| G2
  end

  G1 --> AC1
  G5 --> AC2
```

Guardian がコードと CI を監視し、問題を検知すると自動で Issue を作成。  
Auto‑Coder が Issue を解析し、コードを修正・PR を作成、マージ、ブランチ削除まで完結。  
Governance が成果を総括し、README や自動ロールを更新、CI 設定を最適化します。  
これにより、ペダルは止まらず自律的に開発のサイクルが履行されます。  

---

## コアテクノロジー  

- **AI Conflict Resolver**  
  – Git のマージコンフリクトを学習ベースで解消  
  – PR 生成時に最適なマージ戦略を提示  

- **Issue Auto‑Solver**  
  – Natural‑Language‑Processing を用いて Issue 内容を分類  
  – 回避すべきバグ・セキュリティ脆弱性を判定し、パッチを自動生成  

- **Dynamic Role Engine**  
  – ワークフロー実行状況を分析し、最適なロールをリアルタイムで割り当て  
  – 環境変化に応じて 10 本のロールを動的に再構成  

- **Gitty Optimization & README Updater**  
  – Commit メッセージと