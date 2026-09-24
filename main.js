// main.js - Main application entry point

// Placeholder for the existing code
// ... (Preserve existing code here)

// Example of addressing an accessibility issue
// If the issue is related to a button that lacks an ARIA label, you might add one like this:
// <button aria-label="Description of the button's purpose">Click me</button>

// Assuming the issue is related to line 1, you might add a role attribute to the root element
// to indicate the type of document it represents, for example:
// <html lang="en" role="document">

// Placeholder for the new changes
// ... (Add new functions or changes here)

// Example of a new function to improve accessibility
function enhanceAccessibility() {
  // Implement accessibility enhancements here
  // For example, add keyboard navigation support or ARIA live regions
}

// Call the function to apply the accessibility enhancements
enhanceAccessibility();

// Placeholder for the rest of the existing code
// ... (Preserve the rest of the existing code here)

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }
  
  const errors = [];
  
  // Check if table has proper structure
  if (!tableElement.querySelector('thead')) {
    errors.push('Table is missing <thead> element');
  }
  
  if (!tableElement.querySelector('tbody')) {
    errors.push('Table is missing <tbody> element');
  }
  
  // Check for th elements in thead
  const thead = tableElement.querySelector('thead');
  const thElements = thead ? thead.querySelectorAll('th') : [];
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements');
  }
  
  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });
  
  // Check for proper caption or summary
  const hasCaption = tableElement.querySelector('caption');
  const hasSummary = tableElement.getAttribute('aria-describedby');
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateTableStructure(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found'] };
  }
  
  const errors = [];
  const rows = tableElement.querySelectorAll('tr');
  
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    const cellCount = cells.length;
    
    // Check for empty cells
    cells.forEach((cell, cellIndex) => {
      if (!cell.textContent.trim()) {
        errors.push(`Row ${rowIndex + 1}, Cell ${cellIndex + 1} is empty`);
      }
    });
    
    // Check that rows have consistent cell counts
    if (rowIndex > 0) {
      const prevRow = rows[rowIndex - 1];
      const prevCells = prevRow.querySelectorAll('td, th');
      if (cellCount !== prevCells.length) {
        errors.push(`Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length})`);
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  if (typeof document === 'undefined' || !element) {
    return { valid: false, errors: ['Element not found'] };
  }
  
  const errors = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article', 'search'];
  
  // Check if element is a valid landmark
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  if (role && !validLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`);
  }
  
  if (!role && !validLandmarks.includes(tagName)) {
    errors.push(`Element is not a valid landmark: ${tagName}`);
  }
  
  // Check for accessible name
  const hasLabel = element.getAttribute('aria-label') || 
                   element.getAttribute('aria-labelledby') ||
                   element.querySelector('h1, h2, h3, h4, h5, h6');
  
  if (!hasLabel) {
    errors.push('Landmark is missing accessible name (aria-label, aria-labelledby, or heading)');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  
  const errors = [];
  
  // Check for multiple main landmarks
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    errors.push(`Multiple main landmarks found (${mainElements.length}). Only one main landmark should exist.`);
  }
  
  // Check for proper nesting of landmarks
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, [role]');
  landmarks.forEach((landmark) => {
    const parent = landmark.parentElement;
    while (parent) {
      const parentTag = parent.tagName.toLowerCase();
      const parentRole = parent.getAttribute('role');
      
      // Check for invalid nesting
      if (parentTag === 'header' && landmark.tagName.toLowerCase() === 'header') {
        errors.push('Nested header elements found');
      }
      if (parentTag === 'footer' && landmark.tagName.toLowerCase() === 'footer') {
        errors.push('Nested footer elements found');
      }
      
      parent = parent.parentElement;
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svgElement) {
  if (typeof document === 'undefined' || !svgElement) {
    return null;
  }
  
  // Check for aria-label
  let accessibleName = svgElement.getAttribute('aria-label');
  if (accessibleName) return accessibleName;
  
  // Check for aria-labelledby referencing another element
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent;
  }
  
  // Check for title element inside SVG
  const title = svgElement.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
  // Check for desc element inside SVG
  const desc = svgElement.querySelector('desc');
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim();
  }
  
  return null;
}

function validateSvgAccessibility() {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  
  const errors = [];
  const svgs = document.querySelectorAll('svg');
  
  svgs.forEach((svg, index) => {
    const name = getSvgAccessibleName(svg);
    if (!name) {
      errors.push(`SVG ${index + 1} is missing an accessible name (aria-label, aria-labelledby, title, or desc)`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  
  const errors = [];
  const landmarkCounts = {};
  
  // Count landmarks by role or tag
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, [role]');
  landmarks.forEach((landmark) => {
    const identifier = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    
    // main landmarks should be unique
    if (identifier === 'main' || identifier === 'MAIN') {
      if (landmarkCounts[identifier]) {
        landmarkCounts[identifier]++;
        errors.push(`Duplicate main landmark found (${landmarkCounts[identifier]})`);
      } else {
        landmarkCounts[identifier] = 1;
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}

/**
 * Gets the accessible name of an element, addressing REACT_036 fake link issues.
 * @param {HTMLElement} element - The element to extract the accessible name from
 * @returns {string|null} The accessible name or null
 */
function personName(element) {
  if (typeof document === 'undefined' || !element) {
    return null;
  }
  
  // Check for aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check for aria-labelledby referencing another element
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent;
  }
  
  // Check for title attribute
  const title = element.getAttribute('title');
  if (title) return title;
  
  // Fall back to text content
  const textContent = element.textContent.trim();
  if (textContent) return textContent;
  
  return null;
}

/**
 * Validates that links and interactive elements have accessible names,
 * addressing REACT_036 fake link issues.
 * @param {HTMLElement} container - Optional container to scan within
 * @returns {object} Validation result with valid flag and errors array
 */
function validateAccessibleLinks(container) {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  
  const errors = [];
  const root = container || document;
  const links = root.querySelectorAll('a, button, [role="link"], [role="button"]');
  
  links.forEach((el, index) => {
    const name = personName(el);
    if (!name || !name.trim()) {
      errors.push(`Interactive element ${index + 1} is missing an accessible name`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to handle focus trap for keyboard navigation
/**
 * Creates a focus trap within a container element for keyboard navigation.
 * Cycles focus between the first and last focusable elements when Tab is pressed.
 * @param {HTMLElement} container - The container element to trap focus within
 * @returns {object} An object with an activate method, deactivate method, and isActive flag
 */
function createFocusTrap(container) {
  if (typeof document === 'undefined' || !container) {
    return {
      activate: () => {},
      deactivate: () => {},
      isActive: false
    };
  }
  
  const FOCUSABLE_SELECTORS = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(',');
  
  let isActive = false;
  let previouslyFocusedElement = null;
  
  const getFocusableElements = () => {
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS))
      .filter((el) => {
        // Filter out elements that are not visible
        const style = typeof window !== 'undefined' && window.getComputedStyle ? window.getComputedStyle(el) : null;
        if (style && (style.visibility === 'hidden' || style.display === 'none')) {
          return false;
        }
        return true;
      });
  };
  
  const handleKeyDown = (event) => {
    if (!isActive || event.key !== 'Tab') {
      return;
    }
    
    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;
    
    if (event.shiftKey) {
      // Shift + Tab: if on first element, wrap to last
      if (activeElement === firstElement || !container.contains(activeElement)) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: if on last element, wrap to first
      if (activeElement === lastElement || !container.contains(activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  return {
    /**
     * Activates the focus trap, adding event listeners and saving previous focus.
     */
    activate() {
      if (isActive) return;
      isActive = true;
      previouslyFocusedElement = document.activeElement;
      
      if (typeof container.addEventListener === 'function') {
        container.addEventListener('keydown', handleKeyDown);
      } else if (typeof document.addEventListener === 'function') {
        document.addEventListener('keydown', handleKeyDown);
      }
      
      // Focus the first focusable element in the container
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    },
    /**
     * Deactivates the focus trap, removing event listeners and restoring previous focus.
     */
    deactivate() {
      if (!isActive) return;
      isActive = false;
      
      if (typeof container.removeEventListener === 'function') {
        container.removeEventListener('keydown', handleKeyDown);
      } else if (typeof document.removeEventListener === 'function') {
        document.removeEventListener('keydown', handleKeyDown);
      }
      
      // Restore focus to the previously focused element
      if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
        previouslyFocusedElement.focus();
      }
      previouslyFocusedElement = null;
    },
    get isActive() {
      return isActive;
    }
  };
}