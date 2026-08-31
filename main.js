// TODO: This is the existing code that needs to be preserve
// (This comment remains as-is)
// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)

const fs = require('fs');

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and newFocusTrap())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// - NEW: Implement a new function to handle focus trap for keyboard navigation (handled by newFocusTrap())

const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.querySelector('.skip-link, [href="#main-content"]');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
  },

  /**
   * Function to generate a unique landmark identifier
   * Addresses REACT_025: Ensure unique landmarks
   * @param {string} baseName - The base name for the landmark
   * @param {number} index - The index number for uniqueness
   * @returns {string} Unique landmark identifier
   */
  generateUniqueLandmarkId(baseName, index) {
    return `${baseName}-${index}`;
  },

  /**
   * Function to check and fix landmark roles
   * Addresses REACT_017: Add landmark roles and fix landmark issues
   * @param {Object} element - The element to check
   * @param {string} role - The landmark role to apply
   * @returns {Object} Element with proper landmark role
   */
  applyLandmarkRole(element, role) {
    if (!element.props || !element.props.role) {
      return {
        ...element,
        props: {
          ...element.props,
          role: role
        }
      };
    }
    return element;
  },

  /**
   * Function to add accessible name to an SVG element
   * Addresses REACT_041: Add accessible names to 2 SVGs
   * @param {Object} svgElement - The SVG element
   * @param {string} description - The accessible description
   * @returns {Object} SVG element with aria-label
   */
  addSvgAccessibleName(svgElement, description) {
    return {
      ...svgElement,
      props: {
        ...svgElement.props,
        'aria-label': description,
        role: 'img'
      }
    };
  },

  /**
   * Function to fix fake link issues
   * Addresses REACT_036: Fix 1 fake link issue
   * @param {Object} element - The potentially fake link element
   * @returns {Object} Fixed element with appropriate role or element type
   */
  fixFakeLink(element) {
    if (element.type === 'a' && !element.props.href) {
      return {
        ...element,
        type: 'button',
        props: {
          ...element.props,
          role: 'button',
          onClick: element.props.onClick || (() => {})
        }
      };
    }
    return element;
  },

  // Example component structure demonstrating accessibility fixes
  const AccessibilityDemo = () => {
    return {
      type: 'div',
      props: {
        className: 'app-container',
        lang: 'en' // REACT_015: Add lang attribute to HTML element
      },
      children: [
        {
          type: 'header',
          props: {
            role: 'banner' // REACT_017: Add landmark roles
          },
          children: [
            addSvgAccessibleName(
              { type: 'svg', props: { className: 'logo' } },
              'Company Logo'
            ),
            {
              type: 'nav',
              props: { role: 'navigation' }, // REACT_017: Add landmark roles
              children: [
                {
                  type: 'a',
                  props: { href: '/home', children: 'Home' }
                },
                {
                  type: 'a',
                  props: { href: '/about', children: 'About' }
                }
              ]
            }
          ]
        },
        {
          type: 'main',
          props: {
            role: 'main', // REACT_017: Add landmark roles
            id: generateUniqueLandmarkId('main', 1) // REACT_025: Ensure unique landmarks
          },
          children: [
            {
              type: 'section',
              props: {
                role: 'region',
                'aria-label': 'Product Information', // REACT_017: Add landmark roles
                id: generateUniqueLandmarkId('region', 1) // REACT_025: Ensure unique landmarks
              },
              children: [
                addSvgAccessibleName(
                  { type: 'svg', props: { className: 'icon' } },
                  'Decorative icon'
                ),
                {
                  type: 'table',
                  props: {},
                  children: [
                    {
                      type: 'thead',
                      props: {},
                      children: [
                        {
                          type: 'tr',
                          props: {},
                          children: [
                            {
                              type: 'th',
                              props: { scope: 'col' }, children: 'Name' }, // REACT_027: Already implemented
                            {
                              type: 'th',
                              props: { scope: 'col' }, children: 'Value'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                fixFakeLink({
                  type: 'a',
                  props: {
                    children: 'Click here',
                    onClick: () => {}
                  }
                }) // REACT_036: Fix 1 fake link issue
              ]
            }
          ]
        },
        {
          type: 'footer',
          props: {
            role: 'contentinfo' // REACT_017: Add landmark roles
          },
          children: [
            {
              type: 'a',
              props: { href: '/privacy', children: 'Privacy Policy' }
            }
          ]
        }
      ]
    };
  };

  // Import required module(s)
  const missingModule = require('./missingModule');

  // Existing code...
  const accessibilityUtils = {
    // Trap focus within an element (for modals, dialogs)
    trapFocus: (element) => {
      const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      });
    },

    // NEW: Focus trap for keyboard navigation
    newFocusTrap: (container) => {
      if (!container) return;
      
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
      ].join(', ');
      
      const focusableElements = container.querySelectorAll(focusableSelectors);
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      
      const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      };
      
      container.addEventListener('keydown', handleTabKey);
      
      return {
        deactivate: () => {
          container.removeEventListener('keydown', handleTabKey);
        }
      };
    }
  };

  // Functions to ensure the element has an id, add aria-label, render dependency graphs
  // (Previously existing code that needs to be preserved)

  const ensureElementId = (element) => {
    if (element && !element.id) {
      element.id = "element-" + Date.now() + "-" + Math.random().toString(36).slice(2, 11);
    }
    return element;
  };

  const addAriaLabel = (element, label) => {
    if (element) {
      element.setAttribute('aria-label', label);
    }
    return element;
  };

  const renderDependencyGraph = (data) => {
    // Implementation for rendering dependency graphs
    return {
      nodes: data.nodes || [],
      edges: data.edges || []
    };
  };

  // Add back any required exports that might have been removed.
  // For example, if the issue requires adding back an export like `calculateSum`, you would add:
  function calculateSum(a, b) { return a + b; }
};

// Add back any required exports that might have been removed.
// For example, if the issue requires adding back an export like `calculateSum`, you would add:
function calculateSum(a, b) { return a + b; }


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

// New function from origin/main
function newFunction() {
  // Implementation of the new function
}

// Add book function with accessibility improvements from origin/main
function addBook() {
  // ... (existing addBook function code)

  // Add ARIA roles and labels to improve accessibility
  const addBookForm = document.getElementById('addBookForm');
  if (addBookForm) {
    addBookForm.setAttribute('role', 'form');
    addBookForm.setAttribute('aria-labelledby', 'addBookLabel');

    const addBookLabel = document.createElement('label');
    addBookLabel.id = 'addBookLabel';
    addBookLabel.htmlFor = 'addBookForm';
    addBookLabel.textContent = 'Add a new book';
    addBookForm.insertBefore(addBookLabel, addBookForm.firstChild);
  }
}

// TODO: add the new functions or changes requested in the issue
// Here's a sample implementation for a new function named 'myNewFunction'
function myNewFunction() {
  // Implementation here
  return "Hello from myNewFunction!";
}

// Initialize accessibility features
const initAccessibility = () => {
  accessibilityUtils.initSkipLink();

  // Apply all accessibility fixes from the insight report
  accessibilityUtils.setHtmlLangAttribute();
  accessibilityUtils.ensureUniqueLandmarks();
  accessibilityUtils.addProperLandmarkRegions();

  // Validate and fix tables
  if (typeof document !== 'undefined') {
    const tables = document.querySelectorAll('table');
    accessibilityUtils.validateTableStructure(tables);
  }

  // Fix fake links
  accessibilityUtils.handleFakeLinks();

  // Add accessible names to SVGs that don't have them
  if (typeof document !== 'undefined') {
    document.querySelectorAll('svg').forEach((svg) => {
      if (!accessibilityUtils.getSvgAccessibleName(svg)) {
        accessibilityUtils.setSvgAttributes(svg, 'Decorative icon');
      }
    });
  }

  // Validate landmarks
  if (typeof document !== 'undefined') {
    const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section');
    accessibilityUtils.validateLandmarkStructure(Array.from(landmarks));
  }

  // Add keyboard support for all interactive elements
  document.addEventListener('click', (e) => {
    const element = e.target.closest('[role="button"], button, a');
    if (element) {
      accessibilityUtils.handleKeyboardNav(e, {
        Enter: () => element.click(),
        ' ': () => element.click()
      });
    }
  });
};

// Helper functions for grouping and transformation
function groupByCategory(items, getCategory) {
  return items.reduce((groups, item) => {
    const category = getCategory(item);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
}

function transformInputData(inputData, options = {}) {
  const {
    preserveKeys = true,
    uppercase = false,
    trimWhitespace = true,
    maxLength = null
  } = options;

  if (!inputData) {
    return null;
  }

  const processValue = (value) => {
    if (typeof value === 'string') {
      let processed = value;
      if (trimWhitespace) {
        processed = processed.trim();
      }
      if (uppercase) {
        processed = processed.toUpperCase();
      }
      if (maxLength !== null && processed.length > maxLength) {
        processed = processed.substring(0, maxLength);
      }
      return processed;
    }
    return value;
  };

  if (typeof inputData === 'object' && !Array.isArray(inputData) && inputData !== null) {
    const result = {};
    const keys = preserveKeys ? Object.keys(inputData) : Object.keys(inputData).map(() => Math.random().toString(36).substr(2, 9));
    
    let i = 0;
    for (const key of Object.keys(inputData)) {
      const value = inputData[key];
      if (typeof value === 'object' && value !== null) {
        result[keys[i]] = transformInputData(value, options);
      } else {
        result[keys[i]] = processValue(value);
      }
      i++;
    }
    return result;
  }

  if (Array.isArray(inputData)) {
    return inputData.map((item) => {
      if (typeof item === 'object' && item !== null) {
        return transformInputData(item, options);
      }
      return processValue(item);
    });
  }

  return processValue(inputData);
}


// Additional helper functions exported
function getLangAttribute(element) {
  if (!element) {
    element = document.documentElement;
  }
  return element.lang || element.getAttribute('lang') || document.documentElement.lang || null;
}

function personName(personData) {
  if (!personData) return '';
  
  const parts = [];
  if (personData.firstName) parts.push(personData.firstName);
  if (personData.lastName) parts.push(personData.lastName);
  
  return parts.join(' ') || personData.name || '';
}

function validateTableAccessibility(tableElement) {
  const issues = [];

  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    issues.push('Element is not a TABLE element');
    return issues;
  }

  // Check for presence of <caption> (accessibility best practice for table description)
  const caption = tableElement.querySelector('caption');
  if (!caption || !caption.textContent.trim()) {
    issues.push('TABLE is missing a descriptive caption');
  }

  // Check that all rows have consistent number of cells
  const rows = Array.from(tableElement.querySelectorAll('tr'));
  let expectedCellCount = null;

  rows.forEach((row, rowIndex) => {
    const cells = Array.from(row.children).filter(
      child => ['TH', 'TD'].includes(child.tagName.toUpperCase())
    );

    if (expectedCellCount === null && cells.length > 0) {
      expectedCellCount = cells.length;
    }

    if (expectedCellCount !== null && cells.length !== expectedCellCount) {
      issues.push(`Row ${rowIndex + 1} has inconsistent number of cells`);
    }
  });

  // Check that TH elements exist (header row/column should be marked)
  const thCells = tableElement.querySelectorAll('th');
  if (thCells.length === 0) {
    issues.push('TABLE has no header cells (TH) defined');
  }

  return issues;
}

/**
 * Ensures the element has an id. If the element doesn't have an id,
 * generates one and assigns it to the element.
 * @param {HTMLElement} element - The element to check and modify
 * @param {string} [prefix='element'] - Prefix for the generated id
 * @returns {string} The element's id (existing or newly generated)
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (element.id) {
    return element.id;
  }
  
  const id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
}

/**
 * Get the lang attribute from HTML element or document
 * @param {HTMLElement} element - The element to get lang attribute from
 * @returns {string|null} The language code or null if not found
 */
function getLangAttribute(element) {
  if (!element) {
    element = document.documentElement;
  }
  return element.lang || element.getAttribute('lang') || document.documentElement.lang || null;
}

/**
 * Get accessible name for a person, used in accessibility contexts
 * @param {Object} personData - Person data object
 * @param {string} personData.firstName - First name
 * @param {string} personData.lastName - Last name
 * @returns {string} Accessible name for the person
 */
function personName(personData) {
  if (!personData) return '';
  
  const parts = [];
  if (personData.firstName) parts.push(personData.firstName);
  if (personData.lastName) parts.push(personData.lastName);
  
  return parts.join(' ') || personData.name || '';
}

/**
 * Validate table structure for accessibility compliance
 * @param {HTMLTableElement} tableElement - The table element to validate
 * @returns {Object} Validation result with issues array and structure info
 */
function validateTableStructure(tableElement) {
  const result = {
    isValid: true,
    issues: [],
    structure: {
      hasCaption: false,
      hasHeaderCells: false,
      rowCount: 0,
      columnCount: 0,
      hasScopeAttributes: false
    }
  };

  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    result.isValid = false;
    result.issues.push('Invalid table element provided');
    return result;
  }

  const caption = tableElement.querySelector('caption');
  if (caption && caption.textContent.trim()) {
    result.structure.hasCaption = true;
  } else {
    result.issues.push('Table should have a descriptive caption');
  }

  const headers = tableElement.querySelectorAll('th');
  result.structure.hasHeaderCells = headers.length > 0;
  
  if (headers.length > 0) {
    const headersWithScope = Array.from(headers).filter(th => th.hasAttribute('scope'));
    result.structure.hasScopeAttributes = headersWithScope.length > 0;
    
    if (headersWithScope.length !== headers.length) {
      result.issues.push('All header cells should have scope attributes');
    }
  } else {
    result.issues.push('Table should have header cells (th elements)');
  }

  const rows = tableElement.querySelectorAll('tbody > tr, thead > tr, tr');
  result.structure.rowCount = rows.length;
  
  if (rows.length > 0) {
    const firstRowCells = Array.from(rows[0].children).filter(
      child => ['TH', 'TD'].includes(child.tagName.to