/**
 * src/managers/spawnManager.js
 * クリープスポーン管理モジュール
 *
 * ルームのRCL・エネルギー状況・現在のクリープ数に応じて
 * 最適なクリープのスポーンを管理する。
 * スポーンキューを使い、優先度の高いロールから順にスポーンする。
 */

'use strict';

const cache = require('../utils/cache');
const logger = require('../utils/logger');
const {
    ROLES,
    BODY_PRESETS,
    BODY_COSTS,
    SPAWN_PRIORITY,
    TARGET_CREEPS_BY_RCL,
} = require('../constants');

let _spawnCounter = 0;

// ============================================================
// スポーンキュー
// ============================================================

/**
 * スポーンキューを取得する（global.cache に格納）
 * @returns {Array}
 */
function _getQueue() {
    if (!global.cache) global.cache = {};
    if (!global.cache.spawnQueue) global.cache.spawnQueue = [];
    return global.cache.spawnQueue;
}

/**
 * スポーンキューをクリアする
 */
function clearQueue() {
    if (global.cache) {
        global.cache.spawnQueue = [];
    }
}

// ============================================================
// メイン制御
// ============================================================

/**
 * スポーン管理のメインロジックを実行する
 * @param {StructureSpawn} spawn
 */
function run(spawn) {
    if (!spawn || spawn.spawning) return;

    const room = spawn.room;
    if (!room.controller || !room.controller.my) return;

    try {
        // スポーンキューを構築
        const queue = _buildSpawnQueue(room);
        if (queue.length === 0) return;

        // キューの先頭からスポーンを試みる
        for (const request of queue) {
            const result = _trySpawn(spawn, request);
            if (result === OK) {
                logger.info(`[SpawnManager] ${request.role} をスポーン: ${request.name}`);
                break;
            } else if (result === ERR_NOT_ENOUGH_ENERGY) {
                // エネルギー不足は一時的なのでスキップしない
                break;
            }
        }
    } catch (e) {
        logger.error('[SpawnManager] スポーンエラー', e);
    }
}

// ============================================================
// スポーンキュー構築
// ============================================================

// ⚡ PERFORMANCE OPTIMIZATION: Pre-sort SPAWN_PRIORITY keys once globally to avoid per-tick sorting and full iterations.
const SORTED_ROLES = Object.keys(SPAWN_PRIORITY).sort(
    (a, b) => SPAWN_PRIORITY[a] - SPAWN_PRIORITY[b]
);

/**
 * 現在のルーム状態からスポーンキューを構築する
 * @param {Room} room
 * @returns {Array<{ role: string, body: string[], name: string, priority: number }>}
 */
function _buildSpawnQueue(room) {
    const rcl = room.controller.level;
    const targets = _getTargetCounts(room, rcl);
    const current = _getCurrentCounts(room);
    const queue = [];

    // ⚡ PERFORMANCE OPTIMIZATION: Iterate roles by pre-sorted priority and break early.
    // This avoids iterating through all roles, allocating bodies, and sorting an array every tick.
    for (let i = 0; i < SORTED_ROLES.length; i++) {
        const role = SORTED_ROLES[i];
        if (!Object.prototype.hasOwnProperty.call(targets, role)) continue;

        const needed = targets[role] - (current[role] || 0);
        if (needed <= 0) continue;

        // エネルギーに応じた最適ボディを取得
        const body = _selectBody(role, room.energyAvailable, room.energyCapacityAvailable);
        if (!body || body.length === 0) continue;

        const cost = _calcBodyCost(body);
        if (cost > room.energyCapacityAvailable) continue;

        queue.push({
            role,
            body,
            name: `${role}_${Game.time}_${_spawnCounter++}`,
            priority: SPAWN_PRIORITY[role] || 99,
            cost,
        });

        break; // Only need the highest priority request per tick
    }

    return queue;
}

/**
 * RCLとルーム状況に応じたターゲットクリープ数を返す
 * @param {Room} room
 * @param {number} rcl
 * @returns {Object.<string, number>}
 */
function _getTargetCounts(room, rcl) {
    const baseTargets = TARGET_CREEPS_BY_RCL[rcl] || TARGET_CREEPS_BY_RCL[1];
    const result = Object.assign(Object.create(null), baseTargets);

    // 建設サイトがある場合はビルダーを追加
    const sites = cache.getConstructionSites(room);
    if (sites.length > 0) {
        result[ROLES.BUILDER] = Math.max(
            result[ROLES.BUILDER] || 0,
            Math.min(3, Math.ceil(sites.length / 5))
        );
    }

    // 侵入者がいる場合はディフェンダーを追加
    const enemies = cache.getEnemies(room);
    const attackers = enemies.filter(
        (e) => e.getActiveBodyparts(ATTACK) > 0 || e.getActiveBodyparts(RANGED_ATTACK) > 0
    );
    if (attackers.length > 0) {
        result[ROLES.DEFENDER] = Math.max(result[ROLES.DEFENDER] || 0, attackers.length);
    }

    // 緊急モード: クリープが0の場合は最低限のハーベスターを確保
    // ⚡ PERFORMANCE OPTIMIZATION: Removed unused totalCreeps variable and its O(N) reduce allocation.
    // ⚡ PERFORMANCE OPTIMIZATION: Use O(1) loop-based early-exit instead of Object.keys(Game.creeps).length to check if empty, avoiding array allocation.
    let hasCreeps = false;
    for (let name in Game.creeps) {
        if (Object.prototype.hasOwnProperty.call(Game.creeps, name)) {
            hasCreeps = true;
            break;
        }
    }
    if (!hasCreeps) {
        result[ROLES.HARVESTER] = Math.max(result[ROLES.HARVESTER] || 0, 1);
    }

    return result;
}

/**
 * 現在のルーム内クリープ数をロール別に集計する
 * @param {Room} room
 * @returns {Object.<string, number>}
 */
function _getCurrentCounts(room) {
    const counts = Object.create(null);

    // ⚡ PERFORMANCE OPTIMIZATION: Use getMyCreeps cache to avoid redundant iteration over global Game.creeps.
    // Complexity reduces from O(GlobalCreeps) to O(RoomCreeps).
    const creeps = cache.getMyCreeps(room);
    for (let i = 0; i < creeps.length; i++) {
        const creep = creeps[i];
        if (creep.spawning) continue; // スポーン中のクリープはスポーンAPIから別途カウント

        const role = creep.memory.role;
        if (role && cache.isSafeKey(role)) {
            counts[role] = (counts[role] || 0) + 1;
        }
    }

    // スポーン中のクリープも含める
    // ⚡ PERFORMANCE OPTIMIZATION: Use getSpawns cache to avoid redundant iteration over global Game.spawns.
    const spawns = cache.getSpawns(room);
    for (let i = 0; i < spawns.length; i++) {
        const spawn = spawns[i];
        if (!spawn.spawning) continue;

        const spawningCreep = Game.creeps[spawn.spawning.name];
        if (spawningCreep && spawningCreep.memory.role) {
            const role = spawningCreep.memory.role;
            if (cache.isSafeKey(role)) {
                counts[role] = (counts[role] || 0) + 1;
            }
        }
    }

    return counts;
}

// ============================================================
// ボディ選択
// ============================================================

/**
 * ロールと利用可能エネルギーに応じた最適ボディを選択する
 * @param {string} role
 * @param {number} available - 現在利用可能なエネルギー
 * @param {number} capacity - スポーン最大エネルギー容量
 * @returns {string[]|null}
 */
function _selectBody(role, available, capacity) {
    const presets = BODY_PRESETS[role];
    if (!presets) return null;

    // 最大容量以下で最もコストが高いボディを選択（最強のボディ）
    let bestBody = null;
    for (const preset of presets) {
        if (preset.cost <= capacity) {
            bestBody = preset.body;
        }
    }

    if (!bestBody) {
        // 容量内に収まるプリセットがなければ最小構成を選択
        bestBody = presets[0].body;
    }

    // 現在のエネルギーでスポーンできる最大のボディを選択
    let spawnableBody = null;
    for (const preset of presets) {
        if (preset.cost <= available) {
            spawnableBody = preset.body;
        }
    }

    // 緊急時は小さいボディでもスポーン
    if (!spawnableBody) {
        const emergencyBodies = {
            [ROLES.HARVESTER]: [WORK, CARRY, MOVE],
            [ROLES.UPGRADER]: [WORK, CARRY, MOVE],
            [ROLES.BUILDER]: [WORK, CARRY, MOVE],
            [ROLES.REPAIRER]: [WORK, CARRY, MOVE],
            [ROLES.MINER]: [WORK, MOVE],
            [ROLES.TRANSPORTER]: [CARRY, CARRY, MOVE],
            [ROLES.DEFENDER]: [ATTACK, MOVE],
            [ROLES.SCOUT]: [MOVE],
        };
        const emergency = emergencyBodies[role];
        if (emergency && _calcBodyCost(emergency) <= available) {
            return emergency;
        }
        return null;
    }

    return spawnableBody;
}

// ============================================================
// スポーン実行
// ============================================================

/**
 * スポーンリクエストを実行する
 * @param {StructureSpawn} spawn
 * @param {{ role: string, body: string[], name: string }} request
 * @returns {number} スポーン結果コード
 */
function _trySpawn(spawn, request) {
    return spawn.spawnCreep(request.body, request.name, {
        memory: {
            role: request.role,
            homeRoom: spawn.room.name,
            spawnedAt: Game.time,
        },
    });
}

// ============================================================
// スポーン表示
// ============================================================

/**
 * スポーン中のビジュアルを表示する
 * @param {StructureSpawn} spawn
 */
function showSpawnVisual(spawn) {
    if (!spawn.spawning) return;

    const spawningCreep = Game.creeps[spawn.spawning.name];
    if (!spawningCreep) return;

    const role = spawningCreep.memory.role;
    const progress =
        (spawn.spawning.needTime - spawn.spawning.remainingTime) / spawn.spawning.needTime;

    // 役割と進捗を表示
    spawn.room.visual.text(
        `🛠️ ${role} (${Math.floor(progress * 100)}%)`,
        spawn.pos.x + 1,
        spawn.pos.y,
        { align: 'left', opacity: 0.8, font: 0.5 }
    );

    // プログレスバー
    spawn.room.visual.rect(spawn.pos.x - 0.5, spawn.pos.y + 0.6, progress, 0.2, {
        fill: '#00bfff',
        opacity: 0.8,
    });
}

// ============================================================
// ユーティリティ
// ============================================================

/**
 * ボディのエネルギーコストを計算する
 * @param {string[]} body
 * @returns {number}
 */
function _calcBodyCost(body) {
    // ⚡ PERFORMANCE OPTIMIZATION: Use a single-pass for loop instead of Array.prototype.reduce
    // to eliminate function closure allocations and callback overhead per call.
    let total = 0;
    for (let i = 0; i < body.length; i++) {
        total += BODY_COSTS[body[i]] || 0;
    }
    return total;
}

/**
 * スポーン統計をコンソールに表示する
 * @param {Room} room
 */
function showStats(room) {
    const rcl = room.controller ? room.controller.level : 0;
    const targets = _getTargetCounts(room, rcl);
    const current = _getCurrentCounts(room);

    logger.info(`[SpawnManager] ルーム ${room.name} のクリープ状況 (RCL ${rcl}):`);
    for (const role in targets) {
        if (!Object.prototype.hasOwnProperty.call(targets, role)) continue;
        const t = targets[role];
        const c = current[role] || 0;
        const status = c >= t ? '✓' : '⚠️';
        logger.info(`  ${status} ${role}: ${c}/${t}`);
    }
}

module.exports = {
    run,
    showSpawnVisual,
    showStats,
    clearQueue,
};
