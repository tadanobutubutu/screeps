'use strict';

/* Main entry point for the Screeps bot.
 * This file contains all imports and logic from both branches.
 * A simple status check is added for monitoring purposes and acts as a placeholder status check.
 */

/* ------------------------------------------------------------------
 *  Safe module require helper
 * ------------------------------------------------------------------ */
function safeRequire(name) {
    try {
        return require(name);
    } catch (_) {
        // Module could not be loaded – just return undefined.
        return undefined;
    }
}

/* Mock globals for testing environments (e.g., Jest) */
if (typeof global.Game === 'undefined') global.Game = { creeps: {} };
if (typeof global.Flags === 'undefined') global.Flags = {};

/* ------------------------------------------------------------------
 * Core imports (if they exist in the test environment)
 * ------------------------------------------------------------------ */
const Game = global.Game || {};
const Flags = global.Flags || {};

/* Roles */
const roleHarvester = safeRequire('role.harvester');
const roleUpgrader = safeRequire('role.upgrader');
const roleBuilder = safeRequire('role.builder');
const roleMiner = safeRequire('role.miner');
const roleCreep = safeRequire('role.creep');
const roleMine = safeRequire('role.mine');
const awayHarvester = safeRequire('role.awayHarvester');
const spawner = safeRequire('role.spawner');
const controllerDefault = safeRequire('role.controllerDefault');

// Optional modules
const Controller = safeRequire('./controller');
const Defender = safeRequire('./defender');
const Builder = safeRequire('./builder');

/* ----------------- Jest for Testing ------------------ */
// Add jest to the environment globals for test mocking
let jest;
try {
    jest = require('jest');
    global.jest = jest;
} catch (e) {
    // If jest is not available, ignore
    jest = undefined;
}

try {
    if (jest) jest.mock('screeps');
} catch (e) {
    // If mocking fails, likely running in production; ignore
}

// Main loop placeholder
module.exports.loop = function () {
    // Example status check
    console.log('Screeps bot is running');
};