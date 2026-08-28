// Example: Set the lang attribute on the root element dynamically
function setLanguage(lang) {
  document.documentElement.lang = lang;
}

// main.js - Main application logic

// Import necessary modules
const { checkAccessibility } = require('./accessibility');
const { checkStructure } = require('./structure');
const fs = require('fs');
const path = require('path');

// Import and re-export someFunction from './utils'
const _utils = require('./utils');
const someFunction = _utils.default || _utils.someFunction || _utils;

// Existing configuration
const config = {
    verbose: true,
    debug: false,
    rules: {
        contrast: true,
        semantic: true,
        structure: true
    }
};

// TODO: Address accessibility issues from insight report — CONTINUING
// Add new functions (no existing functions should be removed or renamed)

function addressAccessibilityIssues() {
  // TODO: Implement the required changes to improve accessibility
  // Placeholder implementation – actual accessibility enhancements would be added here
  console.log('Accessibility improvements to be implemented.');
}

// Main validation function for web accessibility
function validateWebAccessibility(url) {
    if (!url) {
        throw new Error('URL is required');
    }
    
    console.log(`Validating: ${url}`);
    
    const results = {
        accessibility: null,
        structure: null,
        errors: [],
        warnings: []
    };
    
    try {
        results.accessibility = validateTableAccessibility(url);
        results.structure = validateTableStructure(url);
    } catch (error) {
        results.errors.push(error.message);
    }
    
    return results;
}

// Helper function to check if element exists
function elementExists(selector) {
    return document.querySelector(selector) !== null;
}

// Helper function to get element text
function getElementText(selector) {
    const element = document.querySelector(selector);
    return element ? element.textContent : '';
}

// Get all table elements
function getAllTables() {
    return document.querySelectorAll('table');
}

// Get table headers
function getTableHeaders(table) {
    return table.querySelectorAll('th');
}

// Get table rows
function getTableRows(table) {
    return table.querySelectorAll('tr');
}

// Validate table accessibility
function validateTableAccessibility(tableOrUrl) {
    const tables = typeof tableOrUrl === 'string' 
        ? document.querySelectorAll('table') 
        : [tableOrUrl];
    
    const accessibilityResults = {
        hasHeaders: true,
        hasScope: true,
        hasIdOrHeaders: true,
        contrast: true,
        issues: [],
        score: 100
    };
    
    tables.forEach((table, index) => {
        const headers = table.querySelectorAll('th');
        
        // Check if table has headers
        if (headers.length === 0) {
            accessibilityResults.issues.push({
                table: index,
                type: 'missing_headers',
                message: `Table ${index + 1}: Missing table headers (th elements)`
            });
            accessibilityResults.hasHeaders = false;
            accessibilityResults.score -= 20;
        }
        
        // Check for scope attributes
        headers.forEach((header, hIndex) => {
            if (!header.hasAttribute('scope')) {
                accessibilityResults.issues.push({
                    table: index,
                    header: hIndex,
                    type: 'missing_scope',
                    message: `Table ${index + 1}, Header ${hIndex + 1}: Missing scope attribute`
                });
                accessibilityResults.hasScope = false;
                accessibilityResults.score -= 10;
            }
        });
        
        // Check for proper associations (id/headers)
        const cells = table.querySelectorAll('td');
        if (cells.length > 0 && headers.length > 0) {
            const hasProperAssociation = headers[0].hasAttribute('id') || 
                cells[0].hasAttribute('headers');
            if (!hasProperAssociation) {
                accessibilityResults.issues.push({
                    table: index,
                    type: 'missing_association',
                    message: `Table ${index + 1}: Tables with headers should use id/headers attributes for proper association`
                });
                accessibilityResults.hasIdOrHeaders = false;
                accessibilityResults.score -= 15;
            }
        }
    });
    
    return accessibilityResults;
}

// Validate table structure
function validateTableStructure(tableOrUrl) {
    const tables = typeof tableOrUrl === 'string' 
        ? document.querySelectorAll('table') 
        : [tableOrUrl];
    
    const structureResults = {
        hasCaption: true,
        hasSummary: true,
        consistentColumns: true,
        hasThead: true,
        hasTbody: true,
        issues: [],
        score: 100
    };
    
    tables.forEach((table, index) => {
        // Check for caption
        const caption = table.querySelector('caption');
        if (!caption) {
            structureResults.issues.push({
                table: index,
                type: 'missing_caption',
                message: `Table ${index + 1}: Missing caption element`
            });
            structureResults.hasCaption = false;
            structureResults.score -= 15;
        }
        
        // Check for summary (via aria-describedby or summary attribute)
        const hasSummaryAttr = table.hasAttribute('summary');
        const hasAriaDescription = table.hasAttribute('aria-describedby');
        if (!hasSummaryAttr && !hasAriaDescription) {
            structureResults.issues.push({
                table: index,
                type: 'missing_summary',
                message: `Table ${index + 1}: Missing summary (use summary attribute or aria-describedby)`
            });
            structureResults.hasSummary = false;
            structureResults.score -= 10;
        }
        
        // Check for thead
        const thead = table.querySelector('thead');
        if (!thead) {
            structureResults.issues.push({
                table: index,
                type: 'missing_thead',
                message: `Table ${index + 1}: Missing thead element`
            });
            structureResults.hasThead = false;
            structureResults.score -= 10;
        }
        
        // Check for tbody
        const tbody = table.querySelector('tbody');
        if (!tbody) {
            structureResults.issues.push({
                table: index,
                type: 'missing_tbody',
                message: `Table ${index + 1}: Missing tbody element`
            });
            structureResults.hasTbody = false;
            structureResults.score -= 10;
        }
        
        // Check column consistency
        const rows = table.querySelectorAll('tr');
        if (rows.length > 1) {
            const firstRowCells = rows[0].querySelectorAll('th, td').length;
            let inconsistent = false;
            
            rows.forEach((row, rIndex) => {
                const cellCount = row.querySelectorAll('th, td').length;
                if (cellCount !== firstRowCells) {
                    inconsistent = true;
                }
            });
            
            if (inconsistent) {
                structureResults.issues.push({
                    table: index,
                    type: 'inconsistent_columns',
                    message: `Table ${index + 1}: Inconsistent number of columns across rows`
                });
                structureResults.consistentColumns = false;
                structureResults.score -= 20;
            }
        }
    });
    
    return structureResults;
}

/**
 * Counts the total number of dependencies in package.json
 * @returns {Object} An object containing counts for dependencies, devDependencies, and total
 */
function countDependencies() {
  const packagePath = path.join(process.cwd(), 'package.json');
  
  try {
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    const dependencyCount = Object.keys(dependencies).length;
    const devDependencyCount = Object.keys(devDependencies).length;
    
    return {
      dependencies: dependencyCount,
      devDependencies: devDependencyCount,
      total: dependencyCount + devDependencyCount
    };
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    return {
      dependencies: 0,
      devDependencies: 0,
      total: 0
    };
  }
}

// Language attribute helper functions (from previous version)
function getLangAttribute(el) {
  // Implement the logic to return the language attribute
  // Example: return the current language code, e.g., 'en' or read from a config
  if (!el) {
    return 'en';
  }
  return el.getAttribute('lang');
}

function getFullLangAttribute(el) {
  // Implement the logic to return the full language attribute (if required)
  // Example: combine language code with region or locale identifier
  if (!el) {
    return 'en-US';
  }
  return el.getAttributeNS(null, 'xml:lang') || getLangAttribute(el);
}

// Improve accessibility by adding semantic role and label to the root element
const root = document.getElementById('root');
if (root) {
  root.setAttribute('role', 'main');
  root.setAttribute('aria-label', 'Main application');
}

// Export for testing and external use
module.exports = {
    validateWebAccessibility,
    validateTableAccessibility,
    validateTableStructure,
    elementExists,
    getElementText,
    getAllTables,
    getTableHeaders,
    getTableRows,
    config,
    countDependencies,
    someFunction,
    setLanguage,
    getLangAttribute,
    getFullLangAttribute,
    addressAccessibilityIssues
};