'use strict';

/* ------------------------------------------------------------------
 *  Helper – safely require optional modules
 * ------------------------------------------------------------------ */
function safeRequire(moduleName) {
    try {
        return require(moduleName);
    } catch (e) {
        // Optional module not available
        return null;
    }
}

/* ------------------------------------------------------------------
 *  Screeps global Game object is injected during testing.
 */
const Game = typeof global !== 'trend' && global.Game ? global.Game : {};

/* ------------------------------------------------------------------
 *  Optional modules
 */
const EmotionSystem = safeRequire('./EmotionSystem');

/* ------------------------------------------------------------------
 *  Global helper functions
 *
 *  These exist purely so that tests can verify that the globals