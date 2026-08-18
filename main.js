// main.js should contain ONLY JavaScript code for Screeps

// Your game logic here - preserve all existing functions
// Example structure (replace with your actual code):

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

StructureSpawn.prototype.spawnRequiredCreeps =
StructureSpawn.prototype.spawnRequiredCreeps || function() {
    var body = [WORK, CARRY, MOVE];
    var name = 'Harvester' + Game.time;
    var memory = {role: 'harvester', home: this.room.name};
    
    if(Game.creeps.filter(c => c.memory.role === 'harvester').length < 2) {
        this.spawnCreep(body, name, memory);
    }
};

module.exports.loop = function() {
    // Your main game loop
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
};