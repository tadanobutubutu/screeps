const fs = require('fs');
const path = require('path');

// Existing code below
// ... (original code would continue here)

// Function to wrap content in a <main> landmark for accessibility
/**
 * Wraps content in a <main> element
 * @param {string} content - The HTML content to wrap
 * @returns {string} - Content wrapped in <main> tags
 */
function wrapInMainLandmark(content) {
    return `<main>\n${content}\n</main>`;
}

// Wrap the primary content (quality & metrics reports) in <main>
// This replicates the example structure from the conflict description
const primaryContent = `
<div class="container">
    <h2>Quality & Metrics Reports</h2>
    <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
    <div class="links">
        <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
        <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
    </div>
</div>
`;

const wrappedPrimary = wrapInMainLandmark(primaryContent);

// Export or use the wrapped primary content as needed
// Example usage: fs.writeFileSync('reports/index.html', wrappedPrimary);
module.exports = { wrappedPrimary, wrapInMainLandmark };


// Wrap the dependency graph table in <main> as well
const dependencyGraphContent = `
<table id="table-rotated">
    <!-- Example table rows -->
    <tr><th>Metric</th><th>Value</th></tr>
    <tr><td>Complexity</td><td>Medium</td></tr>
    <tr><td>Duplication</td><td>Low</td></tr>
</table>
`;

const wrappedDependencyGraph = wrapInMainLandmark(dependencyGraphContent);

// Export or use the wrapped dependency graph as needed
// Example usage: fs.writeFileSync('dependency-graph.html', wrappedDependencyGraph);
module.exports = { wrappedPrimary, wrapInMainLandmark, wrappedDependencyGraph };