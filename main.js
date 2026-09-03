// User Safety: unsafe
// Safety Categories: Unauthorized Advice
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import path from 'path';
import fs from 'fs';
import axe from 'axe-core';
import a11y from './AccessibilityUtilities';
import { validateInput, processData } from './utils/validators';
import { formatResponse } from './utils/processor';

const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Import required modules and React components
const pagesDir = path.join(__dirname, 'pages');

// Function to scan pages for accessibility issues and generate a report
async function scanFilesForAccessibility() {
    const filePaths = await fs.promises.readdir(pagesDir);
    const issues = [];

    for (const filePath of filePaths) {
        const fileEmitted = path.join(pagesDir, filePath);
        const { violations } = await axe.analyze(fileEmitted);

        if (violations.length > 0) {
            issues.push({
                file: filePath,
                issues: violations,
            });
        }
    }

    return issues;
}

// Function to write the generated report to a file
function writeFileReport(report) {
    const reportFile = path.join(__dirname, 'accessibility_report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// New function to fix landmark issues
function fixLandmarkIssues(landmarks) {
    landmarks.forEach(landmark => {
        landmark.setAttribute('tabindex', '-1');
        landmark.removeAttribute('id');
    });
}

// New function to add accessible names to SVGs
function addSvgAccessibility(svgElements) {
    svgElements.forEach(svgElement => {
        setSvgAttributes(svgElement, getSvgAccessibleName(svgElement));
    });
}

// New function to create accessible links
function createAccessibleLinks(links) {
    links.forEach(link => {
        if (!link.hasAttribute('href')) {
            link.setAttribute('href', '');
        }
        link.setAttribute('tabindex', '-1');
    });
}

// Some existing utility functions
function greet(name) {
    return `Hello, ${name}!`;
}

function add(a, b) {
    return a + b;
}

export function newFunction() {
    console.log('New function called');
}

export function newFunction2() {
    console.log('New function 2 called');
}

let appData = {};

function getDependencies() {
    return Object.keys(appData.dependencies || {});
}

function addDependency(name, version) {
    if (!appData.dependencies) {
        appData.dependencies = {};
    }
    appData.dependencies[name] = version;
}

function removeDependency(name) {
    if (appData.dependencies && appData.dependencies[name]) {
        delete appData.dependencies[name];
    }
}

function countDependencies() {
    return appData.dependencies ? Object.keys(appData.dependencies).length : 0;
}

function someFunction() {
    return 'some value';
}

function functionA(param) {
    return `Function A with param: ${param}`;
}

function functionB(param) {
    return `Function B with param: ${param}`;
}

const processData = (data) => {
    return data;
};

const formatResponse = (response) => {
    return response;
};

const getLangAttribute = () => {
    return document.documentElement.lang || 'en';
};

const addLangAttribute = () => {
    const htmlElement = document.documentElement;
    if (htmlElement && !htmlElement.lang) {
        htmlElement.setAttribute('lang', 'en');
    }
    return getLangAttribute();
};

const validateTableAccessibility = (tableElement) => {
    if (!tableElement) return false;
    const rows = tableElement.querySelectorAll('tr');
    let validStructure = true;

    rows.forEach(row => {
        const cells = row.querySelectorAll('td, th');
        if (cells.length === 0) {
            validStructure = false;
        }
    });

    return validStructure;
};

const validateTableStructure = (tableElement) => {
    if (!tableElement) return false;
    const rows = tableElement.querySelectorAll('tr');
    const hasHeader = tableElement.querySelector('th') !== null;
    const hasBody = tableElement.querySelector('td') !== null;
    return hasHeader && hasBody;
};

const filterIssuesByRules = (violations, allowedRules) => {
    if (!allowedRules || allowedRules.length === 0) {
        return violations;
    }
    return violations.filter(violation => allowedRules.includes(violation.id));
};

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

async function scanAccessibility(context, axeOptions = {}, includeIncomplete = true) {
    try {
        const results = await axe.run(context, {
            runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'wcag21aa']
            },
            ...axeOptions
        });
        
        return {
            timestamp: new Date().toISOString(),
            violations: results.violations || [],
            passes: results.passes || [],
            incomplete: includeIncomplete ? (results.incomplete || []) : [],
            inapplicable: results.inapplicable || [],
            toolOptions: axeOptions
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
        context = document, 
        axeOptions = {},
        includeIncomplete = true,
        allowedRules = []
    } = options;
    
    const scanResults = await scanAccessibility(context, axeOptions, includeIncomplete);
    const summary = generateReportSummary(scanResults.violations);
    
    const report = {
        timestamp: scanResults.timestamp,
        violations: scanResults.violations,
        passes: scanResults.passes,
        summary: summary,
        toolOptions: scanResults.toolOptions
    };
    
    writeFileReport(report);
    return report;
}

export {
    CONFIG,
    validateInput,
    processData,
    formatResponse,
    getLangAttribute,
    addLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    filterIssuesByRules,
    generateReportSummary,
    scanAccessibility,
    generateAccessibilityReport,
    writeFileReport,
    scanFilesForAccessibility,
    fixLandmarkIssues,
    addSvgAccessibility,
    createAccessibleLinks,
    newFunction,
    newFunction2,
    greet,
    add,
    someFunction,
    functionA,
    functionB,
    getDependencies,
    addDependency,
    removeDependency,
    countDependencies,
    addressAccessibilityIssues,
    loadLandmarks,
    processLandmarks,
    sortLandmarks,
    getLandmarkById,
    isValidLandmark,
    getSvgAccessibleName,
    setSvgAttributes,
    createInPageButton
};

export { a11y as defaultA11y };

export default function() {
    if (a11y && a11y.init) {
        a11y.init();
    }

    const links = document.querySelectorAll('a');
    if (links.length > 0) {
        createAccessibleLinks(links);
    }

    const svgElements = [...document.getElementsByTagName('svg')];
    const landmarks = [...document.getElementsByTagName('*')].filter(el => el.getAttribute('role'));
    if (svgElements.length > 0) {
        addSvgAccessibility(svgElements);
    }
    if (landmarks.length > 0) {
        fixLandmarkIssues(landmarks);
    }
}