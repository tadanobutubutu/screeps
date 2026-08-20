// Existing code from main.js...

// Placeholder for the rest of the main.js content
// Make sure to preserve any existing code, exports, and functions.

// Assuming there's a function that renders the 'rotate back' link
function renderRotateBackLink() {
  // The original code that would create the <a> element
  // <a id="unrotate" href="#">rotate back</a>;

  // Replace with a <button> element for better accessibility
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.textContent = 'rotate back';
  // Add any additional attributes or event listeners to the button as needed
  // ...

  // Replace the existing <a> element with the new <button> element
  // This assumes there is an existing reference to the <a> element
  const existingLink = document.getElementById('unrotate');
  if (existingLink) {
    existingLink.parentNode.replaceChild(button, existingLink);
  }
}

// Existing code that calls renderRotateBackLink...
// renderRotateBackLink();

// Placeholder for the rest of the main.js content
// Make sure to preserve any existing code, exports, and functions.