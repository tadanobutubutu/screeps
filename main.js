// Address accessibility issues from insight report

import './styles.css';
import { initializeApp, appData } from './app.js';
import { registerSW } from 'effector-sw';
import { appStarted } from './events/appStarted.js';

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
const icons = {
  icon: '<svg viewBox="0 0 100 100" role="img" aria-label="Screps Dashboard"><title>Screps Dashboard</title><text y=".9em">Dashboard</text></svg>'
};

function processLandmarks(landmarks) {
  const landmarkStructureCheck = (landmark) => {
    return true;
  };

  const validLandmarks = landmarks.filter(landmarkStructureCheck);

  const ensureUniqueLandmarks = (landmarks) => {
    return landmarks;
  };

  return ensureUniqueLandmarks(validLandmarks);
}

function addLangAttribute(htmlElement) {
  if (!htmlElement || !(htmlElement instanceof HTMLElement)) {
    console.error('addLangAttribute: Invalid HTML element provided');
    return;
  }

  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

function checkLandmarkElement(id) {
  // TODO: This is the existing code that needs to be preserved
  const element = document.getElementById(id);
  return element !== null;
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarks) {
    const seen = new Set();
    return landmarks.filter(landmark => {
        const key = landmark.name || landmark; // use name as unique key if available
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
  const fakeLinks = document.querySelectorAll('[onclick]');
  fakeLinks.forEach(element => {
    if (element.tagName.toLowerCase() !== 'a' && element.tagName.toLowerCase() !== 'button') {
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
  if (typeof person === 'string') {
    return person;
  }
  if (person.fullName) {
    return person.fullName;
  }
  if (person.firstName && person.lastName) {
    return `${person.firstName} ${person.lastName}`;
  }
  return person.name || '';
}

function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table.caption && !table.getAttribute('aria-label')) {
    issues.push('Table is missing a caption or aria-label');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

function validateTableStructure(table) {
  const issues = [];
  const headers = table.querySelectorAll('th');
  
  for (const header of headers) {
    if (!header.getAttribute('scope') && !header.getAttribute('id')) {
      issues.push('TH element missing scope or id attribute');
    }
  }
  
  if (!table.querySelector('thead')) {
    issues.push('Table missing thead element');
  }
  if (!table.querySelector('tbody')) {
    issues.push('Table missing tbody element');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

function getSvgAccessibleName(svgElement) {
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : '';
  }
  
  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent;
  }
  
  return '';
}

function validateLandmarkUniqueness(landmarks) {
  const issues = [];
  const seenLandmarks = new Map();
  
  for (const landmark of landmarks) {
    const key = `${landmark.role}-${landmark.name || landmark.id || 'unnamed'}`;
    
    if (seenLandmarks.has(key)) {
      issues.push(`Duplicate landmark found: ${key}`);
    } else {
      seenLandmarks.set(key, landmark);
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

function createInPageButtonFromLinkElement(linkElement) {
  if (!linkElement) return null;
  
  const tagName = linkElement.tagName.toLowerCase();
  const isFakeLink = tagName !== 'a' && tagName !== 'button' && linkElement.getAttribute('onclick');
  
  if (isFakeLink) {
    if (!linkElement.getAttribute('role') || linkElement.getAttribute('role') !== 'button') {
      linkElement.setAttribute('role', 'button');
    }
    
    if (linkElement.getAttribute('tabindex') === null) {
      linkElement.setAttribute('tabindex', '0');
    }
    
    const accessibleName = personName(linkElement.textContent || linkElement.getAttribute('aria-label') || 'Button');
    if (!linkElement.getAttribute('aria-label') && !linkElement.textContent?.trim()) {
      linkElement.setAttribute('aria-label', accessibleName);
    }
  }
  
  return linkElement;
}

// REACT_015: Add lang attribute to HTML element
function getLangAttribute(document) {
    // Determine the language attribute for the HTML element
    // Based on page content or configuration
    const lang = document.documentElement?.lang || 'en';
    return lang;
}

// Helper function for REACT_015 and REACT_036
function personName(person) {
    // Generate an accessible name for a person element
    if (typeof person === 'string') {
        return person;
    }
    if (person.fullName) {
        return person.fullName;
    }
    if (person.firstName && person.lastName) {
        return `${person.firstName} ${person.lastName}`;
    }
    return person.name || '';
}

// REACT_027: Fix table structure issues
function validateTableAccessibility(table) {
    // Validate that tables have proper accessibility attributes
    // Check for proper table headers, captions, and structure
    const issues = [];
    
    if (!table.caption && !table.getAttribute('aria-label')) {
        issues.push('Table is missing a caption or aria-label');
    }
    
    return {
        isValid: issues.length === 0,
        issues
    };
}

function validateTableStructure(table) {
    // Validate table structure: proper th elements, scope attributes
    const issues = [];
    const headers = table.querySelectorAll('th');
    
    for (const header of headers) {
        if (!header.getAttribute('scope') && !header.getAttribute('id')) {
            issues.push('TH element missing scope or id attribute');
        }
    }
    
    // Check for proper table structure
    if (!table.querySelector('thead')) {
        issues.push('Table missing thead element');
    }
    if (!table.querySelector('tbody')) {
        issues.push('Table missing tbody element');
    }
    
    return {
        isValid: issues.length === 0,
        issues
    };
}

// REACT_041: Add accessible names to SVGs
function getSvgAccessibleName(svgElement) {
    // Get or generate an accessible name for an SVG element
    // Check for aria-label, aria-labelledby, or title element
    const ariaLabel = svgElement.getAttribute('aria-label');
    if (ariaLabel) {
        return ariaLabel;
    }
    
    const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
        const labelElement = document.getElementById(ariaLabelledby);
        return labelElement ? labelElement.textContent : '';
    }
    
    const title = svgElement.querySelector('title');
    if (title) {
        return title.textContent;
    }
    
    return '';
}

// REACT_025: Ensure unique landmarks
function validateLandmarkUniqueness(landmarks) {
    // Validate that landmarks have unique names/roles
    const issues = [];
    const seenLandmarks = new Map();
    
    for (const landmark of landmarks) {
        const key = `${landmark.role}-${landmark.name || landmark.id || 'unnamed'}`;
        
        if (seenLandmarks.has(key)) {
            issues.push(`Duplicate landmark found: ${key}`);
        } else {
            seenLandmarks.set(key, landmark);
        }
    }
    
    return {
        isValid: issues.length === 0,
        issues
    };
}

// REACT_036: Fix fake link issue
function createInPageButton(linkElement) {
    // Convert a fake link (e.g., div/span with onclick) to a proper button
    // or ensure it has proper accessibility attributes
    if (!linkElement) return null;
    
    const tagName = linkElement.tagName.toLowerCase();
    const isFakeLink = tagName !== 'a' && tagName !== 'button' && linkElement.getAttribute('onclick');
    
    if (isFakeLink) {
        // Ensure the element has proper button semantics
        if (!linkElement.getAttribute('role') || linkElement.getAttribute('role') !== 'button') {
            linkElement.setAttribute('role', 'button');
        }
        
        // Ensure it has a tabindex to be keyboard accessible
        if (linkElement.getAttribute('tabindex') === null) {
            linkElement.setAttribute('tabindex', '0');
        }
        
        // Ensure it has an accessible name
        const accessibleName = personName(linkElement.textContent || linkElement.getAttribute('aria-label') || 'Button');
        if (!linkElement.getAttribute('aria-label') && !linkElement.textContent?.trim()) {
            linkElement.setAttribute('aria-label', accessibleName);
        }
    }
    
    return linkElement;
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
  addSVGAccessibleName('.icon-home', 'Home icon');
  addSVGAccessibleName('.icon-settings', 'Settings icon');

  // Fix fake links
  fixFakeLinks();

  // Initialize the application data
  const appData = { title: 'Frontend Application', version: '1.0.0' }; // Define application data
  console.log('Initializing ' + appData.title + ' v' + appData.version);
  // ... (additional initialization can be added here)

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
    landmarkStructureCheck,
    ensureUniqueLandmarks,
    getLangAttribute,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    getSvgAccessibleName,
    createInPageButton,
    ensureLandmarkUniqueness
};
```