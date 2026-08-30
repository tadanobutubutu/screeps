// TODO: Address accessibility issues from insight report:
// - Include 'lang' attribute in HTML (Due to the static nature of the HTML, we can't dynamically add the lang attribute. It should be added at the HTML level or a parent higher up in the component hierarchy.)

const fs = require('fs');
const path = require('path');

/**
 * Renders a dependency graph visualization
 * @param {Object} dependencies - The dependencies object
 * @returns {string} - HTML string for the dependency graph
 */
function renderDependencyGraph(dependencies) {
    // ... Existing code ...
}

/**
 * Renders the index view with all packages
 * @param {Array} packages - List of packages to display
 * @returns {string} - HTML string for the index view
 */
function renderIndexView(packages) {
    // ... Existing code ...

    // Add tabIndex attribute to improve focus for non-Graphical User Interface (GUI) input methods like screen readers.
    let html = '<!DOCTYPE html><html lang="en"><head><title>Dependencies</title></head><body>';
    // ... Existing code ...
}

/**
 * Main entry point for the application
 */
function main() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const graphData = renderDependencyGraph(packageJson.dependencies || {});
    const indexHtml = renderIndexView([{ name: 'example', version: '1.0.0' }]);

    // Add 'aria-label' to provide an accessible name for the overall output
    const overallOutput = { graphData, indexHtml };
    return { ...overallOutput, 'aria-label': 'Dependency Graph and Index View' };
}

module.exports = {
    renderDependencyGraph,
    renderIndexView,
    main
};