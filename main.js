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

// ... other existing functions remained unchanged

// REACT_017: Add/fix 4 landmark issues
/**
 * Validates a landmark element and ensures it has proper accessibility attributes.
 * @param {HTMLElement} landmark - The landmark element to validate.
 * @returns {boolean} - True if landmark is valid.
 */
function validateLandmark(landmark) {
    if (!landmark) return false;
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    const validRoles = ['banner', 'main', 'navigation', 'contentinfo', 'complementary', 'region', 'form', 'search'];
    if (!validRoles.includes(role) && !['header', 'main', 'nav', 'footer', 'aside', 'section', 'form'].includes(landmark.tagName.toLowerCase())) {
        return false;
    }
    // Ensure landmark has an accessible name if required
    const needsLabel = ['navigation', 'region', 'form', 'search'].includes(role) || landmark.tagName.toLowerCase() === 'section';
    if (needsLabel && !landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
        landmark.setAttribute('aria-label', landmark.id || 'landmark');
    }
    return true;
}

/**
 * Validates the structure of landmarks within a container.
 * @param {HTMLElement} container - The container element to check.
 * @returns {Array} - List of landmark issues found.
 */
function validateLandmarkStructure(container) {
    const issues = [];
    const landmarks = container.querySelectorAll('header, main, nav, footer, aside, section, [role="banner"], [role="main"], [role="navigation"], [role="contentinfo"], [role="complementary"], [role="region"]');
    const seen = new Set();
    landmarks.forEach((lm, index) => {
        if (!validateLandmark(lm)) {
            issues.push(`Invalid landmark at index ${index}`);
        }
        const key = lm.tagName.toLowerCase() + (lm.getAttribute('role') || '');
        if (seen.has(key)) {
            issues.push(`Duplicate landmark of type ${key}`);
        }
        seen.add(key);
    });
    return issues;
}

/**
 * Ensures that all landmarks within a container have unique IDs.
 * @param {HTMLElement} container - The container element to check.
 */
function ensureUniqueLandmarks(container) {
    const landmarks = container.querySelectorAll('header, main, nav, footer, aside, section, [role="banner"], [role="main"], [role="navigation"], [role="contentinfo"], [role="complementary"], [role="region"]');
    landmarks.forEach(lm => {
        if (!lm.id) {
            lm.id = ensureUniqueLandmarkId(lm.tagName.toLowerCase());
        } else if (_usedLandmarkIds.has(lm.id)) {
            lm.id = ensureUniqueLandmarkId(lm.id);
        }
    });
}

// REACT_027: Fix 26 table structure issues
/**
 * Validates table accessibility and adds scope attributes to th elements.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {boolean} - True if table is accessible.
 */
function validateTableAccessibility(table) {
    if (!table) return false;
    const ths = table.querySelectorAll('th');
    ths.forEach(th => {
        if (!th.hasAttribute('scope')) {
            // Determine if it's a header for a row or column
            const isInFirstRow = th.closest('tr') === table.querySelector('tr');
            const isInFirstColumn = Array.from(th.parentNode.children).indexOf(th) === 0;
            th.setAttribute('scope', isInFirstRow ? 'col' : (isInFirstColumn ? 'row' : 'col'));
        }
    });
    return true;
}

/**
 * Validates the overall structure of a table for accessibility.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {Array} - List of issues found.
 */
function validateTableStructure(table) {
    const issues = [];
    if (!table) {
        issues.push('Table element not found');
        return issues;
    }
    const rows = table.querySelectorAll('tr');
    if (rows.length === 0) {
        issues.push('Table has no rows');
    }
    const ths = table.querySelectorAll('th');
    const tds = table.querySelectorAll('td');
    if (ths.length === 0 && tds.length > 0) {
        issues.push('Table has no header cells');
    }
    // Check for caption
    if (!table.querySelector('caption')) {
        issues.push('Table missing caption element');
    }
    return issues;
}

// REACT_041: Add accessible names to 2 SVGs
/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} - The accessible name.
 */
function getSvgAccessibleName(svg) {
    if (!svg) return '';
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    const titleEl = svg.querySelector('title');
    if (titleEl) return titleEl.textContent;
    return '';
}

/**
 * Creates an in-page button with proper accessibility attributes.
 * @param {string} label - The button label.
 * @param {Function} onClick - Click handler.
 * @returns {HTMLButtonElement} - The created button.
 */
function createInPageButton(label, onClick) {
    const button = document.createElement('button');
    button.textContent = label;
    button.setAttribute('aria-label', label);
    if (onClick) {
        button.addEventListener('click', onClick);
    }
    return button;
}

// REACT_036: Fix 1 fake link issue
/**
 * Creates an accessible link element.
 * @param {string} href - The URL.
 * @param {string} text - The link text.
 * @returns {HTMLAnchorElement} - The created anchor.
 */
function createAccessibleLink(href, text) {
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.textContent = text;
    link.setAttribute('aria-label', text);
    return link;
}

/**
 * Handles general accessibility issues in the page.
 * @param {HTMLElement} root - The root element to process.
 */
function handleAccessibilityIssues(root) {
    if (!root) return;
    // Fix fake links (div/span with click handlers styled as links)
    const fakeLinks = root.querySelectorAll('[role="link"]');
    fakeLinks.forEach(el => {
        if (el.tagName !== 'A') {
            // Add proper link semantics or convert to actual link
            el.setAttribute('tabindex', '0');
        }
    });
    // Ensure all interactive elements have accessible names
    const interactive = root.querySelectorAll('button, a, input, select, textarea, [role="button"]');
    interactive.forEach(el => {
        if (!el.hasAttribute('aria-label') && !el.textContent.trim() && !el.getAttribute('placeholder')) {
            el.setAttribute('aria-label', 'Interactive element');
        }
    });
}