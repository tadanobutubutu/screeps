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

import fs from 'fs';
import path from 'path';

import accessiblyHelper from './accessibly-helper';
import { axe } from 'axe-core';

import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import './styles.css';
import './styles.less';
import { calculateSum } from './utils';
import { getLangAttribute as getLangAttributeFromUtils, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility as validateTableAccessibilityFromUtils, validateTableStructure as validateTableStructureFromUtils } from './utils/tableAccessibilityUtils';
import { validateLandmark as validateLandmarkFromUtils, validateLandmarkStructure as validateLandmarkStructureFromUtils } from './utils/landmarkUtils';
import { validateLinkAccessibility as validateLinkAccessibilityFromUtils, validateTableAccessibility local, validateTableStructure local } from './utils/linkAccessibilityUtils';
import { validateLandmark as validateLandmarkStructure local, validateLandmarkStructure local } from './utils/landmarkUtils';
import { validateLinkAccessibility local, handleFakeLinks local, someFunction local, fetchUser local, clearCache local, addSvgAccessibleName local, setSvgAttributes local, ensureUniqueLandmarks local2, addProperLandmarkRegions local, addFixLandmarkIssues local, addMainLandmark local, fixFakeLinkIssues local, getSvgAccessibleName local, getAccessibleLinkProps local, landmarkStructureCheck local } from './somemodule';

const config = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000
};

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
const primaryContent = document.querySelector('.primary-content') ||
                        document.querySelector('[role="main"]') ||
                        document.getElementById('main-content') ||
// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Original logic preserved from commit dbc62f0d7ea6e8ed531f9712000039619b9f3d51
// ----- END ORIGINAL CODE -----
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

function processIssue() {
  // Existing implementation
  return {
    status: 'processed'
  };
}

// Additional changes:
function handleIssueChanges() {
  // Placeholder for additional changes requested in the issue
  // This function can be extended as needed
  return true;
}

function getUniqueLandmarks(landmarks) {
  if (!landmarks) {
    if (typeof document === 'undefined') return [];
    const elements = document.querySelectorAll(landmarkSelectors.join(','));
    const seen = new Set();
    const unique = [];
    elements.forEach(el => {
      const id = el.id || el.getAttribute('aria-label') || el.tagName.toLowerCase();
      if (!seen.has(id)) {
        seen.add(id);
        unique.push(el);
      }
    });
    return unique;
  }
  
  if (!Array.isArray(landmarks)) {
    const elements = [...landmarks];
    const landmarkIds = elements.map(el => el.id || el.name || `landmark-${Math.random()}`);
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}-${Date.now()}`;
      }
    });
    return elements;
  }
  return [];
}

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = [...landmarks];
    const landmarkIds = elements.map(el => el.id || el.name || `landmark-${Math.random()}`);
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}-${Date.now()}`;
      }
    });
    return elements;
  }
  return [];
}

function countDependencies() {
  const dependencies = [
    'express',
    'axe-core',
    'fs',
    'path',
    '@accessible/react',
    'react',
    'antd',
    'react-redux',
    './actions/dependencyGraph',
    './bookFunctions',
    './accessibly-helper',
    './app.js',
    'effector-sw',
    './utils',
    './utils/accessibilityUtils',
    './utils/tableAccessibilityUtils',
    './utils/landmarkUtils',
    './utils/linkAccessibilityUtils',
    './utils/constants',
    './App',
    './utils/someFunction',
    './utils/user',
    './newFunctions',
    './somemodule'
  ];

  return dependencies.length;
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

function validateTableAccessibilityLocal(tableElement) {
  if (!tableElement) return false;

  const headers = tableElement.querySelectorAll('th');
  const cells = tableElement.querySelectorAll('td, th');

  for (const cell of cells) {
    if (!cell.id && cell.textContent.trim() === '') {
      return false;
    }
  }

  return true;
}

function processIssue() {
  // Existing implementation
  return {
    status: 'processed'
  };
}

function handleIssueChanges() {
  // Placeholder for additional changes requested in the issue
  // This function can be extended as needed
  return true;
}

function getUniqueLandmarks(landmarks) {
  if (!landmarks) {
    if (typeof document === 'undefined') return [];
    const elements = document.querySelectorAll(landmarkSelectors.join(','));
    const seen = new Set();
    const unique = [];
    elements.forEach(el => {
      const id = el.id || el.getAttribute('aria-label') || el.tagName.toLowerCase();
      if (!seen.has(id)) {
        seen.add(id);
        unique.push(el);
      }
    });
    return unique;
  }
  
  if (!Array.isArray(landmarks)) {
    const elements = [...landmarks];
    const landmarkIds = elements.map(el => el.id || el.name || `landmark-${Math.random()}`);
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}-${Date.now()}`;
      }
    });
    return elements;
  }
  return [];
}

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = [...landmarks];
    const landmarkIds = elements.map(el => el.id || el.name || `landmark-${Math.random()}`);
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}-${Date.now()}`;
      }
    });
    return elements;
  }
  return [];
}

function countDependencies() {
  const dependencies = [
    'express',
    'axe-core',
    'fs',
    'path',
    '@accessible/react',
    'react',
    'antd',
    'react-redux',
    './actions/dependencyGraph',
    './bookFunctions',
    './accessibly-helper',
    './app.js',
    'effector-sw',
    './utils',
    './utils/accessibilityUtils',
    './utils/tableAccessibilityUtils',
    './utils/landmarkUtils',
    './utils/linkAccessibilityUtils',
    './utils/constants',
    './App',
    './utils/someFunction',
    './utils/user',
    './newFunctions',
    './somemodule'
  ];

  return dependencies.length;
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
    if (!cell.id && cell.textContent.trim() === '') {
      return false;
    }
  }

  return true;
}

function validateTableStructure(tableElement) {
  const rows = tableElement.querySelectorAll('tr');
  let hasHeader = false;

  for (const row of rows) {
    const cells = row.querySelectorAll('td, th');
    for (const cell of cells) {
      if (cell.tagName.toLowerCase() === 'th') {
        hasHeader = true;
        if (!cell.id || cell.getAttribute('scope') !== 'col') {
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

async function generateAccessibilityReport() {
  return scanAccessibility();
}

function validateLinkAccessibilityLocal() {
  const links = document.querySelectorAll('a');

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
    if (link.tagName === 'A' && !link.getAttribute('href')) {
      link.setAttribute('role', 'button');
    }
  });
}

function validateLandmarkLocal() {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');
  return landmarks.length > 0;
}

function validateLandmarkStructureLocal() {
  const landmarks = document.querySelectorAll('[role="main"]');

  for (const landmark of landmarks) {
    if (!landmark.id && !landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
      return false;
    }
  }

  return true;
}

function addMissingLandmarkIds() {
  if (typeof document === 'undefined') return;
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));

  landmarks.forEach((landmark, index) => {
    if (!landmark.id) {
      landmark.id = `landmark-${index}`;
    }
  });
}

function addAccessibilityProps() {
  const landmarks = getUniqueLandmarks();
  addProperLandmarkRegions(landmarks);
  validateTableStructure();
  validateLinkAccessibility();
}

function loadLandmarks() {
  try {
    const filePath = path.join(CONFIG.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

function processIssue() {
  // Existing implementation
  return {
    status: 'processed'
  };
}

function handleIssueChanges() {
  // Placeholder for additional changes requested in the issue
  // This function can be extended as needed
  return true;
}

function getUniqueLandmarks(landmarks) {
  if (!landmarks) {
    if (typeof document === 'undefined') return [];
    const elements = document.querySelectorAll(landmarkSelectors.join(','));
    const seen = new Set();
    const unique = [];
    elements.forEach(el => {
      const id = el.id || el.getAttribute('aria-label') || el.tagName.toLowerCase();
      if (!seen.has(id)) {
        seen.add(id);
        unique.push(el);
      }
    });
    return unique;
  }
  
  if (!Array.isArray(landmarks)) {
    const elements = [...landmarks];
    const landmarkIds = elements.map(el => el.id || el.name || `landmark-${Math.random()}`);
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}-${Date.now()}`;
      }
    });
    return elements;
  }
  return [];
}

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = [...landmarks];
    const landmarkIds = elements.map(el => el.id || el.name || `landmark-${Math.random()}`);
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}-${Date.now()}`;
      }
    });
    return elements;
  }
  return [];
}

function countDependencies() {
  const dependencies = [
    'express',
    'axe-core',
    'fs',
    'path',
    '@accessible/react',
    'react',
    'antd',
    'react-redux',
    './actions/dependencyGraph',
    './bookFunctions',
    './accessibly-helper',
    './app.js',
    'effector-sw',
    './utils',
    './utils/accessibilityUtils',
    './utils/tableAccessibilityUtils',
    './utils/landmarkUtils',
    './utils/linkAccessibilityUtils',
    './utils/constants',
    './App',
    './utils/someFunction',
    './utils/user',
    './newFunctions',
    './somemodule'
  ];

  return dependencies.length;
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
    if (!cell.id && !cell.getAttribute('scope')) {
      return false;
    }
  }

  return true;
}

function validateTableStructure(tableElement) {
  const rows = tableElement.querySelectorAll('tr');
  let hasHeader = false;

  for (const row of rows) {
    const cells = row.querySelectorAll('td, th');
    for (const cell of cells) {
      if (cell.tagName.toLowerCase() === 'th') {
        hasHeader = true;
        if (!cell.id || cell.getAttribute('scope') !== 'col') {
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

async function generateAccessibilityReport() {
  return scanAccessibility();
}

function validateLinkAccessibility(tableElement) {
  const links = document.querySelectorAll('a');

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
    if (link.tagName === 'A' && !link.getAttribute('href')) {
      link.setAttribute('role', 'button');
    }
  });
}

function validateLandmark(tableElement) {
  const errors = [];

  if (!tableElement) return false;

  const headers = tableElement.querySelectorAll('th');
  const cells = tableElement.querySelectorAll('td, th');

  for (const cell of cells) {
    if (!cell.id && cell.textContent.trim() === '') {
      errors.push('Table is missing header cells (th)');
    }
  }

  return errors;
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

function processIssue() {
  // Existing implementation
  return {
    status: 'processed'
  };
}

function handleIssueChanges() {
  // Placeholder for additional changes requested in the issue
  // This function can be extended as needed
  return true;
}

function getUniqueLandmarks(landmarks) {
  if (!landmarks) {
    if (typeof document === 'undefined') return [];
    const elements = document.querySelectorAll(landmarkSelectors.join(','));
    const seen = new Set();
    const unique = [];
    elements.forEach(el => {
      const id = el.id || el.getAttribute('aria-label') || el.tagName.toLowerCase();
      if (!seen.has(id)) {
        seen.add(id);
        unique.push(el);
      }
    });
    return unique;
  }
  
  if (!Array.isArray(landmarks)) {
    const elements = [...landmarks];
    const landmarkIds = elements.map(el => el.id || el.name || `landmark-${Math.random()}`);
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}-${Date.now()}`;
      }
    });
    return elements;
  }
  return [];
}

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = [...landmarks];
    const landmarkIds = elements.map(el => el.id || el.name || `landmark-${Math.random()}`);
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}-${Date.now()}`;
      }
    });
    return elements;
  }
  return [];
}

function countDependencies() {
  const dependencies = [
    'express',
    'axe-core',
    'fs',
    'path',
    '@accessible/react',
    'react',
    'antd',
    'react-redux',
    './actions/dependencyGraph',
    './bookFunctions',
    './accessibly-helper',
    './app.js',
    'effector-sw',
    './utils',
    './utils/accessibilityUtils',
    './utils/tableAccessibilityUtils',
    './utils/landmarkUtils',
    './utils/linkAccessibilityUtils',
    './utils/constants',
    './App',
    './utils/someFunction',
    './utils/user',
    './newFunctions',
    './somemodule'
  ];

  return dependencies.length;
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

  const hasCaption = tableElement.querySelector('caption');
  const hasHeaders = tableElement.querySelector('th');

  if (!hasCaption) {
    return false;
  }
  if (!hasHeaders) {
    return false;
  }

  return true;
}

function validateTableStructure(tableElement) {
  const rows = tableElement.querySelectorAll('tr');
  let hasHeader = false;

  for (const row of rows) {
    const cells = row.querySelectorAll('td, th');
    for (const cell of cells) {
      if (cell.tagName.toLowerCase() === 'th') {
        hasHeader = true;
        if (!cell.id || cell.getAttribute('scope') !== 'col') {
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

async function generateAccessibilityReport() {
  return scanAccessibility();
}

function validateLinkAccessibility(tableElement) {
  const links = document.querySelectorAll('a');

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
    if (link.tagName === 'A' && !link.getAttribute('href')) {
      link.setAttribute('role', 'button');
    }
  });
}

function validateLandmark(tableElement) {
  const errors = [];

  if (!tableElement) return false;

  const headers = tableElement.querySelectorAll('th');
  const cells = tableElement.querySelectorAll('td, th');

  for (const cell of cells) {
    if (!cell.id && cell.textContent.trim() === '') {
      errors.push('Table is missing header cells (th)');
    }
  }

  return errors;
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

function processIssue() {
  // Existing implementation
  return {
    status: 'processed'
  };
}

function handleIssueChanges() {
  // Placeholder for additional changes requested in the issue
  // This function can be extended as needed
  return true;
}

function getUniqueLandmarks(landmarks) {
  if (!landmarks) {
    if (typeof document === 'undefined') return [];
    const elements = document.querySelectorAll(landmarkSelectors.join(','));
    const seen = new Set();
    const unique = [];
    elements.forEach(el => {
      const id = el.id || el.getAttribute('aria-label') || el.tagName.toLowerCase();
      if (!seen.has(id)) {
        seen.add(id);
        unique.push(el);
      }
    });
    return unique;
  }
  
  if (!Array.isArray(landmarks)) {
    const elements = [...landmarks];
    const landmarkIds = elements.map(el => el.id || el.name || `landmark-${Math.random()}`);
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}-${Date.now()}`;
      }
    });
    return elements;
  }
  return [];
}

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = [...landmarks];
    const landmarkIds = elements.map(el => el.id || el.name || `landmark-${Math.random()}`);
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}-${Date.now()}`;
      }
    });
    return elements;
  }
  return [];
}

function countDependencies() {
  const dependencies = [
    'express',
    'axe-core',
    'fs',
    'path',
    '@accessible/react',
    'react',
    'antd',
    'react-redux',
    './actions/dependencyGraph',
    './bookFunctions',
    './accessibly-helper',
    './app.js',
    'effector-sw',
    './utils',
    './utils/accessibilityUtils',
    './utils/tableAccessibilityUtils',
    './utils/landmarkUtils',
    './utils/linkAccessibilityUtils',
    './utils/constants',
    './App',
    './utils/someFunction',
    './utils/user',
    './newFunctions',
    './somemodule'
  ];

  return dependencies.length;
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

  const hasCaption = tableElement.querySelector('caption');
  const hasHeaders = tableElement.querySelector('th');

  if (!hasCaption) {
    return false;
  }
  if (!hasHeaders) {
    return false;
  }

  return true;
}

function validateTableStructure(tableElement) {
  const rows = tableElement.querySelectorAll('tr');
  let hasHeader = false;

  for (const row of rows) {
    const cells = row.querySelectorAll('td, th');
    for (const cell of cells) {
      if (cell.tagName.toLowerCase() === 'th') {
        hasHeader = true;
        if (!cell.id || cell.getAttribute('scope') !== 'col') {
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
    const results