// main.js
// This file contains the main game logic for the Screeps bot

module.exports = {
  main: function() {
    // Main game loop logic
    let creep; // Assuming this line is causing the lint error

    // Other code that uses 'let' should be preserved
    for (let i = 0; i < 10; i++) {
      // Some logic here
    }
  }
};