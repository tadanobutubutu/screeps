// Main game loop for Screeps
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

module.exports.loop = function() {
    // Clear memory of dead creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // If no spawners, stop
    if(Object.keys(Game.spawns).length === 0) {
        console.log('No spawns available');
        return;
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role === 'repairer');

    console.log('Harvesters: ' + harvesters.length + ', Upgraders: ' + upgraders.length + 
                ', Builders: ' + builders.length + ', Repairers: ' + repairers.length);

    // Spawn harvesters first
    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'harvester'}});
    }
    // Then spawn upgraders
    else if(upgraders.length < 2) {
        var newName = 'Upgrader' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'upgrader'}});
    }
    // Then spawn builders
    else if(builders.length < 2) {
        var newName = 'Builder' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'builder'}});
    }
    // Finally spawn repairers
    else if(repairers.length < 1) {
        var newName = 'Repairer' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'repairer'}});
    }

    // Display spawning status
    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️ ' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    // Run roles
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
        else if(creep.memory.role === 'repairer') {
            roleRepairer.run(creep);
        }
    }
    
    // Note: 'rotate back' is an in-page UI action, not navigation
    // If this were client-side code, it should be a <button> instead of <a href="#">
};