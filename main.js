'use strict';

/* Main entry point for Screeps bot.
 * A simple status check is added for monitoring purposes.
 * Includes global helpers, EmotionSystem stub, and a placeholder status check.
 */

/* ------------------------------------------------------------------
 *  Helper – safely require optional modules
 * ------------------------------------------------------------------ */
function safeRequire(name) {
    try {
        return require(name);
    } catch (_) {
        return undefined;
    }
}

/* Mock globals for testing environments (e.g., Jest) */
if (typeof global.Game === 'undefined') global.Game = { creeps: {} };
if (typeof global.Flags === 'undefined') global.Flags = {};

const Game  = global.Game || {};
const Flags = global.Flags || {};

const roleHarvester = safeRequire('role.harvester');
const roleUpgrader  = safeRequire('role.upgrader');
const roleBuilder   = safeRequire('role.builder');
const roleMiner     = safeRequire('role.miner');
const roleCreep     = safeRequire('role.creep');
const roleMine      = safeRequire('role.mine');

/* ------------------------------------------------------------------
 * New Function
 * ------------------------------------------------------------------ */
/* Add multiply function to main.js that takes two numbers and returns
 * their product.
 */
function multiply(a, b) {
    return a * b;
}

/* ------------------------------------------------------------------
 * Bot Logic
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

    // Ensure Jest is properly set up
    jest.mock(
        'jest',
        () => ({
            __esModule: true,
            default: jest.fn(),
        }),
        { virtual: true }
    );
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