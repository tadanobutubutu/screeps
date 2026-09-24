// TODO: This is the existing code that needs to be preserved

// New function as requested in the issue
function newFunction() {
  // New function implementation
  console.log('This is the new function.');
}

// Exporting the new function without removing or renaming any existing exports
module.exports = {
  ...module.exports, // Spread operator to preserve existing exports
  newFunction, // Adding the new function to the exports
};