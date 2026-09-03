// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)
// TODO: This is the existing code that needs to be preserved
// (This should be preserved)
// Addressed accessibility issues from insight report

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.

/**
 * Accessibility functions to be implemented here
 */

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
  // Check if lang attribute already exists on HTML element
  const htmlElement = document.documentElement;
  if (htmlElement && htmlElement.lang) {
    return htmlElement.lang;
  }
  // Return default 'en' as fallback
  return 'en';
}

// Function to handle fake links
function handleFakeLinks() {
  // Find all links that look like buttons (elements with role="button" or certain classes)
  const fakeLinks = document.querySelectorAll('[role="button"], a[href="#"], a[href="javascript:void(0)"], a[href=""]');
  
  fakeLinks.forEach(link => {
    // Check if it's actually an anchor tag (fake link)
    if (link.tagName === 'A' && !link.href.includes('#') || link.getAttribute('href') === '#' || link.getAttribute('href') === 'javascript:void(0)') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        console.warn('Fake link prevented:', link);
      });
    }
  });
}

// Function to validate link accessibility
function validateLinkAccessibility(link) {
  if (!link) return false;
  const text = link.textContent.trim();
  const ariaLabel = link.getAttribute('aria-label');
  const ariaLabelledBy = link.getAttribute('aria-labelledby');
  return !!(text || ariaLabel || ariaLabelledBy);
}

// Function to validate landmark structure for accessibility issues
function validateLandmarkStructure() {
  const requiredLandmarks = ['header', 'main', 'footer'];
  const missingLandmarks = [];
  
  requiredLandmarks.forEach(landmark => {
    const element = document.querySelector(`${landmark}, [role="${landmark === 'header' ? 'banner' : landmark === 'footer' ? 'contentinfo' : landmark}"]`);
    if (!element) {
      missingLandmarks.push(landmark);
    }
  });
  
  return missingLandmarks;
}

/**
 * Adds lang attribute to HTML element
 */
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    const lang = getLangAttribute();
    htmlElement.setAttribute('lang', lang);
  }
}

/**
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
function validateTableAccessibility(table) {
  if (!table) return false;
  
  // Check for caption or aria-label
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.hasAttribute('aria-label');
  const hasAriaLabelledBy = table.hasAttribute('aria-labelledby');
  
  return !!(hasCaption || hasAriaLabel || hasAriaLabelledBy);
}

/**
 * Validates table structure
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table structure is valid
 */
function validateTableStructure(table) {
  if (!table) return false;
  
  const hasHeader = table.querySelector('th');
  const hasRows = table.querySelectorAll('tr').length > 0;
  
  return !!(hasHeader && hasRows);
}

/**
 * Fixes table structure issues
 * @param {HTMLElement} table - The table element to fix
 */
function fixTableStructure(table) {
  if (!table) return;
  
  // Ensure table has proper headers
  const firstRow = table.querySelector('tr');
  if (firstRow) {
    const cells = firstRow.querySelectorAll('td');
    cells.forEach(cell => {
      const newCell = document.createElement('th');
      newCell.textContent = cell.textContent;
      newCell.setAttribute('scope', 'col');
      cell.parentNode.replaceChild(newCell, cell);
    });
  }
}

/**
 * Adds main landmark to the document
 */
function addMainLandmark() {
  const mainContent = document.querySelector('main') || document.querySelector('[role="main"]') || document.querySelector('#main-content');
  if (mainContent && !mainContent.hasAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }
}

/**
 * Validates landmark
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark is valid
 */
function validateLandmark(landmark) {
  if (!landmark) return false;
  
  const validRoles = ['header', 'main', 'footer', 'navigation', 'search', 'banner', 'complementary', 'contentinfo'];
  const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
  
  return validRoles.includes(role);
}

/**
 * Validates landmark structure
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark structure is valid
 */
function validateLandmarkStructure(landmark) {
  if (!landmark) return false;
  
  // Check if landmark has proper nesting and structure
  const hasContent = landmark.children.length > 0 || landmark.textContent.trim().length > 0;
  return hasContent;
}

/**
 * Validates landmark attributes
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark attributes are valid
 */
function validateLandmarkAttributes(landmark) {
  if (!landmark) return false;
  
  const role = landmark.getAttribute('role');
  const ariaLabel = landmark.getAttribute('aria-label');
  const ariaLabelledBy = landmark.getAttribute('aria-labelledby');
  
  // Landmark should have either a role, aria-label, or aria-labelledby
  return !!(role || ariaLabel || ariaLabelledBy);
}

/**
 * Gets accessible name for SVG
 * @param {HTMLElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  const ariaLabel = svg.getAttribute('aria-label');
  const title = svg.querySelector('title');
  const desc = svg.querySelector('desc');
  
  return ariaLabel || (title ? title.textContent : '') || (desc ? desc.textContent : '') || '';
}

/**
 * Sets SVG attributes for accessibility
 * @param {HTMLElement} svg - The SVG element
 * @param {string} name - The accessible name
 */
function setSvgAttributes(svg, name) {
  if (!svg || !name) return;
  
  svg.setAttribute('aria-label', name);
  svg.setAttribute('role', 'img');
}

/**
 * Ensures unique landmarks in the document
 */
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], main');
  if (landmarks.length > 1) {
    landmarks.forEach((landmark, index) => {
      if (index > 0) {
        landmark.removeAttribute('role');
        landmark.removeAttribute('aria-label');
      }
    });
  }
}

/**
 * Creates an in-page button
 * @returns {HTMLElement} The created button
 */
function createInPageButton() {
  const button = document.createElement('button');
  button.textContent = 'Skip to content';
  button.setAttribute('aria-label', 'Skip to main content');
  button.setAttribute('id', 'skip-link');
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
      const labelText = document.querySelector(`label[for="${input.id}"]`);
      const hasLabel = labelId || labelText;
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
        message: `Heading ${heading.tagName.toLowerCase()} at index ${index} has no text content`
      });
    }
  });

  // Generate report
  const report = {
    timestamp: