// main.js

// Existing code before conflict markers
// <<<<<<< HEAD
// ... existing code ...
// ========

// New code to fix the issue
// Ensure that only one <main> element exists in the document
const mainElements = document.querySelectorAll('main');
if (mainElements.length > 1) {
  // If there are multiple <main> elements, remove all but the first one
  mainElements.slice(1).forEach(main => main.remove());
}

// Existing code after conflict markers
// >>>>>>> origin/main
// ... existing code ...