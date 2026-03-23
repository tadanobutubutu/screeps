/**
 * src/utils/cache.js
 * Screeps グローバルキャッシュユーティリティ
 *
 * ゲームオブジェクトの検索結果をキャッシュし、CPU使用量を削減する。
 * すべてのキャッシュは `global.cache` 配下に格納する。
 */

'use strict';

const { CACHE_TTL } = require('../constants');

// global.cache が未初期化の場合に初期化する
function ensureCache() {
    if (!global.cache) {
        global.cache = {};
    }
    return global.cache;
}

/**
 * 汎用キャッシュ取得/設定
 * @param {string} key - キャッシュキー
 * @param {Function} fetcher - キャッシュミス時にデータを取得する関数
 * @param {number} ttl - キャッシュ有効期限（ティック数）
 * @returns {*} キャッシュされたデータ
 */
function get(key, fetcher, ttl) {
    const cache = ensureCache();
    const entry = cache[key];

    if (entry && entry.expires > Game.time) {
        return entry.data;
    }

    const data = fetcher();
    cache[key] = {
        data,
        expires: Game.time + (ttl || CACHE_TTL.ROOM_OBJECTS),
    };
    return data;
}

/**
 * キャッシュを明示的に無効化する
 * @param {string} key - 無効化するキャッシュキー
 */
function invalidate(key) {
    const cache = ensureCache();
    delete cache[key];
}

/**
 * パターンに一致するキャッシュをまとめて無効化する
 * @param {RegExp|string} pattern - 無効化するキーのパターン
 */
function invalidatePattern(pattern) {
    const cache = ensureCache();
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    for (const key in cache) {
        if (regex.test(key)) {
            delete cache[key];
        }
    }
}

/**
 * 期限切れキャッシュエントリをすべて削除する
 * 定期的に呼び出してメモリリークを防ぐ
 */
function cleanup() {
    const cache = ensureCache();
    let removed = 0;
    for (const key in cache) {
        if (cache[key].expires <= Game.time) {
            delete cache[key];
            removed++;
        }
    }
    return removed;
}

/**
 * キャッシュ統計を返す
 * @returns {{ total: number, expired: number, active: number }}
 */
function getStats() {
    const cache = ensureCache();
    const keys = Object.keys(cache);
    const now = Game.time;
    let expired = 0;

    for (const key of keys) {
        if (cache[key].expires <= now) {
            expired++;
        }
    }

    return {
        total: keys.length,
        expired,
        active: keys.length - expired,
    };
}

// ============================================================
// ルーム特化キャッシュ
// ============================================================

/**
 * ルーム内のエネルギーソース一覧をキャッシュ付きで取得する
 * @param {Room} room
 * @returns {Source[]}
 */
function getSources(room) {
    return get(
        `sources_${room.name}`,
        () => room.find(FIND_SOURCES),
        CACHE_TTL.SOURCES
    );
}

/**
 * ルーム内のすべての構造物をキャッシュ付きで取得する
 * @param {Room} room
 * @returns {Structure[]}
 */
function getStructures(room) {
    return get(
        `structures_${room.name}`,
        () => room.find(FIND_STRUCTURES),
        CACHE_TTL.STRUCTURES
    );
}

/**
 * ルーム内の自分の構造物をキャッシュ付きで取得する
 * @param {Room} room
 * @param {string} [structureType] - 特定の構造物タイプに絞り込む
 * @returns {OwnedStructure[]}
 */
function getMyStructures(room, structureType) {
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

/**
 * ルーム内の建設サイトをキャッシュ付きで取得する
 * @param {Room} room
 * @returns {ConstructionSite[]}
 */
function getConstructionSites(room) {
    return get(
        `construction_sites_${room.name}`,
        () => room.find(FIND_CONSTRUCTION_SITES),
        CACHE_TTL.CONSTRUCTION_SITES
    );
}

/**
 * ルーム内の敵クリープをキャッシュ付きで取得する
 * @param {Room} room
 * @returns {Creep[]}
 */
function getEnemies(room) {
    return get(
        `enemies_${room.name}`,
        () => room.find(FIND_HOSTILE_CREEPS),
        CACHE_TTL.ENEMIES
    );
}

/**
 * ルーム内の落下リソースをキャッシュ付きで取得する
 * @param {Room} room
 * @returns {Resource[]}
 */
function getDroppedResources(room) {
    return get(
        `dropped_${room.name}`,
        () => room.find(FIND_DROPPED_RESOURCES),
        CACHE_TTL.DROPPED_RESOURCES
    );
}

/**
 * ルーム内の自分のスポーンをキャッシュ付きで取得する
 * @param {Room} room
 * @returns {StructureSpawn[]}
 */
function getSpawns(room) {
    return get(
        `spawns_${room.name}`,
        () => room.find(FIND_MY_SPAWNS),
        CACHE_TTL.STRUCTURES
    );
}

/**
 * エネルギー補充が必要な構造物一覧を取得する
 * スポーン・エクステンション・タワーなどが対象
 * @param {Room} room
 * @returns {Structure[]}
 */
function getStructuresNeedingEnergy(room) {
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
        5 // エネルギー変化が頻繁なので短いTTL
    );
}

/**
 * ルーム内のコンテナをキャッシュ付きで取得する
 * @param {Room} room
 * @returns {StructureContainer[]}
 */
function getContainers(room) {
    return get(
        `containers_${room.name}`,
        () =>
            room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_CONTAINER },
            }),
        CACHE_TTL.STRUCTURES
    );
}

/**
 * ルーム内のリンクをキャッシュ付きで取得する
 * @param {Room} room
 * @returns {StructureLink[]}
 */
function getLinks(room) {
    return get(
        `links_${room.name}`,
        () =>
            room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_LINK },
            }),
        CACHE_TTL.STRUCTURES
    );
}

/**
 * ルームのストレージ構造物を返す（なければ null）
 * @param {Room} room
 * @returns {StructureStorage|null}
 */
function getStorage(room) {
    return get(
        `storage_${room.name}`,
        () => room.storage || null,
        CACHE_TTL.STRUCTURES
    );
}

// ============================================================
// ソース割り当てキャッシュ
// ============================================================

/**
 * クリープをソースに割り当てる（均等分散）
 * @param {Creep} creep
 * @param {Room} room
 * @returns {Source}
 */
function assignSource(creep, room) {
    if (creep.memory.sourceId) {
        const src = Game.getObjectById(creep.memory.sourceId);
        if (src) return src;
    }

    const sources = getSources(room);
    if (sources.length === 0) return null;

    // 各ソースに割り当てられているクリープ数をカウント
    const assignments = {};
    for (const name in Game.creeps) {
        const c = Game.creeps[name];
        if (c.memory.sourceId && c.room.name === room.name) {
            assignments[c.memory.sourceId] = (assignments[c.memory.sourceId] || 0) + 1;
        }
    }

    // 最も割り当てが少ないソースを選択
    let bestSource = null;
    let minAssigned = Infinity;
    for (const src of sources) {
        const count = assignments[src.id] || 0;
        if (count < minAssigned) {
            minAssigned = count;
            bestSource = src;
        }
    }

    if (bestSource) {
        creep.memory.sourceId = bestSource.id;
    }
    return bestSource;
}

module.exports = {
    get,
    invalidate,
    invalidatePattern,
    cleanup,
    getStats,
    getSources,
    getStructures,
    getMyStructures,
    getConstructionSites,
    getEnemies,
    getDroppedResources,
    getSpawns,
    getStructuresNeedingEnergy,
    getContainers,
    getLinks,
    getStorage,
    assignSource,
};
