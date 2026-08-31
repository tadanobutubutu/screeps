// main.js

// Configuration
const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000,
  debug: true,
  version: '1.0.0'
};

// Application state
const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

// Validate landmark object with comprehensive checks
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

// Ensure landmark uniqueness
function ensureLandmarkUniqueness(elements) {
  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          landmark.id += '_duplicate';
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  return elements;
}

// Initialize application
function initializeApp() {
  appState.initialized = true;
  console.log('Initializing application...');
  return true;
}

function setupHandlers() {
  console.log('Setting up event handlers...');
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

function main() {
  initializeApp();
  setupHandlers();
  return processData;
}

// Utility functions for accessibility (environment-agnostic)
function getLangAttribute() {
  return typeof document !== 'undefined' && document.documentElement ? document.documentElement.lang : 'en';
}

function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

function sortByAuthor(a, b) {
  return a.author.localeCompare(b.author);
}

function generateKey(book) {
  return `${book.title}-${book.author}`.replace(/\s+/g, '-').toLowerCase();
}

function countDependencies(obj) {
  if (!obj || typeof obj !== 'object') return 0;
  let count = 0;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      count++;
      if (typeof obj[key] === 'object') {
        count += countDependencies(obj[key]);
      }
    }
  }
  return count;
}

// Validate landmark structure for accessibility issues
function validateLandmarkStructure() {
  const results = {
    hasMain: false,
    hasNav: false,
    hasHeader: false,
    hasFooter: false,
    issues: []
  };
  
  if (typeof document !== 'undefined' && document.querySelector) {
    // Check for main landmark - critical for screen reader navigation
    const mainElement = document.querySelector('main, [role="main"]');
    results.hasMain = mainElement !== null;
    
    // Check for navigation landmark
    const navElement = document.querySelector('nav, [role="navigation"]');
    results.hasNav = navElement !== null;
    
    // Check for header/banner landmark
    const headerElement = document.querySelector('header, [role="banner"]');
    results.hasHeader = headerElement !== null;
    
    // Check for footer landmark
    const footerElement = document.querySelector('footer, [role="contentinfo"]');
    results.hasFooter = footerElement !== null;
    
    // Report missing main landmark as critical issue
    if (!results.hasMain) {
      results.issues.push('Missing main landmark. Screen readers rely on this to identify primary content.');
    }
  }
  
  return results;
}

// Calculate sum utility
function calculateSum(a, b) {
  return a + b;
}

// Format date utility
function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

// Helper utility
const helper = {
  formatDate,
  calculateSum
};

if (require.main === module) {
  main();
  console.log('Main function executed');
}

module.exports = {
  config,
  appState,
  appData,
  landmarks,
  validateLandmarkObject,
  ensureLandmarkUniqueness,
  initializeApp,
  setupHandlers,
  validateInput,
  processData,
  main,
  getLangAttribute,
  sortByTitle,
  sortByAuthor,
  generateKey,
  countDependencies,
  validateLandmarkStructure,
  calculateSum,
  formatDate,
  helper
};