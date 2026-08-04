// Screeps main.js - Entry point for the game loop

\n    if (!Memory.lastCleanup || Game.time - Memory.lastCleanup > 1500) {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) { delete Memory.creeps[name]; }
        }
        Memory.lastCleanup = Game.time;
    }

  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    const creeps = room.find(FIND_MY_CREEPS);

    for (const creep of creeps) {
      if (creep.spawning) {
        continue;
      }

      if (creep.store.getFreeCapacity() > 0) {
        const sources = room.find(FIND_SOURCES_ACTIVE);
        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      } else {
        const targets = room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              structure.structureType === STRUCTURE_EXTENSION ||
              structure.structureType === STRUCTURE_SPAWN ||
              structure.structureType === STRUCTURE_TOWER
            ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
          },
        });
        if (targets.length > 0) {
          if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
          }
        } else {
          const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
          if (constructionSites.length > 0) {
            if (creep.build(constructionSites[0]) === ERR_NOT_IN_RANGE) {
              creep.moveTo(constructionSites[0], { visualizePathStyle: { stroke: '#00ff00' } });
            }
          } else {
            const repairTargets = room.find(FIND_STRUCTURES, {
              filter: (s) => s.hits < s.hitsMax,
            });
            if (repairTargets.length > 0) {
              if (creep.repair(repairTargets[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(repairTargets[0], { visualizePathStyle: { stroke: '#0000ff' } });
              }
            }
          }
        }
      }
    }
  }
  // New function added as per the issue requirements
  function checkForNewDependency() {
    // Example function that checks for a new dependency or condition
    // This is just a placeholder and should be replaced with the actual logic
    if (Game.cpu.getUsed() < 1000) {
      // Add the logic to check for new dependencies here
    }
  }
  checkForNewDependency();
};