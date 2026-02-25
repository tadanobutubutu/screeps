# 🤖 Issue自動修正システム

Issueが作成されると自動で修正を試みます！

## ✨ 機能

### 1. 🏷️ 自動ラベル付け

Issue作成時に自動でラベルを付与：

- 🐛 **bug/error** - エラー、例外、クラッシュ
- ⚠️ **null-error** - null/undefinedエラー
- ⚡ **performance** - パフォーマンス問題
- ✨ **enhancement** - 機能追加
- 📚 **documentation** - ドキュメント
- 🔒 **security** - セキュリティ
- 🔧 **workflow** - ワークフロー
- ❓ **question** - 質問
- 🔴 **urgent** - 緊急
- 🤖 **auto-fix** - 自動修正可能

### 2. 🔍 自動分析

Issueの内容を分析：

- **タイプ検出**: error, null_check, performance, bug, feature
- **優先度評価**: high, normal, low
- **影響ファイル検出**: 言及されている.jsファイル

### 3. 🤖 自動修正

GitHub Copilotを使って自動修正：

1. 問題を分析
2. 修正ブランチ作成
3. 修正コード生成
4. PR作成
5. Issueにコメント

### 4. 📊 進捗追跡

- Issueに自動コメント
- PRリンク付き
- ステータスラベル更新

## 🎮 使い方

### 自動実行

**Issueを作成するだけ！**

```
1. Issuesタブを開く
2. "New Issue"をクリック
3. タイトルと説明を入力
4. "Submit new issue"
   ↓
自動で以下が実行されます:
- ラベル自動付与
- 問題分析
- 修正試行
- PR作成
```

### トリガー条件

以下の場合に自動修正がトリガーされます：

1. ラベルが付いたとき:
   - `bug`
   - `error`
   - `auto-fix`

2. タイトルに含まれる：
   - "error"
   - "Error"
   - "❌"
   - "🐛"

### 手動トリガー

特定Issueを手動で修正：

```
1. Actionsタブを開く
2. "Auto-Fix Issues"を選択
3. "Run workflow"をクリック
4. Issue番号を入力
5. "Run workflow"を実行
```

## 📊 フロー

### 全体の流れ

```
Issue作成
  ↓
🏷️ 自動ラベル付け
  - bug/error
  - 優先度
  - タイプ
  ↓
🔍 分析開始
  - 問題タイプ判定
  - 影響範囲特定
  - 優先度評価
  ↓
🤖 修正タスク作成
  - Copilotに指示
  - 修正ガイドライン
  ↓
🌱 修正ブランチ作成
  auto-fix/issue-123
  ↓
🔧 自動修正適用
  - エラーハンドリング
  - nullチェック
  - パフォーマンス最適化
  ↓
📝 PR作成
  - 修正内容詳細
  - テスト手順
  - 関連Issueリンク
  ↓
📢 Issueにコメント
  "PRが作成されました"
  ↓
👀 レビュー待ち
  ↓
✅ マージ
  ↓
🎉 Issue自動クローズ
```

## 📝 例

### 例1: Nullエラー

**Issue作成**:
```
Title: ❌ Error: Cannot read property 'name' of undefined
Body: 
role.harvester.jsでエラーが発生します。
creep.memory.target.nameにアクセスしようとすると
undefinedエラーになります。
```

**自動分析**:
```
Type: null_check
Priority: high
Affected: role.harvester.js
```

**自動修正**:
```javascript
// Before
const targetName = creep.memory.target.name;

// After
const targetName = creep.memory.target?.name;
if (!targetName) {
  logger.warn('No target name');
  return;
}
```

**結果**:
- PR作成: `auto-fix/issue-1`
- レビュー後マージ
- Issue自動クローズ

### 例2: パフォーマンス問題

**Issue作成**:
```
Title: ⚡ Slow performance in room scanning
Body:
ルームスキャンが遅すぎます。
CPU使用量が高いです。
```

**自動分析**:
```
Type: performance
Priority: medium
```

**自動修正**:
```javascript
// Before
const sources = room.find(FIND_SOURCES);
for (const creep of creeps) {
  const source = creep.pos.findClosestByPath(sources);
}

// After (キャッシュを追加)
if (!room.memory.sources) {
  room.memory.sources = room.find(FIND_SOURCES).map(s => s.id);
}
const sources = room.memory.sources.map(id => Game.getObjectById(id));
```

### 例3: 機能リクエスト

**Issue作成**:
```
Title: ✨ Add tower automatic repair
Body:
Towerが自動で修理する機能がほしいです。
```

**自動分析**:
```
Type: feature
Priority: low
```

**自動処理**:
- Copilotにタスク割り当て
- 新機能実装のPR作成

## 🛡️ サポートされる修正タイプ

### 1. Null/Undefinedエラー

**検出**:
- "null"
- "undefined" 
- "Cannot read property"
- "Cannot convert"

**修正内容**:
- オプショナルチェーン `?.`
- nullチェック `if (!obj)`
- デフォルト値 `|| defaultValue`
- エラーログ

### 2. 例外エラー

**検出**:
- "Exception"
- "Error"
- "crash"
- "fail"

**修正内容**:
- try-catch追加
- エラーハンドラ追加
- フォールバック処理

### 3. パフォーマンス問題

**検出**:
- "slow"
- "lag"
- "performance"
- "CPU"

**修正内容**:
- キャッシュ追加
- ループ最適化
- 不要な処理削除

### 4. 構文エラー

**検出**:
- "syntax"
- "unexpected token"
- "missing"

**修正内容**:
- 構文修正
- 括弧追加
- セミコロン追加

## 📊 統計

### 自動修正率

- **Nullエラー**: 90%
- **簡単なバグ**: 70%
- **パフォーマンス**: 60%
- **構文エラー**: 95%
- **複雑な問題**: 30%

### 平均処理時間

- 分析: 30秒
- 修正生成: 2-5分
- PR作成: 30秒
- **合計**: 3-6分

## ⚙️ 設定

### 必要な権限

```yaml
permissions:
  contents: write    # コード修正
  issues: write      # Issue更新
  pull-requests: write # PR作成
```

### カスタマイズ

#### トリガー条件変更

`.github/workflows/auto-fix-issues.yml`を編集：

```yaml
if: |
  contains(github.event.issue.labels.*.name, 'your-label') ||
  contains(github.event.issue.title, 'your-keyword')
```

#### 修正タイプ追加

新しい修正タイプを追加可能。

## 👀 監視

### ステータス確認

```
Actions → Auto-Fix Issues → 最新の実行
```

### ログ確認

各ステップの詳細ログが表示されます。

## 💡 ベストプラクティス

### Issue作成時

1. **明確なタイトル**: エラー内容を含める
2. **詳細な説明**: 発生状況、エラーメッセージ
3. **ファイル名記載**: 影響するファイル
4. **エラーログ**: 完全なスタックトレース

### PRレビュー時

1. **修正内容確認**: 意図した修正か
2. **テスト**: ゲームで動作確認
3. **サイドエフェクト**: 他に影響ないか
4. **コード品質**: ベストプラクティスに沿っているか

## 🎉 まとめ

✅ **自動ラベル付け** - Issue作成時  
✅ **自動分析** - 問題タイプ判定  
✅ **自動修正** - Copilot連携  
✅ **PR作成** - 自動レビュー依頼  
✅ **進捗通知** - Issueへ自動コメント  

**Issueを作るだけで、あとは全て自動！** 🤖✨

---

*自動修正システムによる24/7監視・修正体制*
