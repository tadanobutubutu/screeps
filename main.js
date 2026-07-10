'use strict';

/* Main entry point for the Screeps bot.
 * This file contains all imports and logic from both branches.
 * A simple status check is added for monitoring purposes. */
/* global describe, test, expect */

/* ------------------------------------------------------------------
 *  Helper – safely require optional modules
 * ------------------------------------------------------------------ */
function safeRequire(name) {
    try {
        return require(name);
    } catch (_) {
        /* If the module cannot be loaded, the returned value is undefined
         * and can be checked before use. */
        return undefined;
    }
}

/* Mock globals for testing environments (e.g., Jest) */
if (typeof global.Game === 'undefined') global.Game = { creeps: {} };
if (typeof global.Flags === 'undefined') global.Flags = {};

const Game  = global.Game || {};
const Flags = global.Flags || {};

/* ------------------------------------------------------------------
 * Roles
 * ------------------------------------------------------------------ */
const roleHarvester     = safeRequire('role.harvester');
const roleUpgrader      = safeRequire('role.upgrader');
const roleBuilder       = safeRequire('role.builder');
const roleMiner         = safeRequire('role.miner');
const roleCreep         = safeRequire('role.creep');
const roleMine          = safeRequire('role.mine');
const roleAwayHarvester = safeRequire('role.awayHarvester');
const spawner           = safeRequire('