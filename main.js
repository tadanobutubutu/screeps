// TODO: Address accessibility issues from insight report — FIXED

// TODO: Identify and update specific functions that render dependency graphs or
// index views.

const fs = require('fs');
const path = require('path');

/**
 * Renders a dependency graph visualization
 * @param {Object} dependencies - The dependencies object
 * @returns {string} - HTML string for the dependency graph
 */
function renderDependencyGraph(dependencies) {
    const nodes = [];
    const edges = [];
    
    for (const [name, version] of Object.entries(dependencies)) {
        nodes.push({ id: name, label: `${name}@${version}` });
        
        // For nested dependencies, create edges
        if (typeof version === 'object' && version.dependencies) {
            for (const dep of version.dependencies) {
                edges.push({ from: name, to: dep });
            }
        }
    }
    
    return JSON.stringify({ nodes, edges });
}

/**
 * Renders the index view with all packages
 * @param {Array} packages - List of packages to display
 * @returns {string} - HTML string for the index view
 */
function renderIndexView(packages) {
    let html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Dependency Index</title></head><body>';
    html += '<h1>Dependency Index</h1>';
    html += '<ul>';
    
    for (const pkg of packages) {
        html += `<li>${pkg.name} - ${pkg.version}</li>`;
    }
    
    html += '</ul></body></html>';
    return html;
}

/**
 * Main entry point for the application
 */
function main() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const graphData = renderDependencyGraph(packageJson.dependencies || {});
    const indexHtml = renderIndexView([{ name: 'example', version: '1.0.0' }]);
    
    return { graphData, indexHtml };
}

module.exports = {
    renderDependencyGraph,
    renderIndexView,
    main
};