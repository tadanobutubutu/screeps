// Assuming the rest of the main.js content is here and is not conflicting
// ... (existing code)

// Update the HTML element from an anchor to a button
document.getElementById('unrotate').outerHTML = `
  <button id="unrotate" onclick="rotateBack()">rotate back</button>
`;

// Ensure the rotateBack function is defined if it's not already there
function rotateBack() {
  // ... (function implementation)
}

// ... (rest of the main.js content)