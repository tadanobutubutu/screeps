main.js
const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {};

// Basic utility functions that were previously exported
function calculateSum(a, b) {
  return a + b;
}

function calculateDifference(a, b) {
  return a - b;
}

function calculateProduct(a, b) {
  return a * b;
}

function calculateQuotient(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return a / b;
}

function isEven(num) {
  return num % 2 === 0;
}

function getMax(a, b) {
  return a > b ? a : b;
}

function getMin(a, b) {
  return a < b ? a : b;
}

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';

// Polyfill for Array.prototype.flat (if not available)
if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    configurable: true,
    writable: true,
    value: function depthFlat(depth = 1) {
      return depth > 0
        ? Array.prototype.reduce.call(this, function (acc, val) {
            return acc.concat(Array.isArray(val) ? val.flat(depth - 1) : val);
          }, [])
        : Array.prototype.slice.call(this);
    }
  });
}

// REACT_017: Add landmark roles to fix landmark issues
function getUniqueLandmarkName(baseName, existingNames) {
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

// REACT_025: Ensure unique landmarks function
function validateUniqueLandmarks(container) {
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
        message: `Duplicate landmark name: ${landmarkName}`
      });
    }
    landmarkNames.add(landmarkName);
  });

  return issues;
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleName(svgElement, name) {
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
    console.warn('Invalid SVG element provided');
    return false;
  }
  
  // Create a title element
  const title = document.createElement('title');
  title.id = `svg-title-${Date.now()}`;
  title.textContent = name;
  
  // Create a description element
  const desc = document.createElement('desc');
  desc.id = `svg-desc-${Date.now()}`;
  desc.textContent = `Accessible description for ${name}`;
  
  // Insert title and description into the SVG
  svgElement.insertBefore(title, svgElement.firstChild);
  svgElement.insertBefore(desc, svgElement.firstChild.nextSibling);
  
  // Link the SVG to its title using aria-labelledby
  svgElement.setAttribute('aria-labelledby', `${title.id} ${desc.id}`);
  
  return true;
}

// REACT_036: Validate links
function isValidLink(element) {
  if (!element) return false;
  
  const href = element.getAttribute('href');
  const role = element.getAttribute('role');
  const onClick = element.getAttribute('onclick');
  
  // Check if it's a fake link (has onclick but no href or role="button")
  if (onClick && !href && role !== 'button') {
    return false;
  }
  
  // Check if href is empty or just "#" without button role
  if ((!href || href === '#') && role !== 'button') {
    return false;
  }
  
  return true;
}

// REACT_027: Add scope to table headers (already implemented)
function addScopeToHeaders(table) {
  if (!table || table.tagName.toLowerCase() !== 'table') {
    console.warn('Invalid table element provided');
    return false;
  }
  
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      const parent = th.parentElement;
      if (parent && parent.tagName.toLowerCase() === 'tr') {
        const cells = Array.from(parent.querySelectorAll('th, td'));
        const index = cells.indexOf(th);
        
        if (index === 0) {
          th.setAttribute('scope', 'row');
        } else {
          th.setAttribute('scope', 'col');
        }
      }
    }
  });
  
  return true;
}

// Accessibility announcement function
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('style', 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;');
  
  document.body.appendChild(announcement);
  
  // Use setTimeout to ensure the announcement is made
  setTimeout(() => {
    announcement.textContent = message;
  }, 100);
  
  // Remove after announcement
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement);
    }
  }, 1000);
}

// Enhance keyboard accessibility
function enhanceKeyboardAccessibility(container) {
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  focusableElements.forEach(element => {
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (element.tagName.toLowerCase() !== 'button' && element.tagName.toLowerCase() !== 'a') {
          e.preventDefault();
          element.click();
        }
      }
    });
  });
}

// Trap focus within an element (for modals, etc.)
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });
}

// Setup skip link functionality
function setupSkipLink() {
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = skipLink.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.tabIndex = -1;
        target.focus();
      }
    });
  }
}

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

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

  // REACT_015 & REACT_017: Ensure document has lang attribute and proper landmark structure
  return (
    <div className="app-container">
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  );
}

// Application initialization and state management
function initialize(options = {}) {
  if (isInitialized) {
    logger.warn('App already initialized');
    return false;
  }
  
  config.set(options);
  isInitialized = true;
  logger.info('Application initialized');
  return true;
}

function getAppState() {
  return {
    isInitialized,
    ...appData
  };
}

function setData(key, value) {
  appData[key] = value;
  return appData;
}

function getData(key) {
  return appData[key];
}

function shutdown() {
  isInitialized = false;
  logger.info('Application shutdown complete');
}

// New function from origin
function newFunction() {
  // Implementation of the new function
  console.log('This is the new function.');
}

// Modified function from origin
function modifiedFunction() {
  // Modified implementation of the function
  console.log('This function has been modified.');
}

// Export all functionality
module.exports = {
  // React component
  App,
  
  // Utility functions
  calculateSum,
  calculateDifference,
  calculateProduct,
  calculateQuotient,
  isEven,
  getMax,
  getMin,
  
  // Accessibility functions
  getUniqueLandmarkName,
  validateUniqueLandmarks,
  addSvgAccessibleName,
  isValidLink,
  addScopeToHeaders,
  announceToScreenReader,
  enhanceKeyboardAccessibility,
  trapFocus,
  setupSkipLink,
  
  // App functions
  initialize,
  getAppState,
  setData,
  getData,
  shutdown,
  newFunction,
  modifiedFunction,
  
  // Config and logger
  config,
  logger
};