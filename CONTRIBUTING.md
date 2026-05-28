# 🤝 Contributing to Screeps AI

ご貢献いただきありがとうございます！

## 🚀 開発の流れ

1. リポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m '✨ feat: add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## 📏 コーディング規約

- **コミットメッセージ**: [Conventional Commits](https://www.conventionalcommits.org/) に従う
    - `✨ feat:` 新機能
    - `🐛 fix:` バグ修正
    - `📚 docs:` ドキュメント
    - `🔧 chore:` メンテナンス
    - `♻️ refactor:` リファクタリング
    - `🧪 test:` テスト
- **JavaScript**: CommonJS (`require`/`module.exports`)
- **テスト**: Jest を使用

## 🧪 テスト

```bash
npm test           # テスト実行
npm run test:coverage  # カバレッジ付き
```

## 📁 ファイル構成

- `role.*.js` - クリープロール定義
- `utils.*.js` - ユーティリティ関数
- `main.js` - メインゲームループ
- `tests/` - テストファイル

## ❓ 質問

Discussionsで質問してください！
