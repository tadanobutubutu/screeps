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

/**
 * New function for REACT_025 (ensuring unique landmarks)
 * This function will check for unique landmarks in a room and handle duplicates.
 * @param {Room} room - The room to check.
 */
function ensureUniqueLandmarks(room) {
    const landmarks = room.find(FIND_MY_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_RAMPART || s.structureType === STRUCTURE_WALL
    });

    const uniqueLandmarks = new Set();
    landmarks.forEach((landmark) => {
        const landmarkId = `${landmark.pos.x},${landmark.pos.y}`;
        if (uniqueLandmarks.has(landmarkId)) {
            // Handle duplicate landmark, e.g., remove or merge
            // For the sake of this example, we'll just log a warning
            console.warn(`Duplicate landmark found at ${landmarkId}`);
        } else {
            uniqueLandmarks.add(landmarkId);
        }
    });
}

/**
 * New function for REACT_017 (adding landmark roles and fixing landmark issues)
 * This function will add landmark roles to ramparts and walls and fix any issues.
 * @param {Room} room - The room to update.
 */
function addLandmarkRolesAndFixIssues(room) {
    const ramparts = room.find(FIND_MY_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_RAMPART
    });

    ramparts.forEach((rampart) => {
        rampart.setRole('landmark');
    });

    const walls = room.find(FIND_MY_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_WALL
    });

    walls.forEach((wall) => {
        wall.setRole('landmark');
    });
}

/**
 * Add lang attribute to HTML element
 * This is a placeholder for the actual implementation, which would depend on the specific HTML structure.
 */
function addLangAttribute() {
    // Implementation would go here
}

/**
 * Add accessible names to 2 SVGs
 * This is a placeholder for the actual implementation, which would depend on the specific SVGs.
 */
function addAccessibleNamesToSVGs() {
    // Implementation would go here
}

/**
 * Fix 1 fake link issue
 * This is a placeholder for the actual implementation, which would depend on the specific issue.
 */
function fixFakeLinkIssue() {
    // Implementation would go here
}