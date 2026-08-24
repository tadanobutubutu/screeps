// main.js

// Import or reference the HTML element if necessary
// For example:
// const rotateBackLink = document.getElementById('unrotate');

// If there's an event listener or a function that uses the link, you might want to
// remove it and add a button event listener instead.

// Example of removing an event listener (if one exists):
// rotateBackLink.removeEventListener('click', someFunction);

// Now, let's create a button in place of the anchor tag
const newButton = document.createElement('button');
newButton.id = 'unrotate';
newButton.textContent = 'rotate back';
newButton.addEventListener('click', function() {
  // Add the logic to rotate back here
  // For example, if there's a function that rotates the page back:
  // rotateBack();
});

// Replace the anchor tag with the new button element
// If there's a specific way this is done in your code, follow that pattern.
// For example:
// rotateBackLink.parentNode.replaceChild(newButton, rotateBackLink);

// If you need to remove the anchor tag and add the button manually:
const parent = rotateBackLink.parentNode;
parent.removeChild(rotateBackLink);
parent.appendChild(newButton);