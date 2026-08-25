// main.js
// REACT_015 fix: Added lang="en" to the html element for screen reader compatibility

/**
 * Returns the HTML document string for the dependency graph.
 * Ensures the root element includes the required language attribute.
 * @returns {string} - Complete HTML document with lang="en"
 */
function getDependencyGraphHTML() {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dependency Graph</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
}

// Export for Jest test suite compatibility
if (typeof module !== "undefined" && module.exports) {
  module.exports = { getDependencyGraphHTML };
}