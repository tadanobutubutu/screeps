/**
 * src/roles/harvester.js
 * エネルギー採掘クリープ（Harvester）の制御モジュール
 *
 * ハーベスターはソースからエネルギーを採掘し、
 * スポーン・エクステンション・タワーなどにエネルギーを補充する。
 * コンテナやストレージが利用可能な場合はそちらを優先する。
 */

'use strict';

const cache = require('../utils/cache');
const pathfinder = require('../utils/pathfinder');
const logger = require('../utils/logger');
const { MEMORY_KEYS } = require('../constants');

// ============================================================
// タスク定義
// ============================================================

const TASK = {
    HARVEST: 'harvest',
    DELIVER: 'deliver',
};

// ============================================================
// メイン制御
// ============================================================

/**
 * ハーベスタークリープのメインロジックを実行する
 * @param {Creep} creep
 */
function run(creep) {
    _updateWorkingState(creep);

    if (creep.memory[MEMORY_KEYS.WORKING]) {
        _deliver(creep);
    } else {
        _harvest(creep);
    }
}

// ============================================================
// 状態遷移
// ============================================================

/**
 * クリープのworking状態を更新する
 * - 空になったら採掘モードへ
 * - 満杯になったら納品モードへ
 * @param {Creep} creep
 */
function _updateWorkingState(creep) {
    const energy = creep.store[RESOURCE_ENERGY];
    const capacity = creep.store.getCapacity(RESOURCE_ENERGY);

    if (creep.memory[MEMORY_KEYS.WORKING] && energy === 0) {
        creep.memory[MEMORY_KEYS.WORKING] = false;
        creep.say('🔄 採掘');
        // ソース割り当てをリセットして再割り当てを促す
        delete creep.memory[MEMORY_KEYS.SOURCE_ID];
    }

    if (!creep.memory[MEMORY_KEYS.WORKING] && energy === capacity) {
        creep.memory[MEMORY_KEYS.WORKING] = true;
        creep.say('🚚 納品');
    }
}

// ============================================================
// 採掘ロジック
// ============================================================

/**
 * エネルギーソースから採掘する
 * 落下リソースがあれば優先的に回収する
 * @param {Creep} creep
 */
function _harvest(creep) {
    // 落下リソースの回収を優先
    const dropped = _findDroppedEnergy(creep);
    if (dropped && dropped.amount >= 50) {
        if (creep.pickup(dropped) === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, dropped, { range: 1 });
        }
        return;
    }

    // コンテナからのエネルギー回収を次に優先
    const container = _findAvailableContainer(creep);
    if (container && container.store[RESOURCE_ENERGY] >= 200) {
        if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, container, { range: 1 });
        }
        return;
    }

    // ソースから直接採掘
    const source = cache.assignSource(creep, creep.room);
    if (!source) {
        logger.warn(`[${creep.name}] ソースが見つかりません`);
        return;
    }

    const result = creep.harvest(source);
    if (result === ERR_NOT_IN_RANGE) {
        pathfinder.moveTo(creep, source, { range: 1 });
    } else if (result === ERR_NOT_ENOUGH_ENERGY) {
        // ソースが空 - 隣のソースを試す
        delete creep.memory[MEMORY_KEYS.SOURCE_ID];
    }
}

/**
 * 近くの落下エネルギーリソースを探す
 * @param {Creep} creep
 * @returns {Resource|null}
 */
function _findDroppedEnergy(creep) {
    const dropped = cache.getDroppedResources(creep.room);
    // ⚡ PERFORMANCE OPTIMIZATION: Use single-pass for loop and hoist position check outside search loop.
    let bestDrop = null;
    let minDistance = Infinity;
    // Hoist position method check outside loop to prevent redundant evaluations per iteration
    const hasGetRangeTo = creep.pos && typeof creep.pos.getRangeTo === 'function';
    for (let i = 0; i < dropped.length; i++) {
        const r = dropped[i];
        if (r.resourceType === RESOURCE_ENERGY) {
            const dist = hasGetRangeTo ? creep.pos.getRangeTo(r) : 0;
            if (dist < minDistance) {
                minDistance = dist;
                bestDrop = r;
            }
        }
    }
    return bestDrop;
}

/**
 * エネルギーが入ったコンテナを探す
 * @param {Creep} creep
 * @returns {StructureContainer|null}
 */
function _findAvailableContainer(creep) {
    const containers = cache.getContainers(creep.room);
    // ⚡ PERFORMANCE OPTIMIZATION: Use single-pass for loop and hoist position check outside search loop.
    let bestContainer = null;
    let minDistance = Infinity;
    // Hoist position method check outside loop to prevent redundant evaluations per iteration
    const hasGetRangeTo = creep.pos && typeof creep.pos.getRangeTo === 'function';
    for (let i = 0; i < containers.length; i++) {
        const c = containers[i];
        if (c.store[RESOURCE_ENERGY] >= 100) {
            const dist = hasGetRangeTo ? creep.pos.getRangeTo(c) : 0;
            if (dist < minDistance) {
                minDistance = dist;
                bestContainer = c;
            }
        }
    }
    return bestContainer;
}

// ============================================================
// 納品ロジック
// ============================================================

/**
 * エネルギーを構造物に納品する
 * 優先順位: スポーン/エクステンション → タワー → コンテナ → ストレージ
 * @param {Creep} creep
 */
function _deliver(creep) {
    // ⚡ PERFORMANCE OPTIMIZATION: Cache the delivery target ID to avoid per-tick search
    let target = null;
    const targetId = creep.memory[MEMORY_KEYS.TARGET_ID];

    if (targetId) {
        target = Game.getObjectById(targetId);
        // Valid target must still exist and have free capacity
        if (
            !target ||
            !target.store ||
            target.store.getFreeCapacity(RESOURCE_ENERGY) === 0 ||
            (target.structureType === STRUCTURE_TOWER &&
                target.store.getFreeCapacity(RESOURCE_ENERGY) <= 200 &&
                creep.store[RESOURCE_ENERGY] > target.store.getFreeCapacity(RESOURCE_ENERGY))
        ) {
            target = null;
            delete creep.memory[MEMORY_KEYS.TARGET_ID];
        }
    }

    if (!target) {
        target = _findEnergyTarget(creep);
        if (target) {
            creep.memory[MEMORY_KEYS.TARGET_ID] = target.id;
        }
    }

    if (!target) {
        // 納品先がなければアップグレードを補助
        _upgradeAsBackup(creep);
        return;
    }

    const result = creep.transfer(target, RESOURCE_ENERGY);
    if (result === ERR_NOT_IN_RANGE) {
        pathfinder.moveTo(creep, target, { range: 1 });
    } else if (result === OK || result === ERR_FULL) {
        // 納品完了または満杯ならターゲットをクリア（次ティックで再検索）
        delete creep.memory[MEMORY_KEYS.TARGET_ID];
        if (result === ERR_FULL) {
            cache.invalidate(`need_energy_${creep.room.name}`);
        }
    }
}

/**
 * スポーン、エクステンション、またはタワーの中から最適な納品先を探す
 * @param {Creep} creep
 * @returns {Structure|null}
 */
function _findPrimaryTarget(creep) {
    // ⚡ PERFORMANCE OPTIMIZATION: Use single-pass for loop to identify candidates for all priorities.
    // Hoist getRangeTo method check outside target search loop.
    const needingEnergy = cache.getStructuresNeedingEnergy(creep.room);

    let closestSpawnExt = null;
    let minSpawnExtDist = Infinity;
    let closestTower = null;
    let minTowerDist = Infinity;
    const hasGetRangeTo = creep.pos && typeof creep.pos.getRangeTo === 'function';

    for (let i = 0; i < needingEnergy.length; i++) {
        const s = needingEnergy[i];
        const type = s.structureType;
        const dist = hasGetRangeTo ? creep.pos.getRangeTo(s) : 0;

        // 1. スポーン・エクステンションの優先探索
        if (type === STRUCTURE_SPAWN || type === STRUCTURE_EXTENSION) {
            if (dist < minSpawnExtDist) {
                minSpawnExtDist = dist;
                closestSpawnExt = s;
            }
        }
        // 2. タワーの探索 (200以上の空き容量があるものを優先)
        else if (type === STRUCTURE_TOWER && s.store.getFreeCapacity(RESOURCE_ENERGY) > 200) {
            if (dist < minTowerDist) {
                minTowerDist = dist;
                closestTower = s;
            }
        }
    }

    if (closestSpawnExt) return closestSpawnExt;
    if (closestTower) return closestTower;

    return null;
}

/**
 * 納品可能なコンテナを探す
 * @param {Creep} creep
 * @returns {StructureContainer|null}
 */
function _findContainerTarget(creep) {
    const containers = cache.getContainers(creep.room);
    let closestContainer = null;
    let minContainerDist = Infinity;
    const hasGetRangeTo = creep.pos && typeof creep.pos.getRangeTo === 'function';

    for (let i = 0; i < containers.length; i++) {
        const c = containers[i];
        if (c.store.getFreeCapacity(RESOURCE_ENERGY) > 200) {
            const dist = hasGetRangeTo ? creep.pos.getRangeTo(c) : 0;
            if (dist < minContainerDist) {
                minContainerDist = dist;
                closestContainer = c;
            }
        }
    }

    return closestContainer;
}

/**
 * 納品可能なストレージを探す
 * @param {Creep} creep
 * @returns {StructureStorage|null}
 */
function _findStorageTarget(creep) {
    const storage = cache.getStorage(creep.room);
    if (storage && storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        return storage;
    }

    return null;
}

/**
 * エネルギーを必要とする構造物を優先度順に探す
 * @param {Creep} creep
 * @returns {Structure|null}
 */
function _findEnergyTarget(creep) {
    let target = _findPrimaryTarget(creep);
    if (target) return target;

    target = _findContainerTarget(creep);
    if (target) return target;

    return _findStorageTarget(creep);
}

/**
 * 納品先がない場合はコントローラーをアップグレードする（補助動作）
 * @param {Creep} creep
 */
function _upgradeAsBackup(creep) {
    const controller = creep.room.controller;
    if (!controller) return;

    const result = creep.upgradeController(controller);
    if (result === ERR_NOT_IN_RANGE) {
        pathfinder.moveTo(creep, controller, { range: 3 });
    }
}

// ============================================================
// ボディ生成
// ============================================================

/**
 * 利用可能エネルギーに応じた最適なボディを返す
 * @param {number} energy - 利用可能なエネルギー量
 * @returns {string[]} ボディパーツ配列
 */
function getBody(energy) {
    if (energy >= 750) {
        return [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
    }
    if (energy >= 500) {
        return [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    }
    if (energy >= 300) {
        return [WORK, WORK, CARRY, MOVE];
    }
    return [WORK, CARRY, MOVE];
}

module.exports = {
    run,
    getBody,
    TASK,
    _findDroppedEnergy,
    _findAvailableContainer,
    _updateWorkingState,
    _harvest,
    _deliver,
    _findEnergyTarget,
    _upgradeAsBackup,
};
