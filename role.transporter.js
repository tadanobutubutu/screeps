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

  _deliverEnergy: function (creep) {
    // ⚡ PERFORMANCE: Use pre-filtered room-level delivery targets.
    const targets = creep.room._deliveryTargets || []

    if (targets && targets.length > 0) {
      // ⚡ PERFORMANCE: ターゲットIDをキャッシュして毎ティックの再探索を回避
      let target = Game.getObjectById(creep.memory.deliveryTargetId)

      // ⚡ PERFORMANCE: O(1) check for delivery target validity instead of O(N) .some()
      if (!target || target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        target = creep.pos.findClosestByRange(targets)
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
        target = creep.pos.findClosestByRange(sources)
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
