/**
 * src/utils/cache.js
 * Screeps グローバルキャッシュユーティリティ
 *
 * ゲームオブジェクトの検索結果をキャッシュし、CPU使用量を削減する。
 * すべてのキャッシュは `global.cache` 配下に格納する。
 */

'use strict'

const { CACHE_TTL } = require('../constants')

/**
 * Security: Limits for memory-intensive structures to prevent Memory DoS.
 */
const MAX_KEY_LENGTH = 256
const MAX_CACHE_ENTRIES = 100

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
  'propertyIsEnumerable'
])

/**
 * Security: Validates that a key is safe to use for object access.
 * Prevents Prototype Pollution attacks by blocking special properties.
 * Also enforces length limits to prevent Memory DoS.
 */
const isSafeKey = (key) => {
  // ⚡ PERFORMANCE: Restore early return for numeric keys to maintain support
  // and avoid unnecessary string/Set checks.
  if (typeof key === 'number') {
    return true
  }
  // Security: Block dangerous properties that could lead to Prototype Pollution
  // or property shadowing when using user-provided strings as object keys.
  return typeof key === 'string' && key.length <= MAX_KEY_LENGTH && !DANGEROUS_KEYS.has(key)
}

// ⚡ PERFORMANCE: モジュールレベルの変数で状態を追跡し、O(1) での容量チェックとエビクションを実現。
// グローバルリセットに対応するため、オブジェクト参照チェックにより遅延同期。
let _cacheSize = 0
const _cacheOrder = new Map() // Maintains insertion order for O(1) FIFO eviction
let _lastCacheRef = null

// global.cache が未初期化の場合に初期化する
// Security: Use Object.create(null) to avoid prototype pollution issues
function ensureCache () {
  if (!global.cache) {
    global.cache = Object.create(null)
    _cacheSize = 0
    _cacheOrder.clear()
    _lastCacheRef = global.cache
  } else if (global.cache !== _lastCacheRef || Object.getPrototypeOf(global.cache) !== null) {
    // ⚡ PERFORMANCE: global.cache 参照が変更された場合や、プロトタイプが null でない場合（テスト環境等）に再同期
    // Security: 強制的にプロトタイプを null に設定して、プロトタイプ汚染を根本から防ぐ
    if (Object.getPrototypeOf(global.cache) !== null) {
      const cleanCache = Object.create(null)
      Object.assign(cleanCache, global.cache)
      global.cache = cleanCache
    }

    const keys = Object.keys(global.cache)
    _cacheSize = keys.length
    _cacheOrder.clear()
    for (let i = 0; i < keys.length; i++) {
      _cacheOrder.set(keys[i], true)
    }
    _lastCacheRef = global.cache
  }
  return global.cache
}

function _getValidEntry (cache, key) {
  // ⚡ PERFORMANCE: Skip hasOwnProperty as cache is prototype-free (Object.create(null))
  const entry = cache[key]
  if (entry && typeof entry.expires === 'number' && entry.expires > Game.time) {
    return entry
  }
  return undefined
}

function _canAddCacheEntry () {
  return _cacheSize < MAX_CACHE_ENTRIES
}

/**
 * 期限切れキャッシュエントリをすべて削除する
 * 定期的に呼び出してメモリリークを防ぐ
 */
function cleanup () {
  const cache = ensureCache()
  let removed = 0
  const now = Game.time

  // ⚡ PERFORMANCE: Object.keys() のオーバーヘッドなしで O(N) 反復を行うために追跡されたキーを使用
  for (const key of _cacheOrder.keys()) {
    // ⚡ PERFORMANCE: 冗長な isSafeKey を削除。キャッシュ内のすべてのキーは入力時に検証済み。
    const entry = cache[key]
    if (entry && typeof entry.expires === 'number' && entry.expires <= now) {
      delete cache[key]
      _cacheOrder.delete(key)
      _cacheSize--
      removed++
    }
  }
  return removed
}

/**
 * 汎用キャッシュ取得/設定
 * @param {string} key - キャッシュキー
 * @param {Function} fetcher - キャッシュミス時にデータを取得する関数
 * @param {number} ttl - キャッシュ有効期限（ティック数）
 * @returns {*} キャッシュされたデータ
 */
function get (key, fetcher, ttl) {
  // Security: Validate key
  if (!isSafeKey(key)) {
    return fetcher()
  }

  const cache = ensureCache()

  const validEntry = _getValidEntry(cache, key)
  if (validEntry) {
    return validEntry.data
  }

  // データ取得を先に実行。
  // 注意：fetcher内部で別の cache.get が呼ばれる可能性があるため、
  // 容量チェックとエビクションはデータ取得の直前および直後に行う必要がある。
  const data = fetcher()

  // 取得後に再度キャッシュを確認（fetcher内部で設定された可能性を考慮）
  const secondAttempt = _getValidEntry(cache, key)
  if (secondAttempt) {
    return secondAttempt.data
  }

  // Security: Cap the number of cache entries to prevent Memory DoS.
  // 容量がいっぱいの場合、期限切れエントリの削除と FIFO エビクションを行う。
  if (!_canAddCacheEntry()) {
    cleanup()
    // ⚡ PERFORMANCE: Map イテレータを使用した O(1) FIFO エビクション
    while (!_canAddCacheEntry()) {
      const oldestKey = _cacheOrder.keys().next().value
      if (oldestKey === undefined) break
      delete cache[oldestKey]
      _cacheOrder.delete(oldestKey)
      _cacheSize--
    }
  }

  const isNew = cache[key] === undefined
  cache[key] = {
    data,
    expires: Game.time + (ttl || CACHE_TTL.ROOM_OBJECTS)
  }

  if (isNew) {
    _cacheSize++
    _cacheOrder.set(key, true)
  }
  return data
}

/**
 * キャッシュを明示的に無効化する
 * @param {string} key - 無効化するキャッシュキー
 */
function invalidate (key) {
  if (!isSafeKey(key)) {
    return
  }
  const cache = ensureCache()
  // ⚡ PERFORMANCE: Skip hasOwnProperty as cache is prototype-free
  if (cache[key] !== undefined) {
    delete cache[key]
    _cacheOrder.delete(key)
    _cacheSize--
  }
}

/**
 * パターンに一致するキャッシュをまとめて無効化する
 * @param {RegExp|string} pattern - 無効化するキーのパターン
 *
 * Security: Wrapped in try-catch to prevent script crashes (DoS) from
 * invalid or malicious regex strings. Also limits pattern length to 100 chars
 * to mitigate potential ReDoS.
 */
function invalidatePattern (pattern) {
  try {
    // Security: Limit pattern length to prevent ReDoS
    if (typeof pattern === 'string' && pattern.length > 100) {
      return
    }

    const cache = ensureCache()
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern

    // ⚡ PERFORMANCE: Object.keys() のオーバーヘッドなしで O(N) 反復を行うために追跡されたキーを使用
    for (const key of _cacheOrder.keys()) {
      // ⚡ PERFORMANCE: 冗長な isSafeKey を削除。キャッシュ内のすべてのキーは入力時に検証済み。
      if (regex.test(key)) {
        delete cache[key]
        _cacheOrder.delete(key)
        _cacheSize--
      }
    }
  } catch (e) {
    // Silently fail if regex is invalid
  }
}

/**
 * キャッシュ統計を返す
 * @returns {{ total: number, expired: number, active: number }}
 */
function getStats () {
  const cache = ensureCache()
  const now = Game.time
  let expired = 0

  // ⚡ PERFORMANCE: Object.keys() のオーバーヘッドなしで O(N) 反復を行うために追跡されたキーを使用
  for (const key of _cacheOrder.keys()) {
    // ⚡ PERFORMANCE: 冗長な isSafeKey を削除。キャッシュ内のすべてのキーは入力時に検証済み。
    const entry = cache[key]
    if (entry && typeof entry.expires === 'number' && entry.expires <= now) {
      expired++
    }
  }

  return {
    total: _cacheSize,
    expired,
    active: _cacheSize - expired
  }
}

// ============================================================
// ルーム特化キャッシュ
// ============================================================

/**
 * ルーム内のエネルギーソース一覧をキャッシュ付きで取得する
 * @param {Room} room
 * @returns {Source[]}
 */
function getSources (room) {
  return get(`sources_${room.name}`, () => room.find(FIND_SOURCES), CACHE_TTL.SOURCES)
}

/**
 * ルーム内のすべての構造物をキャッシュ付きで取得する
 * @param {Room} room
 * @returns {Structure[]}
 */
function getStructures (room) {
  // ⚡ PERFORMANCE: Prioritize fresh volatile room cache populated in main.js
  if (room._allStructures && room._allStructuresTick === Game.time) {
    return room._allStructures
  }
  return get(`structures_${room.name}`, () => room.find(FIND_STRUCTURES), CACHE_TTL.STRUCTURES)
}

/**
 * ルーム内の自分の構造物をキャッシュ付きで取得する
 * @param {Room} room
 * @param {string} [structureType] - 特定の構造物タイプに絞り込む
 * @returns {OwnedStructure[]}
 */
function getMyStructures (room, structureType) {
  // ⚡ PERFORMANCE: Prioritize fresh volatile room cache populated in main.js
  if (room._myStructures && room._myStructuresTick === Game.time) {
    if (!structureType) {
      return room._myStructures
    }
    // ⚡ PERFORMANCE: Use type-indexed cache for O(1) lookup if available.
    if (room._myStructuresByType) {
      return room._myStructuresByType[structureType] || []
    }
    return room._myStructures.filter((s) => s.structureType === structureType)
  }

  const key = structureType
    ? `my_structures_${room.name}_${structureType}`
    : `my_structures_${room.name}`

  return get(
    key,
    () => {
      const filter = structureType ? { structureType } : undefined
      return room.find(FIND_MY_STRUCTURES, { filter })
    },
    CACHE_TTL.STRUCTURES
  )
}
/**
 * ルーム内の味方クリープをキャッシュ付きで取得する
 * @param {Room} room
 * @returns {Creep[]}
 */
function getMyCreeps (room) {
  // ⚡ PERFORMANCE: Prioritize fresh volatile room cache populated in main.js
  if (room._myCreeps && room._myCreepsTick === Game.time) {
    return room._myCreeps
  }
  return get(`my_creeps_${room.name}`, () => room.find(FIND_MY_CREEPS), CACHE_TTL.ROOM_OBJECTS)
}

/**
 * ルーム内の建設サイトをキャッシュ付きで取得する
 * @param {Room} room
 * @returns {ConstructionSite[]}
 */
function getConstructionSites (room) {
  // ⚡ PERFORMANCE: Prioritize fresh volatile room cache populated in main.js
  if (room._myConstructionSites && room._myConstructionSitesTick === Game.time) {
    return room._myConstructionSites
  }
  return get(
        `construction_sites_${room.name}`,
        () => room.find(FIND_CONSTRUCTION_SITES),
        CACHE_TTL.CONSTRUCTION_SITES
  )
}

/**
 * ルーム内の敵クリープをキャッシュ付きで取得する
 * @param {Room} room
 * @returns {Creep[]}
 */
function getEnemies (room) {
  // ⚡ PERFORMANCE: Prioritize fresh volatile room cache populated in main.js
  if (room._hostileCreeps && room._hostileCreepsTick === Game.time) {
    return room._hostileCreeps
  }
  return get(`enemies_${room.name}`, () => room.find(FIND_HOSTILE_CREEPS), CACHE_TTL.ENEMIES)
}

/**
 * ルーム内の落下リソースをキャッシュ付きで取得する
 * @param {Room} room
 * @returns {Resource[]}
 */
function getDroppedResources (room) {
  return get(
        `dropped_${room.name}`,
        () => room.find(FIND_DROPPED_RESOURCES),
        CACHE_TTL.DROPPED_RESOURCES
  )
}

/**
 * ルーム内の自分のスポーンをキャッシュ付きで取得する
 * @param {Room} room
 * @returns {StructureSpawn[]}
 */
function getSpawns (room) {
  // ⚡ PERFORMANCE: Prioritize fresh volatile room cache populated in main.js
  if (room._spawns && room._spawnsTick === Game.time) {
    return room._spawns
  }
  return get(`spawns_${room.name}`, () => room.find(FIND_MY_SPAWNS), CACHE_TTL.STRUCTURES)
}

/**
 * エネルギー補充が必要な構造物一覧を取得する
 * スポーン・エクステンション・タワーなどが対象
 * @param {Room} room
 * @returns {Structure[]}
 */
function getStructuresNeedingEnergy (room) {
  // ⚡ PERFORMANCE: Prioritize fresh volatile room cache populated in main.js
  if (room._deliveryTargets && Game.time === (room._myStructuresTick || 0)) {
    return room._deliveryTargets
  }
  return get(
        `need_energy_${room.name}`,
        () =>
          room.find(FIND_STRUCTURES, {
            filter: (s) =>
              (s.structureType === STRUCTURE_SPAWN ||
                        s.structureType === STRUCTURE_EXTENSION ||
                        s.structureType === STRUCTURE_TOWER) &&
                    s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          }),
        5 // エネルギー変化が頻繁なので短いTTL
  )
}

/**
 * ルーム内のコンテナをキャッシュ付きで取得する
 * @param {Room} room
 * @returns {StructureContainer[]}
 */
function getContainers (room) {
  // ⚡ PERFORMANCE: Prioritize fresh volatile room cache populated in main.js
  if (room._containers && room._containersTick === Game.time) {
    return room._containers
  }
  return get(
        `containers_${room.name}`,
        () =>
          room.find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTAINER }
          }),
        CACHE_TTL.STRUCTURES
  )
}

/**
 * ルーム内のリンクをキャッシュ付きで取得する
 * @param {Room} room
 * @returns {StructureLink[]}
 */
function getLinks (room) {
  // ⚡ PERFORMANCE: Leverage getMyStructures cache.
  return getMyStructures(room, STRUCTURE_LINK)
}

/**
 * ルームのストレージ構造物を返す（なければ null）
 * @param {Room} room
 * @returns {StructureStorage|null}
 */
function getStorage (room) {
  return get(`storage_${room.name}`, () => room.storage || null, CACHE_TTL.STRUCTURES)
}

// ============================================================
// ソース割り当てキャッシュ
// ============================================================

// ⚡ PERFORMANCE: Volatile per-tick cache for source assignments.
// Security: Use Object.create(null) to avoid prototype pollution.
let _sourceAssignments = Object.create(null)
let _sourceAssignmentsTick = -1

/**
 * 既存の割り当てられたソースを取得する
 * @param {Creep} creep
 * @returns {Source|null}
 */
function getExistingSource (creep) {
  if (creep.memory.sourceId) {
    const src = Game.getObjectById(creep.memory.sourceId)
    if (src) {
      return src
    }
  }
  return null
}

/**
 * ルームのソース割り当て状況を取得する
 * @param {Room} room
 * @returns {Object}
 */
function getRoomSourceAssignments (room) {
  // ⚡ PERFORMANCE: Use per-tick volatile cache to avoid redundant O(N) iterations.
  if (_sourceAssignmentsTick !== Game.time) {
    _sourceAssignments = Object.create(null)
    _sourceAssignmentsTick = Game.time
  }

  if (!_sourceAssignments[room.name]) {
    const assignments = Object.create(null)
    const creeps = getMyCreeps(room)
    for (let i = 0; i < creeps.length; i++) {
      const c = creeps[i]
      if (c.memory.sourceId) {
        assignments[c.memory.sourceId] = (assignments[c.memory.sourceId] || 0) + 1
      }
    }
    _sourceAssignments[room.name] = assignments
  }

  return _sourceAssignments[room.name]
}

/**
 * 最も割り当てが少ないソースを見つける
 * @param {Source[]} sources
 * @param {Object} assignments
 * @returns {Source|null}
 */
function findLeastAssignedSource (sources, assignments) {
  let bestSource = null
  let minAssigned = Infinity
  for (let i = 0; i < sources.length; i++) {
    const src = sources[i]
    const count = assignments[src.id] || 0
    if (count < minAssigned) {
      minAssigned = count
      bestSource = src
    }
  }
  return bestSource
}

/**
 * クリープをソースに割り当てる（均等分散）
 * @param {Creep} creep
 * @param {Room} room
 * @returns {Source|null}
 */
function assignSource (creep, room) {
  const existingSource = getExistingSource(creep)
  if (existingSource) {
    return existingSource
  }

  const sources = getSources(room)
  if (sources.length === 0) {
    return null
  }

  const assignments = getRoomSourceAssignments(room)
  const bestSource = findLeastAssignedSource(sources, assignments)

  if (bestSource) {
    creep.memory.sourceId = bestSource.id
    // ⚡ PERFORMANCE: Update cache for immediate O(1) consistency in the same tick.
    assignments[bestSource.id] = (assignments[bestSource.id] || 0) + 1
  }
  return bestSource
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
  assignSource
}
