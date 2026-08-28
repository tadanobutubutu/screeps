// Assuming the main.js file is a JavaScript file that includes the HTML content of the `docs/dependency-graph.html` file.

// ... (other code in main.js)

// Before:
// <a id="unrotate" href="#">rotate back</a>

// After:
// Replace the <a> tag with a <button> element
// Keep the existing ID for accessibility purposes
// <button id="unrotate" role="button" aria-label="rotate back" onclick="rotateBack()">rotate back</button>

// ... (other code in main.js)

// If the `rotateBack` function is defined elsewhere in main.js, ensure it's called when the button is clicked.
// If not, define it here:
function rotateBack() {
  // Your code to rotate back
}

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

// Here we check if the rotateBack function is defined within the main.js file
if (typeof rotateBack !== 'function') {
  console.error('Function rotateBack is not defined in the main.js file.');
}