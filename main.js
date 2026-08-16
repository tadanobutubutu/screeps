// main.js - Screeps game loop entry point

// Game loop - called every tick
module.exports.loop = function() {
  // Clean up dead creeps' memory
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }
  
  // Your game logic here
  // For example:
  // - Spawn creeps
  // - Assign tasks
  // - Defend rooms
  // - Manage structures
};