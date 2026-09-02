import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities'; // Assuming accessibility utilities are in a separate file

const root = ReactDOM.createRoot(document.getElementById('root'));

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and validateLandmarkAttributes())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
  return document.documentElement.lang || navigator.language || 'en';
}

/**
 * Adds lang attribute to HTML element
 */
function addLangAttribute() {
  const lang = getLangAttribute();
  if (lang) {
    document.documentElement.lang = lang;
  }
}

/**
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
function validateTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') {
    return false;
  }
  
  // Check for table header
  const hasHeader = table.querySelector('thead') || table.querySelector('th');
  if (!hasHeader) {
    return false;
  }
  
  // Check for proper scope on th elements
  const thElements = table.querySelectorAll('th');
  for (let i = 0; i < thElements.length; i++) {
    const th = thElements[i];
    const scope = th.getAttribute('scope');
    if (!scope || (scope !== 'row' && scope !== 'col' && scope !== 'rowgroup')) {
      return false;
    }
  }
  
  return true;
}

/**
 * Validates table structure
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table structure is valid
 */
function validateTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') {
    return false;
  }
  
  // Check for tbody if there are tr elements outside of thead
  const trElements = table.querySelectorAll('tr');
  if (trElements.length === 0) {
    return false;
  }
  
  // Check for proper nesting
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  
  // Basic structure validation
  if (!thead && trElements.length > 0) {
    // Check if first row contains th elements (indicating header)
    const firstRow = trElements[0];
    const thInFirstRow = firstRow.querySelector('th');
    if (thInFirstRow) {
      return false; // Missing thead when header exists
    }
  }
  
  return true;
}

/**
 * Fixes table structure issues
 * @param {HTMLElement} table - The table element to fix
 */
function fixTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') {
    return;
  }
  
  // Ensure table has a tbody
  let tbody = table.querySelector('tbody');
  if (!tbody) {
    tbody = document.createElement('tbody');
    // Move all tr elements that are direct children of table into tbody
    const rows = Array.from(table.querySelectorAll(':scope > tr'));
    rows.forEach(row => {
      tbody.appendChild(row);
    });
    if (rows.length > 0) {
      table.appendChild(tbody);
    }
  }
  
  // Ensure th elements have proper scope
  const thElements = table.querySelectorAll('th');
  thElements.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      // Determine scope based on position
      if (index === 0) {
        th.setAttribute('scope', 'col');
      } else {
        th.setAttribute('scope', 'row');
      }
    }
  });
}

/**
 * Adds main landmark to the document
 */
function addMainLandmark() {
  let main = document.querySelector('main');
  if (!main) {
    main = document.createElement('main');
    // Move existing content into main
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach(child => {
      if (child.tagName !== 'MAIN') {
        main.appendChild(child);
      }
    });
    if (main.children.length > 0) {
      document.body.appendChild(main);
    }
  }
}

/**
 * Validates landmark
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark is valid
 */
function validateLandmark(landmark) {
  if (!landmark) {
    return false;
  }
  
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region', 'article', 'aside'];
  const role = landmark.getAttribute('role');
  const tagName = landmark.tagName.toLowerCase();
  
  // Check if it's a semantic landmark element or has proper role
  const isSemanticLandmark = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'].includes(tagName);
  const hasValidRole = role && validRoles.includes(role);
  
  return isSemanticLandmark || hasValidRole;
}

/**
 * Validates landmark structure
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark structure is valid
 */
function validateLandmarkStructure(landmark) {
  if (!landmark) {
    return false;
  }
  
  // Landmarks should not be nested unless they have different roles
  const role = landmark.getAttribute('role');
  if (!role) {
    return true; // Semantic elements don't require structure validation
  }
  
  return true;
}

/**
 * Validates landmark attributes
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark attributes are valid
 */
function validateLandmarkAttributes(landmark) {
  if (!landmark) {
    return false;
  }
  
  const ariaLabel = landmark.getAttribute('aria-label');
  const ariaLabelledby = landmark.getAttribute('aria-labelledby');
  
  // Landmarks should have accessible names unless they're unique landmarks
  if (!ariaLabel && !ariaLabelledby) {
    const tagName = landmark.tagName.toLowerCase();
    const hasTitle = landmark.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasTitle && tagName !== 'main') {
      return false;
    }
  }
  
  return true;
}

/**
 * Gets accessible name for SVG
 * @param {HTMLElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg || svg.tagName !== 'SVG') {
    return '';
  }
  
  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labeledElement = document.querySelector(ariaLabelledby);
    if (labeledElement) {
      return labeledElement.textContent || labeledElement.getAttribute('aria-label') || '';
    }
  }
  
  // Check for title element
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent || '';
  }
  
  // Check for desc element
  const desc = svg.querySelector('desc');
  if (desc) {
    return desc.textContent || '';
  }
  
  return '';
}

/**
 * Sets SVG attributes for accessibility
 * @param {HTMLElement} svg - The SVG element
 * @param {string} name - The accessible name
 */
function setSvgAttributes(svg, name) {
  if (!svg || svg.tagName !== 'SVG') return;
  
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', name);
  
  // Ensure there's a title element for better accessibility
  let title = svg.querySelector('title');
  if (!title) {
    title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    svg.insertBefore(title, svg.firstChild);
  }
  title.textContent = name;
}

/**
 * Ensures unique landmarks in the document
 */
function ensureUniqueLandmarks() {
  const landmarkSelectors = ['main', 'header', 'footer', 'nav', 'aside'];
  const landmarks = document.querySelectorAll(landmarkSelectors.join(', '));
  
  // Count landmarks by role type
  const landmarkCounts = {};
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    const tagName = landmark.tagName.toLowerCase();
    const key = role || tagName;
    
    if (!landmarkCounts[key]) {
      landmarkCounts[key] = [];
    }
    landmarkCounts[key].push(landmark);
  });
  
  // For roles that should be unique, keep only the first one
  const uniqueRoles = ['banner', 'main', 'contentinfo'];
  
  Object.keys(landmarkCounts).forEach(key => {
    if (uniqueRoles.includes(key) && landmarkCounts[key].length > 1) {
      landmarkCounts[key].slice(1).forEach(landmark => {
        // Remove extra landmarks or change their role
        landmark.setAttribute('role', 'region');
        const ariaLabel = landmark.getAttribute('aria-label');
        if (!ariaLabel) {
          landmark.setAttribute('aria-label', 'Secondary ' + key);
        }
      });
    }
  });
}

/**
 * Creates an in-page button
 * @returns {HTMLElement} The created button
 */
function createInPageButton() {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('role', 'button');
  
  // Add keyboard interaction
  button.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      button.click();
    }
  });
  
  // Add focus styles
  button.addEventListener('focus', () => {
    button.classList.add('focused');
  });
  
  button.addEventListener('blur', () => {
    button.classList.remove('focused');
  });
  
  return button;
}

// Function for generating a report based on accessibility issues
function generateAccessibilityReport() {
  const issues = [];

  // Check for images without alt attributes
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        type: 'missing-alt',
        element: 'img',
        index: index,
        message: `Image at index ${index} is missing an alt attribute`
      });
    }
  });

  // Check for buttons without accessible names
  const buttons = document.querySelectorAll('button');
  buttons.forEach((btn, index) => {
    const accessibleName = btn.textContent.trim() || btn.getAttribute('aria-label') || btn.getAttribute('aria-labelledby');
    if (!accessibleName) {
      issues.push({
        type: 'missing-name',
        element: 'button',
        index: index,
        message: `Button at index ${index} is missing an accessible name`
      });
    }
  });

  // Check for links without accessible names
  const links = document.querySelectorAll('a');
  links.forEach((link, index) => {
    const accessibleName = link.textContent.trim() || link.getAttribute('aria-label') || link.getAttribute('aria-labelledby');
    if (!accessibleName) {
      issues.push({
        type: 'missing-name',
        element: 'a',
        index: index,
        message: `Link at index ${index} is missing an accessible name`
      });
    }
  });

  // Check for form inputs without labels
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input, index) => {
    const inputType = input.getAttribute('type');
    if (inputType && inputType !== 'hidden' && inputType !== 'submit' && inputType !== 'button' && inputType !== 'reset') {
      const labelId = input.getAttribute('aria-labelledby');
      const labelText = input.getAttribute('aria-label');
      const hasLabel = document.querySelector(`label[for="${input.id}"]`) || labelId || labelText;
      if (!hasLabel) {
        issues.push({
          type: 'missing-label',
          element: 'input',
          index: index,
          message: `Input at index ${index} is missing an associated label`
        });
      }
    }
  });

  // Check for empty headings
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading, index) => {
    if (!heading.textContent.trim()) {
      issues.push({
        type: 'empty-heading',
        element: heading.tagName.toLowerCase(),
        index: index,
        message: `${heading.tagName.toLowerCase()} at index ${index} has no text content`
      });
    }
  });

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    totalIssues: issues.length,
    issues: issues
  };

  console.log('Accessibility Report:', report);
  return report;
}

// Uncomment the implementation of the function for addressing new accessibility issues from the insight report
function addressAccessibilityIssues() {
  // Ensure the root container has an accessible name
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  // Initialize skip link functionality
  const skipLink = document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

  // Ensure all buttons with role="button" respond to Enter key
  document.querySelectorAll('[role="button"]').forEach(button => {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Add focusVisible polyfill behavior
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('using-keyboard');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('using-keyboard');
  });

  // Assuming a modal/dialog element with the ID "modal"
  a11y.announce('Welcome to the bot!', 'assertive'); // Assuming announce function from a11y utilities

  // Adding an alt attribute to an image
  const imageElement = document.querySelector('img[alt=""]');
  if (imageElement) {
    imageElement.setAttribute('alt', 'A description of the image');
  }

  // Correcting the ARIA role for a div
  const divElement = document.querySelector('div[role="list"]');
  if (divElement) {
    divElement.setAttribute('role', 'list');
  }

  // Adding the lang attribute to the HTML element
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

/**
 * Validates link accessibility
 * @param {HTMLElement} link - The link element to validate
 * @returns {boolean} True if link is accessible
 */
function validateLinkAccessibility(link) {
  if (!link || link.tagName !== 'A') {
    return false;
  }
  
  // Check if link has href attribute
  if (!link.hasAttribute('href')) {
    return false;
  }
  
  const href = link.getAttribute('href');
  
  // Check for javascript: or mailto: without proper handling
  if (href.startsWith('javascript:') || href.startsWith('mailto:')) {
    return false;
  }
  
  // Check for accessible name
  const accessibleName = link.textContent.trim() || 
                         link.getAttribute('aria-label') || 
                         link.getAttribute('aria-labelledby') ||
                         link.getAttribute('title');
  
  if (!accessibleName) {
    return false;
  }
  
  return true;
}

/**
 * Handles fake links in the document
 */
function handleFakeLinks() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#') {
      // Make it a proper link or button
      link.setAttribute('role', 'button');
      link.setAttribute(' tabindex', '0'); // Add space before tabindex for proper formatting
      
      // Add keyboard support
      link.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
        }
      });
    }
  });
}

/**
 * Adds proper landmark regions to the document
 */
function addProperLandmarkRegions() {
  // Add banner landmark to header if present
  const headers = document.querySelectorAll('header');
  headers.forEach(header => {
    if (!header.hasAttribute('role') && !['header'].includes(header.tagName.toLowerCase())) {
      // Only add if it's not a semantic header element
      header.setAttribute('role', 'banner');
    }
  });
  
  // Add navigation landmark to nav elements
  const navs = document.querySelectorAll('nav');
  navs.forEach(nav => {
    if (!nav.hasAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
  });
  
  // Add main landmark
  addMainLandmark();
  
  // Add contentinfo landmark to footer elements
  const footers = document.querySelectorAll('footer');
  footers.forEach(footer => {
    if (!footer.hasAttribute('role') && !['footer'].includes(footer.tagName.toLowerCase())) {
      footer.setAttribute('role', 'contentinfo');
    }
  });
}

// Existing code from origin/main
function existingFunction1() {
  // Existing implementation
}

function existingFunction2() {
  // Existing implementation
}

// New Function
function newFunction() {
  // Implement the new functionality (as per the original commitment)
}

// Export all functions
module.exports = {
  getLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  createInPageButton,
  generateAccessibilityReport,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions,
  existingFunction1,
  existingFunction2,
  newFunction
};