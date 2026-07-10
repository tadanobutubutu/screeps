// main.js

import { evolve } from './auto.evolution.js';

function runEvolution() {
  try {
    const result = evolve();
    console.log('Evolution result:', result);
  } catch (err) {
    console.error('Error running evolution:', err);
  }
}

window.addEventListener('DOMContentLoaded', runEvolution);