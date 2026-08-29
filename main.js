// This file is the entry point for Screeps game logic
// Place your game logic code below

// Main game loop
module.exports = {
    loop: function() {
        // Clean up memory of dead creeps
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
        
        // TODO: Add any new functions or changes requested in the issue here
    }
};