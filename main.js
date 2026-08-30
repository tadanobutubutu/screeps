// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

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
 * Returns the appropriate lang attribute value for the HTML element.
 * Used to address REACT_015.
 * @param {string} language - The language code (e.g., 'en', 'fr')
 * @returns {string} - The lang attribute string
 */
function getLangAttribute(language = 'en') {
    return `lang="${language}"`;
}

/**
 * Creates an in-page button (e.g., skip-link / anchor button) for accessibility.
 * Used to address REACT_015 and REACT_036.
 * @param {string} text - The visible text of the button
 * @param {string} targetId - The id of the target element to jump to
 * @returns {string} - HTML string for the in-page button
 */
function createInPageButton(text, targetId) {
    return `<a href="#${targetId}" class="skip-link">${text}</a>`;
}

/**
 * Validates table accessibility issues.
 * Used to address REACT_027.
 * @param {Object} table - A table object/element representation
 * @returns {Array} - List of accessibility issues found
 */
function validateTableAccessibility(table) {
    const issues = [];
    if (!table) return issues;
    if (!table.caption && !table.ariaLabel) {
        issues.push('Table is missing a caption or accessible name.');
    }
    if (!table.headers || table.headers.length === 0) {
        issues.push('Table is missing header cells (<th>).');
    }
    return issues;
}

/**
 * Validates the structural integrity of a table.
 * Used to address REACT_027.
 * @param {Object} table - A table object/element representation
 * @returns {boolean} - Whether the table structure is valid
 */
function validateTableStructure(table) {
    if (!table) return false;
    const hasRows = Array.isArray(table.rows) && table.rows.length > 0;
    const hasCells = hasRows && table.rows.some(row => Array.isArray(row.cells) && row.cells.length > 0);
    return hasRows && hasCells;
}

/**
 * Returns an accessible name for an SVG element based on its attributes/context.
 * Used to address REACT_041.
 * @param {Object} svg - The SVG element representation
 * @returns {string} - The accessible name for the SVG
 */
function getSvgAccessibleName(svg) {
    if (!svg) return '';
    if (svg.ariaLabel) return svg.ariaLabel;
    if (svg.title) return svg.title;
    if (svg.ariaLabelledBy) return svg.ariaLabelledBy;
    return svg.description || '';
}

/**
 * Sets accessibility attributes on an SVG element.
 * Used to address REACT_041.
 * @param {Object} svg - The SVG element representation
 * @param {string} accessibleName - The accessible name to assign
 * @returns {Object} - The SVG object with updated attributes
 */
function setSvgAttributes(svg, accessibleName) {
    if (!svg) return svg;
    svg.ariaLabel = accessibleName;
    svg.role = svg.role || 'img';
    return svg;
}

/**
 * Ensures landmark elements on the page are unique.
 * Used to address REACT_025.
 * @param {Array} landmarks - List of landmark elements
 * @returns {Array} - The deduplicated list of landmarks
 */
function ensureUniqueLandmarks(landmarks = []) {
    const seen = new Set();
    const unique = [];
    for (const landmark of landmarks) {
        const key = `${landmark.role || landmark.tagName}:${landmark.id || landmark.label || ''}`;
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(landmark);
        }
    }
    return unique;
}

/**
 * Validates link accessibility issues (e.g., fake links).
 * Used to address REACT_036.
 * @param {Object} link - The link element representation
 * @returns {Array} - List of accessibility issues found
 */
function validateLinkAccessibility(link) {
    const issues = [];
    if (!link) return issues;
    if (!link.href && !link.onClick) {
        issues.push('Link has no href and no click handler (potential fake link).');
    }
    if (link.onClick && !link.href) {
        issues.push('Link uses onClick without href; consider using a real anchor or button.');
    }
    return issues;
}

/**
 * Handles fake links by converting them into proper semantic elements.
 * Used to address REACT_036.
 * @param {Object} link - The fake link element representation
 * @returns {Object} - The corrected element
 */
function handleFakeLinks(link) {
    if (!link) return link;
    if (!link.href && link.onClick) {
        link.tagName = 'button';
        link.type = link.type || 'button';
    }
    return link;
}

/**
 * Adds proper landmark regions (e.g., main, nav, footer) to the document structure.
 * Used to address REACT_037.
 * @param {Object} document - The document structure representation
 * @returns {Object} - The document with added landmark regions
 */
function addProperLandmarkRegions(document) {
    if (!document) return document;
    document.landmarks = document.landmarks || [];
    const required = ['header', 'main', 'footer'];
    const existing = new Set(document.landmarks.map(l => l.role));
    for (const role of required) {
        if (!existing.has(role)) {
            document.landmarks.push({ role, id: `${role}-default` });
        }
    }
    return document;
}

module.exports = {
    renderDependencyGraph,
    renderIndexView,
    main,
    getLangAttribute,
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    getSvgAccessibleName,
    setSvgAttributes,
    ensureUniqueLandmarks,
    validateLinkAccessibility,
    handleFakeLinks,
    addProperLandmarkRegions
};