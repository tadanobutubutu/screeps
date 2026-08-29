const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {};
let uniqueLandmarks = {};

function addressAccessibilityIssues() {
  // Ensure the dependencyGraph container has a proper ARIA role
  // Support both class and data attribute selectors for compatibility
  const dependencyGraph = document.querySelector('.dependency-graph, [data-dependency-graph]') ||
    document.querySelector('.dependencyGraph') ||
    document.querySelector('[data-testid="dependency-graph"]') ||
    document.querySelector('div[data-testid=dependency-graph]');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'tree');
    dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
  }

  function improveAccessibility() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      if (!button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', button.textContent || 'Button');
      }
    });

    const focusable = document.querySelectorAll('[role="link"]');
    focusable.forEach(el => {
      if (el.tabIndex < 0) el.tabIndex = 0;
    });
  }

  return improveAccessibility;
}

function ensureUniqueLandmarks(insightReport) {
  const landmarks = [...new Set(insightReport.issues.flatMap(issue => issue.ariaRole))];
  const uniqueLandmarkMap = {};

  landmarks.forEach(landmark => {
    const existingElements = document.querySelectorAll(`[role="${landmark}"]`);
    let element = null;

    if (existingElements.length > 0) {
      element = existingElements[0];
    } else {
      element = document.createElement('div');
      element.setAttribute('role', landmark);
      const id = landmark; // Use role name as ID
      if (!document.getElementById(id)) {
        element.setAttribute('id', id);
      }
      document.body.appendChild(element);
    }

    if (!element.id) {
      element.setAttribute('id', landmark);
    }

    uniqueLandmarkMap[landmark] = element;
  });

  return uniqueLandmarkMap;
}

function checkLandmarkElements() {
  const results = {
    hasMain: false,
    hasNav: false,
    hasHeader: false,
    hasFooter: false,
    hasAside: false,
    landmarkCount: 0,
    landmarks: [],
    errors: []
  };
  
  // Check for main landmark
  const mainElements = document.querySelectorAll('main, [role="main"]');
  results.hasMain = mainElements.length > 0;
  if (mainElements.length === 0) {
    results.errors.push('Missing main landmark');
  } else if (mainElements.length > 1) {
    results.errors.push('Multiple main landmarks found');
  }
  
  // Check for nav landmark
  const navElements = document.querySelectorAll('nav, [role="navigation"]');
  results.hasNav = navElements.length > 0;
  if (navElements.length === 0) {
    results.errors.push('Missing nav landmark');
  } else if (navElements.length > 1) {
    // Multiple navs are allowed if they have accessible names
    navElements.forEach((nav, index) => {
      if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
        results.errors.push(`Nav landmark ${index + 1} should have an aria-label or aria-labelledby attribute`);
      }
    });
  }
  
  // Check for header landmark
  const headerElements = document.querySelectorAll('header, [role="banner"]');
  results.hasHeader = headerElements.length > 0;
  if (headerElements.length > 1) {
    results.errors.push('Multiple header landmarks found');
  }
  
  // Check for footer landmark
  const footerElements = document.querySelectorAll('footer, [role="contentinfo"]');
  results.hasFooter = footerElements.length > 0;
  if (footerElements.length > 1) {
    results.errors.push('Multiple footer landmarks found');
  }
  
  // Check for aside landmark
  const asideElements = document.querySelectorAll('aside, [role="complementary"]');
  results.hasAside = asideElements.length > 0;
  
  // Collect all landmarks
  const allLandmarks = document.querySelectorAll(
    'header, nav, main, aside, footer, section, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="region"]'
  );
  
  allLandmarks.forEach(element => {
    const landmark = {
      tag: element.tagName.toLowerCase(),
      role: element.getAttribute('role') || null,
      id: element.id || null,
      hasLabel: element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby'),
      label: element.getAttribute('aria-label') || null
    };
    results.landmarks.push(landmark);
  });
  
  results.landmarkCount = results.landmarks.length;
  
  return results;
}

// Export the functions
module.exports = {
  checkLandmarkElements,
  addressAccessibilityIssues,
  ensureUniqueLandmarks
};