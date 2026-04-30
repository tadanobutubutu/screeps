/**
 * src/roles/builder.js
 * 建設クリープ（Builder）の制御モジュール
 *
 * ビルダーはエネルギーを取得して建設サイトに建設作業を行う。
 * 建設サイトがない場合は修復や、コントローラーアップグレードを補助する。
 * 建設の優先度: コンテナ → エクステンション → スポーン → ランパート → ロード → その他
 */

'use strict'

const cache = require('../utils/cache')
const pathfinder = require('../utils/pathfinder')
const logger = require('../utils/logger')
const { MEMORY_KEYS } = require('../constants')

// ============================================================
// 建設優先度（低い数値 = 高優先）
// ============================================================

const BUILD_PRIORITY = {
  [STRUCTURE_CONTAINER]: 1,
  [STRUCTURE_EXTENSION]: 2,
  [STRUCTURE_SPAWN]: 3,
  [STRUCTURE_TOWER]: 4,
  [STRUCTURE_STORAGE]: 5,
  [STRUCTURE_LINK]: 6,
  [STRUCTURE_ROAD]: 7,
  [STRUCTURE_RAMPART]: 8,
  [STRUCTURE_WALL]: 9
}

// ============================================================
// メイン制御
// ============================================================

/**
 * ビルダークリープのメインロジックを実行する
 * @param {Creep} creep
 */
function run (creep) {
  _updateWorkingState(creep)

  if (creep.memory[MEMORY_KEYS.WORKING]) {
    _build(creep)
  } else {
    _getEnergy(creep)
  }
}

// ============================================================
// 状態遷移
// ============================================================

/**
 * クリープのworking状態を更新する
 * @param {Creep} creep
 */
function _updateWorkingState (creep) {
  const energy = creep.store[RESOURCE_ENERGY]
  const capacity = creep.store.getCapacity(RESOURCE_ENERGY)

  if (creep.memory[MEMORY_KEYS.WORKING] && energy === 0) {
    creep.memory[MEMORY_KEYS.WORKING] = false
    creep.say('🔄 採掘')
    delete creep.memory[MEMORY_KEYS.TARGET_ID]
  }

  if (!creep.memory[MEMORY_KEYS.WORKING] && energy === capacity) {
    creep.memory[MEMORY_KEYS.WORKING] = true
    creep.say('🔨 建設')
  }
}

// ============================================================
// 建設ロジック
// ============================================================

/**
 * 建設サイトに建設作業を行う
 * @param {Creep} creep
 */
function _build (creep) {
  const site = _getTargetSite(creep)

  if (!site) {
    // 建設サイトがなければ修復を行う
    _repairAsBackup(creep)
    return
  }

  const result = creep.build(site)
  if (result === ERR_NOT_IN_RANGE) {
    pathfinder.moveTo(creep, site, { range: 3 })

    // 建設進捗をビジュアル表示
    const pct = site.progress / site.progressTotal
    creep.room.visual.text(`🔨 ${(pct * 100).toFixed(0)}%`, site.pos.x, site.pos.y - 1, {
      color: '#ffaa00',
      font: 0.5,
      align: 'center'
    })
  } else if (result === ERR_INVALID_TARGET) {
    // ターゲットが無効になった（完成済み等）
    delete creep.memory[MEMORY_KEYS.TARGET_ID]
    cache.invalidate(`construction_sites_${creep.room.name}`)
  }
}

/**
 * 優先度の高い建設サイトを返す
 * @param {Creep} creep
 * @returns {ConstructionSite|null}
 */
function _getTargetSite (creep) {
  // メモリに保存されたターゲットを優先的に使用
  if (creep.memory[MEMORY_KEYS.TARGET_ID]) {
    const saved = Game.getObjectById(creep.memory[MEMORY_KEYS.TARGET_ID])
    if (saved) {
      return saved
    }
    delete creep.memory[MEMORY_KEYS.TARGET_ID]
  }

  const sites = cache.getConstructionSites(creep.room)
  if (sites.length === 0) {
    return null
  }

  // 優先度でソートし、同優先度なら近い方を優先
  const sorted = sites.slice().sort((a, b) => {
    const pa = BUILD_PRIORITY[a.structureType] || 10
    const pb = BUILD_PRIORITY[b.structureType] || 10
    if (pa !== pb) {
      return pa - pb
    }
    return creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b)
  })

  const target = sorted[0]
  creep.memory[MEMORY_KEYS.TARGET_ID] = target.id
  return target
}

/**
 * 建設サイトがない場合に修復を行う（補助動作）
 * @param {Creep} creep
 */
function _repairAsBackup (creep) {
  const damaged = creep.room.find(FIND_STRUCTURES, {
    filter: (s) =>
      s.hits < s.hitsMax * 0.8 &&
            s.structureType !== STRUCTURE_WALL &&
            s.structureType !== STRUCTURE_RAMPART
  })

  if (damaged.length > 0) {
    const target = pathfinder.closest(creep.pos, damaged)
    const result = creep.repair(target)
    if (result === ERR_NOT_IN_RANGE) {
      pathfinder.moveTo(creep, target, { range: 3 })
    }
    creep.say('🔧 修復')
    return
  }

  // 修復対象もない場合はコントローラーをアップグレード
  const controller = creep.room.controller
  if (controller) {
    if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
      pathfinder.moveTo(creep, controller, { range: 3 })
    }
    creep.say('⬆️ 強化')
  }
}

// ============================================================
// エネルギー取得ロジック
// ============================================================

/**
 * エネルギーを取得する
 * @param {Creep} creep
 */
function _getEnergy (creep) {
  const room = creep.room

  // 落下リソースを優先回収
  const dropped = cache.getDroppedResources(room)
  const energyDrops = dropped.filter((r) => r.resourceType === RESOURCE_ENERGY && r.amount >= 50)
  if (energyDrops.length > 0) {
    const res = pathfinder.closest(creep.pos, energyDrops)
    if (creep.pickup(res) === ERR_NOT_IN_RANGE) {
      pathfinder.moveTo(creep, res, { range: 1 })
    }
    return
  }

  // コンテナから取得
  const containers = cache.getContainers(room)
  const available = containers.filter((c) => c.store[RESOURCE_ENERGY] >= 100)
  if (available.length > 0) {
    const container = pathfinder.closest(creep.pos, available)
    if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      pathfinder.moveTo(creep, container, { range: 1 })
    }
    return
  }

  // ストレージから取得
  const storage = cache.getStorage(room)
  if (storage && storage.store[RESOURCE_ENERGY] >= 500) {
    if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      pathfinder.moveTo(creep, storage, { range: 1 })
    }
    return
  }

  // ソースから直接採掘
  const source = cache.assignSource(creep, room)
  if (source) {
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      pathfinder.moveTo(creep, source, { range: 1 })
    }
  }
}

// ============================================================
// ボディ生成
// ============================================================

/**
 * 利用可能エネルギーに応じた最適なボディを返す
 * @param {number} energy
 * @returns {string[]}
 */
function getBody (energy) {
  if (energy >= 800) {
    return [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
  }
  if (energy >= 500) {
    return [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
  }
  if (energy >= 350) {
    return [WORK, CARRY, CARRY, MOVE, MOVE]
  }
  return [WORK, CARRY, MOVE]
}

// ============================================================
// ユーティリティ
// ============================================================

/**
 * ルーム内に建設サイトが存在するか確認する
 * @param {Room} room
 * @returns {boolean}
 */
function hasBuildSites (room) {
  return cache.getConstructionSites(room).length > 0
}

/**
 * ルーム内のすべての建設サイトの合計建設量を返す
 * @param {Room} room
 * @returns {number}
 */
function getTotalBuildProgress (room) {
  const sites = cache.getConstructionSites(room)
  return sites.reduce((acc, s) => acc + (s.progressTotal - s.progress), 0)
}

module.exports = { run, getBody, hasBuildSites, getTotalBuildProgress, BUILD_PRIORITY }
