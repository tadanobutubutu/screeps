document.getElementById('unrotate').innerHTML = `
  <button id="unrotate-button">rotate back</button>
`;

// Adding event listener to the new button
document.getElementById('unrotate-button').addEventListener('click', function() {
  // Your logic to rotate back OR the logic from the other branch if it is not redundant
  console.log('Rotating back...');
});

// Make sure to keep any existing code, exports, and functions
// that are not related to the issue. For example:
// export function someOtherFunction() {
//   // Existing function code
// }

// Merged logic from the other branch (if needed)
document.getElementById('unrotate').innerHTML += `
  <button id="reverse-button">reverse</button>
`;

// Adding event listener to the new button (if it was added in the other branch)
document.getElementById('reverse-button').addEventListener('click', function() {
  // Your logic to reverse, if the other branch introduced a reverse function and it's not redundant
  console.log('Reversing...');
});