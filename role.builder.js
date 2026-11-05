const roleUtils = require('./src/utils/roleUtils')

// ⚡ PERFORMANCE: Hoisted constant path styles to reduce per-tick object allocation.
const PATH_STYLE_UPGRADE = { visualizePathStyle: { stroke: '#ffffff' } }
const PATH_STYLE_BUILD = { visualizePathStyle: { stroke: '#0000ff' } }
const PATH_STYLE_HARVEST = { visualizePathStyle: { stroke: '#ffaa00' } }

const roleBuilder = {
  run: function (creep) {
    this._updateState(creep)

    if (creep.memory.building) {
      this._buildOrUpgrade(creep)
    } else {
      this._harvestEnergy(creep)
    }
  },

  _updateState: function (creep) {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.building = false
      creep.say('⚡ harvest')
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
      creep.memory.building = true
      creep.say('🛠 build')
    }
  },

  _buildOrUpgrade: function (creep) {
    // 建設サイトを探す
    // ⚡ PERFORMANCE: Use pre-warmed room cache for construction sites.
    const targets = creep.room._myConstructionSites || []

    if (targets.length > 0) {
      this._buildTarget(creep, targets)
    } else {
      delete creep.memory.buildTargetId
      // 建設サイトがなければアップグレードモードに
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, PATH_STYLE_UPGRADE)
      }
    }
  },

  /**
     * ⚡ PERFORMANCE OPTIMIZATION: Finds closest target using single-pass indexed for loop
     * with early exit on adjacent targets (dist <= 1), bypassing engine marshalling overhead.
     * Checks `dist >= 0` to filter Screeps API error codes.
     * @param {Creep} creep
     * @param {Array} targets
     * @returns {Object|null}
     */
  _findClosestTarget: function (creep, targets) {
    if (!targets || targets.length === 0) return null

    const hasGetRangeTo = creep.pos && typeof creep.pos.getRangeTo === 'function'
    if (hasGetRangeTo) {
      let closest = null
      let minDist = Infinity
      for (let i = 0; i < targets.length; i++) {
        const t = targets[i]
        if (!t) continue
        const dist = creep.pos.getRangeTo(t)
        if (typeof dist === 'number' && dist >= 0 && dist < minDist) {
          minDist = dist
          closest = t
          if (dist <= 1) break
        }
      }
      if (closest) return closest
    }

    if (creep.pos && typeof creep.pos.findClosestByRange === 'function') {
      return creep.pos.findClosestByRange(targets)
    }
    return targets[0] || null
  },

  _buildTarget: function (creep, targets) {
    // ⚡ PERFORMANCE: Cache target ID to avoid re-searching every tick
    let target = Game.getObjectById(creep.memory.buildTargetId)

    // If target is invalid or no longer exists in construction sites, find a new one
    // ⚡ PERFORMANCE: O(1) check for construction site validity instead of O(N) .some()
    if (target === undefined || target === null) {
      // ⚡ PERFORMANCE: Use single-pass indexed search with early exit on dist <= 1
      target = this._findClosestTarget(creep, targets)
      if (target) {
        creep.memory.buildTargetId = target.id
      } else {
        delete creep.memory.buildTargetId
      }
    }

    if (target && creep.build(target) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target, PATH_STYLE_BUILD)
    }
  },

  _harvestEnergy: function (creep) {
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
}

module.exports = roleBuilder
