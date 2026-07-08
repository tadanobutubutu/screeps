# ACE (Autonomous Colony Engine)


<!-- AUTO-PACKAGE-BADGES:START -->
<!-- Auto-generated package badges -->

![npm version](https://img.shields.io/npm/v/screeps-ai?style=flat-square&logo=npm&color=blue) ![npm downloads](https://img.shields.io/npm/dw/screeps-ai?style=flat-square&color=brightgreen) ![npm license](https://img.shields.io/npm/l/screeps-ai?style=flat-square) [![Deployed](https://img.shields.io/badge/deployed-1.0.0-blue?style=flat-square)](https://www.npmjs.com/package/screeps-ai)

<!-- AUTO-PACKAGE-BADGES:END -->
![Build Status](https://img.shields.io/github/actions/workflow/status/YourOrg/ACE/ci.yml?style=for-the-badge&label=Build)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)
![Coverage](https://img.shields.io/coveralls/github/YourOrg/ACE?style=for-the-badge)
![AI‑Powered](https://img.shields.io/badge/Powered%20by%20AI-yes-brightgreen?style=for-the-badge)

---

### ACEの概要

> **自律進化・自己修復の《自動化エージェント》**
> ACE (Autonomous Colony Engine) は、Screeps を構成する自動化ワークフロー 29 本、動的ロール 10 本を備え、25645 行を超えるコードベースを自己管理・進化させる次世代エンジンです。
> 3 つの AI エージェントは「監視 → 修復 → 統治」という永続ループで、プロジェクトを常に最適化します。

---

## システムアーキテクチャ (詳細)

ACE を支える 3 つの柱を可視化します。
**Guardian** が継続監査、**Auto‑Coder** が自動修復、**Governance** が動的統治を行います。

```mermaid
flowchart TD
    subgraph Guard["AI Guardian"]
        A1[GitLeaks]
        A2[CodeQL]
        A3[SonarCloud]
        A4[Jest (Unit)]
        A5[Coverage Agent]
        A1-->A6[issue]
        A2-->A6
        A3-->A6
        A4-->A6
        A5-->A6
        A6-->G(Generate Issue)
    end

    subgraph Coder["AI Auto‑Coder"]
        C1[Issue Analyzer]
        C2[Patch Generator]
        C3[Test Synthesizer]
        C4[PR Maker]
        C5[Merge & Delete]
        G-->C1
        C1-->C2
        C2-->C3
        C3-->C4
        C4-->C5
    end

    subgraph Govern["AI Repo Governance"]
        R1[README Updater]
        R2[ChangeLog Generator]
        R3[Tidy Branches]
        R4[Role Suggestion Engine]
        C5-->R1
        C5-->R2
        C5-->R3
        C5-->R4
    end

    Guard --> Auto
    Auto --> Gov
    Gov --> Guard
```

---

## コアテクノロジー

| カテゴリ | 技術 | 役割 |
|----------|------|------|
| **コンフリクト解消** | **LangChain + OpenAI LLM** | 変更合併時に自然言語解釈で最適合併戦略を導出 |
| **Issue 自動解決** | **GitHub API + Temporal Workflow** | Issue 生成から修正・テスト・PR までをワークフローで自動実行 |
| **README 最適化** | **GraphQL + MDX Parser** | PR 起票時にドキュメントをスキャンし、タグ付け・フォーマット変更を提案 |
| **テスト自動生成** | **ESLint + Jest Template** | バグ検出後、最小限のテストケースを自動生成 |
| **カバレッジ管理** | **Istanbul+SonarCloud Analytics** | 100% 規定まで自動追跡、警告発生時に即座に Issue へ変換 |

---

## 自律的成果ログ

最近のコミットは AI がどのようにプロジェクトを進化させたかを示す代表例です。

| 日付 | コミット | 内容 |
|------|----------|------|
| 2026‑06‑10 | chore: update npm badge for screeps‑ai | ビルドステータスと NPM 版バッジを自動更新。AI がパッケージ環境を検知。 |
| 2026‑06‑12 | docs: AI‑driven dynamic intelligence update | README と Wiki を再構成し、動的ロールの説明を自動生成。 |
| 2026‑06‑14 | chore: update npm badge for screeps‑ai | NPM バ