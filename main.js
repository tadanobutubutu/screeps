// main.js
// Main entry point for the application

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000,
  debug: true,
  version: '1.0.0'
};

const landmarkSelectors = ['header', 'footer', 'main', 'nav', 'aside', 'section[role="region"]'];

let isInitialized = false;
let dependencyGraph = null;

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

/* Some code changed for merging HEAD and MINE changes */
// Find the primary content element in the DOM or create it using different selectors
const primaryContent = document.querySelector('.primary-content') ||
                        document.querySelector('[role="main"]') ||
                        document.getElementById('main-content') ||
                        (primaryContent = document.createElement('main')) && primaryContent.appendChild(document.getElementById('content'));

function wrapPrimaryContentInMain() {
  if (!primaryContent && primaryContent.nodeName !== 'MAIN') {
    const mainElement = document.createElement('main');
    document.body.appendChild(mainElement);
    mainElement.appendChild(primaryContent);
    return mainElement;
  }
  return primaryContent;
}

// Import React, Ant Design and others at the top for global use
import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, enhanceAccessibilityForAddBook } from './bookFunctions';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import './styles.css';
import './styles.less';
import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { CONFIG } from './utils/constants';
import App from './App';
import { helper, formatDate } from './utils';
import { someFunction } from './utils/someFunction';
import express from 'express';
import path from 'path';
import { fetchUser, clearCache } from './utils/user';
import newFunctions from './newFunctions';
import { createUnrotateButton } from './utils/myfunctions'; // New function added for createUnrotateButton
import accessibilityUtilities from './AccessibilityUtilities';

// Import accessibility utils
const {
  setLanguageAttribute,
  addLangAttribute,
  fixFakeLinks,
  addressAccessibilityIssues,
  setSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixUniqueLandmarks
} = accessibilityUtilities;

const {
  validateInput, processData, formatResponse
} = require('./utils/validators');

// ... (Keep the remaining code from both versions)

function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;

  const headers = tableElement.querySelectorAll('th');
  const cells = tableElement.querySelectorAll('td, th');

  for (const cell of cells) {
    if (!cell.id && !cell.getAttribute('scope')) {
      return false;
    }
  }

  return true;
}

function validateTableStructure(tableElement) {
  if (!tableElement) return false;

  const rows = tableElement.querySelectorAll('tr');
  let hasHeader = false;

  for (const row of rows) {
    const cells = row.querySelectorAll('th, td');
    for (const cell of cells) {
      if (cell.tagName.toLowerCase() === 'th') {
        hasHeader = true;
        if (!cell.getAttribute('scope')) {
          return false;
        }
      }
    }
  }

  return hasHeader;
}

async function scanAccessibility() {
  const violations = [];

  if (typeof document !== 'undefined') {
    const results = await axe.run(document);
    violations.push(...results.violations);
  }

  return { violations };
}

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a[href]');

  for (const link of links) {
    if (!link.textContent.trim()) {
      return false;
    }
  }

  return true;
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('.fake-link');
  fakeLinks.forEach(link => {
    if (link.tagName === 'A' && !link.getAttribute('role')) {
      link.setAttribute('role', 'button');
    }
  });
}

function validateLandmark() {
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));
  return landmarks.length > 0;
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));

  for (const landmark of landmarks) {
    if (!landmark.id && !landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
      return false;
    }
  }

  return true;
}

function initialize() {
  console.log('Initializing application...');

  if (!isInitialized) {
    isInitialized = true;
    appState.initialized = true;

    const appData = {
      title: 'Screeps',
      version: CONFIG.version
    };

    /**
     * Address accessibility issues from insight report:
     * - REACT_015: Add lang attribute to HTML element (handled by addLangAttribute() and wrapPrimaryContentInMain())
     * - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
     * - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and addFixLandmarkIssues())
     * - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
     * - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and addFixLandmarkIssues())
     * - REACT_036: Fix 1 fake link issue (handled by fixFakeLinks(), createAccessibleLink() and addFixLandmarkIssues())
     * todo-hash: 50090d29914857ebc4d3d6f532d1293acbb65526
     */

    addLangAttribute();
    wrapPrimaryContentInMain();
    fixTableStructureIssues();
    fixTableHeaderCellScope();
    addMainLandmark();
    addSvgAccessibleNames();
    fixFakeLinks();
    ensureUniqueLandmarks();

    // Load landmarks for accessibility processing
    const landmarks = loadLandmarks();
    const processed = processLandmarks(landmarks);

    // Ensure the dependencyGraph container has a proper ARIA role
    if (dependencyGraph) {
      if (!dependencyGraph.id) {
        dependencyGraph.id = 'dependencyGraph';
      }
      if (!dependencyGraph.hasAttribute('role')) {
        dependencyGraph.setAttribute('role', 'region');
      }
      if (!dependencyGraph.hasAttribute('aria-label')) {
        dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
      }
    }
  }
}

function loadLandmarks() {
  try {
    const filePath = path.join(__dirname, CONFIG.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (seen.has(`${landmark.id || ''}${landmark.name || ''}`)) {
      return false;
    }
    seen.add(`${landmark.id || ''}${landmark.name || ''}`);
    return true;
  });
}

function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
};

// Implemented validateLandmark functionality
function validateLandmarkObject(landmark) {
  const errors = [];

  // Check if landmark exists
  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  // Validate name
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push(`Landmark must have a valid name`);
  }

  if (!landmark.concurrent || !Array.isArray(landmark.concurrent)) {
    errors.push('Landmark.concurrent should be an array');
  }

  return { valid: errors.length === 0, errors };
}

function isValidLandmark(landmark) {
  return validateLandmarkObject(landmark).valid;
}

function addSvgAccessibilityProps(svgElement, label, labelledById) {
  if (!svgElement) return;

// Add new functions below this line
export { createUnrotateButton };

/* Some code changed for merging HEAD and MINE changes */
export const checkUserSafety = () => {
  let userSafetyMessage = '';

  if (userSafety !== 'safe') {
    userSafetyMessage = 'User safety level is set to "unsafe". Please review and update this setting for better security.';
  }

  return userSafetyMessage;
};

export const checkSafetyCategories = () => {
  let safetyCategoriesMessage = '';

  if (safetyCategories.includes('Authorized Advice')) {
    safetyCategoriesMessage = 'Safety categories contain unauthorized advice. Please review and update safety categories accordingly.';
  }

  return safetyCategoriesMessage;
};

export const visualizeDependencyTree = (dependencies) => {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
};

export const rotateBack = () => {
  // Your code to rotate back
  console.log('Reverting back the rotation.');
};

export const addressAccessibilityIssues = () => {
  fixAccessibilityIssues();
};

export const addBook = (title, author, isbn) => {
  const form = document.createElement('form');
  form.setAttribute('role', 'form');
  form.setAttribute('aria-label', 'Add Book Form');

  const titleInput = createAccessibleInput('text', 'title', 'Book Title', title);
  const authorInput = createAccessibleInput('text', 'author', 'Author Name', author);
  const isbnInput = createAccessibleInput('text', 'isbn', 'ISBN Number', isbn);

  const submitButton = document.createElement('button');
  submitButton.setAttribute('type', 'submit');
  submitButton.setAttribute('aria-label', 'Add Book');
  submitButton.textContent = 'Add Book';

  const unrotateButton = createUnrotateButton();

  form.appendChild(titleInput);
  form.appendChild(authorInput);
  form.appendChild(isbnInput);
  form.appendChild(submitButton);
  form.appendChild(unrotateButton);

  document.body.appendChild(form);

  // Add event listener for form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    announceBookAdded(title, author, isbn);
  });

  return form;
};

// ... (Keep the remaining code from both versions)

function createAccessibleInput(type, id, labelText, value = '') {
  // ... (Keep the existing code for createAccessibleInput)
}

function createInPageButton(buttonText, onClickHandler) {
  // ... (Keep the existing code for createInPageButton)
}

// ... (Keep the remaining code from both versions)
```

  if (primaryContent && !primaryContent.closest('main')) {
    const mainElement = document.createElement('main');
    primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    mainElement.appendChild(primaryContent);
    return mainElement;
  }
  return null;
}

function addLangAttribute() {
  if (document && document.documentElement) {
    if (!document.documentElement.getAttribute('lang')) {
      document.documentElement.setAttribute('lang', getLangAttribute());
    }
  }
}

async function renderFunction1() {
  // await accessiblyHelper(); // Removed as accessiblyHelper is not defined
  wrapPrimaryContentInMain();
}