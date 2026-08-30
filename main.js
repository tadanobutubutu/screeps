import './styles.css';

import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

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
        const key = landmark.name + '_' + (landmark.role || 'default');
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

// Testing the checkLandmarkElement function:
// To test this function, we could create a test file with the following content:
const landmarkStructureCheck = (landmark) => {
  if (!landmark.name || !landmark.coordinates) {
    return false;
  }
  return true;
};

/**
 * REACT_015: Add lang attribute to HTML element
 * Sets the language attribute on the HTML element.
 */
function setLanguageAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * REACT_017: Add/fix 2 landmark issues
 * Validates landmark elements for proper structure and accessibility.
 */
function validateLandmark(landmark) {
  if (!landmark || !landmark.role) {
    return false;
  }
  return true;
}

/**
 * Validates landmark structure by checking required properties.
 * @param {Object} landmark - The landmark object to validate.
 * @returns {boolean} Returns true if the landmark structure is valid.
 */
function validateLandmarkStructure(landmark) {
  if (!landmark.name || !landmark.coordinates) {
    return false;
  }
  return true;
}

/**
 * Adds landmark roles to elements.
 */
function addLandmarkRoles() {
  const landmarkElements = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
  landmarkElements.forEach((element, index) => {
    if (!element.id) {
      element.id = 'landmark-' + index;
    }
  });
}

/**
 * REACT_027: Fix 26 table structure issues
 * Validates table accessibility by checking for proper structure.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {boolean} Returns true if the table is accessible.
 */
function validateTableAccessibility(table) {
  if (!table) return false;
  
  const headers = table.querySelectorAll('th');
  const hasHeaders = headers.length > 0;
  const hasCaption = table.querySelector('caption') !== null;
  
  return hasHeaders && hasCaption;
}

/**
 * Validates table structure for proper headers and accessibility.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {boolean} Returns true if the table structure is valid.
 */
function validateTableStructure(table) {
  if (!table) return false;
  
  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td');
    cells.forEach(cell => {
      if (cell.tagName === 'TH' && !cell.hasAttribute('scope')) {
        cell.setAttribute('scope', 'col');
      }
    });
  });
  
  return true;
}

/**
 * REACT_041: Add accessible names to 2 SVGs
 * Gets accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string|null} Returns the accessible name or null.
 */
function getSvgAccessibleName(svg) {
  if (!svg) return null;
  
  return svg.getAttribute('aria-label') || 
         svg.getAttribute('aria-labelledby') || 
         svg.querySelector('title')?.textContent || 
         null;
}

/**
 * Sets accessibility attributes on SVG elements.
 * @param {SVGElement} svg - The SVG element.
 * @param {string} name - The accessible name to set.
 */
function setSvgAttributes(svg, name) {
  if (!svg) return;
  
  if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
    svg.setAttribute('aria-label', name);
  }
}

/**
 * REACT_036: Fix 1 fake link issue
 * Creates an in-page button with proper accessibility.
 * @param {string} text - The button text.
 * @param {Function} onClick - The click handler.
 * @returns {HTMLButtonElement} The created button element.
 */
function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('type', 'button');
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  return button;
}

/**
 * Validates link accessibility by checking for proper href attributes.
 * @param {HTMLAnchorElement} link - The link element to validate.
 * @returns {boolean} Returns true if the link is accessible.
 */
function validateLinkAccessibility(link) {
  if (!link) return false;
  
  const href = link.getAttribute('href');
  const hasProperHref = href && href.length > 0 && href !== '#';
  const hasAccessibleText = link.textContent.trim().length > 0 || link.hasAttribute('aria-label');
  
  return hasProperHref || hasAccessibleText;
}

/**
 * Handles fake links by converting them to proper buttons or adding accessibility attributes.
 */
function handleFakeLinks() {
  const links = document.querySelectorAll('a[href="#"], a:not([href])');
  links.forEach(link => {
    if (link.getAttribute('href') === '#' || !link.hasAttribute('href')) {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
    }
  });
}

/**
 * Fixes fake links that don't have proper href attributes.
 */
function fixFakeLinks() {
  handleFakeLinks();
}

/**
 * REACT_037: Add proper landmark regions
 * Ensures proper landmark regions are added to the document.
 */
function addProperLandmarkRegions() {
  const mainElement = document.querySelector('main') || document.querySelector('[role="main"]');
  if (mainElement && !mainElement.id) {
    mainElement.id = 'main-content';
  }
  
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.id) {
      nav.id = 'navigation-' + index;
    }
  });
  
  const footerElement = document.querySelector('footer') || document.querySelector('[role="contentinfo"]');
  if (footerElement && !footerElement.id) {
    footerElement.id = 'footer';
  }
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
  ensureUniqueLandmarks(landmarks);
  
  // Add accessible names to SVGs (example selectors and names)
  icons = {
    icon: '<svg viewBox="0 0 100 100" aria-label="Screps icon"></svg>'
  };

  // Fix fake links
  fixFakeLinks();
  
  // Initialize the application data
  console.log('Initializing ' + appData.title + ' v' + appData.version);
  // ... (assuming other initialization logic is present)
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
// ... (only include exported functions if needed and remove unrelated code)