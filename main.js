'use strict';

// User Safety: safe

/* ------------------------------------------------------------------
 *  Mock globals for testing environments (e.g., Jest)
 * ------------------------------------------------------------------ */
if (typeof global.Game === 'undefined') global.Game = { creeps: {} };
if (typeof global.Flags === 'undefined') global.Flags = {};

const Game = global.Game || {};
const Flags = global.Flags || {};

/* ------------------------------------------------------------------
 *  Core imports (if they exist in the test environment)
 * ------------------------------------------------------------------ */
const roleHarvester = safeRequire('role.harvester');
const roleUpgrader = safeRequire('role.upgrader');
const roleBuilder = safeRequire('role.builder');
const roleMiner = safeRequire('role.miner');
const roleCreep = safeRequire('role.creep');
const roleMine = safeRequire('role.mine');

/* ------------------------------------------------------------------
 *  Helper API – multiply
 * ------------------------------------------------------------------ */
function multiply(a, b) {
    return a * b;
}

/* ------------------------------------------------------------------
 *  Bot primary loop
 * ------------------------------------------------------------------ */
function run() {
    // Iterate over all creeps in the current Game environment.
    // Determine which role module to use based on a property on the creep.
    // Invoke the run method of that role, if available.
    const creeps = Game.creeps || {};
    Object.values(creeps).forEach((creep) => {
        if (!creep