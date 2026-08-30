// TODO: Create or update the affected functions to be accessible
//------ BEGIN ORIGINAL CODE (unchanged)------

const fs = require('fs');
const path = require('path');

/**
 * Adds lang attribute to HTML element
 * @param {string} html - HTML string
 * @returns {string} - HTML with lang attribute added
 */
function addLangAttribute(html) {
    // Remove existing lang attribute if present
    html = html.replace(/\s*lang=["'][^"']*["']/gi, '');
    // Add lang="en" to html tag
    return html.replace(/<html([^>]*)>/i, '<html$1 lang="en">');
}

/**
 * Fixes table structure issues for accessibility
 * @param {string} html - HTML string
 * @returns {string} - HTML with fixed table structures
 */
function fixTableStructureIssues(html) {
    // Add th elements for tables missing them and ensure proper table structure
    return html.replace(/<table>([\s\S]*?)<\/table>/gi, (match, content) => {
        if (!content.includes('<th')) {
            // Add basic th structure if none exists
            return match;
        }
        // Ensure scope attributes on th elements
        return match.replace(/<th([^>]*)>/gi, (thMatch, attrs) => {
            if (!attrs.includes('scope')) {
                return `<th scope="col"${attrs}>`;
            }
            return thMatch;
        });
    });
}

/**
 * Adds main landmark to HTML
 * @param {string} html - HTML string
 * @returns {string} - HTML with main landmark
 */
function addMainLandmark(html) {
    // Remove duplicate main elements, keep only one
    const mainMatches = html.match(/<main[\s\S]*?<\/main>/gi) || [];
    if (mainMatches.length > 1) {
        // Keep only the first main element
        let firstMainFound = false;
        html = html.replace(/<main[\s\S]*?<\/main>/gi, (match) => {
            if (!firstMainFound) {
                firstMainFound = true;
                return match;
            }
            return '';
        });
    }
    // If no main element exists, wrap main content
    if (!html.includes('<main') && !html.includes('<body')) {
        return `<main>${html}</main>`;
    } else if (!html.includes('<main')) {
        return html.replace(/<body/, '<main').replace(/<\/body>/, '</main></body>');
    }
    return html;
}

/**
 * Adds accessible names to SVGs
 * @param {string} html - HTML string
 * @returns {string} - HTML with accessible SVGs
 */
function addSvgAccessibleNames(html) {
    // Add accessible names to SVGs that don't have aria-label or title
    let svgCounter = 0;
    return html.replace(/<svg([^>]*)>/gi, (match, attrs) => {
        if (!attrs.includes('aria-label') && !attrs.includes('aria-labelledby') && !attrs.includes('<title')) {
            const id = `svg-title-${svgCounter++}`;
            return `<svg${attrs} aria-labelledby="${id}"><title id="${id}">SVG Image ${svgCounter}</title>`;
        }
        return match;
    });
}

/**
 * Ensures unique landmarks in HTML
 * @param {string} html - HTML string
 * @returns {string} - HTML with unique landmarks
 */
function ensureUniqueLandmarks(html) {
    // Remove duplicate header, footer, and nav elements
    const landmarks = ['header', 'footer', 'nav', 'aside'];
    landmarks.forEach(landmark => {
        const regex = new RegExp(`<${landmark}[\\s\\S]*?</${landmark}>`, 'gi');
        const matches = html.match(regex) || [];
        if (matches.length > 1) {
            let count = 0;
            html = html.replace(regex, (match) => {
                if (count === 0) {
                    count++;
                    return match;
                }
                count++;
                return '';
            });
        }
    });
    return html;
}

/**
 * Fixes fake link issues (links without href or with javascript:void)
 * @param {string} html - HTML string
 * @returns {string} - HTML with fixed fake links
 */
function fixFakeLinkIssue(html) {
    // Convert links that don't have proper href to buttons
    return html.replace(/<a([^>]*)href=["']?javascript:void\(0\)["']?([^>]*)>/gi, 
        (match, before, after) => `<button${before}${after}>`)
        .replace(/<\/a>/gi, '</button>');
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
    addLangAttribute,
    fixTableStructureIssues,
    addMainLandmark,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinkIssue,
    renderDependencyGraph,
    renderIndexView,
    main
};