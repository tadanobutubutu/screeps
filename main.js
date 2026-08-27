// Example of how the main.js might have been incorrectly modified and then corrected

// Incorrect modification (syntax error)
// This is not typical for main.js, but if it were present, it would look like this:
// <<<<<<< HEAD
// <a id="unrotate" href="#">rotate back</a>
// =======
// <button id="unrotate" onclick="rotateBack()">rotate back</button>
// >>>>>>> origin/main

// Corrected main.js content (no HTML, only JavaScript)
function rotateBack() {
  // JavaScript code to rotate back
  console.log('Rotating back...');
}

// Assuming the button click is handled by JavaScript, here's how it might look:
document.getElementById('unrotate').addEventListener('click', rotateBack);