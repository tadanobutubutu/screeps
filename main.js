'use strict';

/* Main entry point for the Screeps bot.
 * This file contains all imports and logic from both branches.
 * A simple status check is added for monitoring purposes and acts as a placeholder status check.
 */

/* ------------------------------------------------------------------
 * Helper to safely require modules. If the module cannot be loaded,
 * the returned value is undefined and can be checked before use.
 * ------------------------------------------------------------------ */
function safeRequire(moduleName) {
  try {
    return require(moduleName);
  } catch (_) {
    // Module could not be loaded – just return undefined.
    return undefined;
  }
}

/* Mock globals for testing environments (e.g., Jest) */
if (typeof global.Game === 'undefined') global.Game = { creeps: {} };
if (typeof global.Flags === 'undefined') global.Flags = {};
if (typeof global.gr === 'undefined') global.gr = function() {};
if (typeof global.evor === 'undefined') global.evor = function() {};

const Game = global.Game || {};
const Flags = global.Flags || {};

/* Roles */
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
    jest = require('jest