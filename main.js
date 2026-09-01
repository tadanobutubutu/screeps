const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const { validateInput, processData, formatResponse } = require('./utils/validators');
const { validateLandmark, addMainLandmark, addSvgAccessibleNames, fixTableStructureIssues, fixTableHeaderCellScope, fixFakeLinks, ensureUniqueLandmarks, addLandmarkRoles, setLanguageAttribute, fixTableAccessibility, fixLandmarkIssues, addSvgAccessibility, createAccessibleLinks, generateAccessibilityReport, addressAccessibilityIssues } = require('./accessibility-improvements');
const { a11y } = require('@accessible/react');
import './styles.css';
import { someFunction } from './otherFile';

const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000
};

let appData = {
    title: 'Screeps',
    version: '1.0.0',
    landmarks: []
};

function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

function spawnLandmark(landmarkData) {
    if (!landmarkData || !landmarkData.name || !landmarkData.role) {
        console.warn('Invalid landmark data provided for spawning');
        return null;
    }

    const newLandmark = {
        id: `landmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: landmarkData.name,
        role: landmarkData.role,
        coordinates: landmarkData.coordinates || { x: 0, y: 0 },
        spawnedAt: Date.now()
    };

    appData.landmarks.push(newLandmark);
    return newLandmark;
}

function handleSpawningLogic(maxLandmarks = 100, landmarkConfigs = []) {
    const spawnedLandmarks = [];

    landmarkConfigs.forEach(config => {
        if (appData.landmarks.length < maxLandmarks) {
            const spawned = spawnLandmark(config);
            if (spawned) {
                spawnedLandmarks.push(spawned);
            }
        } else {
            console.warn('Maximum landmark limit reached. Cannot spawn more landmarks.');
        }
    });

    return ensureUniqueLandmarks(spawnedLandmarks);
}

// Rest of the code preserves both changes

// Loads landmarks for accessibility processing
function loadLandmarks() {
    try {
        const filePath = path.join(__dirname, config.dataPath, 'landmarks.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading landmarks:', error.message);
        return [];
    }
}

// Processes and filters landmarks
function processLandmarks(landmarks) {
    if (!landmarks || !Array.isArray(landmarks)) {
        return [];
    }

    const validLandmarks = landmarks.filter(isValidLandmark);
    const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

    return uniqueLandmarks.slice(0, config.maxResults);
}

// Resolves the merge conflict, integrating both sets of changes
const initialize = function () {
  console.log('Initializing application...');

  // Load landmarks for accessibility processing
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);

  const applicationState = {
    initialized: false,
    data: null,
    cache: new Map(),
    lang: 'en' // Added lang property
  };

  const app = express();

  // New function to wrap primary content in <main> for accessibility
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

  // Call the function to wrap the content with <main> in browser environment
  if (typeof window !== 'undefined') {
    wrapPrimaryContentInMain(document.querySelector('div.container'));
  }

  // Ensure functionality from both sets of changes
  const analyzedIssues = scanAccessibility([__filename]);
  if (analyzedIssues.length > 0) {
    generateAccessibilityReport(analyzedIssues);
  }

  // ... (Preserve all existing code, exports, and functions)

  return true;
};

// Main initialization function
const initializeApp = () => {
  console.log('Application initialized');

  // Ensure the app is accessible
  const mainContent = document.querySelector('[role="main"]') || document.querySelector('main');
  if (mainContent) {
    mainContent.setAttribute('aria-label', 'Main content area');
  }

  // Set up keyboard navigation
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });

  // Call accessibility helper functions and exports
  setLanguageAttribute();
  addLandmarkRoles();
  fixFakeLinks();

  // Address accessibility issues
  addressAccessibilityIssues();

  // Create the in-page button
  createInPageButton();

  // Add accessible names to 2 SVGs
  setSvgAccessibleNames('svg1Id', 'svg2Id', ' aria-label for SVG1', ' aria-label for SVG2');

  // Ensure unique landmarks (2 issues)
  ensureUniqueLandmarks();

  // Fix 1 fake link issue
  fixFakeLink();

  // Initialize accessibility features from a11y utilities
  if (a11y && a11y.init) {
    a11y.init();
  }

  // Endpoint for getting landmarks
  app.get('/landmarks', (req, res) => {
    const landmarks = loadLandmarks();
    const processed = processLandmarks(landmarks);
    const sorted = sortLandmarks(processed);

    res.json(sorted);
  });

  function fetchUser(userId) {
    return { id: userId, name: 'User' };
  }

  function clearCache() {
    appData = {
        title: 'Screeps',
        version: '1.0.0',
        landmarks: []
    };
  }

  function main() {
    const initialized = initialize();
    if (initialized) {
      console.log('Application started successfully');
    }
    return initialized;
  }

  // Export all functions
  module.exports = {
    config,
    CONFIG,
    initialize,
    initializeApp,
    main,
    helperFunction: utils.helper,
    analyzeAccessibility,
    scanAccessibility,
    generateAccessibilityReport: generateAccessibilityReportImpl,
    checkLinkAccessibility,
    loadLandmarks,
    processLandmarks,
    sortLandmarks,
    getLandmarkById,
    ensureUniqueLandmarks,
    addressAccessibilityIssues,
    createInPageButton,
    createInPageButtonDOM,
    setSvgAccessibleNames,
    setSvgAccessibleNamesImpl,
    fixFakeLink,
    setLanguageAttribute,
    addLandmarkRoles,
    fixFakeLinks,
    getLangAttribute,
    validateTableAccessibility,
    validateTableStructure: validateTableStructureImpl,
    validateLandmark,
    validateLandmarkStructure,
    validateLandmarkAttributes,
    getSvgAccessibleName: getSvgAccessibleNameImpl,
    validateLinkAccessibility,
    validateLinkAccessibilityObj,
    wrapPrimaryContentInMain,
    handleFakeLinks,
    formatResponse,
    formatResponseUtil,
    // landmark functions
    isValidLandmark,
    landmarkConfig: CONFIG,
    validateInput,
    processData,
    addLandmarkRegions,
    addProperLandmarkRegions,
    setSvgAttributes,
    createAccessibleLinks,
    fetchUser,
    clearCache,
    writeReport,
    functionA: {
      X: 'valueX',
      Y: 'valueY',
      Z: 'valueZ'
    },
    functionB: {
      X: 'valueX',
      Y: 'valueY',
      Z: 'valueZ'
    }
  };
};