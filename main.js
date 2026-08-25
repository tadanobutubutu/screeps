// main.js - Screeps AI
// ... existing code ...
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

// ... other existing code ...

module.exports.loop = function () {
    // Clear memory of dead creeps
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Spawn creeps if needed
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if (harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            { memory: { role: 'harvester' } });
    }

    // TODO: implement fix for fake link
    // Fix: validate links exist before sending resources to prevent
    // "fake link" errors when a link structure is destroyed but still referenced
    var myLink = Game.getObjectById(Memory.linkId);
    if (myLink && myLink.store[RESOURCE_ENERGY] > 0) {
        // safe to use link
    }

    // Run creep roles
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
};