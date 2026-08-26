// Original main.js content (before conflict)
// ... [Existing code here] ...

// New changes to resolve the issue
function rotateBack() {
  // Existing logic to rotate back
}

// Update the element to use a button instead of an anchor
document.getElementById('unrotate').outerHTML = `
  <button id="unrotate" onclick="rotateBack()">rotate back</button>
`;

// ... [Rest of the main.js content] ...