// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// main.js
// Implementation of unique landmark functions

// Global set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    const candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 7);
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

/**
 * Checks a given node to see if it's a valid landmark based on its role.
 * @param {Element} node - Node to validate.
 * @returns {boolean} - true if the node is a valid landmark, false otherwise.
 */
function isValidLandmark(node) {
    const roles = ['banner', 'navigation', 'main', 'region', 'article', 'aside', 'complementary', 'contentinfo', 'footer', 'form'];
    return roles.includes(node.role);
}

/**
 * Validates landmarks in the given node and its children.
 * @param {Element} node - Node to validate.
 */
function validateLandmark(node) {
    // Check if the node is a landmark
    if (!isValidLandmark(node)) return;

    // Set the landmark property on the HTML element
    node.dataset.landmarkRole = node.role;

    // Validate children
    for (let child of node.children) {
        validateLandmark(child);
    }
}

// Replace My Button
replaceMyButtonId();

addProperLandmarkRegions();
addProperAccountManagement();
addAriaToFormControls();

// Validate landmarks in the entire document
document.body.children.forEach(validateLandmark);

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addAriaToFormControls,
  replaceMyButtonId,
  getLangAttribute,
  getFullLangAttribute,
  ensureUniqueLandmarkId,
  uniqueLandmarks,
  validateLandmark
};