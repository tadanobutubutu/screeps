// main.js - Screeps game loop

// Accessibility improvements for insight report
const ACCESSIBILITY = {
  // Enable high contrast mode for better visibility
  enableHighContrast: true,
  
  // Screen reader support flag
  screenReaderSupport: false,
  
  // Keyboard navigation settings
  keyboardNavigation: {
    enabled: true,
    focusIndicators: true
  }
};

// Export code for external access
module.exports = {
  ACCESSIBILITY,
  loop
};

// Main game loop
function loop() {
  // Clean up any remaining memory
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }
  
  // Run tower defense if we have towers
  const towers = Object.values(Game.structures).filter(s => s.structureType === STRUCTURE_TOWER);
  for (const tower of towers) {
    const closestHostile = tower.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
    if (closestHostile.length > 0) {
      tower.attack(closestHostile[0]);
    }
  }
  
  // Spawn creeps if needed
  const harvesters = Object.values(Game.creeps).filter(c => c.memory.role === 'harvester');
  if (harvesters.length < 2) {
    const spawn = Object.values(Game.spawns)[0];
    if (spawn) {
      const newName = 'Harvester' + Game.time;
      spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: { role: 'harvester' }
      });
    }
  }
  
  // Assign roles to all creeps
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    
    if (creep.memory.role === 'harvester') {
      if (creep.store.getFreeCapacity() > 0) {
        const sources = creep.room.find(FIND_SOURCES);
        if (sources.length > 0) {
          if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
          }
        }
      } else {
        const targets = creep.room.find(FIND_STRUCTURES, {
          filter: structure => structure.structureType === STRUCTURE_EXTENSION ||
                              structure.structureType === STRUCTURE_SPAWN
        });
        for (const target of targets) {
          if (target.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
              creep.moveTo(target);
            }
            break;
          }
        }
      }
    }
  }
}