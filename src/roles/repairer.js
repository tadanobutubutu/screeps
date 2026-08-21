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
const roleUtils = require('../utils/roleUtils');
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
        delete creep.memory.energyTargetId;
    }

    if (!creep.memory[MEMORY_KEYS.WORKING] && energy === capacity) {
        creep.memory[MEMORY_KEYS.WORKING] = true;
        creep.say('🔧 修復');
        delete creep.memory[MEMORY_KEYS.TARGET_ID];
        delete creep.memory.energyTargetId;
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
 * メモリに保存された修復対象を取得する
 * @param {Creep} creep
 * @returns {Structure|null}
 */
function _getSavedRepairTarget(creep) {
    if (creep.memory[MEMORY_KEYS.TARGET_ID]) {
        const saved = Game.getObjectById(creep.memory[MEMORY_KEYS.TARGET_ID]);
        if (saved && _needsRepair(saved, creep.room)) return saved;
        delete creep.memory[MEMORY_KEYS.TARGET_ID];
    }
    return null;
}

/**
 * より優先すべき修復対象かを判定する
 * @param {number} priority
 * @param {number} hitsRatio
 * @param {number} distance
 * @param {number} minPriority
 * @param {number} minHitsRatio
 * @param {number} minDistance
 * @returns {boolean}
 */
function _isBetterRepairTarget(
    priority,
    hitsRatio,
    distance,
    minPriority,
    minHitsRatio,
    minDistance
) {
    if (priority < minPriority) {
        return true;
    } else if (priority === minPriority) {
        if (Math.abs(hitsRatio - minHitsRatio) > 0.1) {
            if (hitsRatio < minHitsRatio) {
                return true;
            }
        } else if (distance < minDistance) {
            return true;
        }
    }
    return false;
}

/**
 * 全構造物から最優先の修復対象を検索する
 * @param {Creep} creep
 * @param {Room} room
 * @param {number} wallTarget
 * @returns {Structure|null}
 */
function _findBestRepairTarget(creep, room, wallTarget) {
    const structures = cache.getStructures(room);
    let bestTarget = null;
    let minPriority = Infinity;
    let minHitsRatio = Infinity;
    let minDistance = Infinity;

    for (let i = 0; i < structures.length; i++) {
        const s = structures[i];
        if (!_needsRepair(s, room, wallTarget)) continue;

        const priority = REPAIR_PRIORITY[s.structureType] || 9;
        const hitsRatio = s.hits / s.hitsMax;
        const distance = creep.pos ? creep.pos.getRangeTo(s) : 0;

        let isBetter = false;
        if (!bestTarget) {
            isBetter = true;
        } else {
            isBetter = _isBetterRepairTarget(
                priority,
                hitsRatio,
                distance,
                minPriority,
                minHitsRatio,
                minDistance
            );
        }

        if (isBetter) {
            bestTarget = s;
            minPriority = priority;
            minHitsRatio = hitsRatio;
            minDistance = distance;
        }
    }
    return bestTarget;
}

/**
 * 最優先の修復対象を返す
 * RCLに応じたウォールHPターゲットも考慮する
 * @param {Creep} creep
 * @returns {Structure|null}
 */
function _getRepairTarget(creep) {
    const savedTarget = _getSavedRepairTarget(creep);
    if (savedTarget) return savedTarget;

    const room = creep.room;
    const rcl = room.controller ? room.controller.level : 1;
    const wallTarget = WALL_HP_TARGET[rcl] || WALL_HP_TARGET[1];

    const bestTarget = _findBestRepairTarget(creep, room, wallTarget);

    if (!bestTarget) return null;

    creep.memory[MEMORY_KEYS.TARGET_ID] = bestTarget.id;
    return bestTarget;
}
/**
 * 壁の修復が必要か判断する
 * @param {Structure} structure
 * @param {number} targetHP
 * @returns {boolean}
 */
function _needsWallRepair(structure, targetHP) {
    return structure.hits < targetHP;
}

/**
 * ランパートの修復が必要か判断する
 * @param {Structure} structure
 * @param {number} targetHP
 * @returns {boolean}
 */
function _needsRampartRepair(structure, targetHP) {
    return structure.hits < targetHP;
}

/**
 * 一般構造物の修復が必要か判断する
 * @param {Structure} structure
 * @returns {boolean}
 */
function _needsStandardRepair(structure) {
    const threshold = REPAIR_THRESHOLD[structure.structureType] || REPAIR_THRESHOLD.OTHER;
    return structure.hits < structure.hitsMax * threshold;
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
        return _needsWallRepair(structure, target);
    }

    if (type === STRUCTURE_RAMPART) {
        const rcl = room.controller ? room.controller.level : 1;
        const target = wallTarget || WALL_HP_TARGET[rcl] || WALL_HP_TARGET[1];
        return _needsRampartRepair(structure, target);
    }

    return _needsStandardRepair(structure);
}

/**
 * 修復中のビジュアルを表示する
 * @param {Creep} creep
 * @param {Structure} target
 */
function _showRepairVisual(creep, target) {
    const pct = target.hits / target.hitsMax;
    const color = pct < 0.3 ? '#ff4444' : pct < 0.7 ? '#ffaa00' : '#00ff88';
    creep.room.visual.text(`🔧 ${(pct * 100).toFixed(0)}%`, target.pos.x, target.pos.y - 1, {
        color,
        font: 0.4,
        align: 'center',
    });
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

    // ⚡ PERFORMANCE OPTIMIZATION: Check cached energy target ID to bypass per-tick room scans
    const targetId = creep.memory.energyTargetId;
    if (targetId) {
        const target = Game.getObjectById(targetId);
        if (target) {
            let isValid = false;
            if (target.amount !== undefined) {
                isValid = target.resourceType === RESOURCE_ENERGY && target.amount >= 30;
            } else if (target.structureType === STRUCTURE_CONTAINER) {
                isValid = target.store && target.store[RESOURCE_ENERGY] >= 100;
            } else if (target.structureType === STRUCTURE_STORAGE) {
                isValid = target.store && target.store[RESOURCE_ENERGY] >= 200;
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
        delete creep.memory.energyTargetId;
    }

    if (_getEnergyFromDropped(creep, room)) return;
    if (_getEnergyFromContainer(creep, room)) return;
    if (roleUtils.getEnergyFromStorage(creep, room, 200, 'energyTargetId')) return;
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
        if (r.resourceType === RESOURCE_ENERGY && r.amount >= 30) {
            const dist = creep.pos ? creep.pos.getRangeTo(r) : 0;
            if (dist < minDropDist) {
                minDropDist = dist;
                bestDrop = r;
            }
        }
    }

    if (bestDrop) {
        creep.memory.energyTargetId = bestDrop.id;
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
        creep.memory.energyTargetId = bestContainer.id;
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
        creep.memory.energyTargetId = source.id;
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
    const structures = cache.getStructures(room);
    let count = 0;
    for (let i = 0; i < structures.length; i++) {
        if (_needsRepair(structures[i], room, wallTarget)) {
            count++;
        }
    }
    return count;
}

module.exports = { run, getBody, countDamagedStructures, REPAIR_PRIORITY };
