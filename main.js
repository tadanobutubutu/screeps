// Main application logic
function rotate() {
  // Rotate functionality
}

function unrotate() {
  // Unrotate functionality
}

// Render the rotate back control as a button instead of an anchor tag
// This improves accessibility for keyboard users and screen readers
document.getElementById('controls').innerHTML = `
  <button id="unrotate" type="button">rotate back</button>
`;

// Add event listener
document.getElementById('unrotate').addEventListener('click', unrotate);

// Export functions for testing
module.exports = { rotate, unrotate };