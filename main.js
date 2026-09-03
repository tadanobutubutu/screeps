const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');

const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

function loadLandmarks() {
    try {
        const filePath = path.join(CONFIG.dataPath, 'landmarks.json');
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

    return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function sortLandmarks(landmarks, ascending = true) {
    return [...landmarks].sort((a, b) => {
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
  const reportFile = path.join(CONFIG.dataPath, 'report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// TODO: Implement harvest and upgrade logic
function harvest(resourceType = 'default', amount = 1) {
    const harvestResources = {
        'default': { name: 'Generic Resource', value: amount },
        'wood': { name: 'Wood', value: amount * 2 },
        'stone': { name: 'Stone', value: amount * 3 },
        'gold': { name: 'Gold', value: amount * 5 },
        'food': { name: 'Food', value: amount * 1.5 }
    };

    return harvestResources[resourceType] || harvestResources['default'];
}

function upgrade(target, level = 1) {
    if (!target) {
        return { success: false, error: 'Invalid target' };
    }

    const currentLevel = target.level || 1;
    const newLevel = currentLevel + level;
    const upgradeCost = level * 100;

    return {
        success: true,
        target: target.id || target.name || 'unknown',
        previousLevel: currentLevel,
        newLevel: newLevel,
        cost: upgradeCost,
        upgraded: { ...target, level: newLevel }
    };
}

// Replaced placeholder with full implementation using axe-core scanning and report writing
async function generateAccessibilityReport() {
  const report = await scanAccessibility();
  writeReport(report);
  return report;
}

// Utilities
const { validateInput, processData } = require('./utils/validation');
const { formatResponse } = require('./utils/formatters');

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

async function scanAccessibility() {
    const app = express();
    const results = await axe.run(app);
    return {
        timestamp: new Date().toISOString(),
        violations: results.violations || [],
        passes: results.passes || [],
        summary: {
            totalViolations: (results.violations || []).length,
            totalPasses: (results.passes || []).length
        }
    };
}

module.exports = {
    validateInput,
    processData,
    formatResponse,
    config: CONFIG,
    generateAccessibilityReport,
    loadLandmarks,
    processLandmarks,
    sortLandmarks,
    getLandmarkById,
    ensureUniqueLandmarks,
    isValidLandmark,
    writeReport,
    scanAccessibility,
    harvest,
    upgrade
};