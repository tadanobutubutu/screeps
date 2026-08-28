const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const structureTower = require('structure.tower');

module.exports = {
    roleHarvester,
    roleUpgrader,
    roleBuilder,
    structureTower
};

module.exports.loop = function () {
    console.log('Current game tick: ' + Game.time);

    // Clear dead creeps from memory
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Ensure we have minimum number of harvesters
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    if (harvesters.length < 2) {
        const newName = 'Harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'harvester' }
        });
    }

    // Ensure we have minimum number of upgraders
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    if (upgraders.length < 2) {
        const newName = 'Upgrader' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'upgrader' }
        });
    }

    // Ensure we have minimum number of builders
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    if (builders.length < 1) {
        const newName = 'Builder' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'builder' }
        });
    }

    // Run role functions for all creeps
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

    // Run tower defense
    const towers = _.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_TOWER);
    for (const tower of towers) {
        structureTower.run(tower);
    }
};