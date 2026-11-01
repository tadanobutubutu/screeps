const roleUtils = require('./src/utils/roleUtils')

// ⚡ PERFORMANCE: Hoisted constant path styles to reduce per-tick object allocation.
const PATH_STYLE_REPAIR = { visualizePathStyle: { stroke: '#ffff00' } }
const PATH_STYLE_UPGRADE = { visualizePathStyle: { stroke: '#ffffff' } }
const PATH_STYLE_HARVEST = { visualizePathStyle: { stroke: '#ffaa00' } }

function _updateState (creep) {
  if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.repairing = false
    creep.say('⚡ harvest')
  }
  if (!creep.memory.repairing && creep.store.getFreeCapacity() === 0) {
    creep.memory.repairing = true
    creep.say('🔧 repair')
  }
}

function _performRepair (creep) {
  // ⚡ PERFORMANCE: Use pre-filtered room-level repair targets.
  const targets = creep.room._repairTargets || []

  if (targets && targets.length > 0) {
    // ⚡ PERFORMANCE: Cache target ID to avoid redundant O(N) scans every tick
    let target = Game.getObjectById(creep.memory.repairTargetId)

    // If target is invalid or fully repaired, find a new one
    if (!target || target.hits === target.hitsMax) {
      // ⚡ PERFORMANCE: main.jsで計算済みの最優先修理ターゲットを使用 (O(1))
      target = creep.room._minHitsRepairTarget

      if (target) {
        creep.memory.repairTargetId = target.id
      } else {
        delete creep.memory.repairTargetId
      }
    }

    if (target && creep.repair(target) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target, PATH_STYLE_REPAIR)
    }
  } else {
    delete creep.memory.repairTargetId
    // 修理対象がない場合はアップグレード
    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller, PATH_STYLE_UPGRADE)
    }
  }
}

function _performHarvest (creep) {
  // エネルギーを採取
  // ⚡ PERFORMANCE: Use pre-warmed room cache for active sources.
  const sources = creep.room._activeSources || []

  if (sources.length > 0) {
    // ⚡ PERFORMANCE OPTIMIZATION: Use roleUtils.getHarvestTarget to leverage single-pass indexed
    // distance calculation and short-circuit depleted sources before distance evaluation.
    const target = roleUtils.getHarvestTarget(creep, sources)

    if (target) {
      if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, PATH_STYLE_HARVEST)
      }
    }
  }
}

const roleRepairer = {
  run: function (creep) {
    _updateState(creep)

    if (creep.memory.repairing) {
      _performRepair(creep)
    } else {
      _performHarvest(creep)
    }
  }
}

module.exports = roleRepairer
