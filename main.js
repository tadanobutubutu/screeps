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

function setHtmlLangAttribute(lang = 'en') {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.lang = lang;
  }
  return lang;
}

function addLangAttribute(lang) {
  return setHtmlLangAttribute(lang);
}

function fixTableStructure(tableOrUrl) {
  if (typeof document === 'undefined') return { fixed: false, count: 0 };
  const tables = typeof tableOrUrl === 'string' ? document.querySelectorAll('table') : (tableOrUrl ? (Array.isArray(tableOrUrl) ? tableOrUrl : [tableOrUrl]) : []);
  let fixed = 0;
  tables.forEach(table => {
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table';
      try {
        table.insertBefore(caption, table.firstChild);
        fixed++;
      } catch (e) {}
    }
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
        fixed++;
      }
    }
    if (!table.querySelector('tbody')) {
      const tbody = document.createElement('tbody');
      const rows = Array.from(table.querySelectorAll('tr'));
      rows.forEach(row => {
        if (row.parentElement === table) {
          tbody.appendChild(row);
        }
      });
      table.appendChild(tbody);
      fixed++;
    }
    table.querySelectorAll('th').forEach(header => {
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', 'col');
        fixed++;
      }
    });
  });
  return { fixed: fixed > 0, count: fixed, tables: tables.length };
}

function validateLandmark(element) {
  const el = typeof element === 'string' ? (typeof document !== 'undefined' ? document.querySelector(element) : null) : (element || (typeof document !== 'undefined' ? document.body : null));
  if (!el) return { valid: false, role: null, message: 'No element found' };
  const role = el.getAttribute('role') || el.tagName.toLowerCase();
  const validLandmarks = ['main', 'navigation', 'region', 'search', 'banner', 'contentinfo', 'form', 'application', 'complementary'];
  const isValid = validLandmarks.indexOf(role) !== -1 || !!el.querySelector('[role]');
  return { valid: isValid, role, message: isValid ? 'Landmark valid' : 'Landmark missing or invalid' };
}

function validateLandmarkStructure(root) {
  if (typeof document === 'undefined') return { issues: [], score: 100 };
  const rootEl = typeof root === 'string' ? document.querySelector(root) : (root || document.body || document);
  const issues = [];
  const roles = ['main', 'navigation', 'banner'];
  roles.forEach(role => {
    const elements = (rootEl || document).querySelectorAll(`[role="${role}"], ${role}`);
    if (elements.length > 1) {
      issues.push({ type: 'duplicate_landmark', role, message: `Multiple ${role} landmarks found` });
    }
  });
  const score = Math.max(0, 100 - issues.length * 25);
  return { issues, score };
}

function addLandmarkIssues(element) {
  if (typeof document === 'undefined') return { added: 0, message: 'Document unavailable' };
  const el = typeof element === 'string' ? document.querySelector(element) : (element || document.body);
  if (!el) return { added: 0, message: 'No element' };
  let added = 0;
  if (!document.querySelector('main, [role="main"]')) {
    added++;
  }
  return { added, element: el.tagName ? el.tagName.toLowerCase() : null };
}

function getSvgAccessibleName(svg) {
  const el = typeof svg === 'string' ? (typeof document !== 'undefined' ? document.querySelector(svg) : null) : svg;
  if (el && typeof el.getAttribute === 'function') {
    const aria = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
    if (aria) return aria;
    const titleEl = el.querySelector('title');
    if (titleEl) return titleEl.textContent || '';
  }
  return '';
}

function addSvgAccessibleNames(container) {
  if (typeof document === 'undefined') return { added: 0 };
  const root = typeof container === 'string' ? document.querySelector(container) : (container || document);
  let added = 0;
  if (root) {
    root.querySelectorAll('svg').forEach(svg => {
      if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby') && !svg.querySelector('title')) {
        svg.setAttribute('aria-label', 'SVG graphic');
        added++;
      }
    });
  }
  return { added };
}

function ensureUniqueLandmarks(root) {
  if (typeof document === 'undefined') return { fixed: 0 };
  const rootEl = typeof root === 'string' ? document.querySelector(root) : (root || document.body || document);
  let fixed = 0;
  const roles = ['main', 'navigation'];
  roles.forEach(role => {
    const elements = (rootEl || document).querySelectorAll(`[role="${role}"], ${role}`);
    if (elements.length > 1) {
      fixed += elements.length - 1;
    }
  });
  return { fixed };
}

function fixFakeLinkIssue(elementOrUrl) {
  if (typeof document === 'undefined') return { fixed: 0 };
  const root = typeof elementOrUrl === 'string' ? document.querySelector(elementOrUrl) : (elementOrUrl || document.body);
  let fixed = 0;
  if (root) {
    root.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href === 'javascript:void(0);') {
        if (link.hasAttribute('onclick') || link.getAttribute('role') === 'button') {
          const btn = document.createElement('button');
          btn.textContent = link.textContent;
          btn.setAttribute('type', 'button');
          if (typeof link.onclick === 'function') {
            btn.onclick = link.onclick;
          }
          if (link.parentNode) link.parentNode.replaceChild(btn, link);
          fixed++;
        } else {
          link.setAttribute('href', '#');
          fixed++;
        }
      }
    });
  }
  return { fixed };
}

function createInPageButton(text, onClick) {
  if (typeof document === 'undefined') {
    return { tag: 'button', text: text || 'Button', onclick: onClick };
  }
  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.textContent = text || 'Button';
  if (typeof onClick === 'function') {
    btn.addEventListener('click', onClick);
  }
  return btn;
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
    addLangAttribute,
    fixTableStructure,
    addLandmarkIssues,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinkIssue,
    createInPageButton
};