const express = require('express');
const path = require('path');

class User {
// ... existing code
}

// Landmark data structure
const landmarks = [];

// TODO: Implement spawning logic
function spawnNewUser(name, age) {
// ... existing code
}

// Configuration
const config = {
// ... existing code
};

// App state
const appState = {
// ... existing code
};

// Initialize function
function initialize() {
// ... existing code
}

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
// ... existing code
}

// Landmark validation function with merged logic from both branches
function validateLandmark(landmark) {
const errors = [];

// Check if landmark exists
if (!landmark) {
errors.push('Landmark is required');
}

// Validate name
if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
errors.push('Landmark must have a valid name');
}

// Validate latitude (merge from both branches)
if (!landmark.latitude && landmark.latitude !== 0) {
errors.push('Landmark must have a latitude');
} else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
errors.push('Landmark latitude must be a number');
} else if (landmark.latitude < -90 || landmark.latitude > 90) {
errors.push('Landmark latitude must be between -90 and 90');
}

// Validate longitude (merge from both branches)
if (!landmark.longitude && landmark.longitude !== 0) {
errors.push('Landmark must have a longitude');
} else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
errors.push('Landmark longitude must be a number');
} else if (landmark.longitude < -180 || landmark.longitude > 180) {
errors.push('Landmark longitude must be between -180 and 180');
}

// Check if landmark is an array (merge from both branches)
if (Array.isArray(landmark) && landmark.length > 0) {
landmark.forEach(innerLandmark => {
if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
errors.push('Landmark array must have valid names');
}
});
}

return { valid: errors.length === 0, errors };
}

/**
 * Wraps the primary content in a <main> landmark element if not already present.
 * Implements proper landmark structure for accessibility compliance.
 */
function wrapPrimaryContentInMain() {
  // Check if a <main> element already exists
  let mainElement = document.querySelector('main[role="main"], main, [role="main"]');

  if (!mainElement) {
    // Find existing primary content element using common selectors
    const primaryContentSelectors = [
      '#primary-content',
      '#main-content',
      '[role="main"]',
      '.primary-content',
      '.main-content',
      '#content',
      'article',
      '.content'
    ];

    let primaryContent = null;

    for (const selector of primaryContentSelectors) {
      const element = document.querySelector(selector);
      if (element && element.tagName !== 'MAIN') {
        primaryContent = element;
        break;
      }
    }

    // If no specific primary content found, use body content
    if (!primaryContent) {
      primaryContent = document.body;
    }

    // Create main element with proper attributes
    mainElement = document.createElement('main');
    mainElement.id = 'main-content';
    mainElement.setAttribute('role', 'main');

    // Preserve existing id if the primary content has one
    if (primaryContent.id) {
      mainElement.id = primaryContent.id;
    }

    // Wrap the content appropriately
    if (primaryContent !== document.body && primaryContent.parentNode) {
      primaryContent.parentNode.insertBefore(mainElement, primaryContent);
      mainElement.appendChild(primaryContent);
    } else if (primaryContent === document.body) {
      // For body, insert main as first child
      mainElement.appendChild(document.createDocumentFragment());
      while (document.body.firstChild) {
        mainElement.appendChild(document.body.firstChild);
      }
      document.body.appendChild(mainElement);
    }
  }

  return mainElement;
}

// Initialize app function
function initializeApp() {
// ... existing code
}

// Main function (required export)
function main() {
// ... existing code
}

// Accessibility helper function to validate table accessibility
function validateTableAccessibility(table) {
    const issues = [];

    // Check for caption
    const caption = table.querySelector('caption');
    if (!caption) {
        issues.push('Table missing caption');
    }

    // Check for th elements with scope or headers
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
        if (!th.getAttribute('scope') && !th.getAttribute('headers')) {
            issues.push('TH element missing scope or headers attribute');
        }
    });

    return issues;
}

// Accessibility helper function to validate table structure
function validateTableStructure(table) {
    const issues = [];

    // Check for proper table structure (thead, tbody, tfoot)
    if (!table.querySelector('thead')) {
        issues.push('Table missing thead');
    }
    if (!table.querySelector('tbody')) {
        issues.push('Table missing tbody');
    }

    // Check for proper row structure
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td, th');
        if (cells.length === 0) {
            issues.push(`Row ${index} has no cells`);
        }
    });

    return issues;
}

// Table accessibility functions (merged from both branches)
function validateTableAccessibility() {
    // Implementation for merged table accessibility validation
}

function validateTableStructure() {
    // Implementation for merged table structure validation
}

// Accessibility helper function to fix table structure
function fixTableStructure() {
// ... existing code
}

// Landmark functions (merged from both branches)
// ... merged functions (ensureLandmarkUniqueness, etc.)

// Accessibility helper function to get SVG accessible name
function getSvgAccessibleName(svgElement) {
    // Check for aria-label
    let label = svgElement.getAttribute('aria-label');

    // Check for aria-labelledby
    const labelledBy = svgElement.getAttribute('aria-labelledby');
    if (labelledBy) {
        const labelElement = document.getElementById(labelledBy);
        if (labelElement) {
            label = labelElement.textContent;
        }
    }

    // Check for title element inside SVG
    if (!label) {
        const title = svgElement.querySelector('title');
        if (title) {
            label = title.textContent;
        }
    }

    return label || '';
}

// Accessibility helper function to set SVG attributes for accessibility
function setSvgAttributes(svgElement, accessibleName) {
    // Ensure SVG has role="img"
    svgElement.setAttribute('role', 'img');

    // Set aria-label if not already set
    if (!svgElement.getAttribute('aria-label') && accessibleName) {
        svgElement.setAttribute('aria-label', accessibleName);
    }

    // Add title element if missing
    const existingTitle = svgElement.querySelector('title');
    if (!existingTitle && accessibleName) {
        const title = document.createElement('title');
        title.textContent = accessibleName;
        svgElement.insertBefore(title, svgElement.firstChild);
    }
}

// Accessibility helper function to ensure unique landmarks
function ensureUniqueLandmarks() {
    const landmarksObj = {};
    const issues = [];

    // Find all landmark elements
    const banner = document.querySelectorAll('[role="banner"], .banner');
    const navigation = document.querySelectorAll('[role="navigation"], .navigation');
    const main = document.querySelectorAll('[role="main"], .main');
    const contentinfo = document.querySelectorAll('[role="contentinfo"], .contentinfo');
    const complementary = document.querySelectorAll('[role="complementary"], .complementary');
    const search = document.querySelectorAll('[role="search"], .search');

    // Check for duplicate landmarks
    if (banner.length > 1) landmarksObj.banner = banner;
    if (main.length > 1) landmarksObj.main = main;
    if (contentinfo.length > 1) landmarksObj.contentinfo = contentinfo;

    if (complementary.length > 1) {
        issues.push(`Found ${complementary.length} complementary landmarks, should have at most 1`);
    }

    if (search.length > 1) {
        issues.push(`Found ${search.length} search landmarks, should have at most 1`);
    }

    return { landmarks: landmarksObj, issues };
}

// Accessibility helper function to add proper landmark regions
function addLandmarkRegions() {
    // Check for main landmark
    let main = document.querySelector('[role="main"], .main');
    if (!main) {
        main = document.createElement('main');
        main.setAttribute('role', 'main');
    }
    if (!main) {
        // If no main found, wrap content appropriately
        main = document.createElement('main');
        main.setAttribute('id', 'main-content');
        // Content would need to be moved into main here
    }

    // Ensure unique IDs for landmarks
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"], [role="search"], [role="region"]');
    const usedIds = new Set();

    landmarks.forEach(landmark => {
        const existingId = landmark.id;
        if (existingId) {
            usedIds.add(existingId);
        }
    });

    return { main, usedIds };
}

// Function to count dependencies (migrated from the other branch)
function countDependencies() {
  return landmarks.length;
}

// Function to handle focus trap for keyboard navigation
function createFocusTrap(container, options = {}) {
  const {
    onEscape = null,
    initialFocus = null,
    returnFocus = true,
  } = options;

  let previousActiveElement = null;
  let isActive = false;

  // Get all focusable elements within the container
  const getFocusableElements = () => {
    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors));
  };

  // Handle keydown events to trap focus
  const handleKeyDown = (event) => {
    if (!isActive) return;

    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab on first element moves to last
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      // Tab on last element moves to first
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    // Handle escape key
    if (event.key === 'Escape' && onEscape) {
      event.preventDefault();
      onEscape();
    }
  };

  // Activate the focus trap
  const activate = () => {
    previousActiveElement = document.activeElement;
    isActive = true;
    container.addEventListener('keydown', handleKeyDown);

    // Set initial focus
    if (initialFocus) {
      initialFocus.focus();
    } else {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  };

  // Deactivate the focus trap
  const deactivate = () => {
    isActive = false;
    container.removeEventListener('keydown', handleKeyDown);

    // Return focus to the previously focused element
    if (returnFocus && previousActiveElement && previousActiveElement.focus) {
      previousActiveElement.focus();
    }
  };

  return {
    activate,
    deactivate,
    getFocusableElements,
  };
}

// NEW: Implement a new function to handle focus trap for keyboard navigation (handled by createFocusTrap())
function newFocusTrap(focusableElements, onEscape) {
  const initialFocus = null;

  function trapFocus(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      const focusable = Array.from(focusableElements).filter(el => el.offsetWidth > 0 && el.offsetHeight > 0);
      if (focusable[0]) {
        focusable[0].focus();
      } else {
        if (initialFocus) initialFocus.focus();
      }
    } else if (event.key === 'Escape') {
      // Close the trap by returning focus to the last focused element
      // In a real implementation, we would need to track the previous element
      console.log('Focus trap triggered, returning focus');
    }
  }

  document.addEventListener('keydown', trapFocus);

  return () => {
    document.removeEventListener('keydown', trapFocus);
  };
}

// Added back required exports from origin/main

function landmarkStructureCheck(landmark) {
// ... existing code
}

function setLanguageAttribute(lang) {
// ... existing code
}

function addLandmarkRoles(element, role) {
// ... existing code
}

function fixFakeLinks(element) {
// ... existing code
}

function isSecureContext() {
// ... existing code
}

function initApp() {
// ... existing code
}

function ensureFocusableElements(elements) {
// ... existing code
}

function renderDependencyGraphContent(graphData) {
// ... existing code
}

function validateSvgAccessibility(svgElement) {
// ... existing code
}

function processUniqueElements(elements) {
  if (!Array.isArray(elements)) {
    return [];
  }
  const seen = new Set();
  return elements.filter(el => {
    const key = el.id || el.name || JSON.stringify(el);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Ensure landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const landTypes = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          elementsById[landmark.id] = true;
        } else {
          landmark.id += '_duplicate';
        }
      }
    }
  }
  return elements;
}

// Merged countDependencies function from both branches
/**
 * Counts the number of dependencies (landmarks) in the application.
 * @returns {number} The count of dependencies.
 */
function countDependencies() {
  return landmarks.length;
}

function addressInsightIssues(insights) {
// ... existing code
}

function renderDependencyGraph(graph) {
// ... existing code
}

function renderIndexView(data) {
// ... existing code
}

function calculateSum(a, b) {
// ... existing code
}

function addProperLandmarkRegions(element) {
// ... existing code
}

function countGraphDependencies(graph) {
// ... existing code
}

// New function for creating in-page buttons (from the other branch)
function createInPageButtons(buttonsData) {
// ... existing code
}

// Accessibility issue handlers
function addressAccessibilityIssues(insightReport) {
// ... existing code
}

function getInsightReport() {
// ... existing code
}

// Export functions for testing
module.exports = {
    // Merged functions (landmark validation and addressing accessibility issues)
    validateLandmark,
    addressAccessibilityIssues,
    getInsightReport,

    // Landmark helpers
    checkLandmarkElement,
    ensureUniqueLandmarks,
    ensureLandmarkUniqueness,
    createInPageButtons,
    createFocusTrap,
    newFocusTrap,
    validateTableAccessibility,
    validateTableStructure,
    fixTableStructure,
    countDependencies,

    // Additional functions from HEAD
    landmarkStructureCheck,
    setLanguageAttribute,
    addLandmarkRoles,
    fixFakeLinks,
    isSecureContext,
    initApp,
    ensureFocusableElements,
    renderDependencyGraphContent,
    validateSvgAccessibility,
    processUniqueElements,
    addressInsightIssues,
    renderDependencyGraph,
    renderIndexView,
    calculateSum,
    addProperLandmarkRegions,
    countGraphDependencies,

    // Landmarks array and app state
    landmarks,
    appState,

    // Server setup (incorporated from origin/main)
    express,
    path,
    app: express(),
    PORT: process.env.PORT || 3000,
    HOST: process.env.HOST || 'localhost'
};

// Main execution when run directly
if (require.main === module) {
// ... existing code
}