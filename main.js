// Preserve existing code from main.js
// ... (existing code before conflict markers)

// Add the new function or change requested in the issue
const originalContent = document.getElementById('unrotate').innerHTML;
document.getElementById('unrotate').outerHTML = `<button id="unrotate">${originalContent}</button>`;

// ... (existing code after conflict markers)

// Do not remove or rename any existing exports
// ... (existing exports)

// Output the complete updated main.js content