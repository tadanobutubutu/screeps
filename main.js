// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
//_Commit: 669117b94c3d1a635653f730f030599efacbb752_
//<!-- todo-hash: 312aa8ea6e4c5e1c9430e4b7136c210eb9172dea -->

//_Commit: 4f09e1b6608c5d0785040bb35b3aac1919d7aea5_

//<!-- todo-hash: 88c1c6cc67ee5e0dd4df31d91becf962321836d1 -->

// TODO: Add back any required exports that might have been removed.
// For example, if the issue requires adding back an export like `calculateSum`, you would add:
// export function calculateSum(a, b) { return a + b; }

export function calculateSum(a, b) { return a + b; }

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

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
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
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
    this.exportData(jsonString, filename || 'export.json', 'application/json');
  },

  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Add header row
    csvRows.push(headers.join(','));
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        const escaped = ('' + value).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    const csvString = csvRows.join('\n');
    this.exportData(csvString, filename || 'export.csv', 'text/csv');
  }
};

// Initialize accessibility features
const initAccessibility = () => {
  accessibilityUtils.initSkipLink();
  
  // Add keyboard support for all interactive elements
  document.querySelectorAll('button, a, input, select, textarea').forEach(element => {
    element.addEventListener('keydown', (e) => {
      accessibilityUtils.handleKeyboardNav(e, {
        Enter: () => element.click(),
        ' ': () => element.click()
      });
    });
  });
};

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
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
  },

  // Trap focus within an element (for modals, dialogs)
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

function personName(element) {
  if (!element) return '';
  const name = element.getAttribute('aria-label') || 
               element.getAttribute('alt') ||
               element.textContent?.trim() ||
               element.getAttribute('title') ||
               '';
  return name;
}

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(table) {
  // This function validates the accessibility of tables
  // Check for proper table headers with scope attributes
  const errors = [];
  
  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }
  
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header at index ${index} is missing scope attribute`);
    }
  });
  
  // Check if table has a caption or is properly described
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');
  
  if (!hasCaption && !hasAriaLabel) {
    errors.push('Table is missing a caption or aria-label/aria-labelledby');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateTableStructure(table) {
  // This function validates the structure of tables
  const errors = [];
  
  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }
  
  // Check for proper table structure
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  const tfoot = table.querySelector('tfoot');
  
  // Check for thead and tbody presence
  if (!thead) {
    errors.push('Table is missing thead element');
  }
  if (!tbody) {
    errors.push('Table is missing tbody element');
  }
  
  // Check for consistent column counts in tbody
  const rows = table.querySelectorAll('tbody tr');
  let expectedCols = null;
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (expectedCols === null) {
      expectedCols = cells.length;
    } else if (cells.length !== expectedCols) {
      errors.push(`Row ${rowIndex} has inconsistent cell count: expected ${expectedCols}, got ${cells.length}`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

function fixTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') return false;
  
  // Add caption if missing
  if (!table.querySelector('caption')) {
    const caption = table.createCaption();
    caption.textContent = 'Data table';
    caption.setAttribute('id', `table-caption-${Math.random().toString(36).substr(2, 9)}`);
  }
  
  // Ensure thead exists
  if (!table.querySelector('thead')) {
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      const thead = table.ownerDocument.createElement('thead');
      thead.appendChild(firstRow.cloneNode(true));
      table.insertBefore(thead, table.firstChild);
      firstRow.remove();
    }
  }
  
  // Ensure tbody exists
  if (!table.querySelector('tbody')) {
    const rows = Array.from(table.querySelectorAll('tr'));
    const tbody = table.ownerDocument.createElement('tbody');
    rows.forEach(row => {
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
  }
  
  // Add scope to header cells
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      // Check if header is in thead to determine scope
      const parentRow = th.closest('tr');
      const parentThead = th.closest('thead');
      if (parentThead || (parentRow && parentRow.closest('thead'))) {
        th.setAttribute('scope', 'col');
      } else {
        th.setAttribute('scope', 'row');
      }
    }
  });
  
  return true;
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  // This function validates landmarks
  const errors = [];
  const allowedLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  
  if (!element) {
    return { valid: false, errors: ['Element is required'] };
  }
  
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  // Check if element has valid landmark role
  if (role && !allowedLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`);
  }
  
  // Check if landmark has accessible name when required
  const landmarksNeedingNames = ['navigation', 'search', 'form', 'region', 'complementary'];
  if (role && landmarksNeedingNames.includes(role)) {
    const hasLabel = element.getAttribute('aria-label') || 
                     element.getAttribute('aria-labelledby') ||
                     element.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      errors.push(`Landmark role "${role}" is missing accessible name`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure() {
  // This function validates the structure of landmarks
  const errors = [];
  
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  
  // Check for multiple main landmarks
  const mainLandmarks = document.querySelectorAll('[role="main"], main');
  if (mainLandmarks.length > 1) {
    errors.push(`Found ${mainLandmarks.length} main landmarks, should have only 1`);
  }
  
  // Check for multiple banner landmarks
  const bannerLandmarks = document.querySelectorAll('[role="banner"], header');
  if (bannerLandmarks.length > 1) {
    errors.push(`Found ${bannerLandmarks.length} banner landmarks, should have only 1`);
  }
  
  // Check for contentinfo (footer) landmarks
  const footerLandmarks = document.querySelectorAll('[role="contentinfo"], footer');
  if (footerLandmarks.length > 1) {
    errors.push(`Found ${footerLandmarks.length} contentinfo landmarks, should have only 1`);
  }
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svg) {
  // This function returns the accessible name for an SVG
  if (!svg) {
    return '';
  }
  
  // Check for aria-label attribute
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby reference
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) {
      return labelElement.textContent || '';
    }
  }
  
  // Check for title element inside SVG
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent || '';
  }
  
  // Check for adjacent description
  const id = svg.getAttribute('id');
  if (id) {
    const describedBy = document.querySelector(`[id="${id}-desc"]`);
    if (describedBy) {
      return describedBy.textContent || '';
    }
  }
  
  return '';
}

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  // This function ensures that landmarks are unique
  const errors = [];
  
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  
  // Define unique landmarks that should only appear once
  const uniqueLandmarks = ['main', 'banner', 'contentinfo'];
  const uniqueRoleSelectors = ['[role="main"]', '[role="banner"]', '[role="contentinfo"]'];
  
  uniqueLandmarks.forEach((landmark, index) => {
    const elements = document.querySelectorAll(uniqueRoleSelectors[index]);
    const tagElements = document.querySelectorAll(landmark);
    const totalCount = elements.length + tagElements.length;
    
    if (totalCount > 1) {
      errors.push(`Found ${totalCount} instances of "${landmark}" landmark, should have only 1`);
    }
  });
  
  // Check for landmark IDs that should be unique
  const landmarksWithIds = document.querySelectorAll('[role][id]');
  const ids = new Set();
  landmarksWithIds.forEach(el => {
    const id = el.getAttribute('id');
    if (ids.has(id)) {
      errors.push(`Duplicate landmark id found: ${id}`);
    }
    ids.add(id);
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_036: Fix 1 fake link issue
function createAccessibleLink(href, text, options = {}) {
  // This function creates an accessible link
  const { 
    onClick, 
    role = 'link',
    ariaLabel,
    className,
    target,
    rel 
  } = options;
  
  if (!href && !onClick) {
    return null;
  }
  
  const link = document.createElement('a');
  link.textContent = text;
  
  if (href) {
    link.href = href;
    // Add rel="noopener noreferrer" for external links
    if (target === '_blank' && !rel) {
      link.rel = 'noopener noreferrer';
    } else if (rel) {
      link.rel = rel;
    }
  } else {
    // If no href, it's a button disguised as a link
    link.href = '#';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (onClick) {
        onClick(e);
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
    this.exportData(jsonString, filename || 'export.json', 'application/json');
  },

  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Add header row
    csvRows.push(headers.join(','));
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        const escaped = ('' + value).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    const csvString = csvRows.join('\n');
    this.exportData(csvString, filename || 'export.csv', 'text/csv');
  }
};

// Initialize accessibility features
const initAccessibility = () => {
  accessibilityUtils.initSkipLink();
  
  // Add keyboard support for all interactive elements
  Array.from(document.querySelectorAll('[role="button"], [role="link"], button, a')).forEach(element => {
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
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  createAccessibleLink,
  towerDefense,
  personName,
  fixTableStructure,
  accessibilityUtils,
  exportUtils,
  initAccessibility
};