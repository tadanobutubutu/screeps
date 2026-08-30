const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');
const { validateInput, processData, formatResponse, ensureUniqueLandmarks, validateLandmark } = require('./utils/validators');
const { landmarkFunctions } = require('./utils/processor');

// Configuration
const CONFIG = {
    dataPath: './data',
    maxResults: 100,
    apiUrl: process.env.API_URL || 'https://api.example.com',
    timeout: 5000,
    enforcedRules: [
      'link-name-exists',
      'link-purpose-describes-destination',
      'link-is-meaningful',
      'headings-make-up-hierarchy',
      'unnested-headings',
      'link-has-a-visdesc',
      'aria-proptype-valid',
      'landmark',
      'aria-role-valid-passive',
      'aria-role-valid-active',
      'aria-hidden-make-sense'
    ]
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

// Validate landmark structure
function validateLandmarkStructure(landmark) {
    const { valid, violations } = axe.run(landmark);
    const hasViolations = violations && violations.length > 0;

    if (hasViolations) {
        console.error('Accessibility issues found in landmark:', violations);
    }

    return valid && !hasViolations;
}

// Function to validate landmarks structure and add/fix landmark issues
function validateLandmarks() {
    const landmarks = loadLandmarks();
    const processedLandmarks = landmarks.map(landmark => {
        if (validateLandmarkStructure(landmark)) {
            return landmark;
        }

        // If the landmark doesn't meet accessibility standards, let's try to fix it
        // For simplicity, the fixes suggested here are quite modest and can be further improved
        // Legal landmark types: region, banner, article, navigation, main, complementary, contentinfo
        if (!landmark.type || !landmark.type.match(/^(region|banner|article|navigation|main|complementary|contentinfo)$/)) {
            console.warn('Invalid landmark type provided.', landmark);
            landmark.type = 'region';
        }

        if (!landmark.id && typeof landmark.name === 'string') {
            landmark.id = `landmark_${landmark.name.toLowerCase().replace(/ /g, '-')}`;
        }

        if (!landmark.name) {
            landmark.name = 'Unnamed Landmark';
        }

        return landmark;
    });

    return processLandmarks(processedLandmarks);
}

// Function to write the generated report to a file
function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// TODO: Implement function for generating a report based on accessibility issues
// Replaced placeholder with full implementation using axe-core scanning and report writing
function generateAccessibilityReport(element) {
    const report = axe.run(element, CONFIG.enforcedRules);
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

// Application main entry point
const app = express();

// TODO: add the new functions or changes requested in the issue
// Here is the implementation for checking link accessibility
function isLinkAccessible(link) {
    const { valid, violations } = axe.run(link);
    return valid && !violations || violations.length === 0;
}

// Function that imports all necessary functions related to landmarks from the landmarkFunctions object
function loadLandmarkFunctions() {
    const availableFunctions = fastMap(landmarkFunctions, ([key, value]) => ({ key, value }));
    return availableFunctions.filter(({ value }) => typeof value === 'function');
}

// Function for handling a GET request for landmarks
app.get('/landmarks', (req, res) => {
    const { landmarks } = loadLandmarkFunctions();

    // Your code for handling the request and response logic goes here
    const requestedLandmark = req.query.landmark;

    if (requestedLandmark) {
        const landmarkFunction = landmarks[requestedLandmark];

        if (!landmarkFunction) {
            return res.status(404).json({ error: `Invalid landmark function requested: ${requestedLandmark}` });
        }

        const element = req.query.element || req.query.html;

        if (!element) {
            return res.status(400).json({ error: 'No element or HTML provided' });
        }

        if (typeof element !== 'string') {
            return res.status(400).json({ error: 'Element or HTML must be a string' });
        }

        const accessibilityReport = generateAccessibilityReport(element);
        const results = landmarkFunction(accessibilityReport);

        res.json(formatResponse(results));
    } else {
        const landmarks = validateLandmarks();
        res.json(formatResponse(landmarks));
    }
});

app.use(express.json());

// Export new necessary functions
module.exports = {
    validateInput,
    processData,
    formatResponse,
    config: CONFIG,
    landmarkFunctions,
    landmarkConfig: landmarkFunctions.reduce((acc, [key, func]) => {
        acc[key] = {
            fn: func,
            args: func.length > 1 ? [...func.arguments] : []
        };
        return acc;
    }, {}),
    validateLandmarkStructure,
    validateLandmarks
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