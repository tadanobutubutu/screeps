/**
 * src/roles/harvester.js
 * エネルギー採掘クリープ（Harvester）の制御モジュール
 *
 * ハーベスターはソースからエネルギーを採掘し、
 * スポーン・エクステンション・タワーなどにエネルギーを補充する。
 * コンテナやストレージが利用可能な場合はそちらを優先する。
 */

'use strict'

const cache = require('../utils/cache')
const pathfinder = require('../utils/pathfinder')
const logger = require('../utils/logger')
const { MEMORY_KEYS, ROLES } = require('../constants')

// ============================================================
// タスク定義
// ============================================================

const TASK = {
  HARVEST: 'harvest',
  DELIVER: 'deliver'
}

// ============================================================
// メイン制御
// ============================================================

/**
 * ハーベスタークリープのメインロジックを実行する
 * @param {Creep} creep
 */
function run (creep) {
  _updateWorkingState(creep)

  if (creep.memory[MEMORY_KEYS.WORKING]) {
    _deliver(creep)
  } else {
    _harvest(creep)
  }
}

// ============================================================
// 状態遷移
// ============================================================

/**
 * クリープのworking状態を更新する
 * - 空になったら採掘モードへ
 * - 満杯になったら納品モードへ
 * @param {Creep} creep
 */
function _updateWorkingState (creep) {
  const energy = creep.store[RESOURCE_ENERGY]
  const capacity = creep.store.getCapacity(RESOURCE_ENERGY)

  if (creep.memory[MEMORY_KEYS.WORKING] && energy === 0) {
    creep.memory[MEMORY_KEYS.WORKING] = false
    creep.say('🔄 採掘')
    // ソース割り当てをリセットして再割り当てを促す
    delete creep.memory[MEMORY_KEYS.SOURCE_ID]
  }

  if (!creep.memory[MEMORY_KEYS.WORKING] && energy === capacity) {
    creep.memory[MEMORY_KEYS.WORKING] = true
    creep.say('🚚 納品')
  }
}

// ============================================================
// 採掘ロジック
// ============================================================

/**
 * エネルギーソースから採掘する
 * 落下リソースがあれば優先的に回収する
 * @param {Creep} creep
 */
function _harvest (creep) {
  // 落下リソースの回収を優先
  const dropped = _findDroppedEnergy(creep)
  if (dropped && dropped.amount >= 50) {
    if (creep.pickup(dropped) === ERR_NOT_IN_RANGE) {
      pathfinder.moveTo(creep, dropped, { range: 1 })
    }
    return
  }

  // コンテナからのエネルギー回収を次に優先
  const container = _findAvailableContainer(creep)
  if (container && container.store[RESOURCE_ENERGY] >= 200) {
    if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      pathfinder.moveTo(creep, container, { range: 1 })
    }
    return
  }

  // ソースから直接採掘
  const source = cache.assignSource(creep, creep.room)
  if (!source) {
    logger.warn(`[${creep.name}] ソースが見つかりません`)
    return
  }

  const result = creep.harvest(source)
  if (result === ERR_NOT_IN_RANGE) {
    pathfinder.moveTo(creep, source, { range: 1 })
  } else if (result === ERR_NOT_ENOUGH_ENERGY) {
    // ソースが空 - 隣のソースを試す
    delete creep.memory[MEMORY_KEYS.SOURCE_ID]
  }
}

/**
 * 近くの落下エネルギーリソースを探す
 * @param {Creep} creep
 * @returns {Resource|null}
 */
function _findDroppedEnergy (creep) {
  const dropped = cache.getDroppedResources(creep.room)
  const energyDrops = dropped.filter((r) => r.resourceType === RESOURCE_ENERGY)
  if (energyDrops.length === 0) return null
  return pathfinder.closest(creep.pos, energyDrops)
}

/**
 * エネルギーが入ったコンテナを探す
 * @param {Creep} creep
 * @returns {StructureContainer|null}
 */
function _findAvailableContainer (creep) {
  const containers = cache.getContainers(creep.room)
  const available = containers.filter((c) => c.store[RESOURCE_ENERGY] >= 100)
  if (available.length === 0) return null
  return pathfinder.closest(creep.pos, available)
}

// ============================================================
// 納品ロジック
// ============================================================

/**
 * エネルギーを構造物に納品する
 * 優先順位: スポーン/エクステンション → タワー → コンテナ → ストレージ
 * @param {Creep} creep
 */
function _deliver (creep) {
  // 最優先: スポーン・エクステンションへの補充
  const target = _findEnergyTarget(creep)
  if (!target) {
    // 納品先がなければアップグレードを補助
    _upgradeAsBackup(creep)
    return
  }

  const result = creep.transfer(target, RESOURCE_ENERGY)
  if (result === ERR_NOT_IN_RANGE) {
    pathfinder.moveTo(creep, target, { range: 1 })
  } else if (result === ERR_FULL) {
    // 満杯なら次のターゲットを探す（キャッシュ無効化）
    cache.invalidate(`need_energy_${creep.room.name}`)
  }
}

/**
 * エネルギーを必要とする構造物を優先度順に探す
 * @param {Creep} creep
 * @returns {Structure|null}
 */
function _findEnergyTarget (creep) {
  const room = creep.room

  // 1. スポーン・エクステンション
  const spawnsAndExtensions = room.find(FIND_MY_STRUCTURES, {
    filter: (s) =>
      (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION) &&
            s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
  })

  if (spawnsAndExtensions.length > 0) {
    return pathfinder.closest(creep.pos, spawnsAndExtensions)
  }

  // 2. タワー
  const towers = room.find(FIND_MY_STRUCTURES, {
    filter: (s) =>
      s.structureType === STRUCTURE_TOWER && s.store.getFreeCapacity(RESOURCE_ENERGY) > 200
  })
  if (towers.length > 0) {
    return pathfinder.closest(creep.pos, towers)
  }

  // 3. コンテナ（空き容量がある場合）
  const containers = cache.getContainers(room)
  const emptyContainers = containers.filter(
    (c) => c.store.getFreeCapacity(RESOURCE_ENERGY) > 200
  )
  if (emptyContainers.length > 0) {
    return pathfinder.closest(creep.pos, emptyContainers)
  }

  // 4. ストレージ
  const storage = cache.getStorage(room)
  if (storage && storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    return storage
  }

  return null
}

/**
 * 納品先がない場合はコントローラーをアップグレードする（補助動作）
 * @param {Creep} creep
 */
function _upgradeAsBackup (creep) {
  const controller = creep.room.controller
  if (!controller) return

  const result = creep.upgradeController(controller)
  if (result === ERR_NOT_IN_RANGE) {
    pathfinder.moveTo(creep, controller, { range: 3 })
  }
}

// ============================================================
// ボディ生成
// ============================================================

/**
 * 利用可能エネルギーに応じた最適なボディを返す
 * @param {number} energy - 利用可能なエネルギー量
 * @returns {string[]} ボディパーツ配列
 */
function getBody (energy) {
  if (energy >= 750) {
    return [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
  }
  if (energy >= 500) {
    return [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
  }
  if (energy >= 300) {
    return [WORK, WORK, CARRY, MOVE]
  }
  return [WORK, CARRY, MOVE]
}

module.exports = { run, getBody, TASK, _findDroppedEnergy, _findAvailableContainer }
