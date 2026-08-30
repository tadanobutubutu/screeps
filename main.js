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
 * @param {string} [content] - The text content to analyze (optional)
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English

  // If no content provided, fall back to browser/navigator language
  if (!content) {
    if (typeof navigator !== 'undefined') {
      lang = navigator.language || navigator.userLanguage || 'en';
      // Normalize to primary subtag (e.g. 'en-US' -> 'en')
      lang = lang.split('-')[0] || 'en';
    }
  } else {
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

  // Apply to the document if available
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
  }

  return lang;
}

/**
 * Sets the lang attribute on the HTML element
 * @param {string} lang - The language code to set
 * @returns {boolean} True if successfully set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
    return true;
  }
  return false;
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
    return `<a href="#" aria-label="${name}">${name}</a>`;
  } else {
    // Render as a span for non-link content
    return `<span aria-label="${name}">${name}</span>`;
  }
}

/**
 * Creates an accessible in-page button element (not a fake link)
 * @param {string} text - The button text
 * @param {Function} onClick - Click handler
 * @param {Object} [attributes] - Additional attributes
 * @returns {string} HTML string for the button
 */
function createInPageButton(text, onClick, attributes = {}) {
  if (!text) {
    return '';
  }

  const attrs = {
    type: 'button',
    'aria-label': text,
    ...attributes
  };

  const attrString = Object.entries(attrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  return `<button ${attrString}>${text}</button>`;
}

/**
 * Validates landmark elements for accessibility
 * @param {Element|string} container - Container element or selector
 * @returns {Object} Validation results
 */
function validateLandmark(container) {
  const root = typeof container === 'string'
    ? (typeof document !== 'undefined' ? document.querySelector(container) : null)
    : container;

  if (!root) {
    return {
      valid: false,
      landmarks: [],
      issues: [{ type: 'container_not_found', message: 'Container element not found' }]
    };
  }

  const landmarkSelectors = [
    'header', 'nav', 'main', 'footer', 'aside', 'section',
    '[role="banner"]', '[role="navigation"]', '[role="main"]',
    '[role="contentinfo"]', '[role="complementary"]', '[role="region"]',
    '[role="search"]', '[role="form"]'
  ];

  const landmarks = [];
  const issues = [];

  landmarkSelectors.forEach(selector => {
    const elements = root.querySelectorAll(selector);
    elements.forEach(el => {
      const role = el.getAttribute('role') || el.tagName.toLowerCase();
      const label = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || '';

      landmarks.push({
        element: el,
        role,
        label,
        hasLabel: !!label
      });

      if (!label && ['navigation', 'region', 'search', 'form'].includes(role)) {
        issues.push({
          type: 'missing_landmark_label',
          element: el,
          role,
          message: `Landmark with role "${role}" should have an accessible name`
        });
      }
    });
  });

  return {
    valid: issues.length === 0,
    landmarks,
    issues
  };
}

/**
 * Validates landmark structure for uniqueness and proper nesting
 * @param {Element|string} container - Container element or selector
 * @returns {Object} Validation results
 */
function validateLandmarkStructure(container) {
  const root = typeof container === 'string'
    ? (typeof document !== 'undefined' ? document.querySelector(container) : null)
    : container;

  if (!root) {
    return {
      valid: false,
      issues: [{ type: 'container_not_found', message: 'Container element not found' }]
    };
  }

  const landmarks = root.querySelectorAll(
    'header, nav, main, footer, aside, section, ' +
    '[role="banner"], [role="navigation"], [role="main"], ' +
    '[role="contentinfo"], [role="complementary"], [role="region"], ' +
    '[role="search"], [role="form"]'
  );

  const issues = [];
  const roleCounts = {};
  const labelledRoles = {};

  landmarks.forEach((landmark, index) => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    const label = landmark.getAttribute('aria-label') ||
                  (landmark.getAttribute('aria-labelledby') ?
                    `#${landmark.getAttribute('aria-labelledby')}` : '');

    // Count roles
    roleCounts[role] = (roleCounts[role] || 0) + 1;

    // Track labelled roles for uniqueness check
    if (label) {
      if (!labelledRoles[role]) labelledRoles[role] = [];
      labelledRoles[role].push(label);
    }

    // Check for duplicate unlabelled landmarks of same type
    if (!label && roleCounts[role] > 1) {
      issues.push({
        type: 'duplicate_unlabelled_landmark',
        element: landmark,
        role,
        message: `Multiple <${role}> landmarks without unique labels`
      });
    }
  });

  // Check for required landmarks
  const requiredRoles = ['main'];
  requiredRoles.forEach(role => {
    if (!roleCounts[role] && !roleCounts[role === 'main' ? 'main' : role]) {
      issues.push({
        type: 'missing_required_landmark',
        role,
        message: `Required landmark "${role}" is missing`
      });
    }
  });

  return {
    valid: issues.length === 0,
    roleCounts,
    labelledRoles,
    issues
  };
}

/**
 * Gets an accessible name for an SVG element
 * @param {SVGElement|string} svg - SVG element or selector
 * @returns {Object} Accessible name information
 */
function getSvgAccessibleName(svg) {
  const element = typeof svg === 'string'
    ? (typeof document !== 'undefined' ? document.querySelector(svg) : null)
    : svg;

  if (!element) {
    return {
      name: '',
      hasName: false,
      method: 'none',
      issues: [{ type: 'element_not_found', message: 'SVG element not found' }]
    };
  }

  // Check for various accessible name sources in priority order
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) {
    return { name: ariaLabel, hasName: true, method: 'aria-label' };
  }

  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy && typeof document !== 'undefined') {
    const labelEl = document.getElementById(ariaLabelledBy);
    if (labelEl) {
      return { name: labelEl.textContent.trim(), hasName: true, method: 'aria-labelledby' };
    }
  }

  const titleEl = element.querySelector('title');
  if (titleEl && titleEl.textContent.trim()) {
    return { name: titleEl.textContent.trim(), hasName: true, method: 'title_element' };
  }

  const descEl = element.querySelector('desc');
  if (descEl && descEl.textContent.trim()) {
    return { name: descEl.textContent.trim(), hasName: true, method: 'desc_element' };
  }

  // Check for role="img" with no name
  const role = element.getAttribute('role');
  if (role === 'img') {
    return {
      name: '',
      hasName: false,
      method: 'none',
      issues: [{ type: 'missing_accessible_name', message: 'SVG with role="img" requires an accessible name' }]
    };
  }

  return { name: '', hasName: false, method: 'none' };
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
    createInPageButton,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName
};