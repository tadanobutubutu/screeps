import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities'; // Assuming accessibility utilities are in a separate file

import ReactA11y from '@react-aria/a11y';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook } from './bookFunctions';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { isSecureContext } from './utils.js';
import fs from 'fs';
import path from 'path';
import axe from 'axe-core';
import { IconContext } from 'react-icons';
import { BsBootstrap, MdAccessible, MdAddBox } from 'react-icons/all';

import AccessibilityUtils from './AccessibilityUtils';
import Utils from './Utils';
import baseFunctions from './baseFunctions';

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// REACT_015: Add lang attribute
// REACT_027: Fix 26 table structure issues
// REACT_017: Add/fix 4 landmark issues
// REACT_041: Add accessible names to 2 SVGs
// REACT_025: Ensure unique landmarks (2 issues) — (DONE: ensureUniqueLandmarks)
// REACT_036: Fix 1 fake link issue

const root = ReactDOM.createRoot(document.getElementById('root'));

// Wrap primary content in main element for accessibility
const primaryContent = document.querySelector('.primary-content') ||
                        document.querySelector('[role="main"]') ||
                        document.getElementById('main-content') ||
                        document.querySelector('#content');

function wrapPrimaryContentInMain() {
  if (primaryContent && !primaryContent.closest('main')) {
    const mainElement = document.createElement('main');

    if (primaryContent.parentNode) {
      primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    } else {
      document.body.appendChild(mainElement);
    }

    mainElement.appendChild(primaryContent);

    return mainElement;
  }
  return null;
}

// Enhances accessibility for forms
function enhanceAccessibilityForAddBook(form) {
  if (!form) return;

  if (!form.hasAttribute('role')) {
    form.setAttribute('role', 'form');
  }

  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    const id = input.id || input.getAttribute('name');
    if (!input.hasAttribute('aria-label') && !form.querySelector(`label[for="${id}"]`)) {
      const label = form.querySelector(`label[for="${id}"]`) || form.querySelector(`label[for="${input.name}"]`);
      if (!label) {
        input.setAttribute('aria-label', input.name || 'Form input');
      }
    }

    if (input.hasAttribute('required')) {
      input.setAttribute('aria-required', 'true');
    }
  });

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton && !submitButton.hasAttribute('aria-label') && !submitButton.textContent.trim()) {
    submitButton.setAttribute('aria-label', 'Submit form');
  }

  return form;
}

// Gets the lang attribute for the HTML element
export function getLangAttribute() {
  return document.documentElement.lang || navigator.language || 'en';
}

// Adds lang attribute to HTML element
export function addLangAttribute() {
  if (!document.documentElement.lang) {
    document.documentElement.lang = navigator.language || 'en';
  }
}

// Validates table accessibility
export function validateTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') return false;
  const hasCaption = table.querySelector('caption') !== null;
  const hasHeader = table.querySelector('thead') !== null;
  const rows = table.querySelectorAll('tr');
  let isValid = hasCaption && hasHeader && rows.length > 0;
  return isValid;
}

// Validates table structure
export function validateTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') return false;
  const rows = table.querySelectorAll('tr');
  let hasTHead = false;
  rows.forEach(row => {
    if (row.querySelector('th')) {
      hasTHead = true;
    }
  });
  return hasTHead;
}

// Fixes table structure issues
export function fixTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') return false;
  const thead = table.querySelector('thead');
  const firstRow = table.querySelector('tr');
  if (!thead && firstRow) {
    const newThead = document.createElement('thead');
    const cells = firstRow.querySelectorAll('th, td');
    cells.forEach(cell => {
      if (cell.tagName === 'TD') {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = cell.textContent;
        cell.parentNode.insertBefore(th, cell);
        cell.parentNode.removeChild(cell);
      }
    });
    newThead.appendChild(firstRow);
    table.insertBefore(newThead, table.firstChild);
    return true;
  }
  return false;
}

// Adds main landmark to the page
export function addMainLandmark() {
  wrapPrimaryContentInMain();
}

// Validates landmark accessibility
export function validateLandmark() {
  const main = document.querySelector('main');
  return main !== null;
}

// Validates landmark structure
export function validateLandmarkStructure() {
  return validateLandmark();
}

// Validates landmark attributes
export function validateLandmarkAttributes() {
  const main = document.querySelector('main');
  return main !== null && main.getAttribute('role') === 'main';
}

// Gets SVG accessible name
export function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') || svg.getAttribute('title') || '';
}

// Sets SVG attributes for accessibility
export function setSvgAttributes(svg) {
  if (svg.tagName !== 'SVG') return;
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  if (!svg.hasAttribute('aria-label') && !svg.querySelector('title')) {
    const titleElement = document.createElement('title');
    titleElement.textContent = svg.getAttribute('aria-label') || 'SVG graphic';
    svg.insertBefore(titleElement, svg.firstChild);
  }
}

// Ensures unique landmarks on the page
export function ensureUniqueLandmarks() {
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    const firstMain = mains[0];
    for (let i = mains.length - 1; i > 0; i--) {
      mains[i].parentNode.removeChild(mains[i]);
    }
  }
}

// Creates an in-page button for accessibility
export function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.addEventListener('click', onClick);
  button.setAttribute('role', 'button');
  return button;
}

// Validates link accessibility
export function validateLinkAccessibility(link) {
  if (!link || link.tagName !== 'A') return false;
  return link.hasAttribute('href');
}

// Handles fake links on the page
export function handleFakeLinks() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.length > 1) {
      link.style.cursor = 'pointer';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(href.substring(1));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });
}

// Adds proper landmark regions to the page
export function addProperLandmarkRegions() {
  const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
  if (mainContent) {
    if (!mainContent.hasAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }
  }
}

/**
 * Implements upgrade logic using harvested data to improve the system
 * @param {Object} harvestedData - The data harvested from accessibility insights
 * @returns {Object} The results of the upgrade process containing improvements applied
 */
export function upgradeLogic(harvestedData) {
  const results = {
    success: true,
    improvements: [],
    errors: []
  };

  if (!harvestedData || typeof harvestedData !== 'object') {
    results.success = false;
    results.errors.push('Invalid harvested data provided');
    return results;
  }

  // Process lang attribute improvements
  if (harvestedData.langIssues && harvestedData.langIssues.length > 0) {
    harvestedData.langIssues.forEach(issue => {
      try {
        if (typeof addLangAttribute === 'function') {
          addLangAttribute();
          results.improvements.push({
            type: 'lang',
            status: 'applied',
            issue: issue
          });
        }
      } catch (error) {
        results.errors.push(`Failed to apply lang fix: ${error.message}`);
      }
    });
  }

  // Process table structure improvements
  if (harvestedData.tableIssues && harvestedData.tableIssues.length > 0) {
    harvestedData.tableIssues.forEach(issue => {
      try {
        if (issue.element && typeof fixTableStructure === 'function') {
          const fixed = fixTableStructure(issue.element);
          results.improvements.push({
            type: 'table',
            status: fixed ? 'applied' : 'skipped',
            issue: issue
          });
        }
      } catch (error) {
        results.errors.push(`Failed to fix table structure: ${error.message}`);
      }
    });
  }

  // Process landmark improvements
  if (harvestedData.landmarkIssues && harvestedData.landmarkIssues.length > 0) {
    try {
      if (typeof ensureUniqueLandmarks === 'function') {
        ensureUniqueLandmarks();
        results.improvements.push({
          type: 'landmark',
          status: 'applied',
          issue: 'unique landmarks ensured'
        });
      }
    } catch (error) {
      results.errors.push(`Failed to ensure unique landmarks: ${error.message}`);
    }
  }

  // Process SVG accessible name improvements
  if (harvestedData.svgIssues && harvestedData.svgIssues.length > 0) {
    harvestedData.svgIssues.forEach(issue => {
      try {
        if (issue.element && typeof setSvgAttributes === 'function') {
          setSvgAttributes(issue.element);
          results.improvements.push({
            type: 'svg',
            status: 'applied',
            issue: issue
          });
        }
      } catch (error) {
        results.errors.push(`Failed to set SVG attributes: ${error.message}`);
      }
    });
  }

  // Process fake link improvements
  if (harvestedData.fakeLinkIssues && harvestedData.fakeLinkIssues.length > 0) {
    try {
      if (typeof handleFakeLinks === 'function') {
        handleFakeLinks();
        results.improvements.push({
          type: 'fakeLink',
          status: 'applied',
          issue: 'fake links handled'
        });
      }
    } catch (error) {
      results.errors.push(`Failed to handle fake links: ${error.message}`);
    }
  }

  // Process landmark region improvements
  if (harvestedData.landmarkRegionIssues && harvestedData.landmarkRegionIssues.length > 0) {
    try {
      if (typeof addProperLandmarkRegions === 'function') {
        addProperLandmarkRegions();
        results.improvements.push({
          type: 'landmarkRegion',
          status: 'applied',
          issue: 'proper landmark regions added'
        });
      }
    } catch (error) {
      results.errors.push(`Failed to add landmark regions: ${error.message}`);
    }
  }

  return results;
}

// New function that does something different
function newFunction() {
  return true;
}

/**
 * Function A description
 * @param {any} param - The parameter
 * @returns {any} The result
 */
export function functionA(param) {
  return param;
}

/**
 * Function B description
 * @param {any} param - The parameter
 * @returns {any} The result
 */
export function functionB(param) {
  return param;
}

// REACT_037: Google sign-in logic
const googleSignIn = {
  initialize: function(clientId) {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: this.handleCredentialResponse.bind(this)
      });
      return true;
    }
    return false;
  },

  renderButton: function(elementId) {
    const element = document.getElementById(elementId);
    if (element && typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        text: 'sign_in_with'
      });
      return true;
    }
    return false;
  },

  handleCredentialResponse: function(response) {
    console.log('Google Sign-In successful');
    return response;
  }
};

// Function to handle credential response
function handleCredentialResponse(response) {
  const credential = JSON.parse(response.credential);

  if (!credential || !credential.credential || !credential.clientId) {
    throw new Error('Invalid credential response structure');
  }

  localStorage.setItem('authCredential', JSON.stringify({
    token: credential.credential,
    clientId: credential.clientId,
    timestamp: Date.now()
  }));

  return credential;
}

// New function3 implementation
function function3() {
  console.log('function3 executed');
}

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
export function getLangAttribute() {
  return document.documentElement.lang || navigator.language || 'en';
}

/**
 * Adds lang attribute to HTML element
 */
export function addLangAttribute() {
  if (!document.documentElement.lang) {
    document.documentElement.lang = navigator.language || 'en';
  }
}

/**
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
export function validateTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') return false;
  const hasCaption = table.querySelector('caption') !== null;
  const hasHeader = table.querySelector('thead') !== null;
  const rows = table.querySelectorAll('tr');
  let isValid = hasCaption && hasHeader && rows.length > 0;
  return isValid;
}

/**
 * Validates table structure
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table structure is valid
 */
export function validateTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') return false;
  const rows = table.querySelectorAll('tr');
  let hasTHead = false;
  rows.forEach(row => {
    if (row.querySelector('th')) {
      hasTHead = true;
    }
  });
  return hasTHead;
}

/**
 * Fixes table structure issues
 * @param {HTMLElement} table - The table element to fix
 * @returns {boolean} True if table was fixed
 */
export function fixTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') return false;
  const thead = table.querySelector('thead');
  const firstRow = table.querySelector('tr');
  if (!thead && firstRow) {
    const newThead = document.createElement('thead');
    const cells = firstRow.querySelectorAll('th, td');
    cells.forEach(cell => {
      if (cell.tagName === 'TD') {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = cell.textContent;
        cell.parentNode.insertBefore(th, cell);
        cell.parentNode.removeChild(cell);
      }
    });
    newThead.appendChild(firstRow);
    table.insertBefore(newThead, table.firstChild);
    return true;
  }
  return false;
}

/**
 * Adds main landmark to the page
 */
export function addMainLandmark() {
  wrapPrimaryContentInMain();
}

/**
 * Validates landmark accessibility
 * @returns {boolean} True if landmarks are valid
 */
export function validateLandmark() {
  const main = document.querySelector('main');
  return main !== null;
}

/**
 * Validates landmark structure
 * @returns {boolean} True if landmark structure is valid
 */
export function validateLandmarkStructure() {
  return validateLandmark();
}

/**
 * Validates landmark attributes
 */
export function validateLandmarkAttributes() {
  const main = document.querySelector('main');
  return main !== null && main.getAttribute('role') === 'main';
}

/**
 * Gets SVG accessible name
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
export function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') || svg.getAttribute('title') || '';
}

/**
 * Sets SVG attributes for accessibility
 * @param {SVGElement} svg - The SVG element
 */
export function setSvgAttributes(svg) {
  if (svg.tagName !== 'SVG') return;
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  if (!svg.hasAttribute('aria-label') && !svg.querySelector('title')) {
    const titleElement = document.createElement('title');
    titleElement.textContent = svg.getAttribute('aria-label') || 'SVG graphic';
    svg.insertBefore(titleElement, svg.firstChild);
  }
}

/**
 * Ensures unique landmarks on the page
 */
export function ensureUniqueLandmarks() {
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    const firstMain = mains[0];
    for (let i = mains.length - 1; i > 0; i--) {
      mains[i].parentNode.removeChild(mains[i]);
    }
  }
}

/**
 * Creates an in-page button for accessibility
 * @param {string} text - The button text
 * @param {Function} onClick - The click handler
 * @returns {HTMLButtonElement} The button element
 */
export function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.addEventListener('click', onClick);
  button.setAttribute('role', 'button');
  return button;
}

/**
 * Validates link accessibility
 * @param {HTMLAnchorElement} link - The link element
 * @returns {boolean} True if link is accessible
 */
export function validateLinkAccessibility(link) {
  if (!link || link.tagName !== 'A') return false;
  return link.hasAttribute('href');
}

/**
 * Handles fake links on the page
 */
export function handleFakeLinks() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.length > 1) {
      link.style.cursor = 'pointer';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(href.substring(1));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });
}

/**
 * Adds proper landmark regions to the page
 */
export function addProperLandmarkRegions() {
  const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
  if (mainContent) {
    if (!mainContent.hasAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }
  }
}

// New function that does something different
function newFunction() {
  return true;
}

/**
 * Function A description
 * @param {any} param - The parameter
 * @returns {any} The result
 */
export function functionA(param) {
  return param;
}

/**
 * Function B description
 * @param {any} param - The parameter
 * @returns {any} The result
 */
export function functionB(param) {
  return param;
}

// Function to handle credential response
function handleCredentialResponse(response) {
  const credential = JSON.parse(response.credential);

  if (!credential || !credential.credential || !credential.clientId) {
    throw new Error('Invalid credential response structure');
  }

  localStorage.setItem('authCredential', JSON.stringify({
    token: credential.credential,
    clientId: credential.clientId,
    timestamp: Date.now()
  }));

  return credential;
}

// New function3 implementation
function function3() {
  console.log('function3 executed');
}

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
export function getLangAttribute() {
  return document.documentElement.lang || navigator.language || 'en';
}

/**
 * Adds lang attribute to HTML element
 */
export function addLangAttribute() {
  if (!document.documentElement.lang) {
    document.documentElement.lang = navigator.language || 'en';
  }
}

/**
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
export function validateTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') return false;
  const hasCaption = table.querySelector('caption') !== null;
  const hasHeader = table.querySelector('thead') !== null;
  const rows = table.querySelectorAll('tr');
  let isValid = hasCaption && hasHeader && rows.length > 0;
  return isValid;
}

/**
 * Validates table structure
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table structure is valid
 */
export function validateTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') return false;
  const rows = table.querySelectorAll('tr');
  let hasTHead = false;
  rows.forEach(row => {
    if (row.querySelector('th')) {
      hasTHead = true;
    }
  });
  return hasTHead;
}

/**
 * Fixes table structure issues
 * @param {HTMLElement} table - The table element to fix
 * @returns {boolean} True if table was fixed
 */
export function fixTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') return false;
  const thead = table.querySelector('thead');
  const firstRow = table.querySelector('tr');
  if (!thead && firstRow) {
    const newThead = document.createElement('thead');
    const cells = firstRow.querySelectorAll('th, td');
    cells.forEach(cell => {
      if (cell.tagName === 'TD') {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = cell.textContent;
        cell.parentNode.insertBefore(th, cell);
        cell.parentNode.removeChild(cell);
      }
    });
    newThead.appendChild(firstRow);
    table.insertBefore(newThead, table.firstChild);
    return true;
  }
  return false;
}

/**
 * Adds main landmark to the page
 */
export function addMainLandmark() {
  wrapPrimaryContentInMain();
}

/**
 * Validates landmark accessibility
 * @returns {boolean} True if landmarks are valid
 */
export function validateLandmark() {
  const main = document.querySelector('main');
  return main !== null;
}

/**
 * Validates landmark structure
 * @returns {boolean} True if landmark structure is valid
 */
export function validateLandmarkStructure() {
  return validateLandmark();
}

/**
 * Validates landmark attributes
 */
export function validateLandmarkAttributes() {
  const main = document.querySelector('main');
  return main !== null && main.getAttribute('role') === 'main';
}

/**
 * Gets SVG accessible name
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
export function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') || svg.getAttribute('title') || '';
}

/**
 * Sets SVG attributes for accessibility
 * @param {SVGElement} svg - The SVG element
 */
export function setSvgAttributes(svg) {
  if (svg.tagName !== 'SVG') return;
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  if (!svg.hasAttribute('aria-label') && !svg.querySelector('title')) {
    const titleElement = document.createElement('title');
    titleElement.textContent = svg.getAttribute('aria-label') || 'SVG graphic';
    svg.insertBefore(titleElement, svg.firstChild);
  }
}

/**
 * Ensures unique landmarks on the page
 */
export function ensureUniqueLandmarks() {
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    const firstMain = mains[0];
    for (let i = mains.length - 1; i > 0; i--) {
      mains[i].parentNode.removeChild(mains[i]);
    }
  }
}

/**
 * Creates an in-page button for accessibility
 * @param {string} text - The button text
 * @param {Function} onClick - The click handler
 * @returns {HTMLButtonElement} The button element
 */
export function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.addEventListener('click', onClick);
  button.setAttribute('role', 'button');
  return button;
}

/**
 * Validates link accessibility
 * @param {HTMLAnchorElement} link - The link element
 * @returns {boolean} True if link is accessible
 */
export function validateLinkAccessibility(link) {
  if (!link || link.tagName !== 'A') return false;
  return link.hasAttribute('href');
}

/**
 * Handles fake links on the page
 */
export function handleFakeLinks() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.length > 1) {
      link.style.cursor = 'pointer';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(href.substring(1));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });
}

/**
 * Adds proper landmark regions to the page
 */
export function addProperLandmarkRegions() {
  const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
  if (mainContent) {
    if (!mainContent.hasAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }
  }
}

// New function that does something different
function newFunction() {
  return true;
}

/**
 * Function A description
 * @param {any} param - The parameter
 * @returns {any} The result
 */
export function functionA(param) {
  return param;
}

/**
 * Function B description
 * @param {any} param - The parameter
 * @returns {any} The result
 */
export function functionB(param) {
  return param;
}

/**
 * Adds proper landmark regions to the page
 */
export function addProperLandmarkRegions() {
  // Implementation to be added
}

// Export all functions using ES module syntax
export {
  getLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks,
  functionA,
  functionB,
  addProperLandmarkRegions,
  upgradeLogic,
  newFunction
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();