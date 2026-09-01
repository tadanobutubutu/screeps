// main.js - Application entry point
const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Implemented validateLandmark functionality

// TODO: Address accessibility issues from insight report:
// ... (Removed hashes for ease of reading)

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

// Function to load landmarks from file
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
    const seenIds = new Set();
    const unique = [];
    
    landmarks.forEach(landmark => {
        if (!seenIds.has(landmark.id)) {
            seenIds.add(landmark.id);
            unique.push(landmark);
        }
    });
    
    return unique;
}

// Function to generate accessibility report
module.exports.generateAccessibilityReport = function(issues) {
  if (!Array.isArray(issues)) {
    throw new Error('Issues must be provided as an array');
  }

  const report = {
    totalIssues: issues.length,
    severityCounts: {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0
    },
    categories: {},
    details: issues.map(issue => {
      // Count severity
      if (issue.severity) {
        report.severityCounts[issue.severity.toLowerCase()]++;
      }

      // Count categories
      if (issue.category) {
        const category = issue.category.toLowerCase();
        report.categories[category] = (report.categories[category] || 0) + 1;
      }

      return {
        id: issue.id,
        description: issue.description,
        severity: issue.severity,
        category: issue.category,
        context: issue.context,
        selector: issue.selector
      };
    })
  };

  return report;
};

// New function to write the generated report to a file
function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Export additional functions
module.exports.loadLandmarks = loadLandmarks;
module.exports.processLandmarks = processLandmarks;
module.exports.sortLandmarks = sortLandmarks;
module.exports.getLandmarkById = getLandmarkById;
module.exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
module.exports.writeReport = writeReport;
module.exports.isValidLandmark = isValidLandmark;
module.exports.CONFIG = CONFIG;