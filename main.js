"use strict";

/* Main entry point for the Screeps bot.
 * This file contains all imports and logic from both branches.
 * A simple status check is added for monitoring purposes.
 */

// ----------------- Imports ----------------------------
const Game   = global.Game;
const Flags  = global.Flags;

// Roles
const roleHarvester = require('role.harvester');
const roleUpgrader   = require('role.upgrader');
const roleBuilder    = require('role.builder');

/* ------------------------------------------------------------------
 *  Helper – safely require optional modules
 * ------------------------------------------------------------------ */
function safeRequire(name) {
  try {
    return require(name);
  } catch (_) {
    return undefined; // module missing / failed to load
  }
}

// Optional modules
const Controller = safeRequire("./controller") || require("./controller");
const Defender   = safeRequire("./defender")   || require("./defender");
const Builder    = safeRequire("./builder")    || require("./builder");

// ----------------- Jest for Testing ------------------
// Ensure Jest is available in case tests require it
try {
    require('jest'); // This line ensures Jest is installed and accessible
} catch (e) {
    console.warn("Jest not found. Please install Jest via npm/pnpm for testing.");
}

// Ensure Jest is required if tests need it (though this is typically handled in package.json)
try {
    // No direct Jest usage in production code
} catch (err) {
    console.warn("Jest not available in production environment");
}

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