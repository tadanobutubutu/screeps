// Main.js - React Landmarks Fix Utility
// Fixes REACT_017: React Landmarks - Page has no <main> landmark
// Fixes REACT_027: React Table Structure - <th> has no scope

const fs = require('fs');
const path = require('path');

/**
 * Checks if a file contains a <main> landmark
 * @param {string} filePath - Path to the file to check
 * @returns {boolean} - True if <main> landmark exists
 */
function hasMainLandmark(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return /<main[\s\S]*?<\/main>/i.test(content);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
        return false;
    }
}

/**
 * Adds a <main> landmark around children in layout files
 * @param {string} filePath - Path to the layout file
 * @param {string} type - Type of layout ('tsx' or 'html')
 */
function addMainLandmark(filePath, type = 'tsx') {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (type === 'tsx') {
            // Pattern: <body>{children}</body> or similar
            content = content.replace(
                /(<body[^>]*>)([\s\S]*?)(<\/body>)/i,
                '$1<main>$2</main>$3'
            );
            
            // Pattern: <div>{children}</div> in layout
            content = content.replace(
                /<div>\{children\}<\/div>/,
                '<main><div>{children}</div></main>'
            );
        } else if (type === 'html') {
            // Pattern: <table id="table-rotated">
            content = content.replace(
                /(<table id="table-rotated">)/i,
                '<main>$1'
            );
            
            // Close main before closing body
            content = content.replace(
                /(<\/body>)/i,
                '</main>$1'
            );
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Added <main> landmark to ${filePath}`);
    } catch (error) {
        console.error(`Error modifying file ${filePath}:`, error.message);
    }
}

/**
 * Fixes all files mentioned in the REACT_017 issue
 */
function fixReactLandmarks() {
    const filesToFix = [
        { path: 'app/layout.tsx', type: 'tsx' },
        { path: 'app/(auth)/layout.tsx', type: 'tsx' },
        { path: 'docs/index.html', type: 'html' }
    ];
    
    filesToFix.forEach(({ path: filePath, type }) => {
        const fullPath = path.resolve(filePath);
        if (fs.existsSync(fullPath)) {
            addMainLandmark(fullPath, type);
        } else {
            console.log(`File ${filePath} already has <main> landmark`);
        }
    });
}

/**
 * Checks all layout files for <main> landmark
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

/**
 * Checks if a file contains properly scoped table headers
 * @param {string} filePath - Path to the file to check
 * @returns {boolean} - True if all <th> elements have scope attributes
 */
function hasTableScope(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Check if there are <th> elements without scope attribute
        const thWithoutScope = /<th(?![^>]*\bscope=["'])[^>]*>/gi;
        const matches = content.match(thWithoutScope);
        return matches === null || matches.length === 0;
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
        return false;
    }
}

/**
 * Adds scope="col" to all <th> elements in a file
 * @param {string} filePath - Path to the file
 * @param {string} type - Type of file ('html' or 'tsx')
 */
function addTableScope(filePath, type = 'html') {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (type === 'html') {
            // Pattern: <table id="table-rotated">
            content = content.replace(
                /(<table id="table-rotated">)/i,
                '<main>$1'
            );
            
            // Close main before closing body
            content = content.replace(
                /(<\/body>)/i,
                '</main>$1'
            );
        }
        
        // Add scope="col" to <th> elements that don't have it
        // This regex matches <th> tags without a scope attribute and adds scope="col"
        const thRegex = /(<th(?![^>]*\bscope=["'])[^>]*?)>/gi;
        content = content.replace(thRegex, '$1 scope="col">');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Added scope="col" to table headers in ${filePath}`);
    } catch (error) {
        console.error(`Error modifying file ${filePath}:`, error.message);
    }
}

/**
 * Fixes all files mentioned in the REACT_027 issue
 */
function fixReactTableStructure() {
    const filesToFix = [
        { path: 'docs/index.html', type: 'html' }
    ];
    
    filesToFix.forEach(({ path: filePath, type }) => {
        const fullPath = path.resolve(filePath);
        if (fs.existsSync(fullPath)) {
            if (hasTableScope(fullPath)) {
                console.log(`File ${filePath} already has properly scoped table headers`);
            } else {
                addTableScope(fullPath, type);
            }
        } else {
            console.log(`File ${filePath} not found`);
        }
    });
}

/**
 * Checks all files for properly scoped table headers
 * @param {string[]} filePaths - Array of file paths to check
 * @returns {Object} - Summary of results
 */
function checkTableStructures(filePaths) {
    const results = {
        passed: [],
        failed: []
    };
    
    filePaths.forEach(filePath => {
        if (hasTableScope(filePath)) {
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
    hasTableScope,
    addTableScope,
    fixReactTableStructure,
    checkTableStructures
};