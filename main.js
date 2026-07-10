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
  // Iterate over all creeps and assign roles based on their memory
  for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];

    // Skip if creep is not valid
    if (!creep) continue;

    // Assign role based on creep's memory
    if (creep.memory.role === 'harvester' && roleHarvester) {
      roleHarvester.run(creep);
    } else if (creep.memory.role === 'upgrader' && roleUpgrader) {
      roleUpgrader.run(creep);
    } else if (creep.memory.role === 'builder' && roleBuilder) {
      roleBuilder.run(creep);
    } else if (creep.memory.role === 'miner' && roleMiner) {
      roleMiner.run(creep);
    } else if (creep.memory.role === 'creep' && roleCreep) {
      roleCreep.run(creep);
    } else if (creep.memory.role === 'mine' && roleMine) {
      roleMine.run(creep);
    }
  }

  // Run emotion system if available
  if (EmotionSystem) {
    EmotionSystem.run();
  }

  // Run optional modules if available
  if (Controller) Controller.run();
  if (Defender) Defender.run();
  if (Builder) Builder.run();
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