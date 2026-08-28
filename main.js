// Main game loop for Screeps
// This file has been corrupted - please provide the original content

module.exports = {
  loop: function() {
    // Clean up memory of dead creeps
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
    
    // Your game logic here
  }
};