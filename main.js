// Screeps Bot Main Configuration
// This module exports the main game logic for the Screeps AI

const moduleA = require('./modules/moduleA')
const moduleB = require('./modules/moduleB')

/**
 * Main compilation function for Screeps bot
 * @param {Object} noCompile - Flag to skip compilation (for testing)
 * @returns {Object} - Compiled modules
 */
module.exports.loop = function (noCompile) {
  if (noCompile) {
    return
  }

  // Initialize memory if needed
  if (!Memory) {
    Memory = {}
  }

  // Deallocate unused memory
  for (const name in Memory.rooms) {
    if (!Game.rooms[name]) {
      delete Memory.rooms[name]
    }
  }

  // Execute module logic
  moduleA.run()
  moduleB.run()
}

// Export configuration settings
module.exports.settings = {
  maxSpawns: 3,
  defaultBody: [WORK, CARRY, MOVE],
  upgradeThreshold: 100
}

// Export helper functions
module.exports.helpers = {
  getRoomFromName: function (name) {
    return Game.rooms[name] || Game.shards[0].rooms[name]
  },

  log: function (message) {
    if (module.exports.settings.debug) {
      console.log(message)
    }
  }
}
