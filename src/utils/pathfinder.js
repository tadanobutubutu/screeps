/**
 * src/utils/pathfinder.js
 * Screeps 経路探索ユーティリティ
 *
 * PathFinder API をラップし、道路優先・スワンプ回避・障害物回避などの
 * カスタムコストマトリクスを提供する。
 * パス結果はキャッシュに格納してCPU使用量を削減する。
 */

'use strict';

const { PATHFINDER_DEFAULTS, CACHE_TTL } = require('../constants');
const cacheUtils = require('./cache');

// ============================================================
// グローバルキャッシュキー
// ============================================================

const PATH_CACHE_PREFIX = 'path_';
const COST_MATRIX_CACHE_PREFIX = 'cm_';

// ============================================================
// コストマトリクス構築
// ============================================================

/**
 * 構造物のコストをマトリクスに適用する
 * @param {PathFinder.CostMatrix} costs
 * @param {Room} room
 */
function _applyStructureCosts(costs, room) {
    const structures = cacheUtils.getStructures(room);
    for (let i = 0; i < structures.length; i++) {
        const struct = structures[i];
        switch (struct.structureType) {
            case STRUCTURE_ROAD:
                costs.set(struct.pos.x, struct.pos.y, PATHFINDER_DEFAULTS.ROAD_COST);
                break;
            case STRUCTURE_WALL:
                costs.set(struct.pos.x, struct.pos.y, 255);
                break;
            case STRUCTURE_RAMPART:
                if (!struct.my && !struct.isPublic) {
                    costs.set(struct.pos.x, struct.pos.y, 255);
                }
                break;
            default:
                if (
                    struct.structureType !== STRUCTURE_CONTAINER &&
                    struct.structureType !== STRUCTURE_LINK
                ) {
                    if (!struct.my) {
                        costs.set(struct.pos.x, struct.pos.y, 255);
                    }
                }
        }
    }
}

/**
 * 建設中の構造物のコストをマトリクスに適用する
 * @param {PathFinder.CostMatrix} costs
 * @param {Room} room
 */
function _applyConstructionSiteCosts(costs, room) {
    const sites = cacheUtils.getConstructionSites(room);
    for (let i = 0; i < sites.length; i++) {
        const site = sites[i];
        if (
            site.structureType !== STRUCTURE_ROAD &&
            site.structureType !== STRUCTURE_RAMPART &&
            site.structureType !== STRUCTURE_CONTAINER
        ) {
            costs.set(site.pos.x, site.pos.y, 3);
        }
    }
}

/**
 * クリープを障害物としてマトリクスに適用する
 * @param {PathFinder.CostMatrix} costs
 * @param {Room} room
 */
function _applyCreepCosts(costs, room) {
    if (!room._allCreeps || room._allCreepsTick !== Game.time) {
        room._allCreeps = room.find(FIND_CREEPS);
        room._allCreepsTick = Game.time;
    }

    for (let i = 0; i < room._allCreeps.length; i++) {
        const creep = room._allCreeps[i];
        costs.set(creep.pos.x, creep.pos.y, 255);
    }
}

/**
 * ルーム用のカスタムコストマトリクスを構築する
 */
function buildCostMatrix(roomName, options) {
    if (!cacheUtils.isSafeKey(roomName)) {
        return new PathFinder.CostMatrix();
    }

    const opts = Object.assign({ avoidCreeps: false, useCache: true }, options);
    const cacheKey = `${COST_MATRIX_CACHE_PREFIX}${roomName}_${opts.avoidCreeps ? 1 : 0}`;

    if (opts.useCache) {
        return cacheUtils.get(
            cacheKey,
            () => _buildCostMatrixInternal(roomName, opts),
            CACHE_TTL.PATH
        );
    }

    return _buildCostMatrixInternal(roomName, opts);
}

function _buildCostMatrixInternal(roomName, opts) {
    const room = Game.rooms[roomName];
    const costs = new PathFinder.CostMatrix();

    if (!room) return costs;

    _applyStructureCosts(costs, room);
    _applyConstructionSiteCosts(costs, room);
    if (opts.avoidCreeps) {
        _applyCreepCosts(costs, room);
    }

    return costs;
}

// ============================================================
// パス計算
// ============================================================

/**
 * PathFinder を使って creep からターゲットへの経路を計算する
 */
function findPath(origin, goal, options) {
    const opts = Object.assign(
        {
            avoidCreeps: false,
            maxRooms: PATHFINDER_DEFAULTS.MAX_ROOMS,
            plainCost: PATHFINDER_DEFAULTS.PLAIN_COST,
            swampCost: PATHFINDER_DEFAULTS.SWAMP_COST,
        },
        options
    );

    const pfGoal = goal.pos ? { pos: goal.pos, range: goal.range || 1 } : { pos: goal, range: 1 };

    return PathFinder.search(origin, pfGoal, {
        plainCost: opts.plainCost,
        swampCost: opts.swampCost,
        maxRooms: opts.maxRooms,
        roomCallback: (roomName) => buildCostMatrix(roomName, { avoidCreeps: opts.avoidCreeps }),
    });
}

// ============================================================
// クリープ移動ラッパー
// ============================================================

/**
 * クリープをターゲットへ移動させる
 */
function moveTo(creep, target, options) {
    const opts = Object.assign(
        {
            range: 1,
            avoidCreeps: false,
            visualizePath: true,
            reusePath: PATHFINDER_DEFAULTS.REUSE_PATH,
        },
        options
    );

    const moveOptions = {
        reusePath: opts.reusePath,
        maxRooms: opts.avoidCreeps ? 1 : PATHFINDER_DEFAULTS.MAX_ROOMS,
        costCallback: (roomName) => {
            return buildCostMatrix(roomName, {
                avoidCreeps: opts.avoidCreeps,
                useCache: true,
            });
        },
    };

    if (opts.visualizePath) {
        moveOptions.visualizePathStyle = {
            fill: 'transparent',
            stroke: '#00bfff',
            lineStyle: 'dashed',
            strokeWidth: 0.15,
            opacity: 0.3,
        };
    }

    return creep.moveTo(target, moveOptions);
}

// ============================================================
// 距離・位置ユーティリティ
// ============================================================

function chebyshev(a, b) {
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

function manhattan(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function sortByDistance(origin, objects) {
    return objects.slice().sort((a, b) => {
        const da = origin.getRangeTo(a);
        const db = origin.getRangeTo(b);
        return da - db;
    });
}

function closest(origin, objects) {
    if (!objects || objects.length === 0) return null;
    let best = null;
    let bestDist = Infinity;
    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        const d = origin.getRangeTo(obj);
        if (d < bestDist) {
            bestDist = d;
            best = obj;
        }
    }
    return best;
}

function findNearestOpenTile(pos, range) {
    const r = Math.min(range || 3, PATHFINDER_DEFAULTS.MAX_SEARCH_RANGE);
    const room = Game.rooms[pos.roomName];
    if (!room) return null;

    const top = Math.max(1, pos.y - r);
    const left = Math.max(1, pos.x - r);
    const bottom = Math.min(48, pos.y + r);
    const right = Math.min(48, pos.x + r);

    const lookData = room.lookAtArea(top, left, bottom, right, true);
    const blockedTiles = new Set();

    for (let i = 0; i < lookData.length; i++) {
        const item = lookData[i];
        if (item.type === 'structure' || item.type === 'creep') {
            blockedTiles.add(`${item.x},${item.y}`);
        }
    }

    const terrain = room.getTerrain();

    for (let dx = -r; dx <= r; dx++) {
        for (let dy = -r; dy <= r; dy++) {
            const x = pos.x + dx;
            const y = pos.y + dy;
            if (x < 1 || x > 48 || y < 1 || y > 48) continue;
            if (terrain.get(x, y) === TERRAIN_MASK_WALL) continue;
            if (blockedTiles.has(`${x},${y}`)) continue;
            return new RoomPosition(x, y, pos.roomName);
        }
    }
    return null;
}

function getRoadPositions(room) {
    // ⚡ PERFORMANCE OPTIMIZATION: Single-pass for loop to collect road positions.
    // Avoids intermediate array allocations and closure callback overhead from filter & map.
    const structures = cacheUtils.getStructures(room);
    const positions = [];
    for (let i = 0; i < structures.length; i++) {
        const struct = structures[i];
        if (struct.structureType === STRUCTURE_ROAD) {
            positions.push(struct.pos);
        }
    }
    return positions;
}

// ============================================================
// 経路コスト評価
// ============================================================

/**
 * 2地点間の実際の歩数（道路考慮）を推定する
 */
function estimateDistance(origin, goal) {
    if (
        !origin ||
        !goal ||
        !cacheUtils.isSafeKey(origin.roomName) ||
        !cacheUtils.isSafeKey(goal.roomName)
    ) {
        return Infinity;
    }

    const key = `${PATH_CACHE_PREFIX}${origin.roomName}_${origin.x}_${origin.y}_${goal.roomName}_${goal.x}_${goal.y}`;

    return cacheUtils.get(
        key,
        () => {
            const result = findPath(origin, goal);
            return result.incomplete ? Infinity : result.path.length;
        },
        CACHE_TTL.PATH
    );
}

module.exports = {
    buildCostMatrix,
    findPath,
    moveTo,
    chebyshev,
    manhattan,
    sortByDistance,
    closest,
    findNearestOpenTile,
    getRoadPositions,
    estimateDistance,
    isSafeKey: (key) => cacheUtils.isSafeKey(key),
};
