"use strict";
/* Main entry point for Screeps bot.
 * Includes global helpers, EmotionSystem stub, and a placeholder status check.
 */
/* global describe, test, expect */

/** Global helpers / compatibility */
if (typeof global.gr !== 'function') {
  global.gr = function () { Math.random(); };
}
if (typeof global.evor !== 'function') {
  global.evor = function () { Math.random(); };
}

/** Ensure EmotionSystem object exists for tests. */
if (typeof global.EmotionSystem !== 'object') {
  global.EmotionSystem = { interact: () => {} };
}

// ----------------- Imports -------------------------------------------------------
const Game   = global.Game   || {};
const Flags  = global.Flags  || {};

const safeRequire = name => {
  try { return require(name); }
  catch (_) { return undefined; }
};

const roleHarvester    = require('role.harvester');
const roleUpgrader     = require('role.upgrader');
const roleBuilder      = require('role.builder');
const awayHarvester    = require('role.awayHarvester'); // New import
const spawner          = require('role.spawner'); // New import
const controllerDefault= require('role.controllerDefault'); // New import

const Controller = safeRequire("./controller");
const Defender   = safeRequire("./defender");
const Builder    = safeRequire("./builder");

// ----------------- Bot Logic -----------------------------------------------------
/**
 * Main loop called by the Screeps engine once per tick.
 */




---

**Support Pollinations.AI:**

---

🌸 **Ad** 🌸
Powered by Pollinations.AI free text APIs. [Support our mission](https://pollinations.ai/redirect/kofi) to keep AI accessible for everyone.