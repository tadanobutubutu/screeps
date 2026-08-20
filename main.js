// Main.js - React Landmarks Fix Utility
// Fixes REACT_017: React Landmarks - Page has no <main> landmark
// Adds a <button> for the 'rotate back' link to fix REACT_036

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
        return /<main[\s>]/i.test(content);
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
                /(<body[^>]*>)(\{children\})(<\/body>)/i,
                '<body><main>{children}</main></body>'
            );
            
            // Pattern: <div>{children}</div> in layout
            content = content.replace(
                /(<div[^>]*>)(\{children\})(<\/div>)/i,
                '<main><div>{children}</div></main>'
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
        console.log(`Added <main> landmark to ${filePath}`);
    } catch (error) {
        console.error(`Error modifying file ${filePath}:`, error.message);
    }
}

/**
 * Replaces the 'rotate back' link with a button for better accessibility
 * @param {string} filePath - Path to the file to modify
 */
function replaceLinkWithButton(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace the <a> element with a <button>
        content = content.replace(
            /<a id="unrotate" href="#">rotate back<\/a>/i,
            '<button id="unrotate">rotate back</button>'
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Replaced 'rotate back' link with button in ${filePath}`);
    } catch (error) {
        console.error(`Error modifying file ${filePath}:`, error.message);
    }
}

/**
 * Fixes all files mentioned in the REACT_017 issue and replaces the 'rotate back' link
 */
function fixReactLandmarksAndLink() {
    const filesToFix = [
        { path: 'app/layout.tsx', type: 'tsx' },
        { path: 'dashboard/app/layout.tsx', type: 'tsx' },
        { path: 'docs/dependency-graph.html', type: 'html' } // Added the HTML file
    ];
    
    filesToFix.forEach(({ path: filePath, type }) => {
        const fullPath = path.resolve(process.cwd(), filePath);
        if (!hasMainLandmark(fullPath)) {
            addMainLandmark(fullPath, type);
        } else {
            console.log(`${filePath} already has <main> landmark`);
        }
        
        // Check if the file needs the 'rotate back' link to be replaced
        if (filePath.includes('dependency-graph.html')) {
            replaceLinkWithButton(fullPath);
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

// Export all functions for use in tests and other modules
module.exports = {
    hasMainLandmark,
    addMainLandmark,
    fixReactLandmarksAndLink, // Exported the new function
    checkLandmarks
};