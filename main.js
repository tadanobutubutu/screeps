// Import required module(s) and export the new necessary function(s) here
// Example: Importing the 'fs' module for file system operations
const fs = require('fs');

// This is a simple greeting module
function greet(name) {
  return `Hello, ${name}!`;
}

// New function to be exported
function readFileSync(path) {
  return fs.readFileSync(path, 'utf8');
}

module.exports = {
  // Preserve existing exports
  // ...
  greet,
  readFileSync, // New export
};