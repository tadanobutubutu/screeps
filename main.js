// ... code before line 47 ...

// Avoid using C-style block comments /* */ - use line comments instead
// Commented out line causing linting issue

function randomFunction() {
    // Return a random number between 0 (inclusive) and 1 (exclusive)
    return Math.random();
}

// Export the function for test_random.js
module.exports = {
    randomFunction,
};