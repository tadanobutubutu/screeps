import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';

/**
 * Main JavaScript file
 * Implements accessibility improvements
 */

// Initial setup
const appElement = document.getElementById('root');

// Improve accessibility
appElement.setAttribute('role', 'main');
appElement.setAttribute('aria-label', 'Main application');

/**
 * Accessibility Helper Functions
 * Provides utilities for creating accessible web applications
 */

/**
 * Manages focus for accessibility
 * @param {HTMLElement} element - The element to focus
 * @param {Object} options - Focus options
 */
function manageFocus(element, options = {}) {
  if (!element) return;
  
  const focusOptions = {
    preventScroll: options.preventScroll || false,
    focusVisible: options.focusVisible || true
  };
  
  element.focus(focusOptions);
  
  if (focusOptions.focusVisible) {
    element.classList.add('focus-visible');
  }
}

/**
 * Handles keyboard navigation
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Object} config - Navigation configuration
 */
function handleKeyboardNavigation(event, config = {}) {
  const key = event.key;
  const expectedKeys = config.keys || ['ArrowUp', 'ArrowDown', 'Enter', 'Escape'];
  
  if (expectedKeys.includes(key)) {
    event.preventDefault();
    
    if (config.onKeyDown && typeof config.onKeyDown === 'function') {
      config.onKeyDown(key, event);
    }
  }
}

/**
 * Manages ARIA attributes
 * @param {HTMLElement} element - The element to update
 * @param {Object} attributes - ARIA attributes to set
 */
function setAriaAttributes(element, attributes) {
  if (!element) return;
  
  Object.entries(attributes).forEach(([key, value]) => {
    const attrName = key.startsWith('aria-') ? key : `aria-${key}`;
    element.setAttribute(attrName, value);
  });
}

/**
 * Creates a live region for screen reader announcements
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.textContent = message;
  announcement.style.position = 'absolute';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.padding = '0';
  announcement.style.margin = '-1px';
  announcement.style.overflow = 'hidden';
  announcement.style.clip = 'rect(0, 0, 0, 0)';
  announcement.style.whiteSpace = 'nowrap';
  announcement.style.border = '0';
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Traps focus within an element (for modals/dialogs)
 * @param {HTMLElement} container - The container element
 * @returns {Function} Cleanup function to remove trap
 */
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  function handleTab(event) {
    if (event.key !== 'Tab') return;
    
    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        event.preventDefault();
      }
    }
  }
  
  container.addEventListener('keydown', handleTab);
  firstFocusable?.focus();
  
  return () => {
    container.removeEventListener('keydown', handleTab);
  };
}

/**
 * Removes focus trap
 * @param {HTMLElement} container - The container element
 */
function removeFocusTrap(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
}

/**
 * Validates form accessibility
 * @param {HTMLFormElement} form - The form to validate
 * @returns {Object} Validation result
 */
function validateFormAccessibility(form) {
  const result = { valid: true, errors: [] };
  const inputs = form.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    const label = form.querySelector(`label[for="${input.id}"]`) || 
                  input.closest('label');
    
    if (!label && !input.getAttribute('aria-label') && 
        !input.getAttribute('aria-labelledby')) {
      result.valid = false;
      result.errors.push({
        element: input,
        message: `Input ${input.id || input.name} is missing a label`
      });
    }
    
    if (input.required && !input.getAttribute('aria-required')) {
      input.setAttribute('aria-required', 'true');
    }
  });
  
  return result;
}

/**
 * Handles skip link functionality
 */
function initSkipLink() {
  const skipLink = document.querySelector('[href^="#"]');
  
  if (skipLink) {
    skipLink.addEventListener('click', (event) => {
      const targetId = skipLink.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        event.preventDefault();
        target.tabIndex = -1;
        target.focus();
        target.scrollIntoView();
      }
    });
  }
}

function function3() {
  // TODO: Implement new function3 logic here
}

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', 'en');
    fetchData();
  }, []);

  // REACT_017: Add landmark roles to fix landmark issues
  // REACT_025: Ensure unique landmarks
  // REACT_036: Fix fake link issues
  // REACT_041: Add accessible names to SVGs

  // REACT_015 & REACT_017: Ensure document has lang attribute and proper landmark structure
  return (
    <div className="app-container">
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  );
}

export function getUniqueLandmarkName(baseName, existingNames) {
  if (!existingNames.includes(baseName)) {
    return baseName;
  }
  let counter = 2;
  let newName = `${baseName}-${counter}`;
  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName}-${counter}`;
  }
  return newName;
}

export function validateUniqueLandmarks(container) {
  const landmarks = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
  const landmarkNames = new Set();
  const issues = [];

  landmarks.forEach((landmark) => {
    const ariaLabel = landmark.getAttribute('aria-label');
    const ariaLabelledby = landmark.getAttribute('aria-labelledby');
    const tagName = landmark.tagName.toLowerCase();

    // Determine the landmark name
    let landmarkName = ariaLabel || ariaLabelledby || tagName;

    if (landmarkNames.has(landmarkName)) {
      issues.push({
        element: landmark,
        message: `Duplicate landmark found: "${landmarkName}". Use unique aria-label or aria-labelledby.`,
        severity: 'warning'
      });
    } else {
      landmarkNames.add(landmarkName);
    }
  });

  return issues;
}

export function addSvgAccessibleName(svgElement, accessibleName) {
  if (!svgElement) return;

  // Add title element as first child
  const title = document.createElement('title');
  title.id = `svg-title-${Date.now()}`;
  title.textContent = accessibleName;

  // Insert title as first child
  svgElement.insertBefore(title, svgElement.firstChild);

  // Add aria-labelledby attribute
  svgElement.setAttribute('aria-labelledby', title.id);
}

export function isValidLink(element) {
  // ... existing code ...
}

export function addScopeToHeaders(tableElement) {
  // ... existing code ...
}

function addressAccessibilityIssues(insightReport) {
  insightReport.forEach(issue => {
    console.log(`Addressing issue: ${issue.issue}`);
    // TODO: Implement solution to the issue
    console.log(`Solution: ${issue.solution}`);
    // ... code to apply the solution ...
  });
}

export function myFunction() {
  // Your code for the new function goes here
}

function newFunction() {
  // implementation of new function
}

// <!--- END ADDITIONAL FUNCTION --->
// <!--- START MODIFIED FUNCTION --->
function modifiedFunction() {
  // Modified implementation of the function
  console.log('This function has been modified.');
}

// <!--- END MODIFIED FUNCTION --->
//_Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: 9e14a7a8fdfef810dc7b463726556b30dceadb72 -->
// <!--- Any other modifications or additions go here --->

export {
  manageFocus,
  handleKeyboardNavigation,
  setAriaAttributes,
  announceToScreenReader,
  trapFocus,
  removeFocusTrap,
  validateFormAccessibility,
  initSkipLink,
  function3,
  App,
  getUniqueLandmarkName,
  validateUniqueLandmarks,
  addSvgAccessibleName,
  isValidLink,
  addScopeToHeaders,
  addressAccessibilityIssues,
  myFunction,
  newFunction
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    manageFocus,
    handleKeyboardNavigation,
    setAriaAttributes,
    announceToScreenReader,
    trapFocus,
    removeFocusTrap,
    validateFormAccessibility,
    initSkipLink,
    function3,
    App,
    getUniqueLandmarkName,
    validateUniqueLandmarks,
    addSvgAccessibleName,
    isValidLink,
    addScopeToHeaders,
    addressAccessibilityIssues,
    myFunction,
    newFunction
  };
}

// Render the app
const root = createRoot(appElement);
root.render(<App />);