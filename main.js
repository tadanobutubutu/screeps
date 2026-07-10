import { visualizeMemory } from './memory.visualizer.js';

/**
 * Start the application by visualizing memory.
 *
 * @returns {void}
 */
function startApp() {
    try {
        visualizeMemory();
        console.log('Memory visualizer started successfully.');
    } catch (error) {
        console.error('Failed to start memory visualizer:', error);
    }
}

startApp();

/**
 * Returns a simple status string.
 *
 * @returns {string} The status of the application.
 */
export function checkStatus() {
    return 'OK';
}

export { startApp };
