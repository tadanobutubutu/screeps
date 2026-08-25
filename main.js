// Assuming the rotateBack function is defined elsewhere in your codebase
function rotateBack() {
  // Your existing rotateBack logic here
}

// Updated main.js content
// No changes to existing code, only the HTML element is replaced
// The JavaScript code is assumed to be preserved as it is not shown
document.addEventListener('DOMContentLoaded', () => {
  // Your existing JavaScript code that runs after the DOM is fully loaded
  // ...

  // Replace the <a> tag with a <button> element
  const unrotateLink = document.getElementById('unrotate');
  if (unrotateLink) {
    unrotateLink.outerHTML = '<button id="unrotate" onclick="rotateBack()">rotate back</button>';
  }

  // Continue with the rest of your JavaScript code
  // ...
});