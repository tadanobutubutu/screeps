const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  dataPath: './data',
  maxResults: 100
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

import './styles.css';
import { someFunction } from './otherFile';

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

// Helper function to validate landmark structure
function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

// Import required modules
const utils = require('./utils');
const axe = require('axe-core');
const express = require('express');
const fs = require('fs');
const path = require('path');
const validation = require('./validation');
const accessibility = require('./accessibility');
const a11yUtils = require('./a11yUtils');
const styles = require('./styles.css');
const { someFunction } = require('./otherFile');

function HTML(props) {
  const { lang } = props || {};
  return {
    tagName: 'html',
    attributes: { lang: lang || getLangAttribute() },
    children: []
  };
}

// Helper function to validate table accessibility
function validateTableAccessibility(tableElement) {
  if (!tableElement.querySelector('caption')) {
      console.warn('Table missing caption');
      return false;
  }
  return true;
}

// Helper function to validate table structure (merged implementation)
function validateTableStructure(tableElement) {
  const rows = tableElement.querySelectorAll('tr');
  if (rows.length === 0) {
      console.warn('Table has no rows');
      return false;
  }
  return true;
}

// Helper function to validate landmark structure
function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role]');
  let hasMain = false;
  let hasNavigation = false;

  landmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
  });

  return hasMain && hasNavigation;
}

// Helper function to add landmark regions (merged implementation)
function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

// Helper function to get SVG accessible name (merged implementation)
function getSvgAccessibleName(svgElement) {
  const title = svgElement.querySelector('title');
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (title) return title.textContent;
  if (ariaLabel) return ariaLabel;
  return 'Accessible SVG Icon';
}

// Helper function to set SVG attributes
function setSvgAttributes(svg, accessibleName) {
  if (svg && typeof svg === 'object') {
    svg.setAttribute('role', 'img');
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }
  }
  return svg;
}

// Helper function to ensure unique landmarks (merged implementation)
function ensureUniqueLandmarks(landmarksArg) {
  // Merged implementation
  let landmarks = landmarksArg;
  if (!Array.isArray(landmarks)) {
    landmarks = [];
  }
  const elementsById = {};

  if (Array.isArray(landmarks)) {
    for (const landmark of landmarks) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          landmark.id += '_duplicate';
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  // Ensure elementsToCheck is iterable
  landmarks = Array.from(landmarks || []);

  // Check for duplicate accessible names
  const names = [];
  landmarks.forEach(landmark => {
    const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
    if (names.includes(name)) {
      console.warn(`Duplicate accessible name: ${name}`);
    } else {
      names.push(name);
    }
  });

  // Check for duplicate IDs
  const elementsById = {};
  landmarks.forEach(landmark => {
    if (landmark.id) {
      if (elementsById[landmark.id]) {
        console.warn(`Duplicate ID: ${landmark.id}`);
      } else {
        elementsById[landmark.id] = true;
      }
    }
  });

  // Check for duplicate roles (merged from both streams)
  const landmarksByRole = {};
  const allLandmarks = document.querySelectorAll('[role]');

  allLandmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (landmarksByRole[role]) {
      console.warn(`Duplicate landmark role: ${role}`);
    } else {
      landmarksByRole[role] = true;
    }
  });

  return landmarks;
}

// Helper function to initialize app
function initializeApp() {
  appState.initialized = true;
  console.log('Initializing application...');
  return true;
}

// Helper function to get config
function getConfig() {
  return config;
}

// Helper function to validate input
function validateInput(input) {
  return input !== null && input !== undefined;
}

// Helper function to process data
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

// Helper function to create in-page button
function createInPageButton(text, onClick) {
    // Implementation to create accessible in-page button
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    button.setAttribute('aria-label', text);
    return button;
}

// Accessibility scanning function using axe-core library
async function scanAccessibility(filePaths) {
  const issues = [];

  // Check table accessibility
  const tableAccessibilityIssues = await axe.checkTables(document);
  issues.push(...tableAccessibilityIssues);

  // Check landmark accessibility
  const landmarkIssues = await axe.checkLandmarks(document);
  issues.push(...landmarkIssues);

  // Check SVG accessibility
  const svgIssues = await axe.checkSvgs(document);
  issues.push(...svgIssues);

  // Check link accessibility
  const linkIssues = await axe.checkLinks(document);
  issues.push(...linkIssues);

  return issues;
}

// Export all functions for testing and external use
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
  initializeApp,
  getConfig,
  validateInput,
  processData,
  validateLinkAccessibility,
  addLandmarkRegions,
  setSvgAttributes,
  scanAccessibility
};