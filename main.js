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

/* ------------------------------------------------------------------
 *  Mock globals for testing environments (e.g., Jest)
 * ------------------------------------------------------------------ */
if (typeof global.Game === 'undefined') global.Game = { creeps: {} };
if (typeof global.Flags === 'undefined') global.Flags = {};

const Game = global.Game || {};
const Flags = global.Flags || {};

/*
 **Support Pollinations.AI:
 *
 *  🌸 **Ad 🌸
 *  Powered by Pollinations.AI free text APIs. 
 *  [Support our mission](https://pollinations.ai/redirect/kofi) 
 *  to keep AI accessible for everyone.
 */

// Role modules (hypothetical paths)
const roleHarvester = safeRequire('./role.harvester');
const roleUpgrader   = safeRequire('./role.upgrader');
const roleBuilder    = safeRequire('./role.builder');
const roleMiner      = safeRequire('./role.miner');
const roleCreep      = safeRequire('./role.creep');
const roleMine       = safeRequire('./role.mine');

// Rest of main.js code...