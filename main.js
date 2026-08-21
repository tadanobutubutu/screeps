// main.js - Screeps game loop
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function() {
    // Clear memory of dead creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Count existing creeps by role
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');

    // Spawn harvesters if needed
    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'harvester'}});
    }

    // Spawn upgraders if needed
    if(upgraders.length < 2) {
        var newName = 'Upgrader' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'upgrader'}});
    }

    // Spawn builders if needed
    if(builders.length < 2) {
        var newName = 'Builder' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'builder'}});
    }

    // Run role scripts for all creeps
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        else if(creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if(creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }

    // Update the 'rotate back' link with a button
    if(document.getElementById('unrotate')) {
        var unrotateButton = document.getElementById('unrotate');
        unrotateButton.innerHTML = '<button onclick="rotateBack()">rotate back</button>';
        unrotateButton.removeAttribute('href');
    }
};

function rotateBack() {
    // Logic to rotate back
    console.log('Rotating back...');
}