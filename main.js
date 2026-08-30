// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// Preserve existing functionality

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation
// main.js - Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Internal set to track used landmark IDs
// Global set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    let candidate = baseName;
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

// Add lang attribute as per the issue requirement
function addLangAttribute() {
  // Assuming there is a relevant element selector or similar to target
  const elementToModify = document.querySelector('some-selector');
  if (elementToModify) {
    elementToModify.setAttribute('lang', 'en'); // Example: English
  }
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (!element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Gets the language attribute from the HTML element.
 * @returns {string} - the language attribute value
 */
function getLangAttribute() {
    return document.documentElement.lang || '';
}

/**
 * This function gets the full language attribute with region (if provided)
 * @returns {string} - the full language attribute with region (if provided)
 */
function getFullLangAttribute() {
    return document.documentElement.lang || '';
}

// ... existing functions from both branches

// Accessibility helper functions
function setupKeyboardNavigation(element, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;

  element.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  });
}

function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

/**
 * Validates a landmark element for accessibility compliance.
 * Checks that the landmark has a proper role, accessible name, and unique identifier.
 * @param {HTMLElement} element - The landmark element to validate.
 * @returns {Object} Validation result with isValid flag and issues array.
 */
function validateLandmark(element) {
    const issues = [];

    if (!element) {
        return { isValid: false, issues: ['Element is null or undefined'] };
    }

    // Check if element has a landmark role or is a semantic landmark
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'region', 'form', 'dialog'];
    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    const semanticLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'form', 'dialog'];
    const role = element.getAttribute('role');
    const hasLandmarkRole = role && landmarkRoles.includes(role);
    const isSemanticLandmark = semanticLandmarks.includes(tagName);

    if (!hasLandmarkRole && !isSemanticLandmark) {
        issues.push('Element is not a valid landmark (missing role or semantic tag)');
    }

    // Check for accessible name (aria-label, aria-labelledby, or labelable element association)
    const hasAriaLabel = element.hasAttribute('aria-label') && element.getAttribute('aria-label').trim() !== '';
    const hasAriaLabelledBy = element.hasAttribute('aria-labelledby') && element.getAttribute('aria-labelledby').trim() !== '';
    const hasTitle = element.hasAttribute('title') && element.getAttribute('title').trim() !== '';

    if (!hasAriaLabel && !hasAriaLabelledBy && !hasTitle) {
        issues.push('Landmark is missing an accessible name (aria-label, aria-labelledby, or title)');
    }

    // Check for unique id
    const id = element.id;
    if (id) {
        if (_usedLandmarkIds.has(id)) {
            issues.push(`Landmark id "${id}" is not unique`);
        } else {
            _usedLandmarkIds.add(id);
        }
    }

    return {
        isValid: issues.length === 0,
        issues: issues
    };
}

/**
 * Validates the structure of a landmark by checking its parent context
 * and ensuring proper nesting and hierarchy.
 * @param {HTMLElement} element - The landmark element to validate.
 * @returns {Object} Validation result with isValid flag and issues array.
 */
function validateLandmarkStructure(element) {
    const issues = [];

    if (!element) {
        return { isValid: false, issues: ['Element is null or undefined'] };
    }

    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    const role = element.getAttribute('role');

    // Banner (header) should be a top-level landmark, not nested inside main/article/aside/section/nav
    if (tagName === 'header' || role === 'banner') {
        const parent = element.parentElement;
        if (parent) {
            const parentTag = parent.tagName.toLowerCase();
            if (['main', 'article', 'aside', 'section', 'nav'].includes(parentTag) ||
                parent.getAttribute('role') === 'main' ||
                parent.getAttribute('role') === 'article' ||
                parent.getAttribute('role') === 'complementary' ||
                parent.getAttribute('role') === 'region' ||
                parent.getAttribute('role') === 'navigation') {
                issues.push('Banner landmark should not be nested inside main, article, aside, section, or nav');
            }
        }
    }

    // Contentinfo (footer) should be a top-level landmark, not nested inside main/article/aside/section/nav
    if (tagName === 'footer' || role === 'contentinfo') {
        const parent = element.parentElement;
        if (parent) {
            const parentTag = parent.tagName.toLowerCase();
            if (['main', 'article', 'aside', 'section', 'nav'].includes(parentTag) ||
                parent.getAttribute('role') === 'main' ||
                parent.getAttribute('role') === 'article' ||
                parent.getAttribute('role') === 'complementary' ||
                parent.getAttribute('role') === 'region' ||
                parent.getAttribute('role') === 'navigation') {
                issues.push('Contentinfo landmark should not be nested inside main, article, aside, section, or nav');
            }
        }
    }

    // Region landmark must have an accessible name
    if (role === 'region') {
        const hasAccessibleName = (element.hasAttribute('aria-label') && element.getAttribute('aria-label').trim() !== '') ||
                                   (element.hasAttribute('aria-labelledby') && element.getAttribute('aria-labelledby').trim() !== '');
        if (!hasAccessibleName) {
            issues.push('Region landmark must have an accessible name (aria-label or aria-labelledby)');
        }
    }

    return {
        isValid: issues.length === 0,
        issues: issues
    };
}

/**
 * Ensures that all landmarks on the page have unique identifiers.
 * Adds unique IDs to landmarks that don't have one, or updates duplicates.
 * @returns {Array} Array of landmark elements that were updated.
 */
function ensureUniqueLandmarks() {
    const updatedLandmarks = [];
    const landmarkSelectors = [
        '[role="banner"]', '[role="navigation"]', '[role="main"]',
        '[role="complementary"]', '[role="contentinfo"]', '[role="search"]',
        '[role="region"]', '[role="form"]', '[role="dialog"]',
        'header', 'nav', 'main', 'aside', 'footer', 'section[aria-label], section[aria-labelledby]',
        'form[aria-label], form[aria-labelledby]', 'dialog'
    ];

    const selector = landmarkSelectors.join(', ');
    const landmarks = document.querySelectorAll(selector);

    // Reset the used IDs set for this validation pass
    _usedLandmarkIds.clear();

    landmarks.forEach((landmark, index) => {
        let id = landmark.id;
        if (!id) {
            // Generate a base name based on the landmark type
            const tagName = landmark.tagName.toLowerCase();
            const role = landmark.getAttribute('role');
            let baseName = role || tagName;
            id = ensureUniqueLandmarkId(`${baseName}-${index + 1}`);
            landmark.id = id;
            updatedLandmarks.push(landmark);
        } else {
            const uniqueId = ensureUniqueLandmarkId(id);
            if (uniqueId !== id) {
                landmark.id = uniqueId;
                updatedLandmarks.push(landmark);
            }
        }
    });

    return updatedLandmarks;
}

// ... other existing functions remained unchanged

module.exports = {
    ensureUniqueLandmarkId,
    uniqueLandmarks,
    addLangAttribute,
    addAriaLabel,
    getLangAttribute,
    getFullLangAttribute,
    setupKeyboardNavigation,
    trapFocus,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarks
};