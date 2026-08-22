// main.js
// Existing imports and code
const fs = require('fs');
const path = require('path');

// -----------------------------------------------------------------------------
// HTML generation functions – updated to wrap primary content in <main>
// -----------------------------------------------------------------------------

/**
 * Generates the HTML for the dependency‑graph page.
 * The primary content (the table) is now wrapped in a <main> element.
 */
function generateDependencyGraphHtml() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dependency Graph</title>
</head>
<body>
  <main>
    <table id="table-rotated">
      <!-- table content -->
    </table>
  </main>
</body>
</html>
  `;
}

/**
 * Generates the HTML for the index page.
 * The primary content (the container with headings and links) is now wrapped
 * in a <main> element.
 */
function generateIndexHtml() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Index</title>
</head>
<body>
  <main>
    <div class="container">
      <h2>Quality &amp; Metrics Reports</h2>
      <p>
        This repository is fully optimized with automated tools. Explore the generated
        reports below:
      </p>
      <div class="links">
        <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
        <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
      </div>
    </div>
  </main>
</body>
</html>
  `;
}

// -----------------------------------------------------------------------------
// Existing exports – do NOT modify or remove any of them
// -----------------------------------------------------------------------------
module.exports = {
  generateDependencyGraphHtml, // ✅ preserved
  generateIndexHtml,           // ✅ preserved
  // ...any other exports that were present in the original file
};