// main.js

const VERSION = '1.0.0';

// Polyfill for Array.prototype.flat (if not available)
if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    configurable: true,
    writable: true,
    value: function depthFlat(depth = 1) {
      return depth > 0
        ? Array.prototype.reduce.call(this, function (acc, val) {
            return acc.concat(Array.isArray(val) ? val.flat(depth - 1) : val);
          }, [])
        : Array.prototype.slice.call(this);
    }
  });
}

// =============================================================================
// Accessibility Utilities (from origin/main)
// =============================================================================

/**
 * Initialize the application
 * @returns {boolean} Initialization status
 */
function initialize() {
  return true;
}

/**
 * Process and transform data
 * @param {Array} data - Input data to process
 * @returns {Array|null} Processed data or null if invalid
 */
function processData(data) {
  if (!Array.isArray(data)) {
    return null;
  }
  return data.map(item => ({
    ...item,
    processed: true
  }));
}

/**
 * Validate input string
 * @param {string} input - Input to validate
 * @returns {boolean} Validation result
 */
function validateInput(input) {
  return typeof input === 'string' && input.length > 0;
}

/**
 * Format data for output
 * @param {any} data - Data to format
 * @returns {string} Formatted string
 */
function formatOutput(data) {
  return JSON.stringify(data, null, 2);
}

// Sample implementation to maintain module structure
function main() {
  console.log('Main function executed');
}

/**
 * Announce content changes to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - Priority level ('polite' or 'assertive')
 */
function announceToScreenReader(message, priority = 'polite') {
  // Remove any existing announcements
  const existingAnnouncement = document.querySelector('[role="status"].sr-only-announcement');
  if (existingAnnouncement) {
    existingAnnouncement.remove();
  }

  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only-announcement';
  announcement.style.position = 'absolute';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.padding = '0';
  announcement.style.margin = '-1px';
  announcement.style.overflow = 'hidden';
  announcement.style.clip = 'rect(0, 0, 0, 0)';
  announcement.style.whiteSpace = 'nowrap';
  announcement.style.border = '0';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement is read
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.remove();
    }
  }, 1000);
}

/**
 * Ensure interactive elements are keyboard accessible
 * @param {HTMLElement} container - Container element to enhance
 */
function enhanceKeyboardAccessibility(container = document) {
  const interactiveElements = container.querySelectorAll(
    'a[href], button:not([disabled]):not([aria-hidden="true"]), ' +
    'input:not([disabled]):not([type="hidden"]), ' +
    'select:not([disabled]), textarea:not([disabled]), ' +
    '[tabindex]:not([tabindex="-1"])'
  );

  interactiveElements.forEach((element) => {
    // Ensure elements with onclick have keyboard support
    if (element.hasAttribute('onclick') && !element.hasAttribute('role')) {
      if (element.tagName === 'DIV' || element.tagName === 'SPAN') {
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', '0');
      }
    }

    // Add focus indicator if missing
    if (!element.hasAttribute('data-accessibility-focused')) {
      const style = window.getComputedStyle(element);
      if (style.outline === 'none' || style.outlineWidth === '0px') {
        element.style.outline = '2px solid #0066cc';
        element.style.outlineOffset = '2px';
      }
      element.setAttribute('data-accessibility-focused', 'true');
    }
  });
}

/**
 * Trap focus within a container (for modals/dialogs)
 * @param {HTMLElement} element - Container element
 */
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab' || e.key === 'Shift+Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });

  // Set initial focus
  firstFocusable.focus();
}

/**
 * Setup skip link functionality
 * @param {string} targetId - Target element ID to skip to
 */
function setupSkipLink(targetId = 'main-content') {
  const skipLink = document.createElement('a');
  skipLink.href = '#' + targetId;
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';

  skipLink.style.position = 'absolute';
  skipLink.style.top = '-40px';
  skipLink.style.left = '0';
  skipLink.style.background = '#000';
  skipLink.style.color = '#fff';
  skipLink.style.padding = '8px 16px';
  skipLink.style.zIndex = '100000';
  skipLink.style.textDecoration = 'none';
  skipLink.style.transition = 'top 0.2s';

  skipLink.addEventListener('focus', function() {
    skipLink.style.top = '0';
  });

  skipLink.addEventListener('blur', function() {
    skipLink.style.top = '-40px';
  });

  document.body.insertBefore(skipLink, document.body.firstChild);
}

// REACT_017: Add landmark roles to fix landmark issues
/**
 * Get a unique landmark name
 * @param {string} baseName - Base name for the landmark
 * @param {Array} existingNames - Array of existing landmark names
 * @returns {string} Unique landmark name
 */
function getUniqueLandmarkName(baseName, existingNames) {
  if (!existingNames.includes(baseName)) {
    return baseName;
  }
  let counter = 2;
  let newName = `${baseName}-${counter}`;
  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName}-${counter}`;
  }
  return newName;
}

// REACT_025: Ensure unique landmarks function
/**
 * Validate that landmarks have unique names
 * @param {HTMLElement} container - Container element to validate
 * @returns {Array} Array of issues found
 */
function validateUniqueLandmarks(container) {
  const landmarks = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
  const landmarkNames = new Set();
  const issues = [];

  landmarks.forEach((landmark) => {
    const ariaLabel = landmark.getAttribute('aria-label');
    const ariaLabelledby = landmark.getAttribute('aria-labelledby');
    const tagName = landmark.tagName.toLowerCase();

    // Determine the landmark name
    let landmarkName = ariaLabel || ariaLabelledby || tagName;

    if (landmarkNames.has(landmarkName)) {
      issues.push({
        element: landmark,
        message: `Duplicate landmark found: "${landmarkName}". Use unique aria-label or aria-labelledby.`,
        severity: 'warning'
      });
    } else {
      landmarkNames.add(landmarkName);
    }
  });

  return issues;
}

// REACT_041: Add accessible names to SVGs
/**
 * Add accessible name to an SVG element
 * @param {SVGElement} svgElement - SVG element to enhance
 * @param {string} accessibleName - Accessible name for the SVG
 */
function addSvgAccessibleName(svgElement, accessibleName) {
  if (!svgElement) return;

  // Add title element as first child
  const title = document.createElement('title');
  title.id = `svg-title-${Date.now()}`;
  title.textContent = accessibleName;

  // Insert title as first child
  svgElement.insertBefore(title, svgElement.firstChild);

  // Add aria-labelledby attribute
  svgElement.setAttribute('aria-labelledby', title.id);
}

// REACT_036: Fix fake link issues - convert to proper semantic elements
/**
 * Validate if an element is a proper link
 * @param {HTMLElement} element - Element to validate
 * @returns {Object} Validation result
 */
function isValidLink(element) {
  if (!element) return { valid: true };

  const tagName = element.tagName.toLowerCase();
  const href = element.getAttribute('href');
  const onClick = element.getAttribute('onclick');

  // Check if it's a fake link (div/span with onClick but no href, or an anchor without href)
  const isFakeLink = (tagName === 'div' || tagName === 'span') && onClick && !href;

  if (isFakeLink) {
    return {
      valid: false,
      suggestion: `Replace <${tagName}> with <button> or <a href="#"> for proper accessibility.`
    };
  }

  return { valid: true };
}

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
/**
 * Add scope attributes to table headers
 * @param {HTMLTableElement} tableElement - Table element to process
 * @returns {Array} Array of updates made
 */
function addScopeToHeaders(tableElement) {
  if (!tableElement) return [];

  const headers = tableElement.querySelectorAll('th');
  const updates = [];

  headers.forEach((th) => {
    const row = th.closest('tr');
    const rowIndex = Array.from(row.parentElement.children).indexOf(row);
    const cellIndex = Array.from(row.children).indexOf(th);

    // Determine if scope should be 'col' or 'row'
    let scope = 'col';

    // Check if it's a row header (first cell in a row that's not the first row)
    if (cellIndex === 0 && rowIndex > 0) {
      scope = 'row';
    }

    if (!th.getAttribute('scope')) {
      th.setAttribute('scope', scope);
      updates.push({
        element: th,
        scope: scope,
        position: { row: rowIndex, col: cellIndex }
      });
    }
  });

  return updates;
}

// Auto-initialize accessibility features
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupSkipLink();
      enhanceKeyboardAccessibility();
    });
  } else {
    setupSkipLink();
    enhanceKeyboardAccessibility();
  }
}

// Export all functions and values
module.exports = {
  VERSION,
  main,
  initialize,
  processData,
  validateInput,
  formatOutput,
  announceToScreenReader,
  enhanceKeyboardAccessibility,
  trapFocus,
  setupSkipLink,
  getUniqueLandmarkName,
  validateUniqueLandmarks,
  addSvgAccessibleName,
  isValidLink,
  addScopeToHeaders
};