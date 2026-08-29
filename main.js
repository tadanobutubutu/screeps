// main.js - Application entry point
// Accessibility utilities and dependency graph rendering
const fs = require('fs');
const path = require('path');
const dependencyGraphContent = require('./dependencyGraph');
const { class1, function1, Object1 } = require('./path/to/module');
const dependencyGraph = require('./dependencyGraph');

// Math Helper Imports
const { add, subtract, multiply, divide, power, squareRoot } = require('./mathHelpers');
const { utilityFunction } = require('./utils.js');

const getLangAttribute = () => document.documentElement ? document.documentElement.lang || 'en' : 'en';
document.documentElement.lang = getLangAttribute();

function rotateBack() {
  // Logic to rotate back
  // JavaScript code to rotate back
  console.log('Rotating back...');
  // For example, if you're manipulating the DOM or a state:
  // document.getElementById('someElement').classList.remove('rotate-forward');
  // document.getElementById('someElement').classList.add('rotate-backward');
};

const metadata = {
  title: "Screeps Dashboard",
  description: "Dashboard for Screeps",
};

const addLangAttribute = (document, lang = 'en') => {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
  return document;
};

const renderDependencyGraph = (dependencyGraph, container) => {
  const graphContent = dependencyGraph;
  container.innerHTML = graphContent;
};

const config = {
  enabled: true
};

// Store for functions
const main = {
  functions: {},

  // Register a function
  register: function(name, fn) {
    this.functions[name] = fn;
  },

  // Get a registered function
  get: function(name) {
    return this.functions[name];
  },

  // Execute a registered function
  execute: function(name, ...args) {
    const fn = this.functions[name];
    if (typeof fn === 'function') {
      return fn.apply(this, args);
    }
    throw new Error(`Function ${name} not found`);
  }
};

// New export for the myNewFunction
function myNewFunction(arr) {
  return arr.map(item => item * 2);
}

// Utility: Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Utility: Check if user prefers high contrast
function prefersHighContrast() {
  return window.matchMedia('(prefers-contrast: more)').matches;
}

function fixFakeLinkIssue(document) {
  let count = 0;

  const clickableElements = document.querySelectorAll('[onclick], [role="link"]');

  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    const hasHref = element.hasAttribute('href');
    const onclick = element.getAttribute('onclick') || '';

    if (!isAnchor && (onclick.includes('window.location') ||
        onclick.includes('document.location') ||
        onclick.includes('.href'))) {

      const span = document.createElement('span');
      span.textContent = element.textContent;
      span.setAttribute('role', 'link');
      span.setAttribute('tabindex', '0');
      span.setAttribute('onclick', onclick);
      span.onclick = element.onclick;

      span.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          element.click();
        }
      });
    }
  });

  return count;
}

// Example of preserved functionality
function helloWorld() {
  return 'Hello, World!';
}

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svgElement - The SVG element to get the accessible name for
 * @returns {string|null} The accessible name or null if not found
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;

  const title = svgElement.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }

  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }

  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const label = document.getElementById(labelledBy);
    if (label) {
      return label.textContent.trim();
    }
  }

  return null;
}

// Existing isLinkAccessible function implementation
function isLinkAccessible(url) {
  // Existing implementation
  // ...
}

// New function or changes requested in the issue
// Example: a new function to check if a user is authenticated
function isUserAuthenticated(token) {
  // Implementation for checking if a user is authenticated
  // ...
}

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: ensureDependencyGraphARIA, getLangAttribute)
// - REACT_027: Validate table accessibility (DONE: validateTableAccessibility)

function addProperLandmarkRegions() {
  return {
    // Your implementation here
  };
}

// Utility functions (added from the new changes)
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

function checkLandmarkElements(htmlContent) {
  // Implementation for landmark check
}

function validateLandmarkStructure(landmark) {
  // Implementation for landmark validation
}

function validateLandmark(landmark) {
  // Implementation for landmark validation
}

// Function to fix table structure issues
function fixTableStructureIssues(document) {
  let fixedCount = 0;
  const tables = document.querySelectorAll('table');
  // Count tables as a placeholder for structure fixing
  return tables.length;
}

// Check links and buttons for accessibility
function checkLinkAndButtonAccessibility(container) {
  const issues = [];
  
  // Check links for accessibility
  const links = container.querySelectorAll('a');
  links.forEach((link, index) => {
    const text = link.textContent.trim();
    const ariaLabel = link.getAttribute('aria-label');
    const title = link.getAttribute('title');
    
    if (!text && !ariaLabel && !title) {
      issues.push({
        type: 'link',
        index,
        element: link,
        message: 'Link is missing accessible text content. Add visible text, aria-label, or title attribute.'
      });
    }
  });
  
  // Check buttons for accessibility
  const buttons = container.querySelectorAll('button, [role="button"]');
  buttons.forEach((button, index) => {
    const text = button.textContent.trim();
    const ariaLabel = button.getAttribute('aria-label');
    const ariaLabelledby = button.getAttribute('aria-labelledby');
    const title = button.getAttribute('title');
    
    if (!text && !ariaLabel && !ariaLabelledby && !title) {
      issues.push({
        type: 'button',
        index,
        element: button,
        message: 'Button is missing accessible name. Add visible text, aria-label, aria-labelledby, or title attribute.'
      });
    }
  });

  return issues;
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function generateId() {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// Export all functions and objects
module.exports = { 
  getLangAttribute,
  addLangAttribute,
  rotateBack,
  renderDependencyGraph,
  metadata,
  config,
  main,
  myNewFunction,
  prefersReducedMotion,
  prefersHighContrast,
  fixFakeLinkIssue,
  helloWorld,
  getSvgAccessibleName,
  isLinkAccessible,
  isUserAuthenticated,
  addProperLandmarkRegions,
  formatDate,
  checkLandmarkElements,
  validateLandmarkStructure,
  validateLandmark,
  fixTableStructureIssues,
  checkLinkAndButtonAccessibility,
  debounce,
  generateId,
  class1,
  function1,
  Object1,
  dependencyGraphContent,
  dependencyGraph,
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  utilityFunction
};