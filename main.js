// ScreepsMain.js
// Screeps bot main loop and game logic

const roleHarvester = require('./roles/harvester');
const roleBuilder = require('./roles/builder');
const roleUpgrader = require('./roles/upgrader');
const roleScout = require('./roles/scout');

// Game state tracking
const Memory = require('./memory');

// Game constants and configuration
const CONFIG = {
    MAX_CREEPS: 20,
    HARVESTER_COUNT: 4,
    BUILDER_COUNT: 6,
    UPGRADER_COUNT: 4,
    SCOUT_COUNT: 2,
    MIN_ENERGY_FOR_SPAWN: 300,
    ROLE_PRIORITY: ['harvester', 'builder', 'upgrader', 'scout']
};

// Creep body generator
function generateBody(role, energy) {
    const bodies = {
        harvester: [WORK, CARRY, MOVE],
        builder: [WORK, CARRY, MOVE],
        upgrader: [WORK, CARRY, MOVE],
        scout: [MOVE, MOVE, MOVE]
    };
    
    return bodies[role] || [WORK, CARRY, MOVE];
}

// Room management functions
function manageRooms() {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (room.controller) {
            if (!Memory.rooms) Memory.rooms = {};
            if (!Memory.rooms[roomName]) {
                Memory.rooms[roomName] = {
                    harvestedSources: {},
                    buildingSites: []
                };
            }
        }
    }
}

// Main game loop
function main() {
    // Clear memory for dead creeps
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Update room memory
    manageRooms();

    // Spawn management
    const spawners = _.filter(Game.spawns, (spawn) => !spawn.spawning);
    
    for (const spawner of spawners) {
        const roomName = spawner.pos.roomName;
        const roomCreeps = _.filter(Game.creeps, (creep) => creep.pos.roomName === roomName);
        
        // Count creeps by role
        const roleCounts = {};
        CONFIG.ROLE_PRIORITY.forEach(role => {
            roleCounts[role] = _.filter(roomCreeps, (creep) => creep.memory.role === role).length;
        });

        // Spawn priorities
        let canSpawn = spawner.canCreateCreep(generateBody('harvester', spawner.room.energyCapacityAvailable)) === OK;
        
        for (const role of CONFIG.ROLE_PRIORITY) {
            const required = CONFIG[`${role.toUpperCase()}_COUNT`];
            if (roleCounts[role] < required && canSpawn) {
                const body = generateBody(role, spawner.room.energyAvailable);
                const newName = `${role}${Game.time}`;
                const result = spawner.createCreep(body, newName, { role: role });
                
                if (result === OK) {
                    console.log(`Spawned new ${role}: ${newName}`);
                    canSpawn = false;
                    break;
                }
            }
        }
    }

    // Run creep logic
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        const role = creep.memory.role;
        
        if (role === 'harvester') {
            roleHarvester.run(creep);
        } else if (role === 'builder') {
            roleBuilder.run(creep);
        } else if (role === 'upgrader') {
            roleUpgrader.run(creep);
        } else if (role === 'scout') {
            roleScout.run(creep);
        }
    }

    // Automatic room controller upgrading
    for (const name in Game.spawns) {
        const spawn = Game.spawns[name];
        if (spawn.controller && spawn.controller.ticksLeft > 20000) {
            spawn.room.controller.activateSafeMode();
        }
    }
}

module.exports.loop = main;