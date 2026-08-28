// main.js
// Screeps bot entry point

import { Dashboard } from ...

/**
 * Screen reader accessibility support
 * Creates a visually hidden live region for screen reader announcements
 */
let accessibilityRegion = null;

/**
 * Initialize accessibility support by creating a live region for screen readers.
 * This allows game state changes to be announced to users with visual impairments.
 */
export function initAccessibility() {
    // Create a live region for screen reader announcements
    accessibilityRegion = document.createElement('div');
    accessibilityRegion.id = 'screeps-accessibility-live-region';
    accessibilityRegion.setAttribute('role', 'status');
    accessibilityRegion.setAttribute('aria-live', 'polite');
    accessibilityRegion.setAttribute('aria-atomic', 'true');
    
    // Visually hidden but accessible to screen readers
    Object.assign(accessibilityRegion.style, {
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0'
    });
    
    document.body.appendChild(accessibilityRegion);
}

/**
 * Announce a message to screen readers via the live region.
 * @param {string} message - The message to announce to screen readers.
 */
export function announceToScreenReader(message) {
    if (accessibilityRegion) {
        // Clear and set new message to ensure announcement
        accessibilityRegion.textContent = '';
        // Use setTimeout to ensure the DOM update is detected by screen readers
        setTimeout(() => {
            accessibilityRegion.textContent = message;
        }, 100);
    }
}

/**
 * Main game loop for the Screeps bot.
 * Runs every tick.
 */
export function loop() {
    // Initialize accessibility support on first run
    if (!accessibilityRegion) {
        initAccessibility();
    }

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
    const spawn = ...

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
    const energyCapacity = ...
    const body = energyCapacity >= 300 ? [WORK, CARRY, MOVE] : [WORK, MOVE];
    const role = ... ? 'harvester' : 'worker';

    if (!spawn.spawning && ... {
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
    const source = ...
    if (source) {
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }

    if (creep.store.getFreeCapacity() === 0) {
        const target = ... {
            filter: (s) => s.structureType === STRUCTURE_SPAWN &&
                           ... > 0
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
    let target = ... 1)[0];
    if (!target) {
        target = ... 1, {
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
    const source = ...
    if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
    }

    if (creep.store.getFreeCapacity() === 0 && creep.room.controller) {
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
}