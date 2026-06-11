# 🪐 Screeps AI: Autonomous Colony Engine (ACE)

[![Screeps League](https://img.shields.io/badge/Screeps-World%20Ranked-ff6b6b.svg?style=for-the-badge&logo=screeps&logoColor=white)](https://screeps.com/)
[![Workflows](https://img.shields.io/badge/Workflows-32%20Active-00b894.svg?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/)
[![Roles](https://img.shields.io/badge/Creep%20Roles-10%20Dynamic-0984e3.svg?style=for-the-badge)](https://github.com/)
[![Files](https://img.shields.io/badge/Source%20Files-133%20Modules-6c5ce7.svg?style=for-the-badge)](https://github.com/)
[![License](https://img.shields.io/badge/License-MIT-dfe6e9.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **完全自律型。自己修復機能搭載。**
> `Screeps AI: ACE` は、限られたリソースと過酷な環境下で、人間の介入を一切必要とせずに帝国を拡大・防衛するために設計された、次世代のScreeps自律制御AIです。

---

## 🚀 プロジェクト概要

本プロジェクトは、32の高度な自動化ワークフローと10の特化型動的ロール、そして133に及ぶ洗練されたモジュール群から構成される、完全非同期・イベント駆動型のScreeps AIエンジンです。

静的な定数や単純な優先度キューによる意思決定を排し、リアルタイムの環境分析に基づいた「能動的な自己適応」を実現しています。

---

## ⚡ 主要システムとコアテクノロジー

### 🧠 Ultimate Automation (イシュー・コンフリクト・リゾルバー)

ACEの心臓部には、室内のボトルネック、敵対的な侵入、リソースの枯渇、さらにはクリープ間の経路衝突をリアルタイムに検知・解消する **「Ultimate Automation」** システムが組み込まれています。

- **自律的競合解決:** ルーム内のマイニング効率や物流グリッドを監視し、デッドロック（立ち往生）が発生した場合は即座に移動優先度を動的に再配分します。
- **自律復旧ポリシー:** スポーンの機能停止や完全全滅（Wipeout）シナリオを検知すると、AIは自動的に最優先の「ブートストラップ・ワークフロー」を起動し、最小限のリソースから瞬時に帝国を再建します。

### 🛡️ 最新アップデート: AI Sentinel & Dynamic Role Generation

従来の静的な監視ループを廃止し、自律的な意志決定モデルへと進化を遂げました。

- **AI Sentinel (AI センチネル):** ルーム全体の状況（脅威レベル、経済指数、エネルギー変換効率）をミリ秒単位でプロファイリングする高度な監視レイヤー。
- **動的ロール生成 (Dynamic Role Generation):** 静的に定義されたCreepの役割を廃止。AI Sentinelが現在のボトルネックを分析し、**10の基本ロール**からその瞬間に最も必要とされる性質を組み合わせた最適ハイブリッド・クリープを動的に生成・タスクアサインします。

---

## 📊 システム統計 (System Metrics)

| メトリクス             | ステータス / 数量     | 役割と影響                                                                  |
| :--------------------- | :-------------------- | :-------------------------------------------------------------------------- |
| **自動化ワークフロー** | `32 Workflows`        | 資源調達、防衛、建設、市場取引、リモートマイニング等の自律制御ループ        |
| **クリープロール**     | `10 Dynamic Roles`    | AI Sentinelによってリアルタイムに挙動がチューニングされる動的エージェント群 |
| **ソースファイル数**   | `133 Files`           | モジュール化されたクリーンなTypeScript/JavaScriptアーキテクチャ             |
| **意思決定エンジン**   | `Ultimate Automation` | スレッド間の競合・デッドロックをミリ秒以下で解決する自律型調停器            |

---

## 🛠️ システムアーキテクチャ
