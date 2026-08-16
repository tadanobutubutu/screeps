// Existing imports (preserve all existing imports)
const existingModule = require('./existing-module');
const existingJs = require('./existing.js');

// Preserve all existing functions and exports
function existingFunction() {
  // existing implementation
}

// Add new functions or changes requested in the issue here
function newFunction() {
  // new functionality
}

// Preserve all existing named exports
module.exports = {
  existingFunction,
  newFunction,
  // Include any other exports that were previously exported
};