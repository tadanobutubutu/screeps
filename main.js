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
 *  Main bot loop – the entry point for the Screeps runtime
 * ------------------------------------------------------------------ */
module.exports.loop = function () {
  // If an EmotionSystem is present, let it process.
  if (EmotionSystem && typeof EmotionSystem.process === 'function') {
    EmotionSystem.process();
  } else {
    // Fallback: just log a message
    if (typeof console !== 'undefined') {
      console.log('EmotionSystem not available.');
    }
  }
};

/* ------------------------------------------------------------------
 *  Bootstrap for local execution or testing (e.g., Jest)
 * ------------------------------------------------------------------ */