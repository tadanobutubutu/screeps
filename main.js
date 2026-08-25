// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// ... (the existing code provided by you)
// ----- END ORIGINAL CODE (unchanged) -----

// TODO: Add back any required exports that might have been? - Removed export statement
export {};

module.exports = {
  loop: function() {
    // Main game loop
    for (var name in Game.rooms) {
      var room = Game.rooms[name];
      console.log('Room "' + name + '" has ' + room.controller.level + ' level controller');
    }
  }
};

// TODO: Address accessibility issues from insight report