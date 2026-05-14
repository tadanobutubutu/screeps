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

    if (creep.memory[MEMORY_KEYS.WORKING] && energy === 0) {
        creep.memory[MEMORY_KEYS.WORKING] = false;
        creep.say('⚡ 補充');
    }

    if (!creep.memory[MEMORY_KEYS.WORKING] && energy === capacity) {
        creep.memory[MEMORY_KEYS.WORKING] = true;
        creep.say('🔋 強化');
    }
}

// ============================================================
// エネルギー取得ロジック
// ============================================================

/**
 * 最適なエネルギー源からエネルギーを取得する
 * 優先順位: ストレージ → コンテナ → リンク → 落下リソース → ソース
 * @param {Creep} creep
 */
function _getEnergy(creep) {
    const room = creep.room;

    // ストレージから取得
    const storage = cache.getStorage(room);
    if (storage && storage.store[RESOURCE_ENERGY] >= 1000) {
        if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, storage, { range: 1 });
        }
        return;
    }

    // リンクから取得
    const links = cache.getLinks(room);
    const readyLinks = links.filter((l) => l.store[RESOURCE_ENERGY] >= 200);
    if (readyLinks.length > 0) {
        const link = pathfinder.closest(creep.pos, readyLinks);
        if (creep.withdraw(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, link, { range: 1 });
        }
        return;
    }

    // コントローラー付近のコンテナから取得
    const containers = cache.getContainers(room);
    const controller = room.controller;
    if (controller) {
        const nearController = containers.filter(
            (c) => c.store[RESOURCE_ENERGY] >= 100 && c.pos.getRangeTo(controller) <= 5
        );
        if (nearController.length > 0) {
            const container = pathfinder.closest(creep.pos, nearController);
            if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                pathfinder.moveTo(creep, container, { range: 1 });
            }
            return;
        }
    }

    // 落下リソースを回収
    const dropped = cache.getDroppedResources(room);
    const energyDrops = dropped.filter((r) => r.resourceType === RESOURCE_ENERGY && r.amount >= 50);
    if (energyDrops.length > 0) {
        const res = pathfinder.closest(creep.pos, energyDrops);
        if (creep.pickup(res) === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, res, { range: 1 });
        }
        return;
    }

    // 直接ソースから採掘
    const source = cache.assignSource(creep, room);
    if (source) {
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            pathfinder.moveTo(creep, source, { range: 1 });
        }
    }
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
