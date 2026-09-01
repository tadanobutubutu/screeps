// main.js - Application entry point
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

// Helper functions
const isValidLandmark = require('./utils/validators').isValidLandmark;
const processData = require('./utils/processor').processData;
const formatResponse = require('./utils/processor').formatResponse;
const addLangAttribute = require('./utils/axioma-actions').addLangAttribute;
const fixTableStructure = require('./utils/axioma-actions').fixTableStructure;
const fixLandmarks = require('./utils/axioma-actions').fixLandmarks;
const addSvgAccessibleNames = require('./utils/axioma-actions').addSvgAccessibleNames;
const ensureUniqueLandmarks = require('./utils/helpers').ensureUniqueLandmarks;
const fixFakeLinks = require('./utils/axioma-actions').fixFakeLinks;
const applyAccessibilityFixes = require('./utils/axioma-actions').applyAccessibilityFixes;
const addressAccessibilityIssues = require('./utils/axioma-actions').addressAccessibilityIssues;
const createInPageButton = require('./utils/axioma-actions').createInPageButton;
const validateTableAccessibility = require('./utils/axioma-actions').validateTableAccessibility;
const validateLandmarkStructure = require('./utils/axioma-actions').validateLandmarkStructure;
const getLangAttribute = require('./utils/utils').getLangAttribute;
const getSvgAccessibleName = require('./utils/utils').getSvgAccessibleName;
const personName = require('./utils/utils').personName;
const divide = require('./utils/utils').divide;
const checkLinkAccessibility = require('./utils/axioma-actions').checkLinkAccessibility;
const wrapPrimaryContentInMain = require('./utils/axioma-actions').wrapPrimaryContentInMain;

// Load landmarks from file
const loadLandmarks = function () {
    try {
        const filePath = path.join(__dirname, CONFIG.dataPath, 'landmarks.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading landmarks:', error.message);
        return [];
    }
};

// Process and filter landmarks
const processLandmarks = function (landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const validLandmarks = landmarks.filter(isValidLandmark);
    const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

    return uniqueLandmarks.slice(0, CONFIG.maxResults);
};

// Sort landmarks by name
const sortLandmarks = function (landmarks, ascending = true) {
    return landmarks.slice().sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();

        if (ascending) {
            return nameA.localeCompare(nameB);
        }
        return nameB.localeCompare(nameA);
    });
};

// Get landmark by ID
const getLandmarkById = function (landmarks, id) {
    return landmarks.find(landmark => landmark.id === id) || null;
};

// Function to write the generated report to a file
const writeReport = function (report) {
    const reportFile = path.join(__dirname, 'accessibility_report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
};

// Extracted and refactored function for rendering dependency graph
const renderDependencyGraph = function (landmarks) {
    // Implementation to render the dependency graph
    // Placeholder: Replace with actual implementation
    console.log('Rendering dependency graph for landmarks...');
};

// Import and initialize required modules
const app = express();
const scanner = axe.createScanInstance({
    rules: {
        // Uncomment and customize axe-core rules as needed
        'react/a11y': { enabled: false }, // Disable React specific rules if not using a React application
        'aria-properties': { enabled: true },
        'color-contrast': { enabled: true },
        'keyboard': { enabled: true },
        'link-purpose': { enabled: true },
        'name': { enabled: true },
        'parallel-links': { enabled: true },
        'text-alternatives': { enabled: true },
        'multimedia': { enabled: true }
    }
});

// Implement accessibility scanning of the website using axe-core
app.use(async (req, res, next) => {
    try {
        const results = await scanner.scan(req);
        res.set('Access-Control-Expose-Headers', 'Surrogate-Control');
        res.set('Surrogate-Control', 'surrogate-expected=1');
        res.header('Content-Security-Policy', "frame-ancestors http:;");
        res.json({
            ...results
        });
    } catch (error) {
        next(error);
    }
});

// Main entry point when run as a standalone script
if (require.main === module) {
    applyAccessibilityFixes();
    const landmarks = loadLandmarks();
    const processed = processLandmarks(landmarks);
    const sorted = sortLandmarks(processed);

    console.log(`Loaded ${landmarks.length} landmarks`);
    console.log(`Processed to ${processed.length} unique landmarks`);
    console.log(`Sorted ${sorted.length} landmarks`);

    if (sorted.length > 0) {
        console.log('First landmark:', sorted[0]);
    }

    // Address accessibility issues from insight report:
    // - REACT_015: Add lang attribute to HTML element
    // - REACT_027: Fix 26 table structure issues
    // - REACT_017: Add/fix 4 landmark issues
    // - REACT_041: Add accessible names to 2 SVGs
    // - REACT_025: Ensure unique landmarks (2 issues)
    // - REACT_036: Fix 1 fake link issue

    // Render dependency graph
    renderDependencyGraph(processed);
}

module.exports = {
    app,
    scanner,
    CONFIG,
    // landmark functions
    isValidLandmark,
    loadLandmarks,
    processLandmarks,
    sortLandmarks,
    getLandmarkById,
    ensureUniqueLandmarks,
    // axe-core actions
    addLangAttribute,
    fixTableStructure,
    fixLandmarks,
    addSvgAccessibleNames,
    fixFakeLinks,
    applyAccessibilityFixes,
    addressAccessibilityIssues,
    createInPageButton,
    validateTableAccessibility,
    validateLandmarkStructure,
    getLangAttribute,
    getSvgAccessibleName,
    personName,
    divide,
    checkLinkAccessibility,
    wrapPrimaryContentInMain,
    renderDependencyGraph // Exported due to refactoring/extracting a function
};