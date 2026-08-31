// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs

/**
 * Main application entry point with accessibility features
 */

function init() {
  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();
  addressAccessibilityIssues();
}

const checkTableStructure = function(table) {
  if (!table) return false;
  const rows = table.querySelectorAll('tr');
  if (rows.length < 2) return false;
  
  const firstRowCells = rows[0].querySelectorAll('th, td');
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll('th, td');
    if (cells.length !== firstRowCells.length) return false;
  }
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
function addressAccessibilityIssues() {
  const issues = [];
  const mainElements = document.querySelectorAll('main');
  
  mainElements.forEach((main, index) => {
    if (!main.id) {
      main.id = `main-content-${index}`;
      issues.push({
        type: 'missing-id',
        element: 'main',
        fixApplied: `Added id="${main.id}" to main element`
      });
    }
  });

  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    const hasLabel = button.getAttribute('aria-label') || 
                     button.getAttribute('aria-labelledby') ||
                     button.textContent.trim();
    if (!hasLabel) {
      button.setAttribute('aria-label', `Button ${index + 1}`);
      issues.push({
        type: 'missing-aria-label',
        element: 'button',
        fixApplied: `Added aria-label="Button ${index + 1}" to button`
      });
    }
  });

  const images = document.querySelectorAll('img:not([alt])');
  images.forEach((img) => {
    img.setAttribute('alt', '');
    img.setAttribute('role', 'presentation');
    issues.push({
      type: 'missing-alt-text',
      element: 'img',
      fixApplied: 'Added empty alt and role="presentation" to image'
    });
  });

  return issues;
}

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
    fixAccessibilityIssues,
    validateLandmark,
    spawnSomeCommand,
    addLangAttribute,
    handleCredentialResponse,
    AddressabilityIssues,
    createInPageButton,
    handleFakeLinks,
    sampleInsightReport
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
    trapFocus(modal);
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
  const skipLink = document.getElementById('skip-link');
  if (!skipLink) {
    const skipLinkEl = document.createElement('a');
    skipLinkEl.id = 'skip-link';
    skipLinkEl.href = '#main-content';
    skipLinkEl.textContent = 'Skip to main content';
    skipLinkEl.className = 'skip-link';
    skipLinkEl.style.position = 'absolute';
    skipLinkEl.style.left = '-9999px';
    skipLinkEl.style.top = '0';
    document.body.insertBefore(skipLinkEl, document.body.firstChild);
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
    const hasLabel = input.getAttribute('aria-label') || document.querySelector(`label[for="${id}"]`);
    if (!hasLabel) {
      input.setAttribute('aria-label', input.name || 'Input field');
    }
  });
}

function closeOpenDialogs() {
  const openDialogs = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
  openDialogs.forEach((dialog) => {
    dialog.setAttribute('aria-hidden', 'true');
    dialog.style.display = 'none';
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
  if (typeof a !== 'number' || typeof b !== 'number') {
    return null;
  }
  return a - b;
}

function calculateProduct(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return null;
  }
  return a * b;
}

function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

function clamp(value, min, max) {
  if (typeof value !== 'number') return min;
  return Math.min(Math.max(value, min), max);
}

function createInPageButton(buttonId, buttonText) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  button.setAttribute('aria-label', buttonText);
  return button;
}

function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  return null;
}

function setSvgAttributes(svg) {
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  if (!svg.hasAttribute('aria-hidden')) {
    svg.setAttribute('aria-hidden', 'true');
  }
}

function handle