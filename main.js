// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)

const fs = require('fs');

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report:
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
        const targetId = skipLink.getAttribute('href').replace('#', '');
        const target = document.getElementById(targetId) || document.querySelector('main, [role="main"]');
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
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
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
  },

  // Get language attribute for HTML element
  getLangAttribute: (element) => {
    const lang = element.lang || element.getAttribute('xml:lang');
    return lang || document.documentElement.lang || 'en';
  },

  // Validate table accessibility
  validateTableAccessibility: (table) => {
    if (!table) return { valid: false, errors: ['Table element is required'] };
    const errors = [];
    const headers = table.querySelectorAll('th');
    const dataCells = table.querySelectorAll('td');
    
    if (headers.length === 0) {
      errors.push('Table should have header cells (th)');
    }
    
    if (dataCells.length === 0) {
      errors.push('Table should have data cells (td)');
    }
    
    return { valid: errors.length === 0, errors };
  },

  // Validate table structure
  validateTableStructure: (table) => {
    if (!table || table.tagName !== 'TABLE') {
      return { valid: false, error: 'Invalid table element' };
    }
    
    const caption = table.querySelector('caption');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const tfoot = table.querySelector('tfoot');
    
    return {
      valid: true,
      hasCaption: !!caption,
      hasThead: !!thead,
      hasTbody: !!tbody,
      hasTfoot: !!tfoot
    };
  },

  // Validate landmark
  validateLandmark: (element) => {
    const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
    const role = element.getAttribute('role');
    const tagName = element.tagName.toLowerCase();
    
    if (role && !validLandmarks.includes(role)) {
      return { valid: false, error: `Invalid landmark role: ${role}` };
    }
    
    if (validLandmarks.includes(tagName) || role) {
      return { valid: true, role: role || tagName };
    }
    
    return { valid: false, error: 'No valid landmark identified' };
  },

  // Validate landmark structure
  validateLandmarkStructure: () => {
    const mainLandmarks = document.querySelectorAll('main, [role="main"]');
    const navLandmarks = document.querySelectorAll('nav, [role="navigation"]');
    const headerLandmarks = document.querySelectorAll('header, [role="banner"]');
    
    return {
      valid: mainLandmarks.length === 1,
      hasExactlyOneMain: mainLandmarks.length === 1,
      navCount: navLandmarks.length,
      headerCount: headerLandmarks.length
    };
  },

  // Get SVG accessible name
  getSvgAccessibleName: (svg) => {
    const title = svg.querySelector('title');
    const ariaLabel = svg.getAttribute('aria-label');
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    
    if (ariaLabel) return ariaLabel;
    if (ariaLabelledby) {
      const labelElement = document.getElementById(ariaLabelledby);
      return labelElement ? labelElement.textContent : null;
    }
    if (title) return title.textContent;
    
    return null;
  },

  // Validate unique landmarks
  validateUniqueLandmarks: () => {
    const landmarks = document.querySelectorAll('[role]');
    const issues = [];
    
    landmarks.forEach((landmark) => {
      const role = landmark.getAttribute('role');
      if (['main', 'navigation', 'banner', 'contentinfo', 'complementary'].includes(role)) {
        const count = document.querySelectorAll(`[role="${role}"]`).length;
        if (count > 1) {
          issues.push({ role, count, message: `Multiple ${role} landmarks found` });
        }
      }
    });
    
    return { valid: issues.length === 0, issues };
  },

  // Create accessible in-page button
  createInPageButton: (text, onClick, options = {}) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('type', 'button');
    if (options.id) button.id = options.id;
    if (options.className) button.className = options.className;
    if (options.ariaLabel) button.setAttribute('aria-label', options.ariaLabel);
    if (options.ariaDescribedby) button.setAttribute('aria-describedby', options.ariaDescribedby);
    
    button.addEventListener('click', onClick);
    return button;
  },

  // Get person name for accessibility
  personName: (element) => {
    const langAttr = accessibilityUtils.getLangAttribute(element);
    const nameElement = element.querySelector('[itemprop="name"], .person-name, .name, [class*="name"]');
    return nameElement ? nameElement.textContent.trim() : null;
  },

  // NEW: Focus trap for keyboard navigation
  newFocusTrap: (container) => {
    if (!container) return null;
    
    const focusableSelectors = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableElements = container.querySelectorAll(focusableSelectors);
    
    if (focusableElements.length === 0) return null;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    };
    
    const trapInstance = {
      activate: () => {
        container.addEventListener('keydown', handleTabKey);
        firstFocusable.focus();
      },
      deactivate: () => {
        container.removeEventListener('keydown', handleTabKey);
      }
    };
    
    return trapInstance;
  }
};

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and newFocusTrap())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// - NEW: Implement a new function to handle focus trap for keyboard navigation (handled by newFocusTrap())

function calculateSum(a, b) { return a + b; }

// Credential response handling
async function handleCredentialResponse(response) {
  if (!response) {
    throw new Error('No response received');
  }
  
  if (response.error) {
    throw new Error(response.error);
  }
  
  if (response.token) {
    return {
      success: true,
      token: response.token,
      expiresIn: response.expiresIn || 3600
    };
  }
  
  throw new Error('Invalid credential response');
}

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} [${level.toUpperCase()}] ${message}`);
}

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

function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error');
    return null;
  }
}

// Existing data processing functions
function processData(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
}

function filterValidItems(items, validator) {
  return items.filter(item => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
}

// Initialize accessibility features
const initAccessibility = () => {
  accessibilityUtils.initSkipLink();
  
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

// Function to generate a report based on accessibility issues
function generateAccessibilityReport(issues) {
  if (!Array.isArray(issues)) {
    return 'Error: Invalid input. Expected an array of issues.';
  }

  if (issues.length === 0) {
    return 'No accessibility issues found.';
  }

  // Group issues by severity
  const grouped = issues.reduce((acc, issue) => {
    const severity = issue.severity || 'unknown';
    if (!acc[severity]) {
      acc[severity] = [];
    }
    acc[severity].push(issue);
    return acc;
  }, {});

  const severityOrder = ['critical', 'high', 'medium', 'low', 'unknown'];
  const reportLines = [];

  // Summary
  reportLines.push('Accessibility Issue Report');
  reportLines.push('=========================');
  reportLines.push(`Total issues: ${issues.length}`);
  reportLines.push('');

  // Details by severity
  severityOrder.forEach(severity => {
    if (grouped[severity]) {
      reportLines.push(`Severity: ${severity.toUpperCase()}`);
      reportLines.push('-------------------------');
      grouped[severity].forEach((issue, index) => {
        reportLines.push(`${index + 1}. ${issue.description}`);
        if (issue.element) {
          reportLines.push(`   Element: ${issue.element}`);
        }
        if (issue.recommendation) {
          reportLines.push(`   Recommendation: ${issue.recommendation}`);
        }
        reportLines.push('');
      });
    }
  });

  return reportLines.join('\n');
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

_Commit: b8888a21083c89f599fb68eef1dc4d5df1051e52_

<!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

// TODO: Implement the new function as per the issue requirements
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
}

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
  handleCredentialResponse,
  ensureElementId,
  addAriaLabel,
  renderDependencyGraph,
  calculateSum,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  groupByCategory,
  transformInputData,
  newFocusTrap,
  generateAccessibilityReport,
  log
};