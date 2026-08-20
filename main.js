// Assuming the original code looks something like this:
// <a id="unrotate" href="#">rotate back</a>

// Replace it with the following code:
document.getElementById('unrotate').outerHTML = `
  <button id="unrotate" onclick="rotateBack()">rotate back</button>
`;

// Add the following function to handle the rotation action:
function rotateBack() {
  // ... logic to rotate back ...
  console.log('Rotating back...');
}