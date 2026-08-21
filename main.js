module.exports = {
  loop: function() {
    // Main game loop - runs every tick
    console.log("Screeps game running");
    
    // Clean up memory of dead creeps
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
    
    // Spawn creeps if needed
    const spawn = Object.values(Game.spawns)[0];
    if (spawn) {
      const creepCount = Object.values(Game.creeps).filter(c => c.room.name === spawn.room.name).length;
      if (creepCount < 5) {
        const name = `Creep${Game.time}`;
        spawn.spawnCreep([WORK, CARRY, MOVE], name);
      }
    }
    
    // Run all creeps
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      if (creep.carry.energy < creep.carryCapacity) {
        const sources = creep.room.find(FIND_SOURCES);
        if (sources.length > 0) {
          if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
          }
        }
      } else {
        if (spawn && creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(spawn);
        }
      }
    }
  }
};