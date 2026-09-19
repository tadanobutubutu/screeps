// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] Add skip link functionality for keyboard navigation

// TODO: Implement this function for checking landmark structure
// Implementation below: validates landmark structure for accessibility
function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('main, nav, header, footer, aside, section[aria-label], [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
  const landmarkTypes = {};
  const issues = [];

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (landmarkTypes[role]) {
      landmarkTypes[role]++;
      issues.push(`Multiple ${role} landmarks found`);
    } else {
      landmarkTypes[role] = 1;
    }
  });

  // Check for missing main landmark
  if (!document.querySelector('main, [role="main"]')) {
    issues.push('No main landmark found');
  }

  return { valid: issues.length === 0, issues, landmarks };
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_025: Ensure unique landmarks

// Internal set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function generateUniqueLandmarkId(baseName) {
    let candidate = baseName;
    let counter = 0;
    while (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.floor(Math.random() * 10);
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

// Returns a new array containing only unique landmarks from the input list.
// @param {Array} landmarks - List of landmark objects.
// @returns {Array} Unique landmarks.
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    if (!landmarks) return result;
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
  const elementToModify = document.documentElement;
  if (elementToModify) {
    elementToModify.lang = 'en'; // Example: English
  }
}

/**
 * Gets the lang attribute from the HTML element.
 * @returns {string} The language attribute value.
 */
function getLangAttribute() {
    return document.documentElement.lang || 'en';
}

// Adds an aria-label attribute to an element if it doesn't already have one.
// @param {HTMLElement} element - The element to add the aria-label to.
// @param {string} label - The label text to be added.
function addAriaLabel(element, label) {
    if (element && !element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

// Gets the language attribute from the HTML element.
// @returns {string} - the language attribute value
function getLangAttribute() {
  return document.documentElement.lang || '';
}

// This function gets the full language attribute with region (if provided)
// @returns {string} - the full language attribute with region (if provided)
function getFullLangAttribute() {
    return document.documentElement.lang || '';
}

// Accessibility helper functions
function handleKeyboardNavigation(options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;

  return function(event) {
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
    });
    return issues;
}

/**
 * Ensures all landmarks have unique IDs.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Landmarks with unique IDs.
 */
function ensureUniqueLandmarks(landmarks) {
    const seen = new Set();
    return landmarks.map(landmark => {
        let id = landmark.id;
        if (!id || seen.has(id)) {
            id = ensureUniqueLandmarkId(landmark.id || 'landmark');
        }
        seen.add(id);
        return { ...landmark, id };
    });
}

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGSVGElement} svg - The SVG element.
 * @returns {string} The accessible name.
 */
function getSvgAccessibleName(svg) {
    return svg.getAttribute('aria-label') || 
           svg.getAttribute('title') || 
           (svg.querySelector('title') ? svg.querySelector('title').textContent : '') || 
           '';
}

/**
 * Creates an in-page button for skipping to main content.
 * @returns {HTMLButtonElement} The created button element.
 */
function createInPageButton() {
    const button = document.createElement('button');
    button.setAttribute('aria-label', 'Skip to main content');
    button.id = 'skip-to-main-content';
    button.textContent = 'Skip to main content';
    return button;
}

/**
 * Creates an accessible link element.
 * @param {string} href - The link URL.
 * @param {string} text - The link text.
 * @returns {HTMLAnchorElement} The created link element.
 */
function createAccessibleLink(href, text) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    return link;
}

/**
 * Handles all accessibility issues in the document.
 * @returns {void}
 */
function handleAccessibilityIssues() {
    removeFakeLinks();
    addProperLandmarkRegions();
    addAriaToFormControls();
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
        button.setAttribute('aria-label', 'Example Button');
    }
  };
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
  const collapsibles = document.querySelectorAll('.collapsible');
  collapsibles.forEach(collapsible => {
    if (!collapsible.getAttribute('aria-expanded')) {
      collapsible.setAttribute('aria-expanded', 'false');
    }
  });

  // Add aria-labels to form inputs
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input, index) => {
    const id = input.id || `input-${index}`;
    input.id = id;
    if (!input.getAttribute('aria-label')) {
      input.setAttribute('aria-label', `Input field ${index + 1}`);
    }
  };
}

  const keydownHandler = function(event) {
    if (event.key !== 'Tab') return;

    // Mark required fields appropriately
    if (control.required && !control.getAttribute('aria-required')) {
      control.setAttribute('aria-required', 'true');
    }
  };

  container.addEventListener('keydown', keydownHandler);
}

// ... other existing functions remained unchanged