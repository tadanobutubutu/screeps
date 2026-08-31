// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs

/**
 * Main application entry point with accessibility features
 */

function init() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach(svg => {
    if (svg) {
      svg.setAttribute('role', 'img');
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }

    setSvgAttributes(svg);
  });
}

const checkTableStructure = function(table) {
  // Existing code
  if (!table) return false;
  const rows = table.querySelectorAll('tr');
  return rows && rows.length > 0;
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
    dependencies: Object.keys(dependencies),
    devDependencies: Object.keys(devDependencies),
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
  interactiveElements.forEach((element) => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
}

function enhanceSemanticMarkup() {
  // Add skip link if not present
  if (!document.getElementById('skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.prepend(skipLink);
  }

  // Ensure images have alt attributes
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
    }
  });

  // Ensure form inputs have associated labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const id = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    input.id = id;
    if (!input.hasAttribute('aria-label') && !document.querySelector(`label[for="${id}"]`)) {
      input.setAttribute('aria-label', input.name || 'Input field');
    }
  });
}

function closeOpenDialogs() {
  const openDialogs = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
  openDialogs.forEach((dialog) => {
    dialog.setAttribute('aria-hidden', 'true');
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
  return button;
}

function trapFocus(event) {
  const focusableElements = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
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

function handleKeyNavigation(event, items) {
  const key = event.key;
  const currentIndex = items.indexOf(document.activeElement);

  if (key === 'ArrowDown') {
    event.preventDefault();
    const nextIndex = (currentIndex + 1) % items.length;
    items[nextIndex].focus();
  } else if (key === 'ArrowUp') {
    event.preventDefault();
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    items[prevIndex].focus();
  }
}

function handleFakeLinks(issues) {
  if (!issues || !Array.isArray(issues)) return;
  return issues.map(issue => {
    if (issue.type === 'fake-link') {
      return { ...issue, status: 'fixed' };
    }
    return issue;
  });
}

// Accessibility utilities
const hello = () => {
  return 'Hello from main.js';
};

// Utilities for addressing accessibility issues
const AddressabilityIssues = {
  getSvgAccessibleName(svg) {
    const title = svg.querySelector('title');
    return title ? title.textContent : '';
  },

  setSvgAttributes(svg) {
    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  },

  generateAccessibilityReport(accessibilityReport) {
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

  calculateAccessibilityScore(fixedIssues) {
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

  fixMainTag(source) {
    const mainBlockRegex = /<main[^>]*>[\s\S]*?<\/main>/gi;

    const matches = source.match(mainBlockRegex);
    if (matches && matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < (matches ? matches.length : 0); i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main>/g, '<section>')
        .replace(/<main /g, '<section ')
        .replace(/<\/main>/g, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  validateLandmark(element) {
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

    const tagName = element.tagName ? element.tagName.toLowerCase() : element.tagName;

    const implicitLandmarks = {
      'header': 'banner',
      'main': 'main',
      'nav': 'navigation',
      'aside': 'complementary',
      'footer': 'contentinfo',
      'section': 'region',
      'form': 'form'
    };

    let landmarkRole = element.getAttribute ? element.getAttribute('role') : element.role;

    if (!landmarkRole && implicitLandmarks[tagName]) {
      landmarkRole = implicitLandmarks[tagName];
    }

    if (!landmarkRole) {
      return {
        valid: false,
        error: 'Element does not have a valid landmark role',
        element: tagName
      };
    }

    if (!landmarkRoles.includes(landmarkRole)) {
      return {
        valid: false,
        error: 'Invalid landmark role: ' + landmarkRole,
        element: tagName,
        role: landmarkRole
      };
    }

    return { valid: true, element: tagName, role: landmarkRole };
  },

  spawnSomeCommand(callback) {
    if (typeof require !== 'undefined') {
      const child_process = require('child_process');
      child_process.spawn('someCommand', [], { stdio: 'inherit' })
        .on('exit', (code, signal) => {
          if (code === 0) {
            callback(null, 'Successfully executed someCommand');
          } else {
            callback(new Error('someCommand failed with code ' + code));
          }