// Original main.js content
// ...

// Changes requested in the issue
// Replace the anchor tag with a button for in-page actions
document.getElementById('unrotate').innerHTML = `
  <button id="unrotate-button">rotate back</button>
`;

// Add event listener to the new button for the same action
document.getElementById('unrotate-button').addEventListener('click', function() {
  // Code to rotate back
  // ...
});

// ...