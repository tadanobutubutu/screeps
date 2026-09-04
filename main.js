// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// Import CONFIG
const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || '',
  timeout: 5000
};

// Import the required module
const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast.js');
const path = require('path');

// Import helper functions
const { validateInput, processData, helper, formatDate } = require('./utils');
const { formatResponse } = require('./utils');

// Import table and landmark handling functions (defined later in this file)
const addressAccessibilityIssues = require('./');
const renderDependencyGraphContent = require('./');

// Module exports
module.exports = {
  // Configuration
  config: CONFIG,

  // Application state
  isInitialized: false,
  appState: { initialized: false, lastUpdate: null, cache: {} },
  appData: {},

  // Utility functions
  validateInput,
  processData,
  helper,
  formatDate,
  formatResponse,

  // Accessibility functions
  addressAccessibilityIssues,
  renderDependencyGraphContent,
  logCurrentURL,
  validateItem,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarks,
  scanAccessibility,
  generateAccessibilityReport,
  improveAccessibility,

  // Other functions
  loadLandmarks,
  writeReport,
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

  // Uncomment to run the accessibility report generation
  // generateAccessibilityReport();
}