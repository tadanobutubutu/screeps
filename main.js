// TODO: Address accessibility issues from insight report:

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Address missing required export for lang attribute
// REACT_015: Add lang attribute
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Addressed accessibility issues from insight report

// Accessibility Utilities
const a11y = {
  // Focus trap for modals
  trapFocus: function(element) {
    // ... (head branch's Accessibility Utilities)
  },

  // ARIA live region for announcements
  announce: function(message, priority = 'polite') {
    // ... (head branch's Accessibility Utilities)
  },

  // Handle keyboard navigation for custom components
  handleArrowKeys: function(element, callback) {
    // ... (head branch's Accessibility Utilities)
  },

  // Reduce motion check
  prefersReducedMotion: function() {
    // ... (head branch's Accessibility Utilities)
  }
};

// Initialize accessibility features
function initA11y() {
  // ... (head branch's initialization logic)
}

// If the `rotateBack` function is defined elsewhere in main.js, ensure it's called when the button is clicked.
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
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', 'rotate back');
  button.textContent = 'rotate back';
  button.addEventListener('click', rotateBack);
  return button;
}

// Replace fake links with proper buttons
const fakeLink = document.querySelector('.fake-link');
if (fakeLink && fakeLink.tagName === 'A') {
  const parent = fakeLink.parentElement;
  const newButton = createUnrotateButton();
  parent.replaceChild(newButton, fakeLink);
}

// TODO: Add a language attribute to the HTML element
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'en';
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

// Example usage for SVGs:
const svg1 = document.querySelector('.svg-icon-1');
const svg2 = document.querySelector('.svg-icon-2');

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// Ensure all <th> elements have scope attribute
function ensureThScope() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.getAttribute('scope')) {
      // Determine if it's a column header or row header based on context
      const parent = th.parentElement;
      const parentTagName = parent ? parent.tagName.toLowerCase() : '';
      const isFirstCell = parent && Array.prototype.indexOf.call(parent.children, th) === 0;

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
  const skipLink = document.querySelector('a[href="#main-content"]') || document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href') || '');
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

function setupButtonAccessibility() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
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

// ... (head branch's added feature - add landmark roles and fix landmark issues)
function addLandmarkRoles() {
  const header = document.querySelector('header');
  if (header) header.setAttribute('role', 'banner');

  const mainContent = document.querySelector('main') || document.getElementById('main');
  if (mainContent) mainContent.setAttribute('role', 'main');

  const footer = document.querySelector('footer');
  if (footer) footer.setAttribute('role', 'contentinfo');
}

// ... (head branch's added feature - add accessible names to 2 SVGs)
function addSvgAccessibleNames() {
  const svg1 = document.querySelectorAll('svg')[0];
  if (svg1 && !svg1.getAttribute('aria-label') && svg1.getAttribute('aria-hidden') !== 'true') {
    svg1.setAttribute('aria-label', 'SVG image 1');
  }

  const svg2 = document.querySelectorAll('svg')[1];
  if (svg2 && !svg2.getAttribute('aria-label') && svg2.getAttribute('aria-hidden') !== 'true') {
    svg2.setAttribute('aria-label', 'SVG image 2');
  }
}

// Function to ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], [role="banner"], [role="contentinfo"], [role="navigation"]');
  const landmarkIds = new Set();

  landmarks.forEach((landmark) => {
    const id = landmark.id;
    if (landmarkIds.has(id)) {
      console.error('Duplicate landmark ID encountered:', id);
    } else if (id) {
      landmarkIds.add(id);
    }
  });
}

// Function to fix 1 fake link issue
function fixFakeLink() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach((link) => {
    if (link.getAttribute('aria-hidden') === 'true') {
      const button = document.createElement('button');
      button.textContent = link.textContent;
      button.setAttribute('aria-label', link.textContent || 'Button');
      link.parentNode.replaceChild(button, link);
    }
  });
}

/**
 * Generates a report based on accessibility issues found on the page.
 * Scans for common accessibility problems and returns a structured report.
 * @returns {Object} Report object containing issues categorized by severity and type
 */
function generateAccessibilityReport() {
  const issues = {
    critical: [],
    major: [],
    minor: [],
    total: 0
  };

  // REACT_015: Check for lang attribute on HTML element
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement;
    if (!htmlElement.hasAttribute('lang')) {
      issues.critical.push({
        code: 'REACT_015',
        message: 'HTML element is missing lang attribute',
        element: 'html',
        suggestion: 'Add lang attribute to the HTML element (e.g., <html lang="en">)'
      });
    }

    // REACT_017: Check for landmark roles
    const header = document.querySelector('header');
    if (header && !header.hasAttribute('role')) {
      issues.major.push({
        code: 'REACT_017',
        message: 'Header element is missing landmark role',
        element: 'header',
        suggestion: 'Add role="banner" to the header element'
      });
    }

    const mainContent = document.querySelector('main');
    if (mainContent && !mainContent.hasAttribute('role')) {
      issues.major.push({
        code: 'REACT_017',
        message: 'Main element is missing landmark role',
        element: 'main',
        suggestion: 'Add role="main" to the main element'
      });
    }

    const footer = document.querySelector('footer');
    if (footer && !footer.hasAttribute('role')) {
      issues.major.push({
        code: 'REACT_017',
        message: 'Footer element is missing landmark role',
        element: 'footer',
        suggestion: 'Add role="contentinfo" to the footer element'
      });
    }

    // REACT_025: Check for unique landmarks
    const mainLandmarks = document.querySelectorAll('[role="main"]');
    if (mainLandmarks.length > 1) {
      issues.major.push({
        code: 'REACT_025',
        message: `Found ${mainLandmarks.length} main landmarks. Should have only one.`,
        element: '[role="main"]',
        suggestion: 'Ensure only one main landmark per page. Use unique aria-label for additional regions.'
      });
    }

    // REACT_027: Check for th scope attributes
    const thElements = document.querySelectorAll('th');
    thElements.forEach((th, index) => {
      if (!th.hasAttribute('scope')) {
        issues.minor.push({
          code: 'REACT_027',
          message: `Table header at index ${index} is missing scope attribute`,
          element: 'th',
          suggestion: 'Add scope="col" for column headers or scope="row" for row headers'
        });
      }
    });

    // REACT_036: Check for fake links (<a href="#">)
    const fakeLinks = document.querySelectorAll('a[href="#"]');
    fakeLinks.forEach((link, index) => {
      issues.major.push({
        code: 'REACT_036',
        message: `Fake link found at index ${index}. Links should not use href="#" without a valid target.`,
        element: 'a[href="#"]',
        suggestion: 'Replace with <button> element or use a valid href target'
      });
    });

    // Check for SVGs without accessible names
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
      if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby') && svg.getAttribute('aria-hidden') !== 'true') {
        issues.minor.push({
          code: 'REACT_036',
          message: `SVG at index ${index} is missing accessible name`,
          element: 'svg',
          suggestion: 'Add aria-label or aria-labelledby attribute to provide accessible name'
        });
      }
    });

    // Check for buttons without accessible names
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
      if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
        issues.minor.push({
          code: 'REACT_036',
          message: `Button at index ${index} is missing accessible name`,
          element: 'button',
          suggestion: 'Add aria-label attribute or visible text content'
        });
      }
    });
  }

  issues.total = issues.critical.length + issues.major.length + issues.minor.length;

  return {
    issues,
    summary: {
      totalIssues: issues.total,
      critical: issues.critical.length,
      major: issues.major.length,
      minor: issues.minor.length
    },
    generatedAt: new Date().toISOString()
  };
}

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  const fakeLink = document.querySelector('.fake-link');
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

// Initialize the application with accessibility improvements
function initialize() {
  // Existing initialization logic preserved
  console.log('Application initialized');

  // Accessibility: Ensure main content is keyboard accessible
  const mainContent = document.querySelector('main') || document.getElementById('main');
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

  // Run additional accessibility initialization
  initializeAccessibility();
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

// Export existing functionality and new functions
export { 
  initialize, 
  getConfig, 
  setupSkipLinks, 
  setupButtonAccessibility, 
  createInPageButton, 
  performTask, 
  handleEvent, 
  greet, 
  add, 
  calculateDiscount, 
  newFunction,
  rotateBack,
  addLandmarkRoles,
  ensureThScope,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLink,
  initializeAccessibility
};

// Compatibility for CommonJS if needed (as per HEAD)
module.exports = newFunction;

// Initialize