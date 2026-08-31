// main.js - Screeps AI Main Loop
// This is the main game loop for the Screeps AI.

const ROLE_HARVESTER = 'harvester';
const ROLE_UPGRADER = 'upgrader';
const ROLE_BUILDER = 'builder';

// Memory utilities
function clearDeadCreepMemory() {
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}

// Spawning logic
function getSpawn() {
    return Object.values(Game.spawns)[0];
}

function countCreeps(role) {
    return _.filter(Game.creeps, (creep) => creep.memory.role === role).length;
}

function spawnCreep() {
    const spawn = getSpawn();
    if (!spawn || spawn.spawning) {
        return;
    }

    const body = [WORK, CARRY, MOVE];
    const options = { memory: { role: '' } };

    if (countCreeps(ROLE_HARVESTER) < 2) {
        options.memory.role = ROLE_HARVESTER;
        spawn.spawnCreep(body, 'Harvester' + Game.time, options);
    } else if (countCreeps(ROLE_UPGRADER) < 2) {
        options.memory.role = ROLE_UPGRADER;
        spawn.spawnCreep(body, 'Upgrader' + Game.time, options);
    } else if (countCreeps(ROLE_BUILDER) < 1) {
        options.memory.role = ROLE_BUILDER;
        spawn.spawnCreep(body, 'Builder' + Game.time, options);
    }
}

// Creep behavior
function runHarvester(creep) {
    if (creep.carry.energy < creep.carryCapacity) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (source) {
            creep.harvest(source);
        }
    } else {
        const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.energy < s.energyCapacity
        });
        if (target) {
            creep.transfer(target, RESOURCE_ENERGY);
        }
    }
}

function runUpgrader(creep) {
    if (creep.carry.energy === 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (source) {
            creep.harvest(source);
        }
    } else {
        if (creep.room.controller) {
            creep.upgradeController(creep.room.controller);
        }
    }
}

function runBuilder(creep) {
    if (creep.carry.energy === 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (source) {
            creep.harvest(source);
        }
    } else {
        const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target) {
            creep.build(target);
        } else {
            if (creep.room.controller) {
                creep.upgradeController(creep.room.controller);
            }
        }
    }
}

// Tower behavior
function runTowers() {
    const towers = _.filter(Game.structures, (s) => s.structureType === STRUCTURE_TOWER);
    for (const tower of towers) {
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }
}

// Main loop
module.exports.loop = function () {
    clearDeadCreepMemory();

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        switch (creep.memory.role) {
            case ROLE_HARVESTER:
                runHarvester(creep);
                break;
            case ROLE_UPGRADER:
                runUpgrader(creep);
                break;
            case ROLE_BUILDER:
                runBuilder(creep);
                break;
        }
    }

    runTowers();
    spawnCreep();
};