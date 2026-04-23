/**
 * Auto Evolution System - 自動進化AI
 * ゲーム状況に応じて自動的に新コードを生成・更新
 * CPU最適化版
 */

const utilsMemory = require('./utils.memory');

/**
 * Security: Limits for memory-intensive structures to prevent Memory DoS.
 * Screeps memory is limited to 2MB; unbounded arrays can crash the AI.
 */
const MAX_HISTORY = 50;
const MAX_QUEUE = 10;
const MAX_SUGGESTIONS = 20;

const autoEvolution = {
    /**
     * 初期化
     */
    init: function () {
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
                    successRate: 1.0,
                },
                cache: {
                    gameState: null,
                    cacheTime: 0,
                },
                analysisPhase: 0,
            };
        }
    },

    /**
     * メインループ - 毎ティック実行
     */
    run: function () {
        this.init();

        // CPU使用率チェック - 50%超えたら処理スキップ
        if (Game.cpu.getUsed() / Game.cpu.limit > 0.5) {
            return;
        }

        // 100ティックごとにチェック
        if (Game.time - Memory.evolution.lastCheck < 100) {
            return;
        }

        Memory.evolution.lastCheck = Game.time;

        // 段階的処理
        this.runPhase();
    },

    /**
     * 段階的処理実行
     */
    runPhase: function () {
        const phase = Memory.evolution.analysisPhase;

        switch (phase) {
            case 0: {
                const basicState = this.analyzeBasicState();
                Memory.evolution.cache.gameState = basicState;
                Memory.evolution.cache.cacheTime = Game.time;
                Memory.evolution.analysisPhase = 1;
                break;
            }
            case 1: {
                const state = Memory.evolution.cache.gameState;
                if (state) {
                    state.bottlenecks = this.analyzeBottlenecks();
                    Memory.evolution.cache.gameState = state;
                }
                Memory.evolution.analysisPhase = 2;
                break;
            }
            case 2: {
                const cachedState = Memory.evolution.cache.gameState;
                if (cachedState) {
                    const needs = this.needsEvolution(cachedState);
                    const self = this;
                    needs.forEach(function (need) {
                        self.addToQueue(need);
                    });
                }
                Memory.evolution.analysisPhase = 3;
                break;
            }
            case 3:
                this.processQueue();
                Memory.evolution.analysisPhase = 0;
                Memory.evolution.lastFullAnalysis = Game.time;
                break;
        }
    },

    /**
     * 基本状態分析（軽量版）
     */
    analyzeBasicState: function () {
        const myRooms = [];
        // ⚡ PERFORMANCE: main.jsで準備されたグローバルコレクションを再利用。
        const rooms = global._rooms || Object.values(Game.rooms || {});
        for (let i = 0; i < rooms.length; i++) {
            const room = rooms[i];
            if (room.controller && room.controller.my) {
                myRooms.push(room);
            }
        }

        const state = {
            rcl: myRooms.length > 0 ? myRooms[0].controller.level : 0,
            roomCount: myRooms.length,
            creepCount: global._creeps ? global._creeps.length : Object.keys(Game.creeps).length,
            spawns: global._spawns ? global._spawns.length : Object.keys(Game.spawns).length,
            gcl: Game.gcl.level,
            resources: this.analyzeResourcesLight(myRooms),
            structures: this.analyzeStructuresLight(myRooms),
            threats: [],
            opportunities: {},
            bottlenecks: [],
        };

        return state;
    },

    /**
     * リソース分析（軽量版）
     */
    analyzeResourcesLight: function (rooms) {
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
            ratio: capacity > 0 ? totalEnergy / capacity : 0,
        };
    },

    /**
     * 構造物分析（軽量版）
     */
    analyzeStructuresLight: function (rooms) {
        const structures = {
            towers: 0,
            storage: 0,
            links: 0,
            labs: 0,
            terminals: 0,
        };

        const structureCounter = (structure) => {
            const type = structure.structureType;
            if (type === STRUCTURE_TOWER) structures.towers++;
            else if (type === STRUCTURE_LINK) structures.links++;
            else if (type === STRUCTURE_LAB) structures.labs++;
        };

        for (let i = 0; i < rooms.length; i++) {
            const room = rooms[i];

            if (room.storage) {
                structures.storage++;
            }
            if (room.terminal) {
                structures.terminals++;
            }

            // ⚡ PERFORMANCE: main.jsで準備された部屋ごとのキャッシュを優先使用。
            const roomStructures = room._myStructures || room.find(FIND_MY_STRUCTURES);
            roomStructures.forEach(structureCounter);
        }

        return structures;
    },

    /**
     * ボトルネック分析（必要最小限）
     */
    analyzeBottlenecks: function () {
        const bottlenecks = [];

        // ⚡ PERFORMANCE: main.jsで準備されたグローバルコレクションを再利用。
        const rooms = global._rooms || Object.values(Game.rooms || {});
        for (let i = 0; i < rooms.length; i++) {
            const room = rooms[i];
            if (!room.controller || !room.controller.my) {
                continue;
            }

            // ⚡ PERFORMANCE: main.jsのwarmRoomCacheで計算済みのroleCountsを使用。O(1) lookup。
            const harvestersCount = room._roleCounts ? room._roleCounts.harvester : 0;

            // ⚡ PERFORMANCE: ソース数は不変なため、RoomMemoryにキャッシュして毎ティックのfind(FIND_SOURCES)を回避。
            if (room.memory._sourcesCount === undefined) {
                room.memory._sourcesCount = room.find(FIND_SOURCES).length;
            }
            const sourcesCount = room.memory._sourcesCount;

            if (harvestersCount < sourcesCount * 2) {
                bottlenecks.push({
                    room: room.name,
                    type: 'insufficient_harvesters',
                    current: harvestersCount,
                    needed: sourcesCount * 2,
                });
            }

            if (room.energyAvailable < room.energyCapacityAvailable * 0.3) {
                bottlenecks.push({
                    room: room.name,
                    type: 'energy_shortage',
                    severity: 'high',
                });
            }

            break;
        }

        return bottlenecks;
    },

    /**
     * 進化必要性判定 - RCLアップグレード検知
     */
    _checkRclUpgrade: function (state, needs) {
        if (state.rcl > Memory.evolution.lastRCL) {
            needs.push({
                type: 'rcl_upgrade',
                priority: 10,
                data: {
                    oldRCL: Memory.evolution.lastRCL,
                    newRCL: state.rcl,
                },
                action: 'create_rcl_features',
            });
            Memory.evolution.lastRCL = state.rcl;
        }
    },

    /**
     * 進化必要性判定 - ボトルネック解消
     */
    _checkBottlenecks: function (state, needs) {
        const bottlenecks = state.bottlenecks || [];
        for (let i = 0; i < Math.min(bottlenecks.length, 2); i++) {
            needs.push({
                type: 'bottleneck_fix',
                priority: 7,
                data: bottlenecks[i],
                action: 'optimize_production',
            });
        }
    },

    /**
     * 進化必要性判定 - 新機能追加
     */
    _checkNewFeatures: function (state, needs) {
        if (state.rcl >= 3 && state.structures.towers === 0) {
            needs.push({
                type: 'new_feature',
                priority: 8,
                data: { feature: 'tower_management' },
                action: 'create_tower_logic',
            });
        }
    },

    /**
     * 進化必要性判定（簡略版）
     */
    needsEvolution: function (state) {
        const needs = [];
        this._checkRclUpgrade(state, needs);
        this._checkBottlenecks(state, needs);
        this._checkNewFeatures(state, needs);
        return needs;
    },

    /**
     * キューに追加
     */
    addToQueue: function (need) {
        const queue = Memory.evolution.queue;

        // Security: プロトタイプ汚染対策のため、キーを検証
        if (!utilsMemory.isSafeKey(need.type) || !utilsMemory.isSafeKey(need.action)) {
            return;
        }

        // Security: Prevent queue flooding (Memory DoS)
        if (queue.length >= MAX_QUEUE) {
            return;
        }

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
    processQueue: function () {
        if (Memory.evolution.queue.length === 0) {
            return;
        }

        Memory.evolution.queue.sort(function (a, b) {
            return b.priority - a.priority;
        });

        const item = Memory.evolution.queue[0];

        this.generateCodeSuggestion(item);

        Memory.evolution.history.push({
            time: Game.time,
            type: item.type,
            action: item.action,
            data: item.data,
        });

        // Security: Immediate rotation to prevent Memory DoS
        if (Memory.evolution.history.length > MAX_HISTORY) {
            Memory.evolution.history.shift();
        }

        Memory.evolution.stats.totalEvolutions++;

        Memory.evolution.queue.shift();
    },

    /**
     * コード生成提案
     */
    generateCodeSuggestion: function (item) {
        let suggestion = '';

        switch (item.action) {
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
            filename: this.getFilename(item.action),
        });

        // Security: Immediate rotation (limited because suggestions contain large code blocks)
        if (Memory.evolution.suggestions.length > MAX_SUGGESTIONS) {
            Memory.evolution.suggestions.shift();
        }

        console.log('✨ Code suggestion generated: ' + this.getFilename(item.action));
        console.log('📝 Check Memory.evolution.suggestions for details');
    },

    /**
     * RCL機能生成
     */
    generateRCLFeatures: function (data) {
        const rcl = data.newRCL;

        if (rcl === 3) return '// Tower management code needed\n// Create structure.tower.js';
        if (rcl === 4) return '// Storage management needed\n// Create storage.manager.js';
        if (rcl === 5) return '// Link network needed\n// Create link.network.js';
        if (rcl === 6) return '// Mineral mining needed\n// Create role.miner.js';

        return '// RCL ' + rcl + ' features';
    },

    /**
     * 生産最適化コード生成
     */
    generateProductionOptimization: function (data) {
        return (
            '// Optimize ' +
            data.type +
            '\n// Current: ' +
            (data.current ?? 'N/A') +
            ', Needed: ' +
            (data.needed ?? 'N/A')
        );
    },

    /**
     * Towerロジック生成
     */
    generateTowerLogic: function () {
        return 'module.exports = {\n  run: function(tower) {\n    // Attack hostiles\n    // Repair structures\n  }\n};';
    },

    /**
     * ファイル名取得
     */
    getFilename: function (action) {
        const map = {
            create_tower_logic: 'structure.tower.js',
            create_storage_logic: 'storage.manager.js',
            create_link_logic: 'link.network.js',
            create_defense: 'role.defender.js',
            optimize_production: 'spawn.optimizer.js',
        };

        // Security: hasOwnPropertyを使用してプロトタイプ汚染を防止
        return Object.prototype.hasOwnProperty.call(map, action)
            ? map[action]
            : 'evolution.code.js';
    },

    /**
     * ダッシュボード表示
     */
    showDashboard: function () {
        this.init();
        const evo = Memory.evolution;

        console.log('\n🤖 === AUTO EVOLUTION DASHBOARD === 🤖');
        console.log('Total Evolutions: ' + evo.stats.totalEvolutions);
        console.log('Success Rate: ' + evo.stats.successRate * 100 + '%');
        console.log('Queue Length: ' + evo.queue.length);
        console.log('Current Phase: ' + evo.analysisPhase);
        console.log('Last Full Analysis: ' + (Game.time - evo.lastFullAnalysis) + ' ticks ago');

        if (evo.history.length > 0) {
            console.log('\n📜 Recent Evolution History:');
            const recentHistory = evo.history.slice(-5);
            for (let i = 0; i < recentHistory.length; i++) {
                const h = recentHistory[i];
                console.log('  [' + h.time + '] ' + h.type + ': ' + h.action);
            }
        }

        if (evo.queue.length > 0) {
            console.log('\n⏳ Pending Evolutions:');
            const pendingQueue = evo.queue.slice(0, 5);
            for (let i = 0; i < pendingQueue.length; i++) {
                const q = pendingQueue[i];
                console.log('  Priority ' + q.priority + ': ' + q.type + ' (' + q.action + ')');
            }
        }

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
    reset: function () {
        delete Memory.evolution;
        console.log('🔄 Evolution system reset!');
    },
};

module.exports = autoEvolution;
