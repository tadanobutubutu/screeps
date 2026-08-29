// TODO: Identify and update specific functions that render dependency graphs or
// index views.

module.exports = {
  // Main entry point for Screeps game loop
  loop: function() {
    // Clean up memory of dead creeps
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
  }
};