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

// Function to write the generated report to a file (for accessibility issues)
function writeAccessibilityReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Analyze accessibility of a given URL using axe-core
async function scanAccessibility(url) {
  const options = {
    elementsOnly: true,
    // ...other axe-core options if needed...
  };
  const axeInstance = axe.createInstance(options);
  const results = await axeInstance.analyze(url);
  const formattedResults = formatAccessibilityReport(results);
  return formattedResults;
}

// Format accessibility report from axe-core's results
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

// TODO: Implement function for generating a report based on accessibility issues
function generateAccessibilityReport() {
  const url = 'YOUR_WEBSITE_URL'; // Replace with the URL to be scanned
  return scanAccessibility(url)
    .then(report => {
      writeAccessibilityReport(report);
      return report;
    })
    .catch(error => {
      console.error('Error running accessibility scan:', error.message);
    });
}

// Existing utility function (preserved)
const formatResponse = (data) => {
  return JSON.stringify(data, null, 2);
};

// Import required modules and export the new necessary function(s) here in main.js (preserving the original code)
const { validateInput } = require('./utils/validators');
const { processData } = require('./utils/processor');

// Export new necessary functions
module.exports = {
  validateInput,
  processData,
  formatResponse,
  config,
  // landmark functions
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarks,
  generateAccessibilityReport // Add this export for the new function
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

  // Call the function to generate the accessibility report
  // Uncomment this line if you want to generate a report during local testing:
  // generateAccessibilityReport();
}