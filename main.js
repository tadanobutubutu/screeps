// Main.js - React Landmarks Fix Utility
// Fixes REACT_017: React Landmarks - Page has no <main> landmark
// Main application logic

const fs = require('fs');
const path = require('path');

/**
 * Rotates an element by the specified angle
 * @param {HTMLElement} element - The element to rotate
 * @param {number} angle - The angle in degrees
 */
function rotateElement(element, angle) {
    if (element) {
        element.style.transform = `rotate(${angle}deg)`;
        element.setAttribute('data-rotated', angle);
    }
}

/**
 * Resets the rotation of an element
 * @param {HTMLElement} element - The element to reset
 */
function resetRotation(element) {
    if (element) {
        element.style.transform = 'rotate(0deg)';
        element.removeAttribute('data-rotated');
    }
}

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
 * Initializes the rotation controls
 * @param {string} targetId - The ID of the element to rotate
 * @param {string} controlId - The ID of the control element
 */
function initializeRotation(targetId, controlId) {
    const target = document.getElementById(targetId);
    const control = document.getElementById(controlId);
    let currentRotation = 0;
    
    if (control && target) {
        // Fix: Changed from <a href="#"> to <button> for proper accessibility
        control.addEventListener('click', function(e) {
            e.preventDefault();
            currentRotation += 90;
            if (currentRotation >= 360) {
                currentRotation = 0;
                resetRotation(target);
                control.textContent = 'rotate back';
            } else {
                rotateElement(target, currentRotation);
                control.textContent = `reset (${currentRotation}°)`;
            }
        });
    }
}

/**
 * Fixes all files mentioned in the REACT_017 issue
 */
function fixReactLandmarks() {
    const filesToFix = [
        { path: 'app/layout.tsx', type: 'tsx' },
        { path: 'dashboard/app/layout.tsx', type: 'tsx' },
        { path: 'docs/index.html', type: 'html' }
    ];
    
    filesToFix.forEach(({ path: filePath, type }) => {
        const fullPath = path.resolve(process.cwd(), filePath);
        if (!hasMainLandmark(fullPath)) {
            addMainLandmark(fullPath, type);
        } else {
            console.log(`${filePath} already has <main> landmark`);
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeRotation('rotatable', 'unrotate');
});

module.exports = {
    rotateElement,
    resetRotation,
    initializeRotation,
    hasMainLandmark,
    addMainLandmark,
    fixReactLandmarks,
    checkLandmarks
};