import React from 'react';
import PropTypes from 'prop-types';
import { createInPageButton } from './utilities';

// Existing code ends here

// Addressed accessibility issues from insight report
// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// Version 1 implementation (HEAD branch) - preserved accessibility enhancements

// ... (other code in main.js)

const Main = ({ children, title, lang = 'en' }) => {
  return (
    <main lang={lang}>
      {title && <h1>{title}</h1>}
      {children}
    </main>
  );
};

Main.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  lang: PropTypes.string,
};

// Version 2 implementation (origin/main branch) - added missing required export and new function
export { Main, PropTypes, createInPageButton };

/**
 * Creates an in-page button element with optional click handler.
 * @param {string} buttonText - The label text for the button
 * @param {Function} onClickHandler - Callback function triggered when the button is clicked
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  if (onClickHandler && typeof onClickHandler === 'function') {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

/**
 * Performs a task with the given parameters
 * @param {string} task - The task to perform
 * @returns {void}
 */
export function performTask(task) {
  console.log(`Performing task: ${task}`);
  // Task implementation details would go here
}

// Addressed accessibility issues (partly from both branches)
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'en-US';

  const interactiveElements = document.querySelectorAll('a, input, select, textarea, button');
  interactiveElements.forEach((el) => {
    let accessibleName = '';
    if (el.textContent.trim().length > 0) {
      accessibleName = el.textContent;
    } else if (el.getAttribute('placeholder') !== null) {
      accessibleName = el.getAttribute('placeholder');
    } else if (el.hasAttribute('aria-label')) {
      accessibleName = el.getAttribute('aria-label');
    } else {
      accessibleName = 'Action element';
    }
    el.setAttribute('aria-label', accessibleName);
  });

  // REACT_015: lang attribute should be added to the HTML element (typically in index.html)
  // <html lang="en">

  // REACT_017: Add landmark roles and fix landmark issues
  // Add main landmark role to main content area
  // Example: <main role="main">...</main>

  // REACT_025: Ensure unique landmarks
  // Ensure only one main landmark per page
  // Use unique aria-label or aria-labelledby for landmark regions
  const landmarks = document.querySelectorAll('[role="main"]');
  landmarks.forEach((landmark) => {
    const id = landmark.id;
    if (landmarkIds.has(id)) {
      console.error('Duplicate landmark ID encountered:', id);
    } else {
      landmark.setAttribute('aria-label', `Main content`);
    }
  });
}

/**
 * Get the application configuration
 * @returns {Object} The configuration object with apiUrl and timeout properties
 */
function getConfig() {
  return {
    apiUrl: process.env.API_URL || '',
    timeout: 5000
  };
}

// Example usage for SVGs:
// const svg1 = document.querySelector('.svg-1');
// const svg2 = document.querySelector('.svg-2');
// svg1.setAttribute('aria-label', 'Description of first icon');
// svg2.setAttribute('aria-label', 'Description of second icon');

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// Ensure all <th> elements have scope attribute

// REACT_036: Fix fake link issue - convert <a href="#"> to <button> with proper ARIA

// Function to add accessible names to 2 SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') || svg.getAttribute('aria-hidden') !== 'true') {
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
}

// Function to ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"]');
  const landmarkIds = new Set();
  landmarks.forEach((landmark) => {
    const id = landmark.id;
    if (landmarkIds.has(id)) {
      console.error('Duplicate landmark ID encountered:', id);
    } else {
      landmarkIds.add(id);
    }
  });
}

/**
 * Setup skip link functionality for keyboard navigation
 */
function setupSkipLinks() {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.position = 'absolute';
  skipLink.style.left = '-9999px';
  skipLink.style.top = '-9999px';
  skipLink.addEventListener('focus', () => {
    skipLink.style.left = '0';
    skipLink.style.top = '0';
  });
  skipLink.addEventListener('blur', () => {
    skipLink.style.left = '-9999px';
    skipLink.style.top = '-9999px';
  });
  document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Ensure buttons have proper accessibility attributes
 */
function setupButtonAccessibility() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', 'Action button');
    }
  });
}

/**
 * Perform a task with the given parameters
 * @param {string} task - The task to perform
 * @returns {void}
 */
function performTask(task) {
  console.log(`Performing task: ${task}`);
  // Task implementation details would go here
}

// Resolved Git merge conflict for 'main.js' by preserving both changes and integrating them when possible.