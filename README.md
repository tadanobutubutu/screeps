# ACE ― Autonomous Colony Engine


<!-- AUTO-PACKAGE-BADGES:START -->
<!-- Auto-generated package badges -->

![npm version](https://img.shields.io/npm/v/screeps-ai?style=flat-square&logo=npm&color=blue) ![npm downloads](https://img.shields.io/npm/dw/screeps-ai?style=flat-square&color=brightgreen) ![npm license](https://img.shields.io/npm/l/screeps-ai?style=flat-square) [![Deployed](https://img.shields.io/badge/deployed-1.0.0-blue?style=flat-square)](https://www.npmjs.com/package/screeps-ai)

<!-- AUTO-PACKAGE-BADGES:END -->
> **Screeps AIプロジェクトの次世代制御系**  
> 29の自動化ワークフロー、10の動的ロール、全コード量 25,645 行。  
> 継続的に 100 % カバレッジを維持しつつ、AI による自己修復と生成を実現。

![Build Status](https://github.com/your-org/ace/actions/workflows/build.yml/badge.svg)  
![License](https://img.shields.io/github/license/your-org/ace)  
![Coverage](https://coveralls.io/repos/github/your-org/ace/badge.svg?branch=main)  
![AI‑Powered](https://img.shields.io/badge/AI-Powered-ff69b4)

---

## 🚀  ACE の概要

- **自律進化** – 元コードベースから創出されたリポジトリ内のロジックを、AI が自ら最適化します。  
- **自己修復** – セキュリティ・テスト・コンフリクト検知の各段階で破損を発見し、即時修復を行います。  
- **動的 API レイヤ** – ゲーム実行時に新しいロールを提案し、環境変化に即応。

ACE は「AI → セキュリティ監視 → コンシステント修復 → ポリシー最適化」の 3 つのフェーズを循環させ、Screeps における開発サイクルを自律化します。

---

## 🏗️  システムアーキテクチャ（詳細）

```mermaid
graph TD
  subgraph Guardian[Guardian]
    G1(Gitleaks) --> G2(CodeQL)
    G2 --> G3(SonarCloud)
    G3 --> G4(Jest)
    G4 --> G5(Coverage@100%)
  end
  subgraph AutoCoder[Auto‑Coder]
    A1(Analyze Issues) --> A2(Generate Code)
    A2 --> A3(Generate Tests)
    A3 --> A4(Commit PR by `tadanobutubutu`)
    A4 --> A5(Merge Auto)
    A5 --> A6(Delete Branch)
  end
  subgraph Governance[Governance]
    V1(Update README/Changelog) --> V2(Clean Unused Branches)
    V2 --> V3(Suggest New Roles)
  end
  G5 -->|Trigger| A1
  A6 -->|Trigger| V1
  V3 -->|Feed Back| G1
```

### 詳細

1. **Guardian 監視フェーズ**  
   - Gitleaks、CodeQL、SonarCloud でコードベース全体を走査し、脆弱性と品質指標を取得。  
   - Jest による 100 % テストカバレッジを自動監視。  
   - 新規 Issue が発生した際は自動で Issues リストにエントリを作成。

2. **Auto‑Coder 修復フェーズ**  
   - GPT‑4 Turbo などの LLM が Issue を解析し、必要コードとテストを生成。  
   - PR を担当者名 `tadanobutubutu` で自動作成し、CI が統合検証。  
   - コンフリクト発生時は再度解析を再試行し、解消後即時マージ。