const getUserSafety = () => {
  let userSafetyMessage = '';

  if (userSafety !== 'safe') {
    userSafetyMessage = 'User safety level is set to "unsafe". Please review and update this setting for better security.';
  }

  return userSafetyMessage;
};

const getSafetyCategories = () => {
  let safetyCategoriesMessage = '';

  if (safetyCategories.includes('Unauthorized Advice')) {
    safetyCategoriesMessage = 'Safety categories contain unauthorized advice. Please review and update safety categories accordingly.';
  }

  return safetyCategoriesMessage;
};

const dependencies = {};
const books = [];
const safetyCategory = "User Safety: safe";
const userSafety = 'unsafe';
let safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
const axeConfig = {
  rules: {
    'aria-invalid-2': { enabled: false },
    'color-contrast': { enabled: false },
    'name-role-value': { enabled: false },
    'paraphernalia': { enabled: false },
  }
};

// main.js - Application entry point

// Import required modules
const utils = require('./utils');
const axe = require('axe-core');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { a11y } = require('@accessible/react');

// Configuration
const CONFIG = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100
};

// Application configuration (alias for CONFIG)
const config = CONFIG;

// Configurations related to Google Sign-in
const GOOGLE_SIGNIN_CLIENT_ID = process.env.GOOGLE_SIGNIN_CLIENT_ID || '';

// Initialize the Express app
const app = express();

// Helper function to validate landmark structure
function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

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

// Process and filter landmarks
function processLandmarks(landmarks) {
    if (!landmarks || !Array.isArray(landmarks)) {
        return [];
    }

    const validLandmarks = landmarks.filter(isValidLandmark);
    const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

    return uniqueLandmarks.slice(0, config.maxResults);
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

// Ensure unique landmarks by ID
function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return { count: 0, issues: [] };
    }
    const seen = new Set();
    return landmarks.filter(landmark => {
        if (seen.has(landmark.id)) {
            return false;
        }
        seen.add(landmark.id);
        return true;
    });
}

// Helper function to enforce dependency graph role
function ensureDependencyGraphRole(container) {
  if (!container) return;
  if (!container.hasAttribute('role')) {
    container.setAttribute('role', 'img');
  }
  if (!container.getAttribute('aria-label')) {
    container.setAttribute('aria-label', 'Dependency graph');
  }
}

// Import on-demand modules using dependencies object
function importDependencies() {
  Object.entries(dependencies).forEach(([moduleName, dependencyPath]) => {
    try {
      const handleModuleImport = require(dependencyPath);
      const importedModule = typeof handleModuleImport === 'function' ? handleModuleImport() : handleModuleImport;
      global[moduleName] = importedModule;
    } catch (error) {
      console.error(`Failed to import module "${moduleName}":`, error.message);
    }
  });
}

// Create an API endpoint for easy access to the currently loaded modules
app.get('/api/dependencies', (req, res) => {
  res.json(dependencies);
});

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleAccessibilityIssues())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// Import accessibility helper and utilities
const accessiblyHelper = require('./accessibly-helper');

// Initialization function
function initialize() {
  console.log('Initializing application...');

  // Load landmarks for accessibility processing
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);

  // Ensure the dependencyGraph container has a proper ARIA role
  if (dependencyGraph) {
    if (!dependencyGraph.id) {
      dependencyGraph.id = 'dependencyGraph';
    }
    if (!dependencyGraph.hasAttribute('role')) {
      dependingGraph.setAttribute('role', 'region');
    }
    if (!dependencyGraph.hasAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
    }
  }

  // Initialize Google Sign-in (if provided client ID)
  if (GOOGLE_SIGNIN_CLIENT_ID) {
    googleSignIn.initialize(GOOGLE_SIGNIN_CLIENT_ID);
  }

  // Define routes and controllers
  app.route('/').get(index);
  app.route('/books').get(booksController.index);
  app.route('/books/:id').get(booksController.show);
  app.route('/books').post(booksController.store);
  app.route('/books/:id').put(booksController.update);
  app.route('/books/:id').delete(booksController.destroy);

  // Specify API v1 version
  app.use('/api/v1', express.json());
  // Load API controllers
  const booksApi = require('./api/booksControllerV1');
  app.use('/api/v1/books', booksApi);

  // Load middleware
  app.use(badgeCount);
  app.use(logger);

  // Use a11y utilities for accessibility enhancements
  if (a11y && a11y.init) {
    a11y.init();
  }

  // Handle error scenarios
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

// Export necessary functions and objects
module.exports = {
  getUserSafety,
  getSafetyCategories,
  dependencies,
  books,
  initialize,
  axeConfig,
  ensureDependencyGraphRole,
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarks,
  accessiblyHelper,
  badgeCount,
  logger,
  index,
  GOOGLE_SIGNIN_CLIENT_ID
};