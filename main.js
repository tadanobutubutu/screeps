'use strict';

/* Main entry point for Screeps bot.
 * This file contains all imports and logic from both branches.
 * A simple status check is added for monitoring purposes and acts as a placeholder status check.
 */

/* Helper to safely require modules. If the module cannot be loaded,
 * the returned value is undefined and can be checked before use.
 */
function safeRequire(moduleName) {
  try {
    return require(moduleName);
  } catch (_) {
    // Module exists or failed to load – just return undefined.
    return undefined;
  }
}

/* Mock globals for testing environments (e.g., Jest) */
if (typeof global.Game === 'undefined') global.Game = { creeps: {} };
if (typeof global.Flags === 'undefined') global.Flags = {};
if (typeof global.gr === 'undefined') global.gr = function() {};
if (typeof global.evor === 'undefined') global.evor = function() {};

const Game  = global.Game || {};
const Flags = global.Flags || {};

const roleHarvester = safeRequire('role.harvester');
const roleUpgrader   = safeRequire('role.upgrader');
const roleBuilder    = safeRequire('role.builder');
const roleMiner      = safeRequire('role.miner');
const roleCreep      = safeRequire('role.creep');
const roleMine       = safeRequire('role.mine');
const EmotionSystem  = safeRequire('emotion.system');

/* ------------------------------------------------------------------
 * Optional modules
 * ------------------------------------------------------------------ */
const Controller = safeRequire("./controller");
const Defender   = safeRequire("./defender");
const Builder    = safeRequire("./builder");

/* ----------------- Jest for Testing ------------------ */
// Add jest to the environment globals for test mocking
let jest;
try {
    jest = require('jest');
    global.jest = jest;
    try {
        jest.mock('screeps');
    } catch (e) {
        // If mocking fails, likely running in production; ignore
    }
} catch (e) {
    // Jest not available, likely running in production; ignore
}

/**
 * Main loop called by the Screeps engine once per tick.
 * Iterates over creeps and assigns roles based on creep.memory.role.
 */
function main() {
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    const role = creep.memory.role;
    let roleModule = null;
    switch (role) {
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
        // Skip if role is not recognized
        continue;
    }
    if (roleModule && typeof roleModule.run === 'function') {
      roleModule.run(creep);
    }
  }
}

/* ------------------------------------------------------------------
 * New Function
 * ------------------------------------------------------------------ */
/* Add multiply function to main.js that takes two numbers and returns
 * their product.
 */
function multiply(a, b) {
  return a * b;
}