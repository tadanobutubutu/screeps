'use strict'

const cache = require('./cache')
const pathfinder = require('./pathfinder')
const { MEMORY_KEYS } = require('../constants')

/**
 * Common storage energy retrieval logic
 * @param {Creep} creep
 * @param {Room} room
 * @param {number} minEnergy
 * @param {string} targetKey Memory key to store the target ID
 * @returns {boolean}
 */
function getEnergyFromStorage (creep, room, minEnergy = 500, targetKey = MEMORY_KEYS.TARGET_ID) {
  const storage = cache.getStorage(room)
  if (storage && storage.store[RESOURCE_ENERGY] >= minEnergy) {
    creep.memory[targetKey] = storage.id
    if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      pathfinder.moveTo(creep, storage, { range: 1 })
    }
    return true
  }
  return false
}



/**
 * Common source harvesting targeting logic
 * Finds a valid active source and caches its ID in creep memory.
 * @param {Creep} creep The creep trying to harvest.
 * @param {Array<Source>} sources The array of active sources to pick from.
 * @returns {Source|null} The chosen source, or null if none found.
 */
function getHarvestTarget (creep, sources) {
  let source = Game.getObjectById(creep.memory.harvestTargetId)

  if (!source || source.energy === 0) {
    source = creep.pos.findClosestByRange(sources)
    if (source) {
      creep.memory.harvestTargetId = source.id
    } else {
      delete creep.memory.harvestTargetId
    }
  }

  return source
}

module.exports = {
  getHarvestTarget,
  getEnergyFromStorage
}
