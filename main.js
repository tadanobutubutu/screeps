import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import path from 'path';
import fs from 'fs';

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

// Some existing utility functions
function greet(name) {
    return `Hello, ${name}!`;
}

function add(a, b) {
    return a + b;
}

export function newFunction() {
    // Implement the new functionality (as per the original commitment)
    console.log('New function called'); // Placeholder implementation
}

export function newFunction2() {
    // Implement another new functionality (assuming this was the intent of the issue)
    console.log('New function 2 called'); // Placeholder implementation
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
    return 'Some result';
}

function functionA(param) {
    return `Function A with param: ${param}`;
}

function functionB(param) {
    return `Function B with param: ${param}`;
}

const processData = (data) => {
    // existing processing logic preserved
    return data;
};

const formatResponse = (response) => {
    // existing formatting logic preserved
    return response;
};

// Imported and adapted accessibility utility functions

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
    
    // Check if table has proper row and cell structure
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

    // Check if table has proper row and cell structure
    const rows = tableElement.querySelectorAll('tr');
    const hasHeader = tableElement.querySelector('th') !== null;
    const hasBody = tableElement.querySelector('td') !== null;
    return hasHeader && hasBody;
};

const filterIssuesByRules = (violations, allowedRules) {
    if (!allowedRules || allowedRules.length === 0) {
        return violations;
    }
    return violations.filter(violation => allowedRules.includes(violation.id));
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

function writeReport(report) {
    const reportFile = path.join(__dirname, 'accessibility_report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
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
        options: axeOptions = {},
        includeIncomplete = true,
        allowedRules = []
    } = options;
    
    const scanResults = await scan