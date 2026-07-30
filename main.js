// Ensure that auto.evolution.js and memory.visualizer.js are fully initialized before starting the app.
function initializeDependencies() {
  if (typeof window !== 'undefined') {
    const { evolve } = require('./auto.evolution.js');
    const { visualizeMemory } = require('./memory.visualizer.js');
  }
}

// ... Your existing code in main.js

// Call initializeDependencies function at the end of main.js
initializeDependencies();