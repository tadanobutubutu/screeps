// main.js

// ... [other code] ...

// Before changes
// <a id="unrotate" href="#">rotate back</a>

// Changes to replace the anchor tag with a button for in-page action
// <button id="unrotate">rotate back</button>

document.addEventListener('DOMContentLoaded', () => {
  const unrotateButton = document.getElementById('unrotate');
  unrotateButton.addEventListener('click', () => {
    // Your existing functionality for the rotate back action here
    // For example, if there was a function `rotateBackFunction()`, you would call it
    // rotateBackFunction();
  });
});

// ... [rest of the main.js code] ...