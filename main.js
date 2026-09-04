// main.js - Screeps game code
// Address accessibility issues from insight report

// Import any required modules
const requiredModule1 = require('required-module-1');
const requiredModule2 = require('required-module-2');
const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');
const accessiblyHelper = require('./accessibly-helper');

// Application configuration
const config = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false
};

/**
 * Updates accessibility labels for interactive elements
 * @param {string} elementId - The ID of the element to update
 * @param {string} label - The accessibility label to set
 */
function updateAriaLabel(elementId, label) {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute('aria-label', label);
        element.setAttribute('role', 'button');
    }
}

/**
 * Enhances user safety messages with proper accessibility attributes
 * @param {string} userSafety - The user safety status message
 * @returns {string} The enhanced message with aria-label
 */
function enhanceSafetyAccessibility(userSafety) {
    const ariaLabel = userSafety.replace(/: /, ': aria-label="').replace(')', '")');
    return ariaLabel;
}

// Helper function
function initialize() {
  console.log('Initializing application...');
  return true;
}

// System Information function
function systemInfo() {
  // Add system information such as OS, browser, etc.
  // ...
  return 'System info not implemented';
}

// Main initialization function
const initializeApp = () => {
  // Main initialization function
  console.log('Application initialized');

  // Ensure the app is accessible
  addressAccessibilityIssues();

  const mainContent = document.querySelector('[role="main"]') || document.querySelector('main');
  if (mainContent) {
    mainContent.setAttribute('aria-label', 'Main content area');
  }

  // Set up keyboard navigation
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
};

// Ensure an element has an id attribute
function ensureElementHasId(element, prefix = 'element') {
  if (!element) return null;

  if (!element.id) {
    const id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    element.id = id;
  }
  return element.id;
}

// Adds an aria-label to an element if it doesn't already have one
function addAriaLabel(element, label) {
  if (!element || !label) return false;

  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
    return true;
  }
  return false;
}

// Renders dependency graphs for visualization
function renderDependencyGraph(container, dependencies = [], options = {}) {
  // ... (Remainder of original renderDependencyGraph function after line 69)
}

// Gets all dependencies as a flat array
function getDependencies(root) {
  // ... (Remainder of original getDependencies function after line 89)
}

// New function to address new accessibility issues
function addressAccessibilityIssues() {
  const accessibilityIssues = [
    // Implement functionality to find and address new accessibility issues...
  ];

  accessibilityIssues.forEach((issue) => {
    issue.action(issue.context);
  });
}

// Accessibility functions
function getLangAttribute(element) {
  return element.getAttribute('lang') || document.documentElement.getAttribute('lang');
}

function addLangAttribute(element, lang) {
  if (lang && !element.getAttribute('lang')) {
    element.setAttribute('lang', lang);
  }
}

function createInPageButton(targetId, text) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView();
    }
  });
  return button;
}

/**
 * Validates table accessibility by checking for proper headers and structure
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with issues array
 */
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) {
    return { valid: false, issues: ['No table element provided'] };
  }

  const headers = table.querySelectorAll('th');
  const hasHeaders = headers.length > 0;
  
  if (!hasHeaders) {
    issues.push('Table missing header cells (th)');
  }

  const rows = table.querySelectorAll('tr');
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0 && rowIndex > 0) {
      issues.push(`Row ${rowIndex} has no cells`);
    }
  });

  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Validates table structure for proper accessibility
 * @param {HTMLTableElement} table - The table to validate
 * @returns {Object} Structure validation result
 */
function validateTableStructure(table) {
  const issues = [];
  
  if (!table) {
    return { valid: false, issues: ['No table provided'] };
  }

  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push('Table should have a caption for context');
  }

  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');
  
  if (!thead) {
    issues.push('Table should have a thead section');
  }
  
  if (!tbody) {
    issues.push('Table should have a tbody section');
  }

  const scopeAttrs = table.querySelectorAll('th[scope]');
  const totalTh = table.querySelectorAll('th').length;
  if (scopeAttrs.length < totalTh && totalTh > 0) {
    issues.push('All header cells should have scope attribute');
  }

  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Gets accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';

  const title = svg.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }

  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const linkedElement = document.getElementById(ariaLabelledby);
    if (linkedElement) {
      return linkedElement.textContent.trim();
    }
  }

  return '';
}

/**
 * Sets accessibility attributes on SVG elements
 * @param {SVGElement} svg - The SVG element to modify
 * @param {string} accessibleName - The accessible name to set
 */
function setSvgAttributes(svg, accessibleName) {
  if (!svg) return;

  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }

  if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }
  }

  let title = svg.querySelector('title');
  if (!title && accessibleName) {
    title = document.createElement('title');
    title.textContent = accessibleName;
    svg.insertBefore(title, svg.firstChild);
  }
}

/**
 * Ensures all landmarks on the page have unique labels
 * @returns {Object} Result with duplicate landmarks info
 */
function ensureUniqueLandmarks() {
  const duplicates = [];
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"], [role="search"]');
  
  const seenLabels = {};
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    const label = landmark.getAttribute('aria-label') || '';
    
    const key = `${role}-${label}`;
    
    if (seenLabels[key]) {
      duplicates.push({
        element: landmark,
        role: role,
        label: label
      });
    } else {
      seenLabels[key] = true;
    }
  });

  return {
    hasDuplicates: duplicates.length > 0,
    duplicates: duplicates
  };
}

/**
 * Validates link accessibility and detects fake links
 * @param {HTMLAnchorElement} link - The link element to validate
 * @returns {Object} Validation result
 */
function validateLinkAccessibility(link) {
  const issues = [];
  
  if (!link) {
    return { valid: false, issues: ['No link provided'] };
  }

  const href = link.getAttribute('href');
  if (!href || href === '#') {
    issues.push('Link appears to be a fake link (no valid href)');
  }

  const text = link.textContent.trim();
  if (!text && !link.getAttribute('aria-label') && !link.getAttribute('aria-labelledby')) {
    issues.push('Link has no accessible name');
  }

  if (link.getAttribute('role') === 'link' && !link.hasAttribute('href')) {
    issues.push('Element with link role is missing href attribute');
  }

  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Handles fake links by converting them to proper buttons or adding href
 * @param {Element} element - The fake link element to handle
 * @returns {Element|null} The corrected element or null
 */
function handleFakeLinks(element) {
  if (!element) return null;

  const tagName = element.tagName.toLowerCase();
  const href = element.getAttribute('href');
  const role = element.getAttribute('role');

  if ((tagName === 'a' && (!href || href === '#' || href === 'javascript:void(0)')) ||
      (role === 'link' && !href)) {
    if (tagName === 'a') {
      element.setAttribute('role', 'button');
      const onclick = element.getAttribute('onclick');
      if (onclick) {
        element.removeAttribute('onclick');
        element.addEventListener('click', () => {
          eval(onclick);
        });
      }
    }
    
    if (!element.textContent.trim() && !element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', 'Button');
    }
  }

  return element;
}

/**
 * Adds proper landmark regions to the page
 * @returns {Array} Array of added/modified landmarks
 */
function addProperLandmarkRegions() {
  const landmarks = [];

  const main = document.querySelector('main, [role="main"]');
  if (main && !main.id) {
    main.id = 'main-content';
    main.setAttribute('aria-label', 'Main content');
    landmarks.push(main);
  }

  const navElements = document.querySelectorAll('nav, [role="navigation"]');
  navElements.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label')) {
      const label = index === 0 ? 'Main navigation' : `Secondary navigation ${index}`;
      nav.setAttribute('aria-label', label);
    }
    landmarks.push(nav);
  });

  const header = document.querySelector('header, [role="banner"]');
  if (header && !header.getAttribute('aria-label')) {
    header.setAttribute('aria-label', 'Site header');
    landmarks.push(header);
  }

  const footer = document.querySelector('footer, [role="contentinfo"]');
  if (footer && !footer.getAttribute('aria-label')) {
    footer.setAttribute('aria-label', 'Site footer');
    landmarks.push(footer);
  }

  const asides = document.querySelectorAll('aside, [role="complementary"]');
  asides.forEach((aside, index) => {
    if (!aside.getAttribute('aria-label')) {
      aside.setAttribute('aria-label', `Complementary content ${index + 1}`);
    }
    landmarks.push(aside);
  });

  return landmarks;
}

/**
 * Applies accessibility improvements to game UI elements
 */
function applyAccessibilityImprovements() {
    const safetyElements = document.querySelectorAll('[data-safety]');
    safetyElements.forEach(element => {
        const safetyValue = element.getAttribute('data-safety');
        if (safetyValue) {
            element.setAttribute('aria-label', 'Safety status: ' + safetyValue);
            element.setAttribute('role', 'status');
        }
    });
    
    const interactiveElements = document.querySelectorAll('.interactive');
    interactiveElements.forEach(element => {
        if (!element.getAttribute('aria-label')) {
            const action = element.getAttribute('data-action') || 'Interact';
            element.setAttribute('aria-label', action + ' button');
        }
    });
}

// Initialize accessibility on game load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', applyAccessibilityImprovements);
}

// Export all functions for use in other modules
module.exports = {
    initialize: initialize,
    initializeApp: initializeApp,
    ensureElementHasId: ensureElementHasId,
    addAriaLabel: addAriaLabel,
    renderDependencyGraph: renderDependencyGraph,
    getDependencies: getDependencies,
    config: config,
    updateAriaLabel: updateAriaLabel,
    enhanceSafetyAccessibility: enhanceSafetyAccessibility,
    applyAccessibilityImprovements: applyAccessibilityImprovements,
    addressAccessibilityIssues: addressAccessibilityIssues,
    getLangAttribute: getLangAttribute,
    addLangAttribute: addLangAttribute,
    createInPageButton: createInPageButton,
    validateTableAccessibility: validateTableAccessibility,
    validateTableStructure: validateTableStructure,
    getSvgAccessibleName: getSvgAccessibleName,
    setSvgAttributes: setSvgAttributes,
    ensureUniqueLandmarks: ensureUniqueLandmarks,
    validateLinkAccessibility: validateLinkAccessibility,
    handleFakeLinks: handleFakeLinks,
    addProperLandmarkRegions: addProperLandmarkRegions
};