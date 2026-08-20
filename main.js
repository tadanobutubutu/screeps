// Screeps main.js
// Main entry point for the Screeps AI

module.exports = {
  loop: function() {
    // Game loop logic
    const creep = Object.values(Game.creeps)[0];
    if (creep) {
      // Basic behavior
      if (creep.memory.role === 'harvester') {
        const sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0]);
        }
      } else if (creep.memory.role === 'builder') {
        const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
          if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
          }
        }
      }
    }
  }
};