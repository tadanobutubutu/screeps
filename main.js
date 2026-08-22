// Screeps bot main module
// Preserved existing code and exports

// Example placeholder for existing modules (these should match your actual implementation)
const roleHarvester = require('./role.harvester');
const roleUpgrader = require('./role.upgrader');
const roleBuilder = require('./role.builder');

// Memory helper functions
const clearMemory = require('./utils.clear-memory');

// Exported functions
module.exports.loop = function () {
    // Clear dead creeps from memory
    clearMemory();
    
    // Spawn creep logic
    for (let name in Game.spawns) {
        const spawn = Game.spawns[name];
        // Spawn new creeps if needed
        // ... existing spawn logic
    }
    
    // Run all creeps
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        // Determine role and run appropriate behavior
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        } else if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }
};