// src/utils/cache.js - 汎用キャッシュユーティリティ

const MAX_CACHE_ENTRIES = 100;
const MAX_KEY_LENGTH = 128;

const CACHE_TTL = {
    ROOM_OBJECTS: 5,
    SOURCES: 50,
    STRUCTURES: 10,
    CONSTRUCTION_SITES: 10,
    ENEMIES: 1,
    DROPPED_RESOURCES: 2,
};

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

let _cacheSize = 0;
let _lastCacheRef = null;
const _cacheOrder = new Map();

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
 */
function get(key, fetcher, ttl) {
    if (!isSafeKey(key)) return fetcher();

    const cache = ensureCache();
    const validEntry = _getValidEntry(cache, key);
    if (validEntry) return validEntry.data;

    if (!_canAddCacheEntry()) {
        cleanup();
        if (!_canAddCacheEntry()) {
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
        _cacheOrder.delete(key);
        _cacheOrder.set(key, true);
    }
    return data;
}

/**
 * キャッシュを明示的に無効化する
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
    } catch (e) {}
}

/**
 * 期限切れキャッシュエントリをすべて削除する
 * @returns {number} 削除されたエントリ数
 */
function cleanup() {
    const cache = ensureCache();
    const keys = Object.keys(cache);
    const now = Game.time;
    let removed = 0;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const entry = cache[key];
        if (entry && typeof entry.expires === 'number' && entry.expires <= now) {
            delete cache[key];
            _cacheOrder.delete(key);
            _cacheSize--;
            removed++;
        }
    }
    return removed;
}

/**
 * キャッシュ統計を返す
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

/**
 * volatile 状態をリセットする (テスト用)
 */
function reset() {
    _cacheSize = 0;
    _lastCacheRef = null;
    _cacheOrder.clear();
}

function getSources(room) {
    return get(`sources_${room.name}`, () => room.find(FIND_SOURCES), CACHE_TTL.SOURCES);
}

function getStructures(room) {
    return get(`structures_${room.name}`, () => room.find(FIND_STRUCTURES), CACHE_TTL.STRUCTURES);
}

function getMyStructures(room, structureType) {
    if (room._myStructures && !structureType) return room._myStructures;
    const key = structureType ? `my_structures_${room.name}_${structureType}` : `my_structures_${room.name}`;
    return get(key, () => room.find(FIND_MY_STRUCTURES, structureType ? { filter: { structureType } } : undefined), CACHE_TTL.STRUCTURES);
}

function getConstructionSites(room) {
    return get(`construction_sites_${room.name}`, () => room.find(FIND_CONSTRUCTION_SITES), CACHE_TTL.CONSTRUCTION_SITES);
}

function getEnemies(room) {
    return get(`enemies_${room.name}`, () => room.find(FIND_HOSTILE_CREEPS), CACHE_TTL.ENEMIES);
}

function getStructuresNeedingEnergy(room) {
    if (room._deliveryTargets) return room._deliveryTargets;
    return get(`need_energy_${room.name}`, () => room.find(FIND_STRUCTURES, {
        filter: (s) => (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_TOWER) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    }), 5);
}

function assignSource(creep, room) {
    if (creep.memory.sourceId) {
        const src = Game.getObjectById(creep.memory.sourceId);
        if (src) return src;
    }
    const sources = getSources(room);
    if (!sources.length) return null;
    const assignments = Object.create(null);
    const creeps = Object.values(Game.creeps);
    for (const c of creeps) {
        if (c.memory.sourceId) assignments[c.memory.sourceId] = (assignments[c.memory.sourceId] || 0) + 1;
    }
    const bestSource = sources.reduce((best, s) => (!best || (assignments[s.id] || 0) < (assignments[best.id] || 0)) ? s : best, null);
    if (bestSource) {
        creep.memory.sourceId = bestSource.id;
        const mockName = creep.name || Math.random().toString();
        if (!Game.creeps[mockName]) Game.creeps[mockName] = creep;
    }
    return bestSource;
}

module.exports = {
    get, invalidate, invalidatePattern, cleanup, getStats, isSafeKey, reset,
    getSources, getStructures, getMyStructures, getConstructionSites, getEnemies,
    getStructuresNeedingEnergy, assignSource
};
