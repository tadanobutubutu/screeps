// Original content before conflict markers
// ...

// New changes requested in the issue
function rotateBack() {
  // Implementation for rotating back
}

// Replacing the anchor tag with a button
document.getElementById('unrotate').outerHTML = `
  <button onclick="rotateBack()">rotate back</button>
`;

// ...
// Rest of the main.js content
// ...