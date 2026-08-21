// Main entry point for Screeps bot
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

module.exports = {
  loop: function() {
    // Clear memory of dead creeps
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }

    // Count existing roles
    const harvesters = _.filter(Game.creeps, creep => creep.memory.role === 'harvester');
    const upgraders = _.filter(Game.creeps, creep => creep.memory.role === 'upgrader');
    const builders = _.filter(Game.creeps, creep => creep.memory.role === 'builder');

    // Spawn harvesters if needed
    if (harvesters.length < 2) {
      const newName = 'Harvester' + Game.time;
      Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: { role: 'harvester' }
      });
    }

    // Spawn upgraders if needed
    if (upgraders.length < 2) {
      const newName = 'Upgrader' + Game.time;
      Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: { role: 'upgrader' }
      });
    }

    // Spawn builders if needed
    if (builders.length < 1) {
      const newName = 'Builder' + Game.time;
      Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: { role: 'builder' }
      });
    }

    // Run role logic for each creep
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      if (creep.memory.role === 'harvester') {
        roleHarvester.run(creep);
      } else if (creep.memory.role === 'upgrader') {
        roleUpgrader.run(creep);
      } else if (creep.memory.role === 'builder') {
        roleBuilder.run(creep);
      }
    }
  }
};