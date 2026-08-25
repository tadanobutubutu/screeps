// main.js
// Fix for REACT_025: React Unique Landmarks
// Ensure only one <main> landmark exists in the component tree.
// Use <section> or <article> for other regions to avoid multiple <main> elements.

/**
 * Returns a landmark element type.
 * Use 'main' only once per page; use 'section' or 'article' for other regions.
 * @param {boolean} isPrimary - Whether this is the primary content region
 * @returns {string} The element type to use
 */
function getLandmarkType(isPrimary) {
    return isPrimary ? 'main' : 'section';
}

/**
 * Wraps content in a landmark element.
 * Ensures only one <main> exists by using <section> for non-primary regions.
 * @param {boolean} isPrimary - Whether this is the primary content region
 * @param {string} ariaLabel - The aria-label for the landmark
 * @param {string} content - The content to wrap
 * @returns {string} The wrapped HTML string
 */
function wrapWithLandmark(isPrimary, ariaLabel, content) {
    const tag = getLandmarkType(isPrimary);
    return `<${tag} aria-label="${ariaLabel}">${content}</${tag}>`;
}

/**
 * Validates that a rendered output contains only one <main> element.
 * @param {string} html - The HTML string to validate
 * @returns {boolean} True if only one <main> element exists
 */
function hasSingleMainLandmark(html) {
    const mainMatches = html.match(/<main[\s>]/g);
    return mainMatches !== null && mainMatches.length === 1;
}

// Export the helpers so they can be used in React components to ensure
// unique landmark compliance (REACT_025).
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getLandmarkType,
        wrapWithLandmark,
        hasSingleMainLandmark,
    };
}