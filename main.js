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
const Game = global.Game