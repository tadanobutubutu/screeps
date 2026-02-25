# 🎨 Memory Visualizer Guide

**Screepsメモリを楽しく使おう！**

## 🎯 機能一覧

### 1. 📊 Memory Stats
メモリ使用状況を確認

### 2. ⏰ Time Machine
過去のデータを記録・再生

### 3. 🏆 Leaderboard
Creepの成績ランキング

### 4. 📝 Diary
各Creepの行動日記

### 5. 🗺️ Memory Map
探索した部屋の記録

### 6. 🧹 Cleaner
不要なメモリ削除

### 7. 💾 Backup
メモリのバックアップ・復元

## 🚀 使い方

### セットアップ

```javascript
// main.jsに追加
const memVis = require('memory.visualizer');

module.exports.loop = function() {
  // タイムマシン記録 (毎ティック)
  memVis.recordSnapshot();
  
  // クリーナー (100ティックごと)
  if (Game.time % 100 === 0) {
    memVis.cleanup();
  }
  
  // バックアップ (1000ティックごと)
  if (Game.time % 1000 === 0) {
    memVis.backup();
  }
  
  // 通常のコード...
};
```

## 📊 Memory Stats

### 統計表示

```javascript
// Screepsコンソールで
const memVis = require('memory.visualizer');
memVis.showStats();
```

**出力例**:
```
📊 Memory Stats:
  Total Size: 15.32 KB
  Creeps: 11
  Rooms: 1
  Flags: 0
  Spawns: 1
```

### メモリ使用量ランキング

```javascript
memVis.showTopMemoryUsers(10);
```

**出力例**:
```
📈 Top 10 Memory Users:
  1. [creep] harvester_1: 256 bytes
  2. [creep] builder_1: 198 bytes
  3. [room] E1S1: 512 bytes
  ...
```

## ⏰ Time Machine

### 自動記録

```javascript
// main.jsで毎ティック実行
memVis.recordSnapshot();
```

### 履歴表示

```javascript
// 最近10スナップショット
memVis.showHistory(10);
```

**出力例**:
```
⏰ History (Last 10 snapshots):
  Tick 2900: Creeps=11, CPU=15.23, Energy=300
  Tick 2901: Creeps=11, CPU=14.87, Energy=310
  Tick 2902: Creeps=12, CPU=16.45, Energy=290
  ...
```

### 設定

```javascript
// 最大保存数変更
Memory.timeMachine.maxSnapshots = 200;

// 無効化
Memory.timeMachine.enabled = false;

// 有効化
Memory.timeMachine.enabled = true;
```

## 🏆 Leaderboard

### 成績記録

```javascript
// role.harvester.jsで
if (creep.harvest(source) === OK) {
  const memVis = require('memory.visualizer');
  memVis.recordAchievement(creep.name, 'harvested', source.energyCapacity / 3000);
}

// role.builder.jsで
if (creep.build(target) === OK) {
  memVis.recordAchievement(creep.name, 'built', 5);
}

// role.upgrader.jsで
if (creep.upgradeController(target) === OK) {
  memVis.recordAchievement(creep.name, 'upgraded', 1);
}
```

### ランキング表示

```javascript
// エネルギー採取ランキング
memVis.showLeaderboard('harvested', 10);

// 建設ランキング
memVis.showLeaderboard('built', 10);

// アップグレードランキング
memVis.showLeaderboard('upgraded', 10);
```

**出力例**:
```
🏆 Leaderboard - harvested (Top 10):
  🥇 1. harvester_1: 15420
  🥈 2. harvester_2: 14230
  🥉 3. harvester_3: 12890
     4. harvester_4: 11250
  ...
```

### カテゴリ

- `harvested` - 採取量
- `built` - 建設量
- `upgraded` - アップグレード量
- `repaired` - 修理量
- `distance` - 移動距離

## 📝 Diary

### 日記追加

```javascript
// Creepの行動を記録
const memVis = require('memory.visualizer');

// エネルギー採取
memVis.addDiaryEntry(creep.name, '🌾 Harvested energy from source');

// 建設完了
memVis.addDiaryEntry(creep.name, '🏗️ Completed construction');

// 敵発見
memVis.addDiaryEntry(creep.name, '⚠️ Hostile creep detected!');

// エネルギー不足
memVis.addDiaryEntry(creep.name, '😫 Out of energy, going to refill');
```

### 日記読み取り

```javascript
memVis.readDiary('harvester_1');
```

**出力例**:
```
📝 Diary of harvester_1:
  [Tick 2850] 🌾 Harvested energy from source
  [Tick 2855] 🚚 Delivered energy to spawn
  [Tick 2860] 🌾 Harvested energy from source
  [Tick 2865] 🚚 Delivered energy to extension
  ...
```

### 設定

```javascript
// 最大エントリ数変更
Memory.creeps['harvester_1'].diary.maxEntries = 50;
```

## 🗺️ Memory Map

### 部屋記録

```javascript
// role.scout.jsで
const memVis = require('memory.visualizer');
memVis.recordRoom(creep.room.name);
```

### マップ表示

```javascript
memVis.showMap();
```

**出力例**:
```
🗺️ Memory Map:
  Explored Rooms: 5
  E1S1: Owner=PlayerName, Sources=2, Hostiles=0
  E2S1: Owner=Unclaimed, Sources=2, Hostiles=0
  E1S2: Owner=EnemyName, Sources=2, Hostiles=5
  ...
```

### 記録される情報

- 最終訪問時刻
- 支配者 (Controller owner)
- ソース数
- ミネラル数
- 敵Creep数

## 🧹 Cleaner

### 自動クリーニング

```javascript
// main.jsで100ティックごと
if (Game.time % 100 === 0) {
  memVis.cleanup();
}
```

### 手動実行

```javascript
memVis.cleanup();
```

**出力例**:
```
🧹 Cleaned 15 memory entries
```

### 削除対象

- 死んだCreepのメモリ
- 消えたFlagのメモリ
- 古いRoomメモリ (1000tick以上訪問なし)

## 💾 Backup & Restore

### バックアップ

```javascript
// 手動バックアップ
memVis.backup();
```

**出力**:
```
💾 Backup created at tick 3000
```

### 復元

```javascript
// 最新のバックアップから復元
memVis.restore(0);

// 古いバックアップから復元
memVis.restore(1);  // 2番目に古い
```

**出力**:
```
✅ Restored backup from tick 2000
```

### 設定

```javascript
// バックアップ一覧
Memory.backups.forEach((backup, index) => {
  console.log(`${index}: Tick ${backup.time}`);
});
```

## 🎮 楽しい使い方

### 1. Creepコンテスト

```javascript
// 毎日1000ティックで優勝者発表
if (Game.time % 1000 === 0) {
  memVis.showLeaderboard('harvested', 3);
  memVis.showLeaderboard('built', 3);
  memVis.showLeaderboard('upgraded', 3);
}
```

### 2. パフォーマンスモニタリング

```javascript
// CPU使用量の推移を確認
const history = memVis.showHistory(100);
const avgCpu = history.reduce((sum, snap) => sum + snap.cpu, 0) / history.length;
console.log(`Average CPU: ${avgCpu.toFixed(2)}`);
```

### 3. Creepの物語

```javascript
// ベテランCreepの日記を読む
const oldestCreep = Object.keys(Game.creeps)
  .sort((a, b) => Game.creeps[a].ticksToLive - Game.creeps[b].ticksToLive)[0];

memVis.readDiary(oldestCreep);
```

### 4. 探索マップ

```javascript
// 全探索部屋の統計
memVis.showMap();

const explored = Memory.map.explored.length;
const hostile = Object.values(Memory.map.rooms)
  .filter(r => r.hostiles > 0).length;

console.log(`Total explored: ${explored}, Hostile rooms: ${hostile}`);
```

### 5. メモリ最適化

```javascript
// 大きいメモリを見つけて減らす
const topUsers = memVis.showTopMemoryUsers(5);
topUsers.forEach(user => {
  if (user.size > 1000) {
    console.log(`⚠️ ${user.name} is using ${user.size} bytes!`);
  }
});
```

## 💡 ヒント

### メモリ使用量を減らす

1. **定期的にcleanup()**
2. **古いデータを削除**
3. **maxEntriesを調整**
4. **不要な機能を無効化**

### パフォーマンス最適化

```javascript
// 記録頻度を調整
if (Game.time % 10 === 0) {  // 10ティックごと
  memVis.recordSnapshot();
}

// クリーンアップ頻度を増やす
if (Game.time % 50 === 0) {  // 50ティックごと
  memVis.cleanup();
}
```

## 📊 コンソールコマンド

```javascript
// エイリアス設定
const m = require('memory.visualizer');

// クイックコマンド
m.showStats();
m.showHistory();
m.showLeaderboard('harvested');
m.showMap();
m.cleanup();
m.backup();
```

## ❓ FAQ

**Q: メモリ使用量が増えすぎた？**  
A: `cleanup()`を頻繁に実行し、`maxSnapshots`や`maxEntries`を減らしましょう。

**Q: バックアップが失敗する？**  
A: メモリが大きすぎる可能性があります。不要なデータを削除してください。

**Q: レビューがリセットされた？**  
A: バックアップがあれば`restore()`で復元できます！

**Q: CPU使用量が増えた？**  
A: 記録頻度を減らすか、一部機能を無効化しましょう。

---

**🎉 メモリを楽しもう！** 💾✨

*ScreepsのメモリーはRPGのセーブデータみたい！*
