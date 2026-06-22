/**
 * src/utils/cache.js
 * Screeps グローバルキャッシュユーティリティ
 *
 * ゲームオブジェクトの検索結果をキャッシュし、CPU使用量を削減する。
 * すべてのキャッシュは `global.cache` 配下に格納する。
 */

'use strict';

const { CACHE_TTL } = require('../constants');

/**
 * Security: Limits for memory-intensive structures to prevent Memory DoS.
 */
const MAX_KEY_LENGTH = 256;
const MAX_CACHE_ENTRIES = 100;

/**
 * ⚡ PERFORMANCE: Track cache size and order in module-level variables
 * to make capacity check and FIFO eviction O(1).
 */
let _cacheSize = -1;
let _lastCacheRef = null;
const _cacheOrder = new Map();

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoist dangerous keys list to a Set to avoid per-call
 * array allocation and to enable O(1) lookups in the high-frequency isSafeKey function.
 */
const DANGEROUS_KEYS = new Set([
    '__proto__',
    'constructor',
    'prototype',
    '__defineGetter__',
    '__defineSetter__',
    '__lookupGetter__',
    '__lookupSetter__',
    'toString',
    'valueOf',
    'hasOwnProperty',
    'toLocaleString',
    'isPrototypeOf',
    'propertyIsEnumerable',
]);

/**
 * Security: Validates that a key is safe to use for object access.
 * Prevents Prototype Pollution attacks by blocking special properties.
 * Also enforces length limits to prevent Memory DoS.
 */
const isSafeKey = (key) => {
    if (typeof key === 'number') return true;
    return typeof key === 'string' && key.length <= MAX_KEY_LENGTH && !DANGEROUS_KEYS.has(key);
};

// global.cache が未初期化の場合に初期化する
function ensureCache() {
    if (global.cache !== _lastCacheRef) {
        _lastCacheRef = global.cache;
        _cacheOrder.clear();
        if (!_lastCacheRef) {
            _lastCacheRef = global.cache = Object.create(null);
            _cacheSize = 0;
        } else {
            const keys = Object.keys(_lastCacheRef);
            _cacheSize = keys.length;
            for (let i = 0; i < keys.length; i++) {
                _cacheOrder.set(keys[i], true);
            }
        }
    }
    return _lastCacheRef;
}

function _getValidEntry(cache, key) {
    const entry = cache[key];
    if (entry && typeof entry.expires === 'number' && entry.expires > Game.time) {
        return entry;
    }
    return undefined;
}

function _canAddCacheEntry() {
    return _cacheSize < MAX_CACHE_ENTRIES;
}

/**
 * 汎用キャッシュ取得/設定
 * @param {string} key - キャッシュキー
 * @param {Function} fetcher - キャッシュミス時にデータを取得する関数
 * @param {number} ttl - キャッシュ有効期限（ティック数）
 * @returns {*} キャッシュされたデータ
 */
function get(key, fetcher, ttl) {
    if (!isSafeKey(key)) return fetcher();

    const cache = ensureCache();
    const validEntry = _getValidEntry(cache, key);
    if (validEntry) return validEntry.data;

    if (!_canAddCacheEntry()) {
        cleanup();
        if (!_canAddCacheEntry()) {
            // ⚡ PERFORMANCE: O(1) FIFO eviction using Map insertion order.
            const oldestKey = _cacheOrder.keys().next().value;
            if (oldestKey !== undefined) {
                delete cache[oldestKey];
                _cacheOrder.delete(oldestKey);
                _cacheSize--;
            }
        }
    }

    const data = fetcher();
    const isUpdate = cache[key] !== undefined;
    cache[key] = {
        data,
        expires: Game.time + (ttl || CACHE_TTL.ROOM_OBJECTS),
    };

    if (!isUpdate) {
        _cacheSize++;
        _cacheOrder.set(key, true);
    } else {
        // Move to end of order (optional for FIFO, but good for LRU-ish behavior)
        _cacheOrder.delete(key);
        _cacheOrder.set(key, true);
    }
    return data;
}

/**
 * キャッシュを明示的に無効化する
 * @param {string} key - 無効化するキャッシュキー
 */
function invalidate(key) {
    if (!isSafeKey(key)) return;
    const cache = ensureCache();
    if (cache[key] !== undefined) {
        delete cache[key];
        _cacheOrder.delete(key);
        _cacheSize--;
    }
}

/**
 * パターンに一致するキャッシュをまとめて無効化する
 * @param {RegExp|string} pattern - 無効化するキーのパターン
 */
function invalidatePattern(pattern) {
    try {
        if (typeof pattern === 'string' && pattern.length > 100) return;
        const cache = ensureCache();
        const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
        const keys = Object.keys(cache);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (regex.test(key)) {
                delete cache[key];
                _cacheOrder.delete(key);
                _cacheSize--;
            }
        }
    } catch (e) {
        // Silently fail
    }
}

/**
 * 期限切れキャッシュエントリをすべて削除する
 */
function cleanup() {
    const cache = ensureCache();
    const keys = Object.keys(cache);
    const now = Game.time;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const entry = cache[key];
        if (entry && typeof entry.expires === 'number' && entry.expires <= now) {
            delete cache[key];
            _cacheOrder.delete(key);
            _cacheSize--;
        }
    }
}

/**
 * キャッシュ統計を返す
 * @returns {{ total: number, expired: number, active: number }}
 */
function getStats() {
    const cache = ensureCache();
    const now = Game.time;
    let expired = 0;
    const keys = Object.keys(cache);
    for (let i = 0; i < keys.length; i++) {
        const entry = cache[keys[i]];
        if (entry && typeof entry.expires === 'number' && entry.expires <= now) {
            expired++;
        }
    }
    return {
        total: _cacheSize,
        expired,
        active: _cacheSize - expired,
    };
}

// ============================================================
// ルーム特化キャッシュ
// ============================================================

function getSources(room) {
    return get(`sources_${room.name}`, () => room.find(FIND_SOURCES), CACHE_TTL.SOURCES);
}

function getStructures(room) {
    if (room._allStructures && room._allStructuresTick === Game.time) return room._allStructures;
    return get(`structures_${room.name}`, () => room.find(FIND_STRUCTURES), CACHE_TTL.STRUCTURES);
}

function getMyStructures(room, structureType) {
    if (room._myStructures && room._myStructuresTick === Game.time) {
        if (!structureType) return room._myStructures;
        if (room._myStructuresByType) return room._myStructuresByType[structureType] || [];
        return room._myStructures.filter((s) => s.structureType === structureType);
    }
    const key = structureType
        ? `my_structures_${room.name}_${structureType}`
        : `my_structures_${room.name}`;
    return get(
        key,
        () => {
            const filter = structureType ? { structureType } : undefined;
            return room.find(FIND_MY_STRUCTURES, { filter });
        },
        CACHE_TTL.STRUCTURES
    );
}

function getMyCreeps(room) {
    if (room._myCreeps && room._myCreepsTick === Game.time) return room._myCreeps;
    return get(`my_creeps_${room.name}`, () => room.find(FIND_MY_CREEPS), CACHE_TTL.ROOM_OBJECTS);
}

function getConstructionSites(room) {
    if (room._myConstructionSites && room._myConstructionSitesTick === Game.time) {
        return room._myConstructionSites;
    }
    return get(
        `construction_sites_${room.name}`,
        () => room.find(FIND_CONSTRUCTION_SITES),
        CACHE_TTL.CONSTRUCTION_SITES
    );
}

function getEnemies(room) {
    if (room._hostileCreeps && room._hostileCreepsTick === Game.time) return room._hostileCreeps;
    return get(`enemies_${room.name}`, () => room.find(FIND_HOSTILE_CREEPS), CACHE_TTL.ENEMIES);
}

function getDroppedResources(room) {
    return get(
        `dropped_${room.name}`,
        () => room.find(FIND_DROPPED_RESOURCES),
        CACHE_TTL.DROPPED_RESOURCES
    );
}

function getSpawns(room) {
    if (room._spawns && room._spawnsTick === Game.time) return room._spawns;
    return get(`spawns_${room.name}`, () => room.find(FIND_MY_SPAWNS), CACHE_TTL.STRUCTURES);
}

function getStructuresNeedingEnergy(room) {
    if (room._deliveryTargets && Game.time === (room._myStructuresTick || 0)) {
        return room._deliveryTargets;
    }
    return get(
        `need_energy_${room.name}`,
        () =>
            room.find(FIND_STRUCTURES, {
                filter: (s) =>
                    (s.structureType === STRUCTURE_SPAWN ||
                        s.structureType === STRUCTURE_EXTENSION ||
                        s.structureType === STRUCTURE_TOWER) &&
                    s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
            }),
        5
    );
}

function getContainers(room) {
    if (room._containers && room._containersTick === Game.time) return room._containers;
    return get(
        `containers_${room.name}`,
        () => room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER } }),
        CACHE_TTL.STRUCTURES
    );
}

function getLinks(room) {
    return getMyStructures(room, STRUCTURE_LINK);
}

function getStorage(room) {
    return get(`storage_${room.name}`, () => room.storage || null, CACHE_TTL.STRUCTURES);
}

// ============================================================
// ソース割り当てキャッシュ
// ============================================================

let _sourceAssignments = Object.create(null);
let _sourceAssignmentsTick = -1;

function getExistingSource(creep) {
    if (creep.memory.sourceId) {
        const src = Game.getObjectById(creep.memory.sourceId);
        if (src) return src;
    }
    return null;
}

function getRoomSourceAssignments(room) {
    if (_sourceAssignmentsTick !== Game.time) {
        _sourceAssignments = Object.create(null);
        _sourceAssignmentsTick = Game.time;
    }
    if (!_sourceAssignments[room.name]) {
        const assignments = Object.create(null);
        const creeps = getMyCreeps(room);
        for (let i = 0; i < creeps.length; i++) {
            const c = creeps[i];
            if (c.memory.sourceId) {
                assignments[c.memory.sourceId] = (assignments[c.memory.sourceId] || 0) + 1;
            }
        }
        _sourceAssignments[room.name] = assignments;
    }
    return _sourceAssignments[room.name];
}

function findLeastAssignedSource(sources, assignments) {
    let bestSource = null;
    let minAssigned = Infinity;
    for (let i = 0; i < sources.length; i++) {
        const src = sources[i];
        const count = assignments[src.id] || 0;
        if (count < minAssigned) {
            minAssigned = count;
            bestSource = src;
        }
    }
    return bestSource;
}

function assignSource(creep, room) {
    const existingSource = getExistingSource(creep);
    if (existingSource) return existingSource;
    const sources = getSources(room);
    if (sources.length === 0) return null;
    const assignments = getRoomSourceAssignments(room);
    const bestSource = findLeastAssignedSource(sources, assignments);
    if (bestSource) {
        creep.memory.sourceId = bestSource.id;
        assignments[bestSource.id] = (assignments[bestSource.id] || 0) + 1;
    }
    return bestSource;
}

module.exports = {
    get,
    invalidate,
    invalidatePattern,
    cleanup,
    getStats,
    isSafeKey,
    getSources,
    getStructures,
    getMyStructures,
    getMyCreeps,
    getConstructionSites,
    getEnemies,
    getDroppedResources,
    getSpawns,
    getStructuresNeedingEnergy,
    getContainers,
    getLinks,
    getStorage,
    assignSource,
    reset: function () {
        _cacheSize = -1;
        _lastCacheRef = null;
        _cacheOrder.clear();
    },
};
