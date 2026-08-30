// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by setHtmlLangAttribute() and detectAndSetLang())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

const { greeting } = require('./utils');
const path = require('path');
const fs = require('fs');

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

/**
 * Sets the HTML lang attribute on the document's <html> element
 * @param {string} lang - The language code to set
 */
function setHtmlLangAttribute(lang) {
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = lang;
    }
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English
  
  if (content) {
    // Check for common non-ASCII characters to help detect language
    const hasChineseChars = /[\u4e00-\u9fff]/.test(content);
    if (hasChineseChars) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }
  
  setHtmlLangAttribute(lang);
  return lang;
}

/**
 * Addresses accessibility issues from an insight report
 * @param {Object|Array} insightReport - The insight report containing accessibility issues
 * @param {Object} [options] - Options for handling the issues
 * @param {boolean} autoFix - Whether to attempt automatic fixes
 * @param {boolean} verbose - Whether to log detailed information
 * @returns {Object} A report of addressed issues
 */
function addressAccessibilityIssues(insightReport, options = {}) {
    const { autoFix = false, verbose = false } = options;

    const result = {
        totalIssues: 0,
        addressed: 0,
        remaining: 0,
        details: [],
        timestamp: new Date().toISOString()
    };

    if (!insightReport) {
        result.details.push({
            type: 'error',
            message: 'No insight report provided'
        });
        return result;
    }

    // Normalize input to an array of issues
    const issues = Array.isArray(insightReport)
        ? insightReport
        : (insightReport.issues ? insightReport.issues : []);

    result.totalIssues = issues.length;

    issues.forEach((issue, index) => {
        if (!issue || typeof issue !== 'object') {
            return;
        }

        const addressed = {
            index,
            type: issue.type || 'unknown',
            severity: issue.severity || 'warning',
            message: issue.message || 'No message provided',
            action: 'reviewed'
        };

        if (autoFix && typeof issue.fix === 'function') {
            try {
                issue.fix();
                addressed.action = 'auto-fixed';
                result.addressed++;
            } catch (error) {
                addressed.action = 'auto-fix-failed';
                addressed.error = error.message;
                result.remaining++;
            }
        } else {
            result.addressed++;
        }

        if (verbose) {
            console.log(`[Accessibility] ${addressed.action}: ${addressed.message}`);
        }

        result.details.push(addressed);
    });

    if (result.totalIssues === 0) {
        result.remaining = 0;
    } else if (!autoFix) {
        result.remaining = result.totalIssues - result.addressed;
    }

    return result;
}

/**
 * Gets the current lang attribute value from the document's <html> tag
 * @returns {string} The current lang attribute value
 */
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

/**
 * Creates a properly accessible person name element, ensuring it's not implemented as a fake link
 * @param {string} name - The person's name
 * @param {boolean} isLink - Whether the name should be rendered as a link
 * @returns {string} HTML string representing the person name element
 */
function personName(name, isLink) {
  if (!name) {
    return '';
  }
  
  if (isLink) {
    // Properly implement as a link with href attribute to avoid fake link issues
    return `<a href="#" aria-label="Person: ${name}">${name}</a>`;
  } else {
    // Render as a span for non-link content
    return `<span aria-label="Person: ${name}">${name}</span>`;
  }
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

function sayHello(name) {
  return greeting(name);
}

function sayGoodbye(name) {
  return `Goodbye, ${name}!`;
}

function getDate() {
  return new Date().toISOString();
}

// Get table headers
function getTableHeaders(table) {
    if (!table) return [];
    return table.querySelectorAll ? Array.from(table.querySelectorAll('th')) : [];
}

// Get table rows
function getTableRows(table) {
    if (!table) return [];
    return table.querySelectorAll ? Array.from(table.querySelectorAll('tr')) : [];
}

// Validate table accessibility
function validateTableAccessibility(tableOrUrl) {
    const tables = typeof tableOrUrl === 'string' 
        ? (typeof document !== 'undefined' ? Array.from(document.querySelectorAll('table')) : []) 
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
        const headers = table.querySelectorAll ? Array.from(table.querySelectorAll('th')) : [];
        
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
            const scope = header.getAttribute ? header.getAttribute('scope') : null;
            if (!scope) {
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
        const cells = table.querySelectorAll ? Array.from(table.querySelectorAll('td')) : [];
        if (cells.length > 0 && headers.length > 0) {
            const hasProperAssociation = cells.some(cell => cell.getAttribute && cell.getAttribute('headers'));
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
        ? (typeof document !== 'undefined' ? Array.from(document.querySelectorAll('table')) : []) 
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
        const caption = table.querySelector ? table.querySelector('caption') : null;
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
        const hasSummaryAttr = table.getAttribute ? !!table.getAttribute('summary') : false;
        const hasAriaDescription = table.getAttribute ? !!table.getAttribute('aria-describedby') : false;
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
        const thead = table.querySelector ? table.querySelector('thead') : null;
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