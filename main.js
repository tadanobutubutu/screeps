// main.js - Accessibility utilities for SVG elements

/**
 * Adds aria-hidden="true" to SVG icon elements used for decorative purposes
 * This fixes the REACT_041 warning for missing accessible names
 * 
 * @param {string} svgContent - The SVG content string
 * @returns {string} - SVG content with aria-hidden attribute added
 */
function makeIconAccessible(svgContent) {
    // Match SVG opening tag and add aria-hidden if not already present
    return svgContent.replace(
        /<svg(?![^>]*aria-hidden)([^>]*)>/gi,
        '<svg aria-hidden="true"$1>'
    );
}

/**
 * Validates that icon SVGs have proper accessibility attributes
 * 
 * @param {string} filePath - Path to the layout file
 * @param {string} svgContent - The SVG icon content
 * @returns {Object} - Validation result with pass/fail status
 */
function validateIconAccessibility(svgContent) {
    const hasAriaHidden = /aria-hidden=["']true["']/.test(svgContent);
    const hasAriaLabel = /aria-label=/.test(svgContent);
    const hasTitle = /<title[^>]*>/.test(svgContent);
    
    const isAccessible = hasAriaHidden || hasAriaLabel || hasTitle;
    
    return {
        pass: isAccessible,
        message: isAccessible 
            ? 'SVG icon has proper accessible name'
            : 'SVG icon is missing accessible name (REACT_041)'
    };
}

module.exports = {
    makeIconAccessible,
    validateIconAccessibility
};