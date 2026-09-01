// Merged and resolved main.js
class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    // ... other methods ...
}

// Landmark data structure
const landmarks = [];

// TODO: Implement spawning logic
function spawnNewUser(name, age) {
    return new User(name, age);
}

// Web server dependencies (incorporated from origin/main)
const express = require('express');
const path = require('path');

// Configuration
const config = {
    apiUrl: process.env.API_URL || 'https://api.example.com',
    timeout: 5000
};

// App state
const appState = {
    initialized: false,
    data: null,
    cache: new Map()
};

// Initialize function
function initialize() {
    appState.initialized = true;
    console.log('App initialized');
}

// Initialize app function
function initializeApp() {
    initialize();
    return appState;
}

// Visualize dependency tree function (incorporated from origin/main)
function visualizeDependencyTree(dependencies) {
    console.log('Dependency Tree:');
    return dependencies;
}

// Process data function
function processData(data) {
    if (!data) {
        return null;
    }
    appState.data = data;
    return data;
}

// Main function (required export)
function main() {
    initialize();
    initializeApp();
    console.log('Main function executed');
    return { executed: true };
}

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
    const element = document ? document.getElementById(id) : null;
    return element !== null;
}

function ensureUniqueLandmarks(landmarksArray) {
    if (!landmarksArray || landmarksArray.length === 0) {
        return [];
    }
    const seen = new Set();
    return landmarksArray.filter(landmark => {
        const key = landmark.name + '_' + (landmark.role || 'default');
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    }).filter(landmark => checkLandmarkElement(landmark.id));
}

// New function for creating in-page buttons (from the other branch)
function createInPageButtons(buttonsData) {
    const buttonsContainer = document.getElementById('in-page-buttons-container');

    if (!buttonsContainer) {
        console.error('In-page buttons container not found');
        return;
    }

    buttonsData.forEach(buttonData => {
        const button = document.createElement('button');
        button.id = buttonData.id;
        button.textContent = buttonData.text;
        button.setAttribute('data-role', buttonData.role);
        button.setAttribute('aria-label', buttonData.text); // Added for accessibility

        button.addEventListener('click', () => {
            location.hash = buttonData.href;
        });

        buttonsContainer.appendChild(button);
    });
}

// Landmark validation function with merged logic from both branches
function validateLandmark(landmark) {
    const errors = [];

    // Validate longitude
    if (landmark.longitude === undefined || landmark.longitude === null) {
        errors.push('Landmark must have a longitude');
    } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
        errors.push('Landmark longitude must be a number');
    } else if (landmark.longitude < -180 || landmark.longitude > 180) {
        errors.push('Landmark longitude must be between -180 and 180');
    }

    // Additional validation: check for array composition with name
    if (Array.isArray(landmark) && landmark.length > 0) {
        landmark.forEach(innerLandmark => {
            if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
                errors.push('Landmark array must have valid names');
            }
        });
    }

    return errors;
}

// Table accessibility functions (merged from both branches)
function validateTableAccessibility() {
    const tables = document.querySelectorAll('table');
    const errors = [];

    tables.forEach((table, index) => {
        // Check if table has a caption
        if (!table.querySelector('caption')) {
            errors.push(`Table ${index + 1} is missing a caption`);
        }

        // Check if table has proper headers
        const headers = table.querySelectorAll('th');
        if (headers.length === 0) {
            errors.push(`Table ${index + 1} is missing header cells`);
        }

        // Check if table has proper scope attributes for headers
        headers.forEach(header => {
            if (!header.hasAttribute('scope')) {
                errors.push(`Header in Table ${index + 1} is missing scope attribute`);
            }
        });

        // Check if table has proper data cells
        const dataCells = table.querySelectorAll('td');
        if (dataCells.length === 0) {
            errors.push(`Table ${index + 1} is missing data cells`);
        }
    });

    return errors;
}

function validateTableStructure() {
    const tables = document.querySelectorAll('table');
    const errors = [];

    tables.forEach((table, index) => {
        // Check if table has proper row structure
        const rows = table.querySelectorAll('tr');
        if (rows.length === 0) {
            errors.push(`Table ${index + 1} has no rows`);
        }

        // Check if table has proper column structure
        const columns = table.querySelectorAll('td, th');
        if (columns.length === 0) {
            errors.push(`Table ${index + 1} has no columns`);
        }

        // Check if table has proper nesting
        const nestedTables = table.querySelectorAll('table');
        if (nestedTables.length > 0) {
            errors.push(`Table ${index + 1} contains nested tables`);
        }
    });

    return errors;
}

function fixTableStructure() {
    const tables = document.querySelectorAll('table');

    tables.forEach(table => {
        // Add role="table" if missing
        if (!table.hasAttribute('role')) {
            table.setAttribute('role', 'table');
        }

        // Add aria-label if missing caption
        if (!table.querySelector('caption') && !table.hasAttribute('aria-label')) {
            table.setAttribute('aria-label', 'Table');
        }

        // Ensure proper header structure
        const headers = table.querySelectorAll('th');
        headers.forEach(header => {
            if (!header.hasAttribute('scope')) {
                header.setAttribute('scope', 'col');
            }
        });

        // Ensure proper data cell structure
        const dataCells = table.querySelectorAll('td');
        dataCells.forEach(cell => {
            if (!cell.hasAttribute('role')) {
                cell.setAttribute('role', 'cell');
            }
        });
    });
}

function ensureLandmarkUniqueness(elements) {
    if (Array.isArray(elements)) {
        const elementsById = {};

        for (const landmark of elements) {
            if (landmark && landmark.id) {
                if (!elementsById[landmark.id]) {
                    elementsById[landmark.id] = true;
                } else {
                    landmark.id += '_duplicate';
                }
            }
        }

        return elements;
    }
    return elements;
}

// Function to count dependencies (migrated from the other branch)
function countDependencies() {
    const dependencies = {
        'react': true,
        'react-redux': true,
        'antd': true
    };
    return Object.keys(dependencies).length;
}

// Accessibility issue handlers
function addressAccessibilityIssues(insightReport) {
    // Implementation to address accessibility issues
    insightReport.forEach(issue => {
        switch(issue.type) {
            case 'table':
                fixTableStructure();
                break;
            case 'landmark':
                ensureLandmarkUniqueness(landmarks);
                break;
            default:
                console.log(`No handler for issue type: ${issue.type}`);
        }
    });
}

function getInsightReport() {
    // Implementation to retrieve insight report
    const report = [];

    // Check for table issues
    const tableErrors = validateTableAccessibility();
    tableErrors.forEach(error => {
        report.push({
            type: 'table',
            description: error
        });
    });

    // Check for landmark issues
    landmarks.forEach(landmark => {
        const landmarkErrors = validateLandmark(landmark);
        landmarkErrors.forEach(error => {
            report.push({
                type: 'landmark',
                description: error
            });
        });
    });

    return report;
}

// Exports from both branches
module.exports = {
    User,
    spawnNewUser,
    config,
    initialize,
    initializeApp,
    main,
    visualizeDependencyTree,
    processData,

    // Merged functions (landmark validation and addressing accessibility issues)
    validateLandmark,
    addressAccessibilityIssues,
    getInsightReport,

    // Landmark helpers
    checkLandmarkElement,
    ensureUniqueLandmarks,
    ensureLandmarkUniqueness,
    createInPageButtons,
    validateTableAccessibility,
    validateTableStructure,
    fixTableStructure,
    countDependencies,

    // Server setup (incorporated from origin/main)
    express,
    path,
    app: express(),
    PORT: process.env.PORT || 3000,
    HOST: process.env.HOST || 'localhost'
};

// Main execution when run directly
if (require.main === module) {
    // Start server
    module.exports.app.listen(module.exports.PORT, () => {
        console.log(`Server running on http://${module.exports.HOST}:${module.exports.PORT}`);
    });

    // Visualize dependency tree when running directly
    visualizeDependencyTree(require.dependencies);

    // Run accessibility check and fix issues if any
    const insightReport = getInsightReport();
    if (insightReport.length > 0) {
        console.log('Accessibility issues found:');
        insightReport.forEach((issue) => {
            console.log(`${issue.type}: ${issue.description}`);
        });
        addressAccessibilityIssues(insightReport);
    }
}