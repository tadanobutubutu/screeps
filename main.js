// Screeps AI - Main Entry Point
// This file contains the main logic for your Screeps AI

const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

module.exports.loop = function() {
    // Clear dead creeps from memory
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Count available energy and spawn creeps
    const energyAvailable = Game.spawns['Spawn1'].energy;
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');

    // Spawn logic
    if (harvesters.length < 2) {
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Harvester' + Game.time, {
            memory: { role: 'harvester' }
        });
    } else if (upgraders.length < 2) {
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Upgrader' + Game.time, {
            memory: { role: 'upgrader' }
        });
    } else if (builders.length < 2) {
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Builder' + Game.time, {
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
};