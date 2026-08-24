// Current main.js content
const unrotateButton = document.getElementById('unrotate');

// Assuming the following function exists and handles the rotation logic
function rotateContent() {
  // Rotate content logic here
}

// Event listener for the rotation action
unrotateButton.addEventListener('click', rotateContent);

// Additional accessibility improvements could include:
// 1. Adding an `aria-label` attribute to the button for screen readers
// 2. Ensuring that the button is focusable and navigable via keyboard

unrotateButton.setAttribute('aria-label', 'Rotate content back');

// Example of making the button focusable and navigable
if (!unrotateButton.hasAttribute('tabindex')) {
  unrotateButton.setAttribute('tabindex', '0');
}

// ...rest of the main.js file remains unchanged