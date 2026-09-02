const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const { a11y } = require('@accessible/react');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks: ensureUniqueLandmarksFromUtils
} = require('./utils');

import React, { useState, useEffect, useRef } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, enhanceAccessibilityForAddBook } from './bookFunctions';
import fastMap from 'fast-map';
import accessiblyHelper from './accessibly-helper';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import './styles.css';
import './styles.less';
import { calculateSum } from './utils';
import { getLangAttribute as getLangAttributeFromUtils, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility as validateTableAccessibilityFromUtils, validateTableStructure as validateTableStructureFromUtils } from './utils/tableAccessibilityUtils';
import { validateLandmark as validateLandmarkFromUtils, validateLandmarkStructure as validateLandmarkStructureFromUtils } from './utils/landmarkUtils';
import { validateLinkAccessibility as validateLinkAccessibilityFromUtils, handleFakeLinks as handleFakeLinksFromUtils } from './utils/linkAccessibilityUtils';
import { CONFIG } from './utils/constants';
import App from './App';
import { helper, formatDate } from './utils';
import { someFunction } from './utils/someFunction';
import { fetchUser, clearCache } from './utils/user';
import * as newFunctions from './newFunctions';

const {
  sortByTitle: sortByTitleLocal,
  sortByAuthor: sortByAuthorLocal,
  validateLandmarkObject,
  getLangAttribute: getLangAttributeLocal,
  createInPageButton,
  validateTableAccessibility: validateTableAccessibilityLocal,
  validateLandmarkStructure: validateLandmarkStructureLocal,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks: ensureUniqueLandmarksLocal2,
  addProperLandmarkRegions,
  validateLinkAccessibility: validateLinkAccessibilityLocal,
  handleFakeLinks: handleFakeLinksLocal,
  someFunction: someFunctionLocal,
  fetchUser: fetchUserLocal,
  clearCache: clearCacheLocal,
  addSvgAccessibilityProps,
  getAccessibleLinkProps,
  landmarkStructureCheck,
} = require('./somemodule');

const config = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000
};

const landmarkSelectors = [
  '[role="banner"]',
  '[role="navigation"]',
  '[role="main"]',
  '[role="complementary"]',
  '[role="contentinfo"]',
  '[role="region"]',
  'header:not([role])',
  'nav:not([role])',
  'main:not([role])',
  'footer:not([role])',
  'aside:not([role])',
  'section:not([role])'
];

const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];

let isInitialized = false;
let dependencyGraph = null;

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

let icons = {};
let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice";

const books = [];
const safetyCategory = "User Safety: safe";

// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
function ensureDependencyGraphAriaRole() {
  const dependencyGraphEl = document.querySelector('#dependencyGraph');
  if (dependencyGraphEl) {
    dependencyGraphEl.setAttribute('role', 'region');
  }
}

// Address accessibility issues from insight report:
// Ensure each landmark has an ID and add appropriate aria-label
function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
      return [];
  }

  const seen = new Set();
  return landmarksArray.map((landmark) => {
      const key = enforceLeafRuntime(landmark.name) + '_' + (landmark.role || 'default');
      if (!seen.has(key)) {
          seen.add(key);
          landmark.id = landmark.id || key;
          landmark = ensureElementHasId(landmark, landmark.id);
          if (!landmark.attributes || !landmark.attributes.aria) {
              landmark.attributes = landmark.attributes || {};
              landmark.attributes.aria = {};
          }
          landmark.attributes.aria.label = ensureLandmarkLabel(landmark);
          return landmark;
      }
      return null;
  }).filter(Boolean);
}

// Combine sortByTitle, sortByTitleLocal, and sortByAuthor, sortByAuthorLocal
const sortByTitle = sortByTitleLocal || sortByTitle;
const sortByAuthor = sortByAuthorLocal || sortByAuthor;

// Application initializations

export const validateLandmark = (landmark) => {
  const errors = [];

  // Validation logic

  return {
    valid: errors.length === 0,
    errors
  };
};

export const checkLinkAccessibility = (url) => {
  // Implementation logic here...
  return true;
};

export const newExportedFunction = () => {
  // New export logic here...
};

// Ensure accessibility attributes are set when adding a book
ensureAccessibilityAttributesForAddBook();

// Find the primary content element in the DOM
let primaryContent = document.querySelector('.primary-content') ||
                        document.querySelector('[role="main"]') ||
                        document.getElementById('main-content') ||
                        document.querySelector('#content');

// Function to wrap primary content in a <main> element
function wrapPrimaryContentInMain() {
  // If primary content exists and is not already inside a <main> element
  if (primaryContent && !primaryContent.closest('main')) {
      // Create a new <main> element
      const mainElement = document.createElement('main');

      // Insert the <main> element before the primary content in the DOM
      primaryContent.parentNode.insertBefore(mainElement, primaryContent);

      // Move the primary content inside the <main> element
      mainElement.appendChild(primaryContent);

      return mainElement;
  }
  return null;
}

function getUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = Array.from(document.querySelectorAll(landmarkSelectors.join(',')));
    const landmarkIds = elements.map(el => el.id || el.getAttribute('aria-labelledby'));
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}`;
      }
    });
    return elements;
  }

  const seen = new Set();
  const uniqueLandmarks = [];

  for (const landmark of landmarks) {
    if (!landmark || typeof landmark.id === 'undefined') {
      continue;
    }

    const landmarkId = typeof landmark.id === 'string' ? landmark.id : String(landmark.id);

    if (!seen.has(landmarkId)) {
      seen.add(landmarkId);
      uniqueLandmarks.push(landmark);
    }
  }

  return uniqueLandmarks;
}

// NEW: Implement a new function to handle focus trap for keyboard navigation
function newFocusTrap(containerElement, options = {}) {
  let previouslyFocusedElement = null;
  let focusableElements = [];
  let firstFocusableElement = null;
  let lastFocusableElement = null;
  let trapActivate = null;

  const getFocusableElements = (container) => {
    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]'
    ].join(',');

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length);
  };

  const updateFocusableElements = () => {
    focusableElements = getFocusableElements(containerElement);
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];
  };

  const activate = () => {
    previouslyFocusedElement = document.activeElement;
    updateFocusableElements();

    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }

    trapActivate = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) { // shift + tab
          if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            lastFocusableElement.focus();
          }
        } else { // tab
          if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', trapActivate);
  };

  const deactivate = () => {
    document.removeEventListener('keydown', trapActivate);
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
    previouslyFocusedElement = null;
  };

  return {
    activate,
    deactivate
  };
}

/**
 * Function to address accessibility issues from insight report.
 * Handles various accessibility issues including language attributes,
 * table structures, landmarks, SVG accessibility, fake links, and landmark regions.
 */
function addressInsightIssues() {
  // REACT_015: Add lang attribute to HTML element
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    const langAttribute = getLangAttribute();
    if (langAttribute) {
      htmlElement.setAttribute('lang', langAttribute);
    }
  }

  // REACT_027: Fix table structure issues
  validateTableAccessibility();
  validateTableStructure();

  // REACT_017: Add/fix landmark issues and ensure unique landmarks
  validateLandmark(landmarks);
  validateLandmarkStructure(landmarks);
  ensureUniqueLandmarks(landmarks);

  // REACT_041: Add accessible names to SVGs
  getSvgAccessibleName();
  setSvgAttributes();

  // REACT_025: Ensure unique landmarks (already handled by ensureUniqueLandmarks)

  // REACT_036: Fix fake link issue
  handleFakeLinks();

  // REACT_037: Add proper landmark regions
  addProperLandmarkRegions();
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';

  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent;
  }

  const desc = svgElement.querySelector('desc');
  if (desc) {
    return desc.textContent;
  }

  return svgElement.getAttribute('aria-label') || '';
}

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
     * - REACT_036: Fix 1 fake link issue (handled by fixFakeLinkIssues(), createAccessibleLink() and addFixLandmarkIssues())
     * todo-hash: 50090d29914857ebc4d3d6f532d1293acbb65526
     */

    addLangAttribute();
    wrapPrimaryContentInMain();
    fixTableStructureIssues();
    fixTableHeaderCellScope();
    addMainLandmark();
    addSvgAccessibleNames();
    fixFakeLinkIssues();
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
    if (!seen.has(landmark.id)) {
      seen.add(landmark.id);
      return true;
    }
    return false;
  });
}

function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

function validateLandmarkObject(landmark) {
  const errors = [];

  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }

  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  if (Array.isArray(landmark)) {
    landmark.forEach((innerLandmark, index) => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push(`Landmark at index ${index} must have a valid name`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function addSvgAccessibilityProps(svgElement, label, labelledById) {
  if (!svgElement) return;

  const props = getSvgAccessibilityProps(label, labelledById);

  Object.keys(props).forEach(prop => {
    svgElement.setAttribute(prop, props[prop]);
  });
}

function getSvgAccessibilityProps(label, labelledById) {
  const props = {};
  if (label) {
    props['aria-label'] = label;
  }
  if (labelledById) {
    props['aria-labelledby'] = labelledById;
  }
  return props;
}

function getAccessibleLinkProps(href, label) {
  return {
    href,
    'aria-label': label,
    role: 'link'
  };
}

// Function to add proper landmark regions
function addProperLandmarkRegions() {
  // Implementation for adding proper landmark regions
  const mainLandmarks = document.querySelectorAll('main');
  mainLandmarks.forEach(landmark => {
    if (!landmark.hasAttribute('role')) {
      landmark.setAttribute('role', 'main');
    }
  });
}

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function createInPageButton(buttonText, onClickHandler) {
  return {
    button: {
      onClick: onClickHandler,
      lang: getLangAttribute(),
      text: buttonText
    }
  };
}

function addLangAttribute() {
  if (document && document.documentElement) {
    if (!document.documentElement.getAttribute('lang')) {
      document.documentElement.setAttribute('lang', getLangAttribute());
    }
  }
}

async function renderFunction1() {
  await accessiblyHelper();

  function wrapPrimaryContentInMain() {
    if (document.body.firstChild) {
      const wrapper = document.createElement('main');
      wrapper.innerHTML = document.body.firstChild.outerHTML;
      document.body.replaceChild(wrapper, document.body.firstChild);
    }
  }
}

function renderFunction2() {
  // ...
}

// Exporting module objects
export {
  wrapPrimaryContentInMain,
  initializeApp,
  handleUserInteraction,
  cleanup,
  initApp,
  processData,
  fetchUser,
  clearCache,
  VisualizeDependencyTree,
  checkLandmarkElement,
  ensureUniqueLandmarks,
  landmarkStructureCheck,
  setLanguageAttribute,
  addLandmarkRoles,
  fixFakeLinks,
  isSecureContext,
  landmarks,
  appData,
  icons,
  validateLandmark,
  ensureFocusableElements,
  renderDependencyGraphContent,
  ensureLandmarkUniqueness,
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  countDependencies,
  createInPageButton,
  primaryContent,
  getUniqueLandmarks,
  getSvgAccessibleName,
  validateTableAccessibility,
  validateTableStructure,
  scanAccessibility,
  validateLinkAccessibility,
  handleFakeLinks,
  validateLandmark,
  validateLandmarkStructure,
  loadLandmarks,
  processLandmarks,
  ensureUniqueLandmarks,
  checkLandmarkElement,
  validateLandmarkObject,
  addSvgAccessibilityProps,
  getSvgAccessibilityProps,
  getAccessibleLinkProps,
  getLangAttribute,
  createInPageButton,
  wrapPrimaryContentInMain,
  addLangAttribute,
  CONFIG,
  appState
};