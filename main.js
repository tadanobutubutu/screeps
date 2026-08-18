// Original main.js content
// ...

// Add the new function or changes requested in the issue
function rotateBack() {
  // Implementation of the rotate back functionality
  // ...
}

// Update the existing HTML to use the button instead of an anchor tag
// Assuming there is a function that updates the DOM, for example:
// updateDOMElement(selector, newContent)

const rotateBackButton = document.createElement('button');
rotateBackButton.id = 'unrotate';
rotateBackButton.textContent = 'rotate back';
rotateBackButton.onclick = rotateBack;

// Replace the anchor tag with the new button element
updateDOMElement('#unrotate', rotateBackButton);

// ...