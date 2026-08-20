// Existing code and functions from main.js
// ...

// Add or modify the function to replace the fake link with a button
function updateGraphNavigation() {
  // ... existing code ...

  // Replace the fake link with a button
  const rotateBackLink = document.getElementById('unrotate');
  if (rotateBackLink) {
    rotateBackLink.outerHTML = `
      <button id="unrotate" onclick="rotateBack()">rotate back</button>
    `;
  }

  // ... existing code ...
}

// Ensure the new function is called at the appropriate time
// ...

// Call the function to update the navigation
updateGraphNavigation();