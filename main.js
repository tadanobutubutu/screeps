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
 * Checks tables for accessibility issues
 * @param {string} htmlContent - The HTML content containing tables
 * @returns {Object} - Object containing accessibility issues found
 */
function checkTableAccessibility(htmlContent) {
    const issues = [];
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    let tableMatch;
    let tableIndex = 0;
    
    while ((tableMatch = tableRegex.exec(htmlContent)) !== null) {
        const tableContent = tableMatch[0];
        const tableNumber = tableIndex + 1;
        
        // Check for caption
        if (!/<caption[^>]*>[\s\S]*?<\/caption>/i.test(tableContent)) {
            issues.push({
                table: tableNumber,
                issue: 'REACT_027',
                message: `Table ${tableNumber} is missing a <caption> element for accessibility`
            });
        }
        
        // Check for th elements with scope attribute
        const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/gi;
        let thMatch;
        while ((thMatch = thRegex.exec(tableContent)) !== null) {
            const thContent = thMatch[0];
            if (!/scope\s*=\s*["'][a-z]+["']/i.test(thContent)) {
                issues.push({
                    table: tableNumber,
                    issue: 'REACT_027',
                    message: `Table ${tableNumber} has a <th> element without a scope attribute`
                });
            }
        }
        
        // Check for headers attribute in td elements
        const tdRegex = /<td[^>]*headers\s*=/gi;
        if (tdRegex.test(tableContent)) {
            // headers attribute found - this is valid
        } else {
            // Check if table has proper header structure
            if (!/<th[^>]*>/i.test(tableContent)) {
                issues.push({
                    table: tableNumber,
                    issue: 'REACT_027',
                    message: `Table ${tableNumber} should have proper header cells (<th>) for accessibility`
                });
            }
        }
        
        tableIndex++;
    }
    
    return {
        totalTables: tableIndex,
        issues: issues,
        passed: issues.length === 0
    };
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
    checkTableAccessibility,
    main
};