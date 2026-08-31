// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs

/**
 * Main application entry point with accessibility features
 */

function addSvgAccessibilityProps() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach(svg => {
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
  // Check for aria-label first
  let accessibleName = svg.getAttribute('aria-label');
  if (accessibleName) return accessibleName;

  // Check for aria-labelledby
  const labelledBy = svg.getAttribute('aria-labelledby');
  if (labelledBy) {
    const linkedElement = document.getElementById(labelledBy);
    if (linkedElement) {
      accessibleName = linkedElement.textContent;
      if (accessibleName) return accessibleName;
    }
  }

  // Check for title element inside SVG
  const title = svg.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }

  // Check for desc element inside SVG
  const desc = svg.querySelector('desc');
  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }

  return null;
}

function setSvgAttributes(svg) {
  // Add default role if not present
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }

  // Add tabindex for keyboard navigation
  if (!svg.hasAttribute('tabindex')) {
    svg.setAttribute('tabindex', '0');
  }

  // Add keyboard event handler
  svg.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      svg.click();
    }
  });
}

const checkTableStructure = function(element) {
  if (!element) {
    return { valid: false, error: 'Element is required' };
  }

  const tables = element.querySelectorAll('table');
  const results = [];

  tables.forEach((table, index) => {
    const hasHeader = table.querySelector('thead') || table.querySelector('th');
    const hasCaption = table.querySelector('caption');
    const rows = table.querySelectorAll('tr');
    const hasBody = table.querySelector('tbody') || table.querySelector('tfoot');

    results.push({
      index,
      valid: hasHeader && hasCaption,
      hasHeader,
      hasCaption,
      rowCount: rows.length,
      hasBody
    });
  });

  return {
    valid: results.every(r => r.valid),
    tables: results
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

// Ensure DOM is fully loaded before executing scripts
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment - setup basic exports
  module.exports = {
    checkTableStructure,
    countDependencies,
    init,
    setupKeyboardNavigation,
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
    ensureUniqueLandmarksFromString,
    validateLandmark,
    spawnSomeCommand,
    addLangAttribute,
    handleCredentialResponse,
    addSvgAccessibilityProps,
    getSvgAccessibleName,
    setSvgAttributes,
    getLangAttribute,
    createInPageButton,
    validateLinkAccessibility,
    handleFakeLinks,
    MyComponent,
    AddressabilityIssues
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
  setupKeyboardNavigation();
  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();
}

function setupKeyboardNavigation() {
  // Set up keyboard navigation for all interactive elements
  document.addEventListener('keydown', handleKeyNavigation);
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
    const id = input.id || `input-${Math.random().toString(36).slice(2, 9)}`;
    input.id = id;
    if (!input.hasAttribute('aria-label') && !document.querySelector(`label[for="${id}"]`)) {
      input.setAttribute('aria-label', input.name || 'Input field');
    }
  });
}

function trapFocus(e) {
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const modal = e.currentTarget;
  const focusableContent = modal.querySelectorAll(focusableElements);
  const firstFocusableElement = focusableContent[0];
  const lastFocusableElement = focusableContent[focusableContent.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstFocusableElement) {
      lastFocusableElement.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastFocusableElement) {
      firstFocusableElement.focus();
      e.preventDefault();
    }
  }
}

function handleKeyNavigation(e) {
  const key = e.key;
  const target = e.target;

  // Handle arrow key navigation for menu items
  if (target.hasAttribute('role') && target.getAttribute('role') === 'menuitem') {
    const menu = target.parentElement;
    const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
    const currentIndex = items.indexOf(target);

    if (key === 'ArrowDown') {
      const nextIndex = (currentIndex + 1) % items.length;
      items[nextIndex].focus();
      e.preventDefault();
    } else if (key === 'ArrowUp') {
      const prevIndex = (currentIndex - 1 + items.length) % items.length;
      items[prevIndex].focus();
      e.preventDefault();
    }
  }

  // Handle escape key to close dialogs
  if (key === 'Escape') {
    closeOpenDialogs();
  }
}

function closeOpenDialogs() {
  const openDialogs = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
  openDialogs.forEach((dialog) => {
    dialog.setAttribute('aria-hidden', 'true');
    dialog.style.display = 'none';
  });

  // Announce closure to screen readers
  announceToScreenReader('Dialog closed');
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
  if (typeof value !== 'number') {
    return min;
  }
  return Math.min(Math.max(value, min), max);
}

function createInPageButton(buttonId, buttonText) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  button.type = 'button';
  return button;
}

function validateLinkAccessibility(options) {
  const { link, context } = options || {};
  const issues = [];

  if (!link) {
    issues.push({ type: 'missing-link', message: 'Link element is required' });
    return issues;
  }

  // Check for meaningful link text
  const linkText = link.textContent || link.getAttribute('aria-label');
  if (!linkText || linkText.trim() === '') {
    issues.push({ type: 'empty-link-text', message: 'Link has no accessible text' });
  }

  // Check for proper href
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    issues.push({ type: 'invalid-href', message: 'Link has invalid or missing href' });
  }

  // Check for images in links
  const images = link.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push({ type: 'image-missing-alt', message: 'Image inside link missing alt text' });
    }
  });

  return issues;
}

function handleFakeLinks(issues) {
  const fakeLinks = document.querySelectorAll('[role="link"], [data-link="true"]');
  const results = [];

  fakeLinks.forEach((link) => {
    const linkIssues = validateLinkAccessibility({ link });
    const allIssues = [...issues || [], ...linkIssues];
    
    results.push({
      element: link,
      valid: allIssues.length === 0,
      issues: allIssues
    });

    // Apply fixes
    allIssues.forEach((issue) => {
      if (issue.type === 'empty-link-text') {
        link.setAttribute('aria-label', 'Link');
      }
    });
  });

  return results;
}

// Accessibility utilities
const hello = () => {
  return 'Hello from main.js';
};

const getVersion = () => {
  return '1.0.0';
};

const getConfig = () => {
  return {
    accessibility: {
      enabled: true,
      level: 'AA'
    },
    features: {
      keyboardNavigation: true,
      screenReaderSupport: true
    }
  };
};

// Utilities for addressing accessibility issues
function addressAccessibilityIssues(insightReport) {
  if (!insightReport || !insightReport.sections) {
    return [];
  }

  const issues = [];
  
  insightReport.sections.forEach((section, index) => {
    if (!section.heading) {
      issues.push({
        type: 'missing-heading',
        section: index,
        message: 'Section missing heading'
      });
    }
    
    if (!section.content) {
      issues.push({
        type: 'missing-content',
        section: index,
        message: 'Section missing content'
      });
    }
  });

  return issues;
}

function generateAccessibilityReport(accessibilityReport) {
  if (!accessibilityReport || !Array.isArray(accessibilityReport.issues)) {
    return [];
  }

  const report = accessibilityReport.issues.map(issue => ({
    issueType: issue.type,
    status: issue.status || 'pending',
    fixApplied: issue.fixApplied || ''
  }));

  return report;
}

function calculateAccessibilityScore(fixedIssues) {
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
}

function ensureUniqueLandmarksFromString(source) {
  const mainBlockRegex = /<main[^>]*>.*?<\/main>/gs;

  const matches = Array.from(source.matchAll(mainBlockRegex));
  if (matches.length <= 1) {
    return source;
  }

  let result = source;
  for (let i = 1; i < matches.length; i++) {
    const block = matches[i][0];
    const fixedBlock = block
      .replace(/<main([^>]*)>/, '<section$1>')
      .replace(/<\/main>/, '</section>');
    result = result.replace(block, fixedBlock);
  }

  return result;
}

function validateLandmark(element) {
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
      error: `Invalid landmark role: ${landmarkRole}`,
      element: tagName,
      role: landmarkRole
    };
  }

  return { valid: true, element: tagName, role: landmarkRole };
}

function spawnSomeCommand(callback) {
  const child_process = require('child_process');
  child_process.spawn('someCommand', {}, {
    stdio: 'inherit',
  }).on('exit', (code, signal) => {
    if (code === 0) {
      callback(null, 'Successfully executed someCommand');
    } else {
      callback(new Error(`someCommand failed with code ${code}`));
    }
  });
}

function addLangAttribute(element, lang) {
  element.setAttribute('lang', lang);
}

function getLangAttribute(element) {
  if (element) {
    return element.getAttribute('lang') || document.documentElement.getAttribute('lang') || 'en';
  }
  return document.documentElement.getAttribute('lang') || 'en';
}

const AddressabilityIssues = {
  addressAccessibilityIssues(insightReport) {
    return addressAccessibilityIssues(insightReport);
  },

  generateAccessibilityReport(accessibilityReport) {
    return generateAccessibilityReport(accessibilityReport);
  },

  calculateAccessibilityScore(fixedIssues) {
    return calculateAccessibilityScore(fixedIssues);
  },

  ensureUniqueLandmarksFromString(source) {
    return ensureUniqueLandmarksFromString(source);
  },

  validateLandmark(element) {
    return validateLandmark(element);
  },

  spawnSomeCommand(callback) {
    return spawnSomeCommand(callback);
  },

  addLangAttribute(element, lang) {
    addLangAttribute(element, lang);
  },

  countDependencies() {
    return countDependencies();
  }
};

function MyComponent(props) {
  // Existing code that needs to be updated
  const langAttr = getLangAttribute(props ? props.element : null);
  return {
    type: 'div',
    props: {
      lang: langAttr,
      children: props ? props.children : null
    }
  };
}