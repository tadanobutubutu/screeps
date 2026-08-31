// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs

/**
 * Ensures an element has a unique ID
 * @param {HTMLElement} element - The element to check
 * @returns {string} The element's ID
 */
function ensureId(element) {
    if (!element.id) {
        element.id = `element-${Math.random().toString(36).substr(2, 9)}`;
    }
    return element.id;
}

/**
 * Adds aria-label to an element if not present
 * @param {HTMLElement} element - The element to update
 * @param {string} label - The label text
 */
function addAriaLabel(element, label) {
    if (!element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * New function example, this is a placeholder for the actual implementation
 * @param {string} input - The input parameter for the new function
 * @returns {string} The output result of the new function
 */
function newFunction(input) {
  // Placeholder logic, replace with actual implementation
  return `Processed: ${input}`;
}

/**
 * Adds a new function to the module
 * This is a placeholder for the new function added based on the issue
 * @param {Object} data - The data object to process
 * @returns {String} The processed data
 */
function processData(data) {
  // Placeholder for data processing logic
  return 'Processed data';
}

/**
 * Main application entry point with accessibility features
 */
function main() {
    const svgElements = document.querySelectorAll('svg');

    svgElements.forEach(svg => {
        if (!svg.hasAttribute('role')) {
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
    if (!table) return false;
    const rows = table.querySelectorAll('tr');
    let hasHeader = false;
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        if (row.parentElement.tagName === 'THEAD' || row.querySelector('th')) {
            hasHeader = true;
        }
    });
    
    return hasHeader;
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
    const packageJsonPath = path.join(__dirname, 'package.json');
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
    main,
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
    fixMainLandmarks,
    validateLandmark,
    spawnSomeCommand,
    addLangAttribute,
    handleCredentialResponse,
    ensureId,
    addAriaLabel,
    getSvgAccessibleName,
    setSvgAttributes,
    processData,
    newFunction
  };
} else {
  // Browser environment - wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

function init() {
  main();
  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();
}

function getSvgAccessibleName(svg) {
    const title = svg.querySelector('title');
    if (title && title.textContent.trim()) {
        return title.textContent.trim();
    }
    
    const desc = svg.querySelector('desc');
    if (desc && desc.textContent.trim()) {
        return desc.textContent.trim();
    }
    
    return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || '';
}

function setSvgAttributes(svg) {
    if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
    }
    ensureId(svg);
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
  const modals = document.querySelectorAll('[role="dialog"], [role="modal"]');
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
    skipLink.style.top = '0';
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
    const id = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    input.id = id;
    if (!input.hasAttribute('aria-label') && !document.querySelector(`label[for="${id}"]`)) {
      input.setAttribute('aria-label', input.name || 'Input field');
    }
  });
}

function closeOpenDialogs() {
  const openDialogs = document.querySelectorAll('[role="dialog"][aria-hidden="false"], .modal.show');
  openDialogs.forEach(dialog => {
    dialog.setAttribute('aria-hidden', 'true');
    dialog.classList.remove('show');
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

function trapFocus(event) {
    const focusableElementsString = 
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    
    let focusableElements = event.currentTarget.querySelectorAll(focusableElementsString);
    focusableElements = Array.prototype.slice.call(focusableElements);
    
    const firstTabStop = focusableElements[0];
    const lastTabStop = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
        if (document.activeElement === firstTabStop) {
            event.preventDefault();
            lastTabStop.focus();
        }
    } else {
        if (document.activeElement === lastTabStop) {
            event.preventDefault();
            firstTabStop.focus();
        }
    }
}

function handleKeyNavigation(event, currentIndex, items) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        return nextIndex;
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        return prevIndex;
    }
    return currentIndex;
}