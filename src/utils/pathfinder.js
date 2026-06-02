/**
 * src/utils/pathfinder.js
 * Screeps 経路探索ユーティリティ
 *
 * PathFinder API をラップし、道路優先・スワンプ回避・障害物回避などの
 * カスタムコストマトリクスを提供する。
 * パス結果はキャッシュに格納してCPU使用量を削減する。
 */

'use strict'

const { PATHFINDER_DEFAULTS, CACHE_TTL } = require('../constants')
const cacheUtils = require('./cache')

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
  if (typeof key === 'number') return true
  // Security: Block dangerous properties that could lead to Prototype Pollution
  // or property shadowing when using user-provided strings as object keys.
  return typeof key === 'string' && key.length <= MAX_KEY_LENGTH && !DANGEROUS_KEYS.has(key)
}

// ============================================================
// グローバルキャッシュキー
// ============================================================

const PATH_CACHE_PREFIX = 'path_'
const COST_MATRIX_CACHE_PREFIX = 'cm_'

/**
 * global.cache を初期化する（未定義の場合）
 * Security: Use Object.create(null) to avoid prototype pollution issues
 */
function ensureCache () {
  if (!global.cache) global.cache = Object.create(null)
  return global.cache
}

/**
 * キャッシュからエントリを取得する
 * @param {Object} cache
 * @param {string} key
 * @returns {any|undefined}
 */
function _getCacheEntry (cache, key) {
  if (!isSafeKey(key)) return undefined
  const entry = Object.prototype.hasOwnProperty.call(cache, key) ? cache[key] : undefined
  if (entry && typeof entry.expires === 'number' && entry.expires > Game.time) {
    return entry.data
  }
  return undefined
}

/**
 * キャッシュにエントリを保存する
 * @param {Object} cache
 * @param {string} key
 * @param {any} data
 * @param {number} ttl
 */
function _setCacheEntry (cache, key, data, ttl) {
  if (!isSafeKey(key)) return

  // Security: Cap the number of cache entries to prevent Memory DoS.
  // If full, attempt to cleanup expired entries.
  if (Object.keys(cache).length >= MAX_CACHE_ENTRIES) {
    cacheUtils.cleanup()
    // If still full, implement FIFO eviction by deleting the oldest entry.
    // This ensures the cache remains available for new, potentially more relevant data.
    if (Object.keys(cache).length >= MAX_CACHE_ENTRIES) {
      const keys = Object.keys(cache)
      if (keys.length > 0) {
        delete cache[keys[0]]
      }
    }
  }

  cache[key] = {
    data,
    expires: Game.time + ttl
  }
}

// ============================================================
// コストマトリクス構築
// ============================================================

/**
 * 構造物のコストをマトリクスに適用する
 * @param {PathFinder.CostMatrix} costs
 * @param {Room} room
 */
function _applyStructureCosts (costs, room) {
  const structures = cacheUtils.getStructures(room)
  for (const struct of structures) {
    switch (struct.structureType) {
      case STRUCTURE_ROAD:
        // 道路は平地コスト(2)より低いコスト(1)に設定
        costs.set(struct.pos.x, struct.pos.y, PATHFINDER_DEFAULTS.ROAD_COST)
        break
      case STRUCTURE_WALL:
        // ウォールは通行不可
        costs.set(struct.pos.x, struct.pos.y, 255)
        break
      case STRUCTURE_RAMPART:
        // 自分のランパートは通行可能、敵のランパートは通行不可
        if (!struct.my && !struct.isPublic) {
          costs.set(struct.pos.x, struct.pos.y, 255)
        }
        break
      default:
        // 敵や中立の構造物は通行不可
        if (
          struct.structureType !== STRUCTURE_CONTAINER &&
                    struct.structureType !== STRUCTURE_LINK
        ) {
          if (!struct.my) {
            costs.set(struct.pos.x, struct.pos.y, 255)
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
function _applyConstructionSiteCosts (costs, room) {
  const sites = cacheUtils.getConstructionSites(room)
  for (const site of sites) {
    if (
      site.structureType !== STRUCTURE_ROAD &&
            site.structureType !== STRUCTURE_RAMPART &&
            site.structureType !== STRUCTURE_CONTAINER
    ) {
      costs.set(site.pos.x, site.pos.y, 3)
    }
  }
}

/**
 * クリープを障害物としてマトリクスに適用する
 * @param {PathFinder.CostMatrix} costs
 * @param {Room} room
 */
function _applyCreepCosts (costs, room) {
  // ⚡ PERFORMANCE OPTIMIZATION: Use pre-populated volatile room properties to avoid redundant room.find(FIND_CREEPS) call.
  // main.js で収集済みのクリープを利用することで、エンジンへのクエリを削減する。
  // FIND_CREEPS はすべてのクリープ（味方、敵、中立）を含むため、それらを網羅する。
  if (room._allCreeps && room._allCreepsTick === Game.time) {
    for (let i = 0; i < room._allCreeps.length; i++) {
      const creep = room._allCreeps[i]
      costs.set(creep.pos.x, creep.pos.y, 255)
    }
    return
  }

  const creeps = room.find(FIND_CREEPS)
  for (let i = 0; i < creeps.length; i++) {
    const creep = creeps[i]
    costs.set(creep.pos.x, creep.pos.y, 255)
  }
}

/**
 * ルーム用のカスタムコストマトリクスを構築する
 * - 道路: コスト1（優先）
 * - コンテナ/リンク: 通行可能（コスト変更なし）
 * - ウォール: 通行不可
 * - 他のクリープ: 通行コスト増加
 *
 * @param {string} roomName
 * @param {Object} [options]
 * @param {boolean} [options.avoidCreeps=false] - クリープを障害物として扱うか
 * @param {boolean} [options.useCache=true] - キャッシュを使用するか
 * @returns {PathFinder.CostMatrix}
 */
function buildCostMatrix (roomName, options) {
  const opts = Object.assign({ avoidCreeps: false, useCache: true }, options)
  const cache = ensureCache()

  // Security: Validate input roomName
  if (!isSafeKey(roomName)) {
    return new PathFinder.CostMatrix()
  }

  const cacheKey = `${COST_MATRIX_CACHE_PREFIX}${roomName}_${opts.avoidCreeps ? 1 : 0}`

  if (opts.useCache) {
    const cached = _getCacheEntry(cache, cacheKey)
    if (cached !== undefined) return cached
  }

  const room = Game.rooms[roomName]
  const costs = new PathFinder.CostMatrix()

  if (!room) {
    return costs
  }

  // 構造物のコストを設定
  _applyStructureCosts(costs, room)

  // 建設中の構造物もコストに含める
  _applyConstructionSiteCosts(costs, room)

  // クリープを障害物として設定（オプション）
  if (opts.avoidCreeps) {
    _applyCreepCosts(costs, room)
  }

  if (opts.useCache) {
    _setCacheEntry(cache, cacheKey, costs, CACHE_TTL.PATH)
  }

  return costs
}

// ============================================================
// パス計算
// ============================================================

/**
 * PathFinder を使って creep からターゲットへの経路を計算する
 * @param {RoomPosition} origin - 出発地点
 * @param {RoomPosition|{ pos: RoomPosition, range: number }} goal - 目標地点
 * @param {Object} [options]
 * @param {boolean} [options.avoidCreeps=false]
 * @param {number} [options.maxRooms=1]
 * @param {number} [options.plainCost=2]
 * @param {number} [options.swampCost=10]
 * @returns {PathFinder.Path}
 */
function findPath (origin, goal, options) {
  const opts = Object.assign(
    {
      avoidCreeps: false,
      maxRooms: PATHFINDER_DEFAULTS.MAX_ROOMS,
      plainCost: PATHFINDER_DEFAULTS.PLAIN_COST,
      swampCost: PATHFINDER_DEFAULTS.SWAMP_COST
    },
    options
  )

  const pfGoal = goal.pos ? { pos: goal.pos, range: goal.range || 1 } : { pos: goal, range: 1 }

  return PathFinder.search(origin, pfGoal, {
    plainCost: opts.plainCost,
    swampCost: opts.swampCost,
    maxRooms: opts.maxRooms,
    roomCallback: (roomName) => buildCostMatrix(roomName, { avoidCreeps: opts.avoidCreeps })
  })
}

// ============================================================
// クリープ移動ラッパー
// ============================================================

/**
 * クリープをターゲットへ移動させる
 * メモリにパスをキャッシュし、REUSE_PATH ティック間は再計算しない
 *
 * @param {Creep} creep
 * @param {RoomPosition|RoomObject} target
 * @param {Object} [options]
 * @param {number} [options.range=1] - ターゲットへの接近距離
 * @param {boolean} [options.avoidCreeps=false]
 * @param {boolean} [options.visualizePath=true]
 * @returns {number} 移動結果コード（OK, ERR_TIRED, ERR_NO_PATH など）
 */
function moveTo (creep, target, options) {
  const opts = Object.assign(
    {
      range: 1,
      avoidCreeps: false,
      visualizePath: true,
      reusePath: PATHFINDER_DEFAULTS.REUSE_PATH
    },
    options
  )

  const moveOptions = {
    reusePath: opts.reusePath,
    maxRooms: opts.avoidCreeps ? 1 : PATHFINDER_DEFAULTS.MAX_ROOMS,
    costCallback: (roomName, costMatrix) => {
      return buildCostMatrix(roomName, {
        avoidCreeps: opts.avoidCreeps,
        useCache: true
      })
    }
  }

  if (opts.visualizePath) {
    moveOptions.visualizePathStyle = {
      fill: 'transparent',
      stroke: '#00bfff',
      lineStyle: 'dashed',
      strokeWidth: 0.15,
      opacity: 0.3
    }
  }

  return creep.moveTo(target, moveOptions)
}

// ============================================================
// 距離・位置ユーティリティ
// ============================================================

/**
 * 2つの位置間のチェビシェフ距離（範囲内判定用）を返す
 * @param {RoomPosition} a
 * @param {RoomPosition} b
 * @returns {number}
 */
function chebyshev (a, b) {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y))
}

/**
 * 2つの位置間のマンハッタン距離を返す
 * @param {RoomPosition} a
 * @param {RoomPosition} b
 * @returns {number}
 */
function manhattan (a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

/**
 * 対象オブジェクト一覧を距離でソートして返す
 * @param {RoomPosition} origin
 * @param {RoomObject[]} objects
 * @returns {RoomObject[]}
 */
function sortByDistance (origin, objects) {
  return objects.slice().sort((a, b) => {
    const da = origin.getRangeTo(a)
    const db = origin.getRangeTo(b)
    return da - db
  })
}

/**
 * 最も近い対象オブジェクトを返す
 * @param {RoomPosition} origin
 * @param {RoomObject[]} objects
 * @returns {RoomObject|null}
 */
function closest (origin, objects) {
  if (!objects || objects.length === 0) return null
  let best = null
  let bestDist = Infinity
  for (const obj of objects) {
    const d = origin.getRangeTo(obj)
    if (d < bestDist) {
      bestDist = d
      best = obj
    }
  }
  return best
}

/**
 * 出発地から最も近い空きタイルを見つける
 * @param {RoomPosition} pos
 * @param {number} [range=3]
 * @returns {RoomPosition|null}
 */
function findNearestOpenTile (pos, range) {
  const r = Math.min(range || 3, PATHFINDER_DEFAULTS.MAX_SEARCH_RANGE)
  const room = Game.rooms[pos.roomName]
  if (!room) return null

  const top = Math.max(1, pos.y - r)
  const left = Math.max(1, pos.x - r)
  const bottom = Math.min(48, pos.y + r)
  const right = Math.min(48, pos.x + r)

  // ⚡ PERFORMANCE & SECURITY: Use bulk lookAtArea to minimize engine API calls and mitigate CPU DoS.
  const lookData = room.lookAtArea(top, left, bottom, right, true)
  const blockedTiles = new Set()

  for (let i = 0; i < lookData.length; i++) {
    const item = lookData[i]
    if (item.type === 'structure' || item.type === 'creep') {
      blockedTiles.add(`${item.x},${item.y}`)
    }
  }

  const terrain = room.getTerrain()

  for (let dx = -r; dx <= r; dx++) {
    for (let dy = -r; dy <= r; dy++) {
      const x = pos.x + dx
      const y = pos.y + dy
      if (x < 1 || x > 48 || y < 1 || y > 48) continue

      if (terrain.get(x, y) === TERRAIN_MASK_WALL) continue
      if (blockedTiles.has(`${x},${y}`)) continue

      return new RoomPosition(x, y, pos.roomName)
    }
  }
  return null
}

/**
 * ルーム内の道路上のタイル一覧を返す
 * @param {Room} room
 * @returns {RoomPosition[]}
 */
function getRoadPositions (room) {
  const roads = cacheUtils.getStructures(room).filter((r) => r.structureType === STRUCTURE_ROAD)
  return roads.map((r) => r.pos)
}

// ============================================================
// 経路コスト評価
// ============================================================

/**
 * 2地点間の実際の歩数（道路考慮）を推定する
 * PathFinder を使って計算するため、CPU コストに注意
 * @param {RoomPosition} origin
 * @param {RoomPosition} goal
 * @returns {number} ステップ数、到達不可の場合は Infinity
 */
function estimateDistance (origin, goal) {
  const cache = ensureCache()

  // Security: Validate inputs
  if (!origin || !goal || !isSafeKey(origin.roomName) || !isSafeKey(goal.roomName)) {
    return Infinity
  }

  const key = `${PATH_CACHE_PREFIX}${origin.roomName}_${origin.x}_${origin.y}_${goal.roomName}_${goal.x}_${goal.y}`

  const cached = _getCacheEntry(cache, key)
  if (cached !== undefined) return cached

  const result = findPath(origin, goal)
  const dist = result.incomplete ? Infinity : result.path.length

  _setCacheEntry(cache, key, dist, CACHE_TTL.PATH)

  return dist
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
  isSafeKey
}
