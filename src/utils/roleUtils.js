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
    // ⚡ PERFORMANCE OPTIMIZATION: Single-pass indexed loop short-circuiting depleted sources
    // and using early exit on adjacent targets (dist <= 1) to avoid native engine binding marshalling.
    let bestSource = null
    let minDistance = Infinity
    const hasGetRangeTo = creep.pos && typeof creep.pos.getRangeTo === 'function'
    const hasFindClosest = creep.pos && typeof creep.pos.findClosestByRange === 'function'

    if (sources && sources.length > 0) {
      if (hasGetRangeTo) {
        for (let i = 0; i < sources.length; i++) {
          const s = sources[i]
          // ⚡ PERFORMANCE OPTIMIZATION: Skip depleted sources before distance calculation
          if (s.energy !== undefined && s.energy === 0) continue

          const dist = creep.pos.getRangeTo(s)
          if (dist < minDistance) {
            minDistance = dist
            bestSource = s
            if (dist <= 1) break
          }
        }
      } else if (hasFindClosest) {
        // Fallback for mock environment testing
        const activeSources = []
        for (let i = 0; i < sources.length; i++) {
          if (sources[i].energy === undefined || sources[i].energy > 0) {
            activeSources.push(sources[i])
          }
        }
        const candidates = activeSources.length > 0 ? activeSources : sources
        bestSource = creep.pos.findClosestByRange(candidates)
      }
    }

    source = bestSource
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
