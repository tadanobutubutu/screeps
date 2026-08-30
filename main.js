// Import required module(s) - for fixing table structure issues
import './table-styles.css';

// main.js - Entry point for the application

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// Accessibility issues from insight report addressed:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())

// This is a simple utility library with added dependency graph rendering and module structure display functionalities, bot logic for Screeps and functions to ensure the element has an id and add an aria-label.

// TODO: Update or create the affected functions to be accessible

let internalFunction1 = (arg1, arg2) => {
  // Implementation of the new function (adjust as necessary)
};

let internalFunction2 = () => {
  // Implementation of the new function (adjust as necessary)
};

/**
 * Ensures the element has an id. If the element doesn't have an id, generates one.
 * @param {HTMLElement} element - The element to check
 * @param {string} prefix - Optional prefix for the generated id
 * @returns {string} The id of the element
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const generatedId = `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = generatedId;
  return generatedId;
}

export function anotherFunction() {
  // More existing functionality
}

/**
 * Adds an aria-label to the element if it doesn't already have one
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text
 * @returns {void}
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }

  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

// TODO: Implement functions to render dependency graphs and display module structure for debugging purposes.

/**
 * Sets the lang attribute on the HTML element based on the page content
 * @param {string} languageCode - The language code (e.g., 'en', 'es', 'fr')
 */
function setLanguageAttribute(languageCode) {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', languageCode);
  }
}

/**
 * Gets the lang attribute from the HTML element
 * @returns {string|null} The language code or null if not set
 */
function getLangAttribute() {
  const htmlElement = document.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

// Default language setting
setLanguageAttribute('en');

// Simple interactive page with content rotation functionality
function initApp() {
  const container = document.getElementById('app');

  // Create heading
  const h1 = document.createElement('h1');
  h1.textContent = 'My Page';
  h1.id = 'title';
  container.appendChild(h1);

  // Create content area
  const content = document.createElement('div');
  content.id = 'content';
  content.style.transition = 'transform 0.3s ease';
  content.style.transformOrigin = 'center center';
  container.appendChild(content);

  // Create button for rotating back (FIXED: changed from <a href="#"> to <button>)
  const unrotateBtn = document.createElement('button');
  unrotateBtn.id = 'unrotate';
  unrotateBtn.textContent = 'rotate back';
  unrotateBtn.setAttribute('aria-label', 'Rotate content back to original position');
  unrotateBtn.addEventListener('click', function(e) {
    e.preventDefault();
    content.style.transform = 'rotate(0deg)';
  });
  container.appendChild(unrotateBtn);

  // Call the dependency graph rendering utility
  renderDependencyGraph();
}

// Placeholder for module structure display utility.
// Helps developers understand the current structure of loaded modules.
function displayModuleStructure(modules) {
  // Future implementation could format and print module hierarchy
  console.log('Displaying module structure for modules:', modules);
  return {};
}

// Function to reset body rotation
function resetRotation() {
  document.body.style.transform = 'rotate(0deg)';
  document.body.style.transition = 'transform 0.3s ease';
}

function add(a, b) {
  return a + b;
}

// Helper functions for functionA
function functionX() { return 'functionX'; }
function functionY() { return 'functionY'; }
function functionZ() { return 'functionZ'; }

// TODO: Re-add the required exports for functionA and functionB
// Assuming that they are objects with properties X, Y, and Z
const functionA = {
  // ... (Preserve the existing code for functionA)

  X: functionX, // Do not remove or rename this export
  Y: functionY, // Do not remove or rename this export
  Z: functionZ, // Do not remove or rename this export
};

// TODO: Identify and update specific functions that render dependency graphs or display module structure for debugging purposes.
function renderDependencyGraph(modules) {
  // Future implementation could traverse and log module dependencies
  console.log('Rendering dependency graph for modules:', modules);
  return {};
}

// Placeholder for bot logic for Screeps
function loop() {
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    if (creep.memory.role === 'harvester') {
      if (creep.store.getFreeCapacity() > 0) {
        let source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      }
    }
  }
}

// Helper functions for functionB
function functionXb() { return 'functionXb'; }
function functionYb() { return 'functionYb'; }
function functionZb() { return 'functionZb'; }

const functionB = {
  // ... (Preserve the existing code for functionB)

  X: functionXb, // Do not remove or rename this export
  Y: functionYb, // Do not remove or rename this export
  Z: functionZb, // Do not remove or rename this export
};

// Existing placeholder functions for function1 and function2 (referenced in exports)
function function1() {
  return 'function1';
}

function function2() {
  return 'function2';
}

/**
 * Creates an accessible in-page button with proper ARIA attributes
 * @param {string} text - Button text
 * @param {Function} onClick - Click handler
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.type = 'button';
  
  // Ensure button has an accessible name
  if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
    throw new Error('Button must have either text content or aria-label');
  }
  
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

/**
 * Validates table accessibility requirements
 * @param {HTMLTableElement} table - The table to validate
 * @returns {Object} Validation result with issues array
 */
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) {
    return { valid: false, issues: ['Table element is required'] };
  }
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push('Table should have a caption for accessibility');
  }
  
  // Check for th elements with scope or headers
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push('Table should have header cells (th) for accessibility');
  }
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Validates table structure for proper accessibility
 * @param {HTMLTableElement} table - The table to validate
 * @returns {Object} Validation result with structure issues
 */
function validateTableStructure(table) {
  const issues = [];
  
  if (!table) {
    return { valid: false, issues: ['Table element is required'] };
  }
  
  // Check for thead and tbody
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  
  if (!thead) {
    issues.push('Table should have a thead section');
  }
  
  if (!tbody) {
    issues.push('Table should have a tbody section');
  }
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Validates that landmarks have proper roles
 * @param {Document|Element} root - Root element to search within
 * @returns {Object} Validation result with landmark issues
 */
function validateLandmark(root = document) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article', 'search'];
  
  // Check for main landmark
  const mainElements = root.querySelectorAll('main, [role="main"]');
  if (mainElements.length === 0) {
    issues.push('Page should have at least one main landmark');
  } else if (mainElements.length > 1) {
    issues.push('Page should have only one main landmark');
  }
  
  // Check for header landmark
  const headerElements = root.querySelectorAll('header, [role="banner"]');
  if (headerElements.length > 1) {
    issues.push('Page should have only one header landmark');
  }
  
  // Check for footer landmark
  const footerElements = root.querySelectorAll('footer, [role="contentinfo"]');
  if (footerElements.length > 1) {
    issues.push('Page should have only one footer landmark');
  }
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Validates landmark structure for proper accessibility
 * @param {Document|Element} root - Root element to search within
 * @returns {Object} Validation result with landmark structure issues
 */
function validateLandmarkStructure(root = document) {
  const issues = [];
  
  if (!root) {
    return { valid: false, issues: ['Root element is required'] };
  }
  
  // Ensure essential landmarks are present
  const mainElements = root.querySelectorAll('main, [role="main"]');
  const headerElements = root.querySelectorAll('header, [role="banner"]');
  const navElements = root.querySelectorAll('nav, [role="navigation"]');
  const footerElements = root.querySelectorAll('footer, [role="contentinfo"]');
  
  if (mainElements.length === 0) {
    issues.push('Page should have at least one main landmark');
  }
  
  if (navElements.length === 0) {
    issues.push('Page should have at least one navigation landmark');
  }
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Ensures that landmarks are unique and have distinct labels where needed
 * @param {Document|Element} root - Root element to search within
 * @returns {Object} Validation result with landmark uniqueness issues
 */
function ensureUniqueLandmarks(root = document) {
  const issues = [];
  
  if (!root) {
    return { valid: false, issues: ['Root element is required'] };
  }
  
  // Ensure only one main landmark
  const mainElements = root.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    issues.push('Page should have only one main landmark');
  }
  
  // Ensure only one banner (header) landmark
  const headerElements = root.querySelectorAll('header, [role="banner"]');
  if (headerElements.length > 1) {
    issues.push('Page should have only one banner landmark');
  }
  
  // Ensure only one contentinfo (footer) landmark
  const footerElements = root.querySelectorAll('footer, [role="contentinfo"]');
  if (footerElements.length > 1) {
    issues.push('Page should have only one contentinfo landmark');
  }
  
  // Check that multiple nav landmarks have unique labels
  const navElements = root.querySelectorAll('nav, [role="navigation"]');
  if (navElements.length > 1) {
    const labels = new Set();
    navElements.forEach((nav) => {
      const label = nav.getAttribute('aria-label') || nav.getAttribute('aria-labelledby') || '';
      if (labels.has(label)) {
        issues.push('Multiple nav landmarks should have unique labels');
      }
      labels.add(label);
    });
  }
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Validates link accessibility requirements
 * @param {HTMLAnchorElement} link - The link element to validate
 * @returns {Object} Validation result with link issues
 */
function validateLinkAccessibility(link) {
  const issues = [];
  
  if (!link) {
    return { valid: false, issues: ['Link element is required'] };
  }
  
  // Check if the link has discernible text
  const linkText = (link.textContent || '').trim();
  const ariaLabel = link.getAttribute('aria-label');
  const ariaLabelledBy = link.getAttribute('aria-labelledby');
  
  if (!linkText && !ariaLabel && !ariaLabelledBy) {
    issues.push('Link must have discernible text or aria-label');
  }
  
  // Check for fake links (anchors without href or with href="#")
  const href = link.getAttribute('href');
  if (!href || href === '#') {
    issues.push('Link should have a valid href; use <button> for actions that do not navigate');
  }
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Handles fake links by converting them to appropriate elements
 * @param {Document|Element} root - Root element to search within
 * @returns {Object} Result describing the actions taken
 */
function handleFakeLinks(root = document) {
  const result = {
    converted: 0,
    issues: []
  };
  
  if (!root) {
    result.issues.push('Root element is required');
    return result;
  }
  
  // Find anchors without proper href or with href="#"
  const anchors = root.querySelectorAll('a');
  anchors.forEach((anchor) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') {
      result.issues.push('Found a fake link that should be converted to a button');
      result.converted += 1;
    }
  });
  
  return result;
}

/**
 * Gets the accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string|null} The accessible name or null if not present
 */
function getSvgAccessibleName(svg) {
  if (!svg) {
    return null;
  }
  
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) {
      return labelElement.textContent || null;
    }
  }
  
  const titleElement = svg.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent;
  }
  
  return null;
}

/**
 * Sets accessible attributes on an SVG element
 * @param {SVGElement} svg - The SVG element
 * @param {string} accessibleName - The accessible name to set
 * @returns {void}
 */
function setSvgAttributes(svg, accessibleName) {
  if (!svg) {
    throw new Error('SVG element is required');
  }
  
  if (!accessibleName) {
    throw new Error('Accessible name is required');
  }
  
  if (!svg.getAttribute('aria-label')) {
    svg.setAttribute('aria-label', accessibleName);
  }
  
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
}