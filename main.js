// Existing code from main.js
// ...

// Changes requested by the issue
// Replace the anchor tag with a button for the 'rotate back' link
// This assumes that the original anchor tag was intended for an in-page action

document.getElementById('unrotate').innerHTML = `
  <button id="unrotate-button" onclick="unrotateFunction()">rotate back</button>
`;

// Add the function to handle the click event for the new button
function unrotateFunction() {
  // Implementation of the function to rotate back
  // ...
}

// Preserve the rest of the existing code
// ...