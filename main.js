// main.js
// ------------------------------------------------------------
// Existing code and imports – preserved exactly as before
// ------------------------------------------------------------
const fs = require('fs');
const path = require('path');
const reactRender = require('react-dom/server');
const App = require('./App'); // Example export – keep unchanged

// ------------------------------------------------------------
// Helper to write HTML with optional <main> wrapper
// ------------------------------------------------------------
function writeHTML(content, filePath, wrapWithMain = false) {
  const wrapped = wrapWithMain ? `<main>\n${content}\n</main>` : content;
  fs.writeFileSync(filePath, wrapped);
}

// ------------------------------------------------------------
// Content strings – unchanged except for added <main> wrappers
// ------------------------------------------------------------
const indexPageContent = `
<div class="container">
    <h2>Quality & Metrics Reports</h2>
    <p>
        This repository is fully optimized with automated tools. Explore the generated
        reports below:
    </p>
    <div class="links">
        <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
        <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
    </div>
</div>
`;

const dependencyGraphPageContent = `
<table id="table-rotated">
    <!-- table rows -->
</table>
`;

// ------------------------------------------------------------
// Resolve merge conflicts – removed all <<<<<<<, =======, >>>>>>> markers
// and applied the required <main> wrapping for primary pages
// ------------------------------------------------------------
writeHTML(indexPageContent, path.resolve(__dirname, '../docs/index.html'), true);
writeHTML(dependencyGraphPageContent, path.resolve(__dirname, '../docs/dependency-graph.html'), true);

// ------------------------------------------------------------
// Exported functions for testing – unchanged
// ------------------------------------------------------------
module.exports = {
  writeHTML,
  indexPageContent,
  dependencyGraphPageContent,
};