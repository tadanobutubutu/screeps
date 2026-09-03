// TODO: This is the existing code that needs to be preserved

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

import { famousFunction } from './famous'; // <-- Add this import here

// TODO: This is where the original commitment added a new function. Keep both changes to preserve the added functionality.

// Existing code
export function existingFunction1() {
  // Existing implementation
}

export function existingFunction2() {
  // Existing implementation
}

// New Function - Define the missing function
export function myNewFamousFunction() {
  // Implement the existing famous function
  return famousFunction();
}

// Function for adding famous to the DOM element
function addFamousToElement(element) {
  // Existing implementation
}

// REACT_015: Add lang attribute to the <html> element
function addLangAttribute(html) {
  if (typeof html !== 'string') return html;
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    if (/\blang=/i.test(match)) return match;
    return `<html${attrs} lang="en">`;
  });
}

// React application code with accessibility features
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';

const root = ReactDOM.createRoot(document.getElementById('root'));

// DOM Elements
const dependencyGraph = document.getElementById('dependencyGraph');

// TODO: This is the existing code that needs to be preserved
//_Commit: 18ddb6408a2b2823efa22f0a77964bb5d6737f93_
//<!-- todo-hash: 6c02eea5ebc55ce1d03924617c86b97c69d7d9d6 -->
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: f8051b788bad4952d8493f08d3c7d22a06ff80d3_ -->
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 94682d0194ff736f18c9f23486aa2eea265b4bc5_
//<!-- todo-hash: c87b573b0860b150bcfdfdff7be68c9f7779afde -->

/**
 * Main entry point for the application
 */
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

function validateTableAccessibility(table) {
  // Check for caption or aria-label
  return !!(table.querySelector('caption') ||
           table.getAttribute('aria-label') ||
           table.getAttribute('aria-labelledby'));
}

function validateTableStructure(table) {
  const hasHeader = !!table.querySelector('thead th');
  const hasBody = !!table.querySelector('tbody td');
  return hasHeader && hasBody;
}

function fixTableStructure(table) {
  if (!validateTableStructure(table)) {
    // Add missing thead if needed
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const headerRow = document.createElement('tr');
        Array.from(firstRow.children).forEach(cell => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
  }
}

function addMainLandmark() {
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }
}

function validateLandmark(landmark) {
  const validRoles = ['main', 'navigation', 'banner', 'contentinfo', 'search', 'complementary', 'form', 'region'];
  const role = landmark.getAttribute('role');
  return validRoles.includes(role);
}

function validateLandmarkAttributes(landmark) {
  const ariaLabel = landmark.getAttribute('aria-label');
  const ariaLabelledBy = landmark.getAttribute('aria-labelledby');
  return !!(ariaLabel || ariaLabelledBy || landmark.textContent.trim());
}

/**
 * Validates landmark structure for accessibility issues
 * @returns {boolean} True if landmark structure is valid
 */
function validateLandmarkStructure() {
  const requiredLandmarks = ['header', 'main', 'footer'];
  const missingLandmarks = [];

  requiredLandmarks.forEach(landmark => {
    if (!document.querySelector(landmark)) {
      missingLandmarks.push(landmark);
    }
  });

  if (missingLandmarks.length > 0) {
    console.warn(`Accessibility warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
    return false;
  }

  return true;
}

function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') ||
         svg.getAttribute('title') ||
         svg.querySelector('title')?.textContent ||
         'SVG graphic';
}

function setSvgAttributes(svg, name) {
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', name);
}

function ensureUniqueLandmarks() {
  const mainLandmarks = document.querySelectorAll('[role="main"], main');
  if (mainLandmarks.length > 1) {
    mainLandmarks.forEach((landmark, index) => {
      if (index > 0) {
        landmark.removeAttribute('role');
      }
    });
  }
}

function createInPageButton() {
  const button = document.createElement('button');
  button.textContent = 'Skip to content';
  button.addEventListener('click', function() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  });
  return button;
}

/**
 * Validates link accessibility
 * @param {HTMLElement} link - The link element to validate
 * @returns {boolean} True if link is accessible
 */
function validateLinkAccessibility(link) {
  const text = link.textContent.trim();
  const ariaLabel = link.getAttribute('aria-label');
  const ariaLabelledBy = link.getAttribute('aria-labelledby');
  return !!(text || ariaLabel || ariaLabelledBy);
}

/**
 * Handles fake links in the document
 */
function handleFakeLinks() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (!validateLinkAccessibility(link)) {
      link.setAttribute('aria-label', 'Link to ' + (link.href || 'unknown destination'));
    }
  });
}

/**
 * Adds proper landmark regions to the document
 */
function addProperLandmarkRegions() {
  // Ensure document has proper landmark structure
  const header = document.querySelector('header');
  if (header && !header.getAttribute('role')) {
    header.setAttribute('role', 'banner');
  }

  const footer = document.querySelector('footer');
  if (footer && !footer.getAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }

  const nav = document.querySelector('nav');
  if (nav && !nav.getAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }
}

function initialize() {
    // Ensure the dependencyGraph container has a proper ARIA role
    if (dependencyGraph) {
        dependencyGraph.setAttribute('role', 'region');
        dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
    }

    // Address accessibility issues
    addressAccessibilityIssues();

    // Create the in-page button
    createInPageButton();

    // Add famous to the DOM element
    addFamousToElement(document.querySelector('.famous-element'));

    // Initialize accessibility features from a11y utilities
    if (a11y && a11y.init) {
        a11y.init();
    }
}

// Accessibility utilities
const accessibilityUtils = {
    // Function for addressing new accessibility issues
    addressNewAccessibilityIssues: function(issues) {
        // Implementation for handling new accessibility issues
        if (!issues || !Array.isArray(issues)) {
            return [];
        }

        return issues.map(issue => {
            return {
                id: issue.id,
                description: issue.description,
                severity: issue.severity,
                status: 'addressed',
                addressedAt: new Date().toISOString()
            };
        });
    },
    // New function to validate landmark elements
    validateLandmark: function() {
      const requiredLandmarks = ['main', 'nav', 'footer'];
      const missingLandmarks = [];

      requiredLandmarks.forEach(landmark => {
        const element = document.querySelector(`[role="${landmark}"]`) ||
                       document.querySelector(`${landmark}`);
        if (!element) {
          missingLandmarks.push(landmark);
        }
      });

      if (missingLandmarks.length > 0) {
        console.warn('Missing required landmarks:', missingLandmarks.join(', '));
        return false;
      }
      return true;
    }
};

// Add the new function to the exports
export { createInPageButton, validateLandmarkStructure, addLangAttribute, fixTableStructure, generateAccessibilityReport, myNewFamousFunction, addFamousToElement, accessibilityUtils };

// Initialize the application with accessibility improvements
initialize();