document.getElementById('unrotate').innerHTML = `
  <button id="unrotate-button">rotate back</button>
`;

// Adding event listener to the new button
document.getElementById('unrotate-button').addEventListener('click', function() {
  // Your logic to rotate back
  console.log('Rotating back...');
});

// Make sure to keep any existing code, exports, and functions
// that are not related to the issue. For example:
// export function someOtherFunction() {
//   // Existing function code
// }