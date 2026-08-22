// Current main.js content
// Please note that the provided main.js content includes conflict markers, which
// are typically used in version control systems to show differences between
// branches. The actual code without conflict markers is provided below.

// Before
/*
<<<<<<< HEAD
function rotateBack() {
  window.location.hash = 'previous';
}

document.getElementById('unrotate').addEventListener('click', rotateBack);
=======
function rotateBack() {
  window.location.hash = '';
}

document.getElementById('unrotate').addEventListener('click', rotateBack);
>>>>>>> feature/branch
*/
// End of before

// After
function rotateBack() {
  // This function now appends a hash to the URL, which will change the hash but not the full URL.
  window.location.hash = 'previous';
}

// Use a button instead of an anchor for better accessibility
const rotateBackButton = document.createElement('button');
rotateBackButton.id = 'unrotate';
rotateBackButton.textContent = 'rotate back';
rotateBackButton.addEventListener('click', rotateBack);

// Append the button to the document body or relevant container
document.body.appendChild(rotateBackButton);

// Ensure that the existing exports are preserved
export function someExistingFunction() {
  // Implementation...
}

export class SomeExistingClass {
  // Constructor and methods...
}