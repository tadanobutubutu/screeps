module.exports = {
  createInPageButton: function(buttonText, onClickHandler) {
    const button = document.createElement('button');
    const lang = document.documentElement.lang || 'en';

    button.setAttribute('type', 'button');
    button.setAttribute('lang', lang);
    button.setAttribute('aria-label', buttonText || 'In-page action');
    button.textContent = buttonText || 'Action';
    button.addEventListener('click', onClickHandler);

    return button;
  },

  addSvgAccessibleNames: function() {
    const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
    svgs.forEach(svg => {
      const title = svg.querySelector('title');
      if (title && title.textContent.trim()) {
        svg.setAttribute('aria-label', title.textContent.trim());
      }
    });
  },

  ensureUniqueLandmarks: function() {
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="search"], [role="complementary"], [role="contentinfo"], main, nav, aside, header, footer');
    const seen = new Map();
    landmarks.forEach(landmark => {
      const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
      const count = (seen.get(role) || 0) + 1;
      seen.set(role, count);
      if (count > 1 && !landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
        landmark.setAttribute('aria-label', `${role} ${count}`);
      }
    });
  },

  fixFakeLink: function() {
    const fakeLinks = document.querySelectorAll('[role="link"]:not(a), [onclick]:not(a):not(button):not([role])');
    fakeLinks.forEach(el => {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (!el.hasAttribute('role')) el.setAttribute('role', 'link');
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });
  },

  trapFocus: function(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleTab(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    element.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => element.removeEventListener('keydown', handleTab);
  },

  announce: function(message, priority = 'polite') {
    const liveRegion = document.getElementById('a11y-live-region') || (() => {
      const div = document.createElement('div');
      div.id = 'a11y-live-region';
      div.setAttribute('aria-live', priority);
      div.setAttribute('aria-atomic', 'true');
      div.style.position = 'absolute';
      div.style.left = '-9999px';
      document.body.appendChild(div);
      return div;
    })();
    liveRegion.textContent = '';
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.textContent = message;
  },

  handleArrowKeys: function(element, callback) {
    element.addEventListener('keydown', (e) => {
      const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (directions.includes(e.key)) {
        callback(e);
      }
    });
  },

  prefersReducedMotion: function() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  rotateBack: function() {},

  initializeAccessibility: function() {
    this.addSvgAccessibleNames();
    this.ensureUniqueLandmarks();
    this.fixFakeLink();
  },

  initialize: function() {
    this.initializeAccessibility();
  },

  formatDate: function(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toISOString().split('T')[0];
  },

  newFunction: function() {
    return 'This is a new function that has been added to main.js';
  },

  generateAccessibilityReport: function(issuesData) {
    const analyzedIssues = analyzeAccessibility(issuesData);
    const report = {
      introduction: 'Accessibility report for the application',
      data: analyzedIssues,
      conclusions: ''
    };
    return report;
  }
};

function analyzeAccessibility(issuesData) {
  return issuesData;
}

/**
 * Fixes fake links (elements that look like links but are not semantic <a> tags).
 *
 * This addresses the REACT_036 issue by identifying elements that have
 * click handlers but are not <a> tags and adding appropriate ARIA roles
 * and attributes to make them accessible.
 */
const fixFakeLinks = () => {
  const fakeLinks = document.querySelectorAll('[role="link"], .fake-link');
  fakeLinks.forEach((element) => {
    if (element.tagName.toLowerCase() !== 'a') {
      // Add role="button" and appropriate ARIA attributes
      element.setAttribute('role', 'button');
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
      if (!element.hasAttribute('aria-label')) {
        // Use the element's text content as the aria-label if not present
        element.setAttribute('aria-label', element.textContent.trim() || 'Link');
      }
    }
  });
};

// Placeholder for the affected SVGs
const icons = {
  icon: '<svg ... viewBox="0 0 100 100" aria-label="Screeps ... Dashboard</title><text y=".9em" ...>'
};

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  const fakeLink = document.getElementById('unrotate');
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }

  // Ensure table headers have proper scope
  ensureThScope();

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-hidden') || svg.getAttribute('aria-hidden') !== 'true') {
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
}

// Initialize the application with accessibility improvements
function initialize() {
  // Existing initialization logic preserved
  console.log('Application initialized');

  // Accessibility: Ensure main content is keyboard accessible
  const mainContent = document.querySelector('main') || document.getElementById('main');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.setAttribute('role', 'main');
  }

  // Accessibility: Add skip link functionality
  setupSkipLinks();

  // Accessibility: Ensure buttons have proper labels
  setupButtonAccessibility();

  // Accessibility: Add landmark roles and fix landmark issues
  addLandmarkRoles();
  addLandmarkRolesDetailed();

  // Accessibility: Add accessible names to 2 SVGs
  addSvgAccessibleNames();

  // Accessibility: Ensure unique landmarks
  ensurePageUniqueLandmarks();
  ensureUniqueLandmarkElements();

  // Accessibility: Fix 1 fake link issue
  fixFakeLink();

  // Initialize accessibility improvements
  initializeAccessibility();
}

// New function or change requested in the issue
function newFunction() {
  // Implementation of the new function
}

export function calculateDiscount(price, discount) {
  if (typeof price !== 'number' || price < 0) {
    throw new Error('Price must be a non-negative number');
  }
  if (typeof discount !== 'number' || discount < 0) {
    throw new Error('Discount must be a non-negative number');
  }

  // Calculate discounted price
  const discountedPrice = price * (1 - discount / 100);
  return Math.max(0, discountedPrice);
}

function greet(name) {
  return `Hello, ${name}!`;
}

function add(a, b) {
  return a + b;
}

/**
 * Get the application configuration
 * @returns {Object} The configuration object with apiUrl and timeout properties
 */
function getConfig() {
  return {
    apiUrl: process.env.API_URL || '',
    timeout: 5000
  };
}

// Export existing functionality and new functions
export { 
  initialize, 
  getConfig, 
  setupSkipLinks, 
  setupButtonAccessibility, 
  checkLandmarkElement, 
  createInPageButton, 
  performTask, 
  handleEvent, 
  greet, 
  add, 
  calculateDiscount, 
  newFunction,
  checkTableAccessibility,
  setLanguageAttribute,
  addLandmarkRolesDetailed,
  ensureUniqueLandmarkElements,
  addSVGAccessibleName,
  fixFakeLinkIssues,
  createUnrotateButton,
  ensureThScope,
  addLandmarkRoles,
  addSvgAccessibleNames,
  ensurePageUniqueLandmarks,
  fixFakeLink,
  initializeAccessibility
};

// Compatibility for CommonJS if needed (as per HEAD)
module.exports.newFunction = newFunction;
module.exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
module.exports.getLangAttribute = getLangAttribute;
module.exports.wrapPrimaryContentInMain = wrapPrimaryContentInMain;
module.exports.validateTableStructure = validateTableStructure;
module.exports.validateTableAccessibility = validateTableAccessibility;
module.exports.validateLandmarkStructure = validateLandmarkStructure;
module.exports.addFixLandmarkIssues = addFixLandmarkIssues;
module.exports.getSvgAccessibleName = getSvgAccessibleName;
module.exports.addAriaToFormControls = addAriaToFormControls;
module.exports.fixFakeLinkIssues = fixFakeLinkIssues;
module.exports.createUnrotateButton = createUnrotateButton;
module.exports.ensureThScope = ensureThScope;
module.exports.addLandmarkRoles = addLandmarkRoles;
module.exports.addSvgAccessibleNames = addSvgAccessibleNames;
module.exports.ensurePageUniqueLandmarks = ensurePageUniqueLandmarks;
module.exports.fixFakeLink = fixFakeLink;
module.exports.initializeAccessibility = initializeAccessibility;

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}

// More existing code that should be preserved