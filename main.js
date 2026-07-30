import { evolve } from './auto.evolution.js';

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

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', runEvolution);
}

module.exports = sum;
module.exports.checkStatus = checkStatus;
module.exports.sum = sum;
module.exports.runEvolution = runEvolution;
