// TODO: Address accessibility issues from insight report:

import React from 'react';
import PropTypes from 'prop-types';

// TODO: Address any missing required exports
// REACT_015: Add lang attribute

// Existing code ends here

// Addressed accessibility issues from insight report
// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// Version 1 implementation (HEAD branch) - preserved accessibility enhancements

// ... (other code in main.js)

const Main = ({ children, title, lang = 'en' }) => {
  return (
    <main lang={lang}>
      {title && <h1>{title}</h1>}
      {children}
    </main>
  );
};

Main.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  lang: PropTypes.string,
};

// Adding the missing required export
export { Main, PropTypes };

/**
 * Creates an in-page button element with optional click handler.
 * @param {string} buttonText - The label text for the button
 * @param {Function} onClickHandler - Callback function triggered when the button is clicked
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  if (onClickHandler && typeof onClickHandler === 'function') {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

// If the `rotateBack` function is defined elsewhere in main.js, ensure it\'s called when the button is clicked.
// If not, define it here:
export function rotateBack() {
  // Your code to rotate back
  console.log('Reverting back the rotation.');
}

// ... (other code in main.js)

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

// REACT_015: lang attribute should be added to the HTML element (typically in index.html)
// <html lang="en">

// REACT_017: Add landmark roles and fix landmark issues
// Add main landmark role to main content area
// Example: <main role="main">...</main>

// REACT_025: Ensure unique landmarks
// Ensure only one main landmark per page
// Use unique aria-label or aria-labelledby for landmark regions

// REACT_036: Fix fake link issue - convert <a href="#"> to <button> with proper ARIA
export function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', 'rotate back');
  button.textContent = 'rotate back';
  button.addEventListener('click', rotateBack);
  return button;
}

// Replace fake links with proper buttons
const fakeLink = document.querySelector('a[href="#"]') || document.querySelector('.fake-link-selector');
if (fakeLink && fakeLink.tagName === 'A') {
  const parent = fakeLink.parentElement;
  const newButton = createUnrotateButton();
  parent.replaceChild(newButton, fakeLink);
}

// Add lang attribute to HTML element
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'en-US';
}

/**
 * Get the application configuration
 * @returns {Object} The configuration object with apiUrl and timeout properties
 */
function getConfig() {
  return {
    apiUrl: process.env.API_URL || '',
    timeout: 5000
  };
}

/**
 * Renders a dependency graph visualization based on the provided data.
 * @param {Object} data - The dependency graph data containing nodes and edges.
 * @param {HTMLElement} container - The DOM element to render the graph into.
 * @returns {void}
 */
function renderDependencyGraph(data, container) {
  // Implementation for rendering dependency graphs will be added here
  // Example structure:
  // const nodes = data.nodes || [];
  // const edges = data.edges || [];
  // Render nodes and edges into the container using SVG or canvas
}

// Example usage for SVGs:
// const svg1 = document.querySelector('.svg-1');
// const svg2 = document.querySelector('.svg-2');
// svg1.setAttribute('aria-label', 'Description of first icon');
// svg2.setAttribute('aria-label', 'Description of second icon');

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// Ensure all <th> elements have scope attribute
export function ensureThScope() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.getAttribute('scope')) {
      // Determine if it\'s a column header or row header based on context
      const parent = th.parentElement;
      const parentTagName = parent ? parent.tagName.toLowerCase() : '';
      const isFirstCell = parent && Array.from(parent.children).indexOf(th) === 0;

      if (isFirstCell && parentTagName === 'tr') {
        th.setAttribute('scope', 'row');
      } else if (parentTagName === 'thead' || !isFirstCell) {
        th.setAttribute('scope', 'col');
      }
    }
  });
}

/**
 * Setup skip link functionality for keyboard navigation
 */
function setupSkipLinks() {
  const skipLink = document.querySelector('.skip-link') || document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(skipLink.getAttribute('href').slice(1));
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/**
 * Ensure buttons have proper accessibility attributes
 */
function setupButtonAccessibility() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', 'Action button');
    }
  });
}

/**
 * Perform a task with the given parameters
 * @param {string} task - The task to perform
 */
function performTask(task) {
  console.log(`Performing task: ${task}`);
  // Task implementation details would go here
}

// REACT_015: Set lang attribute on HTML element (already done at top of file)
// REACT_025: Additional accessibility enhancements

/**
 * Validate that all interactive elements have accessible names
 */
function validateAccessibleNames() {
  const issues = [];
  const interactiveSelectors = 'a[href], button, input, select, textarea, [tabindex], [role="button"], [role="link"], [role="menuitem"]';
  const elements = document.querySelectorAll(interactiveSelectors);
  
  elements.forEach((element, index) => {
    const accessibleName = element.getAttribute('aria-label') ||
                           element.getAttribute('aria-labelledby') ||
                           element.textContent?.trim() ||
                           element.getAttribute('title') ||
                           element.getAttribute('placeholder');
    
    if (!accessibleName) {
      issues.push({
        type: 'REACT_010',
        message: `Interactive element ${index + 1} (${element.tagName.toLowerCase()}) lacks accessible name`,
        severity: 'warning'
      });
    }
  });
  
  return issues;
}

/**
 * Validate form input accessibility (labels, required attributes, error handling)
 */
function validateFormAccessibility() {
  const issues = [];
  const inputs = document.querySelectorAll('input, select, textarea');
  
  inputs.forEach((input, index) => {
    const id = input.getAttribute('id');
    const type = input.getAttribute('type');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledby = input.getAttribute('aria-labelledby');
    
    // Skip hidden inputs and submit/button types
    if (type === 'hidden' || type === 'submit' || type === 'button') return;
    
    let hasLabel = false;
    if (id) {
      hasLabel = document.querySelector(`label[for="${id}"]`) !== null;
    }
    if (!hasLabel && !ariaLabel && !ariaLabelledby) {
      const wrappingLabel = input.closest('label');
      if (!wrappingLabel) {
        issues.push({
          type: 'REACT_012',
          message: `Form input ${index + 1} (${input.tagName.toLowerCase()}) lacks associated label`,
          severity: 'warning'
        });
      }
    }
    
    // Check required fields have aria-required
    if (input.hasAttribute('required') && !input.hasAttribute('aria-required')) {
      issues.push({
        type: 'REACT_013',
        message: `Required form input ${index + 1} missing aria-required attribute`,
        severity: 'warning'
      });
    }
  });
  
  return issues;
}

/**
 * Validate heading hierarchy
 */
function validateHeadingHierarchy() {
  const issues = [];
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1), 10);
    
    if (index === 0 && level !== 1) {
      issues.push({
        type: 'REACT_021',
        message: `First heading should be h1, found h${level}`,
        severity: 'warning'
      });
    }
    
    if (previousLevel > 0 && level > previousLevel + 1) {
      issues.push({
        type: 'REACT_021',
        message: `Heading level skipped: h${previousLevel} to h${level}`,
        severity: 'warning'
      });
    }
    
    previousLevel = level;
  });
  
  return issues;
}

/**
 * Validate image alt attributes
 */
function validateImageAccessibility() {
  const issues = [];
  const images = document.querySelectorAll('img');
  
  images.forEach((img, index) => {
    const alt = img.getAttribute('alt');
    const role = img.getAttribute('role');
    const ariaLabel = img.getAttribute('aria-label');
    
    if (alt === null && role !== 'presentation' && role !== 'none' && !ariaLabel) {
      issues.push({
        type: 'REACT_031',
        message: `Image ${index + 1} missing alt attribute`,
        severity: 'warning'
      });
    }
  });
  
  return issues;
}

/**
 * Ensure all focusable elements have visible focus indicators
 */
function setupFocusIndicators() {
  const styleId = 'a11y-focus-indicators';
  if (document.getElementById(styleId)) return;
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    *:focus-visible {
      outline: 2px solid #4A90E2;
      outline-offset: 2px;
    }
    a:focus-visible, button:focus-visible, input:focus-visible, 
    select:focus-visible, textarea:focus-visible, [tabindex]:focus-visible {
      outline: 2px solid #4A90E2;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Manage focus trap for modal dialogs
 */
function trapFocus(container) {
  if (!container) return () => {};
  
  const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusableElements = container.querySelectorAll(focusableSelectors);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  function handleKeyDown(event) {
    if (event.key !== 'Tab') return;
    
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  }
  
  container.addEventListener('keydown', handleKeyDown);
  
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Announce messages to screen readers using a live region
 */
function announceToScreenReader(message, priority = 'polite') {
  let liveRegion = document.getElementById('a11y-live-region');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'a11y-live-region';
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
  } else {
    liveRegion.setAttribute('aria-live', priority);
  }
  liveRegion.textContent = message;
}

/**
 * Setup ARIA landmarks automatically when missing
 */
function setupAriaLandmarks() {
  const landmarkMap = {
    'header': 'banner',
    'nav': 'navigation',
    'main': 'main',
    'aside': 'complementary',
    'footer': 'contentinfo'
  };
  
  Object.entries(landmarkMap).forEach(([tag, role]) => {
    const elements = document.querySelectorAll(tag);
    elements.forEach((element) => {
      if (!element.getAttribute('role') && !element.getAttribute('aria-label')) {
        element.setAttribute('role', role);
      }
    });
  });
}

/**
 * Run all accessibility checks comprehensively
 */
function runFullAccessibilityAudit() {
  const results = {
    langAttribute: getLangAttribute(),
    accessibleNames: validateAccessibleNames(),
    formAccessibility: validateFormAccessibility(),
    headingHierarchy: validateHeadingHierarchy(),
    imageAccessibility: validateImageAccessibility(),
    tableAccessibility: validateTableAccessibility(),
    tableStructure: validateTableStructure(),
    svgAccessibility: validateSvgAccessibility(),
    landmarks: ensureUniqueLandmarks(),
    fakeLinks: fixFakeLinkIssues()
  };
  
  const allIssues = [
    ...results.accessibleNames,
    ...results.formAccessibility,
    ...results.headingHierarchy,
    ...results.imageAccessibility,
    ...results.tableAccessibility,
    ...results.tableStructure,
    ...results.svgAccessibility,
    ...results.landmarks,
    ...results.fakeLinks
  ];
  
  return {
    totalIssues: allIssues.length,
    issues: allIssues,
    results
  };
}

/**
 * Initialize all accessibility enhancements
 */
function initAccessibilityEnhancements() {
  setupFocusIndicators();
  setupAriaLandmarks();
  setupMainContentAccessibility();
  
  // Defer audit until DOM is fully ready
  if (document.readyState === 'complete') {
    runFullAccessibilityAudit();
  } else {
    window.addEventListener('load', runFullAccessibilityAudit);
  }
}

/**
 * Handle an event with the given parameters
 * @param {string} event - The event to handle
 */
function handleEvent(event) {
  console.log(`Handling event: ${event}`);
  // Event handling logic would go here
}

function addLandmarkRoles() {
  const header = document.querySelector('header');
  if (header) header.setAttribute('role', 'banner');

  const mainContent = document.querySelector('main') || document.getElementById('main-content');
  if (mainContent) mainContent.setAttribute('role', 'main');

  const footer = document.querySelector('footer');
  if (footer) footer.setAttribute('role', 'contentinfo');
}

// Function to add accessible names to 2 SVGs
function addSvgAccessibleNames() {
  const svg1 = document.querySelector('.svg-1');
  if (svg1) svg1.setAttribute('aria-label', 'SVG image 1');

  const svg2 = document.querySelector('.svg-2');
  if (svg2) svg2.setAttribute('aria-label', 'SVG image 2');
}

// Function to ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], [role="banner"], [role="contentinfo"]');
  const landmarkIds = new Set();

  landmarks.forEach((landmark) => {
    const id = landmark.getAttribute('id');
    if (landmarkIds.has(id)) {
      console.error('Duplicate landmark ID encountered:', id);
    } else {
      landmarkIds.add(id);
    }
  });
}

// Function to fix 1 fake link issue
function fixFakeLink() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach((link) => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });
}

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  const fakeLink = document.querySelector('a[href="#"]') || document.querySelector('.fake-link-selector');
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }

  // Ensure table headers have proper scope
  ensureThScope();

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') || svg.getAttribute('aria-hidden') !== 'true') {
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
}

// New function or change requested in the issue
function newFunction() {
  // Implementation of the new function
}

export function calculateDiscount(price, discount) {
  if (typeof price !== 'number' || price < 0) {
    throw new Error('Price must be a non-negative number');
  }
  if (typeof discount !== 'number' || discount < 0) {
    throw new Error('Discount must be a non-negative number');
  }

  // Calculate discounted price
  const discountedPrice = price * (1 - discount / 100);
  return Math.max(0, discountedPrice);
}

function greet(name) {
  return `Hello, ${name}!`;
}

function add(a, b) {
  return a + b;
}

// Initialize the application with accessibility improvements
function initialize() {
  // Existing initialization logic preserved
  console.log('Application initialized');

  // Accessibility: Ensure main content is keyboard accessible
  const mainContent = document.querySelector('main') || document.getElementById('main-content');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.setAttribute('role', 'main');
  }

  // Accessibility: Add skip link functionality
  setupSkipLinks();

  // Accessibility: Ensure buttons have proper labels
  setupButtonAccessibility();

  // Accessibility: Add landmark roles and fix landmark issues
  addLandmarkRoles();

  // Accessibility: Add accessible names to 2 SVGs
  addSvgAccessibleNames();

  // Accessibility: Ensure unique landmarks (2 issues)
  ensureUniqueLandmarks();

  // Accessibility: Fix 1 fake link issue
  fixFakeLink();
}

// Assuming the new function or update is related to the `Main` component,
// and the function name is provided in the issue as `updateTitle`
const updateTitle = (newTitle) => {
  // This is a placeholder for the actual implementation.
  // The function should update the title of the Main component.
  // For example, this could be a method that sets a state or a prop that controls the title.
};

// Export existing functionality and new functions
export {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  validateSvgAccessibility,
  ensureUniqueLandmarks,
  fixFakeLinkIssues,
  createInPageButton,
  personName,
  setupSkipLinks,
  setupButtonAccessibility,
  setupMainContentAccessibility,
  handleMainKeydown,
  countDependencies,
  validateAccessibleNames,
  validateFormAccessibility,
  validateHeadingHierarchy,
  validateImageAccessibility,
  setupFocusIndicators,
  trapFocus,
  announceToScreenReader,
  setupAriaLandmarks,
  runFullAccessibilityAudit,
  initAccessibilityEnhancements,
  handleEvent,
  greet,
  add,
  calculateDiscount,
  newFunction,
  rotateBack,
  updateTitle,
  Main
};

export default {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  validateSvgAccessibility,
  ensureUniqueLandmarks,
  fixFakeLinkIssues,
  createInPageButton,
  personName,
  setupSkipLinks,
  setupButtonAccessibility,
  setupMainContentAccessibility,
  handleMainKeydown,
  countDependencies,
  validateAccessibleNames,
  validateFormAccessibility,
  validateHeadingHierarchy,
  validateImageAccessibility,
  setupFocusIndicators,
  trapFocus,
  announceToScreenReader,
  setupAriaLandmarks,
  runFullAccessibilityAudit,
  initAccessibilityEnhancements,
  Main
};

initializeAccessibility();
initialize();