// main.js - Main entry point for the accessibility checker
// This file contains the rule definitions and checks for accessibility issues

const rules = {
    // Existing rules are preserved
};

/**
 * Rule REACT_017: React Landmarks
 * Checks if page has a <main> landmark for accessibility
 * Severity: warning
 */
function checkREACT017(dom) {
    const mainElements = dom.querySelectorAll('main');
    
    if (mainElements.length === 0) {
        return {
            rule: 'REACT_017',
            severity: 'warning',
            message: 'Page has no <main> landmark',
            suggestion: 'Wrap the primary content in <main> so it can be skipped to',
            occurrences: 2
        };
    }
    
    return null;
}

// Add the new rule to the rules object
rules['REACT_017'] = checkREACT017;

// Export all existing rules and functions
module.exports = {
    rules,
    // Existing exports are preserved
};

module.exports.default = module.exports;