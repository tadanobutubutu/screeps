// Existing code from main.js
// ... (Preserve all existing code, exports, and functions)

// Add the new function or change requested in the issue
function updateLanguageAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Call the function to update the attribute
updateLanguageAttribute();

// Rotate back button implementation
function setupUnrotate() {
  const unrotate = document.getElementById('unrotate');
  if (unrotate) {
    unrotate.addEventListener('click', function() {
      // Reset rotation to original state
      document.body.style.transform = 'rotate(0deg)';
    });
  }
}

// Use <button> instead of <a href="#"> for in-page actions
// <button id="unrotate">rotate back</button>

document.addEventListener('DOMContentLoaded', setupUnrotate);

// ... (Preserve all existing code, exports, and functions)