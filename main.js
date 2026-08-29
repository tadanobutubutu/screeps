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
        const suffix = Math.random().toString(36).substring(2, 9);
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
 * This function gets the full language attribute with region (if provided)
 * @returns {string} - the full language attribute with region (if provided)
 */
function getFullLangAttribute() {
    return document.documentElement.lang || '';
}

/**
 * This function gets the language attribute
 * @returns {string} - the language attribute
 */
function getLangAttribute() {
    const lang = document.documentElement.lang || '';
    return lang.split('-')[0] || lang;
}

/**
 * Function to remove the 'my-button' class, and set a specific id for the button element if it exists.
 * Assumes you have already set the id on the button element in your code.
 */
function replaceMyButtonId() {
    const button = document.querySelector('.my-button');
    if (button) {
        button.classList.remove('my-button');
        button.id = 'exampleButton';
    }
}

/**
 * Adds proper ARIA landmark regions to the document.
 * This improves screen reader navigation by ensuring proper landmark roles.
 *
 * @returns {void}
 */
function addProperLandmarkRegions() {
    // Create main landmark
    const main = document.querySelector('main') || document.createElement('main');
    main.setAttribute('role', 'main');
    main.id = 'main-content';

    // Create navigation landmark
    const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]') || document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    nav.id = nav.id || 'primary-navigation';

    // Create banner/header landmark
    const header = document.querySelector('header') || document.createElement('header');
    header.setAttribute('role', 'banner');
    header.id = header.id || 'site-header';

    // Create contentinfo/footer landmark
    const footer = document.querySelector('footer') || document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    footer.id = footer.id || 'site-footer';

    // Create aside landmark for complementary content
    const asides = document.querySelectorAll('aside');
    asides.forEach((aside, index) => {
        aside.setAttribute('role', 'complementary');
        if (!aside.id) aside.id = `sidebar-${index + 1}`;
    });
}

/**
 * Adds proper ARIA account management elements to the document.
 * This includes adding `aria-expanded` attributes for collapsible menus,
 * and adding `aria-label` to form elements.
 *
 * @returns {void}
 */
function addProperAccountManagement() {
    // Add aria-expanded to collapsible menus/buttons
    const collapsibles = document.querySelectorAll('[aria-expanded], .collapsible');
    collapsibles.forEach(element => {
        if (!element.hasAttribute('aria-expanded')) {
            element.setAttribute('aria-expanded', 'false');
        }
    });

    // Add aria-labels to form inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input, index) => {
        const id = input.id || `input-${index}`;
        input.id = id;
        if (!input.hasAttribute('aria-label')) {
            input.setAttribute('aria-label', `Input field ${index + 1}`);
        }
    });
}

/**
 * Adds ARIA attributes to form controls for better accessibility.
 * This function focuses on ensuring that form controls have proper labeling and roles.
 *
 * @returns {void}
 */
function addAriaToFormControls() {
    // Add required aria attributes to form controls
    const formControls = document.querySelectorAll('input, select, textarea');

    formControls.forEach(control => {
        // Ensure all form controls have accessible names
        if (control.id && !control.getAttribute('aria-label')) {
            const label = document.querySelector(`label[for="${control.id}"]`);
            if (label) {
                label.id = label.id || `label-${control.id}`;
                control.setAttribute('aria-labelledby', label.id);
            }
        }

        // Mark required fields appropriately
        if (control.required && !control.getAttribute('aria-required')) {
            control.setAttribute('aria-required', 'true');
        }
    });
}

// Function to remove the 'my-button' class, and set a specific id for the button element if it exists.
// Assumes you have already set the id on the button element in your code.

addAriaToFormControls();

module.exports = {
    addProperLandmarkRegions,
    addProperAccountManagement,
    addAriaToFormControls,
    replaceMyButtonId,
    getLangAttribute,
    getFullLangAttribute,
    ensureUniqueLandmarkId,
    uniqueLandmarks
};