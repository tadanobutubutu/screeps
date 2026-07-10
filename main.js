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
  // Run each creep according to its role
  for (const name in Game.creeps || {}) {
    const creep = Game.creeps[name];
    if (!creep || !creep.memory || !creep.memory.role) { continue; }

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