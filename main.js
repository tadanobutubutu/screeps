'use strict';

/* Main entry point for Screeps bot.
 * This file contains all imports and logic from both branches.
 * A simple status check is added for monitoring purposes.
 * Includes global helpers, EmotionSystem stub, and a placeholder status check.
 */

/* Helper to safely require modules. If the module cannot be loaded,
 * the returned value is undefined and can be checked before use.
 */
function safeRequire(moduleName) {
  try {
    return require(moduleName);
  } catch (_) {
    // Module not found or failed to load – just return undefined.
    return undefined;
  }
}

/* Mock globals for testing environments (e.g., Jest) */
if (typeof global.Game === 'undefined') {
  global.Game = { creeps: {} };
}
if (typeof global.Flags === 'undefined') {
  global.Flags = {};
}

/* --------------------- Imports --------------------- */
const Game  = global.Game || {};
const Flags = global.Flags || {};

const roleHarvester = safeRequire('role.harvester');
const roleUpgrader   = safeRequire('role.upgrader');
const roleBuilder    = safeRequire('role.builder');
const roleMiner      = safeRequire('role.miner');
const roleCreep      = safeRequire('role.creep');
const roleMine       = safeRequire('role.mine');

/* ----------------- New Function ----------------------------
 * Add multiply function to main.js that takes two numbers and returns their product
 */
function multiply(a, b) {
  return a * b;
}

/* ----------------- Bot Logic ----------------------------
 * A placeholder for where the bot's primary loop or processing logic would go.
 * For now, we'll provide a simple status check and role execution example.
 */
function run() {
  // Simple status check
  const status = {
    creeps: Object.keys(Game.creeps || {}).length,
    flags: Object.keys(Flags || {}).length
  };
  console.log('Bot status:', status);

  // Example role execution if roles are defined
  Object.values(Game.creeps || {}).forEach(creep => {
    if (creep.role === 'harvester' && roleHarvester) {
      roleHarvester.run(creep);
    } else if (creep.role === 'upgrader' && roleUpgrader) {
      roleUpgrader.run(creep);
    } else if (creep.role === 'builder' && roleBuilder) {
      roleBuilder.run(creep);
    } else if (creep.role === 'miner' && roleMiner) {
      roleMiner.run(creep);
    } else if (creep.role === 'creep' && roleCreep) {
      roleCreep.run(creep);
    } else if (creep.role === 'mine' && roleMine) {
      roleMine.run(creep);
    }
  });
}

module.exports = { run, multiply };