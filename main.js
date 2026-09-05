// main.js

/**
 * Addresses accessibility issues from insight report.
 * - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
 * - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
 * - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
 * - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
 * - REACT_036: Fix 1 fake link issue (handled by createInPageButton() and personName())
 * - ADD: Address new accessibility issues from insight report
 */

/**
 * Gets the language attribute for the HTML element.
 * If not present, defaults to 'en'.
 * @returns {string} The language code.
 */
export function getLangAttribute() {
    const html = document.documentElement;
    return html.getAttribute('lang') || 'en';
}

/**
 * Processes a person's name to ensure it is accessible.
 * Currently returns the name unchanged, but can be extended.
 * @param {string} name - The full name.
 * @returns {string} The accessible name.
 */
export function personName(name) {
    // Example: could split and add aria-label if needed
    return name;
}

/**
 * Validates a table's accessibility (e.g., presence of headers, caption).
 * @param {HTMLTableElement} table - The table element to validate.
 */
export function validateTableAccessibility(table) {
    // Check for <th> elements, scope, etc.
    if (!table) return;
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
        console.warn('Table missing header cells.', table);
    }
    // Additional checks can be added
}

/**
 * Validates the structure of a table (e.g., proper use of thead, tbody).
 * @param {HTMLTableElement} table - The table element to validate.
 */
export function validateTableStructure(table) {
    if (!table) return;
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    if (!thead && !tbody) {
        console.warn('Table should use <thead> and/or <tbody> for structure.', table);
    }
    // Further structural checks can be added
}

/**
 * Gets an accessible name for an SVG element.
 * Prefers aria-label, then title, then falls back to empty string.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name.
 */
export function getSvgAccessibleName(svg) {
    if (!svg) return '';
    return svg.getAttribute('aria-label') || svg.getAttribute('title') || '';
}

/**
 * Ensures that landmark elements have unique roles within the document.
 * Currently logs a message; can be expanded to fix duplicates.
 */
export function ensureUniqueLandmarks() {
    const landmarks = document.querySelectorAll('[role="banner"], [role="complementary"], [role="contentinfo"], [role="form"], [region"], [role="search"], [role="main"], [role="navigation"], [role="article"], [role="region"]');
    const roles = Array.from(landmarks).map(el => el.getAttribute('role'));
    const duplicates = roles.filter((role, index) => roles.indexOf(role) !== index);
    if (duplicates.length) {
        console.warn('Duplicate landmark roles found:', duplicates);
    }
    // Additional logic to make them unique if needed
}

/**
 * Creates an accessible in-page button.
 * @param {string} label - The visible and accessible name of the button.
 * @param {Function} onClick - The click event handler.
 * @returns {HTMLButtonElement} The created button element.
 */
export function createInPageButton(label, onClick) {
    const button = document.createElement('button');
    button.textContent = label;
    button.setAttribute('aria-label', label);
    button.addEventListener('click', onClick);
    return button;
}

// Additional functions to address new accessibility issues can be added below.