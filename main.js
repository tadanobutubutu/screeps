var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function() {
    // Clean up dead creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Count harvesters
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, 
            {memory: {role: 'harvester'}});        
    }
    
    // Assign roles
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
    
    // Generate UI
    var ui = '<div style="position:fixed;top:10px;right:10px;background:#000;padding:10px;color:#fff;border-radius:5px;">';
    ui += '<p>Harvesters: ' + harvesters.length + '</p>';
    ui += '<button id="unrotate">rotate back</button>';
    ui += '</div>';
    
    return ui;
};