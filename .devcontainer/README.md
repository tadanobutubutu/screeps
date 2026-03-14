# Screeps + Aider on GitHub Codespaces

この設定でCodespacesを起動すると、AiderとNode.jsが自動でインストールされます。

## セットアップ

1. GitHubリポジトリの「Code」→「Codespaces」→「Create codespace on main」
2. APIキーをCodespacesのSecretsに登録しておく
   - GitHub Settings → Codespaces → New secret
   - `ANTHROPIC_API_KEY` または `OPENAI_API_KEY`

## Aiderの使い方

```bash
# 特定のファイルを編集
aider main.js role.harvester.js

# 全JSファイルを対象に
aider *.js

# モデルを指定
aider --model claude-3-5-sonnet-20241022 main.js
```

## よく使うコマンド

```
/add role.builder.js   # ファイルを追加
/drop main.js          # ファイルを外す
/diff                  # 変更差分を確認
/undo                  # 直前の変更を取り消し
/exit                  # 終了
```
