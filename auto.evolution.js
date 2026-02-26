/**
 * Auto Evolution System - 自動進化AI
 * ゲーム状況に応じて自動的に新コードを生成・更新
 * CPU最適化版
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
        lastFullAnalysis: 0,
        suggestions: [],
        stats: {
          totalEvolutions: 0,
          successRate: 1.0
        },
        cache: {
          gameState: null,
          cacheTime: 0
        },
        analysisPhase: 0 // 段階的処理用
      };
    }
  },
  
  /**
   * メインループ - 毎ティック実行
   */
  run: function() {
    this.init();
    
    // CPU使用率チェック - 50%超えたら処理スキップ
    if (Game.cpu.getUsed() / Game.cpu.limit > 0.5) {
      return;
    }
    
    // 100ティックごとにチェック（以前は10ティック）
    if (Game.time - Memory.evolution.lastCheck < 100) {
      return;
    }
    
    Memory.evolution.lastCheck = Game.time;
    
    // 段階的処理: 1回のrunで全てやらない
    this.runPhase();
  },
  
  /**
   * 段階的処理実行
   */
  runPhase: function() {
    const phase = Memory.evolution.analysisPhase;
    
    switch(phase) {
      case 0:
        // Phase 0: 基本状態分析のみ
        const basicState = this.analyzeBasicState();
        Memory.evolution.cache.gameState = basicState;
        Memory.evolution.cache.cacheTime = Game.time;
        Memory.evolution.analysisPhase = 1;
        break;
        
      case 1:
        // Phase 1: ボトルネック分析
        const state = Memory.evolution.cache.gameState;
        if (state) {
          state.bottlenecks = this.analyzeBottlenecks();
          Memory.evolution.cache.gameState = state;
        }
        Memory.evolution.analysisPhase = 2;
        break;
        
      case 2:
        // Phase 2: 進化判定とキュー追加
        const cachedState = Memory.evolution.cache.gameState;
        if (cachedState) {
          const needs = this.needsEvolution(cachedState);
          const self = this;
          needs.forEach(function(need) {
            self.addToQueue(need);
          });
        }
        Memory.evolution.analysisPhase = 3;
        break;
        
      case 3:
        // Phase 3: キュー処理
        this.processQueue();
        Memory.evolution.analysisPhase = 0; // リセット
        Memory.evolution.lastFullAnalysis = Game.time;
        break;
    }
  },
  
  /**
   * 基本状態分析（軽量版）
   */
  analyzeBasicState: function() {
    // 自分の部屋のみ、キャッシュ活用
    const myRooms = [];
    for (const roomName in Game.rooms) {
      const room = Game.rooms[roomName];
      if (room.controller && room.controller.my) {
        myRooms.push(room);
      }
    }
    
    const state = {
      rcl: myRooms.length > 0 ? myRooms[0].controller.level : 0,
      roomCount: myRooms.length,
      creepCount: Object.keys(Game.creeps).length,
      spawns: Object.keys(Game.spawns).length,
      gcl: Game.gcl.level,
      resources: this.analyzeResourcesLight(myRooms),
      structures: this.analyzeStructuresLight(myRooms),
      threats: [], // 後で追加可能
      opportunities: {},
      bottlenecks: [] // Phase 1で追加
    };
    
    return state;
  },
  
  /**
   * リソース分析（軽量版）
   */
  analyzeResourcesLight: function(rooms) {
    let totalEnergy = 0;
    let storageEnergy = 0;
    let capacity = 0;
    
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      totalEnergy += room.energyAvailable;
      capacity += room.energyCapacityAvailable;
      
      if (room.storage) {
        storageEnergy += room.storage.store[RESOURCE_ENERGY] || 0;
      }
    }
    
    return {
      energy: totalEnergy,
      capacity: capacity,
      storage: storageEnergy,
      ratio: capacity > 0 ? totalEnergy / capacity : 0
    };
  },
  
  /**
   * 構造物分析（軽量版）
   */
  analyzeStructuresLight: function(rooms) {
    const structures = {
      towers: 0,
      storage: 0,
      links: 0,
      labs: 0,
      terminals: 0
    };
    
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      
      // find()を使わず、room.structuresキャッシュを活用
      if (room.storage) structures.storage++;
      if (room.terminal) structures.terminals++;
      
      // 他の構造物はカウントのみ（詳細分析は不要）
      const roomStructures = room.find(FIND_MY_STRUCTURES);
      for (let j = 0; j < roomStructures.length; j++) {
        const s = roomStructures[j];
        if (s.structureType === STRUCTURE_TOWER) structures.towers++;
        if (s.structureType === STRUCTURE_LINK) structures.links++;
        if (s.structureType === STRUCTURE_LAB) structures.labs++;
      }
    }
    
    return structures;
  },
  
  /**
   * ボトルネック分析（必要最小限）
   */
  analyzeBottlenecks: function() {
    const bottlenecks = [];
    
    // 1部屋のみチェック（CPU節約）
    for (const roomName in Game.rooms) {
      const room = Game.rooms[roomName];
      if (!room.controller || !room.controller.my) continue;
      
      const creeps = room.find(FIND_MY_CREEPS);
      
      // Harvester数チェックのみ
      const harvesters = [];
      for (let i = 0; i < creeps.length; i++) {
        if (creeps[i].memory.role === 'harvester') {
          harvesters.push(creeps[i]);
        }
      }
      
      const sources = room.find(FIND_SOURCES);
      
      if (harvesters.length < sources.length * 2) {
        bottlenecks.push({
          room: room.name,
          type: 'insufficient_harvesters',
          current: harvesters.length,
          needed: sources.length * 2
        });
      }
      
      // エネルギー不足チェック
      if (room.energyAvailable < room.energyCapacityAvailable * 0.3) {
        bottlenecks.push({
          room: room.name,
          type: 'energy_shortage',
          severity: 'high'
        });
      }
      
      // 1部屋のみで終了
      break;
    }
    
    return bottlenecks;
  },
  
  /**
   * 進化必要性判定（簡略版）
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
    
    // ボトルネック解消（最大2つまで）
    const bottlenecks = state.bottlenecks || [];
    for (let i = 0; i < Math.min(bottlenecks.length, 2); i++) {
      needs.push({
        type: 'bottleneck_fix',
        priority: 7,
        data: bottlenecks[i],
        action: 'optimize_production'
      });
    }
    
    // 新機能追加（構造物ベース）- RCL 3のみチェック
    if (state.rcl >= 3 && state.structures.towers === 0) {
      needs.push({
        type: 'new_feature',
        priority: 8,
        data: { feature: 'tower_management' },
        action: 'create_tower_logic'
      });
    }
    
    return needs;
  },
  
  /**
   * キューに追加
   */
  addToQueue: function(need) {
    // 重複チェック
    const queue = Memory.evolution.queue;
    let exists = false;
    
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].type === need.type && queue[i].action === need.action) {
        exists = true;
        break;
      }
    }
    
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
        
      case 'optimize_production':
        suggestion = this.generateProductionOptimization(item.data);
        break;
        
      case 'create_tower_logic':
        suggestion = this.generateTowerLogic();
        break;
        
      default:
        suggestion = '// Evolution suggestion';
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
    console.log('Current Phase: ' + evo.analysisPhase);
    console.log('Last Full Analysis: ' + (Game.time - evo.lastFullAnalysis) + ' ticks ago');
    
    // 履歴
    if (evo.history.length > 0) {
      console.log('\n📜 Recent Evolution History:');
      const recentHistory = evo.history.slice(-5);
      for (let i = 0; i < recentHistory.length; i++) {
        const h = recentHistory[i];
        console.log('  [' + h.time + '] ' + h.type + ': ' + h.action);
      }
    }
    
    // キュー
    if (evo.queue.length > 0) {
      console.log('\n⏳ Pending Evolutions:');
      const pendingQueue = evo.queue.slice(0, 5);
      for (let i = 0; i < pendingQueue.length; i++) {
        const q = pendingQueue[i];
        console.log('  Priority ' + q.priority + ': ' + q.type + ' (' + q.action + ')');
      }
    }
    
    // 提案
    if (evo.suggestions.length > 0) {
      console.log('\n💡 Code Suggestions:');
      const recentSuggestions = evo.suggestions.slice(-3);
      for (let i = 0; i < recentSuggestions.length; i++) {
        const s = recentSuggestions[i];
        console.log('  [' + s.time + '] ' + s.filename);
        console.log('  ' + s.code.split('\n')[0]);
      }
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
