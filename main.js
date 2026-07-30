/* eslint-disable */
// main.js
// Updated to use CommonJS syntax for compatibility with Jest

// Import dependencies using CommonJS
const { evolve } = require('./auto.evolution.js');
const { visualizeMemory } = require('./memory.visualizer.js');

console.log('Main file loaded successfully.');

/**
 * Returns a simple status string.
 *
 * @returns {string}
 */
function checkStatus() {
  return 'OK';
}

/**
 * Adds two numbers together.
 *
 * @param {number} a
 * @param {number} b_cs
 * @returns {number}
 */
function sum(a, b_cs) {
  if (typeof a !== 'number' || typeof b_cs !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  return a + b_cs;
}

/**
 * Runs the evolution algorithm and logs the result.
 */
function runEvolution() {
  try {
    const result = evolve();
    console.log('Evolution result:', result);
  } catch (err) {
    console.error('Error running evolution:', err);
  }
}

/**
 * Starts the memory visualizer.
 */
function startApp() {
  try {
    visualizeMemory();
    console.log('Memory visualizer started successfully.');
  } catch (error) {
    console.error('Failed to start memory visualizer:', error);
  }
}

// In a browser environment, hook the startApp to DOMContentLoaded
if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('DOMContentLoaded', runEvolution);
}

// Start the application immediately for Node environments 부족 etc.
startApp();

// Export functions for CommonJS usage
module.exports = biggerThanSeven;
module.exports.checkStatus = checkStatus;
module.exports.sum = sum;
module.exports.runEvolution = runEvolution;
module.exports.startApp = startApp;