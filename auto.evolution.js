/**
 * Auto Evolution System - 自動進化AI
 * ゲーム状況に応じて自動的に新コードを生成・更新
 */

const autoEvolution = {
  /**
   * 初期化
   */
  init: function() {
    if (!Memory.evolution) {
      Memory.evolution = {
        history: [],
        queue: [],
        lastRCL: 0,
        lastCheck: 0,
        suggestions: [],
        stats: {
          totalEvolutions: 0,
          successRate: 1.0
        }
      };
    }
  },
  
  /**
   * メインループ - 毎ティック実行
   */
  run: function() {
    this.init();
    
    // 10ティックごとにチェック
    if (Game.time - Memory.evolution.lastCheck < 10) {
      return;
    }
    
    Memory.evolution.lastCheck = Game.time;
    
    // 状況分析
    const state = this.analyzeGameState();
    
    // 進化が必要か判定
    const needs = this.needsEvolution(state);
    
    // 優先度順にキューに追加
    needs.forEach(function(need) {
      this.addToQueue(need);
    }.bind(this));
    
    // キュー処理
    this.processQueue();
  },
  
  /**
   * ゲーム状況分析
   */
  analyzeGameState: function() {
    const rooms = Object.values(Game.rooms).filter(function(r) {
      return r.controller && r.controller.my;
    });
    
    const state = {
      rcl: rooms.length > 0 ? rooms[0].controller.level : 0,
      roomCount: rooms.length,
      creepCount: Object.keys(Game.creeps).length,
      spawns: Object.keys(Game.spawns).length,
      gcl: Game.gcl.level,
      resources: this.analyzeResources(rooms),
      threats: this.analyzeThreats(rooms),
      opportunities: this.analyzeOpportunities(rooms),
      bottlenecks: this.analyzeBottlenecks(rooms),
      structures: this.analyzeStructures(rooms)
    };
    
    return state;
  },
  
  /**
   * リソース分析
   */
  analyzeResources: function(rooms) {
    let totalEnergy = 0;
    let storageEnergy = 0;
    let capacity = 0;
    
    rooms.forEach(function(room) {
      totalEnergy += room.energyAvailable;
      capacity += room.energyCapacityAvailable;
      
      if (room.storage) {
        storageEnergy += room.storage.store[RESOURCE_ENERGY] || 0;
      }
    });
    
    return {
      energy: totalEnergy,
      capacity: capacity,
      storage: storageEnergy,
      ratio: capacity > 0 ? totalEnergy / capacity : 0
    };
  },
  
  /**
   * 脅威分析
   */
  analyzeThreats: function(rooms) {
    const threats = [];
    
    rooms.forEach(function(room) {
      const hostiles = room.find(FIND_HOSTILE_CREEPS);
      
      if (hostiles.length > 0) {
        threats.push({
          room: room.name,
          type: 'hostile_creeps',
          count: hostiles.length,
          severity: hostiles.length > 3 ? 'high' : 'medium'
        });
      }
      
      // 構造物のダメージ
      const damaged = room.find(FIND_STRUCTURES, {
        filter: function(s) {
          return s.hits < s.hitsMax * 0.5;
        }
      });
      
      if (damaged.length > 5) {
        threats.push({
          room: room.name,
          type: 'heavy_damage',
          count: damaged.length,
          severity: 'medium'
        });
      }
    });
    
    return threats;
  },
  
  /**
   * 機会分析
   */
  analyzeOpportunities: function(rooms) {
    const opportunities = {
      newRooms: [],
      deposits: [],
      powerBanks: []
    };
    
    rooms.forEach(function(room) {
      // 隣接部屋チェック
      const exits = Game.map.describeExits(room.name);
      for (const direction in exits) {
        const roomName = exits[direction];
        // 実際には隣接部屋の状態をチェックする必要がある
        // 簡略化のため省略
      }
    });
    
    return opportunities;
  },
  
  /**
   * ボトルネック分析
   */
  analyzeBottlenecks: function(rooms) {
    const bottlenecks = [];
    
    rooms.forEach(function(room) {
      const creeps = room.find(FIND_MY_CREEPS);
      const sources = room.find(FIND_SOURCES);
      
      // Harvester不足
      const harvesters = creeps.filter(function(c) {
        return c.memory.role === 'harvester';
      });
      
      if (harvesters.length < sources.length * 2) {
        bottlenecks.push({
          room: room.name,
          type: 'insufficient_harvesters',
          current: harvesters.length,
          needed: sources.length * 2
        });
      }
      
      // Upgrader不足
      const upgraders = creeps.filter(function(c) {
        return c.memory.role === 'upgrader';
      });
      
      if (upgraders.length < 3 && room.controller.level < 8) {
        bottlenecks.push({
          room: room.name,
          type: 'insufficient_upgraders',
          current: upgraders.length,
          needed: 3
        });
      }
      
      // エネルギー不足
      if (room.energyAvailable < room.energyCapacityAvailable * 0.3) {
        bottlenecks.push({
          room: room.name,
          type: 'energy_shortage',
          severity: 'high'
        });
      }
    });
    
    return bottlenecks;
  },
  
  /**
   * 構造物分析
   */
  analyzeStructures: function(rooms) {
    const structures = {
      towers: 0,
      storage: 0,
      links: 0,
      labs: 0,
      terminals: 0
    };
    
    rooms.forEach(function(room) {
      const roomStructures = room.find(FIND_MY_STRUCTURES);
      
      roomStructures.forEach(function(s) {
        if (s.structureType === STRUCTURE_TOWER) structures.towers++;
        if (s.structureType === STRUCTURE_STORAGE) structures.storage++;
        if (s.structureType === STRUCTURE_LINK) structures.links++;
        if (s.structureType === STRUCTURE_LAB) structures.labs++;
        if (s.structureType === STRUCTURE_TERMINAL) structures.terminals++;
      });
    });
    
    return structures;
  },
  
  /**
   * 進化必要性判定
   */
  needsEvolution: function(state) {
    const needs = [];
    
    // RCLアップグレード検知
    if (state.rcl > Memory.evolution.lastRCL) {
      needs.push({
        type: 'rcl_upgrade',
        priority: 10,
        data: {
          oldRCL: Memory.evolution.lastRCL,
          newRCL: state.rcl
        },
        action: 'create_rcl_features'
      });
      Memory.evolution.lastRCL = state.rcl;
    }
    
    // 脅威対応
    state.threats.forEach(function(threat) {
      if (threat.severity === 'high') {
        needs.push({
          type: 'threat_response',
          priority: 10,
          data: threat,
          action: 'create_defense'
        });
      }
    });
    
    // ボトルネック解消
    state.bottlenecks.forEach(function(bottleneck) {
      needs.push({
        type: 'bottleneck_fix',
        priority: 7,
        data: bottleneck,
        action: 'optimize_production'
      });
    });
    
    // 新機能追加（構造物ベース）
    if (state.rcl >= 3 && state.structures.towers === 0) {
      needs.push({
        type: 'new_feature',
        priority: 8,
        data: { feature: 'tower_management' },
        action: 'create_tower_logic'
      });
    }
    
    if (state.rcl >= 4 && state.structures.storage > 0) {
      needs.push({
        type: 'new_feature',
        priority: 7,
        data: { feature: 'storage_management' },
        action: 'create_storage_logic'
      });
    }
    
    if (state.rcl >= 5 && state.structures.links > 0) {
      needs.push({
        type: 'new_feature',
        priority: 6,
        data: { feature: 'link_network' },
        action: 'create_link_logic'
      });
    }
    
    return needs;
  },
  
  /**
   * キューに追加
   */
  addToQueue: function(need) {
    // 重複チェック
    const exists = Memory.evolution.queue.some(function(item) {
      return item.type === need.type && item.action === need.action;
    });
    
    if (!exists) {
      need.timestamp = Game.time;
      Memory.evolution.queue.push(need);
      
      console.log('🤖 Evolution queued: ' + need.type + ' (Priority: ' + need.priority + ')');
    }
  },
  
  /**
   * キュー処理
   */
  processQueue: function() {
    if (Memory.evolution.queue.length === 0) {
      return;
    }
    
    // 優先度順にソート
    Memory.evolution.queue.sort(function(a, b) {
      return b.priority - a.priority;
    });
    
    // 最優先項目を処理
    const item = Memory.evolution.queue[0];
    
    // コード生成提案を作成
    this.generateCodeSuggestion(item);
    
    // 履歴に追加
    Memory.evolution.history.push({
      time: Game.time,
      type: item.type,
      action: item.action,
      data: item.data
    });
    
    // 統計更新
    Memory.evolution.stats.totalEvolutions++;
    
    // キューから削除
    Memory.evolution.queue.shift();
  },
  
  /**
   * コード生成提案
   */
  generateCodeSuggestion: function(item) {
    let suggestion = '';
    
    switch(item.action) {
      case 'create_rcl_features':
        suggestion = this.generateRCLFeatures(item.data);
        break;
        
      case 'create_defense':
        suggestion = this.generateDefenseCode(item.data);
        break;
        
      case 'optimize_production':
        suggestion = this.generateProductionOptimization(item.data);
        break;
        
      case 'create_tower_logic':
        suggestion = this.generateTowerLogic();
        break;
        
      case 'create_storage_logic':
        suggestion = this.generateStorageLogic();
        break;
        
      case 'create_link_logic':
        suggestion = this.generateLinkLogic();
        break;
    }
    
    Memory.evolution.suggestions.push({
      time: Game.time,
      type: item.type,
      code: suggestion,
      filename: this.getFilename(item.action)
    });
    
    console.log('✨ Code suggestion generated: ' + this.getFilename(item.action));
    console.log('📝 Check Memory.evolution.suggestions for details');
  },
  
  /**
   * RCL機能生成
   */
  generateRCLFeatures: function(data) {
    const rcl = data.newRCL;
    
    if (rcl === 3) {
      return '// Tower management code needed\n// Create structure.tower.js';
    }
    if (rcl === 4) {
      return '// Storage management needed\n// Create storage.manager.js';
    }
    if (rcl === 5) {
      return '// Link network needed\n// Create link.network.js';
    }
    if (rcl === 6) {
      return '// Mineral mining needed\n// Create role.miner.js';
    }
    
    return '// RCL ' + rcl + ' features';
  },
  
  /**
   * 防衛コード生成
   */
  generateDefenseCode: function(data) {
    return '// Defender role needed\n// Threat in room: ' + data.room;
  },
  
  /**
   * 生産最適化コード生成
   */
  generateProductionOptimization: function(data) {
    return '// Optimize ' + data.type + '\n// Current: ' + data.current + ', Needed: ' + data.needed;
  },
  
  /**
   * Towerロジック生成
   */
  generateTowerLogic: function() {
    return 'module.exports = {\n  run: function(tower) {\n    // Attack hostiles\n    // Repair structures\n  }\n};';
  },
  
  /**
   * Storageロジック生成
   */
  generateStorageLogic: function() {
    return 'module.exports = {\n  run: function(room) {\n    // Manage storage distribution\n  }\n};';
  },
  
  /**
   * Linkロジック生成
   */
  generateLinkLogic: function() {
    return 'module.exports = {\n  run: function(room) {\n    // Transfer energy between links\n  }\n};';
  },
  
  /**
   * ファイル名取得
   */
  getFilename: function(action) {
    const map = {
      'create_tower_logic': 'structure.tower.js',
      'create_storage_logic': 'storage.manager.js',
      'create_link_logic': 'link.network.js',
      'create_defense': 'role.defender.js',
      'optimize_production': 'spawn.optimizer.js'
    };
    
    return map[action] || 'evolution.code.js';
  },
  
  /**
   * ダッシュボード表示
   */
  showDashboard: function() {
    this.init();
    const evo = Memory.evolution;
    
    console.log('\n🤖 === AUTO EVOLUTION DASHBOARD === 🤖');
    console.log('Total Evolutions: ' + evo.stats.totalEvolutions);
    console.log('Success Rate: ' + (evo.stats.successRate * 100) + '%');
    console.log('Queue Length: ' + evo.queue.length);
    
    // 履歴
    if (evo.history.length > 0) {
      console.log('\n📜 Recent Evolution History:');
      evo.history.slice(-5).forEach(function(h) {
        console.log('  [' + h.time + '] ' + h.type + ': ' + h.action);
      });
    }
    
    // キュー
    if (evo.queue.length > 0) {
      console.log('\n⏳ Pending Evolutions:');
      evo.queue.slice(0, 5).forEach(function(q) {
        console.log('  Priority ' + q.priority + ': ' + q.type + ' (' + q.action + ')');
      });
    }
    
    // 提案
    if (evo.suggestions.length > 0) {
      console.log('\n💡 Code Suggestions:');
      evo.suggestions.slice(-3).forEach(function(s) {
        console.log('  [' + s.time + '] ' + s.filename);
        console.log('  ' + s.code.split('\n')[0]);
      });
    }
  },
  
  /**
   * リセット
   */
  reset: function() {
    delete Memory.evolution;
    console.log('🔄 Evolution system reset!');
  }
};

module.exports = autoEvolution;
