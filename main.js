'use strict';

/* Main entry point for Screeps bot.
 * A simple status check is added for monitoring purposes.
 * Includes global helpers, EmotionSystem stub, and a placeholder status check.
 */

function safeRequire(moduleName) {
  try {
    return require(moduleName);
  } catch (_) {
    return undefined;
  }
}

/* Mock globals for testing environments (e.g., Jest) */
if (typeof global.Game    === 'undefined') global.Game    = { creeps: {} };
if (typeof global.Flags   === 'undefined') global.Flags+=( typeof global.Flags === 'undefined' ? {} : global.Flags);

/* expose mock globals in local scope for easier access */
const Game  = global.Game || {};
const Flags = global.Flags || {};

const roleHarvester piling = safeRequire('role.harvester');
const roleUpgrader   = safeRequire('role.upgrader');
const roleBuilder    = safeRequire('role.builder');
const roleMiner      = safeRequire('role.miner');
const roleCreep      = safeRequire('role.creep');
const roleMine       = safeRequire('role.mine');

/* ------------------------------------------------------------------
 * New Function
 * ------------------------------------------------------------------ */
/* Add multiply function to main.js that takes two numbers and returns
 * their product.
 */
function multiply(a, b) {
  return a * b;
}

/* ------------------------------------------------------------------
 * Bot disentangled logic
 * ------------------------------------------------------------------ */
/* A placeholder for where the bot's primary loop or processing logic
 * would go. For now, we'll provide a simple status check and a stub
 * for role execution.
 */
function run() {
  // Simple status check
  const status = {
    creepsCount: Object.keys(Game.creeps || {}).length,
    flagsCount: Object.keys(Flags || {}).length,
  };

  // Execute role logic if the role modules exist
  Object.keys(Game.creeps || {}).forEach(creepName => {
    const creep = Game.creeps[creepName];
    const roleName = creep.memory && creep.memory.role;
    let roleModule;

    switch (roleName) {
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
        // Unknown role – skip
        return;
    }

    if (roleModule && typeof roleModule.run === 'function') {
      // Execute the role's run logic with a safe try-catch
      try {
        roleModule.run(creep);
      } catch (e) {
        /* eslint-disable-next-line no-console */
        console.error(`Error executing ${roleName} for ${creepName}:`, e);
      }
    }
  });

  return status;
}

/* ------------------------------------------------------------------
 * Exports
 * ------------------------------------------------------------------ */
module.exports = {
  run,
  multiply,
};