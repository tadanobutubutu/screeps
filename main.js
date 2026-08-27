// This is the main.js file with the implementation for handling the new function

// Sample existing code to preserve
const express = require('express');
const app = express();

function existingFunction() {
    return 'existing function result';
}

// TODO: replace this with your implementation for handling the new function
function handleNewFunction(data) {
    if (!data) {
        throw new Error('Data is required');
    }
    
    // Process and return the result
    return {
        success: true,
        processed: true,
        data: data
    };
}

function anotherExistingFunction(param) {
    return param * 2;
}

// Export all functions
module.exports = {
    existingFunction,
    handleNewFunction,
    anotherExistingFunction
};