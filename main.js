// Preserve all existing code from main.js
// Then add the following fix for the React Fake Link issue:

// Replace the problematic <a> element with a proper <button> element
// This change addresses the REACT_036 warning about using hash-only hrefs
function rotateBack() {
  // Your existing rotation logic here
  // For example:
  // document.getElementById('graph').style.transform = 'rotate(0deg)';
}

document.addEventListener('DOMContentLoaded', function() {
  // Add the button to the DOM
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.textContent = 'rotate back';
  button.onclick = rotateBack;

  // Insert the button where the original link was
  const originalLink = document.getElementById('unrotate');
  if (originalLink) {
    originalLink.parentNode.replaceChild(button, originalLink);
  }
});