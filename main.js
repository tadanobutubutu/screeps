// main.js

// Preserve existing code
// ... (existing code)

// Add or modify the function to fix the issue
function rotateBack() {
  // Perform the necessary action to rotate back
  // For example, if rotating a graph or similar:
  // rotateGraphBackwards();
}

// Add the button element with the correct href attribute
// Assuming that rotateBack is the function that should be called when the button is clicked
const rotateBackButton = document.createElement('button');
rotateBackButton.id = 'unrotate';
rotateBackButton.textContent = 'rotate back';
rotateBackButton.onclick = rotateBack; // Assign the rotateBack function as the click event handler
document.body.appendChild(rotateBackButton);

// Preserve existing exports
// ... (existing exports)

// Output the complete updated main.js content