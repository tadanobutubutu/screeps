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
function uniqueLandmarkId(baseName) {
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
document.documentElement.setAttribute('lang', getLangAttribute());

// Ensure elements have the required IDs
function ensureElementHasId(elementId) {
  const element = document.getElementById(elementId);
  if (element && !element.id) {
    element.setAttribute('id', elementId);
  }
}

// Helper function to make header focusable for keyboard navigation
function makeHeaderFocusable() {
  const header = document.querySelector('header');
  if (header) {
    header.setAttribute('tabindex', '0');
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        header.focus();
      }
    });
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

function validateLandmark() {
  // Existing code...
}

function validateLandmarkStructure() {
  // Existing code...
}

function validateTableAccessibility(table) {
  // Implementation for validating table accessibility
  if (!table) return;
  // Add accessibility checks for table
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      // Determine if th is a column header or row header
      const row = th.parentElement;
      if (row && row.cells && row.cells[0] === th) {
        th.setAttribute('scope', 'row');
      } else {
        th.setAttribute('scope', 'col');
      }
    }
  });
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
  const landmarks = document.querySelectorAll(
    'header[role="banner"]',
    'nav[role="navigation"]',
    'main[role="main"]'
  );

  const seenLandmarks = new Set();
  landmarks.forEach((landmark) => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || '';
    const key = `${tagName}-${role}`;
    
    if (seenLandmarks.has(key)) {
      // Remove role attribute from duplicate landmarks
      landmark.removeAttribute('role');
    } else {
      seenLandmarks.add(key);
    }
  });
}

function getSvgAccessibleName(svg) {
  // Get accessible name for SVG based on context or title
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
  
  // Check for adjacent text that describes the SVG
  const parent = svg.parentElement;
  if (parent) {
    const textContent = parent.textContent;
    if (textContent.trim()) {
      return textContent.trim();
    }
  }
  
  return 'Decorative image';
}

function setSvgAttributes(svg, accessibleName) {
  // Implementation for setting SVG attributes
  if (!svg) return;
  // Add accessible name to SVG
  if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
    svg.setAttribute('aria-label', accessibleName);
  }
}

function createInPageButton() {
  // Implementation for creating in-page button
  const button = document.createElement('button');
  button.setAttribute('aria-label', 'Skip to main content');
  button.textContent = 'Skip to main content';
  button.className = 'skip-link';
  button.style.position = 'absolute';
  button.style.top = '-40px';
  button.style.left = '0';
  button.style.background = '#000';
  button.style.color = '#fff';
  button.style.padding = '8px';
  button.style.zIndex = '10000';
  
  button.addEventListener('focus', () => {
    button.style.top = '0';
  });
  
  button.addEventListener('blur', () => {
    button.style.top = '-40px';
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
  // Add other accessibility issue handling as needed
}

// New function to fix accessibility issues as per the insight report
function fixAccessibilityIssues() {
  // New code to fix accessibility issues...
  ensureUniqueLandmarks();
  fixFakeLinkIssues();
}

function validateLinkAccessibility() {
  // Implementation for validating link accessibility
  const links = document.querySelectorAll('a');
  const results = [];
  
  links.forEach((link, index) => {
    const hasText = link.textContent.trim().length > 0;
    const hasAriaLabel = link.hasAttribute('aria-label');
    const hasTitle = link.hasAttribute('title');
    
    results.push({
      index,
      href: link.getAttribute('href'),
      text: link.textContent,
      accessible: hasText || hasAriaLabel || hasTitle
    });
  });
  
  return results;
}

function handleFakeLinks() {
  // Implementation for handling fake links (elements styled as links but not using <a> tag)
  const fakeLinks = document.querySelectorAll('[role="link"], .fake-link');
  
  fakeLinks.forEach((element) => {
    const tagName = element.tagName.toLowerCase();
    
    // If it's not an anchor but has role="link", convert it properly
    if (tagName !== 'a' && element.getAttribute('role') === 'link') {
      // Ensure it has proper keyboard navigation
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
      
      // Add click handler for keyboard users
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    }
  });
}

// Create in-page button with accessibility considerations
createInPageButton();

// Ensure button has an id and appropriate ARIA label
const myButton = document.getElementById('myButton');
const myIcon = document.getElementById('myIcon');

if (myButton) {
  addAriaLabel(myButton, 'My Button');
}

if (myIcon) {
  addAriaLabel(myIcon, 'My Icon');
}

// Validate table structure and accessibility
// Ensuring all tables in the document are accessible
const tables = document.querySelectorAll('table');
tables.forEach(table => {
  validateTableAccessibility(table);
  validateTableStructure(table);
});

// New function to address REACT_036: Fix 1 fake link issue
function fixFakeLinkIssues() {
    // Fix fake link issues
    const buttonsStyledAsLinks = document.querySelectorAll('button.link-style, [role="link"]');
    
    buttonsStyledAsLinks.forEach((element) => {
      // Check if it should be a link
      const href = element.getAttribute('data-href');
      if (href) {
        // Convert to proper anchor element
        const link = document.createElement('a');
        link.href = href;
        link.textContent = element.textContent;
        link.className = element.className;
        
        // Copy ARIA attributes
        const ariaLabel = element.getAttribute('aria-label');
        if (ariaLabel) {
          link.setAttribute('aria-label', ariaLabel);
        }
        
        // Replace the element
        element.parentNode.replaceChild(link, element);
      } else {
        // Ensure proper button role
        if (element.getAttribute('role') !== 'button') {
          element.setAttribute('role', 'button');
        }
        
        // Ensure keyboard accessibility
        if (!element.hasAttribute('tabindex')) {
          element.setAttribute('tabindex', '0');
        }
      }
    });
}

// Google sign-in accessibility
// Ensuring Google sign-in button has proper accessible name and role
function googleSignIn() {
  const googleButton = document.querySelector('.google-sign-in, [data-provider="google"]');
  if (googleButton) {
    googleButton.setAttribute('aria-label', 'Sign in with Google');
    googleButton.setAttribute('role', 'button');
  }
}

// Add lang attribute to HTML element
document.documentElement.setAttribute('lang', getLangAttribute());

// Add/fix landmark issues
validateLandmark();
validateLandmarkStructure();
ensureUniqueLandmarks();

// Add accessible names to SVGs
const svgs = document.querySelectorAll('svg');
svgs.forEach(svg => {
  const accessibleName = getSvgAccessibleName(svg);
  setSvgAttributes(svg, accessibleName);
});

// Validate link accessibility
validateLinkAccessibility();
handleFakeLinks();

// Fix button identifiers
// Ensuring all buttons have proper accessible identifiers
document.addEventListener('DOMContentLoaded', () => {