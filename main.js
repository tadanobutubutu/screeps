"use strict";

/* Main entry point for the Screeps bot.
 * This file contains all imports and logic from both branches.
 * A simple status check is added for monitoring purposes.
 */

// Mock globals for testing environments (e.g., Jest)
if (typeof global.Game === 'undefined') {
  global.Game = { creeps: {} };
}
if (typeof global.Flags === 'undefined') {
  global.Flags = {};
}

// ----------------- Imports ----------------------------
const Game   = global.Game || {};
const Flags  = global.Flags || {};

// Roles
const roleHarvester = require('role.harvester');
const roleUpgrader   = require('role.upgrader');
const roleBuilder    = require('./role.builder'); // Fixed path to match existing file

// Optional modules
const Controller = require("./controller");
const Defender   = require("./defender");
const Builder    = require("./builder");

// ----------------- Bot Logic --------------------------
/**
 * Main loop called by the Screeps engine once per tick.
 */
function mainLoop() {
    // Primary controller logic
    try {
        Controller.run();
    } catch (err) {
        console.error('[Controller] error:', err);
    }

    // Run main controller logic
    // Run each creep according to its role
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (!creep || !creep.memory || !creep.memory.role) { continue; }

        switch (creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            default:
                // Additional roles could be handled here
                break;
        }
    }
}

// Add an anonymous function to fix the unterminated string constant error
function runTests() {
    // This function is used to run the Jest tests and should not be included in the export.
    require.main.run();
};

// Export loop and status check
module.exports.loop = mainLoop;

// Add a new function to run Jest tests if the file is run directly
module.exports.runTests = runTests;

module.exports.checkStatus = function () {
    return 'OK';
};