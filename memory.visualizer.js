/**
 * Memory Visualizer - メモリを視覚化する楽しいシステム
 */

const memoryVisualizer = {
  /**
   * メモリ全体の統計を表示
   */
  showStats: function() {
    const stats = {
      totalSize: JSON.stringify(Memory).length,
      creeps: Object.keys(Memory.creeps || {}).length,
      rooms: Object.keys(Memory.rooms || {}).length,
      flags: Object.keys(Memory.flags || {}).length,
      spawns: Object.keys(Memory.spawns || {}).length,
    };
    
    console.log('📊 Memory Stats:');
    console.log(`  Total Size: ${(stats.totalSize / 1024).toFixed(2)} KB`);
    console.log(`  Creeps: ${stats.creeps}`);
    console.log(`  Rooms: ${stats.rooms}`);
    console.log(`  Flags: ${stats.flags}`);
    console.log(`  Spawns: ${stats.spawns}`);
    
    return stats;
  },
  
  /**
   * メモリの大きい順にソート表示
   */
  showTopMemoryUsers: function(limit = 10) {
    const sizes = [];
    
    // Creepメモリ
    for (const name in Memory.creeps) {
      sizes.push({
        type: 'creep',
        name: name,
        size: JSON.stringify(Memory.creeps[name]).length
      });
    }
    
    // Roomメモリ
    for (const name in Memory.rooms) {
      sizes.push({
        type: 'room',
        name: name,
        size: JSON.stringify(Memory.rooms[name]).length
      });
    }
    
    // ソート
    sizes.sort((a, b) => b.size - a.size);
    
    console.log(`📈 Top ${limit} Memory Users:`);
    sizes.slice(0, limit).forEach((item, index) => {
      console.log(`  ${index + 1}. [${item.type}] ${item.name}: ${item.size} bytes`);
    });
    
    return sizes;
  },
  
  /**
   * メモリタイムマシン - 過去のデータを記録
   */
  initTimeMachine: function() {
    if (!Memory.timeMachine) {
      Memory.timeMachine = {
        snapshots: [],
        maxSnapshots: 100,
        enabled: true
      };
    }
  },
  
  recordSnapshot: function() {
    this.initTimeMachine();
    
    if (!Memory.timeMachine.enabled) return;
    
    const snapshot = {
      time: Game.time,
      gcl: Game.gcl.level,
      cpu: Game.cpu.getUsed(),
      bucket: Game.cpu.bucket,
      creeps: Object.keys(Game.creeps).length,
      energy: Object.values(Game.rooms).reduce((sum, room) => {
        return sum + (room.energyAvailable || 0);
      }, 0)
    };
    
    Memory.timeMachine.snapshots.push(snapshot);
    
    // 古いスナップショットを削除
    if (Memory.timeMachine.snapshots.length > Memory.timeMachine.maxSnapshots) {
      Memory.timeMachine.snapshots.shift();
    }
  },
  
  showHistory: function(ticks = 10) {
    this.initTimeMachine();
    
    const snapshots = Memory.timeMachine.snapshots.slice(-ticks);
    
    console.log(`⏰ History (Last ${ticks} snapshots):`);
    snapshots.forEach(snap => {
      console.log(`  Tick ${snap.time}: Creeps=${snap.creeps}, CPU=${snap.cpu.toFixed(2)}, Energy=${snap.energy}`);
    });
    
    return snapshots;
  },
  
  /**
   * メモリリーダーボード - Creepの成績表
   */
  initLeaderboard: function() {
    if (!Memory.leaderboard) {
      Memory.leaderboard = {
        harvested: {},
        built: {},
        upgraded: {},
        repaired: {},
        distance: {}
      };
    }
  },
  
  recordAchievement: function(creepName, type, amount) {
    this.initLeaderboard();
    
    if (!Memory.leaderboard[type]) {
      Memory.leaderboard[type] = {};
    }
    
    if (!Memory.leaderboard[type][creepName]) {
      Memory.leaderboard[type][creepName] = 0;
    }
    
    Memory.leaderboard[type][creepName] += amount;
  },
  
  showLeaderboard: function(type = 'harvested', limit = 10) {
    this.initLeaderboard();
    
    const board = Memory.leaderboard[type] || {};
    const sorted = Object.entries(board)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
    
    console.log(`🏆 Leaderboard - ${type} (Top ${limit}):`);
    sorted.forEach((entry, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
      console.log(`  ${medal} ${index + 1}. ${entry[0]}: ${entry[1]}`);
    });
    
    return sorted;
  },
  
  /**
   * Creep日記 - 各Creepの行動記録
   */
  initDiary: function(creepName) {
    if (!Memory.creeps[creepName]) return;
    
    if (!Memory.creeps[creepName].diary) {
      Memory.creeps[creepName].diary = {
        entries: [],
        maxEntries: 20
      };
    }
  },
  
  addDiaryEntry: function(creepName, message) {
    this.initDiary(creepName);
    
    if (!Memory.creeps[creepName] || !Memory.creeps[creepName].diary) return;
    
    const entry = {
      time: Game.time,
      message: message
    };
    
    Memory.creeps[creepName].diary.entries.push(entry);
    
    // 古いエントリを削除
    const diary = Memory.creeps[creepName].diary;
    if (diary.entries.length > diary.maxEntries) {
      diary.entries.shift();
    }
  },
  
  readDiary: function(creepName) {
    if (!Memory.creeps[creepName] || !Memory.creeps[creepName].diary) {
      console.log(`📝 No diary for ${creepName}`);
      return [];
    }
    
    const diary = Memory.creeps[creepName].diary;
    console.log(`📝 Diary of ${creepName}:`);
    diary.entries.forEach(entry => {
      console.log(`  [Tick ${entry.time}] ${entry.message}`);
    });
    
    return diary.entries;
  },
  
  /**
   * メモリマップ - 部屋の視覚化
   */
  initMemoryMap: function() {
    if (!Memory.map) {
      Memory.map = {
        rooms: {},
        explored: []
      };
    }
  },
  
  recordRoom: function(roomName) {
    this.initMemoryMap();
    
    const room = Game.rooms[roomName];
    if (!room) return;
    
    Memory.map.rooms[roomName] = {
      lastVisit: Game.time,
      controller: room.controller ? {
        owner: room.controller.owner ? room.controller.owner.username : null,
        level: room.controller.level
      } : null,
      sources: room.find(FIND_SOURCES).length,
      minerals: room.find(FIND_MINERALS).length,
      hostiles: room.find(FIND_HOSTILE_CREEPS).length
    };
    
    if (!Memory.map.explored.includes(roomName)) {
      Memory.map.explored.push(roomName);
    }
  },
  
  showMap: function() {
    this.initMemoryMap();
    
    console.log('🗺️ Memory Map:');
    console.log(`  Explored Rooms: ${Memory.map.explored.length}`);
    
    for (const roomName in Memory.map.rooms) {
      const info = Memory.map.rooms[roomName];
      const owner = info.controller && info.controller.owner ? info.controller.owner : 'Unclaimed';
      console.log(`  ${roomName}: Owner=${owner}, Sources=${info.sources}, Hostiles=${info.hostiles}`);
    }
  },
  
  /**
   * メモリクリーナー - 使われていないメモリを削除
   */
  cleanup: function() {
    let cleaned = 0;
    
    // 死んだCreepのメモリ削除
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        cleaned++;
      }
    }
    
    // 消えたFlagのメモリ削除
    for (const name in Memory.flags) {
      if (!Game.flags[name]) {
        delete Memory.flags[name];
        cleaned++;
      }
    }
    
    // 古いRoomメモリ削除 (1000tick以上訪問なし)
    if (Memory.map && Memory.map.rooms) {
      for (const roomName in Memory.map.rooms) {
        const lastVisit = Memory.map.rooms[roomName].lastVisit;
        if (Game.time - lastVisit > 1000) {
          delete Memory.map.rooms[roomName];
          cleaned++;
        }
      }
    }
    
    console.log(`🧹 Cleaned ${cleaned} memory entries`);
    return cleaned;
  },
  
  /**
   * メモリバックアップ
   */
  backup: function() {
    if (!Memory.backups) {
      Memory.backups = [];
    }
    
    const backup = {
      time: Game.time,
      data: JSON.parse(JSON.stringify(Memory))
    };
    
    Memory.backups.push(backup);
    
    // 古いバックアップ削除 (最大5個)
    if (Memory.backups.length > 5) {
      Memory.backups.shift();
    }
    
    console.log(`💾 Backup created at tick ${Game.time}`);
  },
  
  restore: function(index = 0) {
    if (!Memory.backups || Memory.backups.length === 0) {
      console.log('❌ No backups found');
      return false;
    }
    
    const backup = Memory.backups[index];
    if (!backup) {
      console.log(`❌ Backup ${index} not found`);
      return false;
    }
    
    // バックアップ以外を保存
    const backups = Memory.backups;
    
    // 復元
    for (const key in Memory) {
      delete Memory[key];
    }
    
    Object.assign(Memory, backup.data);
    Memory.backups = backups;
    
    console.log(`✅ Restored backup from tick ${backup.time}`);
    return true;
  }
};

module.exports = memoryVisualizer;
