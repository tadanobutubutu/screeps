/**
 * Screeps Main Module
 * Main game loop and logic for the Screeps bot
 */

const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

module.exports.loop = function() {
    // Clear memory of dead creeps
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Count dependencies
    const dependencyCount = countDependencies();
    console.log('Dependency count: ' + dependencyCount);

    // Get counts of each role
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');

    // Spawn harvesters
    const spawn = Game.spawns['Spawn1'];
    if (harvesters.length < 2) {
        const newName = 'Harvester' + Game.time;
        spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'harvester' }
        });
    }

    // Spawn upgraders
    if (upgraders.length < 2) {
        const newName = 'Upgrader' + Game.time;
        spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'upgrader' }
        });
    }

    // Spawn builders
    if (builders.length < 2) {
        const newName = 'Builder' + Game.time;
        spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'builder' }
        });
    }

    // Run roles for each creep
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

    // Tower logic
    const towers = _.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_TOWER);
    for (let tower of towers) {
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }
};

// TODO: Implement a function to count dependencies
function countDependencies() {
    // Count required modules in this file
    const requiredModules = ['role.harvester', 'role.upgrader', 'role.builder'];
    
    // Track successfully loaded modules
    let loadedCount = 0;
    
    for (const moduleName of requiredModules) {
        try {
            require(moduleName);
            loadedCount++;
        } catch (e) {
            // Module not found or failed to load
        }
    }
    
    return loadedCount;
}