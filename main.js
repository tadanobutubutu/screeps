// Assuming the main.js file is a JavaScript file that includes the HTML content of the `docs/dependency-graph.html` file.

// ... (other code in main.js)

// Before:
// <a id="unrotate" href="#">rotate back</a>

// Replace the <a> tag with a <button> element
// Ensure it's accessible and can be interacted with using the keyboard
// <button id="unrotate" role="button" aria-label="rotate back" aria-aguide="true" tabindex="0" onfocus="this.blur()" onclick="rotateBack()">rotate back</button>

// ... (other code in main.js)

// If the `rotateBack` function is defined elsewhere in main.js, ensure it's called when the button is clicked.
// If not, define it here:
function rotateBack() {
  // Your code to rotate back
}

// ... (other code in main.js)

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support (table of contents example)
// <ul id="table-of-contents">
//   <li id="header-1" tabindex="0">Header 1</li>
//   <li id="header-2" tabindex="0">Header 2</li>
//   ...
// </ul>

// Check that ARIA attributes are correctly paired and have appropriate values (example with a graph container)
// <div id="graph-container" role="region" aria-labelledby="graph-title">
//   <h1 id="graph-title">Dependency Graph</h1>
// </div>