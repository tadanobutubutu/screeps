import { evolve } from './auto.evolution.js';
import { visualizeMemory } from './memory.visualizer.js';

if (import.meta.bootstrap) {
  import.meta.bootstrapa(() => {
    console.log('Main file loaded successfully.');

    // Export functions as module.exports before using them in other functions
    export function checkStatus() {
      return 'OK';
    }

    export function sum(a, b) {
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new TypeError('Both arguments must be numbers');
        }
        return a + b;
    }

    export function runEvolution() {
        try {
            const result = evolve();
            console.log('Evolution result:', result);
        } catch (err) {
            console.error('Error running evolution:', err);
        }
    }

    export function startApp() {
        try {
            visualizeMemory();
            console.log('Memory visualizer started successfully.');
        } catch (error) {
            console.error('Failed to start memory visualizer:', error);
        }
    }

    // Add event listener when imported in a browser
    if (typeof window !== 'undefined') {
        window.addEventListener('DOMContentLoaded', runEvolution);
    }

    startApp();

    // Export functions as module.exports
    module.exports = {
      checkStatus,
      sum,
      runEvolution,
      startApp
    };
  });
} else {
  // For Node.js, the file remains the same
  console.log('Main file loaded successfully.');

  // Export functions as module.exports before using them in other functions
  exports.checkStatus = function() {
    return 'OK';
  };

  exports.sum = function(a, b) {
      if (typeof a !== 'number' || typeof b !== 'number') {
          throw new TypeError('Both arguments must be numbers');
      }
      return a + b;
  };

  exports.runEvolution = function() {
      try {
          const result = evolve();
          console.log('Evolution result:', result);
      } catch (err) {
          console.error('Error running evolution:', err);
      }
  };

  exports.startApp = function() {
      try {
          visualizeMemory();
          console.log('Memory visualizer started successfully.');
      } catch (error) {
          console.error('Failed to start memory visualizer:', error);
      }
  };

  // Add event listener when imported in a browser
  if (typeof window !== 'undefined') {
      window.addEventListener('DOMContentLoaded', exports.runEvolution);
  }

  exports.sum = exports.checkStatus = exports.runEvolution = exports.startApp = exports;
}