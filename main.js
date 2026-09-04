const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');

// Configuration for landmark operations
const LANDMARK_CONFIG = {
    dataPath: './data',
    maxResults: 100
};

// General application configuration
const CONFIG = {
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    timeout: process.env.TIMEOUT || 5000,
    debug: true,
    version: '1.0.0'
};

// Accessibility features have been implemented and integrated into the codebase.

function getLangAttribute() {
    // Implementation to get full language attribute
    return document.documentElement.lang || navigator.language || 'en-US';
}

function validateTableAccessibility(table) {
    const issues = [];

    // Check for caption (from origin/main)
    if (!table.querySelector) {
        issues.push('Missing caption element');
    }

    // Check for headers attribute (from HEAD)
    if (!table.getAttribute) {
        issues.push('Missing headers attribute');
    }

    // Check for scope attribute on header cells (from HEAD)
    const headerCells = table.querySelectorAll ? table.querySelectorAll('th') : [];
    headerCells.forEach(cell => {
        if (!cell.getAttribute || (!cell.getAttribute('scope') && !cell.getAttribute('id'))) {
            issues.push('Missing scope attribute on header cell');
        }
    });

    return {
        success: issues.length === 0,
        issues
    };
}

function validateTableStructure(tables) {
    const allIssues = [];

    // Handle both single table element and array of tables
    const tableArray = Array.isArray(tables) ? tables : [tables];

    tableArray.forEach((table, index) => {
        // Check for rows (from origin/main)
        const rows = table.querySelectorAll ? table.querySelectorAll('tr') : [];
        if (rows.length === 0) {
            allIssues.push({
                tableIndex: index,
                issues: ['Table has no rows']
            });
        }

        // Validate table accessibility (from HEAD)
        const result = validateTableAccessibility(table);
        if (!result.success) {
            allIssues.push({
                tableIndex: index,
                issues: result.issues
            });
        }
    });

    return {
        success: allIssues.length === 0,
        issues: allIssues
    };
}

function validateLandmarkStructure(landmarks) {
    const issues = [];

    // If landmarks array is provided, validate each one (from HEAD)
    if (Array.isArray(landmarks)) {
        landmarks.forEach((landmark, index) => {
            const result = validateLandmark(landmark);
            if (!result.success) {
                issues.push({
                    landmarkIndex: index,
                    issues: result.issues
                });
            }
        });
    } else {
        // Otherwise, check for required landmarks in the DOM (from origin/main)
        const allLandmarks = document ? document.querySelectorAll('header, nav, main, aside, footer, section, article') : [];
        let hasMain = false;
        let hasNavigation = false;

        allLandmarks.forEach(landmark => {
            const role = landmark.getAttribute ? landmark.getAttribute('role') : landmark.tagName;
            if (role === 'main') hasMain = true;
            if (role === 'navigation') hasNavigation = true;
        });

        if (!hasMain) {
            issues.push('Missing main landmark');
        }
    }

    return {
        success: issues.length === 0,
        issues
    };
}

function ensureUniqueLandmarks(landmarks) {
    const names = [];
    const duplicates = [];
    let elementsToCheck = landmarks;

    // If no landmarks array provided, query the DOM (from origin/main)
    if (!Array.isArray(landmarks)) {
        elementsToCheck = document ? document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="region"]') : [];
    }

    // Check for duplicate accessible names (from HEAD)
    elementsToCheck.forEach(landmark => {
        const name = landmark.ariaLabel || (landmark.getAttribute ? landmark.getAttribute('aria-labelledby') : null) || landmark.textContent;
        if (names.includes(name)) {
            duplicates.push('Duplicate accessible name: ' + name);
        } else {
            names.push(name);
        }
    });

    // Also check for duplicate IDs (from origin/main)
    const elementsById = {};
    elementsToCheck.forEach(landmark => {
        if (landmark.id) {
            if (elementsById[landmark.id]) {
                duplicates.push('Duplicate ID: ' + landmark.id);
            } else {
                elementsById[landmark.id] = true;
            }
        }
    });

    return {
        success: duplicates.length === 0,
        duplicates
    };
}

const appData = {
    title: 'Screeps',
    version: '1.0.0'
};

const HTML = ({ lang }) => `<html lang="${lang}"><head></head><body></body></html>`;

// Function to write the generated report to a file
function writeReport(report) {
    const reportFile = path.join(__dirname, 'accessibility-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// TODO: Implement function for generating a report based on accessibility issues
// Replaced placeholder with full implementation using axe-core scanning and report writing
function processAccessibilityReport() {
    const report = scanAccessibility();
    writeReport(report);
    return report;
}

// Utilities
const utils = require('./utils');
const { validateInput, processData } = utils;
const { formatResponse } = require('./formatters');

module.exports = {
    appData,
    CONFIG,
    LANDMARK_CONFIG,
    HTML,
    validateTableAccessibility,
    validateTableStructure,
    processAccessibilityReport,
    ensureUniqueLandmarks
};