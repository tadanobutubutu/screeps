const emotionString = "This is a properly terminated string"; // Fixed unterminated string issue

function randomFunction() {
    // Return a random number between 0 (inclusive) and 1 (exclusive)
    return Math.random();
}

// Export the function for test_random.js
module.exports = {
    randomFunction,
};