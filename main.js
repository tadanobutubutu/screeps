// Existing code from main.js
// ... (Preserve all existing code, exports, and functions)

// New function or changes requested to fix the REACT_036 issue
function rotateBack() {
  // Implementation of the rotate back functionality
  // ...
}

// Update the existing HTML element to use a button instead of an anchor tag
// This will ensure proper keyboard and screen reader behavior
document.getElementById('unrotate').outerHTML = `
  <button id="unrotate" onclick="rotateBack()">rotate back</button>
`;

// ... (Preserve all existing code, exports, and functions)