// Main.js - React Landmarks Fix Utility
// Fixes REACT_017: React Landmarks - Page has no <main> landmark
// Modified to fix REACT_025: React Unique Landmarks

const fs = require('fs');
const path = require('path');

/**
 * Checks if a file contains more than one <main> landmark
 * @param {string} filePath - Path to the file to check
 * @returns {boolean} - True if there are more than one <main> landmark
 */
function hasMultipleMainLandmarks(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const mainMatches = [...content.matchAll(/<main[\s>]/g)];
        return mainMatches.length > 1;
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
        return false;
    }
}

/**
 * Adds a check for more than one <main> landmark in a function
 * @param {string} filePath - Path to the layout file
 * @param {string} type - Type of layout ('tsx' or 'html')
 */
function checkMultipleMainLandmarks(filePath, type = 'tsx') {
    try {
        const content = fs.readFileSync(filePath, 'utf8');

        if (hasMultipleMainLandmarks(filePath)) {
            console.warn(`${filePath} has more than one <main> landmark. Keep a single <main>; use <section> or <article> for the other regions`);
        }
    } catch (error) {
        console.error(`Error modifying file ${filePath}:`, error.message);
    }
}

/**
 * Adds a <main> or <article> landmark around children in layout files
 * @param {string} filePath - Path to the layout file
 * @param {string} type - Type of layout ('tsx' or 'html')
 */
function addMainLandmark(filePath, type = 'tsx') {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        if (type === 'tsx') {
            // Pattern: <body>{children}</body> or similar
            content = content.replace(
                /(<body[^>]*>)(\{children\})(<\/body>)/i,
                '<main>{children}</main></body>'
            );

            // Pattern: <div>{children}</div> in layout
            content = content.replace(
                /(<div[^>]*>)(\{children\})(<\/div>)/i,
                '<article>{children}</article>'
            );
        } else if (type === 'html') {
            // Pattern: <table id="table-rotated">
            content = content.replace(
                /(<table[^>]*id="table-rotated"[^>]*>)/i,
                '<main>$1'
            );

            // Close main before closing body
            content = content.replace(
                /(<\/body>)/i,
                '</main>$1'
            );
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Added <main> or <article> landmark to ${filePath}`);
    } catch (error) {
        console.error(`Error modifying file ${filePath}:`, error.message);
    }
}

/**
 * Fixes all files mentioned in the REACT_025 issue
 */
function fixReactLandmarks() {
    const filesToFix = [
        { path: 'app/layout.tsx', type: 'tsx' },
        { path: 'dashboard/app/layout.tsx', type: 'tsx' },
        { path: 'docs/index.html', type: 'html' }
    ];

    filesToFix.forEach(({ path: filePath, type }) => {
        const fullPath = path.resolve(process.cwd(), filePath);
        checkMultipleMainLandmarks(fullPath, type);
        if (!hasMainLandmark(fullPath)) {
            addMainLandmark(fullPath, type);
        } else {
            console.log(`${filePath} already has <main> or <article> landmark`);
        }
    });
}

/**
 * Checks all layout files for <main> or <article> landmark
 * @param {string[]} filePaths - Array of file paths to check
 * @returns {Object} - Summary of results
 */
function checkLandmarks(filePaths) {
    const results = {
        passed: [],
        failed: []
    };

    filePaths.forEach(filePath => {
        if (hasMainLandmark(filePath)) {
            results.passed.push(filePath);
        } else {
            results.failed.push(filePath);
        }
    });

    return results;
}

// Export all functions for use in tests and other modules
module.exports = {
    hasMainLandmark,
    addMainLandmark,
    fixReactLandmarks,
    checkLandmarks,
    checkMultipleMainLandmarks
};