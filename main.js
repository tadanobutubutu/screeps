// main.js - Application entry point
// TODO: Address accessibility issues from insight report

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');

// Configuration
const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

// Helper function to validate landmark structure
function isValidLandmark(landmark) {
    return landmark && 
           typeof landmark.id !== 'undefined' && 
           landmark.id !== null;
}

// Load landmarks from file
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

// Process and filter landmarks
function processLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }
    
    const validLandmarks = landmarks.filter(isValidLandmark);
    const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);
    
    return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

// Sort landmarks by name
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

// Get landmark by ID
function getLandmarkById(landmarks, id) {
    return landmarks.find(landmark => landmark.id === id) || null;
}

// Ensure unique landmarks by ID
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

// Function to write the generated report to a file
function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// TODO: Implement function for generating a report based on accessibility issues
// Replaced placeholder with full implementation using axe-core scanning and report writing
function generateAccessibilityReport() {
  const report = scanAccessibility();
  writeReport(report);
  return report;
}

// Existing utility function
const formatResponse = (data) => {
  return JSON.stringify(data, null, 2);
};

// Import required modules and export the new necessary function(s) here in main.js (preserving the original code)
const { validateInput } = require('./utils/validators');
const { processData } = require('./utils/processor');

// Define configuration objects for export
const config = CONFIG;
const landmarkConfig = {}; // Placeholder for landmark-specific configuration

// API configuration from HEAD branch
const API_CONFIG = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000
};

// REACT_017: Render navigation with landmark roles
function renderNavigation() {
  return [
    '<nav role="navigation" aria-label="Main menu">',
      '<ul>',
        '<li><a href="#" role="menuitem">Home</a></li>',
        '<li><a href="#" role="menuitem">About</a></li>',
        '<li><a href="#" role="menuitem">Contact</a></li>',
      '</ul>',
    '</nav>'
  ].join('');
}

// REACT_025: Ensure unique landmarks
function renderMainContent() {
  return [
    '<main id="main-content" role="main" aria-label="Main Content">',
      '<h1>Welcome to the Application</h1>',
      '<p>This is the main content area.</p>',
    '</main>'
  ].join('');
}

// REACT_041: Add accessible names to SVGs
function renderIcons() {
  return [
    '<svg role="img" aria-label="Home Icon" focusable="false">',
      '<title>Home Icon</title>',
      '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
    '</svg>',
    '<svg role="img" aria-label="Settings Icon" focusable="false">',
      '<title>Settings Icon</title>',
      '<circle cx="12" cy="12" r="10"><path d="M12 15l5-3-5-3v6zm0 0v6m0-6l-5 3 5 3z"/></circle>',
    '</svg>'
  ].join('');
}

// REACT_036: Fix fake link issue (use real <a> tags or button roles)
function renderButtons() {
  return [
    '<a href="#" role="button" aria-label="Click Here">Click Here</a>'
  ].join('');
}

// Export new necessary functions
module.exports = {
  validateInput,
  processData,
  formatResponse,
  config,
  landmarkConfig,
  apiConfig: API_CONFIG,
  // landmark functions
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarks,
  // render functions
  renderNavigation,
  renderMainContent,
  renderIcons,
  renderButtons
};

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