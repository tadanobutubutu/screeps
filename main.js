// Existing code from main.js that needs to be preserved
// ... (Preserve all the code that is above the conflict markers)

// New function or changes requested in the issue
function rotateBack() {
  // Your implementation here
  console.log('Rotating back...');
  // Add any necessary logic to perform the "rotate back" action
}

// Replace the <a> tag with a <button> tag and ensure it calls the rotateBack function
document.getElementById('unrotate').innerHTML = `
  <button id="unrotate" onclick="rotateBack()">rotate back</button>
`;

// ... (Preserve all the code that is below the conflict markers)