import { requiredModule } from './required-module.js';

function addLandmarkRegions() {
  const container = ...
  if (container) {
    container.innerHTML = `
      <div class="landmark-region" role="region" aria-label="Building" aria-labelledby="buildingLabel">
        <span id="buildingLabel">Main Building</span>
      </div>
      <div class="landmark-region" role="region" aria-label="Park" aria-labelledby="parkLabel">
        <span id="parkLabel">Central Park</span>
      </div>
    `;
  }
}

export function newNecessaryFunction() {
  // Implementation of the new function
  return "New function implemented";
}

/**
 * Calculate the sum of two numbers
 * @param {number} a - First number
 * @param {b} - Second number
 * @returns {number} Sum of a and b
 */
export function calculateSum(a, b) {
  return a + b;
}

export function calculateDifference(a, b) {
  return a - b;
}

export function calculateProduct(a, b) {
  return a * b;
}

export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function divide(a, b) {
  if (!isNumber(a) || !isNumber(b)) {
    throw new Error('Both operands must be numbers.');
  }
  if (b === 0) {
    throw new Error('Division by zero is not allowed.');
  }
  return a / b;
}

/**
 * Check if an element has the specified accessibility attribute
 * @param {HTMLElement} element - The DOM element to check
 * @param {string} attribute - The accessibility attribute to check for
 * @returns {boolean} True if the attribute is present and non-empty, false otherwise
 */
export function checkAccessibilityAttribute(element, attribute) {
  if (!element || typeof element.getAttribute !== 'function') {
    return false;
  }
  const value = element.getAttribute(attribute);
  return value !== null && value !== '';
}

/**
 * Ensure an element has a non-empty accessibility label
 * @param {HTMLElement} element - The DOM element to check
 * @returns {boolean} True if the element has an aria-label or accessible name, false otherwise
 */
export function ensureAccessibleLabel(element) {
  if (!element) {
    return false;
  }
  return checkAccessibilityAttribute(element, 'aria-label') ||
         checkAccessibilityAttribute(element, 'aria-labelledby') ||
         checkAccessibilityAttribute(element, 'alt');
}

/**
 * Validate that an element has proper focusability for accessibility
 * @param {HTMLElement} element - The DOM element to check
 * @returns {boolean} True if the element is focusable, false otherwise
 */
export function validateFocusableElement(element) {
  if (!element) {
    return false;
  }
  const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];
  const tagName = element.tagName ? element.tagName.toLowerCase() : '';
  const isTagFocusable = focusableTags.includes(tagName);
  const isFocusable = isTagFocusable ||
                      element.tabIndex >= 0 ||
                      checkAccessibilityAttribute(element, 'tabindex');
  return isFocusable && ensureAccessibleLabel(element);
}

/**
 * Get the lang attribute value for the HTML element
 * @param {Document} doc - The document object (defaults to global document)
 * @returns {string} The language attribute value, or 'en' as default
 */
export function getLangAttribute(doc = document) {
  const htmlElement = doc.documentElement || doc.querySelector('html');
  const lang = htmlElement ? htmlElement.getAttribute('lang') : null;
  return lang || 'en';
}

/**
 * Validate that a table has proper accessibility structure
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with isValid and issues array
 */
export function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) {
    return { isValid: false, issues: ['Table element is required'] };
  }
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push({ code: 'REACT_027', message: 'Table should have a caption element' });
  }
  
  // Check for th elements with scope or headers
  const thElements = table.querySelectorAll('th');
  thElements.forEach((th, index) => {
    const hasScope = th.hasAttribute('scope');
    const hasHeaders = th.hasAttribute('headers');
    if (!hasScope && !hasHeaders) {
      issues.push({ 
        code: 'REACT_027', 
        message: `Table header at index ${index} should have scope or headers attribute` 
      });
    }
  });
  
  return { isValid: issues.length === 0, issues };
}

/**
 * Validate the structure of a table
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with isValid and issues array
 */
export function validateTableStructure(table) {
  const issues = [];
  
  if (!table) {
    return { isValid: false, issues: ['Table element is required'] };
  }
  
  // Check for thead
  const thead = table.querySelector('thead');
  if (!thead) {
    issues.push({ code: 'REACT_027', message: 'Table should have a thead element' });
  }
  
  // Check for tbody
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    issues.push({ code: 'REACT_027', message: 'Table should have a tbody element' });
  }
  
  // Check that th elements are in thead
  const allThs = table.querySelectorAll('th');
  allThs.forEach((th) => {
    let parent = th.parentElement;
    while (parent && parent !== table) {
      if (parent.tagName === 'THEAD') break;
      parent = parent.parentElement;
    }
    if (parent !== table && !parent) {
      issues.push({ code: 'REACT_027', message: 'All th elements should be within thead' });
    }
  });
  
  return { isValid: issues.length === 0, issues };
}

/**
 * Validate landmark accessibility
 * @param {HTMLElement} element - The element to validate as a landmark
 * @returns {Object} Validation result with isValid and issues array
 */
export function validateLandmark(element) {
  const issues = [];
  
  if (!element) {
    return { isValid: false, issues: ['Element is required'] };
  }
  
  // Check if element has a valid landmark role
  const validLandmarkRoles = [
    'banner', 'navigation', 'main', 'complementary', 'contentinfo',
    'region', 'search', 'form', 'application'
  ];
  
  const role = element.getAttribute('role');
  const tagName = element.tagName ? element.tagName.toLowerCase() : '';
  const implicitRole = ['header', 'nav', 'main', 'aside', 'footer'].includes(tagName) ? tagName : null;
  const effectiveRole = role || implicitRole;
  
  if (effectiveRole && !validLandmarkRoles.includes(effectiveRole)) {
    issues.push({ 
      code: 'REACT_017', 
      message: `Invalid landmark role: ${effectiveRole}` 
    });
  }
  
  // Check for accessible name (aria-label or aria-labelledby or text content)
  const hasLabel = ensureAccessibleLabel(element);
  const hasText = element.textContent.trim().length > 0;
  if (!hasLabel && !hasText && effectiveRole === 'region') {
    issues.push({ 
      code: 'REACT_017', 
      message: 'Landmark region should have an accessible name' 
    });
  }
  
  return { isValid: issues.length === 0, issues };
}

/**
 * Validate landmark structure for uniqueness
 * @param {Document|HTMLElement} root - The root element to search within
 * @returns {Object} Validation result with isValid and issues array
 */
export function validateLandmarkStructure(root = document) {
  const issues = [];
  const landmarkCounts = {};
  
  // Find all main landmarks
  const mainLandmarks = root.querySelectorAll('[role="main"], main');
  if (mainLandmarks.length > 1) {
    issues.push({ 
      code: 'REACT_025', 
      message: `Page has ${mainLandmarks.length} main landmarks, but should have only 1` 
    });
  }
  
  // Check for duplicate landmark roles
  const elements = root.querySelectorAll('[role]');
  elements.forEach((el) => {
    const role = el.getAttribute('role');
    if (!landmarkCounts[role]) {
      landmarkCounts[role] = [];
    }
    landmarkCounts[role].push(el);
  });
  
  Object.keys(landmarkCounts).forEach((role) => {
    // Banner, main, contentinfo should be unique
    const uniqueRoles = ['banner', 'main', 'contentinfo'];
    if (uniqueRoles.includes(role) && landmarkCounts[role].length > 1) {
      issues.push({
        code: 'REACT_025',
        message: `Page has ${landmarkCounts[role].length} ${role} landmarks, but should have only 1`
      });
    }
  });
  
  return { isValid: issues.length === 0, issues };
}

/**
 * Get accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name or empty string
 */
export function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  // Check aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const doc = svg.ownerDocument || document;
    const labelElement = doc.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : '';
  }
  
  // Check for title element inside SVG
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  
  return '';
}

/**
 * Set accessibility attributes on an SVG element
 * @param {SVGElement} svg - The SVG element
 * @param {string} accessibleName - The accessible name to set
 */
export function setSvgAttributes(svg, accessibleName) {
  if (!svg || !accessibleName) return;
  
  svg.setAttribute('aria-label', accessibleName);
  
  // Add title if not present
  const existingTitle = svg.querySelector('title');
  if (!existingTitle) {
    const title = document.createElement('title');
    title.textContent = accessibleName;
    title.id = `${svg.id || 'svg'}-title`;
    svg.insertBefore(title, svg.firstChild);
  }
  
  // Add role="img" if not present
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
}

/**
 * Create an accessible in-page button
 * @param {Object} options - Button options
 * @param {string} options.text - Button text
 * @param {string} options.id - Button ID
 * @param {Function} options.onClick - Click handler
 * @param {string}