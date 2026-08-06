module.exports.loop = function() {
    // Memory cleanup every 15000 ticks
    if (Game.time - Memory.lastCleanup > 15000) {
        for (const name in Memory.creeps) {
            if (Object.prototype.hasOwnProperty.call(Memory.creeps, name) && !Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
        Memory.lastCleanup = Game.time;
    }

    // Main game loop
};