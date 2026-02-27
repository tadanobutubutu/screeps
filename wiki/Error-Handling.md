# エラーハンドリング

3層エラーハンドリングシステム:

## レイヤー1: ゲーム内検出
`utils.logging.js` を使用してエラーをMemory.logsに記録

## レイヤー2: 自動修正
GitHub Actionsが15分ごとにエラーを検出し、修正を適用

## レイヤー3: しきい値監視
エラー率を監視し、必要に応じてエスカレーションを提案

詳細については、[ERROR_HANDLING.md](../ERROR_HANDLING.md)を参照してください。

---

[ホーム](./Home) | [前へ: ユーティリティ](./Utilities) | [次へ: トラブルシューティング](./Troubleshooting)
