// Original main.js content
// ...

// New changes to add <main> tags to the affected HTML files
// This is a conceptual representation and would not be directly executable in a JavaScript file
// It is meant to illustrate the changes that should be made to the HTML files, not the JavaScript file.

// For docs/dependency-graph.html
// Wrap the existing content with a <main> tag
document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('table-rotated');
  const mainElement = document.createElement('main');
  mainElement.appendChild(mainContent);
  document.body.insertBefore(mainElement, document.body.firstChild);
});

// For docs/index.html
// Wrap the existing content with a <main> tag
document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.querySelector('.container');
  const mainElement = document.createElement('main');
  mainElement.appendChild(mainContent);
  document.body.insertBefore(mainElement, document.body.firstChild);
});

// ... Rest of the original main.js content
// ...