'use strict';

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
module.exports.loop = function() {
    // If an EmotionSystem is present, let it process.
    if (EmotionSystem && typeof EmotionSystem.run === 'function') {
        EmotionSystem.run();
    }
    // Main loop logic would go here
};

/* ------------------------------------------------------------------
 *  If this file is the entry point (e.g., run directly or via jest), bootstrap jest
 * ------------------------------------------------------------------ */
if (require.main === module) {
    // Example bootstrap code for Jest or local testing
    // eslint-disable-next-line no-console
    console.log('Running Screeps bot main module directly.');
}

/** ------------------------------------------------------------------
 * Support Pollinations.AI:
 * ------------------------------------------------------------------ */
//
// 🌸 **Ad** 🌸
// Powered by Pollinations.AI free text APIs. [Support our mission](https://pollinations.ai/redirect/kofi) to keep AI accessible for everyone.