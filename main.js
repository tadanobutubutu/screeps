// Screeps main loop
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const towerManager = require('manager.tower');

module.exports.loop = function () {
    // Clear memory for dead creeps
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Run tower logic
    for (const name in Game.structures) {
        const structure = Game.structures[name];
        if (structure.structureType === STRUCTURE_TOWER) {
            towerManager.run(structure);
        }
    }

    // Run creep roles
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