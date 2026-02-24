# 🚀 Screeps 完全セットアップガイド

## 🎯 概要

このリポジトリは **GitHub Sync** を使用しています。
**APIトークンは不要**です！

---

## ✨ 特徴

- ✅ **API不要**: トークン設定不要
- ✅ **自動同期**: pushで即座にデプロイ
- ✅ **完全無料**: GitHub Actions無制限
- ✅ **完全自動**: エラー修正・コード改善

---

## 📝 前提条件

1. ✅ ScreepsをSteamで購入済み
2. ✅ GitHubアカウント
3. ✅ このリポジトリをfork/clone

---

## 🚀 セットアップ手順

### ステップ 1: ScreepsでGitHubを連携

1. **Screeps公式サイトにログイン**
   - https://screeps.com
   - Steamアカウントでログイン

2. **Account Settingsを開く**
   - 右上のプロフィールアイコンをクリック
   - "Account Settings" を選択

3. **GitHubを連携**
   - "Git" タブをクリック
   - "Connect to GitHub" ボタンをクリック
   - GitHubで認証を許可

4. **リポジトリを選択**
   - "Sync from repository" で `tadanobutubutu/screeps` を選択
   - ブランチ: `main`
   - "Save" をクリック

### ステップ 2: 動作確認

1. **コードを少し変更**
   ```bash
   # README.mdに1行追加
   echo "Test sync" >> README.md
   git add README.md
   git commit -m "Test GitHub Sync"
   git push origin main
   ```

2. **5-10分待つ**

3. **Screepsコンソールで確認**
   ```javascript
   // コードが更新されているか確認
   Game.time
   ```

### ステップ 3: 初回スポーン

1. **Screepsで部屋を選ぶ**
   - Worldマップを開く
   - 空いている部屋を選択
   - "Spawn" をクリック

2. **自動化システムが起動**
   - Harvesterが自動スポーン
   - エネルギー採取開始
   - Controllerアップグレード開始

---

## 🤖 自動化システムの仕組み

### 📡 GitHub Syncモード

```
GitHubリポジトリ (mainブランチ)
  ↓
  push
  ↓
GitHub Actions
  - コード整形
  - エラーチェック
  - セキュリティスキャン
  ↓
  自動コミット
  ↓
Screepsが自動同期 (5-10分ごと)
  ↓
ゲーム内でコード実行
```

### 🔧 エラー自動修正

```
ゲーム内でエラー発生
  ↓
logger.error() で記録
  ↓
Memory.logsに保存
  ↓
GitHub Actionsが検知 (15分ごと)
  ↓
エラーパターンを分析
  ↓
修正を適用
  ↓
PR作成
  ↓
安全なら自動マージ
  ↓
Screepsに自動同期
  ↓
エラー解決
```

---

## 📊 ゲーム状況の確認方法

### Screepsコンソールで

```javascript
// 現在の統計
console.log('Tick:', Game.time);
console.log('GCL:', Game.gcl.level);
console.log('CPU:', Game.cpu.getUsed(), '/', Game.cpu.limit);
console.log('Creeps:', Object.keys(Game.creeps).length);

// ロール別カウント
const roles = {};
for (let name in Game.creeps) {
  const role = Game.creeps[name].memory.role;
  roles[role] = (roles[role] || 0) + 1;
}
console.log('Roles:', JSON.stringify(roles, null, 2));

// 最近10件のログ
Memory.logs.slice(-10).forEach(log => {
  console.log(`[${log.level}] ${log.message}`);
});

// エラーのみ
Memory.logs.filter(l => l.level === 'error').forEach(log => {
  console.log(`ERROR [${log.time}]:`, log.message);
});

// ログ統計
const logger = require('utils.logging');
console.log('Log stats:', JSON.stringify(logger.getStats(), null, 2));
```

### GitHubで

- 📊 [GAME_STATUS.md](./GAME_STATUS.md) - ステータス情報
- 📝 [CONSOLE_LOGS.md](./CONSOLE_LOGS.md) - コンソールログ (自動生成)
- 💰 [USAGE_REPORT.md](./USAGE_REPORT.md) - 使用量レポート
- 🔒 [SECURITY_REPORT.md](./SECURITY_REPORT.md) - セキュリティレポート

---

## 🔧 トラブルシューティング

### 問題: コードが同期されない

**確認事項**:
1. ScreepsでGitHubが連携されているか
2. 正しいリポジトリを選択しているか
3. ブランチが `main` になっているか

**解決方法**:
```
Screeps Account Settings → Git
  → Disconnect
  → 再接続
```

### 問題: クリープがスポーンしない

**確認事項**:
1. エネルギーが足りているか
2. Spawnがブロックされていないか
3. `main.js` が正しくロードされているか

**解決方法**:
```javascript
// Screepsコンソールで確認
Game.spawns['Spawn1'].spawning
Game.spawns['Spawn1'].room.energyAvailable
```

### 問題: エラーが発生している

**確認方法**:
```javascript
// エラーログを確認
Memory.logs.filter(l => l.level === 'error')
```

**自動修正**:
- 15分以内に自動検知
- PRが自動作成されます

---

## 🎓 使い方

### 基本: 完全放置

何もしなくてOK！
- ✅ コード自動改善
- ✅ エラー自動修正
- ✅ 新機能自動追加
- ✅ セキュリティ自動スキャン

### 中級: コード編集

```bash
# ローカルで編集
git clone https://github.com/tadanobutubutu/screeps.git
cd screeps

# ファイルを編集
code role.harvester.js

# pushするだけ
git add .
git commit -m "Update harvester logic"
git push origin main

# 5-10分待つ → ゲーム内に反映
```

### 上級: 新ロール追加

```bash
# 新しいロールファイル作成
cp role.harvester.js role.defender.js

# 編集してpush
git add role.defender.js
git commit -m "Add defender role"
git push origin main

# main.jsに自動統合されます
```

---

## 📚 リファレンス

- [README.md](./README.md) - プロジェクト概要
- [WORKFLOWS.md](./WORKFLOWS.md) - ワークフロー詳細
- [SECURITY.md](./SECURITY.md) - セキュリティポリシー

---

## ❓ FAQ

### Q: APIトークンは必要？
A: **不要**です！GitHub Syncを使用します。

### Q: コストは？
A: **完全無料**です！GitHub Actions無制限。

### Q: 何もしなくていい？
A: **はい**！完全放置でOK。

### Q: エラーが起きたら？
A: **自動修正**されます。

### Q: ゲーム状況はどう確認？
A: Screepsコンソールで `Memory.logs` を確認。

---

**セットアップ完了です！楽しんでください！** 🎮✨
