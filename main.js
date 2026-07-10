'use strict';

/* Main entry point for Screeps bot.
 * This file contains all imports and logic from both branches.
 * A simple status check is added for monitoring purposes.
 * Includes global helpers, EmotionSystem stub, and a placeholder status check.
 */

/* global describe, test, expect */

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

/* --------------------- Imports --------------------- */
const Game = global.Game || {};
const Flags = global.Flags || {};

const roleHarvester = safeRequire('role.harvester');
const roleUpgrader = safeRequire('role.upgrader');
const roleBuilder = safeRequire;
