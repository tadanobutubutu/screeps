/**
 * src/managers/towerManager.js
 * タワー自動管理モジュール
 *
 * ルーム内のすべてのタワーを制御し、以下の優先順位で動作する:
 * 1. 敵クリープへの攻撃
 * 2. 負傷した味方クリープの回復
 * 3. 損傷した構造物の修復
 * タワーのエネルギー管理も行い、エネルギー補充の優先度を制御する。
 */

'use strict';

const cache = require('../utils/cache');
const pathfinder = require('../utils/pathfinder');
const logger = require('../utils/logger');
const {
    TOWER_ATTACK_PRIORITY_HP,
    TOWER_REPAIR_THRESHOLD,
    TOWER_REPAIR_STOP_THRESHOLD,
    TOWER_HEAL_THRESHOLD,
    TOWER_ENERGY_PRIORITY,
    REPAIR_THRESHOLD,
    WALL_HP_TARGET,
} = require('../constants');

// ============================================================
// メイン制御
// ============================================================

/**
 * ルーム内の全タワーを制御する
 * @param {Room} room
 */
function run(room) {
    try {
        const towers = cache.getMyStructures(room, STRUCTURE_TOWER);
        if (towers.length === 0) {
            return;
        }

        const enemies = cache.getEnemies(room);
        // ⚡ PERFORMANCE OPTIMIZATION: Use getMyCreeps cache to avoid redundant room.find calls.
        const myCreeps = cache.getMyCreeps(room);
        // ⚡ PERFORMANCE: Use for loop to avoid filter closure and array allocation.
        const injuredCreeps = [];
        const healThreshold = TOWER_HEAL_THRESHOLD;
        for (let i = 0; i < myCreeps.length; i++) {
            const c = myCreeps[i];
            if (c.hits < c.hitsMax * healThreshold) {
                injuredCreeps.push(c);
            }
        }

        // ⚡ PERFORMANCE OPTIMIZATION: Use indexed for loop to avoid iterator allocations per tick.
        for (let i = 0; i < towers.length; i++) {
            const tower = towers[i];
            if (tower.store[RESOURCE_ENERGY] < 10) {
                continue;
            }
            _runTower(tower, enemies, injuredCreeps, room);
        }
    } catch (e) {
        logger.error('[TowerManager] タワーエラー', e);
    }
}

// ============================================================
// タワー個別制御
// ============================================================

/**
 * タワー1基の動作を決定・実行する
 * @param {StructureTower} tower
 * @param {Creep[]} enemies
 * @param {Creep[]} injuredCreeps
 * @param {Room} room
 */
function _runTower(tower, enemies, injuredCreeps, room) {
    if (_tryAttack(tower, enemies)) {
        return;
    }
    if (_tryHeal(tower, injuredCreeps)) {
        return;
    }
    _tryRepair(tower, room);
}

/**
 * 敵への攻撃を試みる
 * @param {StructureTower} tower
 * @param {Creep[]} enemies
 * @returns {boolean} 攻撃を実行したかどうか
 */
function _tryAttack(tower, enemies) {
    if (enemies.length === 0) {
        return false;
    }
    const target = _selectAttackTarget(tower, enemies);
    if (target) {
        tower.attack(target);
        _showAttackVisual(tower, target);
        return true;
    }
    return false;
}

/**
 * 負傷クリープの回復を試みる
 * @param {StructureTower} tower
 * @param {Creep[]} injuredCreeps
 * @returns {boolean} 回復を実行したかどうか
 */
function _tryHeal(tower, injuredCreeps) {
    if (injuredCreeps.length === 0) {
        return false;
    }
    const target = _selectHealTarget(tower, injuredCreeps);
    if (target) {
        tower.heal(target);
        _showHealVisual(tower, target);
        return true;
    }
    return false;
}

/**
 * 構造物の修復を試みる
 * @param {StructureTower} tower
 * @param {Room} room
 * @returns {boolean} 修復を実行したかどうか
 */
function _tryRepair(tower, room) {
    const energyRatio = tower.store[RESOURCE_ENERGY] / tower.store.getCapacity(RESOURCE_ENERGY);
    if (energyRatio <= TOWER_ENERGY_PRIORITY) {
        return false;
    }

    const repairTarget = _selectRepairTarget(tower, room);
    if (repairTarget) {
        tower.repair(repairTarget);
        _showRepairVisual(tower, repairTarget);
        return true;
    }
    return false;
}

// ============================================================
// 攻撃対象選択
// ============================================================

/**
 * 攻撃対象を選択する
 * 優先度: HPが低い敵 → コントローラーに近い敵 → タワーに近い敵
 * @param {StructureTower} tower
 * @param {Creep[]} enemies
 * @returns {Creep|null}
 */
function _selectAttackTarget(tower, enemies) {
    if (enemies.length === 0) {
        return null;
    }

    return (
        _findCriticalTarget(tower, enemies, TOWER_ATTACK_PRIORITY_HP) ||
        _findClaimerTarget(tower, enemies) ||
        _findAttackerTarget(tower, enemies) ||
        _findWeakestTarget(tower, enemies)
    );
}

/**
 * @param {StructureTower} tower
 * @param {Creep[]} enemies
 * @param {number} threshold
 * @returns {Creep|null}
 */
function _findCriticalTarget(tower, enemies, threshold) {
    let target = null;
    let minDist = Infinity;
    for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        if (e.hits <= threshold) {
            const dist = tower.pos.getRangeTo(e);
            if (dist < minDist) {
                minDist = dist;
                target = e;
            }
        }
    }
    return target;
}

/**
 * @param {StructureTower} tower
 * @param {Creep[]} enemies
 * @returns {Creep|null}
 */
function _findClaimerTarget(tower, enemies) {
    const controller = tower.room.controller;
    if (!controller) return null;

    let target = null;
    let minDist = Infinity;
    for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        if (e.getActiveBodyparts(CLAIM) > 0) {
            const dist = controller.pos.getRangeTo(e);
            if (dist < minDist) {
                minDist = dist;
                target = e;
            }
        }
    }
    return target;
}

/**
 * @param {StructureTower} tower
 * @param {Creep[]} enemies
 * @returns {Creep|null}
 */
function _findAttackerTarget(tower, enemies) {
    let target = null;
    let minHits = Infinity;
    for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        if (e.getActiveBodyparts(ATTACK) > 0 || e.getActiveBodyparts(RANGED_ATTACK) > 0) {
            if (e.hits < minHits) {
                minHits = e.hits;
                target = e;
            }
        }
    }
    return target;
}

/**
 * @param {StructureTower} tower
 * @param {Creep[]} enemies
 * @returns {Creep|null}
 */
function _findWeakestTarget(tower, enemies) {
    let target = null;
    let minHits = Infinity;
    for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        if (e.hits < minHits) {
            minHits = e.hits;
            target = e;
        }
    }
    return target;
}
// ============================================================
// 回復対象選択
// ============================================================

/**
 * 回復対象を選択する
 * HPが最も低いクリープを優先
 * @param {StructureTower} tower
 * @param {Creep[]} injured
 * @returns {Creep|null}
 */
function _selectHealTarget(tower, injured) {
    if (injured.length === 0) {
        return null;
    }
    // ⚡ PERFORMANCE: Use standard for loop instead of reduce for better performance in Screeps/V8.
    let bestTarget = null;
    let minRatio = Infinity;
    for (let i = 0; i < injured.length; i++) {
        const creep = injured[i];
        const ratio = creep.hits / creep.hitsMax;
        if (ratio < minRatio) {
            minRatio = ratio;
            bestTarget = creep;
        }
    }
    return bestTarget;
}

// ============================================================
// 修復対象選択
// ============================================================

// ⚡ PERFORMANCE OPTIMIZATION: Cache selected repair target on a room-level per tick basis.
// Since Screeps actions (like repair) resolve at the end of the tick, room state remains
// unchanged. Multiple towers calling this on the same tick can reuse the target to avoid O(N) loops.
let _repairTargetCache = null;
let _repairTargetTick = -1;
let _repairTargetRoom = null;

/**
 * 修復対象を選択する
 * 損傷率が高い構造物を優先（ウォールは除く）
 * @param {StructureTower} tower
 * @param {Room} room
 * @returns {Structure|null}
 */
function _selectRepairTarget(tower, room) {
    if (_repairTargetTick === Game.time && _repairTargetRoom === room.name) {
        return _repairTargetCache;
    }

    const rcl = room.controller ? room.controller.level : 1;
    const wallTarget = WALL_HP_TARGET[rcl] || WALL_HP_TARGET[1];
    const urgentRampartThreshold = Math.min(wallTarget * 0.1, 5000);

    const urgentRampart = _findUrgentRampart(room, urgentRampartThreshold);
    if (urgentRampart) {
        _repairTargetCache = urgentRampart;
        _repairTargetTick = Game.time;
        _repairTargetRoom = room.name;
        return urgentRampart;
    }

    const damaged = _findDamagedStructure(room);
    _repairTargetCache = damaged;
    _repairTargetTick = Game.time;
    _repairTargetRoom = room.name;
    return damaged;
}

/**
 * 緊急修復が必要な防壁を探す
 * @param {Room} room
 * @param {number} threshold
 * @returns {Structure|null}
 */
function _findUrgentRampart(room, threshold) {
    let urgentRampart = null;
    let minRampartHits = Infinity;
    const myStructures = cache.getMyStructures(room);

    // ⚡ PERFORMANCE: Filter for ramparts manually to avoid multiple array passes.
    for (let i = 0; i < myStructures.length; i++) {
        const s = myStructures[i];
        if (s.structureType === STRUCTURE_RAMPART) {
            if (s.hits < threshold) {
                if (s.hits < minRampartHits) {
                    minRampartHits = s.hits;
                    urgentRampart = s;
                }
            }
        }
    }
    return urgentRampart;
}

/**
 * 損傷した構造物を探す
 * @param {Room} room
 * @returns {Structure|null}
 */
function _findDamagedStructure(room) {
    let mostDamagedStructure = null;
    let minHitsRatio = Infinity;
    const allStructures = cache.getStructures(room);

    for (let i = 0; i < allStructures.length; i++) {
        const s = allStructures[i];
        const type = s.structureType;

        // Skip walls and ramparts (ramparts handled above or at different thresholds)
        if (type === STRUCTURE_WALL || type === STRUCTURE_RAMPART) {
            continue;
        }

        const threshold = REPAIR_THRESHOLD[type] || REPAIR_THRESHOLD.OTHER;
        const ratio = s.hits / s.hitsMax;

        if (ratio < threshold) {
            if (ratio < minHitsRatio) {
                minHitsRatio = ratio;
                mostDamagedStructure = s;
            }
        }
    }
    return mostDamagedStructure;
}

// ============================================================
// ビジュアル表示
// ============================================================

/**
 * 攻撃のビジュアルを表示する
 * @param {StructureTower} tower
 * @param {Creep} target
 */
function _showAttackVisual(tower, target) {
    tower.room.visual.line(tower.pos, target.pos, {
        color: '#ff4444',
        width: 0.3,
        opacity: 0.7,
    });
    tower.room.visual.circle(target.pos, {
        radius: 0.5,
        fill: 'transparent',
        stroke: '#ff4444',
        strokeWidth: 0.2,
        opacity: 0.8,
    });
}

/**
 * 回復のビジュアルを表示する
 * @param {StructureTower} tower
 * @param {Creep} target
 */
function _showHealVisual(tower, target) {
    tower.room.visual.line(tower.pos, target.pos, {
        color: '#00ff88',
        width: 0.2,
        opacity: 0.5,
    });
    tower.room.visual.circle(target.pos, {
        radius: 0.4,
        fill: '#00ff88',
        opacity: 0.2,
    });
}

/**
 * 修復のビジュアルを表示する
 * @param {StructureTower} tower
 * @param {Structure} target
 */
function _showRepairVisual(tower, target) {
    tower.room.visual.line(tower.pos, target.pos, {
        color: '#ffaa00',
        width: 0.15,
        opacity: 0.4,
        lineStyle: 'dotted',
    });
}

// ============================================================
// エネルギー管理
// ============================================================

/**
 * タワーのエネルギー補充が必要かチェックし、
 * 必要なら補充フラグをメモリに設定する
 * @param {Room} room
 * @returns {StructureTower[]} エネルギー補充が必要なタワー一覧
 */
function getTowersNeedingEnergy(room) {
    const towers = cache.getMyStructures(room, STRUCTURE_TOWER);
    // ⚡ PERFORMANCE: Use for loop to avoid filter closure and array allocation.
    const needing = [];
    const threshold = TOWER_ENERGY_PRIORITY;
    for (let i = 0; i < towers.length; i++) {
        const t = towers[i];
        if (t.store[RESOURCE_ENERGY] / t.store.getCapacity(RESOURCE_ENERGY) < threshold) {
            needing.push(t);
        }
    }
    return needing;
}

// ============================================================
// 統計・ダッシュボード
// ============================================================

/**
 * タワーの稼働状況を返す
 * @param {Room} room
 * @returns {Object}
 */
function getStats(room) {
    const towers = cache.getMyStructures(room, STRUCTURE_TOWER);
    const stats = {
        total: towers.length,
        active: 0,
        avgEnergy: 0,
        lowEnergy: 0,
    };

    if (towers.length === 0) {
        return stats;
    }

    let totalEnergy = 0;
    // ⚡ PERFORMANCE OPTIMIZATION: Use indexed for loop to avoid iterator allocations per tick.
    for (let i = 0; i < towers.length; i++) {
        const tower = towers[i];
        const ratio = tower.store[RESOURCE_ENERGY] / tower.store.getCapacity(RESOURCE_ENERGY);
        totalEnergy += ratio;
        if (ratio < TOWER_ENERGY_PRIORITY) {
            stats.lowEnergy++;
        }
        if (tower.store[RESOURCE_ENERGY] > 0) {
            stats.active++;
        }
    }
    stats.avgEnergy = totalEnergy / towers.length;

    return stats;
}

/**
 * タワー統計をルームビジュアルに表示する
 * @param {Room} room
 */
function showDashboard(room) {
    const towers = cache.getMyStructures(room, STRUCTURE_TOWER);
    // ⚡ PERFORMANCE OPTIMIZATION: Use indexed for loop to avoid iterator allocations per tick.
    for (let i = 0; i < towers.length; i++) {
        const tower = towers[i];
        const ratio = tower.store[RESOURCE_ENERGY] / tower.store.getCapacity(RESOURCE_ENERGY);
        const color = ratio > 0.7 ? '#00ff88' : ratio > 0.4 ? '#ffaa00' : '#ff4444';
        tower.room.visual.text(`🏰 ${Math.floor(ratio * 100)}%`, tower.pos.x, tower.pos.y - 1, {
            color,
            font: 0.4,
            align: 'center',
        });
    }
}

module.exports = {
    run,
    getTowersNeedingEnergy,
    getStats,
    showDashboard,
};
