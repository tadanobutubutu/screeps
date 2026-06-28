# ACE (Autonomous Colony Engine) – 自律進化型 Screeps AI

**バッジ**  
[![Build Status](https://github.com/yourorg/ace-ai/workflows/CI/badge.svg)](https://github.com/yourorg/ace-ai/actions)  
[![License](https://img.shields.io/github/license/yourorg/ace-ai.svg)](LICENSE)  
[![Coverage](https://img.shields.io/codecov/c/github/yourorg/ace-ai/main.svg)](https://codecov.io/gh/yourorg/ace-ai)  
[![AI Powered](https://img.shields.io/badge/AI-Powered-blue)](https://github.com/yourorg/ace-ai/actions)

---

## 1. ACEの概要  
Screeps はリアルタイム・RTS プラットフォーム。ACE はその上に置かれ、  
自律進化・自己修復のサイクルを実装した次世代 AI エンジンです。  
内部で Nature‑Inspired アルゴリズムと深層学習を駆使し、  
人間の介入を最小化しつつ環境変化に瞬時に適応します。

* 29 本の自動化ワークフロー  
* 10 の動的ロール（`warrior`, `builder`, `labber` 等）  
* 25,645 行のコード

---

## 2. システムアーキテクチャ (詳細)

ACE は **Guardian → Auto‑Coder → Governance** の三位一体ループで構成されます。  
各フェーズは自動化ツールと AI モデルが協働し、連続的インテグレーションの枠を超えて実行されます。

```mermaid
flowchart TD
    subgraph Guardian
        G1[監視セル]
        G2[Gitleaks & CodeQL]
        G3[Jest Unit Tests]
        G