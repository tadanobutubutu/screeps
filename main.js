// main.js - Application entry point
const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');
const { validateInput } = require('./utils/validators');
const { processData } = require('./utils/processor');

// Existing exports
exports.generateAccessibilityReport = generateAccessibilityReport;
exports.scanAccessibility = scanAccessibility;
exports.writeReport = writeReport;
exports.landmarkConfig = CONFIG;
exports.renderDependencyGraph = renderDependencyGraph;
exports.scanAccessibility = scanAccessibility;

// New function from origin/main branch
function generateAccessibilityReport() {
  // Implementation using axe-core and report writing
  // ...
}

// New function for version 2 implementation (new-feature-branch)
function renderDependencyGraph(landmarks) {
    // Implementation for the new functionality
    // ...
}

// New function for version 2 implementation (new-feature-branch)
function addLandmarkRegions(landmarks, regions) {
    if (!Array.isArray(landmarks) || !Array.isArray(regions)) {
        throw new Error('Both landmarks and regions must be arrays');
    }

    return landmarks.map(landmark => {
        const matchingRegions = regions.filter(region =>
            region.landmarkId === landmark.id
        );

        return {
            ...landmark,
            regions: matchingRegions
        };
    });
}

// Export all functions
module.exports = {
  validateInput,
  processData,
  formatResponse,
  config: CONFIG,
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarks,
  writeReport,
  generateAccessibilityReport,
  // New functions for version 2 implementation (new-feature-branch)
  renderDependencyGraph,
  addLandmarkRegions
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