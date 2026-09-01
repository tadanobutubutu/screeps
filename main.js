// TODO: This is the existing code that needs to be preserved

// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs

/**
 * Main application entry point with accessibility features
 */

function init() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach((svg) => {
    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }

    setSvgAttributes(svg);
  });
  
  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();
}

const checkTableStructure = function(table) {
  if (!table) {
    return { valid: false, error: 'Table element is required' };
  }
  
  const hasHeader = table.querySelector('thead') !== null;
  const hasBody = table.querySelector('tbody') !== null;
  const rows = table.querySelectorAll('tr');
  
  return {
    valid: hasHeader && hasBody && rows.length > 0,
    hasHeader,
    hasBody,
    rowCount: rows.length
  };
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

// Helper function to get SVG accessible name
function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }
  const desc = svg.querySelector('desc');
  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || '';
}

// Helper function to set SVG attributes
function setSvgAttributes(svg) {
  if (!svg.hasAttribute('aria-hidden')) {
    svg.setAttribute('aria-hidden', 'true');
  }
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
    skipLink.style.position = 'absolute';
    skipLink.style.left = '-9999px';
    document.body.insertBefore(skipLink, document.body.firstChild);
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
    const id = input.id || 'input-' + Math.random().toString(36).substr(2, 9);
    input.id = id;
    const label = input.getAttribute('aria-label');
    const labelledBy = input.getAttribute('aria-labelledby');
    if (!label && !labelledBy) {
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

function getLangAttribute(element) {
  return element ? element.getAttribute('lang') : 'en';
}

function handleFakeLinks(issues) {
  if (!Array.isArray(issues)) {
    return issues;
  }
  return issues.map((issue) => {
    if (issue.type === 'fake') {
      return {
        ...issue,
        severity: 'warning',
        message: issue.message || 'Fake link detected',
        fix: {
          action: 'add-href',
          params: { href: '#' }
        }
      };
    }
    return issue;
  });
}

/**
 * Address accessibility issues from the insight report.
 * Iterates over a collection of issues and applies appropriate fixes
 * to the DOM based on the issue type.
 *
 * @param {Array} issues - The list of accessibility issues to address.
 * @returns {Object} A summary of addressed issues.
 */
function addressAccessibilityIssues(issues) {
  const report = {
    total: 0,
    addressed: 0,
    skipped: 0,
    failed: 0,
    details: []
  };

  if (!Array.isArray(issues)) {
    return report;
  }

  issues.forEach((issue) => {
    report.total += 1;

    try {
      let addressed = false;

      if (issue && issue.type === 'missing-lang' && issue.element) {
        addressed = addLangAttribute(issue.element, issue.lang || 'en');
      } else if (issue && issue.type === 'fake-link' && issue.element) {
        if (!issue.element.hasAttribute('href')) {
          issue.element.setAttribute('href', (issue.fix && issue.fix.href) || '#');
          addressed = true;
        }
      }

      if (addressed) {
        report.addressed += 1;
        report.details.push({ issue, status: 'addressed' });
      } else {
        report.skipped += 1;
        report.details.push({ issue, status: 'skipped' });
      }
    } catch (error) {
      report.failed += 1;
      report.details.push({ issue, status: 'failed', error: error.message });
    }
  });

  return report;
}

/**
 * Generate an accessibility report by scanning the document for
 * common accessibility issues.
 *
 * @returns {Object} The generated accessibility report.
 */
function generateAccessibilityReport() {
  const issues = [];

  // Check for missing lang attribute on the html element
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    issues.push({
      type: 'missing-lang',
      element: htmlElement,
      message: 'html element is missing a lang attribute'
    });
  }

  // Check for images without alt attributes
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        type: 'missing-alt',
        element: img,
        message: 'Image is missing an alt attribute'
      });
    }
  });

  // Check for form inputs without labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const type = (input.getAttribute('type') || '').toLowerCase();
    if (type === 'hidden') {
      return;
    }
    const id = input.id;
    const hasLabel = id && document.querySelector(`label[for="${id}"]`);
    const hasAriaLabel = input.hasAttribute('aria-label');
    const hasAriaLabelledBy = input.hasAttribute('aria-labelledby');
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        type: 'missing-label',
        element: input,
        message: 'Form control is missing an associated label'
      });
    }
  });

  // Check for fake links (anchor without href)
  const fakeLinks = handleFakeLinks(
    Array.from(document.querySelectorAll('a')).map((anchor) => {
      if (!anchor.hasAttribute('href')) {
        return { type: 'fake', element: anchor, message: 'Anchor without href detected' };
      }
      return null;
    }).filter(Boolean)
  );
  fakeLinks.forEach((issue) => {
    issues.push({
      type: 'fake-link',
      element: issue.element,
      message: issue.message,
      fix: issue.fix
    });
  });

  return {
    timestamp: new Date().toISOString(),
    issues,
    score: calculateAccessibilityScore(issues)
  };
}

/**
 * Calculate a basic accessibility score based on the number of issues.
 *
 * @param {Array} issues - The list of accessibility issues.
 * @returns {number} A score between 0 and 100.
 */
function calculateAccessibilityScore(issues) {
  if (!Array.isArray(issues) || issues.length === 0) {
    return 100;
  }
  const penalty = issues.length * 5;
  return Math.max(0, 100 - penalty);
}

/**
 * Validate that a landmark element is properly used.
 *
 * @param {Element} element - The element to validate.
 * @returns {boolean} True if the landmark is valid, false otherwise.
 */
function validateLandmark(element) {
  if (!element || !element.tagName) {
    return false;
  }
  const validLandmarks = ['main', 'nav', 'header', 'footer', 'aside', 'section'];
  const tagName = element.tagName.toLowerCase();
  return validLandmarks.indexOf(tagName) !== -1;
}

/**
 * Add a lang attribute to an element if it doesn't already have one.
 *
 * @param {Element} element - The element to update.
 * @param {string} lang - The language code to set.
 * @returns {boolean} True if the attribute was added, false otherwise.
 */
function addLangAttribute(element, lang) {
  if (!element || !element.setAttribute) {
    return false;
  }
  if (element.hasAttribute('lang')) {
    return false;
  }
  const language = lang || 'en';
  element.setAttribute('lang', language);
  return true;
}