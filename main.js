// Main JavaScript file

// Sample data for the application
const appData = {
    title: 'Landmark Checker',
    version: '1.0.0'
};

// Helper function to get element by ID
function getElementById(id) {
    return document.getElementById(id);
}

// Helper function to query elements
function queryElements(selector) {
    return document.querySelectorAll(selector);
}

// Create an accessible link element
/**
 * Creates an accessible link element
 * @param {string} text - The text content of the link
 * @param {string} href - The URL the link points to
 * @param {Object} options - Additional options for the link
 * @returns {HTMLAnchorElement} The created link element
 */
function createAccessibleLink(text, href, options = {}) {
  const link = document.createElement('a');
  link.textContent = text;
  link.href = href;
  
  if (options.className) {
    link.className = options.className;
  }
  if (options.id) {
    link.id = options.id;
  }
  if (options.target) {
    link.target = options.target;
  }
  if (options.rel) {
    link.rel = options.rel;
  }
  if (options.title) {
    link.title = options.title;
  }
  if (options.onClick) {
    link.addEventListener('click', options.onClick);
  }
  
  // Ensure accessibility attributes
  link.setAttribute('role', 'link');
  link.setAttribute('tabindex', '0');
  
  return link;
}

// Creates an in-page button element
/**
 * Creates an in-page button element
 * @param {string} text - The text content of the button
 * @param {Object} options - Additional options for the button
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(text, options = {}) {
  const button = document.createElement('button');
  button.textContent = text;
  
  if (options.className) {
    button.className = options.className;
  }
  if (options.id) {
    button.id = options.id;
  }
  if (options.type) {
    button.type = options.type;
  } else {
    button.type = 'button';
  }
  if (options.disabled) {
    button.disabled = options.disabled;
  }
  if (options.title) {
    button.title = options.title;
  }
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  
  return button;
}

// Import styles and utilities
import './styles.css';
import { getUserData, calculateTotalPrice } from './utils.js';

// Export utility functions
export { createAccessibleLink, createInPageButton };

// Export application functions
export function initializeApp() {
  // Initialize the application
  console.log('App initialized');
}

// Landmark checking functions
// TODO: Implement createInPageButton() and createAccessibleLink() functions here

/**
 * Creates an accessible link element
 * @param {string} text - The text content of the link
 * @param {string} href - The URL the link points to
 * @param {Object} options - Additional options for the link
 * @returns {HTMLAnchorElement} The created link element
 */
function createAccessibleLink(text, href, options = {}) {
  const link = document.createElement('a');
  link.textContent = text;
  link.href = href;
  
  if (options.className) {
    link.className = options.className;
  }
  if (options.id) {
    link.id = options.id;
  }
  if (options.target) {
    link.target = options.target;
  }
  if (options.rel) {
    link.rel = options.rel;
  }
  if (options.title) {
    link.title = options.title;
  }
  if (options.onClick) {
    link.addEventListener('click', options.onClick);
  }
  
  // Ensure accessibility attributes
  link.setAttribute('role', 'link');
  link.setAttribute('tabindex', '0');
  
  return link;
}

/**
 * Creates an in-page button element
 * @param {string} text - The text content of the button
 * @param {Object} options - Additional options for the button
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(text, options = {}) {
  const button = document.createElement('button');
  button.textContent = text;
  
  if (options.className) {
    button.className = options.className;
  }
  if (options.id) {
    button.id = options.id;
  }
  if (options.type) {
    button.type = options.type;
  } else {
    button.type = 'button';
  }
  if (options.disabled) {
    button.disabled = options.disabled;
  }
  if (options.title) {
    button.title = options.title;
  }
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  
  return button;
}

// TODO: Implement this function for checking landmark elements
function checkLandmarkElements() {
    const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'article', 'section'];
    const results = {};
    
    landmarks.forEach(landmark => {
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
    
    if (!results.header.exists) {
        validation.warnings.push('No <header> landmark element found');
    }
    
    if (!results.nav.exists) {
        validation.warnings.push('No <nav> landmark element found');
    }
    
    if (!results.footer.exists) {
        validation.warnings.push('No <footer> landmark element found');
    }
    
    return validation;
}

// Initialize application
function init() {
    console.log('Initializing ' + appData.title + ' v' + appData.version);
    return checkLandmarkElements();
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkLandmarkElements,
        validateLandmarkStructure,
        getElementById,
        queryElements,
        init,
        createAccessibleLink,
        createInPageButton
    };
}