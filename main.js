import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

document.documentElement.lang = 'en';

reportWebVitals();

const VERSION = '1.0.0';

const CONFIG = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development'
};

function initialize() {
  console.log('Application initialized');
  return true;
}

function getConfig() {
  return CONFIG;
}

function getVersion() {
  return VERSION;
}

// Function to get the lang attribute
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// Function to validate table accessibility
function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  const issues = [];
  
  tables.forEach((table, index) => {
    const hasCaption = table.querySelector('caption') !== null;
    const hasAriaLabel = table.getAttribute('aria-label') !== null;
    const hasAriaLabelledby = table.getAttribute('aria-labelledby') !== null;
    
    if (!hasCaption && !hasAriaLabel && !hasAriaLabelledby) {
      issues.push({
        type: 'REACT_027',
        message: `Table ${index + 1} lacks accessible name (caption, aria-label, or aria-labelledby)`,
        severity: 'warning'
      });
    }
  });
  
  return issues;
}

// Function to validate table structure
function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  const issues = [];
  
  tables.forEach((table, index) => {
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const headers = table.querySelectorAll('th');
    
    if (!thead) {
      issues.push({
        type: 'REACT_027',
        message: `Table ${index + 1} missing thead element`,
        severity: 'warning'
      });
    }
    
    if (!tbody) {
      issues.push({
        type: 'REACT_027',
        message: `Table ${index + 1} missing tbody element`,
        severity: 'warning'
      });
    }
    
    if (headers.length === 0) {
      issues.push({
        type: 'REACT_027',
        message: `Table ${index + 1} missing th elements for headers`,
        severity: 'warning'
      });
    }
  });
  
  return issues;
}

// Function to get SVG accessible name
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';
  
  // Check for title element inside SVG
  const title = svgElement.querySelector('title');
  if (title && title.textContent) {
    return title.textContent;
  }
  
  // Check for aria-label attribute
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby attribute
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const referencedElement = document.getElementById(ariaLabelledby);
    if (referencedElement) {
      return referencedElement.textContent;
    }
  }
  
  return '';
}

// Function to validate SVG accessibility
function validateSvgAccessibility() {
  const svgs = document.querySelectorAll('svg');
  const issues = [];
  
  svgs.forEach((svg, index) => {
    const accessibleName = getSvgAccessibleName(svg);
    if (!accessibleName) {
      issues.push({
        type: 'REACT_041',
        message: `SVG ${index + 1} lacks accessible name (title, aria-label, or aria-labelledby)`,
        severity: 'warning'
      });
    }
  });
  
  return issues;
}

// Function to ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  const issues = [];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    const roleAttr = `[role="${landmark}"]`;
    const roleElements = document.querySelectorAll(roleAttr);
    
    // For main, header, footer, aside - there should typically be only one
    if (['main', 'header', 'footer', 'aside'].includes(landmark)) {
      if (elements.length > 1 || roleElements.length > 1) {
        issues.push({
          type: 'REACT_025',
          message: `Multiple ${landmark} landmarks detected (${elements.length + roleElements.length} found)`,
          severity: 'warning'
        });
      }
    }
  });
  
  return issues;
}

// Function to fix fake link issues
function fixFakeLinkIssues() {
  const issues = [];
  
  // Find elements with onclick that look like links but aren't
  const anchorsWithoutHref = document.querySelectorAll('a:not([href])');
  const clickableElements = document.querySelectorAll('[onclick]');
  
  clickableElements.forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    const hasHref = element.getAttribute('href');
    const hasOnClick = element.hasAttribute('onclick');
    
    // Check if element looks like a link (has cursor pointer, styled as link, etc.)
    const computedStyle = window.getComputedStyle(element);
    const isClickable = computedStyle.cursor === 'pointer' || 
                        element.classList.contains('link') ||
                        element.classList.contains('btn-link');
    
    if (isClickable && !hasHref && hasOnClick) {
      // Check if it's in a navigation context
      const parentNav = element.closest('nav');
      const parentList = element.closest('ul, ol');
      
      if (parentNav || parentList) {
        issues.push({
          type: 'REACT_036',
          message: `Element ${index + 1} appears to be a fake link (clickable element without href in navigation)`,
          severity: 'warning',
          suggestion: 'Consider using an <a> element with href attribute for proper accessibility'
        });
      }
    }
  });
  
  return issues;
}

// Function to create accessible in-page button
function createInPageButton(options = {}) {
  const { id, text, onClick, className = '' } = options;
  
  const button = document.createElement('button');
  if (id) button.id = id;
  button.textContent = text || 'Button';
  button.className = className;
  button.type = 'button';
  
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

// Function to handle keydown events on main content
function handleMainKeydown(event) {
  // Placeholder for main content keydown handling
  if (event.key === 'Tab' && event.shiftKey) {
    // Handle shift+tab navigation
  }
}

// Function to add accessible name to person name element
function personName(element) {
  if (!element) return null;
  
  // Check if element already has accessible name
  const existingAriaLabel = element.getAttribute('aria-label');
  const existingAriaLabelledby = element.getAttribute('aria-labelledby');
  
  if (existingAriaLabel || existingAriaLabelledby) {
    return existingAriaLabel || 'Person name';
  }
  
  // If element has text content, use it
  const textContent = element.textContent?.trim();
  if (textContent) {
    element.setAttribute('aria-label', textContent);
  }
  
  return element;
}

// Accessibility: Ensure main content is keyboard accessible
function setupMainContentAccessibility() {
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.addEventListener('keydown', handleMainKeydown);
  }
}

// Main function to address all accessibility issues
function addressAccessibilityIssues() {
  setupMainContentAccessibility();
  
  const results = {
    langAttribute: getLangAttribute(),
    tableAccessibilityIssues: validateTableAccessibility(),
    tableStructureIssues: validateTableStructure(),
    svgAccessibilityIssues: validateSvgAccessibility(),
    landmarkIssues: ensureUniqueLandmarks(),
    fakeLinkIssues: fixFakeLinkIssues()
  };
  
  // Log all issues
  const allIssues = [
    ...results.tableAccessibilityIssues,
    ...results.tableStructureIssues,
    ...results.svgAccessibilityIssues,
    ...results.landmarkIssues,
    ...results.fakeLinkIssues
  ];
  
  if (allIssues.length > 0) {
    console.group('Accessibility Issues Found:');
    allIssues.forEach(issue => {
      console.warn(`[${issue.type}] ${issue.message}`);
      if (issue.suggestion) {
        console.info(`Suggestion: ${issue.suggestion}`);
      }
    });
    console.groupEnd();
  }
  
  return {
    totalIssues: allIssues.length,
    issues: allIssues,
    lang: results.langAttribute
  };
}

/**
 * Setup skip link functionality for keyboard navigation
 */
function setupSkipLinks() {
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(skipLink.getAttribute('href').slice(1));
      if (target) {
        target.focus();
        target.scrollIntoView();
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
    if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', 'Action button');
    }
  });
}

/**
 * Count the total number of dependencies across all modules
 * @param {Object} dependencies - Object mapping module names to their dependency arrays
 * @returns {number} Total count of all dependencies
 */
function countDependencies(dependencies) {
  let totalCount = 0;
  for (const moduleName in dependencies) {
    if (dependencies[moduleName] && Array.isArray(dependencies[moduleName])) {
      totalCount += dependencies[moduleName].length;
    }
  }
  return totalCount;
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
  initAccessibilityEnhancements
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
  initAccessibilityEnhancements
};