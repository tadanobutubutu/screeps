// TODO: Address accessibility issues from insight report

module.exports = {
  loop: function() {
    // Main game loop
    for (var name in Game.rooms) {
      var room = Game.rooms[name];
      console.log('Room "' + name + '" has ' + room.controller.level + ' level controller');
    }
  }
};