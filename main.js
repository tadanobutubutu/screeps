// TODO: This is the existing code that needs to be preserved

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
            for (const dep of Object.keys(version.dependencies)) {
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
    let html = '<!DOCTYPE html><html lang="en"><head><title>Dependencies</title></head><body>';
    html += '<header><h1>Dependency Index</h1></header>';
    html += '<main><ul>';
    
    for (const pkg of packages) {
        html += `<li>${pkg.name} - ${pkg.version}</li>`;
    }
    
    html += '</ul></main>';
    html += '<footer><p>Generated on: ' + new Date().toLocaleString() + '</p></footer>';
    html += '</body></html>';
    return html;
}

/**
 * Adds landmark roles to the main content area of the index view
 * @returns {string} - HTML string for the index view with landmark roles
 */
function addLandmarkRolesToIndexView() {
    const html = renderIndexView([{ name: 'example', version: '1.0.0' }]);
    const modifiedHtml = html.replace('<main>', '<main role="main">');
    return modifiedHtml;
}

/**
 * Main entry point for the application
 */
function main() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const graphData = renderDependencyGraph(packageJson.dependencies || {});
    const indexHtml = addLandmarkRolesToIndexView();
    
    return { graphData, indexHtml };
}

module.exports = {
    renderDependencyGraph,
    renderIndexView,
    addLandmarkRolesToIndexView, // Added this function to handle the new requirement
    main
};