// main.js
const roleHarvester = require('./role.harvester');
const roleUpgrader = require('./role.upgrader');
const roleBuilder = require('./role.builder');
const roleRepairer = require('./role.repairer');
const roleDefender = require('./role.defender');
const roleMiner = require('./role.miner');

// New autonomous efficiency role
const roleAutonomous = {
    run: function(creep) {
        // Autonomous behavior: prioritize tasks based on room needs
        if (creep.memory.working && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.working = false;
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
        }

        if (creep.memory.working) {
            // Prioritize tasks based on room needs
            const room = creep.room;
            const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
            const damagedStructures = room.find(FIND_STRUCTURES, {
                filter: structure => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL
            });

            // If there are construction sites, build them
            if (constructionSites.length > 0) {
                if (creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSites[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            // If there are damaged structures, repair them
            else if (damagedStructures.length > 0) {
                if (creep.repair(damagedStructures[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(damagedStructures[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            // Otherwise upgrade controller
            else {
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            // Find energy sources
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports.loop = function() {
    if (!Memory.lastCleanup || Game.time - Memory.lastCleanup > 1500) {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) { delete Memory.creeps[name]; }
        }
        Memory.lastCleanup = Game.time;
    }

    // Clear memory of dead creeps
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Run all creeps
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if (creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
        if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        // Add new autonomous role
        if (creep.memory.role == 'autonomous') {
            roleAutonomous.run(creep);
        }
    }

    // Spawn new creeps if needed
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    const repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    const defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    const miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    const autonomouses = _.filter(Game.creeps, (creep) => creep.memory.role == 'autonomous');

    // Spawn logic remains the same for other roles
    // ... (existing spawn logic)

    // Example spawn logic for autonomous creeps
    if (autonomouses.length < 2) {
        const newName = 'Autonomous' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {memory: {role: 'autonomous'}});
    }
};

// Preserve all existing exports
module.exports.roleHarvester = roleHarvester;
module.exports.roleUpgrader = roleUpgrader;
module.exports.roleBuilder = roleBuilder;
module.exports.roleRepairer = roleRepairer;
module.exports.roleDefender = roleDefender;
module.exports.roleMiner = roleMiner;
module.exports.roleAutonomous = roleAutonomous;