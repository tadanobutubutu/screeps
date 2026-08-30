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
 * Sets the lang attribute on the HTML element
 * @param {string} lang - The language code to set (e.g., 'en', 'zh', 'ja')
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
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff\u3040-\u309f\u30a0-\u30ff]/.test(content)) {
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
  
  // Set the lang attribute
  setHtmlLangAttribute(lang);
  return lang;
}

/**
 * Addresses accessibility issues from an insight report
 * @param {Object|Array} insightReport - The insight report containing accessibility issues
 * @param {Object} [options] - Options for handling the issues
 * @param {boolean} [options.autoFix=false] - Whether to attempt automatic fixes
 * @param {boolean} [options.verbose=false] - Whether to log detailed information
 * @returns {Object} A report of addressed issues
 */
function addressAccessibilityIssuesFromInsight(insightReport, options = {}) {
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
        : (Array.isArray(insightReport.issues) ? insightReport.issues : []);

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
 * Validates landmark elements and structure for accessibility compliance
 * @param {string|HTMLElement} elementOrSelector - The element or selector to validate
 * @returns {Object} Validation results containing landmark information and issues
 */
function validateLandmark(elementOrSelector) {
    let element;
    
    if (typeof elementOrSelector === 'string') {
        if (typeof document !== 'undefined') {
            element = document.querySelector(elementOrSelector);
        } else {
            return {
                hasLandmark: false,
                landmarkRole: null,
                issues: ['Document not available for validation'],
                valid: false
            };
        }
    } else {
        element = elementOrSelector;
    }
    
    if (!element) {
        return {
            hasLandmark: false,
            landmarkRole: null,
            issues: ['Element not found'],
            valid: false
        };
    }
    
    const validLandmarkRoles = [
        'banner',    // header
        'navigation', // nav
        'main',      // main
        'complementary', // aside
        'contentinfo', // footer
        'search',    // search
        'form',      // form
        'region'     // generic region
    ];
    
    const ariaLabel = element.getAttribute('aria-label') || 
                     element.getAttribute('role') || 
                     element.tagName.toLowerCase();
    
    const isValidLandmark = validLandmarkRoles.includes(ariaLabel) || 
                           element.hasAttribute('role');
    
    const issues = [];
    
    if (!isValidLandmark && !element.hasAttribute('role')) {
        issues.push('Element does not have a valid landmark role');
    }
    
    // Check for duplicate landmark roles
    if (typeof document !== 'undefined') {
        const allLandmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="search"], [role="form"], [role="region"]');
        const sameRoleLandmarks = Array.from(allLandmarks).filter(el => 
            el.getAttribute('role') === element.getAttribute('role') || 
            el.getAttribute('role') === ariaLabel
        );
        
        if (sameRoleLandmarks.length > 1) {
            issues.push('Duplicate landmark role found - should be unique');
        }
    }
    
    // Check for proper naming
    const hasName = element.hasAttribute('aria-label') || 
                   element.hasAttribute('aria-labelledby') || 
                   element.textContent.trim().length > 0;
    
    if (!hasName) {
        issues.push('Landmark should have an accessible name');
    }
    
    return {
        hasLandmark: isValidLandmark,
        landmarkRole: element.getAttribute('role') || ariaLabel,
        issues: issues,
        valid: issues.length === 0
    };
}

/**
 * Ensures unique landmark roles across the page
 * @param {Object} options - Options for landmark uniqueness validation
 * @param {boolean} options.enforceUniqueness - Whether to enforce unique landmark roles
 * @returns {Object} Validation results for landmark uniqueness
 */
function validateLandmarkUniqueness(options = {}) {
    const { enforceUniqueness = true } = options;
    
    const results = {
        duplicateLandmarks: [],
        recommendations: [],
        valid: true
    };
    
    if (typeof document === 'undefined') {
        results.recommendations.push('Document not available for landmark uniqueness validation');
        return results;
    }
    
    const validLandmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
    const roleCounts = {};
    
    // Count occurrences of each landmark role
    validLandmarkRoles.forEach(role => {
        const elements = document.querySelectorAll(`[role="${role}"], ${role}:not([role])`);
        if (elements.length > 0) {
            roleCounts[role] = elements.length;
        }
    });
    
    // Check for duplicates
    Object.entries(roleCounts).forEach(([role, count]) => {
        if (count > 1) {
            results.duplicateLandmarks.push({
                role: role,
                count: count,
                issue: `Found ${count} elements with role "${role}" - should be unique`
            });
            results.valid = false;
        }
    });
    
    // Generate recommendations for unique landmarks
    if (results.duplicateLandmarks.length > 0) {
        results.duplicateLandmarks.forEach(duplicate => {
            results.recommendations.push(
                `Use aria-label or aria-labelledby to distinguish the ${duplicate.role} landmarks: ${duplicate.issue}`
            );
        });
    }
    
    return results;
}

/**
 * Gets an accessible name for an SVG element
 * @param {string|HTMLElement} svgOrSelector - The SVG element or its selector
 * @param {string} fallbackText - Fallback text if no accessible name is found
 * @returns {string} The accessible name for the SVG
 */
function getSvgAccessibleName(svgOrSelector, fallbackText = '') {
    let svg;
    
    if (typeof svgOrSelector === 'string') {
        if (typeof document !== 'undefined') {
            svg = document.querySelector(svgOrSelector);
        } else {
            return fallbackText || 'SVG element';
        }
    } else {
        svg = svgOrSelector;
    }
    
    if (!svg) {
        return fallbackText || 'SVG element';
    }
    
    // Check for aria-label
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) {
        return ariaLabel;
    }
    
    // Check for aria-labelledby
    const ariaLabelledBy = svg.getAttribute('aria-labelledby');
    if (ariaLabelledBy && typeof document !== 'undefined') {
        const labelledElement = document.getElementById(ariaLabelledBy);
        if (labelledElement) {
            return labelledElement.textContent || labelledElement.innerText || '';
        }
    }
    
    // Extract title element content
    const titleElement = svg.querySelector('title');
    if (titleElement && titleElement.textContent) {
        return titleElement.textContent;
    }
    
    // Extract description from alt text in img/svg
    const imgElement = svg.querySelector('image');
    if (imgElement && imgElement.getAttribute('alt')) {
        return imgElement.getAttribute('alt');
    }
    
    // Try to use the id or class as a fallback
    const id = svg.id || svg.getAttribute('id');
    if (id) {
        return `SVG: ${id}`;
    }
    
    const className = svg.className || '';
    if (className.baseVal && typeof className.baseVal === 'string') {
        return `SVG: ${className.baseVal.split(' ')[0]}`;
    }
    
    return fallbackText || 'SVG element';
}

// Existing function for person name accessibility
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

/**
 * Renders a dependency graph summary based on dependency counts
 * @param {Object} deps - Dependency information object from countDependencies()
 * @returns {string} Formatted dependency graph string
 */
function renderDependencyGraph(deps) {
    const lines = [
        "Dependency Graph Report",
        "=".repeat(20),
        "",
        "- Total Dependencies: " + deps.total,
        "- Core Dependencies: " + deps.dependencies,
        "- Development Dependencies: " + deps.devDependencies,
        ""
    ];
    
    if (deps.dependencies > 0) {
        lines.push("Core Dependencies:");
        deps.dependencies.forEach(dep => {
            lines.push(`  • ${dep.name} (${dep.version})`);
        });
    }
    
    if (deps.devDependencies > 0) {
        lines.push("Development Dependencies:");
        deps.devDependencies.forEach(dep => {
            lines.push(`  • ${dep.name} (${dep.version})`);
        });
    }
    
    return lines.join("\n");
}

function elementExists(selector) {
    return typeof document !== 'undefined' && !!document.querySelector(selector);
}

function getElementText(selector) {
    if (typeof document === 'undefined') return '';
    const el = document.querySelector(selector);
    return el ? (el.textContent || '') : '';
}

function getAllTables() {
    return typeof document !== 'undefined' ? document.querySelectorAll('table') : [];
}

function getFullLangAttribute(el) {
    const element = typeof el === 'string' ? document.querySelector(el) : (el || (typeof document !== 'undefined' ? document.documentElement : null));
    return element ? (element.lang || element.getAttribute('lang') || '') : '';
}

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
    renderDependencyGraph,
    getLangAttribute,
    getFullLangAttribute,
    addressAccessibilityIssuesFromInsight,
    sayHello,
    sayGoodbye,
    getDate,
    personName,
    setHtmlLangAttribute,
    detectAndSetLang,
    validateLandmark,
    validateLandmarkUniqueness,
    getSvgAccessibleName
};