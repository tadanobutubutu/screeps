const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const fastify = require('fastify');

const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

const request = require('request');
const { validateInput, processData, formatResponse } = require('./utils/validators');
const { validateTableAccessibility, validateTableStructure, fixTableStructure, addMainLandmark, validateLandmark, ensureUniqueLandmarks } = require('./utils/accessibility');
const { getSvgAccessibleName, setSvgAttributes } = require('./utils/svg');

function getLangAttribute() {
    return navigator.language || navigator.userLanguage;
}

function addLangAttribute() {
    // Implementation to be added
}

function logCurrentURL() {
    console.log('Current URL: ' + window.location.href);
}

function validateTableAccessibility(table) {
    // Implementation to be added
}

function validateTableStructure(table) {
    // Implementation to be added
}

function fixTableStructure(table) {
    // Implementation to be added
}

function addMainLandmark() {
    // Implementation to be added
}

function validateLandmark(landmark) {
    const issues = [];

    if (!landmark) {
        return { valid: false, issues: ['Landmark is null or undefined'] };
    }

    if (typeof landmark.id !== 'string' || landmark.id.trim().length === 0) {
        return {
            valid: false,
            issues: ['Landmark ID is required and non-empty']
        };
    }

    return { valid: true, issues: [] };
}

function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

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

function processLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const validLandmarks = landmarks.filter(isValidLandmark);
    const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

    return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

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

function filterIssuesByRules(issues, allowedRules) {
    if (!allowedRules || allowedRules.length === 0) {
        return issues;
    }
    return issues.filter(issue => allowedRules.includes(issue.id));
}

function generateReportSummary(issues) {
    const summary = {
        critical: 0,
        serious: 0,
        moderate: 0,
        minor: 0
    };

    issues.forEach(issue => {
        const impact = issue.impact || 'minor';
        if (summary.hasOwnProperty(impact)) {
            summary[impact]++;
        }
    });

    return summary;
}

// Utilities

async function scanAccessibility() {
    try {
        const results = await axe.run(document, {
            runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'wcag21aa']
            }
        });

        return {
            timestamp: new Date().toISOString(),
            violations: results.violations || [],
            passes: results.passes || [],
            incomplete: results.incomplete || [],
            inapplicable: results.inapplicable || []
        };
    } catch (error) {
        console.error('Error scanning accessibility:', error.message);
        return {
            timestamp: new Date().toISOString(),
            violations: [],
            passes: [],
            incomplete: [],
            inapplicable: [],
            error: error.message
        };
    }
}

async function generateAccessibilityReport(options = {}) {
    const {
        options: axeOptions = {},
        includeIncomplete = true,
        allowedRules = []
    } = options;

    const scanResults = await scanAccessibility(options);
    const filteredIssues = filterIssuesByRules(scanResults.violations, allowedRules);

    const report = {
        timestamp: new Date().toISOString(),
        summary: generateReportSummary(filteredIssues),
        issues: filteredIssues,
        metadata: {
            totalViolations: scanResults.violations.length,
            totalPasses: scanResults.passes.length,
            incompleteCount: scanResults.incomplete ? scanResults.incomplete.length : 0,
            inapplicableCount: scanResults.inapplicable ? scanResults.inapplicable.length : 0
        }
    };

    return report;
}

module.exports = {
    getLangAttribute,
    addLangAttribute,
    logCurrentURL,
    validateTableAccessibility,
    validateTableStructure,
    fixTableStructure,
    addMainLandmark,
    validateLandmark,
    isValidLandmark,
    loadLandmarks,
    processLandmarks,
    sortLandmarks,
    getLandmarkById,
    ensureUniqueLandmarks,
    filterIssuesByRules,
    generateReportSummary,
    scanAccessibility,
    generateAccessibilityReport
};