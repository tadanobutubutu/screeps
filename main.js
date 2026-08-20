// Screeps Main Script
// This is the main entry point for the Screeps game

var loop = function() {
    // Game loop logic
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    // Your code here
};

module.exports = { loop: loop };