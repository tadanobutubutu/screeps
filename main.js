// Existing code from main.js
// ... (code before the conflict markers)

// Replace the <a> tag with a <button> tag
document.getElementById('unrotate').innerHTML = `
  <button id="unrotate" onclick="unrotate()">rotate back</button>
`;

// Functionality to be added
function unrotate() {
  // Implementation for the rotate back functionality
  // ...
}

// ... (code after the conflict markers)

// Existing code from main.js
// ... (rest of the main.js code)