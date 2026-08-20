// main.js

// Existing code before conflict markers
// <<<<<<< HEAD
// ... existing code ...
// ========

// New code to fix the issue
const htmlElement = document.querySelector('html');
if (htmlElement) {
  htmlElement.setAttribute('lang', 'en');
}

// Existing code after conflict markers
// >>>>>>> origin/main
// ... existing code ...