import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const VERSION = '1.0.0';

const CONFIG = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development'
};

function initialize() {
  console.log('Application initialized');
  return true;
}

/**
 * Implement this function for creating in-page buttons
 */
function createInPageDepGraphButton(depGraphContainer, renderFunction) {
  const button = createInPageButton('render-dep-graph', 'Render Dependency Graph', renderFunction);
  depGraphContainer.appendChild(button);
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

// Define new render function for dependency graph
function renderDependencyGraph() {
  // Add logic to render the dependency graph
  // ...
}

function getConfig() {
  return CONFIG;
}

function getVersion() {
  return VERSION;
}

function addressAccessibilityIssues() {
  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
  interactiveElements.forEach(element => {
    if (!element.hasAttribute('tabindex') && element.tabIndex < 0) {
      element.setAttribute('tabindex', '0');
    }
  });

  // Ensure all images have alt attributes
  const images = document.querySelectorAll('img');
  images.forEach(image => {
    if (!image.hasAttribute('alt')) {
      image.setAttribute('alt', '');
    }
  });

  // Ensure all form inputs have associated labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    if (id && !document.querySelector(`label[for="${id}"]`)) {
      console.warn(`Input with id "${id}" is missing an associated label.`);
    }
  });

  // Ensure proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach(heading => {
    const currentLevel = parseInt(heading.tagName.substring(1), 10);
    if (previousLevel > 0 && currentLevel > previousLevel + 1) {
      console.warn(`Heading hierarchy skipped from h${previousLevel} to h${currentLevel}.`);
    }
    previousLevel = currentLevel;
  });

  // Ensure sufficient color contrast (basic check - flag potential issues)
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    const style = window.getComputedStyle(element);
    const color = style.color;
    const backgroundColor = style.backgroundColor;
    if (color && backgroundColor && color !== backgroundColor) {
      // Placeholder for contrast ratio calculation
      // In production, use a proper contrast checking library
    }
  });

  // Ensure ARIA landmarks are present
  const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"]');
  if (landmarks.length === 0) {
    console.warn('No ARIA landmarks found. Consider adding navigation, main, banner, and contentinfo roles.');
  }

  return true;
}

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

function addLangAttribute(rootElement, lang) {
  // Add lang attribute to the HTML element
  rootElement.setAttribute('lang', lang);
}

// Functions from HEAD side
function validateLandmark() {
  // Validate landmark accessibility
  // Check for proper landmark roles and other accessibility considerations
  // Return true if valid, false otherwise
  return true;
}

function validateLandmarkStructure(rootElement) {
  // Validate landmark structure
  // Check for proper landmark roles and other structural considerations
  // Return true if valid, false otherwise
  return rootElement;
}

function getSvgAccessibleName(svgElement) {
  // Get accessible name for SVG
  // Return accessible name
  return 'Decorative graphic';
}

function createInPageButton(buttonId, label, onclick) {
  // Create an in-page button with appropriate ARIA attributes
  const button = document.createElement('button');
  button.setAttribute('id', buttonId);
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', label);
  button.setAttribute('onclick', onclick);
  return button;
}

function personName(name) {
  // Return person name
  return name;
}

function addMainLandmark(rootElement) {
  // Add main landmark to the provided rootElement
  if (!rootElement) {
    return null;
  }

  const existingMain = rootElement.querySelector('[role="main"]');
  if (!existingMain) {
    const mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    while (rootElement.firstChild) {
      mainElement.appendChild(rootElement.firstChild);
    }
    rootElement.insertBefore(mainElement, rootElement.firstChild);
  }

  return rootElement;
}

function ensureUniqueLandmarks() {
  // Ensure unique landmarks in the entire application
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0 && el.id) {
          el.id = `${el.id}-${index}`;
        }
      });
    }
  });
}

// Rotate back functionality
function rotateBack() {
  // Your code to rotate back
}

// Skip link setup (referenced in initialize)
function setupSkipLinks() {
  // Set up skip link functionality for keyboard navigation
  // Implementation: find or create a skip link that jumps to main content
  let skipLink = document.getElementById('skip-link');
  if (!skipLink) {
    skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.position = 'absolute';
    skipLink.style.left = '-9999px';
    skipLink.style.top = 'auto';
    skipLink.style.width = '1px';
    skipLink.style.height = '1px';
    skipLink.style.overflow = 'hidden';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  return skipLink;
}

// New accessibility enhancement: ensure root container has accessible name and create announcement region
const rootContainer = document.getElementById('root')?.parentElement;
if (rootContainer) {
  rootContainer.setAttribute('role', 'main');
}

const announcementId = 'accessibility-announcement';
const announcement = document.createElement('div');
announcement.id = announcementId;
announcement.setAttribute('aria-live', 'polite');
announcement.setAttribute('aria-atomic', 'true');
// Hide off-screen
announcement.style.position = 'absolute';
announcement.style.left = '-9999px';
announcement.style.top = '-9999px';
document.body.appendChild(announcement);


// Validate that tables in the document are accessible
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
      // Check if element is in a navigation context
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
  // HEAD-specific accessibility fixes
  // Ensure the root container has an accessible name
  const rootContainer = document.getElementById('root').parentElement;
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  // Create a hidden live region for dynamic announcements
  const announcementId = 'accessibility-announcement';
  const announcement = document.createElement('div');
  announcement.id = announcementId;
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  // Hide off-screen
  announcement.style.position = 'absolute';
  announcement.style.left = '-9999px';
  announcement.style.top = '-9999px';
  document.body.appendChild(announcement);

  // Ensure the dependencyGraph container has proper ARIA role and label
  const dependencyGraphContainer = document.querySelector('[data-testid="dependencyGraph"], #dependencyGraph, .dependency-graph, [class*="dependencyGraph"]');
  if (dependencyGraphContainer) {
    if (!dependencyGraphContainer.getAttribute('role')) {
      dependencyGraphContainer.setAttribute('role', 'img');
    }
    if (!dependencyGraphContainer.getAttribute('aria-label') && !dependencyGraphContainer.getAttribute('aria-labelledby')) {
      const label = 'Dependency graph visualization';
      dependencyGraphContainer.setAttribute('aria-label', label);
    }
  }

  // Existing setup and validation
  setupMainContentAccessibility();
  
  const results = {
    langAttribute: getLangAttribute(),
    tableAccessibilityIssues: validateTableAccessibility(),
    tableStructureIssues: validateTableStructure(),
    svgAccessibilityIssues: validateSvgAccessibility(),
    landmarkIssues: ensureUniqueLandmarks(),
    fakeLinkIssues: fixFakeLinkIssues()
  };
  
  // Combine all issues
  const allIssues = [
    ...results.tableAccessibilityIssues,
    ...results.tableStructureIssues,
    ...results.svgAccessibilityIssues,
    ...results.landmarkIssues,
    ...results.fakeLinkIssues
  ];
  
  // Log all issues
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

// Function to setup skip links
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

// Ensure buttons have proper accessibility attributes
function setupButtonAccessibility() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', 'Action button');
    }
  });
}

// Count the total number of dependencies across all modules
// @param {Object} dependencies - Object mapping module names to their dependency arrays
// @returns {number} Total count of all dependencies
function countDependencies(dependencies) {
  let totalCount = 0;
  for (const moduleName in dependencies) {
    if (dependencies[moduleName] && Array.isArray(dependencies[moduleName])) {
      totalCount += dependencies[moduleName].length;
    }
  }
  return totalCount;
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
  createInPageDepGraphButton,
  renderDependencyGraph,
  setupSkipLinks,
  addLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  personName,
  addMainLandmark,
  ensureUniqueLandmarks,
  rotateBack
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
  createInPageDepGraphButton,
  renderDependencyGraph,
  setupSkipLinks,
  addLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  personName,
  addMainLandmark,
  ensureUniqueLandmarks,
  rotateBack
};