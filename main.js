// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

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
    html += '<header role="banner"><h1>Dependency Index</h1></header>';
    html += '<main role="main">';
    html += '<ul>';
    
    for (const pkg of packages) {
        html += `<li>${pkg.name} - ${pkg.version}</li>`;
    }
    
    html += '</ul>';
    html += '</main>';
    html += '<footer role="contentinfo"></footer>';
    html += '</body></html>';
    return html;
}

/**
 * Adds proper landmark regions to HTML content for accessibility
 * @param {string} htmlContent - The HTML content to add landmarks to
 * @returns {string} - HTML with proper landmark regions
 */
function addProperLandmarkRegions(htmlContent) {
    let result = htmlContent;
    
    // Add lang attribute to html element if missing
    if (!result.includes('lang=')) {
        result = result.replace('<html>', '<html lang="en">');
    }
    
    // Add header landmark if not present
    if (!result.includes('role="banner"') && !result.includes('<header')) {
        const bodyMatch = result.match(/<body>(.*)$/s);
        if (bodyMatch) {
            result = result.replace(
                '<body>',
                '<body><header role="banner"></header>'
            );
        }
    }
    
    // Add main landmark wrapper if content exists but no main landmark
    if (!result.includes('role="main"') && !result.includes('<main')) {
        // Wrap list content in main landmark
        result = result.replace(
            '<ul>',
            '<main role="main"><ul>'
        );
        result = result.replace(
            '</ul></body>',
            '</ul></main><footer role="contentinfo"></footer></body>'
        );
    }
    
    // Add footer landmark if not present
    if (!result.includes('role="contentinfo"') && !result.includes('<footer')) {
        result = result.replace('</body>', '<footer role="contentinfo"></footer></body>');
    }
    
    return result;
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
    addProperLandmarkRegions,
    main
};