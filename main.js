// Original main.js content (before conflict markers)
// ...

// Changes requested to resolve the issue:
// Replace the anchor tag with a button for in-page actions
// and add an event listener to handle the rotation action.

document.addEventListener('DOMContentLoaded', () => {
  // ... existing code ...

  // Get the element with the id "unrotate"
  const unrotateButton = document.getElementById('unrotate');

  // Replace the anchor tag with a button
  unrotateButton.outerHTML = `
    <button id="unrotate" onclick="rotateBack()">rotate back</button>
  `;

  // Define the rotateBack function
  function rotateBack() {
    // Add the logic to rotate back here
    // ...
  }

  // ... existing code ...
});

// ... rest of the main.js content ...