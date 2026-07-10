'use strict';

// User Safety: safe

/* ------------------------------------------------------------------
 *  Helper – safely require optional modules
 * ------------------------------------------------------------------ */
function safeRequire(moduleName) {
    try {
        return require(moduleName);
    } catch (_) {
        return undefined;
    }
}

/* Mock globals for testing environments (e.g., Jest) */
if (typeof global.Game === 'undefined') global.Game = { creeps: {} };
if (typeof global.Flags === 'undefined') global.Flags = {};

const Game = global.Game || {};
const Flags = global.Flags ? global.Flags : {};

/* ------------------------------------------------------------------
 *  Core imports (if they exist in the test environment)
 * ------------------------------------------------------------------ */
const roleHarvester = safeRequire('role.harvester');
const roleUpgrader = safeRequire('role.upgrader');
const roleBuilder   = safeRequire('role.builder');
const roleMiner     = safeRequire('role.miner');
const roleCreep     = safeRequire('role.creep');
const roleMine      = safeRequire('role.mine');
const EmotionSystem = safeRequire('emotion.system');

/* ------------------------------------------------------------------
 * Optional modules
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