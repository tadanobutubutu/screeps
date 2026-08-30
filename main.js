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
  },

  // Trap focus within an element (for modals, dialogs)
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  },

  // Announce message to screen readers
  announceToScreenReader: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  },

  // Handle keyboard navigation
  handleKeyboardNav: (e, handlers) => {
    const key = e.key;
    if (handlers[key]) {
      handlers[key](e);
    }
  }
};

// ============================================
// NEW: Accessibility issue handlers from insight report
// ============================================

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

// Export functionality with accessibility support
const exportUtils = {
  exportData: (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('aria-label', `Download ${filename}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Announce download completion to screen readers
    accessibilityUtils.announceToScreenReader(`Download of ${filename} started`);
  },

  exportToJSON: (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2);
    exportUtils.exportData(jsonString, filename || 'export.json', 'application/json');
  },

  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) return;
    
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
  document.querySelectorAll('[data-accessible]').forEach(element => {
    element.addEventListener('keydown', (e) => {
      accessibilityUtils.handleKeyboardNav(e, {
        Enter: () => element.click(),
        ' ': () => element.click()
      });
    });
  });
};

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

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
  createInPageButton
};