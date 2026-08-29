// main.js - Accessibility improvements applied

// Accessibility helper functions
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
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
  });

  firstElement.focus();
}

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarks) {
    const seen = new Set();
    return landmarks.filter(landmark => {
        const key = landmark.role + '-' + (landmark.label || '');
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

// Testing the checkLandmarkElement function:
//
// To test this function, we could create a test file with the following content:
// (Testing is kept here as integration reference for the merged module.)
const landmarkStructureCheck = (landmark) => {
  // Implement your logic for checking the landmark structure
  // For example, let's check if the landmark has required properties: name and coordinates
  if (!landmark.name || !landmark.coordinates) {
    return false;
  }
  return true;
};

// Placeholder for the affected SVGs
const icons = {
  icon: '<svg viewBox="0 0 100 100" aria-label="Screeps"></svg>',
  viewBox: '0 0 100 100',
  dashboard: '<title>Dashboard</title><text y=".9em">Dashboard</text>'
};

/**
 * Checks if the application is being loaded in a secure context.
 *
 * @returns {boolean} True if the application is in a secure context, false otherwise.
 */
const isSecureContext = () => {
  return window.isSecureContext;
};

/**
 * Sets the language attribute on the HTML element.
 *
 * This ensures that screen readers and other assistive technologies
 * can correctly interpret the language of the page.
 *
 * @param {string} lang - The language code to set (e.g., 'en', 'es', 'fr').
 */
const setLanguageAttribute = (lang = 'en') => {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
};

/**
 * Adds landmark roles to the main navigation and content sections.
 *
 * This addresses the REACT_017 issue by adding appropriate ARIA roles
 * such as 'navigation', 'main', and 'banner' to relevant HTML elements.
 */
const addLandmarkRoles = () => {
  // Navigation landmark
  const navElement = document.querySelector('nav');
  if (navElement && !navElement.hasAttribute('role')) {
    navElement.setAttribute('role', 'navigation');
  }

  // Main content landmark
  const mainElement = document.querySelector('main');
  if (mainElement && !mainElement.hasAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }

  // Header landmark (banner)
  const headerElement = document.querySelector('header');
  if (headerElement && !headerElement.hasAttribute('role')) {
    headerElement.setAttribute('role', 'banner');
  }
};

/**
 * Ensures that landmarks are unique by adding unique ARIA labels where necessary.
 *
 * This addresses the REACT_025 issue by checking for duplicate landmarks
 * and making them unique with appropriate aria-label or aria-labelledby attributes.
 */
const ensureUniqueLandmarkElements = () => {
  // Navigation landmark uniqueness
  const navElements = document.querySelectorAll('nav');
  if (navElements.length > 1) {
    navElements.forEach((nav, index) => {
      if (index > 0) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
    });
  }

  // Main content landmark uniqueness
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    mainElements.forEach((main, index) => {
      if (index > 0) {
        main.setAttribute('aria-label', `Main content ${index + 1}`);
      }
    });
  }
};

/**
 * Adds accessible names to SVG elements.
 *
 * This addresses the REACT_041 issue by ensuring that SVGs have appropriate
 * accessible names, either through title or desc elements.
 *
 * @param {string} svgSelector - The CSS selector for the SVG element(s).
 * @param {string} accessibleName - The accessible name to set.
 */
const addSVGAccessibleName = (svgSelector, accessibleName) => {
  const svgs = document.querySelectorAll(svgSelector);
  svgs.forEach((svg) => {
    // Check if the SVG already has a title element
    let titleElement = svg.querySelector('title');
    if (!titleElement) {
      titleElement = document.createElement('title');
      svg.insertBefore(titleElement, svg.firstChild);
    }
    titleElement.textContent = accessibleName;
  });
};

/**
 * Fixes fake links (elements that look like links but are not semantic <a> tags).
 *
 * This addresses the REACT_036 issue by identifying elements that have
 * click handlers but are not <a> tags and adding appropriate ARIA roles
 * and attributes to make them accessible.
 */
const fixFakeLinks = () => {
  const fakeLinks = document.querySelectorAll('[role="link"], [data-link]');
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

// TODO: Add a new function named `calculateSum` as requested in the issue
/**
 * Calculates the sum of all numbers provided.
 *
 * @param {...number} numbers - The numbers to sum.
 * @returns {number} The sum of all provided numbers.
 */
function calculateSum(...numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}

// Function to initialize the dependency graph with accessibility support
function initDependencyGraph(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.setAttribute('role', 'img');
    container.setAttribute('aria-label', 'Dependency graph visualization');
  }
}

// Function to render the dependency graph
function renderDependencyGraph(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    // Add the logic to render the dependency graph inside the container
    // This is a placeholder for the actual rendering logic
    container.innerHTML = 'Dependency Graph Data';
  }
}

// Helper function to get element by ID
function getElementById(id) {
    return document.getElementById(id);
}

// Helper function to query elements
function queryElements(selector) {
    return document.querySelectorAll(selector);
}

// Function to check landmark elements in the DOM
function checkLandmarkElements() {
    const landmarkSelectors = ['header', 'nav', 'main', 'aside', 'footer', 'article', 'section'];
    const results = {};

    landmarkSelectors.forEach(landmark => {
        const elements = document.querySelectorAll(landmark);
        results[landmark] = {
            count: elements.length,
            exists: elements.length > 0
        };
    });

    return results;
}

// Function to validate landmark structure
function validateLandmarkStructure() {
    const results = checkLandmarkElements();
    const validation = {
        isValid: true,
        errors: [],
        warnings: []
    };

    if (!results.main.exists) {
        validation.isValid = false;
        validation.errors.push('Missing required <main> landmark element');
    }

    if (!results.nav.exists) {
        validation.warnings.push('No <nav> landmark found');
    }

    return validation;
}

function announceToScreenReader(message, politeness = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', politeness);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.style.position = 'absolute';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.padding = '0';
  announcement.style.margin = '-1px';
  announcement.style.overflow = 'hidden';
  announcement.style.clip = 'rect(0, 0, 0, 0)';
  announcement.style.whiteSpace = 'nowrap';
  announcement.style.border = '0';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// TODO: Address accessibility issues from insight report — CONTINUING
// - Added keyboard navigation support
// - Added ARIA labels for interactive elements
// - Added screen reader announcements
// - Added focus trapping for modals
// Imported from conflicting changes (FIXME: review and merge correctly)
import { ensureUniqueLandmarks, landmarkStructureCheck, helloWorld, initDependencyGraph, renderDependencyGraph, getElementById, queryElements, checkLandmarkElement, checkLandmarkElements, validateLandmarkStructure, icons, isSecureContext, setLanguageAttribute, addLandmarkRoles, ensureUniqueLandmarkElements, addSVGAccessibleName, fixFakeLinks, landmarks } from './temp-import.js';

class AccessibleModal {
  constructor(modalElement) {
    this.modal = modalElement;
    this.isOpen = false;
    this.setupEventListeners();
  }

  setupEventListeners() {
    const closeButtons = this.modal.querySelectorAll('[data-close-modal]');
    closeButtons.forEach(button => {
      if (!button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', 'Close dialog');
      }
      if (!button.getAttribute('aria-describedby')) {
        const modalTitle = this.modal.querySelector('[id*="title"], h1, h2, h3');
        if (modalTitle && modalTitle.id) {
          button.setAttribute('aria-describedby', modalTitle.id);
        }
      }
    });

    this.modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open() {
    this.modal.removeAttribute('hidden');
    this.modal.setAttribute('aria-modal', 'true');
    this.modal.setAttribute('role', 'dialog');

    if (!this.modal.getAttribute('aria-labelledby')) {
      const title = this.modal.querySelector('h1, h2, h3');
      if (title) {
        if (!title.id) {
          title.id = 'modal-title-' + Date.now();
        }
        this.modal.setAttribute('aria-labelledby', title.id);
      }
    }

    this.isOpen = true;
    trapFocus(this.modal);
    announceToScreenReader('Dialog opened');
  }

  close() {
    this.modal.setAttribute('hidden', '');
    this.modal.setAttribute('aria-modal', 'false');
    this.isOpen = false;
    announceToScreenReader('Dialog closed');
  }
}

function initAccessibleNavigation() {
  const navToggle = document.querySelector('[aria-controls="primary-nav"]');
  const nav = document.getElementById('primary-nav');

  if (navToggle && nav) {
    if (!navToggle.getAttribute('aria-expanded')) {
      navToggle.setAttribute('aria-expanded', 'false');
    }
    if (!nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', 'Main navigation');
    }

    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);

      if (isExpanded) {
        nav.setAttribute('hidden', '');
      } else {
        nav.removeAttribute('hidden');
      }
    });
  }

  // Apply additional accessibility fixes
  setLanguageAttribute(); // Default to 'en'
  addLandmarkRoles();
  ensureUniqueLandmarkElements();

  // Add accessible names to SVGs (example selectors and names)
  addSVGAccessibleName('.icon-home', 'Home icon');
  addSVGAccessibleName('.icon-settings', 'Settings icon');
}

function makeFormAccessible(form) {
  const inputs = form.querySelectorAll('input, select, textarea');

  inputs.forEach(input => {
    const label = form.querySelector(`label[for="${input.id}"]`) ||
                  input.closest('label') ||
                  input.parentElement.querySelector('label');

    if (!input.getAttribute('aria-describedby') && !input.getAttribute('aria-label')) {
      if (label) {
        const labelId = label.id || 'label-' + input.id;
        if (!label.id) label.id = labelId;
        input.setAttribute('aria-describedby', labelId);
      }
    }

    if (!input.getAttribute('autocomplete') && (input.type === 'email' || input.type === 'tel')) {
      input.setAttribute('autocomplete', input.type === 'email' ? 'email' : 'tel');
    }
  });
}

function initSkipLink() {
  const skipLink = document.querySelector('a[href="#main-content"]');
  const mainContent = document.getElementById('main-content');

  if (skipLink && mainContent) {
    if (!mainContent.hasAttribute('tabindex')) {
      mainContent.setAttribute('tabindex', '-1');
    }
  }
}

function initAccessibility() {
  initSkipLink();
  initAccessibleNavigation();

  const forms = document.querySelectorAll('form');
  forms.forEach(form => makeFormAccessible(form));

  const modals = document.querySelectorAll('[data-modal]');
  modals.forEach(modal => new AccessibleModal(modal));

  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
      console.warn('Button missing accessible name:', button);
    }
  });

  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('alt')) {
      console.warn('Image missing alt attribute:', img);
    }
  });

  announceToScreenReader('Page loaded', 'assertive');
  validateLandmarkStructure();
  checkLandmarkElements();
}

function initApp() {
  // Check if the environment is secure before initializing
  if (isSecureContext()) {
    initAccessibility();
  } else {
    console.warn('Application is not running in a secure context. Some features may not be available.');
    initAccessibility();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
  initAccessibility();
}

export {
    trapFocus,
    ensureUniqueLandmarks,
    landmarkStructureCheck,
    calculateSum,
    initDependencyGraph,
    renderDependencyGraph,
    getElementById,
    queryElements,
    checkLandmarkElement,
    checkLandmarkElements,
    validateLandmarkStructure,
    initApp,
    announceToScreenReader,
    AccessibleModal,
    initAccessibleNavigation,
    makeFormAccessible,
    initSkipLink,
    initAccessibility,
    icons,
    isSecureContext,
    setLanguageAttribute,
    addLandmarkRoles,
    ensureUniqueLandmarkElements,
    addSVGAccessibleName,
    fixFakeLinks,
    landmarks
};