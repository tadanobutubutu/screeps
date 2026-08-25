// main.js

// ... (existing code, exports, and functions)

// Add the new function or changes requested in the issue
function rotateBack() {
  // Your logic for rotating back, possibly triggered by button click
}

// Change the <a> tag to a <button> with appropriate accessibility features
document.getElementById('unrotate').replaceWith(`
  <button id="unrotate" onclick="rotateBack()">rotate back</button>
`);

// ... (rest of the existing code)

// Example usage of the new function, assuming it is called from somewhere else in your code
rotateBack(); // Replace this with the actual usage case

// ... (rest of the existing code)