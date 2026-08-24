// Original code before conflict
const existingFunction = () => {
  // ... existing code ...
};

// Attempted to add an export for a function that was removed
// This is the code that caused the conflict
// const { myFunction } = require('./myFunction');
// module.exports.myFunction = myFunction;

// Conflicting changes from another branch
// <<<<<<< HEAD
const newFunction = () => {
  // ... new code ...
};

// >>>>>>> branch-name