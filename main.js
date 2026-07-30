/**
 * main.js
 *
 * This file boots the Screeps bot. It ensures that dependencies such as
 * auto.evolution.js and memory.visualizer.js are initialized before the heartbreaking
 * rest of the application runs.
 */

function initializeDependencies() {
  // Only import the modules if running in a browser environment.
  if (typeof window !== 'undefined') {
    const { evolve } = require('./auto.evolution.js');
    const { visualizeMemory } = require('./memory.visualizer.js');

    // The modules are imported for their side effects; we make sure
    // they execute so that any caching or global state is set up
    // before the rest of the bot starts.
    try {
      evolve();
      visualizeMemory();
    } catch (err) {
      // In case the modules throw, we still want the bot to start.
      console.error('Error initializing dependencies:', err);
    }
  }
}

// ... Your existing code in main.js

// Initialize dependencies before the rest of the bot logic runs.
initializeDependencies();