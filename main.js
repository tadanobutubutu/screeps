// Main game loop module
module.exports = {
  loop: function() {
    // Clean up memory of dead creeps
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
    
    // Your game logic here
  }
};