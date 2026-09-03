// main.js - Accessibility-focused implementation

// Import required modules
const http = require('http');
const path = require('path');
const { exec } = require('child_process');

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

// AddressabilityIssues module
const AddressabilityIssues = {
  checkTableStructure: function (table) {
    if (!table) return false;
    const headers = table.querySelectorAll('th');
    const rows = table.querySelectorAll('tr');
    return headers.length > 0 && rows.length > 1;
  },

  countDependencies: function (node) {
    if (!node || !node.dependencies) return 0;
    return Object.keys(node.dependencies).length;
  },

  validateLandmark: function (element) {
    const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer'];
    return validLandmarks.includes(element.tagName.toLowerCase());
  },

  spawnSomeCommand: function (callback) {
    const spawnOptions = {
      shell: true
    };

    exec('someCommand', spawnOptions, (error, stdout, stderr) => {
      if (error) {
        callback(new Error(`someCommand failed: ${error.message}`));
        return;
      }
      callback(null, `someCommand exited with status code: ${stdout}`);
    });
  }
};

// Add calculateAccessibilityScore function
AddressabilityIssues.calculateAccessibilityScore = function (fixedIssues) {
  if (!Array.isArray(fixedIssues)) {
    return 0;
  }

  const scorePoints = {
    'color-contrast': 5,
    'missing-alt-text': 3,
    'missing-aria-label': 5,
    'heading-order': 2,
    'other': 1
  };

  return fixedIssues.reduce((score, issue) => {
    const points = scorePoints[issue.type] || scorePoints['other'];
    return score + points;
  }, 0);
};

// --- Implementation for REACT_041: Add accessible names to 2 SVGs ---
function getSvgAccessibleName(svgElements) {
  if (!svgElements || svgElements.length === 0) return null;

  const names = svgElements.map(svg => {
    const title = svg.getAttribute('title');
    const description = svg.getAttribute('aria-describedby') || svg.querySelector('desc')?.textContent;
    return title || description || 'Chart';
  });

  return names.join(', ');
}

function setSvgAttributes(svgElements) {
  if (!svgElements || svgElements.length === 0) return;

  svgElements.forEach(svg => {
    const name = getSvgAccessibleName([svg]);
    if (name) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', name);
    }
  });
}

/**
 * Implements the actual logic for functionA.
 * Processes the input data and returns a transformed result.
 *
 * @param {*} input - The input data to process
 * @returns {*} The processed result
 */
function functionA(input) {
  // Implement actual logic for functionA
  if (input === null || input === undefined) {
    return null;
  }

  if (typeof input === 'string') {
    return input.trim();
  }

  if (typeof input === 'number') {
    return input * 2;
  }

  if (Array.isArray(input)) {
    return input.map(item => functionA(item));
  }

  if (typeof input === 'object') {
    const result = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        result[key] = functionA(input[key]);
      }
    }
    return result;
  }

  return input;
}

// Other accessibility functions
function addressAccessibilityIssues(document) {
  const issues = [];
  
  // Check images without alt text
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('alt')) {
      issues.push({ type: 'missing-alt-text', element: img });
    }
  });

  // Check elements missing ARIA labels
  const interactiveElements = document.querySelectorAll('button, a, input');
  interactiveElements.forEach(el => {
    const hasLabel = el.getAttribute('aria-label') || 
                     el.getAttribute('aria-labelledby') ||
                     el.textContent.trim();
    if (!hasLabel) {
      issues.push({ type: 'missing-aria-label', element: el });
    }
  });

  return issues;
}

function generateAccessibilityReport(issues) {
  const report = {
    totalIssues: issues.length,
    issuesByType: {},
    recommendations: []
  };

  issues.forEach(issue => {
    const type = issue.type;
    report.issuesByType[type] = (report.issuesByType[type] || 0) + 1;
    
    switch (type) {
      case 'missing-alt-text':
        report.recommendations.push('Add descriptive alt text to images');
        break;
      case 'missing-aria-label':
        report.recommendations.push('Add ARIA labels to interactive elements');
        break;
      case 'color-contrast':
        report.recommendations.push('Improve color contrast for better visibility');
        break;
      default:
        report.recommendations.push(`Review ${type} issue`);
    }
  });

  return report;
}

// Utility functions
function calculateDifference(a, b) {
  return a - b;
}

function calculateProduct(a, b) {
  return a * b;
}

function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function hello(name) {
  return `Hello, ${name || 'World'}!`;
}

function getVersion() {
  return '1.0.0';
}

function getConfig() {
  return { ...config };
}

// DOM setup functions
function setupAriaLiveRegions(container) {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.id = 'aria-live-region';
  container.appendChild(liveRegion);
  return liveRegion;
}

function setupFocusManagement() {
  const focusableElements = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
}

function enhanceSemanticMarkup(container) {
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1));
    if (previousLevel !== 0 && level - previousLevel > 1) {
      console.warn(`Heading level skip detected: h${previousLevel} to h${level}`);
    }
    previousLevel = level;
  });
}

function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });
}

function handleKeyNavigation(container) {
  container.addEventListener('keydown', (e) => {
    const currentFocusable = container.querySelector(':focus');
    if (!currentFocusable) return;

    let nextFocusable = null;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        nextFocusable = currentFocusable.nextElementSibling;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        nextFocusable = currentFocusable.previousElementSibling;
        break;
      case 'Home':
        nextFocusable = container.firstElementChild;
        break;
      case 'End':
        nextFocusable = container.lastElementChild;
        break;
    }

    if (nextFocusable && nextFocusable.focus) {
      nextFocusable.focus();
      e.preventDefault();
    }
  });
}

function closeOpenDialogs() {
  const openDialogs = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
  openDialogs.forEach(dialog => {
    dialog.setAttribute('aria-hidden', 'true');
    dialog.hidden = true;
  });
}

function announceToScreenReader(message, priority = 'polite') {
  const liveRegion = document.getElementById('aria-live-region') || 
                     document.querySelector(`[aria-live="${priority}"]`);
  if (liveRegion) {
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer');
  const seenTypes = new Map();

  landmarks.forEach(landmark => {
    const type = landmark.tagName.toLowerCase();
    if (!seenTypes.has(type)) {
      seenTypes.set(type, []);
    }
    seenTypes.get(type).push(landmark);
  });

  seenTypes.forEach((elements, type) => {
    if (elements.length > 1 && type !== 'nav') {
      console.warn(`Multiple ${type} landmarks detected. Consider using aria-label to distinguish them.`);
    }
  });
}

function addLangAttribute(document) {
  if (!document.documentElement.hasAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
}

function handleCredentialResponse(response) {
  console.log('Credential response received');
  return response;
}

// Main initialization function
function init() {
  const container = document.getElementById('app') || document.body;
  
  setupAriaLiveRegions(container);
  setupFocusManagement();
  enhanceSemanticMarkup(container);
  addLangAttribute(document);
  ensureUniqueLandmarks();
  
  console.log('Application initialized with accessibility features');
}

// Ensure DOM is fully loaded before executing scripts
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment - setup basic exports
  module.exports = {
    checkTableStructure: AddressabilityIssues.checkTableStructure,
    countDependencies: AddressabilityIssues.countDependencies,
    init,
    setupAriaLiveRegions,
    setupFocusManagement,
    enhanceSemanticMarkup,
    trapFocus,
    handleKeyNavigation,
    closeOpenDialogs,
    announceToScreenReader,
    calculateDifference,
    calculateProduct,
    isNumber,
    clamp,
    hello,
    getVersion,
    getConfig,
    addressAccessibilityIssues,
    generateAccessibilityReport,
    calculateAccessibilityScore: AddressabilityIssues.calculateAccessibilityScore,
    validateLandmark: AddressabilityIssues.validateLandmark,
    spawnSomeCommand: AddressabilityIssues.spawnSomeCommand,
    addLangAttribute,
    handleCredentialResponse,
    AddressabilityIssues,
    functionA,
    getSvgAccessibleName,
    setSvgAttributes
  };
} else {
  // Browser environment - wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}