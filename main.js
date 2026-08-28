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
 * This function gets the full language attribute with region (if provided)
 * @returns {string} - the full language attribute with region (if provided)
 */
function getFullLangAttribute() {
    return document.documentElement.lang || '';
}

/**
 * Returns the language attribute of the document.
 * @returns {string} Language attribute.
 */
function getLangAttribute() {
    return document.documentElement.lang || '';
}

/**
 * Function to replace `my-button` with actual button id
 */
function replaceMyButtonId() {
    // Find the element with the `my-button` class and replace the class with the actual id.
    // Assuming you have already set the id on the button element in your code
    const button = document.querySelector('.my-button');
    if (button) {
        button.id = 'exampleButton';
        button.classList.remove('my-button');
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
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    main.id = 'main-content';

    // Create navigation landmark
    const nav = document.querySelector('nav') || document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    nav.id = nav.id || 'primary-navigation';
    if (!nav.getAttribute('aria-label')) {
        nav.setAttribute('aria-label', 'Main navigation');
    }

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
    const collapsibleMenus = document.querySelectorAll('[aria-haspopup="true"], [data-toggle="collapse"]');
    collapsibleMenus.forEach(menu => {
        if (!menu.hasAttribute('aria-expanded')) {
            menu.setAttribute('aria-expanded', 'false');
        }
        menu.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
    });

    // Ensure form inputs have aria-labels and ids if missing
    const formElements = document.querySelectorAll('input, select, textarea');
    formElements.forEach(element => {
        if (!element.getAttribute('aria-label') && !document.querySelector(`label[for="${element.id}"]`)) {
            const label = element.getAttribute('name') || element.getAttribute('placeholder') || 'Form field';
            element.setAttribute('aria-label', label);
        }
        // Ensure input has an id for accessibility
        if (element.tagName.toLowerCase() === 'input' && !element.id) {
            element.id = `input-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        }
    });

    // Add aria-expanded to elements with aria-controls (additional support)
    const collapsibles = document.querySelectorAll('[aria-controls]');
    collapsibles.forEach(element => {
        if (!element.hasAttribute('aria-expanded')) {
            element.setAttribute('aria-expanded', 'false');
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
    const formControls = document.querySelectorAll('button, input, select, textarea');

    formControls.forEach(control => {
        // Ensure all form controls have accessible names
        if (!control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby')) {
            const label = control.id ? document.querySelector(`label[for="${control.id}"]`) : null;
            if (label) {
                label.id = label.id || `label-${control.id}`;
                control.setAttribute('aria-labelledby', label.id);
            }
        }

        // Mark required fields appropriately
        if (control.hasAttribute('required') && !control.getAttribute('aria-required')) {
            control.setAttribute('aria-required', 'true');
        }
    });
}

// TODO: Address accessibility issues from insight report:
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

replaceMyButtonId();

addProperLandmarkRegions();
addProperAccountManagement();
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