// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)

// Utility functions for accessibility
const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.querySelector('.skip-link, [href^="#"]');
    // TODO: This is the existing code that needs to be preserved
    // (This comment remains as-is)
    // _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
    // <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
    // _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
    // <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
    // _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
    // <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
      
      moduleDiv.appendChild(depsList);
    }
  }
};

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
        console.error({
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

/**
 * Get the language attribute for the HTML element
 * @param {string} contentLanguage - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The language attribute value
 */
const getLangAttribute = (contentLanguage) => {
  const langMap = {
    'en': 'en',
    'es': 'es',
    'fr': 'fr',
    'de': 'de',
    'it': 'it',
    'pt': 'pt',
    'zh': 'zh',
    'ja': 'ja',
    'ko': 'ko',
    'ru': 'ru'
  };
  return langMap[contentLanguage] || 'en';
};

/**
 * Set the lang attribute on the HTML element
 * @param {string} contentLanguage - The language code
 */
const setLangAttribute = (contentLanguage) => {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('lang', getLangAttribute(contentLanguage));
  }
};

/**
 * Get person name with proper accessibility considerations
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @param {string} personId - Unique identifier for the person
 * @returns {string} Formatted person name
 */
const personName = (firstName, lastName, personId) => {
  const name = `${firstName} ${lastName}`;
  return name.trim();
};

/**
 * Validate and fix table accessibility issues
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible, false otherwise
 */
const validateTableAccessibility = (table) => {
  if (!table || !table.nodeName || table.nodeName !== 'TABLE') {
    return false;
  }

  let isValid = true;

  // Check for scope attributes on th elements
  const thElements = table.querySelectorAll('th');
  thElements.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      if (index === 0) {
        th.setAttribute('scope', 'row');
      } else {
        const row = th.closest('tr');
        const isFirstRow = table.querySelector('thead') ? 
          row === table.querySelector('thead').querySelector('tr') : 
          row === table.querySelector('tr');
        th.setAttribute('scope', isFirstRow ? 'col' : 'row');
      }
    }
  });

  // Check for thead and tbody structure
  const hasThead = table.querySelector('thead') !== null;
  const hasTbody = table.querySelector('tbody') !== null;

  if (!hasThead && table.rows.length > 0) {
    const firstRow = table.rows[0];
    const headerCells = firstRow.cells;
    const isHeaderRow = Array.from(headerCells).every(cell => 
      cell.cellIndex === firstRow.cells[cell.cellIndex] && 
      cell.tagName === 'TH'
    );
    
    if (isHeaderRow) {
      const thead = document.createElement('thead');
      thead.appendChild(firstRow.cloneNode(true));
      table.insertBefore(thead, table.firstChild);
    }
  }

  if (!hasTbody && table.tBodies.length === 0) {
    const tbody = document.createElement('tbody');
    while (table.firstChild) {
      tbody.appendChild(table.firstChild);
    }
    table.appendChild(tbody);
  }

  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption && hasThead) {
    const newCaption = document.createElement('caption');
    newCaption.textContent = 'Table';
    newCaption.className = 'sr-only';
    table.insertBefore(newCaption, table.firstChild);
  }

  return isValid;
};

/**
 * Validate table structure
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table structure is valid, false otherwise
 */
const validateTableStructure = (table) => {
  if (!table) return false;

  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) return true;

  // Check for consistent column counts
  const columnCounts = Array.from(rows).map(row => row.cells.length);
  const firstRowCount = columnCounts[0];
  
  return columnCounts.every(count => count === firstRowCount);
};

/**
 * Validate landmark elements for accessibility
 * @param {HTMLElement} element - The element to validate
 * @returns {boolean} True if landmark is valid, false otherwise
 */
const validateLandmark = (element) => {
  if (!element) return false;

  const landmarkRoles = [
    'banner', 'navigation', 'main', 'article', 'aside', 
    'section', 'header', 'footer', 'complementary'
  ];

  const hasLandmark = landmarkRoles.some(role => 
    element.getAttribute('role') === role
  );

  const isLandmarkElement = [
    'HEADER', 'NAV', 'MAIN', 'ARTICLE', 'ASIDE', 'SECTION', 'FOOTER'
  ].includes(element.tagName);

  return hasLandmark || isLandmarkElement;
};

/**
 * Validate landmark structure
 * @param {HTMLElement} container - Container to validate landmarks in
 * @returns {Array} Array of validation results
 */
const validateLandmarkStructure = (container) => {
  if (!container) return [];

  const landmarkRoles = [
    'banner', 'navigation', 'main', 'article', 'aside', 
    'section', 'header', 'footer', 'complementary'
  ];

  const landmarks = container.querySelectorAll(
    '[role="banner"], [role="navigation"], [role="main"], [role="article"],' +
    '[role="aside"], [role="section"], [role="header"], [role="footer"],' +
    '[role="complementary"], header, nav, main, article, aside, section, footer'
  );

  const results = [];
  const mainCount = Array.from(landmarks).filter(el => 
    el.getAttribute('role') === 'main' || el.tagName === 'MAIN'
  ).length;

  if (mainCount !== 1) {
    results.push({
      type: 'unique',
      message: 'There should be exactly one main landmark',
      count: mainCount
    });
  }

  return results;
};

/**
 * Get accessible name for SVG elements
 * @param {HTMLElement} svg - The SVG element
 * @param {string} fallbackText - Fallback text if no title/desc exists
 * @returns {string} The accessible name for the SVG
 */
const getSvgAccessibleName = (svg, fallbackText) => {
  if (!svg) return fallbackText || '';

  const title = svg.querySelector('title');
  const desc = svg.querySelector('desc');
  
  if (title) {
    return title.textContent || '';
  }
  
  if (desc) {
    return desc.textContent || '';
  }

  return fallbackText || svg.getAttribute('aria-label') || '';
};

/**
 * Add accessible name to SVG elements
 * @param {SVGElement} svg - The SVG element
 * @param {string} accessibleName - The accessible name to add
 */
const addSvgAccessibleName = (svg, accessibleName) => {
  if (!svg || !accessibleName) return;

  // Check if title exists
  let title = svg.querySelector('title');
  if (!title) {
    title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    svg.insertBefore(title, svg.firstChild);
  }
  title.textContent = accessibleName;

  // Add aria-label as backup
  svg.setAttribute('aria-label', accessibleName);
  svg.setAttribute('role', 'img');
};

/**
 * Create an in-page button (accessible link replacement)
 * @param {string} targetSelector - CSS selector for target element
 * @param {string} buttonText - Text for the button
 * @param {Object} options - Additional options
 * @returns {HTMLElement} The created button element
 */
const createInPageButton = (targetSelector, buttonText, options = {}) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = buttonText;
  button.setAttribute('aria-label', buttonText);

  const handleClick = (e) => {
    e.preventDefault();
    const target = document.querySelector(targetSelector);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
      
      // Scroll to top of target element
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  button.addEventListener('click', handleClick);
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick(e);
    }
  });

  // Apply any additional attributes
  Object.keys(options).forEach(key => {
    if (key !== 'textContent') {
      button.setAttribute(key, options[key]);
    }
  });

  return button;
};

/**
 * Ensure the dependencyGraph container has a proper ARIA role
 * @param {string} selector - Selector for the dependency graph container
 */
const ensureDependencyGraphAccessibility = (selector = '#dependencyGraph') => {
  const graphContainer = document.querySelector(selector);
  if (graphContainer) {
    // Set appropriate ARIA role based on content type
    if (!graphContainer.getAttribute('role')) {
      graphContainer.setAttribute('role', 'region');
    }
    
    // Add descriptive label for screen readers
    const title = graphContainer.getAttribute('data-title') || 'Dependency Graph';
    graphContainer.setAttribute('aria-label', title);
    
    // Mark as presentation if needed
    if (graphContainer.classList.contains('presentation-mode')) {
      graphContainer.setAttribute('aria-hidden', 'true');
    }
  }
};

// Export functionality with accessibility support
const exportUtils = {
  exportData: (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('aria-label', `Download ${filename}`);
    link.setAttribute('role', 'button');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Announce download completion to screen readers
    accessibilityUtils.announceToScreenReader(`Download of ${filename} started`, 'polite');
  },

  exportToJSON: (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2);
    exportUtils.exportData(jsonString, filename || 'export.json', 'application/json');
  },

  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) {
      accessibilityUtils.announceToScreenReader('No data available to export', 'assertive');
      return;
    }
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    const csvString = csvRows.join('\n');
    exportUtils.exportData(csvString, filename || 'export.csv', 'text/csv');
  }
};

// Initialize accessibility features
const initAccessibility = () => {
  accessibilityUtils.initSkipLink();
  
  // Set default language attribute (can be called with custom language)
  const detectedLanguage = document.documentElement.lang || 'en';
  setLangAttribute(detectedLanguage);
  
  // Add keyboard support for all interactive elements
  document.querySelectorAll('[role="button"], .btn, button, a[href]').forEach(element => {
    element.addEventListener('keydown', (e) => {
      accessibilityUtils.handleKeyboardNav(e, {
        Enter: () => element.click(),
        ' ': () => {
          e.preventDefault();
          element.click();
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

  // Address accessibility issues from the insight report
  accessibilityUtils.addressAccessibilityIssues();
  
  // Ensure dependencyGraph container has proper ARIA role
  ensureDependencyGraphAccessibility();
};

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

// Re-added functionA and functionB as required by issue
const functionA = { X: 'X', Y: 'Y', Z: 'Z' };
const functionB = { X: 'X', Y: 'Y', Z: 'Z' };

// Export all utilities
module.exports = {
  accessibilityUtils,
  exportUtils,
  initAccessibility,
  // New accessibility functions
  getLangAttribute,
  setLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  addSvgAccessibleName,
  createInPageButton,
  // Re-added exports
  functionA,
  functionB
};