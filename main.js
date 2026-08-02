// main.js - Screeps game entry point
module.exports = {
  loop: function() {
    // Game loop logic will go here

    // Example of a new function that might be added to the codebase
    function checkRoomStatus(roomName) {
      let room = Game.rooms[roomName];
      if (!room) {
        console.log(`Room ${roomName} not found.`);
        return;
      }
      // Additional logic to check room status
    }

    // Existing code that may call the new function
    checkRoomStatus('E1S1');
  }
};