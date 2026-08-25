// Assuming the rotateBack function is defined elsewhere in your codebase
function rotateBack() {
  // Your existing rotateBack logic here
}

document.addEventListener('DOMContentLoaded', () => {
  // Your existing JavaScript code that runs after the DOM is fully loaded
  // ...

  // Check if the unrotate link or rotateBack button exists
  const unrotateLink = document.getElementById('unrotate');
  const rotateBackButton = document.getElementById('rotateBackButton');

  // If unrotate link exists, replace it with a button
  if (unrotateLink) {
    unrotateLink.outerHTML = '<button id="unrotate" onclick="rotateBack()">rotate back</button>';
  }

  // If rotateBack button exists, use it instead
  if (rotateBackButton) {
    rotateBackButton.click();
  }

  // Continue with the rest of your JavaScript code
  // ...
});