// Screeps AI - Main Game Loop

// This file handles the core game logic for the Screeps bot.
// Accessibility note: The REACT_027 warnings about <th> scope attributes 
// do not apply to this Node.js game script file as there is no DOM/HTML table structure.

module.exports = {
  loop: function() {
    // Clean up memory of dead creeps
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
    
    // Spawn creeps if needed
    const creepCount = _.filter(Game.creeps).length;
    const maxCreeps = 10;
    
    if (creepCount < maxCreeps) {
      Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Worker' + Game.time);
    }
    
    // Manage tower defense
    const towers = _.filter(Game.structures, { structureType: STRUCTURE_TOWER });
    for (const tower of towers) {
      const closestHostile = tower.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
      if (closestHostile.length > 0) {
        tower.attack(closestHostile[0]);
      }
    }
  }
};