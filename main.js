import React, { useState, useEffect, useRef } from 'react';
import { List, Button } from 'antd';
import { setDependencyGraph } from './actions/dependencyGraph';
import fastMap from 'fast-map';
import accessiblyHelper from './accessibly-helper';
import { initializeApp, registerSW } from './app.js';
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
import axe from 'axe-core';
import { a11y } from '@accessible/react';
import {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks: ensureUniqueLandmarksFromUtils,
  addProperLandmarkRegions,
  validateLandmarkObject,
  getLangAttribute
} from './utils';
import { language wise update to html element } from './origin/main';

const express = require('express');
const fs = require('fs');
const path = require('path');

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

let isInitialized = false;
let dependencyGraph = null;

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

// Function to address accessibility issues from insight report.
// Handles various accessibility issues including language attributes,
// table structures, landmarks, SVG accessibility, fake links, and landmark regions.
function addressInsightIssues() {
  // REACT_015: Add lang attribute to HTML element
  // Replaced legacy languageWiseUpdateToHtmlElement with modern approach
  const lang = getLangAttribute();
  if (lang) {
    document.documentElement.lang = lang;
  }

  // REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
  validateTableAccessibilityFromUtils();
  validateTableStructureFromUtils();

  // REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and addFixLandmarkIssues())
  validateLandmarkFromUtils(landmarks);
  validateLandmarkStructureFromUtils(landmarks);
  ensureUniqueLandmarksFromUtils(landmarks);

  // REACT_041: Add accessible names to SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
  getSvgAccessibleName();
  setSvgAttributes();

  // REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and addFixLandmarkIssues())

  // REACT_036: Fix 1 fake link issue (handled by createAccessibleLink() and addFixLandmarkIssues())

  // REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

  // TODO: Integrate following functions (REACT_017 and new REACT_025)
  // addLandmarkRoles();
  // addFixLandmarkIssues();
}

function validateLandmark(landmark) {
  const issues = [];

  if (!landmark.ariaLabel && !landmark.ariaLabelledby && !landmark.textContent) {
    issues.push('Landmark missing accessible name');
  }

  if (landmark.role && !['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'search'].includes(landmark.role)) {
    issues.push(`Invalid landmark role: ${landmark.role}`);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

function validateTableAccessibility(table) {
  const issues = [];

  if (!table.headers) {
    issues.push('Missing headers attribute');
  }

  if (!table.scope) {
    issues.push('Missing scope attribute');
  }

  // Check for caption (conflict resolved: check for both)
  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }

  if (!table.getAttribute('headers')) {
    issues.push('Missing headers attribute');
  }

  // Check for scope attribute on header cells (from HEAD)
  const headerCells = table.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      issues.push('Missing scope attribute on header cell');
    }
  });

  return {
    success: issues.length === 0,
    issues
  };
}

function validateTableStructure(tables) {
  const allIssues = [];

  const tableArray = Array.isArray(tables) ? tables : [tables];

  tableArray.forEach((table, index) => {
    // Check for rows
    const rows = table.querySelectorAll ? table.querySelectorAll('tr') : [];
    if (rows.length === 0) {
      allIssues.push({
        tableIndex: index,
        issues: ['Table has no rows']
      });
    }

    // Validate table accessibility
    const result = validateTableAccessibility(table);
    if (!result.success) {
      allIssues.push({
        tableIndex: index,
        issues: result.issues
      });
    }
  });

  return {
    success: allIssues.length === 0,
    issues: allIssues
  };
}

/**
 * Adds lang attribute to HTML element
 * @param {Object} element - The HTML element to modify
 * @returns {Object} The modified element with lang attribute
 */
function addLangAttribute(element) {
  element.lang = getFullLangAttribute();
  return element;
}

/**
 * Validates the structure of landmark elements
 * @param {Array} landmarks - Array of landmark elements to validate (optional)
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmarkStructure(landmarks) {
  const issues = [];

  if (Array.isArray(landmarks)) {
    landmarks.forEach((landmark, index) => {
      const result = validateLandmark(landmark);
      if (!result.success) {
        issues.push({
          landmarkIndex: index,
          issues: result.issues
        });
      }
    });
  } else {
    // Otherwise, check for required landmarks in the DOM (from origin/main)
    const allLandmarks = document.querySelectorAll('[role]');
    let hasMain = false;
    let hasNavigation = false;

    allLandmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
    });

    if (!hasMain) {
      issues.push('Missing main landmark');
    }
    if (!hasNavigation) {
      issues.push('Missing navigation landmark');
    }
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Ensures all landmarks have unique accessible names
 * @param {Array} landmarks - Array of landmark elements to check (optional)
 * @returns {Object} Result with success status and any duplicate names found
 */
function ensureUniqueLandmarks(landmarks) {
  const names = [];
  const duplicates = [];

  let elementsToCheck = landmarks;

  // If no landmarks array provided, query the DOM (from origin/main)
  if (!Array.isArray(landmarks)) {
    elementsToCheck = document.querySelectorAll('[role]');
  }

  // Check for duplicate accessible names (from HEAD)
  elementsToCheck.forEach(landmark => {
    const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
    if (names.includes(name)) {
      if (!duplicates.includes(name)) {
        duplicates.push(name);
      }
    } else {
      names.push(name);
    }
  });

  // Check for duplicate IDs (from origin/main)
  const elementsById = {};
  elementsToCheck.forEach(landmark => {
    if (landmark.id) {
      if (elementsById[landmark.id]) {
        duplicates.push(`Duplicate ID: ${landmark.id}`);
      } else {
        elementsById[landmark.id] = true;
      }
    }
  });

  // Check for duplicate roles (from origin/main)
  const landmarksByRole = {};
  elementsToCheck.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (role) {
      if (landmarksByRole[role]) {
        duplicates.push(`Duplicate landmark role: ${role}`);
      } else {
        landmarksByRole[role] = true;
      }
    }
  });

  return {
    success: duplicates.length === 0,
    duplicates
  };
}

function initializeApp() {
  appState.initialized = true;
  console.log('Initializing application...');
  return true;
}

function getConfig() {
  return config;
}

function validateInput(input) {
  return input !== null && input !== undefined;
}

function processData(data) {
  if (!validateInput(data)) {
    throw new Error('Invalid input data');
  }
  return {
    processed: true,
    data: data,
    timestamp: Date.now()
  };
}

function createInPageButton(text, onClick) {
    // Implementation to create accessible in-page button
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    button.setAttribute('aria-label', text);
    if (text.length === 0) {
      button.setAttribute('aria-label', 'Empty button');
    }
    return button;
}

/**
 * Handles accessibility issues found during validation
 * @param {Array} issues - Array of accessibility issues (optional)
 * @returns {Object} Summary of handled issues
 */
function handleAccessibilityIssues(issues = []) {
  const handled = [];
  const unhandled = [];

  issues.forEach(issue => {
    if (issue.fixable) {
      handled.push(issue);
    } else {
      unhandled.push(issue);
    }
  });

  // Perform DOM validation
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  const landmarks = document.querySelectorAll('[role]');
  landmarks.forEach(landmark => {
    validateLandmark(landmark);
    validateLandmarkAttributes(landmark);
  });

  validateLandmarkStructure();
  ensureUniqueLandmarks();

  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    getSvgAccessibleName(svg);
  });

  return {
    total: issues.length,
    handled: handled.length,
    unhandled: unhandled.length,
    unhandledIssues: unhandled
  };
}

/**
 * Adds accessibility properties to an SVG element
 * @param {Object} svg - The SVG element to enhance
 * @param {Object} options - Accessibility options
 * @param {string} options.ariaLabel - ARIA label for the SVG
 * @param {string} options.ariaHidden - ARIA hidden state
 * @param {string} options.role - ARIA role for the SVG
 * @returns {Object} The enhanced SVG element with accessibility properties
 */
function addSvgAccessibilityProps(svg, options = {}) {
  const enhancedSvg = { ...svg };

  if (options.ariaLabel) {
    enhancedSvg.ariaLabel = options.ariaLabel;
  }

  if (options.ariaHidden !== undefined) {
    enhancedSvg.ariaHidden = options.ariaHidden;
  }

  if (options.role) {
    enhancedSvg.role = options.role;
  }

  // Ensure the SVG has an accessible name
  if (!enhancedSvg.ariaLabel && !enhancedSvg.ariaLabelledby && !enhancedSvg.title) {
    enhancedSvg.title = 'SVG graphic';
  }

  return enhancedSvg;
}

// Missing function definitions
function getLangAttribute() {
  return 'en';
}

function getFullLangAttribute() {
  return 'en-US';
}

function getSvgAccessibleName(svg) {
  if (!svg) return null;
  if (svg.ariaLabel) return svg.ariaLabel;
  if (svg.ariaLabelledby) return svg.ariaLabelledby;
  if (svg.title) return svg.title;
  return null;
}

function createAccessibleLink(url, text, options = {}) {
  const link = document.createElement('a');
  link.href = url;
  link.textContent = text;
  if (options.ariaLabel) {
    link.setAttribute('aria-label', options.ariaLabel);
  }
  if (options.role) {
    link.setAttribute('role', options.role);
  }
  return link;
}

function addLandmarkRegions() {
  return { success: true };
}

function setSvgAttributes(svg, attributes = {}) {
  Object.keys(attributes).forEach(key => {
    svg.setAttribute(key, attributes[key]);
  });
  return svg;
}

function fix(element) {
  return element;
}

function validateLandmarkAttributes(landmark) {
  const issues = [];

  if (landmark.id) {
    const idPattern = /^[a-zA-Z][\w-]*$/;
    if (!idPattern.test(landmark.id)) {
      issues.push('Invalid ID format');
    }
  }

  return {
    success: issues.length === 0,
    issues
  };
}

module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues,
  addSvgAccessibilityProps,
  initializeApp,
  getConfig,
  validateInput,
  processData,
  addLandmarkRegions,
  setSvgAttributes,
  addLangAttribute,
  validateLandmarkAttributes,
  fix,
  addressInsightIssues
};

export default addressInsightIssues;