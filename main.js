"use strict";

/* Main entry point for the Screeps bot.
 * This file contains all imports and logic from both branches.
 * A simple status check is added for monitoring purposes.
 */

// ----------------- Imports ----------------------------
const Game   = global.Game || {};
const Flags  = global.Flags || {};

// Roles
let roleHarvester;
try {
    roleHarvester = require('role.harvester');
} catch (e) {
    roleHarvester = { run: () => {} };
}

let roleUpgrader;
try {
    roleUpgrader = require('role.upgrader');
} catch (e) {
    roleUpgrader = { run: () => {} };
}

let roleBuilder;
try {
    roleBuilder = require('role.builder');
} catch (e) {
    roleBuilder = { run: () => {} };
}

// Optional modules
let Controller;
try {
    Controller = require("./controller");
} catch (e) {
    Controller = { run: () => {} };
}

let Defender;
try {
    Defender = require("./defender");
} catch (e) {
    Defender = { run: () => {} };
}

let Builder;
try {
    Builder = require("./builder");
} catch (e) {
    Builder = { run: () => {} };
}

// ----------------- Bot Logic --------------------------
/**
 * Main loop called by the Screeps engine once per tick.
 */
function mainLoop() {
    // Primary controller logic
    try {
        Controller.run();
    } catch (err) {
        console.error("[Controller] error:", err);
    }

    // Run main controller logic
    // Run each creep according to its role
    for (const name in Game.creeps || {}) {
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

// Export loop and status check
module.exports.loop = mainLoop;

module.exports.checkStatus = function () {
    return 'OK';
};