// Screeps main.js entry point
// This file is the main entry point for your Screeps AI

module.exports.loop = function () {
    // Initialize memory if needed
    if (!Memory.creeps) {
        Memory.creeps = {};
    }
    
    // Clean up memory for dead creeps
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    // Run each creep
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        runCreep(creep);
    }
    
    // Spawn new creeps if needed
    manageSpawning();
};

function runCreep(creep) {
    // Basic creep logic - override with your own roles
    if (creep.memory.role === 'harvester') {
        runHarvester(creep);
    } else if (creep.memory.role === 'upgrader') {
        runUpgrader(creep);
    } else if (creep.memory.role === 'builder') {
        runBuilder(creep);
    } else {
        // Default behavior
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
}

function runHarvester(creep) {
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

function runUpgrader(creep) {
    if (creep.store[RESOURCE_ENERGY] === 0) {
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

function runBuilder(creep) {
    if (creep.store[RESOURCE_ENERGY] === 0) {
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
            // No construction sites, act as upgrader
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
}

function manageSpawning() {
    const spawns = Object.values(Game.spawns);
    for (const spawn of spawns) {
        if (spawn.spawning) {
            continue;
        }
        
        const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
        const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
        const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
        
        const energyAvailable = spawn.room.energyCapacityAvailable;
        const body = getBodyForEnergy(energyAvailable, 'worker');
        
        if (harvesters.length < 2) {
            spawnCreep(spawn, body, 'harvester');
        } else if (upgraders.length < 1) {
            spawnCreep(spawn, body, 'upgrader');
        } else if (builders.length < 1) {
            spawnCreep(spawn, body, 'builder');
        }
    }
}

function getBodyForEnergy(energy, role) {
    const parts = [];
    let remaining = energy;
    
    if (role === 'worker') {
        // Try to build balanced WORK/CARRY/MOVE
        while (remaining >= 200) { // 100 WORK + 50 CARRY + 50 MOVE
            if (remaining >= 100) parts.push(WORK);
            if (remaining >= 50) parts.push(CARRY);
            if (remaining >= 50) parts.push(MOVE);
            remaining -= 200;
        }
    }
    
    // Fallback
    if (parts.length === 0) {
        parts.push(WORK, CARRY, MOVE);
    }
    
    return parts;
}

function spawnCreep(spawn, body, role) {
    const name = `${role}_${Game.time}`;
    const result = spawn.spawnCreep(body, name, {
        memory: { role: role }
    });
    
    if (result === OK) {
        console.log(`Spawning new ${role}: ${name}`);
    }
}