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
        if (!creep) return;
        const roleName = creep.role;
        if (!roleName) return;
        const roleMod = gr(roleName);
        if (roleMod && typeof roleMod.run === 'function') {
            roleMod.run(creep);
        }
    });
}

/* ------------------------------------------------------------------
 *  Additional test helpers
 * ------------------------------------------------------------------ */
/* TODO: Add additional test helpers if necessary */
function gr(roleName) {
    switch (roleName) {
        case 'harvester':
            return roleHarvester;
        case 'upgrader':
            return roleUpgrader;
        case 'builder':
            return roleBuilder;
        case 'miner':
            return roleMiner;
        case 'creep':
            return roleCreep;
        case 'mine':
            return roleMine;
        default:
            return undefined;
    }
}
