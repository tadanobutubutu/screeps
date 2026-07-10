'use strict';

// User Safety: safe

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

/* ------------------------------------------------------------------
 *  Helper API – multiply
 * ------------------------------------------------------------------ */
function multiply(a, b) {
    return a * b;
}

/* ------------------------------------------------------------------
 *  Bot logic
 * ------------------------------------------------------------------ */
/* A placeholder for where the bot's primary loop or processing logic
 * would go. For now, we'll provide a simple status check and a stub
 * for role execution.
 */
function run() {
    // Simple status check
    const status = {
        creepsCount: Object.keys(Game.creeps || {}).length,
        flagsCount: Object.keys(Flags || {}).length,
    };

    // Execute role logic if the role modules exist
    Object.keys(Game.creeps || {}).forEach((creepName) => {
        const creep = Game.creeps[creepName];
        const roleName = creep.memory && creep.memory.role;
        let roleModule;

        switch (roleName) {
            case 'harvester':
                roleModule = roleHarvester;
                break;
            case 'upgrader':
                roleModule = roleUpgrader;
                break;
            case 'builder':
                roleModule = roleBuilder;
                break;
            case 'miner':
                roleModule = roleMiner;
                break;
            case 'creep':
                roleModule = roleCreep;
                break;
            case 'mine':
                roleModule = roleMine;
                break;
            default:
                // Unknown role – skip
                return;
        }

        if (roleModule && typeof roleModule.run === 'function') {
            // Execute the role's run logic with a safe try-catch
            try {
                roleModule.run(creep);
            } catch (e) {
                /* eslint-disable-next-line no-console */
                console.error(`Error executing ${roleName} for ${creepName}:`, e);
            }
        }
    });

    return status;
}

/* ------------------------------------------------------------------
 *  Exports
 * ------------------------------------------------------------------ */
module.exports = {
    run,
    multiply,
};
