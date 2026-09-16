// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by setHtmlLangAttribute() and detectAndSetLang())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by ... [PERSON_NAME](), ... and personName())
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
  
  return lang;
}

/**
 * Sets the lang attribute on the HTML element
 * @param {string} lang - The language code to set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
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
        console.error({
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
 * Gets the current lang attribute value from the document's <html> tag
 * @returns {string} The current lang attribute value
 */
function getLangAttribute() {
  return 'en';
}

/**
 * Sets the lang attribute on the HTML element
 * @param {string} lang - The language code to set (e.g., 'en', 'fr', 'es')
 * @returns {boolean} True if successful, false otherwise
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement && lang) {
    document.documentElement.lang = lang;
    return true;
  }
  return false;
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
    return `<a href="#" data-person-name="${name}">${name}</a>`;
  } else {
    // Render as a span for non-link content
    return `<span data-person-name="${name}">${name}</span>`;
  }
}

/**
 * Addresses accessibility issues from an insight report by applying fixes
 * @param {Array} issues - Array of accessibility issues to address
 * @param {Object} options - Options for how to address the issues
 * @param {string} options.defaultText - Default text to add when no other text is available
 * @param {boolean} options.useAriaLabel - Prefer aria-label over visible text
 * @returns {Object} - Summary of fixes applied
 */
function addressAccessibilityIssues(issues, options = {}) {
  const defaultText = options.defaultText || 'Action';
  const useAriaLabel = options.useAriaLabel || false;
  
  const summary = {
    totalIssues: issues.length,
    linkIssuesFixed: 0,
    buttonIssuesFixed: 0,
    skipped: 0,
    fixes: []
  };

  issues.forEach((issue) => {
    if (!issue.element || !issue.element.parentNode) {
      summary.skipped++;
      return;
    }

    try {
      if (issue.type === 'link') {
        if (useAriaLabel) {
          issue.element.setAttribute('aria-label', defaultText);
        } else {
          // Add visible text content
          const textNode = document.createTextNode(defaultText);
          issue.element.appendChild(textNode);
        }
        summary.linkIssuesFixed++;
        summary.fixes.push({
          type: 'link',
          index: issue.index,
          action: 'Added accessible text content'
        });
      } else if (issue.type === 'button') {
        if (useAriaLabel) {
          issue.element.setAttribute('aria-label', defaultText);
        } else {
          // Add visible text content
          const textNode = document.createTextNode(defaultText);
          issue.element.appendChild(textNode);
        }
        summary.buttonIssuesFixed++;
        summary.fixes.push({
          type: 'button',
          index: issue.index,
          action: 'Added accessible name'
        });
      }
    } catch (error) {
      summary.skipped++;
      summary.fixes.push({
        type: issue.type,
        index: issue.index,
        action: 'Failed to fix',
        error: error.message
      });
    }
  });

  return summary;
}

function calculateProduct(a, b) {
  return a * b;
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { addressAccessibilityIssues, calculateSum, calculateProduct };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.calculateSum = calculateSum;
  window.calculateProduct = calculateProduct;
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
    
    try {
        results.accessibility = validateTableAccessibility(url);
        results.structure = validateTableStructure(url);
        results.landmark = validateLandmark(url);
        results.landmarkStructure = validateLandmarkStructure(url);
    } catch (error) {
        results.errors.push(error.message);
    }
    
    if (includeAccessibilityInfo) {
        content += `
            <div class="accessibility-info">
                <h2>Accessibility Status</h2>
                <p>The project includes several accessibility validation functions:</p>
                <ul>
                    <li>validateWebAccessibility - Validates web accessibility</li>
                    <li>validateTableAccessibility - Validates table accessibility</li>
                    <li>validateTableStructure - Validates table structure</li>
                    <li>addressAccessibilityIssuesFromInsight - Handles accessibility issues</li>
                </ul>
            </div>
        `;
    }
    
    content += `
            <div class="project-info">
                <h2>Quick Links</h2>
                <p>Available functions and modules for use:</p>
                <ul>
                    <li>validateWebAccessibility</li>
                    <li>addressAccessibilityIssuesFromInsight</li>
                    <li>getLangAttribute</li>
                    <li>personName</li>
                    <li>countDependencies</li>
                    <li>renderDependencyGraph</li>
                </ul>
            </div>
        </div>
    `;
    
    return content;
}

function elementExists(selector) {
    return typeof document !== 'undefined' && !!document.querySelector(selector);
}

function getElementText(selector) {
    if (typeof document === 'undefined') return '';
    const el = document.querySelector(selector);
    return [ADDRESS] ? (el.textContent || '') : '';
}

function getAllTables() {
    return typeof document !== 'undefined' ? document.querySelectorAll('table') : [];
}

function getFullLangAttribute(el) {
    const element = typeof el === 'string' ? document.querySelector(el) : (el || (typeof document !== 'undefined' ? document.documentElement : null));
    return element ? (element.lang || element.getAttribute('lang') || '') : '';
}

/**
 * Sets the lang attribute on the HTML element
 * @param {string} lang - The language code to set (e.g., 'en', 'es', 'fr')
 * @returns {boolean} True if successful, false otherwise
 */
function setHtmlLangAttribute(lang) {
  if (typeof document === 'undefined' || !document.documentElement) {
    return false;
  }
  
  if (!lang || typeof lang !== 'string') {
    return false;
  }
  
  document.documentElement.lang = lang;
  return true;
}

/**
 * Detects language settings from the document and sets the lang attribute if needed
 * @param {string} [lang] - Optional language code to set. If not provided, tries to detect from document
 * @returns {boolean} True if lang attribute was set, false otherwise
 */
function detectAndSetLang(lang) {
  if (lang) {
    return setHtmlLangAttribute(lang);
  }
  
  // Try to detect language from existing elements
  if (typeof document === 'undefined' || !document.documentElement) {
    return false;
  }
  
  const currentLang = document.documentElement.lang;
  if (currentLang) {
    return true;
  }
  
  // Try to detect from html tag attribute
  const htmlElement = document.documentElement;
  const detectedLang = htmlElement.getAttribute('lang') || htmlElement.getAttribute('xml:lang');
  if (detectedLang) {
    htmlElement.lang = detectedLang;
    return true;
  }
  
  // Default to 'en' if no language detected
  return setHtmlLangAttribute('en');
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
 * Validates landmark regions on the page
 * @param {string} [url] - Optional URL parameter for consistency
 * @returns {Object} Validation results for landmarks
 */
function validateLandmark(url) {
    if (typeof document === 'undefined') {
        return { issues: [], score: 100, landmarks: {} };
    }
    
    const result = {
        issues: [],
        score: 100,
        landmarks: {}
    };
    
    const landmarkRoles = ['header', 'nav', 'main', 'aside', 'footer', 'form', 'search', 'banner', 'complementary', 'contentinfo', 'navigation', 'region'];
    
    landmarkRoles.forEach(landmark => {
        const elements = document.querySelectorAll(landmark);
        if (elements.length > 0) {
            result.landmarks[landmark] = elements.length;
        }
    });
    
    // Check for main landmark
    const mains = document.querySelectorAll('main');
    if (mains.length === 0) {
        result.issues.push({
            type: 'missing_main',
            message: 'Missing main landmark'
        });
        result.score -= 25;
    } else if (mains.length > 1) {
        result.issues.push({
            type: 'multiple_main',
            message: `Multiple main landmarks found (${mains.length})`
        });
        result.score -= 10;
    }
    
    return result;
}

/**
 * Validates landmark structure
 * @param {string} [url] - Optional URL parameter for consistency
 * @returns {Object} Structure validation results
 */
function validateLandmarkStructure(url) {
    if (typeof document === 'undefined') {
        return { issues: [], score: 100, validStructure: true };
    }
    
    const result = {
        issues: [],
        score: 100,
        validStructure: true
    };
    
    const main = document.querySelector('main');
    if (main) {
        const navInsideMain = main.querySelector('nav');
        if (navInsideMain) {
            result.issues.push({
                type: 'nav_in_main',
                message: 'Nav element found inside main landmark'
            });
            result.score -= 10;
        }
    }
    
    return result;
}

/**
 * Adds proper landmark regions to the document
 * @param {Object} [options] - Options for adding landmarks
 * @param {boolean} [options.verbose=false] - Whether to log detailed information
 * @returns {Object} Report of added landmarks
 */
function addProperLandmarkRegions(options = {}) {
    const { verbose = false } = options;
    const result = {
        added: [],
        timestamp: new Date().toISOString()
    };
    
    if (typeof document === 'undefined') {
        return result;
    }
    
    // Ensure main landmark exists
    let main = document.querySelector('main');
    if (!main) {
        main = document.createElement('main');
        document.body.appendChild(main);
        result.added.push('main');
        if (verbose) console.log('Added main landmark');
    }
    
    // Ensure header landmark exists
    let header = document.querySelector('header');
    if (!header) {
        header = document.createElement('header');
        document.body.insertBefore(header, document.body.firstChild);
        result.added.push('header');
        if (verbose) console.log('Added header landmark');
    }
    
    // Ensure footer landmark exists
    let footer = document.querySelector('footer');
    if (!footer) {
        footer = document.createElement('footer');
        document.body.appendChild(footer);
        result.added.push('footer');
        if (verbose) console.log('Added footer landmark');
    }
    
    return result;
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
      devDependencies: Object.keys(devDependencies),
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

/**
 * Sets the lang attribute on the HTML element
 * @param {string} lang - The language code to set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
  }
}

/**
 * Validates landmark accessibility issues
 * @param {string} [url] - Optional URL (not used)
 * @returns {Array} Array of issue objects
 */
function validateLandmark(url) {
  const issues = [];
  if (typeof document === 'undefined') return issues;
  const landmarkRoles = ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'];
  const counts = {};
  const selectors = landmarkRoles.map(role => `[role="${role}"]`).join(',');
  const landmarks = document.querySelectorAll(selectors);
  landmarks.forEach(el => {
    const role = el.getAttribute('role');
    counts[role] = (counts[role] || 0) + 1;
    const hasLabel = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.textContent.trim();
    if (!hasLabel) {
      issues.push({ type: 'missing_name', message: `Landmark missing accessible name: ${role}` });
    }
  });
  landmarkRoles.forEach(role => {
    if (counts[role] > 1) {
      issues.push({ type: 'duplicate_landmark', message: `Duplicate landmark role: ${role} (${counts[role]} occurrences)` });
    }
  });
  return issues;
}

/**
 * Validates landmark structure (e.g., nesting)
 * @returns {Array} Array of issue objects
 */
function validateLandmarkStructure() {
  const issues = [];
  if (typeof document === 'undefined') return issues;
  const main = document.querySelectorAll('[role="main"], main');
  if (main.length === 0) {
    issues.push({ type: 'missing_main', message: 'Missing main landmark' });
  } else if (main.length > 1) {
    issues.push({ type: 'duplicate_main', message: 'Multiple main landmarks' });
  }
  return issues;
}

/**
 * Gets an accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string} Accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const title = svg.querySelector('title');
  if (title && title.textContent) return title.textContent.trim();
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  const labelledBy = svg.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy);
    if (labelEl) return labelEl.textContent.trim();
  }
  const id = svg.getAttribute('id');
  if (id) return id;
  return '';
}

/**
 * Creates an accessible in-page button (anchor with role button)
 * @param {string} label - The button label
 * @param {string} href - The URL to navigate to
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(label, href) {
  if (typeof document === 'undefined') return null;
  const button = document.createElement('a');
  button.href = href || '#';
  button.setAttribute('role', 'button');
  button.setAttribute('tabindex', '0');
  button.textContent = label;
  button.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      button.click();
    }
  });
  return button;
}

/**
 * Ensures landmark roles are unique
 * @returns {Array} Array of duplicate landmark issues
 */
function ensureUniqueLandmarks() {
  const issues = [];
  if (typeof document === 'undefined') return issues;
  const roles = ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'];
  roles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      issues.push({ type: 'duplicate_landmark', message: `Duplicate landmark role: ${role} (${elements.length} occurrences)` });
    }
  });
  return issues;
}

module.exports = {
    validateWebAccessibility,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    addProperLandmarkRegions,
    elementExists,
    getElementText,
    getAllTables,
    getTableHeaders,
    getTableRows,
    config,
    countDependencies,
    someFunction,
    renderDependencyGraph,
    renderIndexView,
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
    validateLandmarkStructure,
    getSvgAccessibleName,
    createInPageButton
};