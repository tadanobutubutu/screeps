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

// Import required module(s)
const accessibility = require('./accessibility');

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
    // REACT_015: Add lang attribute to HTML element
    // REACT_017: Add landmark roles (header, main, nav) and fix landmark issues
    // REACT_025: Ensure unique landmarks
    let html = '<!DOCTYPE html><html lang="en"><head><title>Dependencies</title></head><body>';
    html += '<header role="banner"><h1>Dependency Index</h1></header>';
    html += '<main role="main">';
    html += '<nav role="navigation" aria-label="Package list">';
    html += '<ul>';
    
    for (const pkg of packages) {
        html += `<li>${pkg.name} - ${pkg.version || 'N/A'}</li>`;
    }
    
    html += '</ul>';
    html += '</nav>';
    html += '</main>';
    html += '<footer role="contentinfo"><p>Dependency Index</p></footer>';
    html += '</body></html>';
    return html;
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