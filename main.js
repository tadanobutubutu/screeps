// Screeps Main Entry Point
module.exports = function() {
    // Your Screeps game code here
    // This file should NOT contain HTML markup - it's a JavaScript module
    
    // Example structure:
    var roleHarvester = require('role.harvester');
    var roleUpgrader = require('role.upgrader');
    
    Loop = function() {
        // Game loop logic
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role === 'harvester') {
                roleHarvester.run(creep);
            }
            if(creep.memory.role === 'upgrader') {
                roleUpgrader.run(creep);
            }
        }
    };
    
    return Loop;
}();