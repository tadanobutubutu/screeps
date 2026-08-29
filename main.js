// Main game loop for Screeps

// TODO: Add any other missing exports that might have been?
// Added missing exports as per the issue

module.exports = {
  loop: function() {
    // Main game loop logic
    console.log("Game tick running");
    
    // Clean up dead creeps from memory
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
    
    // Spawn creeps if needed
    if (Game.spawns['Spawn1'] && _.sum(Game.creeps).length < 10) {
      Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE]);
    }
    
    // Assign roles and run behavior
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      if (creep.memory.role === 'harvester') {
        // Harvester logic
        if (creep.store.getFreeCapacity() > 0) {
          const sources = creep.room.find(FIND_SOURCES);
          if (sources.length > 0) {
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
              creep.moveTo(sources[0]);
            }
          }
        } else {
          if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.spawns['Spawn1']);
          }
        }
      }
    }
  }
};