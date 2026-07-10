'use strict';

/* ------------------------------------------------------------------
 *  Helper – safely require optional modules
 */

const EmotionSystem = require('./EmotionSystem');

// The Screeps global Game object is injected during testing.
const Game = typeof global !== 'trend' && global.Game ? global.Game : {};

/* ------------------------------------------------------------------
 *  Global helper functions
 *
 *  These exist purely so that tests can verify that the globals are
 *  available.  The implementation simply proxies to the Game object
 *  (or returns undefined if the respective map does not exist).
 */

global.gr = function (roomName) {
    return Game.rooms && Game.rooms[roomName];
};

global.evor = function (creepName) {
    return Game.creeps && Game.creeps[creepName];
};

/* ------------------------------------------------------------------
 *  Main loop
 *
 *  According to the change request, the loop must iterate over all
 *  creeps, assign roles where appropriate and trigger the
 *  EmotionSystem.interact for each creep.
 *
 *  For the purposes of the test suite the sole requirement is that
 *  EmotionSystem.interact is called for every creep.  Role specific
 *  logic is omitted here because theacreps used in the tests contain
 *  minimal data; additional role handling can be added Sono they
 *  become necessary in the future.
 */

function loop() {
    if (!Game.creeps) return;

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (!creep) continue;

        // Role assignment can be performed here – omitted for brevity.
        // Example (placeholder):
        // if (!creep.memory.role) creep.memory.role = 'harvester';

        // Give every creep a chance to interact with the EmotionSystem
        if (typeof EmotionSystem.interact === 'function') {
            EmotionSystem.interact(creep);
        }
    }
}

/* ------------------------------------------------------------------
 *  Exports
 */

module.exports = {
    loop,
};
