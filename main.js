const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

module.exports = {
    loop: function() {
        // Clear memory of dead creeps
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }

        // ... Existing loop implementation (game logic, spawning creeps, running roles) ...
        
        // Run creep roles
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
    }
};