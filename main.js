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

  // Run defender logic
  try {
    Defender.run();
  } catch (err) {
    console.error("[Defender] error:", err);
  }

  // Run builder logic
  try {
    Builder.run();
  } catch (err) {
    console.error("[Builder] error:", err);
  }

  // Iterate over all creeps and delegate to roles
  try {
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      if (creep.memory.role === 'harvester') {
        roleHarvester.run(creep);
      } else if (creep.memory.role === 'upgrader') {
        roleUpgrader.run(creep);
      } else if (creep.memory.role === 'builder') {
        roleBuilder.run(creep);
      } else {
        // Default fallback: heal or idle
        const target = creep.pos.findClosestByRange(Game.creeps);
        if (target) {
          creep.heal(target);
        }
      }
    }
  } catch (err) {
    console.error("[Creep handler] error:", err);
  }
}

module.exports.loop = mainLoop;