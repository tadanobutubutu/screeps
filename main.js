// Assuming this is the section of main.js where the conflict is:
// <a id="unrotate" href="#">rotate back</a>

// Replace the <a> tag with a <button> element
// You would also need to handle the click event to perform the action
// that the original <a> tag was supposed to do.

document.getElementById('unrotate').innerHTML = `
  <button id="unrotateButton">rotate back</button>
`;

// Add an event listener to the new button element
document.getElementById('unrotateButton').addEventListener('click', function() {
  // Perform the action that was intended by the original link
  // This could be a function call, a direct manipulation of the DOM, etc.
  rotateBack();
});

// Define the rotateBack function if it doesn't already exist
function rotateBack() {
  // Implementation of the rotate back action
  // ...
}