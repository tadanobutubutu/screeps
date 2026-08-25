// Screeps main entry point
// This file is automatically loaded by the Screeps game engine.

module.exports.loop = function () {
    // Automatically delete memory of dead creeps
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Placeholders for role modules — extend as needed
    // const roleHarvester = require('role.harvester');
    // const roleUpgrader = require('role.upgrader');
    // const roleBuilder = require('role.builder');

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        // Add creep role logic here
        if (creep.memory.role === 'harvester') {
            // roleHarvester.run(creep);
        }
        if (creep.memory.role === 'upgrader') {
            // roleUpgrader.run(creep);
        }
        if (creep.memory.role === 'builder') {
            // roleBuilder.run(creep);
        }
    }
};