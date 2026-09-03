import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities'; // Assuming accessibility utilities are in a separate file
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
import { GAME, Memory } from 'screeps';
// Added foreign dependency
import AccessibilityUtils from './AccessibilityUtilities';
import Utils from './Utils';
import baseFunctions from './baseFunctions';

// Commented out react improvements related functions REACT_015, REACT_027, REACT_017, REACT_041, REACT_025, REACT_036

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

// Enhances accessibility for AddBook form
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

// Added foreign function for bot logic
function someNewFunction() {
  const config = CONFIG || {};
  const maxMemoryUsage = config.maxMemory ? config.maxMemory : 1024 * 1024;

  if (Memory.bytesUsed / 1024 / 1024 > maxMemoryUsage) {
    console.warn('High memory usage detected');
    return true;
  }
}

// Added bot-specific functions
function getUserSafety() {
  return {
    safe: true,
    riskLevel: 'low'
  };
}

function getSafetyCategories() {
  return [
    'Fraud/Deception',
    'Unauthorized Advice',
    'Financial Risk',
    'Security Vulnerability'
  ];
}

function calculateDiscount(price, discountPercentage) {
  return price * (1 - discountPercentage / 100);
}

function newFunction() {
  return {
    message: 'New functionality activated',
    timestamp: new Date().toISOString()
  };
}

function newFunction2() {
  return {
    message: 'Secondary new feature enabled',
    type: 'enhancement'
  };
}

function existingFunction1() {
  return 'existing_function_1';
}

function existingFunction2() {
  return 'existing_function_2';
}

// Commented out Google sign-in logic

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

// Added foreign function
export function getLangAttribute() {
  return GAME.lang || 'en';
}

// Export the new function with es module syntax
import { GAME, Memory } from 'screeps';
export { someNewFunction };

// Removed unused import and provided proper accessibility functions to be exported
export {
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  handleFakeLinks,
  addProperLandmarkRegions,
  createInPageButton,
  validateLinkAccessibility
};

// Replace reportWebVitals with your custom bot monitoring code
reportWebVitals();