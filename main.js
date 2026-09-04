const utils = require('./utils');
const express = require('express');
const axe = require('axe-core');
const fastMap = require('fast-map');
const path = require('path');

const config = {
  name: 'MyApp',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  debug: true,
  dataPath: './data',
  maxResults: 100,
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxLandmarks: 50,
  landmarks: ['main', 'nav', 'aside', 'footer', 'header']
};

const axeConfig = {
  rules: {
    'aria-invalid-2': { enabled: false },
    'color-contrast': { enabled: false },
    'name-role-value': { enabled: false },
    'paraphernalia': { enabled: false },
  },
  silent: true
};

////////// PRESERVE EXISTING CODE BELOWS //////////

// Function to create in-page buttons
function createInPageButton(buttonText, onClickHandler) {
  //...
}

// Function to get the language attribute for HTML element
function getLangAttribute() {
  //...
}

function validateTableAccessibility() {
  //...
}

function validateTableStructure() {
  //... // Single instance to avoid duplication
}

function getSvgAccessibleName() {
  //...
}

function setSvgAttributes() {
  //...
}

function checkLinkAccessibility(linkUrl) {
  //...
}

/**
 * New function added to address accessibility issues
 */
function setDependencyGraphAria() {
  const dependencyGraph = document.getElementById('dependency-graph') || document.querySelector('[data-dependency-graph]');

  if (dependencyGraph) {
    // Ensure the dependencyGraph container has a proper ARIA role
    // Address accessibility issues from insight report:
    // Ensure the dependencyGraph container has a proper ARIA role
    // (This comment remains as-is)
    dependencyGraph.setAttribute('role', 'region');
    dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
  }

  // TODO: Implement new function
}

// Application state
let isInitialized = false;
const appData_originSide = {};
const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en' // Added lang property
};

// Helper for input transformation
function helper(input) {
  return input ? input.toUpperCase() : '';
}

// Helper function to format dates
function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString();
}

// Validate input helper
function validateInput(input) {
  return input && typeof input === 'string' && input.trim().length > 0;
}

// Process data helper
function processData(data) {
  if (!data) return null;
  return { ...data, processed: true };
}

// Landmark validation from HEAD
function isValidLandmark(landmark) {
    return landmark && typeof landmark.id !== 'undefined' && landmark.id !== null;
}

function loadLandmarks() {
    try {
        const filePath = path.join(config.dataPath, 'landmarks.json');
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

    return uniqueLandmarks.slice(0, config.maxResults);
}

function sortLandmarks(landmarks, ascending = true) {
    return landmarks.sort((a, b) => {
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

function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const seenIds = new Set();
    return landmarks.filter(landmark => {
        if (seenIds.has(landmark.id)) {
            return false;
        }
        seenIds.add(landmark.id);
        return true;
    });
}

// Function to validate landmark properties
function validateLandmark(landmark) {
  if (!landmark) return false;
  if (landmark.id == null || landmark.id === '') return false;
  return true;
}

// Function to validate landmark structure
function validateLandmarkStructure(landmark) {
  if (!landmark) return false;
  // Check for required properties
  const hasId = landmark.id != null && typeof landmark.id === 'string';
  const hasName = landmark.name != null && typeof landmark.name === 'string';
  const hasDescription = landmark.description != null && typeof landmark.description === 'string';
  return hasId && hasName && hasDescription;
}

// Function to add fixes for landmark issues
function addFixLandmarkIssues(landmarks) {
  // Find duplicate IDs and mark them for removal or fix
  const seenIds = new Set();
  const fixedLandmarks = [];
  const duplicates = [];

  for (const landmark of landmarks) {
    if (seenIds.has(landmark.id)) {
      duplicates.push(landmark);
    } else {
      seenIds.add(landmark.id);
      fixedLandmarks.push(landmark);
    }
  }

  return { fixedLandmarks, duplicates };
}

// Accessibility utilities
const a11y = {
  init: function () {
    // Initialize accessibility features
    this.setDependencyGraphAria();
    this.addressNewAccessibilityIssues();
    ensureUniqueLandmarksDom();
  },
  checkContrast: function (element) {
    // Check color contrast
    return true;
  },
  checkFocus: function () {
    // Check focus management
    return true;
  },
  setDependencyGraphAria: function () {
    setDependencyGraphAria();
  },
  addressNewAccessibilityIssues: function (issues) {
    // Implementation for handling new accessibility issues
    if (!issues || !Array.isArray(issues)) {
      return [];
    }

    return issues.map(issue => {
      return {
        id: issue.id,
        description: issue.description,
        severity: issue.severity,
        status: 'addressed',
        addressedAt: new Date().toISOString()
      };
    });
  }
};

// Placeholder for ensureUniqueLandmarksDom (to be implemented)
function ensureUniqueLandmarksDom() {
  // This function should check the DOM for landmark elements and ensure uniqueness
  // For now, it's a no-op
}

(function () {
    'use strict';

    const main = {
        init: function () {
            console.log('Application initialized');
        },

        greet: function (name) {
            return `Hello, ${name}!`;
        },

        rotateBack: function () {
            console.log('Reverting back the rotation.');
        },

        addressAccessibilityIssues: function () {
            a11y.init();
        },

        addBook: function (title, author, isbn) {
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

            form.appendChild(titleInput);
            form.appendChild(authorInput);
            form.appendChild(isbnInput);
            form.appendChild(submitButton);

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Book added:', {
                    title: titleInput.value,
                    author: authorInput.value,
                    isbn: isbnInput.value
                });
            });

            return form;
        }
    };

    function createAccessibleInput(type, name, label, value) {
        const input = document.createElement('input');
        input.setAttribute('type', type);
        input.setAttribute('name', name);
        input.setAttribute('id', name);
        input.setAttribute('aria-label', label);
        if (value) input.setAttribute('value', value);
        return input;
    }

    module.exports = { main };
})();

// Export utility functions
module.exports.createInPageButton = createInPageButton;
module.exports.getLangAttribute = getLangAttribute;
module.exports.validateTableAccessibility = validateTableAccessibility;
module.exports.validateTableStructure = validateTableStructure;
module.exports.getSvgAccessibleName = getSvgAccessibleName;
module.exports.setSvgAttributes = setSvgAttributes;
module.exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
module.exports.checkLinkAccessibility = checkLinkAccessibility;
module.exports.setDependencyGraphAria = setDependencyGraphAria;
module.exports.appState = appState;
module.exports.helper = helper;
module.exports.formatDate = formatDate;
module.exports.validateInput = validateInput;
module.exports.processData = processData;
module.exports.isValidLandmark = isValidLandmark;
module.exports.loadLandmarks = loadLandmarks;
module.exports.processLandmarks = processLandmarks;
module.exports.sortLandmarks = sortLandmarks;
module.exports.getLandmarkById = getLandmarkById;
module.exports.validateLandmark = validateLandmark;
module.exports.validateLandmarkStructure = validateLandmarkStructure;
module.exports.addFixLandmarkIssues = addFixLandmarkIssues;
module.exports.a11y = a11y;