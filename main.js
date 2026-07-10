'use strict';

/* Main entry point for Screeps bot.
 * A simple status check is added for monitoring purposes.
 * Includes global helpers, EmotionSystem stub, and a placeholder status check.
 */

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
const Flags = global.Flags || {};

const roleHarvester = safeRequire('role.harvester');
const roleUpgrader = safeRequire('role.upgrader');
const roleBuilder = safeRequire('role.builder');
const roleMiner = safeRequire('role.miner');
const roleCreep = safeRequire('role.creep');
const roleMine = safeRequire('role.mine');

/* ------------------------------------------------------------------
 * New Function
 * ------------------------------------------------------------------ */
/* Add multiply function to main.js that takes two numbers and returns
 * their product.
 */
function multiply(a, b) {
    return a * b;
}

/* ------------------------------------------------------------------
 * Bot Logic
 * ------------------------------------------------------------------ */
/* A placeholder for where the bot's primary loop or processing logic
 * would go. For now, we'll provide a simple status check and
 * role execution example.
 */
function run() {
    // Simple status check
    const status = {
        creeps: Object.keys(global.Game.creeps).length,
        resources: {
            energy: Game.energyAvailable,
            minerals: Game.mineralHarvesters.length,
            metals: Game.metalHarvesters.length,
        },
        roles: {
            harvester: roleHarvester.count,
            upgrader: roleUpgrader.count,
            builder: roleBuilder.count,
            miner: roleMiner.count,
            creep: roleCreep.count,
            mine: roleMine.count,
        },
    };

    console.log('Status:', status);

    // Example role execution
    roleHarvester.execute();
    roleUpgrader.execute();
    roleBuilder.execute();
    roleMiner.execute();
    roleCreep.execute();
    roleMine.execute();
}
