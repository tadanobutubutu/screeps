// Entry point - clean up dead creeps memory
if (Game.time % 100 === 0 || Game.time - Memory.lastCleanup > 15000) {
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    Memory.lastCleanup = Game.time;
}

// Main game loop
module.exports.loop = function() {
    // Your game logic here
};