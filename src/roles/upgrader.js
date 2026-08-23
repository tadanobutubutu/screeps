/**
 * src/roles/upgrader.js
 * コントローラーアップグレードクリープ（Upgrader）の制御モジュール
 *
 * アップグレーダーはエネルギーをストレージ・コンテナ・ソースから取得し、
 * ルームコントローラーをアップグレードし続ける。
 * RCL8（最大レベル）に近づくほどアップグレーダー数を調整する。
 */

'use strict';

const cache = require('../utils/cache');
const pathfinder = require('../utils/pathfinder');
const roleUtils = require('../utils/roleUtils');
const logger = require('../utils/logger');
const { MEMORY_KEYS } = require('../constants');

// ============================================================
// タスク定義
// ============================================================

const TASK = {
    GET_ENERGY: 'getEnergy',
    UPGRADE: 'upgrade',
};

// ============================================================
// メイン制御
// ============================================================

/**
 * アップグレーダークリープのメインロジックを実行する
 * @param {Creep} creep
 */
function run(creep) {
    _updateWorkingState(creep);

    if (creep.memory[MEMORY_KEYS.WORKING]) {
        _upgrade(creep);
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
    const targetKey = MEMORY_KEYS.TARGET_ID || 'targetId';

    if (creep.memory[MEMORY_KEYS.WORKING] && energy === 0) {
        creep.memory[MEMORY_KEYS.WORKING] = false;
        creep.say('⚡ 補充');
        delete creep.memory[targetKey];
    }

    if (!creep.memory[MEMORY_KEYS.WORKING] && energy === capacity) {
        creep.memory[MEMORY_KEYS.WORKING] = true;
        creep.say('🔋 強化');
        delete creep.memory[targetKey];
    }
}

// ============================================================
// エネルギー取得ロジック
// ============================================================

/**
 * 最適なエネルギー源からエネルギーを取得する
 * 優先順位: ストレージ → リンク → コンテナ → 落下リソース → ソース
 * @param {Creep} creep
 */
function _getEnergy(creep) {
    const room = creep.room;
    const targetKey = MEMORY_KEYS.TARGET_ID || 'targetId';

    // ⚡ PERFORMANCE OPTIMIZATION: Check if cached energy target is still valid to avoid per-tick scans
    const targetId = creep.memory[targetKey];
    if (targetId) {
        const target = Game.getObjectById(targetId);
        if (target) {
            let isValid = false;
            if (target.structureType === STRUCTURE_STORAGE) {
                isValid = target.store[RESOURCE_ENERGY] >= 1000;
            } else if (target.structureType === STRUCTURE_LINK) {
                isValid = target.store[RESOURCE_ENERGY] >= 200;
            } else if (target.structureType === STRUCTURE_CONTAINER) {
                isValid =
                    target.store[RESOURCE_ENERGY] >= 100 &&
                    (!room.controller || target.pos.getRangeTo(room.controller) <= 5);
            } else if (target.amount !== undefined) {
                // Dropped resource
                isValid = target.resourceType === RESOURCE_ENERGY && target.amount >= 50;
            } else if (target.energy !== undefined) {
                // Source
                isValid = target.energy > 0;
            }

            if (isValid) {
                if (target.store !== undefined) {
                    if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        pathfinder.moveTo(creep, target, { range: 1 });
                    }
                } else if (target.amount !== undefined) {
                    if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
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
        delete creep.memory[targetKey];
    }

    if (roleUtils.getEnergyFromStorage(creep, room, 1000, MEMORY_KEYS.TARGET_ID || 'targetId')) return;
    if (_getEnergyFromLink(creep, room)) return;
    if (_getEnergyFromContainer(creep, room)) return;
    if (_getEnergyFromDropped(creep, room)) return;
    _getEnergyFromSource(creep, room);
}



/**
 * リンクから取得
 * @param {Creep} creep
 * @param {Room} room
 * @returns {boolean}
 */
function _getEnergyFromLink(creep, room) {
    const links = cache.getLinks(room);
    const targetKey = MEMORY_KEYS.TARGET_ID || 'targetId';
    // ⚡ PERFORMANCE: Use single-pass for loop to avoid filter array allocation and find closest.
    let bestLink = null;
    let minDistance = Infinity;
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (link.store[RESOURCE_ENERGY] >= 200) {
            const dist = creep.pos ? creep.pos.getRangeTo(link) : 0;
            if (dist < minDistance) {
                minDistance = dist;
                bestLink = link;
            }
        }
    }
    if (bestLink) {
        creep.memory[targetKey] = bestLink.id;
        if (creep.withdraw(bestLink, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, bestLink, { range: 1 });
        }
        return true;
    }
    return false;
}

/**
 * コントローラー付近のコンテナから取得
 * @param {Creep} creep
 * @param {Room} room
 * @returns {boolean}
 */
function _getEnergyFromContainer(creep, room) {
    const containers = cache.getContainers(room);
    const controller = room.controller;
    const targetKey = MEMORY_KEYS.TARGET_ID || 'targetId';
    if (controller) {
        // ⚡ PERFORMANCE: Use single-pass for loop to avoid filter array allocation and find closest.
        let bestContainer = null;
        let minDistance = Infinity;
        for (let i = 0; i < containers.length; i++) {
            const container = containers[i];
            if (
                container.store[RESOURCE_ENERGY] >= 100 &&
                container.pos.getRangeTo(controller) <= 5
            ) {
                const dist = creep.pos ? creep.pos.getRangeTo(container) : 0;
                if (dist < minDistance) {
                    minDistance = dist;
                    bestContainer = container;
                }
            }
        }
        if (bestContainer) {
            creep.memory[targetKey] = bestContainer.id;
            if (creep.withdraw(bestContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                pathfinder.moveTo(creep, bestContainer, { range: 1 });
            }
            return true;
        }
    }
    return false;
}

/**
 * 落下リソースを回収
 * @param {Creep} creep
 * @param {Room} room
 * @returns {boolean}
 */
function _getEnergyFromDropped(creep, room) {
    const dropped = cache.getDroppedResources(room);
    const targetKey = MEMORY_KEYS.TARGET_ID || 'targetId';
    // ⚡ PERFORMANCE: Use single-pass for loop to avoid filter array allocation and find closest.
    let bestDrop = null;
    let minDistance = Infinity;
    for (let i = 0; i < dropped.length; i++) {
        const res = dropped[i];
        if (res.resourceType === RESOURCE_ENERGY && res.amount >= 50) {
            const dist = creep.pos ? creep.pos.getRangeTo(res) : 0;
            if (dist < minDistance) {
                minDistance = dist;
                bestDrop = res;
            }
        }
    }
    if (bestDrop) {
        creep.memory[targetKey] = bestDrop.id;
        if (creep.pickup(bestDrop) === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, bestDrop, { range: 1 });
        }
        return true;
    }
    return false;
}

/**
 * 直接ソースから採掘
 * @param {Creep} creep
 * @param {Room} room
 * @returns {boolean}
 */
function _getEnergyFromSource(creep, room) {
    const source = cache.assignSource(creep, room);
    const targetKey = MEMORY_KEYS.TARGET_ID || 'targetId';
    if (source) {
        creep.memory[targetKey] = source.id;
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, source, { range: 1 });
        }
        return true;
    }
    return false;
}

// ============================================================
// アップグレードロジック
// ============================================================

/**
 * コントローラーをアップグレードする
 * @param {Creep} creep
 */
function _upgrade(creep) {
    const controller = creep.room.controller;
    if (!controller) {
        logger.warn(`[${creep.name}] コントローラーが見つかりません`);
        return;
    }

    const result = creep.upgradeController(controller);
    if (result === ERR_NOT_IN_RANGE) {
        pathfinder.moveTo(creep, controller, { range: 3 });
    } else if (result === OK) {
        // RCL8（最大レベル）の場合に表示
        if (controller.level === 8) {
            creep.say('✨ MAX');
        }
    }
}

// ============================================================
// ビジュアル表示
// ============================================================

/**
 * アップグレーダーの状態をルームビジュアルに表示する
 * @param {Creep} creep
 */
function showVisuals(creep) {
    const controller = creep.room.controller;
    if (!controller) return;

    const progress = controller.progress;
    const max = controller.progressTotal;
    if (!max) return;

    const pct = progress / max;
    creep.room.visual.text(
        `LV${controller.level} ${(pct * 100).toFixed(1)}%`,
        controller.pos.x,
        controller.pos.y - 1,
        { color: '#00bfff', font: 0.5, align: 'center' }
    );
}

// ============================================================
// ボディ生成
// ============================================================

/**
 * 利用可能エネルギーに応じた最適なボディを返す
 * WORKパーツ数がアップグレード速度に直結する
 * @param {number} energy
 * @returns {string[]}
 */
function getBody(energy) {
    if (energy >= 1300) {
        return [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
    }
    if (energy >= 800) {
        return [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    }
    if (energy >= 550) {
        return [WORK, WORK, WORK, CARRY, MOVE, MOVE];
    }
    if (energy >= 350) {
        return [WORK, WORK, CARRY, MOVE];
    }
    return [WORK, CARRY, MOVE];
}

module.exports = { run, getBody, showVisuals, TASK };
