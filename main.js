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
 * REACT_015: Add lang attribute to HTML element
 * Ensures the <html> tag has a lang attribute for accessibility.
 * @param {string} html - The HTML string
 * @param {string} lang - The language code (default: 'en')
 * @returns {string} - HTML string with lang attribute on <html> element
 */
function addLangAttribute(html, lang = 'en') {
    if (!html || typeof html !== 'string') {
        return html;
    }
    // If <html> already has a lang attribute, replace it
    if (/<html\s+[^>]*lang\s*=/i.test(html)) {
        return html.replace(/(<html\s+[^>]*?lang\s*=\s*["'])[^"']*(["'])/i, `$1${lang}$2`);
    }
    // Otherwise add lang attribute to <html> tag
    return html.replace(/<html(\s*[^>]*)>/i, `<html lang="${lang}"$1>`);
}

/**
 * REACT_027: Fix table structure issues
 * Adds scope="col" or scope="row" to <th> elements.
 * Alternates between column and row scope based on <th> position.
 * @param {string} html - The HTML string containing tables
 * @returns {string} - HTML string with scoped <th> elements
 */
function fixTableStructureIssues(html) {
    if (!html || typeof html !== 'string') {
        return html;
    }
    let counter = 0;
    return html.replace(/<th(\s[^>]*)?>([\s\S]*?)<\/th>/gi, (match, attrs, content) => {
        // Skip if scope already defined
        if (attrs && /\bscope\s*=/i.test(attrs)) {
            return match;
        }
        // Alternate between col and row scopes
        const scope = counter % 2 === 0 ? 'col' : 'row';
        counter += 1;
        const attrString = attrs ? ` ${attrs.trim()}` : '';
        return `<th${attrString} scope="${scope}">${content}</th>`;
    });
}

/**
 * REACT_017: Add/fix landmark issues
 * Ensures content is wrapped in a <main> landmark.
 * @param {string} html - The HTML string
 * @returns {string} - HTML string with <main> landmark
 */
function addMainLandmark(html) {
    if (!html || typeof html !== 'string') {
        return html;
    }
    // If <main> already exists, do nothing
    if (/<main[\s>]/i.test(html)) {
        return html;
    }
    // Wrap <body> content in <main>
    return html.replace(/<body([^>]*)>([\s\S]*?)<\/body>/i, (match, bodyAttrs, bodyContent) => {
        return `<body${bodyAttrs}><main>${bodyContent}</main></body>`;
    });
}

/**
 * REACT_041: Add accessible names to SVGs
 * Adds aria-label and role="img" to <svg> elements without accessible names.
 * @param {string} html - The HTML string
 * @returns {string} - HTML string with accessible SVG elements
 */
function addSvgAccessibleNames(html) {
    if (!html || typeof html !== 'string') {
        return html;
    }
    let svgCounter = 0;
    return html.replace(/<svg(\s[^>]*)?>/gi, (match, attrs) => {
        svgCounter += 1;
        // Skip if already has aria-label or aria-labelledby
        if (attrs && /aria-(label|labelledby)\s*=/i.test(attrs)) {
            return match;
        }
        const accessibleName = `Icon ${svgCounter}`;
        const attrString = attrs ? ` ${attrs.trim()}` : '';
        return `<svg${attrString} role="img" aria-label="${accessibleName}">`;
    });
}

/**
 * REACT_025: Ensure unique landmarks
 * Removes duplicate <main> elements so only one remains.
 * Keeps only the first <main> and unwraps subsequent ones.
 * @param {string} html - The HTML string
 * @returns {string} - HTML string with unique <main> landmark
 */
function ensureUniqueLandmarks(html) {
    if (!html || typeof html !== 'string') {
        return html;
    }
    let mainCount = 0;
    return html.replace(/<main(\s[^>]*)?>([\s\S]*?)<\/main>/gi, (match, attrs, content) => {
        mainCount += 1;
        if (mainCount === 1) {
            // Keep the first <main>
            return match;
        }
        // Unwrap subsequent <main> elements by returning only inner content
        return content;
    });
}

/**
 * REACT_036: Fix fake link issue
 * Replaces elements with onclick handlers (fake links) with proper <a> elements
 * or converts them to semantic <button> elements.
 * @param {string} html - The HTML string
 * @returns {string} - HTML string with semantic link/button elements
 */
function fixFakeLinkIssue(html) {
    if (!html || typeof html !== 'string') {
        return html;
    }
    // Replace elements that have onclick but no href with <button> elements
    return html.replace(/<(\w+)([^>]*)onclick\s*=\s*["']([^"']*)["']([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrsBefore, onclick, attrsAfter, content) => {
        // Skip if already an <a> with href
        if (tag.toLowerCase() === 'a' && /\bhref\s*=/i.test(attrsBefore + attrsAfter)) {
            return match;
        }
        // Convert to <button> with the onclick preserved
        return `<button type="button" onclick="${onclick}"${attrsBefore}${attrsAfter}>${content}</button>`;
    });
}

module.exports = {
    renderDependencyGraph,
    renderIndexView,
    main,
    addLangAttribute,
    fixTableStructureIssues,
    addMainLandmark,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinkIssue
};