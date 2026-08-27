// main.js

// Original code (potential conflict markers included)
// <<<<<<< HEAD
function rotateBack() {
  // Implementation for rotating back
}

// ========

// Changes to resolve the issue:
// Replace the <a> tag with a <button> for in-page actions
document.getElementById('unrotate').outerHTML = `
  <button id="unrotate" onclick="rotateBack()">rotate back</button>
`;

// >>>>>>> origin/master