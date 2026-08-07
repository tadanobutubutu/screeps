// main.js
// Preserve all existing code, exports, and functions

// Example of a new function that might be needed to fix a test
function newHelperFunction(param) {
  // Implementation that makes the test pass
  return param ? param.toString() : '';
}

// Preserve all existing exports
module.exports = {
  // ... existing exports
  newHelperFunction // Add new exports as needed
};