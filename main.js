// Main game loop for Screeps

const loop = () => {
  // Clean up dead creeps
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log(`Cleared non-existing creep memory: ${name}`);
    }
  }

  // Process each creep
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    
    if (creep.memory.role === 'harvester') {
      // Harvester logic
      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        const sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0]);
        }
      } else {
        const targets = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType === STRUCTURE_EXTENSION ||
              structure.structureType === STRUCTURE_SPAWN ||
              structure.structureType === STRUCTURE_TOWER) &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
          }
        });
        if (targets.length > 0) {
          if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
          }
        }
      }
    }
    
    if (creep.memory.role === 'upgrader') {
      // Upgrader logic
      if (creep.store[RESOURCE_ENERGY] === 0) {
        const sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0]);
        }
      } else {
        if (creep.room.controller) {
          if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
          }
        }
      }
    }
    
    if (creep.memory.role === 'builder') {
      // Builder logic
      if (creep.store[RESOURCE_ENERGY] === 0) {
        const sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0]);
        }
      } else {
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

module.exports = { loop };