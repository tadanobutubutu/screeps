/**
 * src/roles/repairer.js
 * 修復クリープ（Repairer）の制御モジュール
 *
 * リペアラーはルーム内の損傷した構造物を修復する。
 * 道路・コンテナなどを優先的に修復し、壁やランパートも段階的に補強する。
 * 修復対象がない場合はビルダーとして建設を補助する。
 */

'use strict';

const cache = require('../utils/cache');
const pathfinder = require('../utils/pathfinder');
const logger = require('../utils/logger');
const { MEMORY_KEYS, REPAIR_THRESHOLD, WALL_HP_TARGET } = require('../constants');

// ============================================================
// 修復対象の優先度（低い数値 = 高優先）
// ============================================================

const REPAIR_PRIORITY = {
    [STRUCTURE_CONTAINER]: 1,
    [STRUCTURE_ROAD]: 2,
    [STRUCTURE_RAMPART]: 3,
    [STRUCTURE_TOWER]: 4,
    [STRUCTURE_SPAWN]: 5,
    [STRUCTURE_EXTENSION]: 6,
    [STRUCTURE_STORAGE]: 7,
    [STRUCTURE_WALL]: 8,
};

// ============================================================
// メイン制御
// ============================================================

/**
 * リペアラークリープのメインロジックを実行する
 * @param {Creep} creep
 */
function run(creep) {
    _updateWorkingState(creep);

    if (creep.memory[MEMORY_KEYS.WORKING]) {
        _repair(creep);
    } else {
        _getEnergy(creep);
    }
}

// ============================================================
// 状態遷移
// ============================================================

/**
 * クリープのworking状態を更新する
 * @param {Creep} creep
 */
function _updateWorkingState(creep) {
    const energy = creep.store[RESOURCE_ENERGY];
    const capacity = creep.store.getCapacity(RESOURCE_ENERGY);

    if (creep.memory[MEMORY_KEYS.WORKING] && energy === 0) {
        creep.memory[MEMORY_KEYS.WORKING] = false;
        creep.say('🔄 補充');
        delete creep.memory[MEMORY_KEYS.TARGET_ID];
    }

    if (!creep.memory[MEMORY_KEYS.WORKING] && energy === capacity) {
        creep.memory[MEMORY_KEYS.WORKING] = true;
        creep.say('🔧 修復');
    }
}

// ============================================================
// 修復ロジック
// ============================================================

/**
 * 最優先の修復ターゲットを修復する
 * @param {Creep} creep
 */
function _repair(creep) {
    const target = _getRepairTarget(creep);

    if (!target) {
        // 修復対象がない場合は建設を補助
        _buildAsBackup(creep);
        return;
    }

    const result = creep.repair(target);
    if (result === ERR_NOT_IN_RANGE) {
        pathfinder.moveTo(creep, target, { range: 3 });
    } else if (result === OK) {
        // 修復完了かどうかチェック
        if (target.hits >= target.hitsMax * 0.95) {
            delete creep.memory[MEMORY_KEYS.TARGET_ID];
        }

        // HPバーを表示
        _showRepairVisual(creep, target);
    } else if (result === ERR_INVALID_TARGET) {
        delete creep.memory[MEMORY_KEYS.TARGET_ID];
    }
}

/**
 * 最優先の修復対象を返す
 * RCLに応じたウォールHPターゲットも考慮する
 * @param {Creep} creep
 * @returns {Structure|null}
 */
function _getRepairTarget(creep) {
    // 前回のターゲットを再利用
    if (creep.memory[MEMORY_KEYS.TARGET_ID]) {
        const saved = Game.getObjectById(creep.memory[MEMORY_KEYS.TARGET_ID]);
        if (saved && _needsRepair(saved, creep.room)) return saved;
        delete creep.memory[MEMORY_KEYS.TARGET_ID];
    }

    const room = creep.room;
    const rcl = room.controller ? room.controller.level : 1;
    const wallTarget = WALL_HP_TARGET[rcl] || WALL_HP_TARGET[1];

    // 修復が必要な構造物を収集
    const damaged = cache.getStructures(room).filter((s) => _needsRepair(s, room, wallTarget));

    if (damaged.length === 0) return null;

    // 優先度 → HP率 → 距離でソート
    const sorted = damaged.slice().sort((a, b) => {
        const pa = REPAIR_PRIORITY[a.structureType] || 9;
        const pb = REPAIR_PRIORITY[b.structureType] || 9;
        if (pa !== pb) return pa - pb;

        const ra = a.hits / a.hitsMax;
        const rb = b.hits / b.hitsMax;
        if (Math.abs(ra - rb) > 0.1) return ra - rb;

        return creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b);
    });

    const target = sorted[0];
    creep.memory[MEMORY_KEYS.TARGET_ID] = target.id;
    return target;
}

/**
 * 構造物が修復を必要とするか判断する
 * @param {Structure} structure
 * @param {Room} room
 * @param {number} [wallTarget]
 * @returns {boolean}
 */
function _needsRepair(structure, room, wallTarget) {
    const type = structure.structureType;

    if (type === STRUCTURE_WALL) {
        const rcl = room.controller ? room.controller.level : 1;
        const target = wallTarget || WALL_HP_TARGET[rcl] || WALL_HP_TARGET[1];
        return structure.hits < target;
    }

    if (type === STRUCTURE_RAMPART) {
        const rcl = room.controller ? room.controller.level : 1;
        const target = wallTarget || WALL_HP_TARGET[rcl] || WALL_HP_TARGET[1];
        return structure.hits < target;
    }

    const threshold = REPAIR_THRESHOLD[type] || REPAIR_THRESHOLD.OTHER;
    return structure.hits < structure.hitsMax * threshold;
}

/**
 * 修復中のビジュアルを表示する
 * @param {Creep} creep
 * @param {Structure} target
 */
function _showRepairVisual(creep, target) {
    const pct = target.hits / target.hitsMax;
    const color = pct < 0.3 ? '#ff4444' : pct < 0.7 ? '#ffaa00' : '#00ff88';
    creep.room.visual.text(
        `🔧 ${(pct * 100).toFixed(0)}%`,
        target.pos.x,
        target.pos.y - 1,
        { color, font: 0.4, align: 'center' }
    );
}

/**
 * 修復対象がない場合に建設を補助する
 * @param {Creep} creep
 */
function _buildAsBackup(creep) {
    const sites = cache.getConstructionSites(creep.room);
    if (sites.length > 0) {
        const site = pathfinder.closest(creep.pos, sites);
        const result = creep.build(site);
        if (result === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, site, { range: 3 });
        }
        creep.say('🔨 建設');
        return;
    }

    // 建設もなければコントローラーをアップグレード
    const controller = creep.room.controller;
    if (controller) {
        if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, controller, { range: 3 });
        }
        creep.say('⬆️ 強化');
    }
}

// ============================================================
// エネルギー取得ロジック
// ============================================================

/**
 * エネルギーを取得する
 * @param {Creep} creep
 */
function _getEnergy(creep) {
    const room = creep.room;

    // 落下リソースを優先回収
    const dropped = cache.getDroppedResources(room);
    const energyDrops = dropped.filter(
        (r) => r.resourceType === RESOURCE_ENERGY && r.amount >= 30
    );
    if (energyDrops.length > 0) {
        const res = pathfinder.closest(creep.pos, energyDrops);
        if (creep.pickup(res) === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, res, { range: 1 });
        }
        return;
    }

    // コンテナから取得
    const containers = cache.getContainers(room);
    const available = containers.filter((c) => c.store[RESOURCE_ENERGY] >= 100);
    if (available.length > 0) {
        const container = pathfinder.closest(creep.pos, available);
        if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, container, { range: 1 });
        }
        return;
    }

    // ストレージから取得
    const storage = cache.getStorage(room);
    if (storage && storage.store[RESOURCE_ENERGY] >= 200) {
        if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, storage, { range: 1 });
        }
        return;
    }

    // ソースから直接採掘
    const source = cache.assignSource(creep, room);
    if (source) {
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, source, { range: 1 });
        }
    }
}

// ============================================================
// ボディ生成
// ============================================================

/**
 * 利用可能エネルギーに応じたボディを返す
 * @param {number} energy
 * @returns {string[]}
 */
function getBody(energy) {
    if (energy >= 500) {
        return [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    }
    if (energy >= 300) {
        return [WORK, CARRY, CARRY, MOVE];
    }
    return [WORK, CARRY, MOVE];
}

// ============================================================
// ユーティリティ
// ============================================================

/**
 * ルーム内の修復が必要な構造物数を返す
 * @param {Room} room
 * @returns {number}
 */
function countDamagedStructures(room) {
    const rcl = room.controller ? room.controller.level : 1;
    const wallTarget = WALL_HP_TARGET[rcl] || WALL_HP_TARGET[1];
    return cache.getStructures(room).filter((s) => _needsRepair(s, room, wallTarget)).length;
}

module.exports = { run, getBody, countDamagedStructures, REPAIR_PRIORITY };
