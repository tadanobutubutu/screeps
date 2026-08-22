// Screeps main.js - Game loop
// REACT_015: This is a JavaScript game file, not HTML
// The lang="en" attribute applies to HTML documents, not JS files

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function() {
    // Clear memory of dead creeps
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Count existing creeps by role
    var harvesters = _.filter(Game.creeps, function(creep) {
        return creep.memory.role == 'harvester';
    });
    var upgraders = _.filter(Game.creeps, function(creep) {
        return creep.memory.role == 'upgrader';
    });
    var builders = _.filter(Game.creeps, function(creep) {
        return creep.memory.role == 'builder';
    });

    // Spawn harvesters (priority)
    if (harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            { memory: { role: 'harvester' } });
    }
    
    // Spawn upgraders
    else if (upgraders.length < 2) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            { memory: { role: 'upgrader' } });
    }
    
    // Spawn builders
    else if (builders.length < 1) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            { memory: { role: 'builder' } });
    }

    // Run role scripts for all creeps
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