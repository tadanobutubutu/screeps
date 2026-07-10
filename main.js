'use strict';
/* Main entry point for the Screeps bot. */

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
    global.Game = {};
    global.Flags = {};
}

const Game = global.Game;
const Flags = global.Flags;

// Roles
const roleHarvester = safeRequire('role.harvester');
const roleUpgrader = safeRequire('role.upgrader');
const roleBuilder = safeRequire('role.builder');

// Optional modules
const Controller = safeRequire('./controller');
const Defender = safeRequire('./defender');
const BuilderModule = safeRequire('./builder');

// ----------------- Bot Logic --------------------------
/** Main loop called by the Screeps engine once per tick. */
function mainLoop() {
    // Primary controller logic
    if (Controller) {
        try {
            Controller.run();
        } catch (err) {
            console.error('[Controller] error:', err);
        }
    } else {
        console.warn('[Controller] module not available');
    }

    // Run each creep according to its role
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (!creep || !creep.memory || !creep.memory.role) {
            continue;
        }

        switch (creep.memory.role) {
            case 'harvester':
                if (roleHarvester) roleHarvester.run(creep);
                break;
            case 'upgrader':
                if (roleUpgrader) roleUpgrader.run(creep);
                break;
            case 'builder':
                if (roleBuilder) roleBuilder.run(creep);
                break;
            default:
                // Additional roles could be handled here
                break;
        }
    }
}

module.exports = mainLoop;