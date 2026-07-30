import { evolve } from './auto.evolution.js';
import { visualizeMemory } from './memory.visualizer.js';

console.log('Main file loaded successfully.');

export function checkStatus() {
  return 'OK';
}

export function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  return a + b; // Removed the newline character
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

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', runEvolution);
}

startApp();

// Exporting functions separately to maintain compatibility with Node.js environments that do not support module.exports syntax
module.exports = {
  sum,
  checkStatus,
  runEvolution,
  startApp,
};