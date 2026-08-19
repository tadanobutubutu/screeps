// Main entry point for Screeps bot
// This file initializes the game loop and coordinates all subsystems

const { Game } = require('game');
const { RoleManager } = require('roles/roleManager');
const { RoomManager } = require('rooms/roomManager');
const { SpawnManager } = require('spawning/spawnManager');
const { MemoryManager } = require('memory/memoryManager');
const { Profiler } = require('utils/profiler');
const { Visualizer } = require('utils/visualizer');
const { Cache } = require('utils/cache');
const { CONFIG } = require('config/constants');

module.exports.loop = function () {
    const startCpu = Game.cpu.getUsed();
    
    try {
        // Initialize global utilities
        global.Cache = Cache;
        global.CONFIG = CONFIG;
        
        // Run profiler if enabled
        if (CONFIG.PROFILER_ENABLED) {
            Profiler.enable();
        }
        
        // Clean and validate memory
        MemoryManager.cleanup();
        MemoryManager.validate();
        
        // Process each room
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            if (!room.controller || !room.controller.my) continue;
            
            // Run room-level management
            RoomManager.run(room);
            
            // Handle spawning for this room
            SpawnManager.run(room);
            
            // Visualize room data if enabled
            if (CONFIG.VISUALS_ENABLED) {
                Visualizer.room(room);
            }
        }
        
        // Run global role management (creeps not assigned to specific rooms)
        RoleManager.runGlobal();
        
        // Handle inter-room operations
        handleInterRoomOperations();
        
        // Clean up dead creeps from memory
        MemoryManager.cleanupCreeps();
        
    } catch (error) {
        console.log(`[MAIN] Critical error: ${error.stack}`);
        Game.notify(`Bot crashed: ${error.message}`);
    }
    
    // Report CPU usage
    const elapsed = Game.cpu.getUsed() - startCpu;
    if (CONFIG.CPU_LOGGING && elapsed > CONFIG.CPU_WARNING_THRESHOLD) {
        console.log(`[CPU] Loop took ${elapsed.toFixed(2)} CPU (bucket: ${Game.cpu.bucket})`);
    }
    
    // Profiler report
    if (CONFIG.PROFILER_ENABLED && Game.time % CONFIG.PROFILER_REPORT_INTERVAL === 0) {
        Profiler.report();
    }
};

function handleInterRoomOperations() {
    // Handle remote mining operations
    for (const roomName in Memory.rooms) {
        const roomMem = Memory.rooms[roomName];
        if (roomMem.remoteSources) {
            for (const sourceInfo of roomMem.remoteSources) {
                // Remote mining logic handled by RoomManager
            }
        }
    }
    
    // Handle defense requests
    if (Memory.defenseRequests) {
        for (const request of Memory.defenseRequests) {
            if (Game.time > request.expires) continue;
            // Dispatch defenders
        }
    }
    
    // Handle market operations
    if (CONFIG.MARKET_ENABLED && Game.time % CONFIG.MARKET_CHECK_INTERVAL === 0) {
        require('economy/marketManager').run();
    }
}

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.log(`[UNCAUGHT] ${error.stack}`);
    Game.notify(`Uncaught exception: ${error.message}`);
});

// Export for testing
module.exports.handleInterRoomOperations = handleInterRoomOperations;