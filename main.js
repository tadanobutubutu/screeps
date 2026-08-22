// This is the main game loop for Screeps.
// You can use the internal console to view debug information.
// Press the Escape key while focused on the game to toggle the internal console.

// Memory cleanup
_.forEach(Memory.creeps, (creepMemory, creepName) => {
    if (!Game.creeps[creepName]) {
        delete Memory.creeps[creepName];
        console.log(`Cleaned up memory for non-existing creep: ${creepName}`);
    }
});

const roles = ['harvester', 'upgrader', 'builder', 'repairer'];

roles.forEach(role => {
    if (!Memory.stats) Memory.stats = {};
    if (!Memory.stats.rooms) Memory.stats.rooms = {};
    if (!Memory.stats.census) Memory.stats.census = {};
    
    const count = _.filter(Game.creeps, creep => creep.memory.role === role).length;
    Memory.stats.census[role] = count;
});

function getSpawnableBodyParts(baseEnergy) {
    const body = [];
    const costs = { work: 100, move: 50, carry: 50, attack: 100, ranged_attack: 150, heal: 250, tough: 10 };
    
    for (let i = 0; i < Math.floor(baseEnergy / 50); i++) {
        if (i % 3 === 0) body.push(work);
        else if (i % 3 === 1) body.push(move);
        else body.push(carry);
    }
    
    return body.slice(0, 20);
}

function spawnCreeps() {
    const availableSpawns = _.filter(Game.spawns, spawn => !spawn.spawning);
    
    if (availableSpawns.length === 0) return;
    
    roles.forEach(role => {
        const needed = 2;
        const current = Memory.stats.census[role] || 0;
        
        if (current < needed) {
            const spawn = availableSpawns[0];
            if (spawn) {
                const energyCapacity = spawn.room.energyCapacityAvailable;
                const body = getSpawnableBodyParts(energyCapacity);
                
                if (body.length > 0) {
                    const creepName = `${role}_${Game.time}`;
                    const memory = { role: role, working: false };
                    
                    const result = spawn.spawnCreep(body, creepName, { dryRun: true });
                    
                    if (result === OK) {
                        spawn.spawnCreep(body, creepName, { memory: memory });
                        console.log(`Spawning ${role}: ${creepName}`);
                    }
                }
            }
        }
    });
}

function handleCreep(creep) {
    const role = creep.memory.role;
    const target = creep.memory.target;
    
    switch(role) {
        case 'harvester':
            handleHarvester(creep);
            break;
        case 'upgrader':
            handleUpgrader(creep);
            break;
        case 'builder':
            handleBuilder(creep);
            break;
        case 'repairer':
            handleRepairer(creep);
            break;
        default:
            creep.moveTo(25, 25);
    }
}

function handleHarvester(creep) {
    if (creep.store.getFreeCapacity() > 0) {
        const sources = creep.room.find(FIND_SOURCES);
        if (sources.length > 0) {
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
    } else {
        const spawns = creep.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_SPAWN }
        });
        if (spawns.length > 0 && spawns[0].store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (creep.transfer(spawns[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(spawns[0]);
            }
        }
    }
}

function handleUpgrader(creep) {
    if (creep.store[RESOURCE_ENERGY] === 0) {
        const sources = creep.room.find(FIND_SOURCES);
        if (sources.length > 0) {
            const closest = creep.pos.findClosestByPath(sources);
            if (creep.harvest(closest) === ERR_NOT_IN_RANGE) {
                creep.moveTo(closest);
            }
        }
    } else {
        if (creep.room.controller) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
}

function handleBuilder(creep) {
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    
    if (targets.length === 0) {
        handleUpgrader(creep);
        return;
    }
    
    if (creep.store[RESOURCE_ENERGY] === 0) {
        const sources = creep.room.find(FIND_SOURCES);
        if (sources.length > 0) {
            const closest = creep.pos.findClosestByPath(sources);
            if (creep.harvest(closest) === ERR_NOT_IN_RANGE) {
                creep.moveTo(closest);
            }
        }
    } else {
        const target = creep.pos.findClosestByPath(targets);
        if (target) {
            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
}

function handleRepairer(creep) {
    if (creep.store[RESOURCE_ENERGY] === 0) {
        const sources = creep.room.find(FIND_SOURCES);
        if (sources.length > 0) {
            const closest = creep.pos.findClosestByPath(sources);
            if (creep.harvest(closest) === ERR_NOT_IN_RANGE) {
                creep.moveTo(closest);
            }
        }
    } else {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: structure => structure.hits < structure.hitsMax
        });
        
        if (targets.length > 0) {
            const target = creep.pos.findClosestByPath(targets);
            if (target) {
                if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }
}

function main() {
    spawnCreeps();
    
    _.forEach(Game.creeps, creep => {
        handleCreep(creep);
    });
}

module.exports.loop = function() {
    main();
};