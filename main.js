// Game constants
const roles = {
    builder: require('roles/builder'),
    guard: require('roles/guard'),
    harvester: require('roles/harvester'),
    upgrader: require('roles/upgrader'),
    scout: require('roles/scout')
};

const managers = {
    spawn: require('managers/spawnManager'),
    tower: require('managers/towerManager'),
    room: require('managers/roomManager')
};

const constants = require('constants');

// Initialize game
function initialize() {
    // Initialize managers
    managers.spawn.initialize();
    managers.tower.initialize();
    managers.room.initialize();
    
    // Other initialization logic
}

// Main game loop
function mainLoop() {
    // Process each room
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        
        // Spawn creeps if needed
        managers.spawn.process(roomName);
        
        // Manage towers
        managers.tower.process(roomName);
        
        // Manage room activities
        managers.room.process(roomName);
    }
    
    // Clean up dead creeps
    cleanupCreeps();
}

// Cleanup function for dead creeps
function cleanupCreeps() {
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}

// Export functions
module.exports = {
    initialize,
    mainLoop,
    cleanupCreeps,
    roles,
    managers,
    constants
};