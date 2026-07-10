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

/* expose mock globals in local scope for easier access */
const Game = global.Game || {};
const Flags = global.Flags || {};

/* Initialize global commands as functions (empty placeholders) */
if (typeof global.gr === 'undefined') global.gr = function () {};
if (typeof global.evor === 'undefined') global.evor = function () {};

/* ------------------------------------------------------------------
 *  Core imports (if they exist in the test environment)
 * ------------------------------------------------------------------ */
// Optional role modules – imported if available
const roleHarvester = safeRequire('role.harvester');
const roleUpgrader = safeRequire('role.upgrader');
const roleBuilder = safeRequire('role.builder');
const roleMiner = safeRequire('role.miner');
const roleCreep = safeRequire('role.creep');
const roleMine = safeRequire('role.mine');
const EmotionSystem = safeRequire('emotion.system');

/* ---------------------------------------------------------------- */