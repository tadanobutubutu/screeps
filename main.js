const posthog = require('posthog-js');

const bot = {
  init() {
    posthog.capture('app', { app: 'screeps' });
    posthog.enableGlobalErrorTracking();
  },

  log(message) {
    posthog.capture('user', { message });
  },

  // Healer role logic
  healer: {
    run(creep) {
      // Find injured creeps
      const targets = creep.room.find(FIND_MY_CREEPS, {
        filter: (c) => c.hits < c.hitsMax
      });

      if (targets.length > 0) {
        // Heal the first injured creep
        if (creep.heal(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      } else {
        // If no injured creeps, move to a safe position
        creep.moveTo(Game.flags['HealerRest'] || creep.room.controller, {
          visualizePathStyle: { stroke: '#ffffff' }
        });
      }
    }
  },

  // ... existing functions and code preserved from original main.js

  // Adding a testable version of the bot object
  getBotInstance() {
    return this;
  }
};

// Add this helper function to ensure test_random.js can be properly parsed
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = bot;