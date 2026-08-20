// Preserve existing code from main.js
// ... (existing code)

// Add or modify the code as requested in the issue
// Assuming the original code looked something like this:
// <a id="unrotate" href="#">rotate back</a>

// Replace it with a button element
document.getElementById('unrotate').innerHTML = `
  <button id="unrotate-button">rotate back</button>
`;

// Ensure the button has the appropriate event listener if needed
// For example, if the button needs to trigger a function:
document.getElementById('unrotate-button').addEventListener('click', function() {
  // Code to rotate back
});

// ... (rest of the main.js code)