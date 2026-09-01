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
export const main = {
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
  addLandmarkRolesFn: function () {
    // Navigation landmark
    const navElement = document.querySelector('nav');
    if (navElement && !navElement.getAttribute('role')) {
      navElement.setAttribute('role', 'navigation');
    }

    // Main content landmark
    const mainElement = document.querySelector('main');
    if (mainElement && !mainElement.getAttribute('role')) {
      mainElement.setAttribute('role', 'main');
    }

    // Header landmark (banner)
    const headerElement = document.querySelector('header');
    if (headerElement && !headerElement.getAttribute('role')) {
      headerElement.setAttribute('role', 'banner');
    }

    // Footer landmark (contentinfo)
    const footerElement = document.querySelector('footer');
    if (footerElement && !footerElement.getAttribute('role')) {
      footerElement.setAttribute('role', 'contentinfo');
    }
  },

  /**
   * Ensures that landmarks are unique by adding unique ARIA labels where necessary.
   *
   * This addresses the REACT_025 issue by checking for duplicate landmarks
   * and making them unique with appropriate aria-label or aria-labelledby attributes.
   */
  ensureUniqueLandmarkElements: function () {
    // Navigation landmark uniqueness
    const navElements = document.querySelectorAll('[role="navigation"]');
    if (navElements.length > 1) {
      navElements.forEach((nav, index) => {
        if (index > 0) {
          nav.setAttribute('aria-label', `Navigation ${index + 1}`);
        }
      });
    }

    // Main content landmark uniqueness
    const mainElements = document.querySelectorAll('[role="main"]');
    if (mainElements.length > 1) {
      mainElements.forEach((main, index) => {
        if (index > 0) {
          main.setAttribute('aria-label', `Main content ${index + 1}`);
        }
      });
    }
  },

  ... // Add any other exports from main as needed
};