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

import { initializeApp, appData } from './app.js';
import { registerSW } from 'effector-sw';
import { appStarted } from './events/appStarted.js';

// Landmark data structure
const landmarks = [];

// Re-add the required exports for functionA and functionB
// Assuming that they are objects with properties X, Y, and Z
const functionA = {
  X: 'valueX',
  Y: 'valueY',
  Z: 'valueZ'
};

const functionB = {
  X: 'valueX',
  Y: 'valueY',
  Z: 'valueZ'
};

// Placeholder for the affected SVGs
const icons = {};

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
    const key = JSON.stringify(landmark);
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
  if (navElement) {
    navElement.setAttribute('role', 'navigation');
  }

  // Main content landmark
  const mainElement = document.querySelector('main');
  if (mainElement) {
    mainElement.setAttribute('role', 'main');
  }

  // Header landmark (banner)
  const headerElement = document.querySelector('header');
  if (headerElement) {
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
  const fakeLinks = document.querySelectorAll('[onclick], [onClick]');
  fakeLinks.forEach((element) => {
    if (element.tagName.toLowerCase() !== 'a') {
      // Add role="button" and appropriate ARIA attributes
      element.setAttribute('role', 'button');
      element.setAttribute('tabindex', '0');
      // Use the element's text content as the aria-label if not present
      element.setAttribute('aria-label', element.textContent.trim() || 'Link');
    }
  });
};

function helloWorld() {
  return 'Hello, World!';
}

/**
 * REACT_015: Get the lang attribute for the HTML element
 * @returns {string} The language attribute value, defaults to 'en'
 */
function getLangAttribute() {
    const htmlElement = document.querySelector('html');
    return htmlElement ? htmlElement.getAttribute('lang') || 'en' : 'en';
}

/**
 * REACT_015: Get accessible name for personName component
 * @param {Object} person - Person object with name property
 * @returns {string} Accessible name for the person
 */
function personName(person) {
    if (!person || !person.name) {
        return '';
    }
    return person.name;
}

/**
 * REACT_027: Validate table accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with isValid and errors
 */
function validateTableAccessibility(table) {
    const result = { isValid: true, errors: [] };
    
    if (!table) {
        result.isValid = false;
        result.errors.push('Table element is required');
        return result;
    }

    // Check if table has proper caption or aria-labelledby
    const hasCaption = table.querySelector('caption');
    const hasAriaLabel = table.getAttribute('aria-label');
    const hasAriaLabelledby = table.getAttribute('aria-labelledby');

    if (!hasCaption && !hasAriaLabel && !hasAriaLabelledby) {
        result.isValid = false;
        result.errors.push('Table must have a caption, aria-label, or aria-labelledby');
    }

    // Check for th elements with scope or headers attribute
    const headers = table.querySelectorAll('th');
    headers.forEach((th, index) => {
        if (!th.getAttribute('scope') && !th.id) {
            result.isValid = false;
            result.errors.push(`TH element at index ${index} missing scope or id`);
        }
    });

    return result;
}

/**
 * REACT_027: Validate table structure
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with isValid and errors
 */
function validateTableStructure(table) {
    const result = { isValid: true, errors: [] };
    
    if (!table) {
        result.isValid = false;
        result.errors.push('Table element is required');
        return result;
    }

    // Check for proper thead and tbody structure
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    if (!thead) {
        result.isValid = false;
        result.errors.push('Table should have a thead element');
    }

    if (!tbody) {
        result.isValid = false;
        result.errors.push('Table should have a tbody element');
    }

    // Check that th elements are in thead
    const ths = table.querySelectorAll('th');
    ths.forEach((th) => {
        if (!thead || !thead.contains(th)) {
            result.isValid = false;
            result.errors.push('All TH elements should be inside thead');
        }
    });

    return result;
}

/**
 * REACT_041: Get SVG accessible name
 * @param {SVGElement} svg - The SVG element
 * @returns {string} Accessible name for the SVG
 */
function getSvgAccessibleName(svg) {
    if (!svg) {
        return '';
    }

    // Check for aria-label first
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) {
        return ariaLabel;
    }

    // Check for aria-labelledby reference
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
        const referencedElement = document.getElementById(ariaLabelledby);
        if (referencedElement) {
            return referencedElement.textContent || '';
        }
    }

    // Check for title element inside SVG
    const title = svg.querySelector('title');
    if (title) {
        return title.textContent || '';
    }

    return '';
}

/**
 * REACT_036: Create an accessible in-page button (not a fake link)
 * @param {Object} props - Button properties
 * @param {string} props.text - Button text content
 * @param {Function} props.onClick - Click handler
 * @param {string} props.id - Button ID (optional)
 * @param {string} props.className - Button class name (optional)
 * @returns {React.Element} Accessible button element
 */
function createInPageButton({ text, onClick, id, className }) {
    return React.createElement('button', {
        type: 'button',
        onClick: onClick,
        id: id,
        className: className,
        'aria-label': text
    }, text);
}

/**
 * REACT_025: Ensure unique landmarks (enhancement for accessibility)
 * Addresses the requirement to ensure unique landmarks in the document
 * @param {Array} landmarks - Array of landmark elements or objects
 * @returns {Array} Array of unique landmarks
 */
function ensureLandmarkUniqueness(landmarks) {
    const seen = new Map();
    const unique = [];

    for (const landmark of landmarks) {
        const key = landmark.id || landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        
        if (!seen.has(key)) {
            seen.set(key, true);
            unique.push(landmark);
        } else {
            // Mark duplicate for accessibility report
            console.warn(`Duplicate landmark detected: ${key}`);
        }
    }

    return unique;
}

// New function implementation as per the issue requirements
function processLandmarks(landmarks) {
  // Ensure all landmarks have valid structure
  const validLandmarks = landmarks.filter(landmarkStructureCheck);
  
  // Ensure the landmarks are unique
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);
  
  return uniqueLandmarks;
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

    landmarkSelectors.forEach((landmark) => {
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
        validation.errors.push('Required <main> landmark element');
    }

    return validation;
}

/**
 * Function for addressing accessibility issues from insight report
 * 
 * This function processes the insight report data and applies all necessary
 * accessibility fixes to the document based on the identified issues.
 * 
 * @param {Object} insightReport - The insight report containing accessibility issues
 * @param {Array} insightReport.issues - Array of accessibility issues from the report
 * @param {Object} insightReport.config - Configuration options for fixing issues
 * @returns {Object} Result object containing fixes applied and any remaining issues
 */
function addressAccessibilityIssues(insightReport) {
    const result = {
        applied: [],
        failed: [],
        summary: {
            total: 0,
            successful: 0,
            failed: 0
        }
    };

    // Default configuration for accessibility fixes
    const config = insightReport.config || {
        fixLangAttribute: true,
        fixLandmarkRoles: true,
        fixSvgAccessibleNames: true,
        fixDuplicateLandmarks: true,
        fixFakeLinks: true,
        fixTableScopes: true
    };

    // Process the insight report issues
    const issues = insightReport.issues || [];
    result.summary.total = issues.length;

    // REACT_015: Fix lang attribute on HTML element
    if (config.fixLangAttribute) {
        const langIssue = issues.find(issue => issue.code === 'REACT_015');
        if (langIssue) {
            try {
                const lang = langIssue.language || 'en';
                setLanguageAttribute(lang);
                result.applied.push({
                    code: 'REACT_015',
                    action: 'setLanguageAttribute',
                    value: lang
                });
            } catch (error) {
                result.failed.push({
                    code: 'REACT_015',
                    error: error.message
                });
            }
        }
    }

    // REACT_017: Add landmark roles
    if (config.fixLandmarkRoles) {
        const landmarkIssue = issues.find(issue => issue.code === 'REACT_017');
        if (landmarkIssue) {
            try {
                addLandmarkRoles();
                result.applied.push({
                    code: 'REACT_017',
                    action: 'addLandmarkRoles'
                });
            } catch (error) {
                result.failed.push({
                    code: 'REACT_017',
                    error: error.message
                });
            }
        }
    }

    // REACT_041: Add accessible names to SVGs
    if (config.fixSvgAccessibleNames) {
        const svgIssues = issues.filter(issue => issue.code === 'REACT_041');
        if (svgIssues.length > 0) {
            try {
                svgIssues.forEach(svgIssue => {
                    if (svgIssue.selector && svgIssue.accessibleName) {
                        addSVGAccessibleName(svgIssue.selector, svgIssue.accessibleName);
                        result.applied.push({
                            code: 'REACT_041',
                            action: 'addSVGAccessibleName',
                            selector: svgIssue.selector,
                            accessibleName: svgIssue.accessibleName
                        });
                    }
                });
            } catch (error) {
                result.failed.push({
                    code: 'REACT_041',
                    error: error.message
                });
            }
        }
    }

    // REACT_025: Fix duplicate landmarks
    if (config.fixDuplicateLandmarks) {
        const duplicateLandmarkIssues = issues.filter(issue => issue.code === 'REACT_025');
        if (duplicateLandmarkIssues.length > 0) {
            try {
                ensureUniqueLandmarkElements();
                result.applied.push({
                    code: 'REACT_025',
                    action: 'ensureUniqueLandmarkElements',
                    count: duplicateLandmarkIssues.length
                });
            } catch (error) {
                result.failed.push({
                    code: 'REACT_025',
                    error: error.message
                });
            }
        }
    }

    // REACT_036: Fix fake links
    if (config.fixFakeLinks) {
        const fakeLinkIssues = issues.filter(issue => issue.code === 'REACT_036');
        if (fakeLinkIssues.length > 0) {
            try {
                fixFakeLinks();
                result.applied.push({
                    code: 'REACT_036',
                    action: 'fixFakeLinks',
                    count: fakeLinkIssues.length
                });
            } catch (error) {
                result.failed.push({
                    code: 'REACT_036',
                    error: error.message
                });
            }
        }
    }

    // REACT_025: Add scope to table headers
    if (config.fixTableScopes) {
        const tableScopeIssues = issues.filter(issue => issue.code === 'REACT_025' && issue.type === 'scope');
        if (tableScopeIssues.length > 0) {
            try {
                // Find all tables and add scope attributes to th elements
                const tables = document.querySelectorAll('table');
                tables.forEach(table => {
                    const ths = table.querySelectorAll('th');
                    ths.forEach((th, index) => {
                        if (!th.getAttribute('scope')) {
                            const isFirstRow = index < ths.length / 2;
                            th.setAttribute('scope', isFirstRow ? 'col' : 'row');
                        }
                    });
                });
                result.applied.push({
                    code: 'REACT_025',
                    action: 'addTableScopes',
                    count: tableScopeIssues.length
                });
            } catch (error) {
                result.failed.push({
                    code: 'REACT_025',
                    error: error.message
                });
            }
        }
    }

    // Update summary counts
    result.summary.successful = result.applied.length;
    result.summary.failed = result.failed.length;

    // Log the accessibility fixes applied
    console.log('Accessibility fixes applied:', result.applied);
    if (result.failed.length > 0) {
        console.warn('Accessibility fixes failed:', result.failed);
    }

    return result;
}

/**
 * Initializes the application and applies accessibility fixes.
 */
const initApp = () => {
  // Initialize the main application
  initializeApp();

  // Apply accessibility fixes
  setLanguageAttribute(); // Default to 'en'
  addLandmarkRoles();
  
  // Add accessible names to SVGs (example selectors and names)
  addSVGAccessibleName('#home-icon', 'Home icon');
  addSVGAccessibleName('#settings-icon', 'Settings icon');

  // Fix fake links
  fixFakeLinks();

  // Initialize the application data
  console.log('Initializing ' + appData.title + ' v' + appData.version);

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
    landmarks,
    functionA,
    functionB,
    processLandmarks,
    getLangAttribute,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    getSvgAccessibleName,
    createInPageButton,
    ensureLandmarkUniqueness,
    addressAccessibilityIssues
};