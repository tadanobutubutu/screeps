"use strict";
/* Main entry point for the Screeps bot.
 * This file contains all imports and logic from both branches.
 * A simple status check is added for monitoring purposes. */
/* ----------------- Imports ---------------------------- */
const Game = global.Game || {};
const Flags = global.Flags || {};

// Add jest to the environment globals for test mocking
global jest = require('jest');
// Mock necessary Screeps modules for Jest
jest.mock('screeps');

// Roles
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require("./builder");

// Optional modules
const Controller = require("./controller");
const Defender = require("./defender");
const Builder = require("./builder");

// ----------------- Bot Logic --------------------------
/**
 * Main loop called by the Screeps engine once per tick.
 */
function mainLoop() {
  // Primary controller logic
  try {
    Controller.run();
  } catch (err) {
    console.error('[Controller] error:', err);
  }
  // Run main controller logic
  // Run each creep according to its role
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (!creep || !creep.memory || !creep.memory.role) {
      continue;
    }
    switch (creep.memory.role) {
      case 'harvester':
        roleHarvester.run(creep);
        break;
      case 'upgrader':
        roleUpgrader.run(creep);
        break;
      case 'builder':
        roleBuilder.run(creep);
        break;
      default:
        // Additional roles could be handled here
        break;
    }
  }
}

// Export loop and status check
module.exports.loop = mainLoop;
module.exports.checkStatus = function () {
  return 'OK';
};