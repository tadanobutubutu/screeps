// Before:
// <a id="unrotate" href="#">rotate back</a>

// After:
document.getElementById('unrotate').addEventListener('click', () => {
  // Add the logic that was previously in the href attribute
  // For example, if you had some JavaScript logic to rotate back, you would place it here
  rotateBack();
});

function rotateBack() {
  // Your rotate back logic here
  console.log('Rotating back...');
}

// Make sure that the rotateBack function is accessible to the click event listener
// This might mean moving it to a global scope or ensuring it's exported properly