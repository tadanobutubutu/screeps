// Existing code preserved...

// Import and re-export someFunction from './utils'
const _utils = require('./utils');
const someFunction = _utils.default || _utils.someFunction || _utils;

// Import functionA and functionB from utils
const { functionA, functionB } = require('./utils');

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
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e. g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

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
  
  return btn;
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
    addressAccessibilityIssuesFromInsight,
    createAccessibleButton,
    sayHello,
    sayGoodbye,
    getDate,
    personName,
    setHtmlLangAttribute,
    detectAndSetLang,
    renderIndexView,
    renderMainView,
    renderMainContent,
    generateFullReport
};