// Ensure to preserve the original content of main.js
// ... (existing code before the conflict markers)

// Add the new function or change to fix the issue
const handleRotateBackClick = () => {
  // Logic to rotate back, if necessary
  console.log('Rotating back...');
};

// Update the HTML structure to replace the anchor with a button
// Note: The actual class names, IDs, and logic might differ based on the existing code.
// You'll need to ensure these match the actual elements and behavior in your application.
const unrotateLink = document.getElementById('unrotate');
if (unrotateLink) {
  unrotateLink.innerHTML = '<button id="unrotateButton" onclick="handleRotateBackClick()">rotate back</button>';
}

// ... (existing code after the conflict markers)