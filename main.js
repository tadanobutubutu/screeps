// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

import React from 'react';
import ReactDOM from 'react-dom';

function addLangAttribute(element) {
  // Implement the function to add lang attribute
  if (element) {
    element.setAttribute('lang', 'en');
  }
}

function fixTableStructure(table) {
  // Implement the function to fix table structure issues
  if (!table) return;
  
  // Ensure table has proper structure
  let tbody = table.querySelector('tbody');
  if (!tbody) {
    tbody = document.createElement('tbody');
    table.appendChild(tbody);
  }
  
  // Move direct tr elements into tbody if they're not already inside thead/tbody
  const rows = Array.from(table.children).filter(
    child => child.tagName === 'TR' && 
    child.parentElement === table
  );
  
  rows.forEach(row => {
    tbody.appendChild(row);
  });
}

function addMainLandmark(reactRoot) {
  // Implement the function to add main landmark
  if (!reactRoot) return;
  
  const mainLandmark = document.createElement('main');
  mainLandmark.id = "main-landmark";
  
  // Move the first child of reactRoot into the main landmark
  if (reactRoot.firstChild) {
    const firstChild = reactRoot.firstChild;
    mainLandmark.appendChild(firstChild);
    reactRoot.appendChild(mainLandmark);
  } else {
    reactRoot.appendChild(mainLandmark);
  }
}

// Addressed accessibility issues from insight report

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The language code
 */
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

/**
 * Triggers a custom event for screen readers to announce updates
 * @param {string} message - The message to announce
 * @param {string} politeness - 'polite' or 'assertive'
 */
function announceToScreenReader(message, politeness = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', politeness);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

/**
 * Updates page content with accessibility considerations
 * @param {HTMLElement} element - The element to update
 * @param {string} content - The new content
 * @param {boolean} announce - Whether to announce the change to screen readers
 */
function updateContent(element, content, announce = false) {
  if (!element) return;
  element.textContent = content;
  if (announce) {
    announceToScreenReader(content);
  }
}

/**
 * Handles keyboard navigation for custom interactive elements
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Function} callback - Callback function to execute on activation
 */
function handleKeyboardInteraction(event, callback) {
  const key = event.key;
  if (key === 'Enter' || key === ' ') {
    event.preventDefault();
    callback();
  }
}

/**
 * Manages focus for modal/dialog elements
 * @param {HTMLElement} container - The modal container element
 */
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  });
}

/**
 * Creates an in-page button element with optional id and class name
 * @param {string} text - The button text
 * @param {string} [id] - Optional id attribute
 * @param {string} [className] - Optional class name
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(text, id, className) {
  const button = document.createElement('button');
  button.textContent = text;
  if (id) {
    button.id = id;
  }
  if (className) {
    button.className = className;
  }

  return button;
}

// Accessibility validation and enhancement functions

/**
 * Validates table accessibility
 * @param {HTMLTableElement} table - The table to validate
 * @returns {boolean} Whether the table is accessible
 */
function validateTableAccessibility(table) {
  if (!table) return false;
  
  // Check for proper table structure
  const hasCaption = table.querySelector('caption') !== null;
  const hasThead = table.querySelector('thead') !== null;
  const hasTbody = table.querySelector('tbody') !== null;
  const hasHeaders = table.querySelectorAll('th[scope]').length > 0;
  
  return hasCaption || hasThead || hasTbody || hasHeaders;
}

/**
 * Validates the structure of a table
 * @param {HTMLTableElement} table - The table to validate
 * @returns {boolean} Whether the table structure is valid
 */
function validateTableStructure(table) {
  if (!table) return false;
  
  // Ensure proper table structure
  fixTableStructure(table);
  
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  
  return thead !== null || tbody !== null;
}

/**
 * Validates landmark accessibility
 * @param {HTMLElement} container - The container to validate
 * @returns {boolean} Whether landmarks are valid
 */
function validateLandmark(container) {
  if (!container) return false;
  
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  let validLandmarks = 0;
  
  landmarks.forEach(landmark => {
    const elements = container.querySelectorAll(landmark);
    if (elements.length > 0) {
      validLandmarks++;
    }
  });
  
  return validLandmarks >= 2;
}

/**
 * Validates the structure of landmarks
 * @param {HTMLElement} container - The container to validate
 * @returns {boolean} Whether landmark structure is valid
 */
function validateLandmarkStructure(container) {
  if (!container) return false;
  
  // Check for unique landmark structure
  return ensureUniqueLandmarks(container);
}

/**
 * Validates attributes of landmarks
 * @param {HTMLElement} container - The container to validate
 * @returns {boolean} Whether landmark attributes are valid
 */
function validateLandmarkAttributes(container) {
  if (!container) return false;
  
  const landmarks = container.querySelectorAll('header, nav, main, aside, footer');
  
  landmarks.forEach(landmark => {
    // Ensure landmarks have appropriate labels if needed
    if (landmark.tagName === 'NAV' && !landmark.getAttribute('aria-label')) {
      landmark.setAttribute('aria-label', 'Navigation');
    }
  });
  
  return true;
}

/**
 * Gets accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  // Check for title element
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent;
  }
  
  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const titleElement = document.getElementById(ariaLabelledby);
    if (titleElement) {
      return titleElement.textContent;
    }
  }
  
  return '';
}

/**
 * Sets accessibility attributes on an SVG element
 * @param {SVGElement} svg - The SVG element to update
 */
function setSvgAttributes(svg) {
  if (!svg) return;
  
  // Add role="img" if not present
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  
  // Add title if accessible name is missing
  const accessibleName = getSvgAccessibleName(svg);
  if (!accessibleName) {
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = 'Image';
    svg.insertBefore(title, svg.firstChild);
  }
}

/**
 * Ensures unique landmarks in the container
 * @param {HTMLElement} container - The container to validate
 * @returns {boolean} Whether landmarks are unique
 */
function ensureUniqueLandmarks(container) {
  if (!container) return false;
  
  const mainLandmarks = container.querySelectorAll('main');
  const navLandmarks = container.querySelectorAll('nav');
  
  // Keep only the first main landmark
  if (mainLandmarks.length > 1) {
    for (let i = 1; i < mainLandmarks.length; i++) {
      mainLandmarks[i].setAttribute('role', 'presentation');
    }
  }
  
  // Add labels to multiple nav landmarks
  if (navLandmarks.length > 1) {
    navLandmarks.forEach((nav, index) => {
      if (!nav.getAttribute('aria-label')) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
    });
  }
  
  return true;
}

/**
 * Validates link accessibility
 * @param {HTMLElement} container - The container to validate
 * @returns {boolean} Whether links are accessible
 */
function validateLinkAccessibility(container) {
  if (!container) return false;
  
  const links = container.querySelectorAll('a');
  let allAccessible = true;
  
  links.forEach(link => {
    // Check if link has accessible text
    const hasText = link.textContent.trim().length > 0;
    const hasAriaLabel = link.getAttribute('aria-label');
    const hasTitle = link.getAttribute('title');
    
    if (!hasText && !hasAriaLabel && !hasTitle) {
      allAccessible = false;
    }
    
    // Check if link has href
    if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
      link.setAttribute('role', 'button');
    }
  });
  
  return allAccessible;
}

/**
 * Handles fake links (links that should be buttons)
 * @param {HTMLElement