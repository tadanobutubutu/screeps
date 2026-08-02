// File: src/managers/roomManager.js
// Assuming the lint error is due to the use of 'let' in a non-ES6 environment or a similar syntax error.

// Before:
// for (let i = 0; i < rooms.length; i++) {
//   // ... some code ...
// }

// After:
for (var i = 0; i < rooms.length; i++) {
  // ... some code ...
}

// The 'var' keyword is used instead of 'let' to ensure compatibility with older JavaScript environments.