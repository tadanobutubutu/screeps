// main.js

// Implementation details: This module provides core utility functions for the application

const CONFIG = {
    appName: 'SampleApp',
    version: '1.0.0',
    debug: false
};

function greet(name) {
    if (!name) {
        return 'Hello, World!';
    }
    return `Hello, ${name}!`;
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        throw new Error('Cannot divide by zero');
    }
    return a / b;
}

function isEven(number) {
    return number % 2 === 0;
}

function getConfig() {
    return { ...CONFIG };
}

module.exports = {
    greet,
    add,
    subtract,
    multiply,
    divide,
    isEven,
    getConfig,
    CONFIG
};