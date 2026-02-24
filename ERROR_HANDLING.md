# 🐛 エラーハンドリングシステム

## 🎯 概要

このリポジトリは3層のエラーハンドリングシステムを備えています。

---

## 🔄 エラーハンドリングフロー

### レイヤー 1: インゲーム検知

```javascript
// Screepsゲーム内
エラー発生
  ↓
logger.error("エラーメッセージ")
  ↓
Memory.logsに保存
  ↓
最大100件保持
```

**ファイル**: `utils.logging.js`

### レイヤー 2: 自動検出・修正 (プランB)

```
GitHub Actions (15分ごと*)
  ↓
Memory.logsをチェック
  ↓
エラーあり？
  ↓ YES
DETECTED_ERRORS.json作成
  ↓
エラーパターン分析
  ↓
修正適用
  ↓
PR自動作成
  ↓
安全（3個以下）なら自動マージ
  ↓
デプロイ (GitHub Sync)
```

*高負荷時は時間間隔に自動調整

**ファイル**: 
- `.github/workflows/game-monitor-15min.yml`
- `.github/workflows/auto-fix-errors.yml`

### レイヤー 3: 閾値監視・エスカレーション

```
6時間ごとにエラー数をカウント
  ↓
10個以上？
  ↓ YES
自動修正成功率をチェック
  ↓
50%未満？
  ↓ YES
APIモードへの切り替えを提案
  ↓
Issue自動作成
```

**ファイル**: `.github/workflows/error-threshold-monitor.yml`

---

## 🔧 修正されるエラーパターン

### 1. Null参照エラー

**検出**:
```
Cannot read property 'xxx' of undefined
Cannot read property 'xxx' of null
```

**修正**:
```javascript
// Before
obj.property

// After
obj && obj.property
```

### 2. 未定義関数

**検出**:
```
xxx is not a function
```

**修正**:
- 関数が存在するかチェック
- `require`が正しいか確認
- 関数名のスペルミスを修正

### 3. 参照エラー

**検出**:
```
ReferenceError: xxx is not defined
```

**修正**:
- 変数宣言を追加
- スペルミスを修正
- `require`を追加

---

## 🚨 緊急時の対応

### シナリオ 1: エラーが止まらない

**ステップ**:

1. **現状確認**
   ```bash
   # ERROR_STATS.mdを確認
   cat ERROR_STATS.md
   ```

2. **エラー詳細を確認**
   ```bash
   cat DETECTED_ERRORS.json
   ```

3. **自動修正PRを確認**
   - GitHubのPull Requestsタブを開く
   - `auto-fix`ラベルを確認

4. **APIモードへ切り替え** (必要なら)
   - Actions → "Emergency: Restore API Mode"
   - Run workflow
   - Reason: "Too many errors"

### シナリオ 2: GitHub Syncが動かない

**確認項目**:

1. ScreepsでGitHub連携が有効か
2. 正しいリポジトリを選択しているか
3. ブランチが`main`になっているか

**解決策**:

```
Screeps Account Settings → Git
  → Disconnect
  → 再接続
  → リポジトリ選択
  → Branch: main
```

**それでもダメなら**:

- APIモードへ切り替え
- 即座に動きます

### シナリオ 3: 自動修正が失敗し続ける

**自動対応**:

6時間後に自動で：
- エラー数をカウント
- 自動修正成功率を計算
- 10個以上 & 成功率50%未満 → Issue作成
- APIモードへの切り替えを提案

**手動対応**:

1. Issueを確認
2. 提案されたAPIモードへ切り替え
3. または手動でエラー修正

---

## 🔄 APIモードへの切り替え

### 方法 1: 自動 (推奨)

1. [Actions](../../actions/workflows/emergency-api-restore.yml)を開く
2. "Run workflow" をクリック
3. Reasonを選択:
   - GitHub Sync not working
   - Too many errors
   - Need real-time monitoring
   - Manual decision
4. "Run workflow" をクリック
5. 完了！

### 方法 2: APIトークン設定

トークンを設定するだけで自動切り替え：

1. https://screeps.com でログイン
2. Account Settings → API Access
3. Generate Token
4. GitHub Secretsに `SCREEPS_PROD_TOKEN` として設定
5. 次回のワークフローで自動検知

### 🔙 GitHub Syncに戻す

```bash
# ファイルを戻す
mv .github/workflows/game-monitor-15min.yml.disabled .github/workflows/game-monitor-15min.yml
rm .github/workflows/game-monitor-api.yml

# コミット
git add -A
git commit -m "Restore GitHub Sync mode"
git push
```

---

## 📈 モニタリング

### 確認すべきファイル

1. **DETECTED_ERRORS.json** - 検出されたエラー
2. **ERROR_STATS.md** - エラー統計
3. **APPLIED_FIXES.json** - 適用された修正
4. **CONSOLE_LOGS.md** - コンソールログ (APIモードのみ)

### Screepsコンソールで

```javascript
// 最近10件のエラー
Memory.logs.filter(l => l.level === 'error').slice(-10)

// ログ統計
require('utils.logging').getStats()

// ログをクリア (必要なら)
require('utils.logging').clear()
```

---

## ❓ FAQ

### Q: エラーが発生したらどうなる？

A: 自動で以下が実行されます：
1. Memory.logsに記録 (即座)
2. GitHubで検知 (15分以内)
3. エラー分析 (数分)
4. 修正適用 (数分)
5. PR作成 (数分)
6. レビュー・マージ (自動or手動)
7. デプロイ (自動)

### Q: 自動修正が失敗したら？

A: 6時間後に自動で：
- エラー率をチェック
- 高すぎる場合はAPIモードを提案
- Issueが自動作成されます

### Q: APIモードは必須？

A: **いいえ**、オプションです。
- GitHub Syncで十分動きます
- APIモードはエラー多発時の保険
- いつでも戻せます

### Q: エラーが10個超えたら？

A: 自動で：
- ERROR_STATS.mdが更新されます
- 6時間後にAPIモードを提案するかも
- Issueが作成されます

### Q: 完全放置でいい？

A: **はい！**
- エラー検知: 自動
- エラー修正: 自動
- API切り替え提案: 自動
- 全て自動です

---

## 🎉 まとめ

✅ **3層防御** - インゲーム・自動修正・閾値監視  
✅ **完全自動** - エラー検知から修正まで  
✅ **柔軟対応** - GitHub Sync ⇔ APIモード  
✅ **安心設計** - エラー多発でも対応可能  

**何が起きても大丈夫です！** 🛡️✨
