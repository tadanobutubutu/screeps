// main.js

// Existing code before conflict markers
// <<<<<<< HEAD
// ... existing code ...
// ========

// New code to fix the issue
const thElements = document.querySelectorAll('th');
thElements.forEach(th => {
  if (!th.hasAttribute('scope')) {
    th.setAttribute('scope', 'col');
  }
});

// Existing code after conflict markers
// >>>>>>> origin/main
// ... existing code ...