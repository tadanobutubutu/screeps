// A simple main.js module with accessible functions

// Function 1: Simple greeting
function greet(name) {
    return `Hello, ${name}!`;
}

// Function 2: Calculate sum
function sum(a, b) {
    return a + b;
}

// Function 3: Check if even
function isEven(num) {
    return num % 2 === 0;
}

// Function 4: Get current timestamp
function getTimestamp() {
    return Date.now();
}

// Export all functions to make them accessible
module.exports = {
    greet,
    sum,
    isEven,
    getTimestamp
};