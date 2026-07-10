# User Safety: safe
"use strict"; /* Main entry point for the Screeps bot. */

/*
 * This file contains all imports and logic from both branches.
 * A simple status check is added for monitoring purposes.
 */

/* Helper to safely require modules. If the module cannot be loaded, the returned value is undefined and can be checked before use. */
function safeRequire(moduleName) {
    try {
        return require(moduleName);
    } catch (_) {
        // Module not found or failed to load – just return undefined.
        return undefined;
    }
}

// Mock globals for testing environments (e.g., Jest)
if (typeof global.Game === 'undefined') {
    global.Game = { creeps: {} };
}
if (typeof global.Flags === 'undefined') {
    global.Flags = {};
}

// ------------------------- Imports ----------------------------
const Game = global.Game;
const Flags = global.Flags;

// Roles - use safeRequire for missing modules.
const roleHarvester = safeRequire('role.harvester');
const roleUpgrader  = safeRequire('role.upgrader');
const roleBuilder   = safeRequire('role.builder');

// Optional modules - also safe-loaded.
const Controller = safeRequire("./controller");
const Defender  = safeRequire("./defender");

// -------------------------- Bot Logic --------------------------
/**
 * Main loop called by the Screeps engine once per tick.
 */
function mainLoop() {
    // Primary controller logic – try/catch is available on both sides.
    if (Controller && typeof Controller.run === "function") {
        try {
            Controller.run();
        } catch (err) {
            console.error("[Controller] error:", err);
        }
    }

    // Optional defender logic
    if (Defender && typeof Defender.run === "function") {
        try {
            Defender.run();
        } catch (err) {
            console.error("[Defender] error:", err);
        }
    }

    // Call each role's loop if present
    if (roleHarvester && typeof roleHarvester.run === "function") roleHarvester.run();
    if (roleUpgrader && typeof roleUpgrader.run === "function") roleUpgrader.run();
    if (roleBuilder && typeof roleBuilder.run === "function") roleBuilder.run();
}

module.exports = {
    mainLoop
};