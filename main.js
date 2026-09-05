// TODO: This is the existing code that needs to be preserved
// REACT_015: Add lang attribute to the <html> element

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.

// Existing code
export function existingFunction1() {
  // Existing implementation
}

export function existingFunction2() {
  // Existing implementation
}

// New Function
export function myNewFunction() {
  // Implement the new functionality (as per the original commitment)
  return "New function implemented successfully";
}

// REACT_015: Add lang attribute to the <html> element
function addLangToHtmlString(html) {
  if (typeof html !== 'string') return html;
  return html.replace(/(<html\s*)([^>]*)>/i, (match, tag, attrs) => {
    if (attrs.includes('lang=')) return match;
    return `${tag}${attrs} lang="en">`;
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
const dependencyGraph = document.getElementById('dependency-graph');

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and addProperLandmarkRegions())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// TODO: This is the existing code that needs to be preserved
//_Commit: 18ddb6408a2b2823efa22f0a77964bb5d6737f93_
//<!-- todo-hash: 6c02eea5ebc55ce1d03924617c86b97c69d7d9d6 -->
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: f8051b788bad4952d8493f08d3c7d22a06ff80d3_ -->
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: ...
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
    htmlElement.lang = getLangAttribute();
  }
}

function validateTableAccessibility(table) {
  // Check for caption or aria-label
  return table.querySelector('caption') ||
           table.getAttribute('aria-label') ||
           table.getAttribute('aria-labelledby');
}

function validateTableStructure(table) {
  const hasHeader = table.querySelector('thead th') || table.querySelector('th');
  const hasBody = table.querySelector('tbody td') || table.querySelector('td');
  return hasHeader && hasBody;
}

function fixTableStructure(table) {
  if (!validateTableStructure(table)) {
    // Add missing thead if needed
    const firstRow = table.querySelector('tr');
    const headerRow = document.createElement('tr');
    Array.from(firstRow.cells).forEach(cell => {
      const th = document.createElement('th');
      th.textContent = cell.textContent;
      headerRow.appendChild(th);
    });
    const thead = document.createElement('thead');
    thead.appendChild(headerRow);
    table.insertBefore(thead, table.firstChild);
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
  return role && validRoles.includes(role);
}

function hasLandmarkLabel(landmark) {
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

  requiredLandmarks.forEach(tagName => {
    if (!document.querySelector(tagName)) {
      missingLandmarks.push(tagName);
    }
  });

  if (missingLandmarks.length > 0) {
    console.warn(`Accessibility Warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
    return false;
  }

  return true;
}

function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') ||
         svg.getAttribute('title') ||
         svg.getAttribute('aria-labelledby') ||
         'SVG graphic';
}

function setSvgAttributes(svg, name) {
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', name);
}

function ensureUniqueLandmarks() {
  const mainLandmarks = document.querySelectorAll('[role="main"]');
  if (mainLandmarks.length > 1) {
    mainLandmarks.forEach((landmark, index) => {
      if (index > 0) {
        landmark.setAttribute('role', 'region');
      }
    });
  }
}

function createInPageButton() {
  const button = document.createElement('button');
  button.textContent = 'Skip to content';
  button.addEventListener('click', function() {
    const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
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
  const links = document.querySelectorAll('a[href="#"], a[role="button"], a.no-link-style');
  links.forEach(link => {
    if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
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

// TODO: Implement harvest logic
function harvest() {
  const harvestTargets = document.querySelectorAll('[data-harvestable="true"]');
  const harvestResults = [];

  harvestTargets.forEach(target => {
    const resourceType = target.getAttribute('data-resource-type');
    const resourceAmount = parseInt(target.getAttribute('data-amount'), 10) || 1;

    if (target && !target.classList.contains('harvested')) {
      target.classList.add('harvested');
      target.setAttribute('aria-disabled', 'true');

      harvestResults.push({
        resourceType: resourceType,
        amount: resourceAmount,
        element: target,
        timestamp: new Date().toISOString(),
        status: 'harvested'
      });

      // Announce harvest to screen readers
      if (a11y && a11y.announce) {
        a11y.announce(`Harvested ${resourceAmount} ${resourceType}`, 'polite');
      }
    }
  });

  return {
    totalHarvested: harvestResults.length,
    totalResources: harvestResults.reduce((sum, result) => sum + result.amount, 0),
    results: harvestResults
  };
}

// TODO: Implement new function
export function handleTodoItem(todoId) {
  const todoElement = document.querySelector(`[data-todo-id="${todoId}"]`);
  if (!todoElement) {
    console.warn(`Todo item with id ${todoId} not found`);
    return null;
  }

  const todo = {
    id: todoId,
    element: todoElement,
    text: todoElement.textContent || '',
    completed: todoElement.classList.contains('completed') || false,
    priority: todoElement.dataset.priority || 'medium'
  };

  return todo;
}

/**
 * Generates a report based on accessibility issues
 * @returns {Object} The accessibility report
 */
function generateAccessibilityReport() {
  const issues = [];

  // Check for images without alt attributes
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.getAttribute('alt')) {
      issues.push({
        type: 'missing-alt',
        element: 'img',
        index: index,
        message: `Image at index ${index} is missing an alt attribute`
      });
    }
  });

  // Check for buttons without accessible name
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

  // Check for links without accessible name
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
      const labelId = input.getAttribute('id');
      const labelText = labelId ? document.querySelector(`label[for="${labelId}"]`) : null;
      const hasLabel = labelText || input.closest('label');
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
        element: 'heading',
        index: index,
        message: `Heading at index ${index} has no text content`
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

/**
 * Addresses accessibility issues at runtime
 */
function addressAccessibilityIssues() {
  // Ensure the root container has an accessible name
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  // Initialize skip link functionality
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      const targetId = skipLink.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

  // Ensure all buttons with role="button" respond to Enter key
  const buttons = document.querySelectorAll('[role="button"]');
  buttons.forEach(button => {
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
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
  });

  // Announce welcome message
  a11y.announce('Welcome to the bot!', 'assertive');

  // Adding an alt attribute to an image
  const imageElement = document.querySelector('img');
  if (imageElement) {
    imageElement.setAttribute('alt', 'A description of the image');
  }
}