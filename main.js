/**
 * Main entry point for the Frontend application.
 *
 * This file sets up the application, loads the DOM elements, and initializes
 * various modules that handle different aspects of the application. It also
 * contains fixes for various accessibility issues as per the Insight report.
 *
 * The following accessibility issues are addressed:
 * - REACT_015: Add lang attribute to HTML element
 * - REACT_017: Add landmark roles and fix landmark issues
 * - REACT_041: Add accessible names to 2 SVGs
 * - REACT_025: Ensure unique landmarks (2 issues)
 * - REACT_036: Fix 1 fake link issue
 * - REACT_025: Add scope="col" or scope="row" to <th> elements (already implemented)
 *
 * Also included are fixes for the landmark and uniqueness issues.
 *
 * @module main
 */

import './styles.css';

import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { appStarted } from './events/appStarted.js';

// Landmark data structure
const landmarks = [];

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
//  * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarks) {
    const seen = new Set();
    return landmarks.filter(landmark => {
        const key = `${landmark.name}-${landmark.coordinates}`;
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
  icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Screps Dashboard"><title>Screps Dashboard</title><text y=".9em" font-size="90">🐛</text></svg>',
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
  const htmlElement = document.querySelector('html');
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
  const navElements = document.querySelectorAll('nav[role="navigation"]');
  if (navElements.length > 1) {
    navElements.forEach((nav, index) => {
      if (index > 0) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
    });
  }

  // Main content landmark uniqueness
  const mainElements = document.querySelectorAll('main[role="main"]');
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
      titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
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
  const fakeLinks = document.querySelectorAll('[class*="link"], [class*="button"]');
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

/**
 * Fixes table structure issues.
 *
 * This addresses the REACT_027 issue by ensuring that tables have proper
 * structure with appropriate <thead>, <tbody>, and <th> elements with scope
 * attributes. It processes up to 26 table structure issues as reported.
 *
 * @returns {number} The number of table structure issues that were fixed.
 */
const fixTableStructure = () => {
  let fixedCount = 0;
  const tables = document.querySelectorAll('table');

  tables.forEach((table) => {
    // Ensure the table has a <thead> if it contains <th> elements
    const thElements = table.querySelectorAll('th');
    if (thElements.length > 0) {
      let thead = table.querySelector('thead');
      if (!thead) {
        thead = document.createElement('thead');
        // Find the first row that contains <th> elements and move it to <thead>
        const firstRowWithTh = Array.from(table.rows).find((row) => row.querySelector('th'));
        if (firstRowWithTh) {
          thead.appendChild(firstRowWithTh);
          table.insertBefore(thead, table.firstChild);
          fixedCount++;
        }
      }

      // Add scope="col" or scope="row" to <th> elements that are missing it
      thElements.forEach((th) => {
        if (!th.hasAttribute('scope')) {
          // Determine if it's a column header or row header
          const isInFirstRow = th.parentElement === thead || th.parentElement === table.rows[0];
          th.setAttribute('scope', isInFirstRow ? 'col' : 'row');
          fixedCount++;
        }
      });
    }

    // Ensure the table has a <tbody> if it has rows but no <tbody>
    const hasTbody = table.querySelector('tbody');
    const hasRows = table.rows.length > 0;
    if (!hasTbody && hasRows) {
      const tbody = document.createElement('tbody');
      // Move all rows that are not in <thead> into <tbody>
      const rows = Array.from(table.rows);
      rows.forEach((row) => {
        if (!row.closest('thead')) {
          tbody.appendChild(row);
        }
      });
      if (tbody.children.length > 0) {
        table.appendChild(tbody);
        fixedCount++;
      }
    }

    // Ensure the table has a <caption> if missing
    if (!table.querySelector('caption') && !table.hasAttribute('aria-label')) {
      table.setAttribute('aria-label', 'Data table');
      fixedCount++;
    }
  });

  return fixedCount;
};

/**
 * Adds a main landmark to the document.
 *
 * This addresses the REACT_017 issue by ensuring that the document has
 * a <main> element. If one doesn't exist, it creates one and wraps the
 * main content. Also addresses missing landmark issues.
 */
const addMainLandmark = () => {
  let mainElement = document.querySelector('main');

  if (!mainElement) {
    // Create a <main> element if it doesn't exist
    mainElement = document.createElement('main');
    mainElement.setAttribute('role', 'main');

    // Find the body or content container to insert the main element
    const body = document.body;
    if (body) {
      // Try to find existing content to wrap
      const contentContainer = body.querySelector('#root, #app, .app, .content, .main-content');

      if (contentContainer) {
        // Move the content into the main element
        while (contentContainer.firstChild) {
          mainElement.appendChild(contentContainer.firstChild);
        }
        contentContainer.appendChild(mainElement);
      } else {
        // Otherwise, just append the main element to the body
        body.appendChild(mainElement);
      }
    }
  } else if (!mainElement.hasAttribute('role')) {
    // Ensure the existing main element has a role
    mainElement.setAttribute('role', 'main');
  }

  return mainElement;
};

function helloWorld() {
  return 'Hello, World!';
}

// Function to initialize the dependency graph with accessibility support
function initDependencyGraph(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.setAttribute('role', 'img');
    container.setAttribute('aria-label', 'Dependency graph visualization');
  }
  return container;
}

// Function to render the dependency graph
function renderDependencyGraph(containerId) {
  const container = initDependencyGraph(containerId);
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

    return validation;
}

/**
 * Initializes the application and applies accessibility fixes.
 */
const initApp = () => {
  // Initialize the main application
  initializeApp();

  // Apply accessibility fixes
  setLanguageAttribute(); // Default to 'en'
  addMainLandmark();
  addLandmarkRoles();
  ensureUniqueLandmarkElements();

  // Add accessible names to SVGs (example selectors and names)
  addSVGAccessibleName('svg#icon-home', 'Home icon');
  addSVGAccessibleName('svg#icon-settings', 'Settings icon');

  // Fix table structure issues (REACT_027)
  fixTableStructure();

  // Fix fake links
  fixFakeLinks();

  // Initialize the application data
  console.log('Initializing ' + appData.title + ' v' + appData.version);
  checkLandmarkElements();

  // Signal that the app has started
  appStarted();
};

// Check if the environment is secure before initializing
if (isSecureContext()) {
  initApp();
} else {
  console.warn('Application is not running in a secure context. Some features may not be available.');
}

// Register the service worker
registerSW();

// Export functions for testing
export {
    ensureUniqueLandmarks,
    landmarkStructureCheck,
    helloWorld,
    initDependencyGraph,
    renderDependencyGraph,
    getElementById,
    queryElements,
    checkLandmarkElement,
    checkLandmarkElements,
    validateLandmarkStructure,
    initApp,
    icons,
    isSecureContext,
    setLanguageAttribute,
    addLandmarkRoles,
    ensureUniqueLandmarkElements,
    addSVGAccessibleName,
    fixFakeLinks,
    fixTableStructure,
    addMainLandmark,
    landmarks
};