/**
 * src/roles/builder.js
 * 建設クリープ（Builder）の制御モジュール
 *
 * ビルダーはエネルギーを取得して建設サイトに建設作業を行う。
 * 建設サイトがない場合は修復や、コントローラーアップグレードを補助する。
 * 建設の優先度: コンテナ → エクステンション → スポーン → ランパート → ロード → その他
 */

'use strict';

const cache = require('../utils/cache');
const pathfinder = require('../utils/pathfinder');
const roleUtils = require('../utils/roleUtils');
const logger = require('../utils/logger');
const { MEMORY_KEYS } = require('../constants');

// ============================================================
// 建設優先度（低い数値 = 高優先）
// ============================================================

const BUILD_PRIORITY = {
    [STRUCTURE_CONTAINER]: 1,
    [STRUCTURE_EXTENSION]: 2,
    [STRUCTURE_SPAWN]: 3,
    [STRUCTURE_TOWER]: 4,
    [STRUCTURE_STORAGE]: 5,
    [STRUCTURE_LINK]: 6,
    [STRUCTURE_ROAD]: 7,
    [STRUCTURE_RAMPART]: 8,
    [STRUCTURE_WALL]: 9,
};

// ============================================================
// メイン制御
// ============================================================

/**
 * ビルダークリープのメインロジックを実行する
 * @param {Creep} creep
 */
function run(creep) {
    _updateWorkingState(creep);

    if (creep.memory[MEMORY_KEYS.WORKING]) {
        _build(creep);
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
        creep.say('🔄 採掘');
        delete creep.memory[MEMORY_KEYS.TARGET_ID];
    }

    if (!creep.memory[MEMORY_KEYS.WORKING] && energy === capacity) {
        creep.memory[MEMORY_KEYS.WORKING] = true;
        creep.say('🔨 建設');
    }
}

// ============================================================
// 建設ロジック
// ============================================================

/**
 * 建設サイトに建設作業を行う
 * @param {Creep} creep
 */
function _build(creep) {
    const site = _getTargetSite(creep);

    if (!site) {
        // 建設サイトがなければ修復を行う
        _repairAsBackup(creep);
        return;
    }

    const result = creep.build(site);
    if (result === ERR_NOT_IN_RANGE) {
        pathfinder.moveTo(creep, site, { range: 3 });

        // 建設進捗をビジュアル表示
        const pct = site.progress / site.progressTotal;
        creep.room.visual.text(`🔨 ${(pct * 100).toFixed(0)}%`, site.pos.x, site.pos.y - 1, {
            color: '#ffaa00',
            font: 0.5,
            align: 'center',
        });
    } else if (result === ERR_INVALID_TARGET) {
        // ターゲットが無効になった（完成済み等）
        delete creep.memory[MEMORY_KEYS.TARGET_ID];
        cache.invalidate(`construction_sites_${creep.room.name}`);
    }
}

/**
 * 優先度の高い建設サイトを返す
 * @param {Creep} creep
 * @returns {ConstructionSite|null}
 */
function _getTargetSite(creep) {
    // メモリに保存されたターゲットを優先的に使用
    if (creep.memory[MEMORY_KEYS.TARGET_ID]) {
        const saved = Game.getObjectById(creep.memory[MEMORY_KEYS.TARGET_ID]);
        if (saved) {
            return saved;
        }
        delete creep.memory[MEMORY_KEYS.TARGET_ID];
    }

    const sites = cache.getConstructionSites(creep.room);
    if (sites.length === 0) {
        return null;
    }

    // ⚡ PERFORMANCE OPTIMIZATION: Use single-pass for loop to find the best site.
    // Estimated impact: Reduces complexity from O(N log N) to O(N) and avoids array allocation.
    let bestSite = null;
    let minPriority = Infinity;
    let minDistance = Infinity;

    for (let i = 0; i < sites.length; i++) {
        const site = sites[i];
        const priority = BUILD_PRIORITY[site.structureType] || 10;
        const distance = creep.pos.getRangeTo(site);

        if (priority < minPriority) {
            minPriority = priority;
            minDistance = distance;
            bestSite = site;
        } else if (priority === minPriority) {
            if (distance < minDistance) {
                minDistance = distance;
                bestSite = site;
            }
        }
    }

    const target = bestSite;
    creep.memory[MEMORY_KEYS.TARGET_ID] = target.id;
    return target;
}

/**
 * 建設サイトがない場合に修復を行う（補助動作）
 * @param {Creep} creep
 */
function _repairAsBackup(creep) {
    // ⚡ PERFORMANCE OPTIMIZATION: Use single-pass for loop to find the closest damaged structure.
    // Estimated impact: Avoids O(N) array allocation from .filter().
    const structures = cache.getStructures(creep.room);
    let closestDamaged = null;
    let minDistance = Infinity;

    for (let i = 0; i < structures.length; i++) {
        const s = structures[i];
        if (
            s.hits < s.hitsMax * 0.8 &&
            s.structureType !== STRUCTURE_WALL &&
            s.structureType !== STRUCTURE_RAMPART
        ) {
            const dist = creep.pos.getRangeTo(s);
            if (dist < minDistance) {
                minDistance = dist;
                closestDamaged = s;
            }
        }
    }

    if (closestDamaged) {
        const target = closestDamaged;
        const result = creep.repair(target);
        if (result === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, target, { range: 3 });
        }
        creep.say('🔧 修復');
        return;
    }

    // 修復対象もない場合はコントローラーをアップグレード
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

    // ⚡ PERFORMANCE OPTIMIZATION: Check cached target ID to bypass per-tick room scans
    const targetId = creep.memory[MEMORY_KEYS.TARGET_ID];
    if (targetId) {
        const target = Game.getObjectById(targetId);
        if (target) {
            let isValid = false;
            if (target.amount !== undefined) {
                isValid = target.resourceType === RESOURCE_ENERGY && target.amount >= 50;
            } else if (target.structureType === STRUCTURE_CONTAINER) {
                isValid = target.store && target.store[RESOURCE_ENERGY] >= 100;
            } else if (target.structureType === STRUCTURE_STORAGE) {
                isValid = target.store && target.store[RESOURCE_ENERGY] >= 500;
            } else if (target.energy !== undefined) {
                isValid = target.energy > 0;
            }

            if (isValid) {
                if (target.amount !== undefined) {
                    if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                        pathfinder.moveTo(creep, target, { range: 1 });
                    }
                } else if (target.structureType !== undefined) {
                    if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        pathfinder.moveTo(creep, target, { range: 1 });
                    }
                } else {
                    if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                        pathfinder.moveTo(creep, target, { range: 1 });
                    }
                }
                return;
            }
        }
        delete creep.memory[MEMORY_KEYS.TARGET_ID];
    }

    if (_getEnergyFromDropped(creep, room)) return;
    if (_getEnergyFromContainer(creep, room)) return;
    if (roleUtils.getEnergyFromStorage(creep, room, 500, MEMORY_KEYS.TARGET_ID)) return;
    _getEnergyFromSource(creep, room);
}

/**
 * 落下リソースを優先回収
 * @param {Creep} creep
 * @param {Room} room
 * @returns {boolean}
 */
function _getEnergyFromDropped(creep, room) {
    const dropped = cache.getDroppedResources(room);
    let bestDrop = null;
    let minDropDist = Infinity;

    for (let i = 0; i < dropped.length; i++) {
        const r = dropped[i];
        if (r.resourceType === RESOURCE_ENERGY && r.amount >= 50) {
            const dist = creep.pos && typeof creep.pos.getRangeTo === "function" ? creep.pos.getRangeTo(r) : 0;
            if (dist < minDropDist) {
                minDropDist = dist;
                bestDrop = r;
            }
        }
    }

    if (bestDrop) {
        creep.memory[MEMORY_KEYS.TARGET_ID] = bestDrop.id;
        if (creep.pickup(bestDrop) === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, bestDrop, { range: 1 });
        }
        return true;
    }
    return false;
}

/**
 * コンテナから取得
 * @param {Creep} creep
 * @param {Room} room
 * @returns {boolean}
 */
function _getEnergyFromContainer(creep, room) {
    const containers = cache.getContainers(room);
    let bestContainer = null;
    let minContainerDist = Infinity;

    for (let i = 0; i < containers.length; i++) {
        const c = containers[i];
        if (c.store[RESOURCE_ENERGY] >= 100) {
            const dist = creep.pos ? creep.pos.getRangeTo(c) : 0;
            if (dist < minContainerDist) {
                minContainerDist = dist;
                bestContainer = c;
            }
        }
    }

    if (bestContainer) {
        creep.memory[MEMORY_KEYS.TARGET_ID] = bestContainer.id;
        if (creep.withdraw(bestContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, bestContainer, { range: 1 });
        }
        return true;
    }
    return false;
}



/**
 * ソースから直接採掘
 * @param {Creep} creep
 * @param {Room} room
 * @returns {boolean}
 */
function _getEnergyFromSource(creep, room) {
    const source = cache.assignSource(creep, room);
    if (source) {
        creep.memory[MEMORY_KEYS.TARGET_ID] = source.id;
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, source, { range: 1 });
        }
        return true;
    }
    return false;
}

// ============================================================
// ボディ生成
// ============================================================

/**
 * 利用可能エネルギーに応じた最適なボディを返す
 * @param {number} energy
 * @returns {string[]}
 */
function getBody(energy) {
    if (energy >= 800) {
        return [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
    }
    if (energy >= 500) {
        return [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    }
    if (energy >= 350) {
        return [WORK, CARRY, CARRY, MOVE, MOVE];
    }
    return [WORK, CARRY, MOVE];
}

// ============================================================
// ユーティリティ
// ============================================================

/**
 * ルーム内に建設サイトが存在するか確認する
 * @param {Room} room
 * @returns {boolean}
 */
function hasBuildSites(room) {
    return cache.getConstructionSites(room).length > 0;
}

/**
 * ルーム内のすべての建設サイトの合計建設量を返す
 * ⚡ PERFORMANCE OPTIMIZATION: Use a standard for-loop instead of Array.prototype.reduce
 * to avoid closure allocations and callback overhead in hot-path room evaluation.
 * @param {Room} room
 * @returns {number}
 */
function getTotalBuildProgress(room) {
    const sites = cache.getConstructionSites(room);
    let total = 0;
    for (let i = 0; i < sites.length; i++) {
        const s = sites[i];
        total += s.progressTotal - s.progress;
    }
    return total;
}

module.exports = { run, getBody, hasBuildSites, getTotalBuildProgress, BUILD_PRIORITY };
