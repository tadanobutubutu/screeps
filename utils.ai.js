const utilsMemory = require('./utils.memory')

// ⚡ PERFORMANCE: Per-tick guard to avoid redundant initialization checks
let _initTick = -1

// ⚡ PERFORMANCE: Hoisted configuration objects to reduce per-call allocation
const AI_DEFAULTS = {
  phase: 'expansion',
  priority: 'energy'
}

const CREEP_SUGGESTIONS = {
  early_game: { harvester: 5, upgrader: 2, builder: 1, repairer: 0 },
  farming: { harvester: 6, upgrader: 1, builder: 1, repairer: 0 },
  expansion: { harvester: 4, upgrader: 2, builder: 2, repairer: 1 },
  building: { harvester: 3, upgrader: 1, builder: 3, repairer: 1 },
  growth: { harvester: 2, upgrader: 4, builder: 1, repairer: 1 },
  defense: { harvester: 1, upgrader: 0, builder: 0, repairer: 0 },
  endgame: { harvester: 1, upgrader: 2, builder: 1, repairer: 1 },
  optimization: { harvester: 1, upgrader: 1, builder: 1, repairer: 1 }
}

const MAX_STRUCTURES = {
  1: 0,
  2: 5,
  3: 10,
  4: 20,
  5: 30,
  6: 40,
  7: 50,
  8: 60
}

const AIHelper = {
  /**
     * Security: Safely initialize and validate AI state.
     * Prevents NaN propagation and DoS from corrupted memory.
     */
  initMemory () {
    if (typeof Game !== 'undefined' && Game.time === _initTick && Memory.aiState) {
      return
    }
    _initTick = typeof Game !== 'undefined' ? Game.time : -1

    if (!Memory.aiState) {
      Memory.aiState = {}
    }

    const keys = Object.keys(AI_DEFAULTS)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (!Memory.aiState[key] || !utilsMemory.isSafeKey(Memory.aiState[key])) {
        Memory.aiState[key] = AI_DEFAULTS[key]
      } else if (typeof Memory.aiState[key] === 'string') {
        // Security: Limit string length to avoid Memory DoS
        Memory.aiState[key] = Memory.aiState[key].substring(0, 100)
      }
    }
  },

  getAIDecision (room) {
    this.initMemory()

    // ⚡ PERFORMANCE: Use pre-warmed room caches if available, otherwise fallback to engine find.
    const hostiles = room._hostileCreeps || room.find(FIND_HOSTILE_CREEPS)

    if (hostiles.length > 0) {
      return { phase: 'defense', priority: 'survival' }
    }

    const rcl = room.controller ? room.controller.level : 0
    const energyRatio =
            room.energyCapacityAvailable > 0
              ? room.energyAvailable / room.energyCapacityAvailable
              : 0
    const constructionSites = room._myConstructionSites || room.find(FIND_CONSTRUCTION_SITES)

    if (rcl < 3) {
      return { phase: 'early_game', priority: 'expansion' }
    }

    if (energyRatio < 0.5) {
      return { phase: 'farming', priority: 'energy' }
    }

    if (constructionSites.length > 5) {
      return { phase: 'building', priority: 'construction' }
    }

    if (rcl < 8) {
      return { phase: 'growth', priority: 'upgrade' }
    }

    return { phase: 'endgame', priority: 'optimization' }
  },

  suggestCreepCount (room) {
    const decision = this.getAIDecision(room)

    // Security: Use hasOwnProperty and isSafeKey to prevent Prototype Pollution
    const phase = decision.phase
    if (
      utilsMemory.isSafeKey(phase) &&
            Object.prototype.hasOwnProperty.call(CREEP_SUGGESTIONS, phase)
    ) {
      return CREEP_SUGGESTIONS[phase]
    }

    return CREEP_SUGGESTIONS.expansion
  },

  shouldBuildStructure (room) {
    const decision = this.getAIDecision(room)

    if (decision.phase === 'defense') {
      return false
    }
    if (decision.phase === 'early_game') {
      return false
    }

    // ⚡ PERFORMANCE: Use pre-warmed room caches if available, otherwise fallback to engine find.
    const structures = room._myStructures || room.find(FIND_MY_STRUCTURES)
    const structureCount = structures.length
    const rcl = room.controller ? room.controller.level : 0

    // Security: Use hasOwnProperty and isSafeKey for dynamic lookup
    if (
      utilsMemory.isSafeKey(rcl) &&
            Object.prototype.hasOwnProperty.call(MAX_STRUCTURES, rcl)
    ) {
      return structureCount < MAX_STRUCTURES[rcl]
    }

    return false
  }
}

module.exports = AIHelper
