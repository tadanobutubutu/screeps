/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

// TODO: This is the existing code that needs to be preserved
// (Implementation added above)

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs

/**
 * Main application entry point with accessibility features
 */

function init() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach(svg => {
    if (!svg.id) {
      svg.setAttribute('id', 'svg-' + Math.random().toString(36).substr(2, 9));
    }

    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }

    setSvgAttributes(svg);
  });
}

function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  const desc = svg.querySelector('desc');
  let accessibleName = '';
  
  if (title) {
    accessibleName += title.textContent;
  }
  if (desc) {
    accessibleName += (accessibleName ? ' - ' : '') + desc.textContent;
  }
  
  return accessibleName;
}

function setSvgAttributes(svg) {
  if (!svg.getAttribute('aria-hidden')) {
    svg.setAttribute('aria-hidden', 'false');
  }
}

const checkTableStructure = function() {
  /* existing code */
  return true;
};

const sampleInsightReport = {
  title: 'Quarterly Performance Report',
  sections: [
    {
      heading: 'Sales Overview',
      content: 'Total sales increased by 15% compared to last quarter.'
    },
    {
      heading: 'Customer Satisfaction',
      content: 'Average satisfaction score: 4.2 out of 5.'
    }
  ]
};

// Implement function for addressing accessibility issues from insight report
// TODO: Implement a function to count dependencies
function countDependencies() {
  const path = require('path');
  const fs = require('fs');
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  return {
    dependencies: Object.keys(dependencies).length,
    devDependencies: Object.keys(devDependencies).length,
    total: Object.keys(dependencies).length + Object.keys(devDependencies).length
  };
}

/**
 * Handle credential response from browser authentication
 * @param {Object} response - The credential response object
 * @returns {Object} Processed credential information
 */
function handleCredentialResponse(response) {
  if (!response) {
    return { success: false, error: 'No credential response provided' };
  }

  // Check if response contains expected credential data
  const hasCredential = response.credential || response.token || response.id;
  
  if (!hasCredential) {
    return { success: false, error: 'Invalid credential response format' };
  }

  // Process credential information
  const processedCredential = {
    id: response.id || null,
    token: response.token || response.credential || null,
    name: response.name || 'Anonymous User',
    email: response.email || null,
    success: true
  };

  // Handle different types of credential responses
  if (response.credential) {
    // Google Sign-In response
    try {
      // Credential is a base64-encoded JWT
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      processedCredential.id = payload.sub || processedCredential.id;
      processedCredential.email = payload.email || processedCredential.email;
      processedCredential.name = payload.name || processedCredential.name;
    } catch (error) {
      console.warn('Failed to parse credential response:', error);
    }
  }

  // Announce success to screen readers
  if (typeof announceToScreenReader === 'function') {
    announceToScreenReader('User successfully authenticated');
  }

  return processedCredential;
}

// Ensure DOM is fully loaded before executing scripts
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment - setup basic exports
  module.exports = {
    checkTableStructure,
    countDependencies,
    init,
    getSvgAccessibleName,
    setSvgAttributes,
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
    calculateAccessibilityScore,
    fixMainTagMisuse,
    validateLandmark,
    spawnSomeCommand,
    addLangAttribute,
    handleCredentialResponse
  };
} else {
  // Browser environment - wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

function setupAriaLiveRegions() {
  const liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    const region = document.createElement('div');
    region.id = 'aria-live-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }
}

function setupFocusManagement() {
  // Trap focus within modal dialogs
  const modals = document.querySelectorAll('[role="dialog"]');
  modals.forEach((modal) => {
    modal.addEventListener('keydown', trapFocus);
  });

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]'
  );
  interactiveElements.forEach(element => {
    if (!element.getAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
}

function trapFocus(event) {
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const modal = event.currentTarget;
  const focusableContent = modal.querySelectorAll(focusableElements);
  const firstFocusableElement = focusableContent[0];
  const lastFocusableElement = focusableContent[focusableContent.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === firstFocusableElement) {
      lastFocusableElement.focus();
      event.preventDefault();
    }
  } else {
    if (document.activeElement === lastFocusableElement) {
      firstFocusableElement.focus();
      event.preventDefault();
    }
  }
}

function handleKeyNavigation(event) {
  const key = event.key;
  const target = event.target;
  
  if (key === 'Enter' || key === ' ') {
    if (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') {
      target.click();
    }
  }
  
  if (key === 'Escape') {
    closeOpenDialogs();
  }
}

function closeOpenDialogs() {
  const openDialogs = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
  openDialogs.forEach(dialog => {
    dialog.setAttribute('aria-hidden', 'true');
    dialog.removeAttribute('open');
  });
}

function announceToScreenReader(message) {
  const liveRegion = document.getElementById('aria-live-region');
  if (liveRegion) {
    liveRegion.textContent = '';
    // Slight delay to ensure screen readers pick up the change
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }
}

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

function createInPageButton(buttonId, buttonText) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = 'in-page-button';
  return button;
}

function renderDependencyGraph(dependencies) {
  const container = document.createElement('div');
  container.className = 'dependency-graph';
  container.setAttribute('role', 'img');
  container.setAttribute('aria-label', 'Dependency graph visualization');
  return container;
}

function handleFakeLinks(issues) {
  if (!Array.isArray(issues)) {
    return [];
  }
  return issues.filter(issue => issue.type === 'fake-link');
}

// Accessibility utilities
const hello = () => {
  return 'Hello from main.js';
};

// Utilities for addressing accessibility issues
const AddressabilityIssues = {
  addressAccessibilityIssues: function(accessibilityReport) {
    const issues = [];
    if (!accessibilityReport) {
      return issues;
    }
    return issues;
  },

  generateAccessibilityReport: function(accessibilityReport) {
    if (!accessibilityReport || !accessibilityReport.issues) {
      return [];
    }

    const report = accessibilityReport.issues.map(issue => ({
      issueType: issue.type,
      status: issue.status || 'pending',
      fixApplied: issue.fixApplied || ''
    }));

    return report;
  },

  calculateAccessibilityScore: function(fixedIssues) {
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
  },

  fixMainTagMisuse: function(source) {
    const mainBlockRegex = /<main[^>]*>([\s\S]*?)<\/main>/gi;

    const matches = source.match(mainBlockRegex);
    if (matches && matches.length <= 1) {
      return source;
    }

    let result = source;
    if (matches) {
      for (let i = 1; i < matches.length; i++) {
        const block = matches[i];
        const fixedBlock = block
          .replace(/<main([^>]*)>/, '<section$1>')
          .replace(/<\/main>/, '</section>');
        result = result.replace(block, fixedBlock);
      }
    }

    return result;
  },

  validateLandmark: function(element) {
    if (!element) {
      return { valid: false, error: 'Element is required' };
    }

    const landmarkRoles = [
      'banner',
      'main',
      'navigation',
      'search',
      'contentinfo',
      'complementary',
      'region',
      'form'
    ];

    const tagName = element.tagName ? element.tagName.toLowerCase() : '';

    const implicitLandmarks = {
      'header': 'banner',
      'main': 'main',
      'nav': 'navigation',
      'aside': 'complementary',
      'footer': 'contentinfo',
      'section': 'region',
      'form': 'form'
    };

    let landmarkRole = element.getAttribute ? element.getAttribute('role') : null;

    if (!landmarkRole && implicitLandmarks[tagName]) {
      landmarkRole = implicitLandmarks[tagName];
    }

    if (!landmarkRole