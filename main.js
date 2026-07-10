'use strict';

/* ------------------------------------------------------------------
 *  Helper – safely require optional modules
 * ------------------------------------------------------------------ */
function safeRequire(name) {
  try {
    return require(name);
  } catch (e) {
    // Optional module not available
    return null;
  }
}

/* ------------------------------------------------------------------
 *  Mock globals for testing environments (e.g., Jest)
 * ------------------------------------------------------------------ */
if (typeof global.Game === 'undefined') global.Game = { creeps: {} };
if (typeof global.Flags === 'undefined') global.Flags = {};

/* ------------------------------------------------------------------
 *  Optional modules
 * ------------------------------------------------------------------ */
const EmotionSystem = safeRequire('./EmotionSystem');

/* ------------------------------------------------------------------
 *  Global helper functions
 *
 *  These exist purely so that tests can verify that the globals
 *  are exposed and behave correctly.
 * ------------------------------------------------------------------ */
function globalFunc() {
  return 'global function';
}

/* ------------------------------------------------------------------
 *  Main loop
 * ------------------------------------------------------------------ */
module.exports.loop = function () {
  // Iterate over creeps and assign roles
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role) {
      // If creep already has a role, execute the corresponding function
      switch (creep.memory.role) {
        case 'harvester':
          roleHarvester.run(creep);
          break;
        case 'builder':
          roleBuilder.run(creep);
          break;
        case 'upgrader':
          roleUpgrader.run(creep);
          break;
        case 'attacker':
          roleAttacker



---

**Support Pollinations.AI:**

---

🌸 **Ad** 🌸
Powered by Pollinations.AI free text APIs. [Support our mission](https://pollinations.ai/redirect/kofi) to keep AI accessible for everyone.