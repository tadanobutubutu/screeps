'use strict';

// Screeps main module
// Main game loop entry point

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports = {
    loop: function () {
        // Clear memory for dead creeps
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }

        // Run logic for each creep
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];

            if (creep.memory.role === 'harvester') {
                roleHarvester.run(creep);
            }
            if (creep.memory.role === 'upgrader') {
                roleUpgrader.run(creep);
            }
            if (creep.memory.role === 'builder') {
                roleBuilder.run(creep);
            }
        }

        // Auto-spawn creeps if needed
        const spawn = Game.spawns['Spawn1'];
        if (spawn) {
            const harvesters = _.filter(
                Game.creeps,
                (creep) => creep.memory.role === 'harvester'
            );

            if (harvesters.length < 2) {
                if (spawn.store[RESOURCE_ENERGY] >= 200) {
                    spawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester' + Game.time, {
                        memory: { role: 'harvester' },
                    });
                }
            }
        }
    },
};