// TODO: This is the existing code that needs to be preserved

// Import required module(s) and export the new necessary function(s) here
// Example: Importing the 'fs' module for file system operations
const fs = require('fs');

// New function to be exported
function readFileSync(path) {
  return fs.readFileSync(path, 'utf8');
}

module.exports = {
  // Preserve existing exports
  // ...
  readFileSync, // New export
};