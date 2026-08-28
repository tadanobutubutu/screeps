// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
document.querySelector('.dependencyGraph').setAttribute('role', 'tree');

// TODO: This is the existing code that needs to be preserved
// ... (your existing main.js code here)