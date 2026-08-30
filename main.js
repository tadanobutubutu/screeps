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
    const candidate = `${baseName}-${Date.now()}`;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 7);
        candidate = `${candidate}-${suffix}`;
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
 * Function to remove the 'my-button' class, and set a specific id for the button element if it exists.
 * Assumes you have already set the id on the button element in your code.
 */
function replaceMyButtonId() {
    const button = document.querySelector('.my-button');
    if (button) {
        button.id = 'accessibleButton'; // Modified the id to 'accessibleButton'
        button.classList.remove('my-button');
    }
}

// New function to add meaningful ARIA label for focusable elements
function addAriaLabels() {
    const focusableElements = document.querySelectorAll("[tabindex]:not([tabindex=-1])");

    // Add `aria-labelledby` to focusable elements
    focusableElements.forEach(elem => {
        // Find an associated label using class '.sr-only'
        const label = elem.nextElementSibling && elem.nextElementSibling.classList.contains('sr-only')
            ? elem.nextElementSibling : null;

        if (label) {
            elem.ariaLabelledBy = label.id;
        }
    });
}

// New function to add accessible names to all SVGs
function setSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg');

    // Add `aria-label` to all SVGs
    svgs.forEach(svg => {
        // Assume you've provided a method to get the accessible name for each SVG
        const accessibleName = getSvgAccessibleName(svg);
        svg.setAttribute('aria-label', accessibleName || '');
    });
}

// New function to obtain visible text for an SVG
function getSvgAccessibleName(svg) {
    // Provide your implementation to determine the accessible name for an SVG
    // In this example, let's assume a simple approach by using textContent
    return svg.textContent.trim();
}

// Call new functions at the end of the file
replaceMyButtonId();
addProperLandmarkRegions();
addProperAccountManagement();
addAriaToFormControls();
addAriaLabels();
setSvgAccessibleNames();

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addAriaToFormControls,
  replaceMyButtonId,
  getLangAttribute,
  getFullLangAttribute,
  ensureUniqueLandmarkId,
  uniqueLandmarks,
  addAriaLabels,
  setSvgAccessibleNames,
  getSvgAccessibleName // Add this function to the exports
};