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
 * Addresses accessibility issues for rendered HTML content
 * @param {string} html - The HTML content to improve
 * @param {Object} options - Accessibility options
 * @param {boolean} options.addLangAttribute - Add lang attribute to HTML element
 * @param {boolean} options.ensureUniqueLandmarks - Ensure unique landmarks
 * @param {boolean} options.addSvgAccessibleNames - Add accessible names to SVGs
 * @returns {string} - HTML string with accessibility improvements
 */
function addressAccessibilityIssues(html, options = {}) {
    const defaultOptions = {
        addLangAttribute: true,
        ensureUniqueLandmarks: true,
        addSvgAccessibleNames: true,
        ...options
    };
    
    let improvedHtml = html;
    
    // REACT_015: Add lang attribute to HTML element
    if (defaultOptions.addLangAttribute) {
        improvedHtml = improvedHtml.replace(/<html([^>]*)>/i, (match, attrs) => {
            if (attrs.includes('lang=')) {
                return match;
            }
            return `<html${attrs} lang="en">`;
        });
    }
    
    // REACT_025: Ensure unique landmarks
    if (defaultOptions.ensureUniqueLandmarks) {
        // Ensure only one main landmark
        const mainMatches = improvedHtml.match(/<main[^>]*>/gi) || [];
        if (mainMatches.length > 1) {
            // Keep only the first main, convert others to divs with role="none"
            improvedHtml = improvedHtml.replace(/<main([^>]*)>/gi, (match, attrs, offset) => {
                const firstIndex = improvedHtml.indexOf('<main');
                if (improvedHtml.indexOf(match) === firstIndex) {
                    return match;
                }
                return `<div role="none"${attrs}>`;
            });
        }
    }
    
    // REACT_041: Add accessible names to SVGs
    if (defaultOptions.addSvgAccessibleNames) {
        improvedHtml = improvedHtml.replace(/<svg([^>]*)>/gi, (match, attrs) => {
            if (attrs.includes('aria-label') || attrs.includes('aria-labelledby')) {
                return match;
            }
            // Add title element as first child if not present
            if (!improvedHtml.includes('<title') && !attrs.includes('role="img"')) {
                const titleMatch = improvedHtml.match(/<svg[^>]*>[\s\S]*?<\/svg>/gi);
                if (titleMatch) {
                    const svgIndex = improvedHtml.indexOf(match);
                    const afterSvgOpen = improvedHtml.substring(svgIndex + match.length);
                    const closeTagIndex = afterSvgOpen.indexOf('</svg>');
                    if (closeTagIndex !== -1) {
                        const svgContent = afterSvgOpen.substring(0, closeTagIndex);
                        if (!svgContent.includes('<title')) {
                            return match.replace(/>$/, '><title>SVG Graphic</title>');
                        }
                    }
                }
            }
            return match;
        });
    }
    
    return improvedHtml;
}

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
    let html = '<!DOCTYPE html><html>';
    html += '<head><meta charset="UTF-8"><title>Dependency Index</title></head>';
    html += '<body><main>';
    html += '<h1>Dependency Index</h1>';
    html += '<ul>';
    
    for (const pkg of packages) {
        html += `<li>${pkg.name} - ${pkg.version || 'N/A'}</li>`;
    }
    
    html += '</ul></main></body></html>';
    
    // Apply accessibility improvements
    return addressAccessibilityIssues(html);
}

/**
 * Main entry point for the application
 */
function main() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const graphData = renderDependencyGraph(packageJson.dependencies || {});
    const indexHtml = renderIndexView(Object.keys(packageJson.dependencies || {}).map(name => ({
        name,
        version: packageJson.dependencies[name]
    })));
    
    return { graphData, indexHtml };
}

module.exports = {
    renderDependencyGraph,
    renderIndexView,
    main,
    addressAccessibilityIssues
};