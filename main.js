// main.js
// Screeps bot entry point

import { Dashboard } from './components/Dashboard';

/**
 * Main game loop for the Screeps bot.
 * Runs every tick.
 */
export function loop() {
    // Handle room-level operations
    handleRooms();

    // Render dashboard UI (if available)
    if (Dashboard) {
        Dashboard.render();
    }
}

/**
 * Process each room controlled by the player.
 */
function handleRooms() {
    const username = Game.me ? Game.me.username : '';

    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];

        if (room.controller && room.controller.my) {
            handleRoomLogic(room);
        }
    }
}

/**
 * Execute room-level logic: spawn management, creeps, construction, etc.
 * @param {Room} room - The room to process.
 */
function handleRoomLogic(room) {
    const roomName = room.roomName;
    const spawn = room.find(FIND_MY_SPAWNS)[0];

    // Spawn creeps based on roles
    if (spawn && spawn.isActive()) {
        manageSpawning(room, spawn);
    }

    // Run all creep logic
    runCreeps(roomName);
}

/**
 * Manage creep spawning based on room needs.
 * @param {Room} room - The room to spawn in.
 * @param {StructureSpawn} spawn - The spawn structure.
 */
function manageSpawning(room, spawn) {
    const energyCapacity = room.energyCapacityAvailable;
    const body = energyCapacity >= 300 ? [WORK, CARRY, MOVE] : [WORK, MOVE];
    const role = body.includes(CARRY) ? 'harvester' : 'worker';

    if (!spawn.spawning && room.find(FIND_CREEPS, {
        filter: (c) => c.memory.role === role
    }).length < 3) {
        spawn.spawnCreep(body, `${role}_${Game.time}`, {
            memory: { role: role }
        });
    }
}

/**
 * Run all creeps assigned to a given room.
 * @param {string} roomName - Name of the room.
 */
function runCreeps(roomName) {
    const creep = Game.creeps[roomName];
    if (creep && creep.my) {
        runCreep(creep);
    }
}

/**
 * Run individual creep logic.
 * @param {Creep} creep - The creep to run.
 */
function runCreep(creep) {
    const role = creep.memory.role;
    switch (role) {
        case 'harvester':
            runHarvester(creep);
            break;
        case 'builder':
            runBuilder(creep);
            break;
        default:
            runWorker(creep);
    }
}

/**
 * Harvester: collects and transfers energy.
 * @param {Creep} creep
 */
function runHarvester(creep) {
    const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    if (source) {
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }

    if (creep.store.getFreeCapacity() === 0) {
        const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_SPAWN &&
                           s.store.getFreeCapacity(ENERGY) > 0
        });
        if (target) {
            if (creep.transfer(target, ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
}

/**
 * Builder: repairs structures and builds construction sites.
 * @param {Creep} creep
 */
function runBuilder(creep) {
    let target = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 1)[0];
    if (!target) {
        target = creep.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (s) => s.hits < s.hitsMax
        })[0];
    }

    if (target) {
        if (creep.build && target.structureType === STRUCTURE_CONSTRUCTION_SITE) {
            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
}

/**
 * Default worker: harvests and upgrades controller.
 * @param {Creep} creep
 */
function runWorker(creep) {
    const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
    }

    if (creep.store.getFreeCapacity() === 0 && creep.room.controller) {
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
}