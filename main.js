// main.js - Screeps game loop

const loop = function() {
    // Your game logic here
    console.log('Game loop executed');
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loop };
}

// Execute the main loop
loop();