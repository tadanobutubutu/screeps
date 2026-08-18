// main.js - Screeps Bot Entry Point

// Initialize global prototypes and constants
require('prototypes');
require('constants');

// Import core managers
const spawnManager = require('manager.spawner');
const creepManager = require('manager.creep');
const towerManager = require('manager.tower');
const roomManager = require('manager.room');
const resourceManager = require('manager.resource');
const defenseManager = require('manager.defense');
const visualManager = require('manager.visual');
const statsManager = require('manager.stats');

// Main game loop
module.exports.loop = function () {
    // Initialize memory structures if needed
    if (!Memory.rooms) Memory.rooms = {};
    if (!Memory.creeps) Memory.creeps = {};
    if (!Memory.spawns) Memory.spawns = {};
    if (!Memory.stats) Memory.stats = {};

    // Clean up memory for dead creeps
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Run room-level management
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (room.controller && room.controller.my) {
            roomManager.run(room);
        }
    }

    // Run spawn management (handles creep spawning queues)
    spawnManager.run();

    // Run creep management (handles creep roles and behaviors)
    creepManager.run();

    // Run tower management (handles defense and repair)
    towerManager.run();

    // Run resource management (handles mining, hauling, links)
    resourceManager.run();

    // Run defense management (handles safemode, nukes, etc.)
    defenseManager.run();

    // Run visuals (room visuals for debugging)
    if (Memory.visualsEnabled) {
        visualManager.run();
    }

    // Run statistics collection
    if (Memory.statsEnabled) {
        statsManager.run();
    }

    // CPU monitoring
    if (Game.cpu.bucket < 500) {
        console.log(`[WARNING] Low CPU bucket: ${Game.cpu.bucket}`);
    }
};

// Global error handler for uncaught exceptions
global._handleError = function (error, context = '') {
    const errorMsg = `Error${context ? ` in ${context}` : ''}: ${error.message}\n${error.stack}`;
    console.log(errorMsg);
    
    // Log to memory for persistence across ticks
    if (!Memory.errors) Memory.errors = [];
    Memory.errors.push({
        time: Game.time,
        message: error.message,
        stack: error.stack,
        context: context
    });
    
    // Keep only last 50 errors
    if (Memory.errors.length > 50) {
        Memory.errors.shift();
    }
};

// Wrapper for safe execution
global._tryCatch = function (fn, context) {
    try {
        return fn();
    } catch (error) {
        _handleError(error, context);
        return undefined;
    }
};