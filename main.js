// Screeps AI - Main Module

// Importing utilities for formatting and validation
import { formatCurrency, formatDate, calculateDiscount, validateInput } from './utils.js';
import { renderHeader, renderFooter, renderProductCard } from './components.js';
import { state, updateState } from './state.js';

// Internal set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function generateLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.floor(Math.random() * 9000) + 1000;
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} elementId - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(elementId, label) {
    const element = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (element) {
        element.setAttribute('aria-label', label);
    }
}

// Add lang attribute to HTML element
document.documentElement.lang = getLangAttribute();

// Ensure elements have the required IDs
function ensureElementHasId(elementId) {
  const element = document.getElementById(elementId);
  if (element && !element.id) {
    element.setAttribute('id', elementId);
  }
}

// Add ARIA labels for better screen reader support
addAriaLabel('myTable', 'Product data table');
addAriaLabel('myLogo', 'Company logo');
addAriaLabel('accessibilityMenu', 'Accessibility menu');

// DOM-based accessibility code

function getFullLangAttribute() {
  // Implementation for getting full lang attribute
  return 'en-US'; // Example implementation
}

function getLangAttribute() {
  // Implementation for getting lang attribute
  return getFullLangAttribute();
}

function personName() {
  // Existing code...
}

// Validates that landmarks have proper roles and attributes
function validateLandmark() {
    const landmarkSelectors = [
        'header[role="banner"]',
        'nav[role="navigation"]',
        'main[role="main"]',
        'aside[role="complementary"]',
        'footer[role="contentinfo"]'
    ];
    
    const landmarks = document.querySelectorAll(landmarkSelectors.join(', '));
    
    landmarks.forEach(landmark => {
        const role = landmark.getAttribute('role');
        if (!role) {
            console.warn('Landmark missing role attribute:', landmark);
        }
        
        // Check if landmark has an accessible name via aria-label
        const hasAriaLabel = landmark.hasAttribute('aria-label');
        const hasAriaLabelledby = landmark.hasAttribute('aria-labelledby');
        
        if (!hasAriaLabel && !hasAriaLabelledby && landmark.tagName !== 'MAIN') {
            console.warn('Landmark may lack accessible name:', landmark);
        }
    });
    
    return landmarks.length > 0;
}

// Validates the structure of landmarks in the document
function validateLandmarkStructure() {
    const issues = [];
    
    // Check for proper landmark hierarchy
    const header = document.querySelector('header[role="banner"]');
    const main = document.querySelector('main[role="main"]');
    const footer = document.querySelector('footer[role="contentinfo"]');
    
    if (header) {
        // Header should ideally not contain main
        const headerContainsMain = header.querySelector('main, [role="main"]');
        if (headerContainsMain) {
            issues.push('Header should not contain main landmark');
        }
    }
    
    // Check for unique landmark usage
    const navElements = document.querySelectorAll('nav');
    if (navElements.length > 1) {
        navElements.forEach((nav, index) => {
            if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
                issues.push(`Navigation ${index + 1} lacks accessible name`);
            }
        });
    }
    
    return {
        valid: issues.length === 0,
        issues: issues
    };
}

function validateTableAccessibility(table) {
  // Implementation for validating table accessibility
  if (!table) return;
  // Add accessibility checks for table
}

function validateTableStructure(table) {
  // Implementation for validating table structure
  if (!table) return;
  // Add structure validation logic
}

function ensureElementsHaveIds(elements) {
  return Array.from(elements).map((element, index) => {
    if (!element.id) {
      element.id = `element-${index}`;
    }
    return element;
  });
}

// Added function to ensure unique landmarks as mentioned in the issue
function ensureUniqueLandmarks() {
  // Implementation for ensuring unique landmarks
  // Remove duplicate landmarks
  const landmarkSelectors = [
    'header[role="banner"]',
    'nav[role="navigation"]',
    'main[role="main"]',
    'aside[role="complementary"]',
    'footer[role="contentinfo"]'
  ].join(', ');

  const landmarks = document.querySelectorAll(landmarkSelectors);
  const seenRoles = new Map();

  // Logic to handle duplicate landmarks
  // Remove role attributes from non-unique landmarks except the first occurrence
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (role) {
      if (seenRoles.has(role)) {
        // This is a duplicate - remove the role attribute
        landmark.removeAttribute('role');
        
        // Generate a unique ID for the duplicate landmark
        const baseId = `landmark-${role}`;
        landmark.id = generateLandmarkId(baseId);
      } else {
        seenRoles.set(role, landmark);
        
        // Ensure first occurrence has an ID
        if (!landmark.id) {
          landmark.id = generateLandmarkId(`landmark-${role}`);
        }
      }
    }
  });
}

function getSvgAccessibleName(svg) {
  // Existing code...
  if (!svg) return '';
  
  // Check for title element within SVG
  const title = svg.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
  // Check for aria-label attribute
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby reference
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const referencedElement = document.getElementById(ariaLabelledby);
    if (referencedElement) {
      return referencedElement.textContent.trim();
    }
  }
  
  // Generate a name based on context or parent element
  const parent = svg.parentElement;
  if (parent) {
    const parentLabel = parent.getAttribute('aria-label') || parent.id || parent.className;
    if (parentLabel) {
      return `Icon: ${parentLabel}`;
    }
  }
  
  return 'Decorative graphic';
}

function setSvgAttributes(svg, accessibleName) {
  // Implementation for setting SVG attributes
  if (!svg) return;
  // Add accessible name to SVG
  
  // Set role="img" for screen readers
  svg.setAttribute('role', 'img');
  
  // If no aria-label exists, add one
  if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
    svg.setAttribute('aria-label', accessibleName);
  }
  
  // Ensure SVG has a title for programmatic access
  let title = svg.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svg.insertBefore(title, svg.firstChild);
  }
  title.textContent = accessibleName;
  
  // Add focusable attribute for keyboard navigation if needed
  if (svg.getAttribute('tabindex') !== null || svg.onclick !== undefined) {
    svg.setAttribute('focusable', 'true');
  }
}

function createInPageButton() {
  // Implementation for creating in-page button
  const button = document.createElement('button');
  button.setAttribute('aria-label', 'Skip to main content');
  button.textContent = 'Skip to main content';
  button.id = 'skip-to-main';
  button.style.position = 'absolute';
  button.style.top = '-9999px';
  button.style.left = '-9999px';
  
  button.addEventListener('focus', () => {
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.zIndex = '9999';
  });
  
  button.addEventListener('blur', () => {
    button.style.position = 'absolute';
    button.style.top = '-9999px';
    button.style.left = '-9999px';
  });
  
  button.addEventListener('click', () => {
    const main = document.querySelector('main, [role="main"]');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
    }
  });
  
  document.body.insertBefore(button, document.body.firstChild);
  return button;
}

// Added function to create accessible links as mentioned in the issue
function createAccessibleLink(text, href) {
  // Implementation for creating accessible link
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  link.setAttribute('aria-label', text);
  return link;
}

// Added function to handle accessibility issues as mentioned in the issue
function handleAccessibilityIssues() {
  // Implementation for handling all accessibility issues
  // This could coordinate the calling of other accessibility functions
  ensureUniqueLandmarks();
  validateLandmark();
  validateLandmarkStructure();
  // Add other accessibility issue handling as needed
}

// New function to fix accessibility issues as per the insight report
function fixAccessibilityIssues() {
  // New code to fix accessibility issues...
  validateLandmark();
  validateLandmarkStructure();
  ensureUniqueLandmarks();
}

function validateLinkAccessibility() {
  // Implementation for validating link accessibility
}

function handleFakeLinks() {
  // Implementation for handling fake links
  // Find elements that look like links but are not <a> tags
  const fakeLinks = document.querySelectorAll('[role="link"], .fake-link, a伪装');
  
  fakeLinks.forEach(fakeLink => {
    if (fakeLink.tagName !== 'A') {
      // Ensure proper button role if it's clickable
      if (!fakeLink.getAttribute('role')) {
        fakeLink.setAttribute('role', 'button');
      }
      
      // Ensure accessible name exists
      if (!fakeLink.textContent.trim() && !fakeLink.getAttribute('aria-label')) {
        console.warn('Fake link lacks accessible text:', fakeLink);
      }
      
      // Add keyboard support
      fakeLink.setAttribute('tabindex', '0');
    }
  });
}

// Create in-page button with accessibility considerations
createInPageButton();

// Ensure button has an id and appropriate ARIA label
addAriaLabel('accessibilityMenu', 'Accessibility menu');

// Validate table structure and accessibility
// Ensuring all tables in the