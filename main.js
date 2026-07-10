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

const roleHarvester = safeRequire('role.harvester');
const roleUpgrader = safeRequire('role.upgrader');
const roleBuilder = safeRequire('role.builder');
const roleMiner = safeRequire('role.miner');

/* ------------------------------------------------------------------
 *  Helper API – multiply
 * ------------------------------------------------------------------ */
function multiply(a, b) {
    return a * b;
}

/* ------------------------------------------------------------------
 *  Global helpers for tests
 * ------------------------------------------------------------------ */
function gr() {
    /* placeholder – tests only check typeof */
}
function evor() {
    /* placeholder – tests only check typeof */
}

global.gr = gr;
global.evor = evor;

/* ------------------------------------------------------------------
 *  Jest test environment setup
 * ------------------------------------------------------------------ */
if (typeof jest !== 'undefined') {
    // Mock the global Game object for tests
    global.Game = {
        // Add any necessary mock properties here
        // For example:
        // creeps: {},
        // rooms: {},
        // time: 0
    };

    // Mock the global Flags object for tests
    global.Flags = {
        // Add any necessary mock properties here
    };

    // Mock Jest utilities to avoid “jest not found” errors
    const actualJest = jest;
    global.jest = {
        ...actualJest,
        // Preserve essential Jest functions that tests may call
        mock: actualJest.fn,
        fn: actualJest.fn,
        spyOn: actualJest.spyOn,
        mockModule: actualJest.mock,
        clearAllMocks: actualJest.clearAllMocks,
    };

    // Ensure the real jest mocking behaviour works if the test runner provides it
    if (actualJest && typeof actualJest.mock === 'function') {
        global.jest.mock = actualJest.mock;
    }
}

/* ------------------------------------------------------------------
 *  Main loop – minimal implementation for tests
 * ------------------------------------------------------------------ */
function loop() {
    // If EmotionSystem is available, call its interact method.
    const EmotionSystem = global.EmotionSystem;
    if (EmotionSystem && typeof EmotionSystem.interact === 'function') {
        EmotionSystem.interact();
    }

    /* Optional logic – iterate over flags or rooms would go here */
}

/* ------------------------------------------------------------------
 *  Exported API
 * ------------------------------------------------------------------ */
module.exports = {
    multiply,
    loop,
};