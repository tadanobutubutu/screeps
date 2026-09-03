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
  fixFakeLinks
} = require('./utils');

import React, { useState, useEffect, useRef } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook } from './bookFunctions';
import fastMap from 'fast-map';
import accessiblyHelper from './accessibly-helper';
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
import { fetchUser, clearCache } from './utils/user';
import * as newFunctions from './newFunctions';

const {
  sortByTitle: sortByTitleLocal,
  sortByAuthor: sortByAuthorLocal,
  getLangAttribute: getLangAttributeLocal,
  createInPageButton,
  validateTableAccessibility: validateTableAccessibilityLocal,
  validateLandmarkStructure: validateLandmarkStructureLocal,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  addProperLandmarkRegions,
  validateLinkAccessibility: validateLinkAccessibilityLocal,
  handleFakeLinks: handleFakeLinksLocal,
  someFunction: someFunctionLocal,
  fetchUser: fetchUserLocal,
  clearCache: clearCacheLocal,
  landmarkStructureCheck
} = require('./somemodule');

const config = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000
};

const landmarkSelectors = [
  '[role="banner"]',
  '[role="navigation"]',
  '[role="main"]',
  '[role="contentinfo"]',
  '[role="region"]',
  'header:not([role])',
  'nav:not([role])',
  'main:not([role])',
  'footer:not([role])',
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
function ensureDependencyGraphAccessibility() {
  const dependencyGraphEl = document.getElementById('dependencyGraph');
  if (dependencyGraphEl) {
    dependencyGraphEl.setAttribute('role', 'region');
  }
}

// Address accessibility issues from insight report:
// Ensure each landmark has an ID and add appropriate aria-label
function ensureUniqueLandmarksOriginal(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
      return [];
  }

  const seen = new Set();
  return landmarksArray.map((landmark) => {
      const key = landmark.id + '_' + (landmark.role || 'default');
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
const sortByTitleCombined = sortByTitleLocal || sortByTitle;
const sortByAuthorCombined = sortByAuthorLocal || sortByAuthor;

// Application initializations

export const validateLandmarkExport = (landmark) => {
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
function ensureBookAccessibility(book) {
  if (book && !book.ariaLabel) {
    book.ariaLabel = book.title || 'Book item';
  }
  return book;
}

// Find the primary content element in the DOM
let primaryContent = document.querySelector('main') ||
                        document.querySelector('[role="main"]') ||
                        document.querySelector('#main') ||
                        document.querySelector('.main-content');

// Function to wrap primary content in a <main> element
function wrapPrimaryContentInMain() {
  // If primary content exists and is not already inside a <main> element
  if (primaryContent && primaryContent.tagName !== 'MAIN') {
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

function processLandmarksUnique(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = document.querySelectorAll(landmarkSelectors.join(','));
    const landmarkIds = elements.map(el => el.id || el.getAttribute('aria-label') || '');
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = 'landmark-' + index;
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
function createFocusTrap(container, options = {}) {
  let previousActiveElement = null;
  let focusableElements = [];
  let firstFocusableElement = null;
  let lastFocusableElement = null;
  let trapActivate = null;

  const getFocusableElements = (containerEl) => {
    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]'
    ].join(',');

    return Array.from(containerEl.querySelectorAll(focusableSelectors))
      .filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length);
  };

  const updateFocusableElements = () => {
    focusableElements = getFocusableElements(container);
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];
  };

  const activate = () => {
    previousActiveElement = document.activeElement;
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
    if (previousActiveElement) {
      previousActiveElement.focus();
    }
    previousActiveElement = null;
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
  addProperLandmarkRegions(landmarks);
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

  return svgElement.getAttribute('aria-label') || svgElement.id || '';
}

function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;

  const headers = tableElement.querySelectorAll('th');
  const cells = tableElement.querySelectorAll('td, th');

  for (const cell of cells) {
    if (!cell.id && cell.tagName === 'TH')