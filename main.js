// Screeps Bot Main Entry Point
// This is the main loop for the Screeps AI bot

// Import required modules
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleWallRepairer = require('role.wallRepairer');
const roleClaimer = require('role.claimer');
const roleMiner = require('role.miner');
const roleTransporter = require('role.transporter');
const roleDefender = require('role.defender');
const roleScout = require('role.scout');
const roleRemoteHarvester = require('role.remoteHarvester');
const roleRemoteTransporter = require('role.remoteTransporter');

const structureTower = require('structure.tower');
const structureLink = require('structure.link');
const structureLab = require('structure.lab');
const structureTerminal = require('structure.terminal');
const structureNuker = require('structure.nuker');
const structureFactory = require('structure.factory');
const structurePowerSpawn = require('structure.powerSpawn');

const managerCreep = require('manager.creep');
const managerRoom = require('manager.room');
const managerSpawn = require('manager.spawn');
const managerMemory = require('manager.memory');
const managerMarket = require('manager.market');
const managerIntel = require('manager.intel');
const managerDiplomacy = require('manager.diplomacy');
const managerVisuals = require('manager.visuals');
const managerTasks = require('manager.tasks');
const managerLogistics = require('manager.logistics');

const utils = require('utils');
const constants = require('constants');
const profiler = require('profiler');

// Initialize profiler for CPU tracking
profiler.enable();

// Global initialization
function init() {
    // Initialize memory structures
    managerMemory.init();
    
    // Initialize room managers
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (room.controller && room.controller.my) {
            managerRoom.init(room);
        }
    }
    
    // Clean up dead creep memory
    managerCreep.cleanMemory();
    
    // Initialize visuals
    managerVisuals.init();
}

// Main loop - executed every tick
module.exports.loop = function() {
    // Start CPU profiling
    profiler.wrap(function() {
        try {
            // Initialize on first tick or after global reset
            if (!Memory.initialized || Game.time % 1000 === 0) {
                init();
                Memory.initialized = true;
            }
            
            // Update global game state
            utils.updateGameState();
            
            // Run room managers
            for (const roomName in Game.rooms) {
                const room = Game.rooms[roomName];
                if (room.controller && room.controller.my) {
                    managerRoom.run(room);
                }
            }
            
            // Run spawn managers
            managerSpawn.run();
            
            // Run creep managers
            managerCreep.run();
            
            // Run structure managers
            structureTower.run();
            structureLink.run();
            structureLab.run();
            structureTerminal.run();
            structureNuker.run();
            structureFactory.run();
            structurePowerSpawn.run();
            
            // Run global managers
            managerMarket.run();
            managerIntel.run();
            managerDiplomacy.run();
            managerTasks.run();
            managerLogistics.run();
            
            // Run visuals
            managerVisuals.run();
            
            // Cleanup
            if (Game.time % 100 === 0) {
                managerMemory.cleanup();
            }
            
        } catch (error) {
            console.log('Critical error in main loop:', error.stack);
            Game.notify('Critical error in main loop: ' + error.message);
        }
    });
};

// Global error handler
global.handleError = function(error, context = '') {
    console.log(`Error ${context}:`, error.stack);
    Game.notify(`Error ${context}: ${error.message}`);
};

// Export for testing
module.exports.init = init;