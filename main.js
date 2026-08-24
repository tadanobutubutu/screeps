// ----- BEGIN ORIGINAL CODE (unchanged) -----
// TODO: This is the existing code that needs to be preserved
// ----- END ORIGINAL CODE -----

// Add new functions or changes as requested in the issue

// For example, if the issue requires adding a new function to handle rotation,
// and the anchor tag needs to be replaced with a button, here's how you could do it:

// Assuming there's a function that handles rotation, like this:
function rotate() {
  // ... existing rotation logic ...
}

// And a handler for the rotation button click, like this:
document.getElementById('unrotate').addEventListener('click', rotate);

// Replace the anchor tag with a button:
const anchorElement = document.getElementById('unrotate');
const buttonElement = document.createElement('button');
buttonElement.id = anchorElement.id;
buttonElement.textContent = anchorElement.textContent;
anchorElement.parentNode.replaceChild(buttonElement, anchorElement);

// Make sure the button still triggers the rotate function:
buttonElement.addEventListener('click', rotate);