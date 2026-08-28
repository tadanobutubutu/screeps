// Screeps Main Bot File
// This is the main entry point for the Screeps bot

// Import role modules
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

// Main loop function
module.exports.loop = function() {
    // Clear memory of dead creeps
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Ensure we have enough harvesters
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    if (harvesters.length < 2) {
        const newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'harvester' }
        });
    }

    // Ensure we have enough upgraders
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    if (upgraders.length < 2) {
        const newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'upgrader' }
        });
    }

    // Ensure we have enough builders
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    if (builders.length < 1) {
        const newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'builder' }
        });
    }

    // Run role logic for all creeps
    for (let name in Game.creeps) {
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