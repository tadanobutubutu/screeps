// For the accessibility issue, replace the anchor tag with a button element
// This would be applied in the HTML file as follows:

// Before (problematic):
// <a id="unrotate" href="#">rotate back</a>

// After (accessible):
// <button id="unrotate" type="button">rotate back</button>

// If this needs to be handled in JavaScript, ensure event listeners are properly attached:
document.addEventListener('DOMContentLoaded', function() {
  const unrotateButton = document.getElementById('unrotate');
  if (unrotateButton) {
    unrotateButton.addEventListener('click', function() {
      // Handle the in-page action here
      // This replaces the previous anchor behavior
    });
  }
});