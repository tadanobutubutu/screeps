// main.js - Entry point for the application

function initApp() {
    console.log('Application initialized');
}

// TODO: Add a new function named `calculateSum` as requested in the issue
function calculateSum(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
}

// Export for testing
module.exports = { initApp, calculateSum };