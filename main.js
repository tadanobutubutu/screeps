import React from 'react';
import express from 'express';
import path from 'path';
import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { isSecureContext } from './utils.js';
import fs from 'fs';

import './styles.less';
import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { CONFIG } from './utils/constants';

// Local configuration for demo purposes
const localConfig = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000
};

// Wrapper for main element to enhance accessibility
function wrapPrimaryContentInMain(parent) {
  if (!parent || typeof parent.nodeType !== 'number') {
    throw new Error('Invalid parent element');
  }

  // If already a main element, return as-is
  if (parent.tagName?.toLowerCase() === 'main') {
    return parent;
  }

  const mainElement = document.createElement('main');
  mainElement.appendChild(parent);

  return mainElement;
}

// Landmark processing functions
function isValidLandmark(landmark) {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
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

function sortLandmarks(landmarks, ascending = true) {
  return landmarks.slice().sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();

    if (ascending) {
      return nameA.localeCompare(nameB);
    }
    return nameB.localeCompare(nameA);
  });
}

function getLandmarkById(landmarks, id) {
  return landmarks.find(landmark => landmark.id === id) || null;
}

function addMainLandmark() {
  // Implementation of addMainLandmark function
  // ...
}

function validateLandmark() {
  // Implementation of validateLandmark function
  // ...
}

function validateLandmarkStructure() {
  // Implementation of validateLandmarkStructure function
  // ...
}

function getSvgAccessibleName() {
  // Implementation of getSvgAccessibleName function
  // ...
}

function setSvgAttributes() {
  // Implementation of setSvgAttributes function
  // ...
}

function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
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

// Accessibility validation functions
function validateTableAccessibility() {
  // Implementation of validateTableAccessibility function
  // ...
}

function validateTableStructure() {
  // Implementation of validateTableStructure function
  // ...
}

function fixTableStructure() {
  // Implementation of fixTableStructure function
  // ...
}

function addProperLandmarkRegions() {
  // Implementation of addProperLandmarkRegions function
  // ...
}

// Generate accessibility report using axe-core
function generateAccessibilityReport() {
  const options = {
    rules: [{ id: 'color-contrast' }, { id: 'aria-roles' }],
  };

  const report = axe.auditWebpage(document.body, options);
  writeReport(report);
  return report;
}

// Wrap primary content in main element for accessibility
function wrapPrimaryContentInMain(parent) {
  if (!parent || typeof parent.nodeType !== 'number') {
    throw new Error('Invalid parent element');
  }

  if (parent.tagName?.toLowerCase() === 'main') {
    return parent;
  }

  const mainElement = document.createElement('main');
  mainElement.appendChild(parent);

  return mainElement;
}

// Utility function
const formatResponse = (data) => {
  return JSON.stringify(data, null, 2);
};

// Import required modules and export the new necessary function(s) here in main.js
const { validateInput } = require('./utils/validators');
const { processData } = require('./utils/processor');

// Application main entry point
const app = express();

// Endpoint for generating an accessibility report
app.get('/accessibility-report', (req, res) => {
  const report = generateAccessibilityReport();
  res.json(report);
});

// Middleware to wrap response in main element
app.use('/', (req, res, next) => {
  wrapPrimaryContentInMain(res.locals.main || res.locals.content);
  next();
});

// Handles the endpoint for getting landmarks
app.get('/landmarks', (req, res) => {
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);
  const sorted = sortLandmarks(processed);

  if (sorted.length > 0) {
    addLangAttribute();
    validateTableAccessibility();
    validateTableStructure();
    fixTableStructure();
    addMainLandmark();
    validateLandmark();
    validateLandmarkStructure();
    getSvgAccessibleName();
    setSvgAttributes();
    handleFakeLinks();
  }

  res.json(sorted);
});

// Import the functions that were moved/added in the new branch
const { createInPageButton } = require('./utils/helpers');

// Main execution when run directly
if (require.main === module) {
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);
  const sorted = sortLandmarks(processed);

  console.log(`Loaded ${landmarks.length} landmarks`);
  console.log(`Processed to ${processed.length} unique landmarks`);
  console.log(`Sorted ${sorted.length} landmarks`);

  if (sorted.length > 0) {
    console.log('First landmark:', sorted[0]);
  }
}

module.exports = {
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  createInPageButton,
  validateInput,
  processData,
  formatResponse,
  config: CONFIG,
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  generateAccessibilityReport
};