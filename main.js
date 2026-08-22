// Main entry point for generating HTML documentation
const fs = require('fs');
const path = require('path');

function generateDependencyGraphHTML() {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Screeps Dependency Graph</title>
  <style>
    /* CSS styles for the dependency graph */
  </style>
</head>
<body>
  <div id="dependency-graph"></div>
  <script src="graph.js"></script>
</body>
</html>`;

  const outputPath = path.join(__dirname, 'docs', 'dependency-graph.html');
  fs.writeFileSync(outputPath, htmlContent);
}

// Export functions for testing
module.exports = {
  generateDependencyGraphHTML,
  // Other existing exports remain unchanged
};