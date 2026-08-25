/**
 * @license
 * Screeps AI - Main entry point
 * @description
 * This file is the main entry point for the Screeps game.
 * It initializes the game loop and sets up the basic structure.
 */

const _ = require('lodash');

// Memory management
const MemoryManager = require('./src/memory/memory-manager');
const RoleManager = require('./src/roles/role-manager');

/**
 * Main game loop handler
 * @param {Object} mainLoop - The main game loop function
 */
function setMainLoop(mainLoop) {
    if (typeof mainLoop === 'function') {
        // Screeps expects 'loop' to be a global function
        global.loop = mainLoop;
    }
}

/**
 * Initialize the game
 */
function init() {
    console.log('[Screeps] Initializing AI...');
    
    // Initialize memory management
    MemoryManager.init();
    
    // Initialize role system
    RoleManager.init();
    
    console.log('[Screeps] AI initialized successfully');
}

// Auto-initialize when script loads
init();

// Export for module testing
module.exports = {
    setMainLoop,
    init
};