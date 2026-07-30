const { evolve } = require('./auto.evolution.js');
const { visualizeMemory } = require('./memory.visualizer.js');

console.log('Main file loaded successfully.');

function checkStatus() {
  return 'OK';
}

function sum(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new TypeError('Both arguments must be numbers');
    }
    return a + b;
}

function runEvolution() {
  try {
        const result = evolve();
        console.log('Evolution result:', result);
    } catch (err) {
        console.error('Error running evolution:', err);
    }
}

function startApp() {
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

module.exports = sum;
module.exports.checkStatus = checkStatus;
module.exports.sum = sum;
module.exports.runEvolution = runEvolution;
module.exports.startApp = startApp;