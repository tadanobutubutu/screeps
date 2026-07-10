"use strict";

// User Safety: safe

// ----------------- Imports ----------------------------
const Game   = global.Game || {};
const Flags  = global.Flags || {};

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

// Roles
const roleHarvester = safeRequire('role.harvester') || { run: () => {} };
const roleUpgrader  = safeRequire('role.upgrader')  || { run: () => {} };
const roleBuilder   = safeRequire('role.builder')   || { run: () => {} };

// Optional modules
const Controller = safeRequire("./controller") || { run: () => {} };
const Defender  = safeRequire("./defender")  || { run: () => {} };
const Builder   = safeRequire("./builder")   || { run: () => {} };

// ----------------- Bot Logic --------------------------
/**
 * Main loop called by the Screeps engine once per tick.
 */
function mainLoop() {
  // Primary controller logic
  try {
    Controller.run();
  } catch (err) {
    console.error("[Controller] error:", err);
  }

  // Run main controller logic
  // (Additional role logic could be added here)
}

module.exports.loop = mainLoop;