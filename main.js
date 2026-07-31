// src/managers/roomManager.js
// Assuming the fix needed is changing 'let' to 'var' for ES5 compatibility

// Example structure (please replace with actual code):
const roomManager = {
  // ... existing code up to line 82 ...
  
  // Line 83 - Fixed: changed 'let' to 'var' for ES5 compatibility
  someFunction: function() {
    var variableName = 'value';
    // ... rest of the function
  },
  
  // ... existing code after line 83 ...
};

module.exports = roomManager;