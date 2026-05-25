# ⚡ Quick Commands

**打ちやすい超シンプルコマンド！**

## 🎯 基本

```javascript
help(); // ヘルプ表示
```

## 😊 Emotions

```javascript
e(); // 感情統計
ec(name); // Creepの感情チェック
```

**例**:

```javascript
e();
ec('harvester_1');
```

## 💾 Memory

### 統計

```javascript
m(); // メモリ統計
```

### 履歴

```javascript
mh(); // 履歴表示 (デフォルト10)
mh(20); // 履歴表示 (20件)
mh(50); // 履歴表示 (50件)
```

### ランキング

```javascript
ml(); // 採取ランキング
ml('harvested'); // 採取ランキング
ml('built'); // 建設ランキング
ml('upgraded'); // アップグレードランキング
ml('repaired'); // 修理ランキング
```

### 日記

```javascript
md('harvester_1'); // Creepの日記読み取り
md('builder_2'); // Creepの日記読み取り
```

### マップ

```javascript
mm(); // 探索マップ表示
```

### メンテナンス

```javascript
mc(); // クリーンアップ
mb(); // バックアップ
mr(); // 最新バックアップから復元
mr(1); // 2番目のバックアップから復元
```

## 📊 使用例

### 状況確認

```javascript
// メモリ使用状況
m();

// 感情状態
e();

// 探索状況
mm();
```

### パフォーマンスチェック

```javascript
// CPU使用履歴
mh(100);

// ランキング
ml('harvested');
ml('built');
ml('upgraded');
```

### Creep調査

```javascript
// 感情チェック
ec('harvester_1');

// 日記確認
md('harvester_1');
```

### メンテナンス

```javascript
// クリーンアップ
mc();

// バックアップ
mb();

// 問題があったら復元
mr();
```

## 🔥 クイックチェックルーチン

### 毎日のチェック

```javascript
m(); // メモリ OK?
e(); // みんな元気?
ml(); // 誰がトップ?
```

### 問題発生時

```javascript
mh(50); // 何が起きた?
e(); // Creepが悲しい?
mb(); // 念のためバックアップ
```

### 成果確認

```javascript
ml('harvested'); // 採取ランキング
ml('built'); // 建設ランキング
ml('upgraded'); // アップグレードランキング
mm(); // どこまで探索した?
```

## 📝 コマンド一覧

| コマンド   | 機能           | 例                    |
| ---------- | -------------- | --------------------- |
| `help()`   | ヘルプ         | `help()`              |
| `e()`      | 感情統計       | `e()`                 |
| `ec(name)` | Creep感情      | `ec('harvester_1')`   |
| `m()`      | メモリ統計     | `m()`                 |
| `mh()`     | 履歴           | `mh()`, `mh(20)`      |
| `ml()`     | ランキング     | `ml()`, `ml('built')` |
| `md(name)` | 日記           | `md('builder_1')`     |
| `mm()`     | マップ         | `mm()`                |
| `mc()`     | クリーンアップ | `mc()`                |
| `mb()`     | バックアップ   | `mb()`                |
| `mr()`     | 復元           | `mr()`, `mr(1)`       |

## ✨ ヒント

### 打ちやすい順

1. **最短**: `e()`, `m()`
2. **短い**: `mh()`, `ml()`, `mm()`
3. **少し長い**: `ml('built')`, `md('name')`

### 覚え方

- **e** = Emotion (感情)
- **m** = Memory (メモリ)
    - **mh** = Memory History (履歴)
    - **ml** = Memory Leaderboard (ランキング)
    - **md** = Memory Diary (日記)
    - **mm** = Memory Map (マップ)
    - **mc** = Memory Cleanup (クリーンアップ)
    - **mb** = Memory Backup (バックアップ)
    - **mr** = Memory Restore (復元)

### ランキングタイプ

```javascript
ml('harvested'); // 採取
ml('built'); // 建設
ml('upgraded'); // アップグレード
ml('repaired'); // 修理
ml('distance'); // 移動距離
```

## 🎮 便利な組み合わせ

### ダッシュボード

```javascript
m(); // メモリ
e(); // 感情
mh(10); // 最近10履歴
ml(); // トップランキング
```

### 詳細分析

```javascript
mh(100); // 100履歴
ml('harvested'); // 採取TOP
ml('built'); // 建設TOP
ml('upgraded'); // アップグレードTOP
```

### Creepプロファイル

```javascript
ec('harvester_1'); // 感情状態
md('harvester_1'); // 行動履歴
```

## 🚀 最初に試すべきコマンド

```javascript
// 1. ヘルプ表示
help();

// 2. 状況確認
m();
e();

// 3. ランキング見る
ml();

// 4. 履歴見る
mh();

// 5. マップ見る
mm();
```

---

**⚡ 超簡単！コピペ不要！** 🎮✨

_打ちやすいコマンドでサクサク操作！_
