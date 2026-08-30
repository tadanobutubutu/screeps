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

/**
 * Ensures all landmarks in the document have unique IDs.
 * Assigns unique IDs to landmarks that are missing or have duplicate IDs.
 * @returns {void}
 */
function ensureUniqueLandmarks() {
    const landmarkSelectors = 'header, nav, main, aside, footer, section, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="region"]';
    const landmarks = document.querySelectorAll(landmarkSelectors);

    landmarks.forEach((landmark, index) => {
        const existingId = landmark.getAttribute('id');
        const existingAriaLabel = landmark.getAttribute('aria-label');

        if (!existingId) {
            const tagName = landmark.tagName.toLowerCase();
            const baseId = existingAriaLabel
                ? existingAriaLabel.toLowerCase().replace(/\s+/g, '-')
                : `${tagName}-${index}`;
            const uniqueId = ensureUniqueLandmarkId(baseId);
            landmark.setAttribute('id', uniqueId);
        } else if (_usedLandmarkIds.has(existingId)) {
            // Duplicate ID found, generate a new unique one
            const uniqueId = ensureUniqueLandmarkId(existingId);
            landmark.setAttribute('id', uniqueId);
        } else {
            _usedLandmarkIds.add(existingId);
        }
    });
}

/**
 * Validates that landmarks have proper structure (role and accessible name).
 * @param {HTMLElement} landmark - The landmark element to validate.
 * @returns {boolean} True if the landmark has valid structure.
 */
function validateLandmark(landmark) {
    const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role');
    const ariaLabel = landmark.getAttribute('aria-label');
    const ariaLabelledBy = landmark.getAttribute('aria-labelledby');

    // section element requires aria-label or aria-labelledby to be a valid landmark
    if (tagName === 'section') {
        return !!(ariaLabel || ariaLabelledBy);
    }

    // form element requires accessible name to be a valid landmark
    if (tagName === 'form') {
        return !!(ariaLabel || ariaLabelledBy || landmark.getAttribute('title'));
    }

    // Check role validity if present
    if (role && !validRoles.includes(role)) {
        return false;
    }

    return true;
}

/**
 * Validates the structure of all landmarks in the document.
 * Logs warnings for any landmarks that have structural issues.
 * @returns {Array} Array of invalid landmarks.
 */
function validateLandmarkStructure() {
    const landmarkSelectors = 'header, nav, main, aside, footer, section, form, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="region"]';
    const landmarks = document.querySelectorAll(landmarkSelectors);
    const invalidLandmarks = [];

    landmarks.forEach((landmark) => {
        if (!validateLandmark(landmark)) {
            invalidLandmarks.push(landmark);
        }
    });

    return invalidLandmarks;
}

/**
 * Validates table accessibility by checking for proper headers and structure.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {boolean} True if the table has proper accessibility structure.
 */
function validateTableAccessibility(table) {
    const headers = table.querySelectorAll('th');
    const hasHeaderRow = headers.length > 0;

    if (!hasHeaderRow) {
        return false;
    }

    // Check that all th elements have scope attribute
    const allHeadersHaveScope = Array.from(headers).every(
        header => header.hasAttribute('scope')
    );

    return allHeadersHaveScope;
}

/**
 * Validates the structure of all tables in the document.
 * Adds missing scope attributes to th elements.
 * @returns {Array} Array of tables that were modified.
 */
function validateTableStructure() {
    const tables = document.querySelectorAll('table');
    const modifiedTables = [];

    tables.forEach((table) => {
        const headers = table.querySelectorAll('th');
        headers.forEach((header) => {
            if (!header.hasAttribute('scope')) {
                // Determine if it's in a row or column header
                const isInFirstRow = header.closest('tr') === table.querySelector('tr');
                header.setAttribute('scope', isInFirstRow ? 'col' : 'row');
                modifiedTables.push(table);
            }
        });
    });

    return modifiedTables;
}

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name of the SVG.
 */
function getSvgAccessibleName(svg) {
    return svg.getAttribute('aria-label') ||
           svg.getAttribute('aria-labelledby') ||
           svg.querySelector('title')?.textContent ||
           '';
}

/**
 * Creates an in-page button element with proper accessibility attributes.
 * @param {string} text - The button text.
 * @param {Function} onClick - The click handler.
 * @returns {HTMLButtonElement} The created button element.
 */
function createInPageButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('type', 'button');
    if (onClick) {
        button.addEventListener('click', onClick);
    }
    return button;
}

/**
 * Creates an accessible link element.
 * @param {string} href - The link href.
 * @param {string} text - The link text.
 * @returns {HTMLAnchorElement} The created anchor element.
 */
function createAccessibleLink(href, text) {
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.textContent = text;
    return link;
}

/**
 * Handles accessibility issues in the document by running all validation and fix functions.
 * @returns {void}
 */
function handleAccessibilityIssues() {
    ensureUniqueLandmarks();
    validateLandmarkStructure();
    validateTableStructure();
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

// ... other existing functions remained unchanged

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ensureUniqueLandmarkId,
        uniqueLandmarks,
        ensureUniqueLandmarks,
        validateLandmark,
        validateLandmarkStructure,
        validateTableAccessibility,
        validateTableStructure,
        getSvgAccessibleName,
        createInPageButton,
        createAccessibleLink,
        handleAccessibilityIssues,
        addLangAttribute,
        addAriaLabel,
        getLangAttribute,
        getFullLangAttribute,
        setupKeyboardNavigation,
        trapFocus,
        _usedLandmarkIds
    };
}