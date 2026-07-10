/**
 * src/roles/miner.js
 * 専用採掘クリープ（Miner）の制御モジュール
 *
 * マイナーは特定のエネルギーソースに専属で配置され、
 * ソース上のコンテナに継続的にエネルギーを採掘する。
 * コンテナが満杯の場合は床に落としてトランスポーターに回収させる。
 */

'use strict';

const cache = require('../utils/cache');
const pathfinder = require('../utils/pathfinder');
const logger = require('../utils/logger');
const { MEMORY_KEYS } = require('../constants');

// ============================================================
// 定数
// ============================================================

/** ソース周囲のコンテナを探す範囲 */
const CONTAINER_SEARCH_RANGE = 2;

// ============================================================
// メイン制御
// ============================================================

/**
 * マイナークリープのメインロジックを実行する
 * @param {Creep} creep
 */
function run(creep) {
    try {
        // 専属ソースへの割り当て
        const source = _getAssignedSource(creep);
        if (!source) {
            logger.warn(`[${creep.name}] ソースの割り当てがありません`);
            return;
        }

        // ソースの隣に近接コンテナがある場合はそこを優先ポジションとする
        const container = _findSourceContainer(source);

        if (container) {
            _mineToContainer(creep, source, container);
        } else {
            _mineDirectly(creep, source);
        }
    } catch (e) {
        logger.error(`[${creep.name}] マイナーエラー`, e);
    }
}

// ============================================================
// ソース割り当て
// ============================================================

/**
 * ルーム内の各ソースへのマイナー割り当て状況を返す
 * @param {Room} room
 * @returns {Object.<string, number>} sourceId → マイナー数
 */
function getMinerAssignments(room) {
    const assignments = Object.create(null);
    const sources = cache.getSources(room);

    for (let i = 0; i < sources.length; i++) {
        assignments[sources[i].id] = 0;
    }

    // ⚡ PERFORMANCE OPTIMIZATION: Use getMyCreeps cache and standard for loop to avoid global Game.creeps iteration.
    const creeps = cache.getMyCreeps(room);
    for (let i = 0; i < creeps.length; i++) {
        const creep = creeps[i];
        if (creep.memory.role === 'miner' && creep.memory[MEMORY_KEYS.SOURCE_ID]) {
            const sid = creep.memory[MEMORY_KEYS.SOURCE_ID];
            if (cache.isSafeKey(sid) && assignments[sid] !== undefined) {
                assignments[sid]++;
            }
        }
    }

    return assignments;
}

/**
 * クリープに割り当てられたソースを返す
 * メモリに sourceId がなければルーム内で最も採掘者の少ないソースを選ぶ
 * @param {Creep} creep
 * @returns {Source|null}
 */
function _getAssignedSource(creep) {
    if (creep.memory[MEMORY_KEYS.SOURCE_ID]) {
        const src = Game.getObjectById(creep.memory[MEMORY_KEYS.SOURCE_ID]);
        if (src) {
            return src;
        }
    }

    // ソース割り当てを決定する
    const sources = cache.getSources(creep.room);
    if (sources.length === 0) {
        return null;
    }

    // マイナーの割り当てカウント
    const minerCounts = getMinerAssignments(creep.room);

    // 最も採掘者が少ないソースに割り当て
    const bestSource = _findBestSource(sources, minerCounts);

    if (bestSource) {
        creep.memory[MEMORY_KEYS.SOURCE_ID] = bestSource.id;
    }

    return bestSource;
}

/**
 * @param {Source[]} sources
 * @param {Object.<string, number>} minerCounts
 * @returns {Source|null}
 */
function _findBestSource(sources, minerCounts) {
    let bestSource = null;
    let minCount = Infinity;
    for (const src of sources) {
        const count =
            Object.prototype.hasOwnProperty.call(minerCounts, src.id) && cache.isSafeKey(src.id)
                ? minerCounts[src.id]
                : 0;
        // 各ソースに配置できるマイナー数 = ソース周囲の利用可能スポット数（最大2）
        const maxMiners = _countMiningSpots(src);
        if (count < maxMiners && count < minCount) {
            minCount = count;
            bestSource = src;
        }
    }

    if (!bestSource && sources.length > 0) {
        bestSource = sources[0]; // フォールバック
    }
    return bestSource;
}

/**
 * ソース周囲の採掘可能スポット数を計算する
 * @param {Source} source
 * @returns {number} 1〜3
 */
function _countMiningSpots(source) {
    const room = source.room;
    const terrain = room.getTerrain();
    let count = 0;

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) {
                continue;
            }
            const x = source.pos.x + dx;
            const y = source.pos.y + dy;
            if (x < 1 || x > 48 || y < 1 || y > 48) {
                continue;
            }
            if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
                count++;
            }
        }
    }

    return Math.min(count, 3);
}

// ============================================================
// コンテナ採掘ロジック
// ============================================================

/**
 * ソース付近のコンテナを探す
 * @param {Source} source
 * @returns {StructureContainer|null}
 */
function _findSourceContainer(source) {
    const room = source.room;
    const containers = cache.getContainers(room);

    for (let i = 0; i < containers.length; i++) {
        const s = containers[i];
        if (source.pos.getRangeTo(s) <= CONTAINER_SEARCH_RANGE) {
            return s;
        }
    }
    return null;
}

/**
 * コンテナ付きのソースで採掘する
 * コンテナの上に移動してから採掘することでエネルギーが自動的にコンテナに入る
 * @param {Creep} creep
 * @param {Source} source
 * @param {StructureContainer} container
 */
function _mineToContainer(creep, source, container) {
    // コンテナの上に立つ（隣接ではなくコンテナ上）
    if (!creep.pos.isEqualTo(container.pos)) {
        pathfinder.moveTo(creep, container.pos, { range: 0 });
        return;
    }

    // コンテナが満杯でも採掘を続ける（床に落ちたエネルギーはトランスポーターが回収）
    const result = creep.harvest(source);
    if (result === ERR_NOT_IN_RANGE) {
        pathfinder.moveTo(creep, source, { range: 1 });
    } else if (result === ERR_NOT_ENOUGH_ENERGY) {
        // ソースが枯渇 - 待機して再生を待つ
        creep.say(`⏳ ${source.ticksToRegeneration}T`);
    } else if (result === OK) {
        // コンテナのHP確認 - 必要ならその場で修復
        if (container.hits < container.hitsMax * 0.5) {
            creep.repair(container);
        }
    }
}

/**
 * コンテナなしで直接ソースから採掘する
 * @param {Creep} creep
 * @param {Source} source
 */
function _mineDirectly(creep, source) {
    const result = creep.harvest(source);
    if (result === ERR_NOT_IN_RANGE) {
        pathfinder.moveTo(creep, source, { range: 1 });
    } else if (result === ERR_NOT_ENOUGH_ENERGY) {
        creep.say(`⏳ ${source.ticksToRegeneration}T`);
    } else if (result === OK) {
        // 満杯になったらエネルギーをドロップ（トランスポーターが回収）
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            creep.drop(RESOURCE_ENERGY);
        }
    }
}

// ============================================================
// ビジュアル
// ============================================================

/**
 * マイニング効率をビジュアル表示する
 * @param {Creep} creep
 * @param {Source} source
 */
function showMiningVisual(creep, source) {
    const energyPct = source.energy / source.energyCapacity;
    const color = energyPct > 0.5 ? '#00ff88' : energyPct > 0.2 ? '#ffaa00' : '#ff4444';
    creep.room.visual.circle(source.pos, {
        radius: 0.5,
        fill: color,
        opacity: 0.3,
        stroke: color,
        strokeWidth: 0.05,
    });
}

// ============================================================
// ボディ生成
// ============================================================

/**
 * 利用可能エネルギーに応じた最適なボディを返す
 * マイナーはWORKパーツを最大化することで採掘効率を上げる
 * ソース1つを1マイナーで完全に消費: WORK×5 + CARRY×1 + MOVE×1 = 550エネルギー
 * @param {number} energy
 * @returns {string[]}
 */
function getBody(energy) {
    if (energy >= 650) {
        // 完全最適化ボディ: WORK×5 = 10エネルギー/ティック
        return [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE];
    }
    if (energy >= 550) {
        return [WORK, WORK, WORK, WORK, CARRY, MOVE];
    }
    if (energy >= 450) {
        return [WORK, WORK, WORK, CARRY, MOVE];
    }
    if (energy >= 250) {
        return [WORK, WORK, MOVE];
    }
    return [WORK, MOVE];
}

// ============================================================
// ユーティリティ
// ============================================================

module.exports = { run, getBody, getMinerAssignments, showMiningVisual };
