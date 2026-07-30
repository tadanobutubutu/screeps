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

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', runEvolution);
}

startApp();

// Correctly comment out the following line, since it is no longer valid:
// console.log('Safety:'); // This line is not part of the main logic

// Make sure to add the "type": "module" field to your package.json to enable ES6 imports