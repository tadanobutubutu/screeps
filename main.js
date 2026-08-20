const fs = require('fs');
const path = require('path');

/**
 * Checks if a file contains an accessible name for SVG
 * @param {string} filePath - Path to the file to check
 * @returns {boolean} - True if SVG has an accessible name
 */
function hasAccessibleSVGName(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return /<svg[\s]*aria-label[\s]*=[\s]*["'][^"']*["']|<svg[\s]*title[\s]*=[\s]*["'][^"']*["']|<svg[\s]*aria-hidden[\s]*=[\s]*["']true["']/i.test(content);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
        return false;
    }
}

/**
 * Adds an accessible name to an SVG in a file
 * @param {string} filePath - Path to the file
 * @param {string} type - Type of layout ('tsx' or 'html')
 */
function addAccessibleSVGName(filePath, type = 'tsx') {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Pattern: <svg> without an accessible name
        content = content.replace(
            /<svg[\s]*[^>]*>/i,
            '<svg aria-label="Descriptive label for SVG" $&>'
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Added accessible name to SVG in ${filePath}`);
    } catch (error) {
        console.error(`Error modifying file ${filePath}:`, error.message);
    }
}

/**
 * Fixes all files mentioned in the REACT_041 issue
 */
function fixReactSVGAccessibleName() {
    const filesToFix = [
        { path: 'app/layout.tsx', type: 'tsx' },
        { path: 'dashboard/app/layout.tsx', type: 'tsx' }
    ];
    
    filesToFix.forEach(({ path: filePath, type }) => {
        const fullPath = path.resolve(process.cwd(), filePath);
        if (!hasAccessibleSVGName(fullPath)) {
            addAccessibleSVGName(fullPath, type);
        } else {
            console.log(`${filePath} already has an accessible SVG name`);
        }
    });
}

/**
 * Checks all layout files for SVGs with accessible names
 * @param {string[]} filePaths - Array of file paths to check
 * @returns {Object} - Summary of results
 */
function checkSVGAccessibleNames(filePaths) {
    const results = {
        passed: [],
        failed: []
    };
    
    filePaths.forEach(filePath => {
        if (hasAccessibleSVGName(filePath)) {
            results.passed.push(filePath);
        } else {
            results.failed.push(filePath);
        }
    });
    
    return results;
}

// Export all functions for use in tests and other modules
module.exports = {
    hasAccessibleSVGName,
    addAccessibleSVGName,
    fixReactSVGAccessibleName,
    checkSVGAccessibleNames
};