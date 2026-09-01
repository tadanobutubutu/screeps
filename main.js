const { a11y } = require('@accessible/react');

// main.js - Entry point for the application

// Import required modules
const utils = require('./utils');
const axe = require('axe-core');
const express = require('express');
const fs = require('fs');
const path = require('path');

// Scan accessibility of a specified URL using axe-core (from both branches)
async function scanAccessibility(url) {
  const options = {
    elementsOnly: true
  };

  try {
    const axeInstance = axe.createInstance(options);
    const results = await axeInstance.analyze(url);
    const formattedResults = formatAccessibilityReport(results);
    return formattedResults;
  } catch (error) {
    console.error('Error in scanAccessibility:', error.message);
    throw error;
  }
}

// Generate a structured accessibility report from axe-core's results (from both branches)
function formatAccessibilityReport(results) {
  const violations = results.violations.map(violation => ({
    id: violation.id,
    help: violation.help,
    nodes: violation.nodes
        .map(node => ({
          line: node.lineNumber,
          column: node.columnNumber,
          attribute: node.ancestors.attr,
          tag: node.ancestors.tagName
        })),
    rule: {
      id: violation.rules.id,
      help: violation.rules.help
    }
  }));

  return { violations };
}

// Function to count dependencies (from origin/main branch)
function countDependencies() {
  console.log('Counting dependencies...');
  // Placeholder implementation
}

// Function to create in-page buttons (flexible version) (from origin/main branch)
function createInPageButton(buttonText = 'Accessibility Info', onClickHandler = function() {}) {
    if (typeof document === 'undefined') return null;
    const button = document.createElement('button');
    button.textContent = buttonText;
    button.onclick = onClickHandler;
    return button;
}

// Helper function to ensure proper focus management for components when needed (From HEAD branch)
function ensureFocus() {
    if (typeof document === 'undefined') return;

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });

    // Trap focus within the container when the user uses the keyboard
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    //Add custom focus management for specific elements (if required)
    // For example:
    // document.querySelector('[data-custom-focus]').addEventListener('focus', function() {
    //     document.body.classList.add('keyboard-focus');
    // });
}

// Load landmarks for accessibility processing (from HEAD branch, with some modifications for Node.js compatibility)
function loadLandmarks() {
    try {
        const dataFile = path.join(__dirname, CONFIG.dataPath, 'landmarks.json');
        if (fs.existsSync(dataFile)) {
            const data = fs.readFileSync(dataFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading landmarks:', error.message);
    }
    return [];
}

// Import Required Modules
const utils = require('./utils');

// Initialize the application and set up A11y utilities (from HEAD branch)
function initializeApp() {
    console.log('Initializing application with accessibility support...');

    // Set up A11y utilities
    if (a11y && a11y.init) {
        a11y.init();
    }

    // Fix table structure issues for React components
    if (typeof document !== 'undefined') {
        fixTableStructure();
    }

    // Ensure focus management for components (merged from both branches)
    if (typeof document !== 'undefined') {
        ensureFocus();
    }

    // Initialize screen reader support (if A11y and speak options are available)
    if (typeof document !== 'undefined' && a11y && a11y.speak) {
        a11y.speak('Welcome to the application', 'assertive');
    }

    // Load landmarks for accessibility processing (from HEAD branch)
    const landmarks = loadLandmarks();
    const processed = processLandmarks(landmarks);

    // Address accessibility issues (from HEAD branch)
    addressAccessibilityIssues(processed);
}

// Exports
module.exports = {
    CONFIG,
    initializeApp,
    scanAccessibility,
    loadLandmarks,
    processLandmarks,
    countDependencies,
    createInPageButton,
    ensureFocus,
    // ... other exports if necessary from both branches, or add new ones if needed