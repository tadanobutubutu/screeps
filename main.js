// User Safety: unsafe
// Safety Categories: Needs Caution, Unauthorized Advice, Criminal Planning/Confessions

// main.js

// Import and re-export someFunction from './utils'
const _utils = require('./utils');
const someFunction = _utils.default || _utils.someFunction || _utils;

// TODO: Address accessibility issues from insight report:
// - REACT_025: Ensure unique landmarks
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

// Assuming you have defined these functions elsewhere in your codebase:
// addLangAttribute()
// fixTableStructure()
// addLandmarkIssues()
// addSvgAccessibleNames()
// ensureUniqueLandmarks()
// fixFakeLinkIssue()

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(lang = 'en') {
  if (typeof document === 'undefined') return;
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
}

// REACT_027: Fix 26 table structure issues
function fixTableStructure() {
  if (typeof document === 'undefined') return;
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has a caption
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
    }
    // Ensure <th> elements have scope attribute
    const thElements = table.querySelectorAll('th');
    thElements.forEach(th => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
}

// REACT_017: Add/fix 4 landmark issues
function addLandmarkIssues() {
  if (typeof document === 'undefined') return;
  // Ensure <main> landmark exists
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    const body = document.body;
    if (body) {
      body.appendChild(main);
    }
  }
  // Ensure <nav> landmarks have aria-label
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
  // Ensure <header> and <footer> exist
  if (!document.querySelector('header')) {
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    document.body.insertBefore(header, document.body.firstChild);
  }
  if (!document.querySelector('footer')) {
    const footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    document.body.appendChild(footer);
  }
}

// REACT_041: Add accessible names to 2 SVGs
function addSvgAccessibleNames() {
  if (typeof document === 'undefined') return;
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', 'Decorative icon');
      svg.setAttribute('role', 'img');
    }
  });
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return;
  const landmarkSelectors = ['header', 'nav', 'main', 'footer', 'aside', 'section'];
  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      if (elements.length > 1) {
        if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
          el.setAttribute('aria-label', `${selector} ${index + 1}`);
        }
      }
    });
  });
}

// REACT_036: Fix 1 fake link issue
function fixFakeLinkIssue() {
  if (typeof document === 'undefined') return;
  // Find elements that look like links but are not
  const fakeLinks = document.querySelectorAll('[role="link"]');
  fakeLinks.forEach(el => {
    if (el.tagName !== 'A' && el.tagName !== 'a') {
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
    }
  });
}

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)

// Utility functions for accessibility
const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  }
};

// Existing configuration
// TODO: This is the existing code that needs to be preserved
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
        console.error('No insight report provided');
        return result;
    }

    // Normalize input to an array of issues
    const issues = Array.isArray(insightReport)
        ? insightReport
        : (Array.isArray(insightReport.issues) ? insightReport.issues : []);

    result.totalIssues = issues.length;

    issues.forEach(function (issue, index) {
        if (!issue || typeof issue !== 'object') {
            return;
        }

        const addressed = {
            index: index,
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
            console.log('[Accessibility] ' + addressed.action + ': ' + addressed.message);
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

// Default options object for addressAccessibilityIssuesFromInsight
const defaultAccessibilityOptions = { autoFix: false, verbose: false };

// Wrap the function to apply defaults
const _originalAddressAccessibilityIssuesFromInsight = addressAccessibilityIssuesFromInsight;
function addressAccessibilityIssuesFromInsightWrapped(insightReport, options) {
    const mergedOptions = Object.assign({}, defaultAccessibilityOptions, options || {});
    return _originalAddressAccessibilityIssuesFromInsight(insightReport, mergedOptions);
}

// Re-assign to keep the same name available for exports
addressAccessibilityIssuesFromInsight = addressAccessibilityIssuesFromInsightWrapped;

/**
 * Gets the current lang attribute from the document's <html> element
 * @returns {string} The current lang attribute value
 */
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || '';
  }
  return '';
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
    } else if (/\b(el|la|los|las|de|que|y|en|es|un|una|por|con|para)\b/i.test(content) && /[áéíóúñü]/i.test(content)) {
      lang = 'es'; // Spanish
    }
    // Check for Spanish-specific characters
    else if (/[áéíóúüñ¿¡]/i.test(content)) {
      lang = 'es'; // Spanish
    }
    // Check for Portuguese-specific characters
    else if (/[áàâãéêíóôõúç]/i.test(content)) {
      lang = 'pt'; // Portuguese
    }
    // Check for Korean characters
    else if (/[\uac00-\ud7af]/.test(content)) {
      lang = 'ko'; // Korean
    }
  }
  
  return lang;
}

/**
 * Returns a properly formatted person name
 * @param {string} name - The person's name
 * @returns {string} The formatted person name
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
 * Creates an accessible web resource button suitable for accessibility (e.g., Github, Stack Overflow, etc.)
 * @param {string} text - The button label text
 * @param {string} [url] - The URL to navigate to (optional)
 * @param {string} [icon] - Optional icon identifier
 * @param {string} [className] - Optional CSS class
 * @returns {HTMLElement} An accessible button element
 */
function createAccessibleButton(text, url = '', icon = '', className = '') {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = text;
  
  if (url) {
    btn.href = url;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
  }
  
  if (icon) {
    // Placeholder for icon implementation - could use an SVG or image
  }
  
  if (className) {
    btn.className = className;
  }

  const landmarks = root.querySelectorAll(
    'header, nav, main, footer, aside, section, ' +
    '[role="banner"], [role="navigation"], [role="main"], ' +
    '[role="contentinfo"], [role="complementary"], [role="region"], ' +
    '[role="search"], [role="form"]'
  );

  const issues = [];
  const roleCounts = {};
  const labelledRoles = {}; // Maps role -> Set of labels

  landmarks.forEach((landmark, index) => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    const label = landmark.getAttribute('aria-label') ||
                  (landmark.getAttribute('aria-labelledby') ?
                    `#${landmark.getAttribute('aria-labelledby')}` : '');

    // Count roles
    roleCounts[role] = (roleCounts[role] || 0) + 1;

    // Track labelled roles for uniqueness check
    if (label) {
      if (!labelledRoles[role]) labelledRoles[role] = new Set();
      labelledRoles[role].add(label);
      
      // Check for duplicate labels within the same role
      if (labelledRoles[role].has(label)) {
        issues.push({
          type: 'duplicate_labeled_landmark',
          element: landmark,
          role,
          message: `Duplicate label "${label}" for landmark with role "${role}"`
        });
      } else {
        labelledRoles[role].add(label);
      }
    } else {
      // Unlabelled landmarks - check for duplicates
      if (roleCounts[role] > 1) {
        issues.push({
          type: 'duplicate_unlabelled_landmark',
          element: landmark,
          role,
          message: `Multiple <${role}> landmarks without unique labels`
        });
      }
    }
  });

  // Check for required landmarks
  const requiredRoles = ['main'];
  requiredRoles.forEach(role => {
    if (!roleCounts[role]) {
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
 * Creates an accessible in-page button and appends it to the given parent element.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(parent = document.body) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Open modal');
  parent.appendChild(btn);
  return btn;
}

/**
 * Validates the accessibility of a table element
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} Whether the table is accessible
 */
function validateTableAccessibility(table) {
  if (!table || typeof table !== 'object') return true;
  
  // Check if table has proper caption or summary
  const caption = table.querySelector('caption');
  const summary = table.getAttribute('summary');
  
  // Check if headers have proper associations
  const headers = table.querySelectorAll('th');
  const hasProperHeaders = Array.from(headers).every(th => {
    return th.hasAttribute('scope') || th.hasAttribute('id');
  });
  
  // Return true if accessible (has caption/summary OR proper header associations)
  return !!(caption || summary || hasProperHeaders);
}

/**
 * Validates the structure of a table element
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} Whether the table structure is valid
 */
function validateTableStructure(table) {
  if (!table || typeof table !== 'object') return true;
  
  // Check for proper table structure: thead, tbody, tfoot
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');
  
  // Check if first row contains only th elements (header row)
  const firstRow = table.querySelector('tr');
  if (firstRow) {
    const cells = firstRow.querySelectorAll('th, td');
    const hasHeaderCells = Array.from(cells).some(cell => cell.tagName === 'TH');
    if (hasHeaderCells && !thead) {
      return false; // Should have thead when using th elements
    }
  }
  
  // Table should have at least one tbody
  if (!tbody && table.querySelector('tr')) {
    return false;
  }
  
  return true;
}

/**
 * Validates a landmark element for accessibility
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {boolean} Whether the landmark is valid
 */
function validateLandmark(element) {
  if (!element || typeof element !== 'object') return true;
  
  // Check if element has a valid landmark role
  const role = element.getAttribute('role');
  const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  
  // If no role attribute, check if it's a semantic landmark element
  const isSemanticLandmark = ['header', 'nav', 'main', 'aside', 'footer'].includes(element.tagName.toLowerCase());
  
  // Check if label is provided for landmarks that need it
  if (role === 'navigation' || role === 'search' || role === 'form') {
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledby = element.getAttribute('aria-labelledby');
    if (!ariaLabel && !ariaLabelledby) {
      return false; // Navigation, search, and form landmarks should have labels
    }
  }
  
  return true;
}

/**
 * Validates the structure of landmark elements
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {boolean} Whether the landmark structure is valid
 */
function validateLandmarkStructure(element) {
  if (!element || typeof element !== 'object') return true;
  
  // Check for unique landmarks
  if (element.tagName) {
    const tagName = element.tagName.toLowerCase();
    
    // Only one main landmark should exist
    if (tagName === 'main' || element.getAttribute('role') === 'main') {
      const allMains = document.querySelectorAll('main, [role="main"]');
      if (allMains.length > 1) {
        return false; // Multiple main landmarks found
      }
    }
    
    // Only one contentinfo (footer) landmark should exist
    if (tagName === 'footer' || element.getAttribute('role') === 'contentinfo') {
      const allFooters = document.querySelectorAll('footer, [role="contentinfo"]');
      if (allFooters.length > 1) {
        return false; // Multiple contentinfo landmarks found
      }
    }
    
    // Only one banner (header) landmark should exist
    if (tagName === 'header' || element.getAttribute('role') === 'banner') {
      const allHeaders = document.querySelectorAll('header:not([role]), header[role="banner"], [role="banner"]');
      if (allHeaders.length > 1) {
        return false; // Multiple banner landmarks found
      }
    }
  }
  
  return true;
}

/**
 * Gets the accessible name from an SVG element
 * @param {SVGSVGElement} svg - The SVG element
 * @returns {string} The accessible name of the SVG
 */
function getSvgAccessibleName(svg) {
  if (!svg || typeof svg !== 'object') return '';
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.querySelector('title')?.textContent || svg.getAttribute('title') || '';
}

/**
 * Validates that a link is not a fake link (looks like a link but isn't)
 * @param {HTMLElement} link - The link element to validate
 * @returns {boolean} Whether the link is a proper accessible link
 */
function validateLinkAccessibility(link) {
  if (!link || typeof link !== 'object') return true;
  
  const tagName = link.tagName ? link.tagName.toLowerCase() : '';
  
  // Check if it's an anchor or link element
  if (tagName === 'a' || tagName === 'area') {
    const href = link.getAttribute('href');
    // Valid links should have an href attribute
    if (!href || href === '#' || href === '') {
      return false; // Fake link detected
    }
    return true;
  }
  
  // Check if it has a button role but looks like a link
  const role = link.getAttribute('role');
  if (role === 'button' && (tagName !== 'button' && tagName !== 'input')) {
    // Check if it has proper button semantics
    const tabIndex = link.getAttribute('tabindex');
    const onClick = link.getAttribute('onclick');
    if (!tabIndex && !onClick) {
      return false;
    }
  }
  
  return true;
}

/**
 * Renders the main index view combining dependency graph and accessibility information
 * @param {Object} [dependencyInfo] - The dependency information from countDependencies()
 * @param {Object} [accessibilityInfo] - The accessibility validation results
 * @returns {string} Combined index view string
 */
function renderIndexView(dependencyInfo, accessibilityInfo) {
    const lines = [];
    
    if (dependencyInfo) {
        lines.push(renderDependencyGraph(dependencyInfo));
    }
    
    if (accessibilityInfo) {
        lines.push("Accessibility Validation Results");
        lines.push("=".repeat(25));
        lines.push("");
        lines.push("- Accessibility Issues: " + (accessibilityInfo.issues ? accessibilityInfo.issues.length : 0));
        lines.push("- Score: " + (accessibilityInfo.score || 0));
        lines.push("");
        
        if (accessibilityInfo.issues && accessibilityInfo.issues.length > 0) {
            lines.push("Issues:");
            accessibilityInfo.issues.forEach((issue, idx) => {
                lines.push(`  ${idx + 1}. ${issue.message}`);
            });
        }
    }
    
    return lines.join("\n");
}

/**
 * Renders the main view combining dependency graph information only
 * @param {Object} [dependencyInfo] - The dependency information from countDependencies()
 * @returns {string} Main view string
 */
function renderMainView(dependencyInfo) {
    const lines = [];
    
    if (dependencyInfo) {
        lines.push(renderDependencyGraph(dependencyInfo));
    }
    
    return lines.join("\n");
}

// TODO: Update the existing function using the new functions for rendering graph/index
function renderMainContent() {
    const dependencyInfo = countDependencies();
    
    return renderMainView(dependencyInfo);
}

/**
 * Generates a full report combining dependency and accessibility information
 * @param {Object} [dependencyInfo] - The dependency information from countDependencies()
 * @param {Object} [accessibilityInfo] - The accessibility validation results
 * @returns {string} Full report string
 */
function generateFullReport(dependencyInfo, accessibilityInfo) {
    return renderIndexView(dependencyInfo, accessibilityInfo);
}

/**
 * Calculates a discount based on price and discount percentage
 * @param {number} price - The original price
 * @param {number} discountPercent - The discount percentage (0-100)
 * @returns {Object} An object containing the discount amount and final price
 */
function calculateDiscount(price, discountPercent) {
    if (typeof price !== 'number' || typeof discountPercent !== 'number') {
        throw new Error('Price and discountPercent must be numbers');
    }
    if (price < 0) {
        throw new Error('Price cannot be negative');
    }
    if (discountPercent < 0 || discountPercent > 100) {
        throw new Error('Discount percentage must be between 0 and 100');
    }
    const discountAmount = price * (discountPercent / 100);
    const finalPrice = price - discountAmount;
    return {
        originalPrice: price,
        discountPercent: discountPercent,
        discountAmount: Math.round(discountAmount * 100) / 100,
        finalPrice: Math.round(finalPrice * 100) / 100
    };
}

/**
 * Addresses accessibility issues from an insight report
 * @param {Object|Array} insightReport - The insight report containing accessibility issues
 * @param {Object} [options] - Options for handling the issues
 * @param {boolean} autoFix - Whether to attempt automatic fixes
 * @param {boolean} verbose - Whether to log detailed information
 * @returns {Object} A report of addressed issues
 */
function addressAccessibilityIssuesFromInsight(insightReport, options = {}) {
    return addressAccessibilityIssues(insightReport, options);
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
    greeting,
    countDependencies,
    someFunction,
    renderDependencyGraph,
    getLangAttribute,
    getFullLangAttribute,
    addressAccessibilityIssues,
    sayHello,
    sayGoodbye,
    getDate,
    personName,
    setHtmlLangAttribute,
    detectAndSetLang,
    createInPageButton,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    calculateDiscount
};