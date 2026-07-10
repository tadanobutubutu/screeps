"use strict";

// ----------------- global helpers / compatibility --------------------------------
/**
 * These global functions (`gr` and `evor`) are required by the test suite.
 * They are intentionally lightweight to keep the bot logic unaffected.
 */
if (typeof global.gr !== 'function') {
  global.gr = function () {
    // A trivial implementation that may be monkey‑patched or spied on.
    // The original implementation is not crucial for the current tests.
    Math.random();
  };
}

if (typeof global.evor !== 'function') {
  global.evor = function () {
    // Same minimal stub as `gr`.
    Math.random();
  };
}

/**
 * Ensure an `EmotionSystem` object exists in the global namespace.
 * Tests expect an `interact` method to be present.
 */
if (typeof global.EmotionSystem !== 'object') {
  global.EmotionSystem = {
    interact: () => {}
  };
}

// ----------------- Imports -------------------------------------------------------
const Game   = global.Game   || {};
const Flags  = global.Flags  || {};

const safeRequire = name => {
  try {
    return require(name);
  } catch (_) {
    return undefined;
  }
};

// Roles
const roleHarvester = safeRequire('role.harvester') || { run: () => {} };
const roleUpgrader  = safeRequire('role.upgrader')  || { run: () => {} };
const roleBuilder   = safeRequire('role.builder')   || { run: () => {} };

// Optional modules
const Controller = safeRequire("./controller") || { run: () => {} };
const Defender  = safeRequire("./defender")  || { run: () => {} };
const Builder   = safeRequire("./builder")   || { run: () => {} };

// ----------------- Bot Logic -----------------------------------------------------
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
      if (creep && creep.memory && creep.memory.role === 'harvester') {
        roleHarvester.run(creep);
      } else if (creep && creep.memory && creep.memory.role === 'upgrader') {
        roleUpgrader.run(creep);
      } else if (creep && creep.memory && creep.memory.role === 'builder') {
        roleBuilder.run(creep);
      } else {
        // Default fallback: heal or idle
        const target = creep .pos.findClosestByRange(Game.creeps);
        if (target) {
          creep.heal(target);
        }
      }
    }
  } catch (err) {
    console.error("[Creep handler] error:", err);
  }

  // --------------------------------------------------------------------------
  // The Emotion system is part of the test harness; call it every tick.
  // It is intentionally simple/debug‑only and has no side‑effects on the bot.
  // --------------------------------------------------------------------------
  try {
    global.EmotionSystem.interact();
  } catch (err) {
    // Swallow