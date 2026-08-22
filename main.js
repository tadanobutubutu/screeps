// Existing code...

// Hypothetical conflict markers (you should not see these in your actual main.js)
// <<<<<<< HEAD
// <a id="unrotate" href="#">rotate back</a>
// >>>>>>> origin/main

// New code to replace the anchor with a button
document.getElementById('unrotate').outerHTML = `
  <button id="unrotate" onclick="rotateBack()">rotate back</button>
`;

// New function to handle the rotation action
function rotateBack() {
  // Implementation of the rotate back action
  // ...
}

// Rest of the code...