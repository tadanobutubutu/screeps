// ancient code
function example() {
  // ... existing code ...
}

// new code
// Rename this to tutorial
const tutorial = {
  newFunction: function () {
    // ... new code ...
  },
  // ... more new functions if any ...
};

// Export the functions
module.exports = {
  example,
  // ... re-export any functions from tutorial object if needed ...
  // ... more exports if any ...
  tutorial, // Export the entire tutorial object for testing purposes
};