// Main.js - React Landmarks Fix Utility
// Fixes REACT_017: React Landmarks - Page has no <main> landmark
// Fixes REACT_015: React Language Attribute - <html> has no lang attribute

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
        return content.includes('<main>') || content.includes('<main ');
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
                /<body>\s*{children}\s*<\/body>/i,
                '<body><main>{children}</main></body>'
            );
            
            // Pattern: <div>{children}</div> in layout
            content = content.replace(
                /<div>\s*{children}\s*<\/div>/i,
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
        { path: 'app/page.tsx', type: 'tsx' },
        { path: 'docs/index.html', type: 'html' }
    ];
    
    filesToFix.forEach(({ path: filePath, type }) => {
        const fullPath = path.resolve(process.cwd(), filePath);
        if (fs.existsSync(fullPath)) {
            if (!hasMainLandmark(fullPath)) {
                addMainLandmark(fullPath, type);
            } else {
                console.log(`${filePath} already has <main> landmark`);
            }
        } else {
            console.log(`File not found: ${filePath}`);
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
 * Checks if a file has a lang attribute on the <html> element
 * @param {string} filePath - Path to the file to check
 * @returns {boolean} - True if lang attribute exists
 */
function hasLangAttribute(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return /<html[^>]*\slang\s*=/i.test(content);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
        return false;
    }
}

/**
 * Adds a lang attribute to the <html> element
 * @param {string} filePath - Path to the file
 * @param {string} lang - Language code (default: 'en')
 */
function addLangAttribute(filePath, lang = 'en') {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Handle <html> or <html ...>
        if (/<html\s+[^>]*>/i.test(content)) {
            // <html> has attributes but no lang - add it
            content = content.replace(
                /<html(\s+[^>]*)>/i,
                `<html$1 lang="${lang}">`
            );
        } else if (/<html>/i.test(content)) {
            // Simple <html> - add attributes
            content = content.replace(
                /<html>/i,
                `<html lang="${lang}">`
            );
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Added lang="${lang}" attribute to ${filePath}`);
    } catch (error) {
        console.error(`Error modifying file ${filePath}:`, error.message);
    }
}

/**
 * Fixes all files mentioned in the REACT_015 issue
 */
function fixReactLangAttributes() {
    const filesToFix = [
        'docs/index.html'
    ];
    
    filesToFix.forEach(filePath => {
        const fullPath = path.resolve(process.cwd(), filePath);
        if (fs.existsSync(fullPath)) {
            if (!hasLangAttribute(fullPath)) {
                addLangAttribute(fullPath, 'en');
            } else {
                console.log(`${filePath} already has lang attribute`);
            }
        } else {
            console.log(`File not found: ${filePath}`);
        }
    });
}

/**
 * Checks all files for lang attribute
 * @param {string[]} filePaths - Array of file paths to check
 * @returns {Object} - Summary of results
 */
function checkLangAttributes(filePaths) {
    const results = {
        passed: [],
        failed: []
    };
    
    filePaths.forEach(filePath => {
        if (hasLangAttribute(filePath)) {
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
    hasLangAttribute,
    addLangAttribute,
    fixReactLangAttributes,
    checkLangAttributes
};