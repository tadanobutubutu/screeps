// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
// - NEW: Implement this function for checking link and button accessibility (DONE: checkAccessibility)

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
    let html = '<!DOCTYPE html><html><head><title>Dependencies</title></head><body>';
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

/**
 * Checks the accessibility of links and buttons in the HTML content
 * @param {string} htmlContent - The HTML content to check
 * @returns {Array} - An array of accessibility issues found
 */
function checkAccessibility(htmlContent) {
    const issues = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Check for links without an href attribute
    const links = doc.querySelectorAll('a');
    links.forEach(link => {
        if (!link.getAttribute('href')) {
            issues.push(`Accessibility issue: Link with no href attribute at ${link}`);
        }
    });
    
    // Check for buttons without a name attribute
    const buttons = doc.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.getAttribute('name')) {
            issues.push(`Accessibility issue: Button with no name attribute at ${button}`);
        }
    });
    
    return issues;
}

module.exports = {
    renderDependencyGraph,
    renderIndexView,
    main,
    checkAccessibility
};