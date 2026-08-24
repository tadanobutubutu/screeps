// Original main.js content remains unchanged

// Adding a new function to handle the rotate back action using a button element
function rotateBack() {
  // Logic to perform the rotation back action
  console.log('Rotating back...');
}

// Update the DOM to replace the anchor tag with a button
const rotateBackLink = document.getElementById('unrotate');
rotateBackLink.innerHTML = `<button onclick="rotateBack()">rotate back</button>`;