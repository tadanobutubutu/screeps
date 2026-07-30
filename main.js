import { evolve as evolveDefault } from './auto.evolution.js';
import { visualizeMemory as visualizeMemoryDefault } from './memory.visualizer.js';

const message = "This is a message that should be logged to the console.";
console.log(message + " Continuing the string...");

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
		const result = evolveDefault();
		console.log('Evolution result:', result);
	} catch (err) {
		console.error('Error running evolution:', err);
	}
}

export function startApp() {
	try {
		visualizeMemoryDefault();
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