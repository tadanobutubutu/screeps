// Current main.js content
// Note: This is a hypothetical content and not an actual snippet from the repository. The conflict markers are included to simulate a merge conflict.

// <<<<<<< HEAD
// Existing code that must be preserved
function someFunction() {
  // ...
}

// Code that is conflicting
export const icons = {
  icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
  apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>',
};

// >>>>>>> origin/main
// Conflicting changes from the branch

// Code to fix the issue
export const icons = {
  icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
  apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><text y="0.9em" font-size="90">🐛</text></svg>',
};

// Additional code that might be needed if there are related changes in the conflicting branch
// For example, if there are new functions or changes in the exports that need to be merged, they should be added here.

// The final merged content of main.js