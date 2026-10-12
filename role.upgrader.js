// ⚡ PERFORMANCE: Hoisted constant path styles to reduce per-tick object allocation.
const roleUtils = require('./src/utils/roleUtils')
const PATH_STYLE_UPGRADE = { visualizePathStyle: { stroke: '#ffffff' } }
const PATH_STYLE_HARVEST = { visualizePathStyle: { stroke: '#ffaa00' } }

const roleUpgrader = {
  run: function (creep) {
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.upgrading = false
      creep.say('⚡ harvest')
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
      creep.memory.upgrading = true
      creep.say('⬆ upgrade')
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, PATH_STYLE_UPGRADE)
      }
    } else {
      // ⚡ PERFORMANCE: Use pre-warmed room cache for active sources.
      const sources = creep.room._activeSources || []

      if (sources.length > 0) {
        let source = roleUtils.getHarvestTarget(creep, sources)

        if (source) {
          if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, PATH_STYLE_HARVEST)
          }
        }
      }
    }
  }
}

module.exports = roleUpgrader
