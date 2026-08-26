// Main game loop for Screeps
const { loop } = require('./src/loop');
const { init } = require('./src/init');
const { getStats } = require('./src/stats');

// Initialize the game
init();

// Main game loop
module.exports.loop = function() {
    // Check for memory cleanup
    if (Game.time % 100 === 0) {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    }
    
    // Execute the loop
    loop();
    
    // TODO: resolve missing exports
    // Export additional utilities for testing
    module.exports.getStats = getStats;
    module.exports.Game = Game;
    module.exports.Memory = Memory;
};