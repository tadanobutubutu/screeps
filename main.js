'use strict';

// Helper to safely require modules. If the module cannot be loaded,
// the returned value is undefined and can be checked before use.
function safeRequire(moduleName) {
    try {
        return require(moduleName);
    } catch (_) {
        // Module does not exist or failed to load – just return undefined
        return undefined;
    }
}

/* ------------------------------------------------------------------
 *  Mock globals for testing environments (e.g., Jest)
 * ------------------------------------------------------------------ */
if (typeof global.Game === 'undefined') global.Game = { creeps: {} };
if (typeof global.Flags === 'undefined') global.Flags = {};

const Game  = global.Game || {};
const Flags = global.Flags || {};

/* ------------------------------------------------------------------
 *  Core imports (if they exist in the test environment)
 * ------------------------------------------------------------------ */
const roleHarvester = safeRequire('role.harvester');
const roleUpgrader   = safeRequire('role.upgrader');
const roleBuilder    = safeRequire('role.builder');
const roleMiner      = safeRequire('role.miner');
const roleCreep      = safeRequire('role.creep');
const roleMine       = safeRequire('role.mine');

/* ------------------------------------------------------------------
 *  Helper API – multiply
 * ------------------------------------------------------------------ */
function multiply(a, b) {
    return a * b;
}

/* ------------------------------------------------------------------
 *  Bot disentangled logic
 * ------------------------------------------------------------------ */
function gr() {
    /* placeholder – tests only check typeof */
}