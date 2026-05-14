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
        if (towers.length === 0) return;

        const enemies = cache.getEnemies(room);
        const myCreeps = cache.getMyCreeps ? cache.getMyCreeps(room) : room.find(FIND_MY_CREEPS);
        const injuredCreeps = myCreeps.filter((c) => c.hits < c.hitsMax * TOWER_HEAL_THRESHOLD);

        for (const tower of towers) {
            if (tower.store[RESOURCE_ENERGY] < 10) continue;
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
    if (_tryAttack(tower, enemies)) return;
    if (_tryHeal(tower, injuredCreeps)) return;
    _tryRepair(tower, room);
}

/**
 * 敵への攻撃を試みる
 * @param {StructureTower} tower
 * @param {Creep[]} enemies
 * @returns {boolean} 攻撃を実行したかどうか
 */
function _tryAttack(tower, enemies) {
    if (enemies.length === 0) return false;
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
    if (injuredCreeps.length === 0) return false;
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
    if (energyRatio <= TOWER_ENERGY_PRIORITY) return false;

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
    if (enemies.length === 0) return null;

    // HPが閾値以下の敵を最優先
    const criticalEnemies = enemies.filter((e) => e.hits <= TOWER_ATTACK_PRIORITY_HP);
    if (criticalEnemies.length > 0) {
        return pathfinder.closest(tower.pos, criticalEnemies);
    }

    // コントローラーに最も近い敵（占領脅威）を優先
    const controller = tower.room.controller;
    if (controller) {
        const claimers = enemies.filter((e) => e.getActiveBodyparts(CLAIM) > 0);
        if (claimers.length > 0) {
            return pathfinder.closest(controller.pos, claimers);
        }
    }

    // 攻撃系パーツを持つ敵を優先
    const attackers = enemies.filter(
        (e) => e.getActiveBodyparts(ATTACK) > 0 || e.getActiveBodyparts(RANGED_ATTACK) > 0
    );
    if (attackers.length > 0) {
        // HPが最も低い攻撃者
        return attackers.reduce((a, b) => (a.hits < b.hits ? a : b));
    }

    // 一般的な敵はHPが最も低いものを選択
    return enemies.reduce((a, b) => (a.hits < b.hits ? a : b));
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
    if (injured.length === 0) return null;
    return injured.reduce((a, b) => (a.hits / a.hitsMax < b.hits / b.hitsMax ? a : b));
}

// ============================================================
// 修復対象選択
// ============================================================

/**
 * 修復対象を選択する
 * 損傷率が高い構造物を優先（ウォールは除く）
 * @param {StructureTower} tower
 * @param {Room} room
 * @returns {Structure|null}
 */
function _selectRepairTarget(tower, room) {
    // ランパートの緊急修復
    const rcl = room.controller ? room.controller.level : 1;
    const wallTarget = WALL_HP_TARGET[rcl] || WALL_HP_TARGET[1];

    const urgentRamparts = room.find(FIND_MY_STRUCTURES, {
        filter: (s) =>
            s.structureType === STRUCTURE_RAMPART && s.hits < Math.min(wallTarget * 0.1, 5000),
    });
    if (urgentRamparts.length > 0) {
        return urgentRamparts.reduce((a, b) => (a.hits < b.hits ? a : b));
    }

    // 道路・コンテナの修復
    const damaged = room.find(FIND_STRUCTURES, {
        filter: (s) => {
            if (s.structureType === STRUCTURE_WALL) return false;
            if (s.structureType === STRUCTURE_RAMPART) return false;
            const threshold = REPAIR_THRESHOLD[s.structureType] || REPAIR_THRESHOLD.OTHER;
            return s.hits < s.hitsMax * threshold;
        },
    });

    if (damaged.length === 0) return null;

    // 最も損傷率が高い構造物
    return damaged.reduce((a, b) => {
        const ra = a.hits / a.hitsMax;
        const rb = b.hits / b.hitsMax;
        return ra < rb ? a : b;
    });
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
    return towers.filter(
        (t) =>
            t.store[RESOURCE_ENERGY] / t.store.getCapacity(RESOURCE_ENERGY) < TOWER_ENERGY_PRIORITY
    );
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

    if (towers.length === 0) return stats;

    let totalEnergy = 0;
    for (const tower of towers) {
        const ratio = tower.store[RESOURCE_ENERGY] / tower.store.getCapacity(RESOURCE_ENERGY);
        totalEnergy += ratio;
        if (ratio < TOWER_ENERGY_PRIORITY) stats.lowEnergy++;
        if (tower.store[RESOURCE_ENERGY] > 0) stats.active++;
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
    for (const tower of towers) {
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
