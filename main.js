const autoEvolution = require('./auto.evolution.js');
const memoryVisualizer = require('./memory.visualizer.js');

console.log('Main file loaded successfully.');

module.exports = {
  checkStatus() {
    return 'OK';
  },
  sum(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new TypeError('Both arguments must be numbers');
    }
    return a + b;
  },
  runEvolution() {
    try {
        const result = autoEvolution.evolve();
        console.log('Evolution result:', result);
    } catch (err) {
        console.error('Error running evolution:', err);
    }
  },
  startApp() {
    try {
        memoryVisualizer.visualizeMemory();
        console.log('Memory visualizer started successfully.');
    } catch (error) {
        console.error('Failed to start memory visualizer:', error);
    }
  },
  runEvolutionOnLoad() {
    if (typeof window !== 'undefined') {
      window.addEventListener('DOMContentLoaded', this.runEvolution);
    }
  },
  init() {
    this.runEvolutionOnLoad();
    this.startApp();
  }
};