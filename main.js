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

    // Example: iterate over all our creeps
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        // Basic creep logic placeholder
        if (creep.carry.energy === creep.carryCapacity) {
            // Try to find a storage to deposit
            const storage = Game.structures.find(s => s.structureType === STRUCTURE_STORAGE);
            if (storage) {
                creep.transfer(storage, RESOURCE_ENERGY);
            }
        } else {
            // Withdraw energy from container or source
            const source = Game.sources
                ? Game.sources.find()
                : null;
            if (source) {
                creep.harvest(source);
            }
        }
    }
};

module.exports.Game = Game;
module.exports.EmotionSystem = EmotionSystem;
module.exports.globalFunc = globalFunc;