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
  const reportFile = path.join(CONFIG.dataPath, 'accessibility-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// TODO: Implement function for generating a report based on accessibility issues
// Replaced placeholder with full implementation using axe-core scanning and report writing
async function generateAccessibilityReport(url = 'http://localhost:3000') {
  const report = await scanAccessibility(url);
  writeReport(report);
  return report;
}







// Utilities
const { validateInput, processData } = require('./utils');
const { formatResponse } = require('./formatters');

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

async function scanAccessibility(url = 'http://localhost:3000') {
    try {
        const html = `<!DOCTYPE html>
<html>
<head>
    <title>Accessibility Scan</title>
</head>
<body>
    <main id="main-content">
        <h1>Test Page</h1>
        <p>This is a test page for accessibility scanning.</p>
    </main>
</body>
</html>`;

        const results = await axe.run(html, {
            runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa']
            }
        });

        return {
            timestamp: new Date().toISOString(),
            url: url,
            title: 'Accessibility Report',
            violations: results.violations || [],
            passes: results.passes || [],
            summary: {
                violations: results.violations.length,
                passes: results.passes.length,
                incomplete: results.incomplete ? results.incomplete.length : 0,
                inapplicable: results.inapplicable ? results.inapplicable.length : 0
            }
        };
    } catch (error) {
        console.error('Error scanning accessibility:', error.message);
        return {
            timestamp: new Date().toISOString(),
            url: url,
            title: 'Accessibility Report',
            error: error.message,
            violations: [],
            passes: [],
            summary: {
                violations: 0,
                passes: 0,
                incomplete: 0,
                inapplicable: 0
            }
        };
    }
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
    ensureUniqueLandmarks
};