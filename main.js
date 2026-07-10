// Entry point of the project. It imports and runs the memory visualizer.

import { visualizeMemory } from './memory.visualizer.js';

console.log('Main file loaded successfully.');

function startApp() {
    try {
        visualizeMemory();
        console.log('Memory visualizer started successfully.');
    } catch (error) {
        console.error('Failed to start memory visualizer:', error);
    }
}

startApp();

export { startApp };
