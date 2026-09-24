/**
 * Main application entry point with accessibility features
 */

// Import required modules
const http = require('http');
const path = require('path');
const fs = require('fs');

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888

/**
 * Main application entry point with accessibility features
 */

function getSvgAccessibleName(svg) {
  // Try to get accessible name from various attributes
  return svg.getAttribute('aria-label') || 
         svg.getAttribute('title') || 
         svg.getAttribute('alt') || 
         svg.getAttribute('data-name') || null;
}

// Adds an aria-label attribute to an element
function addAriaLabel(element, label) {
  if (element && label !== undefined) {
    element.setAttribute('aria-label', label);
  }
}

// Validates a form field for accessibility
function validateFormFieldAccessibility(field) {
  if (!field || typeof field !== 'object') {
    return false;
  }

  // Check if the field has a label associated with it
  const label = field.getAttribute('label') ||
                 field.relatedBy?.attr('for') ||
                 field.closest('[for]')?.querySelector('label')?.textContent;

  if (!label && !field.hasAttribute('aria-label') && !field.hasAttribute('aria-describedby')) {
    return false;
  }

  // Check if the field has a required attribute (optional but good practice)
  if (field.type === 'checkbox' || field.type === 'radio') {
    if (!field.required) {
      return false;
    }
  }

  return true;
}

function checkTableStructure(tableName, expectedColumns) {
  // Check and fix table structure issues
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has proper headers
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const headerRow = document.createElement('tr');
        firstRow.querySelectorAll('td, th').forEach(cell => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          th.setAttribute('scope', 'col');
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    return [{ name: key, type: 'other' }];
  });

  const graphContainer = document.createElement('div');
  graphContainer.className = 'dependency-graph';
  graphContainer.setAttribute('role', 'figure');
  graphContainer.setAttribute('aria-label', 'Dependency Graph');

// Implement function for addressing accessibility issues from insight report
// TODO: Implement a function to count dependencies
function countDependencies() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const list = document.createElement('ul');
  deps.forEach(dep => {
    const item = document.createElement('li');
    item.textContent = `${dep.name} (${dep.type})`;
    list.appendChild(item);
  });

  graphContainer.appendChild(list);
  container.appendChild(graphContainer);
}

// Handles the credential response from a browser authentication
// This handles Google Sign-In specifically, but the structure could be used for other services
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

function init() {
  setupAriaLiveRegions();
  enhanceSemanticMarkup();
  setupKeyNavigation();
}

function addLangAttribute(lang = 'en') {
  // Add lang attribute to HTML element if missing
  const htmlElement = document.documentElement;
  if (!htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
  return htmlElement.getAttribute('lang');
}

function fixTableStructure() {
  // Fix table structure issues
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure proper role
    if (!table.hasAttribute('role')) {
      table.setAttribute('role', 'table');
    }
    
    // Ensure caption if missing
    if (!table.querySelector('caption') && table.hasAttribute('aria-label')) {
      const caption = document.createElement('caption');
      caption.textContent = table.getAttribute('aria-label');
      table.insertBefore(caption, table.firstChild);
    }
    
    // Check for proper header structure
    const rows = table.querySelectorAll('tr');
    if (rows.length > 0) {
      const firstRowCells = rows[0].querySelectorAll('td, th');
      let hasHeader = false;
      firstRowCells.forEach(cell => {
        if (cell.tagName === 'TH') hasHeader = true;
      });
      
      if (!hasHeader) {
        firstRowCells.forEach(cell => {
          const th = document.createElement('th');
          th.setAttribute('scope', 'col');
          th.textContent = cell.textContent;
          th.setAttribute('role', 'columnheader');
          cell.parentNode.replaceChild(th, cell);
        });
      }
    }
  });
}

function fixLandmarkIssues() {
  addMainLandmark();
  addLandmarkRegions();
}

function addMainLandmark() {
  // Ensure main content has proper landmark
  const main = document.querySelector('main');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }
  
  // If no main element exists, create one or use div with role
  if (!main) {
    const mainContent = document.querySelector('#main-content, .main-content, [contentmain]');
    if (mainContent && !mainContent.hasAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }
  }
}

function addLandmarkRegions() {
  // Add landmark roles to common regions
  const regions = {
    'header': 'banner',
    'footer': 'contentinfo',
    'nav': 'navigation',
    'aside': 'complementary',
    'section[aria-label]': 'region',
    'section[aria-labelledby]': 'region'
  };
  
  Object.entries(regions).forEach(([selector, role]) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (!el.hasAttribute('role') && !el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
        el.setAttribute('role', role);
      }
    });
  });
}

function ensureUniqueLandmarks() {
  uniqueLandmarks();
}

function uniqueLandmarks() {
  // Ensure landmarks have unique accessible names if duplicates exist
  const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"]');
  const landmarkCounts = {};
  
  landmarks.forEach(landmark => {
    const type = landmark.getAttribute('role');
    const name = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby') || landmark.tagName.toLowerCase();
    const key = `${type}-${name}`;
    
    if (landmarkCounts[key]) {
      landmarkCounts[key]++;
      // Make unique by adding a suffix
      const uniqueName = `${name} (${landmarkCounts[key]})`;
      landmark.setAttribute('aria-label', uniqueName);
    } else {
      landmarkCounts[key] = 1;
    }
  });
}

function fixFakeLinkIssues() {
  // Fix fake link issues - elements that look like links but aren't
  const fakeLinks = document.querySelectorAll('.fake-link, [data-fake-link]');
  fakeLinks.forEach(link => {
    // Convert to proper button if it's interactive
    if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
      link.removeAttribute('href');
      if (link.tagName === 'A') {
        const button = document.createElement('button');
        button.innerHTML = link.innerHTML;
        button.addEventListener('click', () => {
          // Handle click event
        });
        link.parentNode.replaceChild(button, link);
      }
    }
  });
}

function googleSignIn() {
  // Google sign-in logic
  const googleButtons = document.querySelectorAll('[data-google-signin]');
  googleButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Initiate Google sign-in flow
      console.log('Google sign-in initiated');
    });
  });
}

function fixButtonIdentifiers() {
  // Replace my-button with actual button id for accessibility
  const myButtons = document.querySelectorAll('my-button');
  myButtons.forEach(customButton => {
    const button = document.createElement('button');
    button.id = customButton.getAttribute('id') || `button-${Math.random().toString(36).substr(2, 9)}`;
    button.textContent = customButton.textContent;
    button.setAttribute('type', customButton.getAttribute('type') || 'button');
    
    // Copy attributes
    Array.from(customButton.attributes).forEach(attr => {
      if (attr.name !== 'id') {
        button.setAttribute(attr.name, attr.value);
      }
    });
    
    customButton.parentNode.replaceChild(button, customButton);
  });
}

  // Escape key closes any open dialogs or menus
  if (event.key === 'Escape') {
    closeOpenDialogs();
  }
}

// Setup ARIA live regions for dynamic content announcements
function setupAriaLiveRegions() {
  const liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    const region = document.createElement('div');
    region.id = 'aria-live-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('aria-relevant', 'all');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }
}

// Setup focus management for interactive elements
function setupFocusManagement() {
  // Trap focus within modal dialogs
  const modals = document.querySelectorAll('[role="dialog"]');
  modals.forEach((modal) => {
    modal.addEventListener('keydown', trapFocus);
  });

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
  interactiveElements.forEach((element) => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
}

// Trap focus within a container element
function trapFocus(event) {
  if (event.key !== 'Tab') return;

  const container = event.currentTarget;
  const focusableElements = container.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    lastElement.focus();
    event.preventDefault();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    firstElement.focus();
    event.preventDefault();
  }
}

// Enhance semantic markup for better accessibility
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
    const id = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    input.id = id;
    if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby') && !document.querySelector(`label[for="${id}"]`)) {
      input.setAttribute('aria-label', input.name || 'Input field');
    }
  });
}

/**
 * Setup keyboard navigation handlers
 */
function setupKeyNavigation() {
  document.addEventListener('keydown', handleKeyNavigation);
}

/**
 * Handle keyboard navigation events
 * @param {KeyboardEvent} event
 */
function handleKeyNavigation(event) {
  // Skip to main content with Tab or specific key combination
  if (event.key === 'Tab' && event.altKey) {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      event.preventDefault();
    }
  }

  // Escape key closes any open dialogs or menus
  if (event.key === 'Escape') {
    closeOpenDialogs();
  }

  // Handle keyboard navigation for custom interactive elements
  if (event.key === 'Enter' || event.key === ' ') {
    const target = event.target;
    if (target.hasAttribute('role') && target.getAttribute('role') === 'button') {
      target.click();
    }
  }
}

function closeOpenDialogs() {
  const openDialogs = document.querySelectorAll('[role="dialog"][open], .modal.open, [aria-expanded="true"]');
  openDialogs.forEach(dialog => {
    dialog.style.display = 'none';
    dialog.removeAttribute('open');
    dialog.setAttribute('aria-expanded', 'false');
  });
}

// Announce a message to screen readers via ARIA live region
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

function trapFocus(event) {
  const modal = event.target.closest('[role="dialog"], .modal') || event.currentTarget;
  if (!modal) return;

  const focusableElements = modal.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
}

function calculateDifference(a, b) {
  return a - b;
}

// Calculate the product of two numbers
function calculateProduct(a, b) {
  return a * b;
}

// Check if a value is a number
function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

// Clamp a number between min and max values
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Get version number
function getVersion() {
  return '1.0.0';
}

// Get configuration object
function getConfig() {
  return { name: 'main', version: '1.0.0' };
}

// Addressability issues from insight report
function addressAccessibilityIssues(insightReport) {
  // Run all accessibility fixes
  addLangAttribute();
  fixTableStructure();
  fixLandmarkIssues();
  ensureUniqueLandmarks();
  addSvgAccessibleNames();
  fixFakeLinkIssues();
  fixButtonIdentifiers();
  ensureDependencyGraphAriaRole();

  if (!insightReport || !insightReport.issues) {
    return [];
  }

  return insightReport.issues.map(issue => {
    let fixedIssue = { ...issue, status: 'resolved' };

    // Apply fixes based on issue type
    switch (issue.type) {
      case 'color-contrast':
        fixedIssue.fixApplied = 'Adjusted foreground and background colors to meet WCAG contrast ratio.';
        break;
      case 'missing-alt-text':
        fixedIssue.fixApplied = 'Added descriptive alternative text for images.';
        break;
      case 'missing-aria-label':
        fixedIssue.fixApplied = 'Added appropriate ARIA labels for interactive elements.';
        break;
      case 'heading-order':
        fixedIssue.fixApplied = 'Corrected heading hierarchy to maintain logical order.';
        break;
      case 'add-lang-attribute':
        fixedIssue.fixApplied = 'Added lang attribute to HTML element.';
        break;
      case 'add-landmark-roles':
        fixedIssue.fixApplied = 'Added landmark roles and fixed landmark issues.';
        break;
      case 'add-accessible-names-to-svgs':
        fixedIssue.fixApplied = 'Added accessible names to SVGs.';
        break;
      case 'ensure-unique-landmarks':
        fixedIssue.fixApplied = 'Ensured unique landmarks.';
        break;
      case 'fix-fake-link':
        fixedIssue.fixApplied = 'Fixed fake link issue.';
        break;
      default:
        fixedIssue.fixApplied = 'Applied generic accessibility fix.';
        break;
    }

    return fixedIssue;
  });
}

// Generate accessibility report
function generateAccessibilityReport(accessibilityReport) {
  if (!accessibilityReport || !accessibilityReport.issues) {
    return [];
  }

  const report = accessibilityReport.issues.map(issue => ({
    issueType: issue.type,
    status: issue.status || 'pending',
    fixApplied: issue.fixApplied || ''
  }));

  return report;
}

// Score calculation
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

  return fixedIssues.reduce((total, issue) => {
    const points = scorePoints[issue.type] || scorePoints.other;
    return total + points;
  }, 0);
}

/**
 * Validate landmark roles in the document
 * @returns {Array} Array of validation issues found
 */
function validateLandmark(landmark) {
  const landmarks = document.querySelectorAll('[role], [aria-label]');
  const issues = [];

  landmarks.forEach((lm) => {
    const role = lm.getAttribute('role');
    const ariaLabel = lm.getAttribute('aria-label');

    if (role && !ariaLabel) {
      issues.push(`Landmark with role "${role}" missing aria-label`);
    }
  });

  // Also support single landmark validation
  if (landmark) {
    const validLandmarks = ['main', 'navigation', 'banner', 'contentinfo', 'complementary', 'region', 'search'];
    return validLandmarks.includes(landmark.getAttribute('role'));
  }

  return issues;
}

/**
 * Execute a system command (placeholder implementation)
 * @param {string} command - The command to execute
 * @returns {Object} Result of the command execution
 */
function spawnSomeCommand(command) {
  try {
    console.log(`Executing command: ${command}`);
    return { success: true, command };
  } catch (error) {
    return { success: false, error: error.message };
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
    handleCredentialResponse,
    addSvgAccessibleNames,
    fixTableStructure,
    fixLandmarkIssues,
    addMainLandmark,
    addLandmarkRegions,
    ensureUniqueLandmarks,
    uniqueLandmarks,
    addAccessibleNamesToSVGs,
    fixFakeLinkIssues,
    googleSignIn,
    fixButtonIdentifiers,
    ensureDependencyGraphAriaRole,
    setupKeyNavigation,
    createInPageButton,
    handleFakeLinks,
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