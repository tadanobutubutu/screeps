const { generateRandomNumber } = require('../src/random');
// New function to update posthog-js
async function initPosthog(options) {
	if (posthogInitialised) return;
	// Existing initialisation code...
	// Add the new posthog instance to the global scope
	window.posthog = initInstance;
}
// Call the new function and initialise posthog-js
initPosthog({ integration, apiKey });

// test_random.js
// This file contains tests for random number generation functions
const { generateRandomNumber } = require('../src/random');
describe('Random number generation', () => {
	test('generates a number within specified range', () => {
		const min = 1;
		const max = 10;
		const result = generateRandomNumber(min, max);
		expect(result).toBeGreaterThanOrEqual(min);
		expect(result).toBeLessThanOrEqual(max);
	});
});

// Ensuring different numbers are generated on subsequent calls
test('generates different numbers on subsequent calls', () => {
	const result1 = generateRandomNumber(1, 10);
	const result2 = generateRandomNumber(1, 10);
	expect(result1).not.toBe(result2);
});