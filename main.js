// main.js - Screeps AI entry point
// This file is the entry point for a Screeps bot (Node.js game scripting).
// The previous merge introduced React PDF accessibility examples that do not belong
// in this codebase. The correct content is the original Screeps AI code.

// Screeps AI main loop and module setup
const loop = require('./loop');
const config = require('./config');

module.exports.loop = function () {
    try {
        // Run the main bot loop
        loop.run();
    } catch (e) {
        // Log any uncaught errors to the console
        console.log(`Error in main loop: ${e.stack || e}`);
    }
};

// Export configuration for external tools/tests
module.exports.config = config;
module.exports = {};