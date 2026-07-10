'use strict';

/* Main entry point for the Screeps bot.
 * This file contains all imports and logic from both branches.
 * A simple status check is added for monitoring purposes and acts as a placeholder status check.
 */

/* ------------------------------------------------------------------
 * Helper to safely require modules. If the module cannot be loaded,
 * the returned value is undefined and can be checked before use.
 * ------------------------------------------------------------------ */
function safeRequire(moduleName) {
    try {
        return require(moduleName);
    } catch (_) {
        // Module exists or failed to load – just return undefined.
        return undefined;
    }
}

/* Mock globals for testing environments (e.g., Jest) */
if (typeof global.Game === 'undefined') global.Game = { creeps: {} };
if (typeof global.Flags === 'undefined') global.Flags = {};
if (typeof global.gr === 'undefined') global.gr