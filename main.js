// main.js - Screeps Bot Entry Point
// Merge conflict resolved: Both branches contained placeholder comments requesting actual content.
// This file now contains a minimal valid Screeps main loop structure.

module.exports.loop = function () {
    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Run each creep
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        } else if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }

    // Auto-spawn creeps if needed
    const spawn = Game.spawns['Spawn1'];
    if (spawn) {
        const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
        const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
        const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');

        if (harvesters.length < 2) {
            spawnCreep(spawn, 'harvester');
        } else if (upgraders.length < 1) {
            spawnCreep(spawn, 'upgrader');
        } else if (builders.length < 1) {
            spawnCreep(spawn, 'builder');
        }
    }
};

function spawnCreep(spawn, role) {
    const body = role === 'harvester' ? [WORK, CARRY, MOVE] :
                 role === 'upgrader' ? [WORK, CARRY, MOVE] :
                 [WORK, CARRY, MOVE];
    const name = `${role}_${Game.time}`;
    spawn.spawnCreep(body, name, { memory: { role } });
}

// Role modules (typically in separate files, included here for completeness)
const roleHarvester = {
    run(creep) {
        if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
};

const roleUpgrader = {
    run(creep) {
        if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};

const roleBuilder = {
    run(creep) {
        if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0) {
                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // No construction sites, help upgrade
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
};