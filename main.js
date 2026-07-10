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
 * Placeholder for further implementation.
 */
function main() {
  // Get all creeps
  const creeps = Object.values(Game.creeps);

  // Assign roles to creeps
  creeps.forEach(creep => {
    if (creep.body.length > 0 && creep.carry.energy > 0) {
      if (creep.memory.role === undefined) {
        if (creep.pos.isNearTo(Game.spawn.pos, 1)) {
          creep.memory.role = 'harvester';
          creep.memory.target = Game.spawn;
        } else if (creep.pos.isNearTo(Game.spawning.pos, 1)) {
          creep.memory.role = 'upgrader';
          creep.memory.target = Game.spawning;
        } else if (creep.pos.isNearTo(Game.resource.pos, 1)) {
          creep.memory.role = 'miner';
          creep.memory.target = Game.resource;
        } else {
          creep.memory.role = 'builder';
          creep.memory.target = Game.constructionSite;
        }
      }

      // Perform tasks based on role
      switch (creep.memory.role) {
        case 'harvester':
          roleHarvester(creep);
          break;
        case 'upgrader':
          roleUpgrader(creep);
          break;
        case 'miner':
          roleMiner(creep);
          break;
        case 'builder':
          roleBuilder(creep);
          break;
        default:
          console.log(`Unknown role: ${creep.memory.role}`);
      }
    }
  });
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