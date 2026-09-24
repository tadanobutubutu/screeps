// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs

/**
 * Main application entry point with accessibility features
 */

function initAccessibility() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach((svg) => {
    if (!svg.id) {
      svg.setAttribute('id', `svg-${Math.random().toString(36).substr(2, 9)}`);
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }

    setSvgAttributes(svg);
  });
}

const checkTableStructure = function() {
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
function addressAccessibilityIssues(insightReport) {
  if (!insightReport || !insightReport.sections) {
    return { issues: [], summary: 'No issues found' };
  }

  const issues = [];
  const sectionCount = insightReport.sections.length;

  // Check for proper heading hierarchy
  let previousLevel = 0;
  insightReport.sections.forEach((section, index) => {
    const headingMatch = section.heading ? section.heading.match(/^h([1-6])$/i) : null;
    if (headingMatch) {
      const currentLevel = parseInt(headingMatch[1], 10);
      if (currentLevel - previousLevel > 1) {
        issues.push({
          type: 'heading-order',
          element: section.heading,
          message: `Heading level skipped from h${previousLevel} to h${currentLevel}`,
          severity: 'warning',
          fix: `Consider restructuring headings to follow sequential order`
        });
      }
      previousLevel = currentLevel;
    }
  });

  // Check for images without alt text
  if (insightReport.content) {
    const imgMatches = insightReport.content.match(/<img[^>]*>/gi) || [];
    imgMatches.forEach((imgTag, index) => {
      if (!imgTag.includes('alt=')) {
        issues.push({
          type: 'missing-alt-text',
          element: imgTag,
          message: `Image at position ${index + 1} missing alt attribute`,
          severity: 'critical',
          fix: `Add alt attribute describing the image content`
        });
      }
    });
  }

  // Check for proper landmark structure
  if (sectionCount > 0) {
    issues.push({
      type: 'missing-landmark',
      element: 'main',
      message: 'Content should be wrapped in proper landmark elements',
      severity: 'moderate',
      fix: 'Wrap content in <main> or role="main" element'
    });
  }

  // Check for keyboard accessibility
  issues.push({
    type: 'keyboard-navigation',
    element: 'interactive',
    message: 'Ensure all interactive elements are keyboard accessible',
    severity: 'moderate',
    fix: 'Add tabindex="0" to interactive elements and ensure focus indicators are visible'
  });

  // Check for color contrast (if colors mentioned)
  if (insightReport.title && insightReport.title.toLowerCase().includes('color')) {
    issues.push({
      type: 'color-contrast',
      element: 'text',
      message: 'Ensure sufficient color contrast ratio (4.5:1 for normal text)',
      severity: 'warning',
      fix: 'Use color contrast checking tools to verify ratios'
    });
  }

  return {
    issues: issues,
    summary: `Found ${issues.length} accessibility issue(s)`,
    timestamp: new Date().toISOString()
  };
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
    initAccessibility,
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
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

function init() {
  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();
}

function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  return title ? title.textContent : '';
}

function setSvgAttributes(svg) {
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
    svg.setAttribute('aria-label', 'Decorative SVG graphic');
  }
}

function setupAriaLiveRegions() {
  const liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    const region = document.createElement('div');
    region.id = 'aria-live-region';
    region.setAttribute('role', 'status');
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
    skipLink.style.top = '-40px';
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
  const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
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

function trapFocus(event) {
  const focusableElements = 'button, [href], input, select,