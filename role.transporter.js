// ⚡ PERFORMANCE: Hoisted constant path styles to reduce per-tick object allocation.
const PATH_STYLE_DELIVER = { visualizePathStyle: { stroke: '#00ffff' } }
const PATH_STYLE_WITHDRAW = { visualizePathStyle: { stroke: '#ffff00' } }

const roleTransporter = {
  run: function (creep) {
    creep.say('🚚')

    this._updateState(creep)

    if (creep.memory.transporting) {
      this._deliverEnergy(creep)
    } else {
      this._withdrawEnergy(creep)
    }
  },

  _updateState: function (creep) {
    if (creep.memory.transporting && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.transporting = false
    }
    if (!creep.memory.transporting && creep.store.getFreeCapacity() === 0) {
      creep.memory.transporting = true
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

    if (typeof creep.pos.findClosestByRange === 'function') {
      return creep.pos.findClosestByRange(targets)
    }
    return targets[0] || null
  },

  _deliverEnergy: function (creep) {
    // ⚡ PERFORMANCE: Use pre-filtered room-level delivery targets.
    const targets = creep.room._deliveryTargets || []

    if (targets && targets.length > 0) {
      // ⚡ PERFORMANCE: ターゲットIDをキャッシュして毎ティックの再探索を回避
      let target = Game.getObjectById(creep.memory.deliveryTargetId)

      // ⚡ PERFORMANCE: O(1) check for delivery target validity instead of O(N) .some()
      if (!target || target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        target = this._findClosestTarget(creep, targets)
        if (target) {
          creep.memory.deliveryTargetId = target.id
        } else {
          delete creep.memory.deliveryTargetId
        }
      }

      if (target) {
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, PATH_STYLE_DELIVER)
        }
      }
    } else {
      delete creep.memory.deliveryTargetId
    }
  },

  _withdrawEnergy: function (creep) {
    // ⚡ PERFORMANCE: Use pre-calculated withdrawal sources cache from main.js
    const sources = creep.room._withdrawalSources || []

    if (sources.length > 0) {
      // ⚡ PERFORMANCE: ターゲットIDをキャッシュ
      let target = Game.getObjectById(creep.memory.withdrawalTargetId)

      // ⚡ PERFORMANCE: O(1) check for withdrawal target validity instead of O(N) .some()
      if (!target || target.store[RESOURCE_ENERGY] === 0) {
        target = this._findClosestTarget(creep, sources)
        if (target) {
          creep.memory.withdrawalTargetId = target.id
        } else {
          delete creep.memory.withdrawalTargetId
        }
      }

      if (target) {
        if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, PATH_STYLE_WITHDRAW)
        }
      }
    } else {
      delete creep.memory.withdrawalTargetId
    }
  }
}

module.exports = roleTransporter
