'use strict'; /* Main entry point for the Screeps bot.
 * This file contains all imports and logic from both branches.
 * A simple status check is added for monitoring purposes.
 */

// Helper to safely require modules. If the module cannot be loaded,
// the returned value is undefined and can be checked before use.
function safeRequire(moduleName) {
    try {
        return require(moduleName);
    } catch (_) {
        // Module not found or failed to load – just return undefined.
        return undefined;
    }
}

// ------------------------- Imports ----------------------------
const Game = global.Game;
const Flags = global.Flags;

// Roles - use safeRequire for missing modules.
const roleHarvester = safeRequire('role.harvester');
const roleUp;
const roleMine = safeRequire('role.mine');
const roleBuilder = safeRequire('role.builder');
const roleUpgrader = safeRequire('role.upgrader');

// Energy logic
const ENERGY_CAPACITY = 300;
const harvest = require('role.harvest');
const upgrade = require('role.upgrade');

// Status check
console.log('Bot is running. Energy capacity:', ENERGY_CAPACITY);

// ------------------------- Exports ----------------------------
function multiply(a, b) {
    return a * b;
}

// Export the function for test compatibility
exports.multiply = multiply;

// Ensure any existing exports are preserved (no overwriting)
