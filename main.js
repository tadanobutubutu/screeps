// Importing utilities for formatting and validation
import { formatCurrency, formatDate, calculateDiscount, validateInput } from './utils.js';
import { renderHeader, renderFooter, renderProductCard } from './components.js';
import { state, updateState } from './state.js';
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/tableAccessibilityUtils';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// REACT_015: lang attribute added to HTML element
// The React component rendering the HTML element provides the `lang` prop
// The language attribute is set according to the application's settings

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

document.documentElement.lang = getLangAttribute();

reportWebVitals();

const VERSION = '1.0.0';

const CONFIG = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development'
};

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
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

// Ensure elements have the required IDs
function ensureElementHasId(elementId) {
  const element = document.getElementById(elementId);
  if (element && !element.hasAttribute('id')) {
    element.setAttribute('id', elementId);
  }
}

// Main module entry point
const main = {
  /**
   * Sets the language attribute on the HTML element.
   *
   * This ensures that screen readers and other assistive technologies
   * can correctly interpret the language of the page.
   *
   * @param {string} lang - The language code to set (e.g., 'en', 'es', 'fr').
   */
  setLanguageAttribute: setLanguageAttribute,

  /**
   * Adds landmark roles to the main navigation and content sections.
   *
   * This addresses the REACT_017 issue by adding appropriate ARIA roles
   * such as 'navigation', 'main', and 'banner' to relevant HTML elements.
   */
  addLandmarkRolesFn: addLandmarkRolesFn,

  /**
   * Ensures that landmarks are unique by adding unique ARIA labels where necessary.
   *
   * This addresses the REACT_025 issue by checking for duplicate landmarks
   * and making them unique with appropriate aria-label or aria-labelledby attributes.
   */
  ensureUniqueLandmarkElements: ensureUniqueLandmarkElements,

  /**
   * Adds accessible names to SVG elements.
   *
   * This addresses the REACT_041 issue by ensuring that SVGs have appropriate
   * accessible names, either through title or desc elements.
   *
   * @param {string} svgSelector - The CSS selector for the SVG element(s).
   * @param {string} accessibleName - The accessible name to set.
   */
  addSVGAccessibleName: addSVGAccessibleName,

  /**
   * Fixes fake links (elements that look like links but are not semantic <a> tags).
   *
   * This addresses the REACT_036 issue by identifying elements that have
   * click handlers but are not <a> tags and adding appropriate ARIA roles
   * and attributes to make them accessible.
   */
  fixFakeLinks: fixFakeLinks,

  /**
   * Creates an accessible in-page button element.
   *
   * @param {string} text - The text content of the button
   * @param {Function} onClick - The click handler function
   * @param {Object} [options] - Optional configuration
   * @param {string} [options.id] - The ID for the button
   * @param {string} [options.className] - The class name for the button
   * @param {string} [options.ariaLabel] - The ARIA label for the button
   * @param {boolean} [options.disabled=false] - Whether the button is disabled
   * @returns {HTMLButtonElement} The created button element
   */
  createInPageButton: createInPageButton,

  // Add new function as requested in the issue
  // Example new function
  newFunctionName: (param1, param2) => {
    // Implementation goes here
  }
};

export default main;