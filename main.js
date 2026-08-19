// Screeps Bot Main Entry Point
// Merge conflict resolved: HEAD contained a placeholder message, origin/main contained a React Dashboard component.
// The React component belongs in a frontend/dashboard repository, not the Screeps bot main.js.
// This file now contains a valid Screeps game loop structure.

/**
 * @param {Room} room
 * @returns {number}
 */
function countCreepsByRole(room, role) {
    return _.filter(Game.creeps, (creep) => creep.memory.role === role && creep.room.name === room.name).length;
}

/**
 * @param {StructureSpawn} spawn
 */
function runSpawn(spawn) {
    if (spawn.spawning) {
        return;
    }

    const room = spawn.room;
    const energyAvailable = room.energyAvailable;
    const energyCapacity = room.energyCapacityAvailable;

    // Role priorities and body compositions
    const roles = [
        { role: 'harvester', priority: 10, minCount: 2, body: [WORK, CARRY, MOVE], cost: 200 },
        { role: 'upgrader', priority: 8, minCount: 2, body: [WORK, CARRY, MOVE], cost: 200 },
        { role: 'builder', priority: 6, minCount: 1, body: [WORK, CARRY, MOVE], cost: 200 },
        { role: 'repairer', priority: 5, minCount: 1, body: [WORK, CARRY, MOVE], cost: 200 },
    ];

    for (const roleConfig of roles) {
        const currentCount = countCreepsByRole(room, roleConfig.role);
        if (currentCount < roleConfig.minCount && energyAvailable >= roleConfig.cost) {
            const newName = `${roleConfig.role}_${Game.time}`;
            const result = spawn.spawnCreep(roleConfig.body, newName, {
                memory: { role: roleConfig.role, working: false }
            });
            if (result === OK) {
                console.log(`Spawning new ${roleConfig.role}: ${newName}`);
                return;
            }
        }
    }
}

/**
 * @param {Creep} creep
 */
function runHarvester(creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false;
        creep.say('🔄 harvest');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
        creep.memory.working = true;
        creep.say('⚡ deliver');
    }

    if (creep.memory.working) {
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
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    } else {
        const sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
}

/**
 * @param {Creep} creep
 */
function runUpgrader(creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false;
        creep.say('🔄 harvest');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
        creep.memory.working = true;
        creep.say('⬆️ upgrade');
    }

    if (creep.memory.working) {
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    } else {
        const sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
}

/**
 * @param {Creep} creep
 */
function runBuilder(creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false;
        creep.say('🔄 harvest');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
        creep.memory.working = true;
        creep.say('🏗️ build');
    }

    if (creep.memory.working) {
        const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length > 0) {
            if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else {
            runUpgrader(creep);
        }
    } else {
        const sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
}

/**
 * @param {Creep} creep
 */
function runRepairer(creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false;
        creep.say('🔄 harvest');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
        creep.memory.working = true;
        creep.say('🔧 repair');
    }

    if (creep.memory.working) {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
        });
        targets.sort((a, b) => a.hits - b.hits);
        if (targets.length > 0) {
            if (creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else {
            runUpgrader(creep);
        }
    } else {
        const sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
}

/**
 * @param {Creep} creep
 */
function runCreep(creep) {
    switch (creep.memory.role) {
        case 'harvester':
            runHarvester(creep);
            break;
        case 'upgrader':
            runUpgrader(creep);
            break;
        case 'builder':
            runBuilder(creep);
            break;
        case 'repairer':
            runRepairer(creep);
            break;
        default:
            creep.say('❓ unknown role');
    }
}

/**
 * Main game loop
 */
module.exports.loop = function () {
    // Clean up memory for dead creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Run each spawn
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        runSpawn(spawn);
    }

    // Run each creep
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        runCreep(creep);
    }

    // Run towers
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });
        for (const tower of towers) {
            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            } else {
                const closestDamaged = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
                });
                if (closestDamaged) {
                    tower.repair(closestDamaged);
                }
            }
        }
    }
};