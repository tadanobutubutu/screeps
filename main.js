const fs = require('fs');

// Accessibility utilities and functions
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
  },

  // New focus trap function for keyboard navigation
  newFocusTrap: () => {
    const focusableSelector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableElements = document.querySelectorAll(focusableSelector);

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
  },

  // New function for addressing accessibility issues from insight report
  addressAccessibilityIssues: (issues, options = {}) => {
    const {
      autoFix = false,
      reportOnly = false,
      priority = 'moderate'
    } = options;

    if (!issues || !Array.isArray(issues)) {
      throw new Error('Invalid issues array provided');
    }

    const results = {
      fixed: [],
      skipped: [],
      errors: [],
      report: []
    };

    issues.forEach((issue, index) => {
      try {
        if (typeof issue !== 'object' || !issue.message) {
          throw new Error(`Invalid issue format at index ${index}`);
        }

        const { message, element, severity = 'moderate', fix } = issue;

        // Add to report
        results.report.push({
          index,
          message,
          severity,
          status: 'pending'
        });

        // Skip if not auto-fixing and not reporting only
        if (!autoFix && !reportOnly) {
          results.skipped.push({
            index,
            message,
            reason: 'Auto-fix disabled'
          });
          return;
        }

        // Attempt to fix if possible
        if (autoFix && fix && typeof fix === 'function') {
          try {
            const fixResult = fix(element);
            results.fixed.push({
              index,
              message,
              result: fixResult
            });
            results.report[index].status = 'fixed';
          } catch (fixError) {
            results.errors.push({
              index,
              message,
              error: fixError.message
            });
            results.report[index].status = 'error';
          }
        } else if (reportOnly) {
          results.report[index].status = 'reported';
        }
      } catch (error) {
        results.errors.push({
          index,
          message: `Error processing issue at index ${index}: ${error.message}`,
          error: error.message
        });
      }
    });

    // Generate summary
    results.summary = {
      totalIssues: issues.length,
      fixed: results.fixed.length,
      skipped: results.skipped.length,
      errors: results.errors.length,
      timestamp: new Date().toISOString()
    };

    // Announce results to screen readers if priority is high
    if (priority === 'critical' || priority === 'serious') {
      const announcement = `Accessibility issues report: ${results.summary.fixed} fixed, ${results.summary.errors} errors`;
      accessibilityUtils.announceToScreenReader(announcement, 'assertive');
    }

    return results;
  }
};

// Functions to ensure the element has an id, add aria-label, render dependency graphs
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
  return {
    nodes: data.nodes || [],
    edges: data.edges || []
  };
};

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
  console.log(timestamp + " [" + level.toUpperCase() + "]: " + message);
}

// Export functionality with accessibility support
const exportUtils = {
  exportData: (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('aria-label', "Download " + filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    accessibilityUtils.announceToScreenReader("Download of " + filename + " started");
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
        return "\"" + escaped + "\"";
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    exportUtils.exportData(csvString, filename || 'export.csv', 'text/csv');
  }
};

function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9_.-]/gi, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log("Error reading file " + filePath + ": " + error.message, 'error');
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

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

// _Commit: b8888a21083c89f599fb68eef1dc4d5df1051e52_
// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

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
    const originalKeys = Object.keys(inputData);
    const keys = preserveKeys ? originalKeys : originalKeys.map(() => Math.random().toString(36).substring(2, 11));

    let i = 0;
    for (const key of originalKeys) {
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

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

// New function: validateTableAccessibility
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

// Ensure the element has an id. If the element doesn't have an id,
// generates one and assigns it to the element.
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const id = `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
  element.id = id;
  return id;
}

// Export the newFocusTrap function as a standalone utility
const newFocusTrap = accessibilityUtils.newFocusTrap;

// Generate a report based on accessibility issues
function generateAccessibilityReport(issues, options = {}) {
  const {
    format = 'json',
    groupBySeverity = true,
    includeSummary = true
  } = options;

  // Handle empty issues array
  if (!issues || !Array.isArray(issues) || issues.length === 0) {
    return {
      summary: {
        totalIssues: 0,
        timestamp: new Date().toISOString()
      },
      issues: [],
      message: format === 'json' ?
        JSON.stringify({ summary: { totalIssues: 0, timestamp: new Date().toISOString() }, issues: [], message: 'No accessibility issues found' }) :
        'No accessibility issues found'
    };
  }

  let processedIssues = [...issues];
  let groups = {};
  let summary = {
    totalIssues: issues.length,
    timestamp: new Date().toISOString()
  };

  // Group issues by severity if requested
  if (groupBySeverity) {
    groups = processedIssues.reduce((acc, issue) => {
      // Determine severity - default to 'unknown' if not specified
      let severity = 'unknown';

      if (typeof issue === 'string') {
        // Try to infer severity from issue text
        const lowerIssue = issue.toLowerCase();
        if (lowerIssue.includes('critical') || lowerIssue.includes('error')) {
          severity = 'critical';
        } else if (lowerIssue.includes('warning') || lowerIssue.includes('serious')) {
          severity = 'serious';
        } else {
          severity = 'moderate';
        }
      } else if (issue.severity) {
        severity = issue.severity;
      } else if (issue.level) {
        severity = issue.level;
      }

      if (!acc[severity]) {
        acc[severity] = [];
      }
      acc[severity].push(issue);
      return acc;
    }, {});

    // Add group counts to summary
    if (includeSummary) {
      summary.groups = Object.keys(groups).reduce((acc, key) => {
        acc[key] = groups[key].length;
        return acc;
      }, {});
    }
  }

  // Create report based on format
  const report = {
    summary: includeSummary ? summary : undefined,
    groups: groupBySeverity ? groups : undefined,
    issues: processedIssues
  };

  // Remove undefined properties
  Object.keys(report).forEach(key => {
    if (report[key] === undefined) {
      delete report[key];
    }
  });

  // Return formatted output
  if (format === 'json') {
    return JSON.stringify(report, null, 2);
  }

  if (format === 'text') {
    let textReport = '';
    if (includeSummary) {
      textReport += `Accessibility Issues Report\n`;
      textReport += `========================\n`;
      textReport += `Total Issues: ${summary.totalIssues}\n`;
      textReport += `Generated: ${summary.timestamp}\n\n`;

      if (groupBySeverity && summary.groups) {
        textReport += `By Severity:\n`;
        Object.entries(summary.groups).forEach(([severity, count]) => {
          textReport += `  ${severity}: ${count}\n`;
        });
        textReport += `\n`;
      }
    }

    textReport += `Issues:\n`;
    if (groupBySeverity) {
      Object.entries(groups).forEach(([severity, severityIssues]) => {
        textReport += `\n${severity.toUpperCase()} (${severityIssues.length}):\n`;
        severityIssues.forEach((issue, index) => {
          textReport += `  ${index + 1}. ${typeof issue === 'string' ? issue : (issue.message || JSON.stringify(issue))}\n`;
        });
      });
    } else {
      processedIssues.forEach((issue, index) => {
        textReport += `${index + 1}. ${typeof issue === 'string' ? issue : (issue.message || JSON.stringify(issue))}\n`;
      });
    }

    return textReport;
  }

  return report;
}

// New function to get language attribute for HTML element
function getLangAttribute() {
  // Try to get language from browser or document
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language;
  }

  if (typeof document !== 'undefined' && document.documentElement.lang) {
    return document.documentElement.lang;
  }

  // Default to English if not detected
  return 'en';
}

// New function to handle person name formatting
function personName(firstName, lastName, options = {}) {
  const {
    format = 'full',
    title = '',
    suffix = '',
    separator = ' '
  } = options;

  let nameParts = [];

  if (title) nameParts.push(title);
  if (firstName) nameParts.push(firstName);
  if (lastName) nameParts.push(lastName);
  if (suffix) nameParts.push(suffix);

  let fullName = nameParts.join(separator);

  switch (format) {
    case 'full':
      return fullName;
    case 'initials':
      return `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`.toUpperCase();
    case 'lastFirst':
      return `${lastName}${lastName && firstName ? ', ' : ''}${firstName}`;
    default:
      return fullName;
  }
}

// New function to validate table structure
function validateTableStructure(tableElement) {
  const issues = [];

  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    issues.push('Element is not a TABLE element');
    return issues;
  }

  // Check for proper table structure
  const thead = tableElement.querySelector('thead');
  const tbody = tableElement.querySelector('tbody');
  const tfoot = tableElement.querySelector('tfoot');

  if (!thead) {
    issues.push('TABLE is missing required THEAD section');
  }

  if (!tbody) {
    issues.push('TABLE is missing required TBODY section');
  }

  // Check for proper header cells in THEAD
  if (thead) {
    const headerRows = thead.querySelectorAll('tr');
    if (headerRows.length === 0) {
      issues.push('THEAD section has no rows');
    } else {
      const headerCells = headerRows[0].querySelectorAll('th');
      if (headerCells.length === 0) {
        issues.push('First row of THEAD has no header cells (TH)');
      }
    }
  }

  // Check for proper data cells in TBODY
  if (tbody) {
    const dataRows = tbody.querySelectorAll('tr');
    if (dataRows.length === 0) {
      issues.push('TBODY section has no rows');
    } else {
      const dataCells = dataRows[0].querySelectorAll('td');
      if (dataCells.length === 0) {
        issues.push('First row of TBODY has no data cells (TD)');
      }
    }
  }

  return issues;
}

// New function to get accessible name for SVG
function getSvgAccessibleName(svgElement, defaultName = 'graphic') {
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
    return defaultName;
  }

  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Check for aria-labelledby
  const labelledById = svgElement.getAttribute('aria-labelledby');
  if (labelledById) {
    const labelledByElement = document.getElementById(labelledById);
    if (labelledByElement && labelledByElement.textContent) {
      return labelledByElement.textContent.trim();
    }
  }

  // Check for title element
  const titleElement = svgElement.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent.trim();
  }

  // Check for desc element
  const descElement = svgElement.querySelector('desc');
  if (descElement && descElement.textContent) {
    return descElement.textContent.trim();
  }

  // Fallback to default name
  return defaultName;
}

// New function to create accessible link
function createAccessibleLink(href, text, options = {}) {
  const {
    ariaLabel = text,
    target = '_self',
    rel = target === '_blank' ? 'noopener noreferrer' : undefined,
    className = '',
    id = ''
  } = options;

  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  link.setAttribute('aria-label', ariaLabel);

  if (target) link.target = target;
  if (rel) link.rel = rel;
  if (className) link.className = className;
  if (id) link.id = id;

  return link;
}

// New function to handle accessibility errors
function handleAccessibilityErrors(error) {
  if (!error) return;

  const errorMessage = typeof error === 'string' ? error : error.message || 'An accessibility error occurred';

  // Log the error
  log(`Accessibility Error: ${errorMessage}`, 'error');

  // Announce to screen reader
  accessibilityUtils.announceToScreenReader(`Accessibility error: ${errorMessage}`, 'assertive');

  // Return a user-friendly message
  return {
    success: false,
    message: 'An accessibility issue was encountered. Please try again or contact support.',
    details: errorMessage
  };
}

// New function to handle accessibility issues
function handleAccessibilityIssues(issues) {
  if (!issues || issues.length === 0) {
    return {
      success: true,
      message: 'No accessibility issues found'
    };
  }

  // Generate report
  const report = generateAccessibilityReport(issues, {
    format: 'text',
    groupBySeverity: true,
    includeSummary: true
  });

  // Log the issues
  log(`Accessibility Issues Report:\n${report}`, 'warn');

  // Announce summary to screen reader
  const summary = issues.length === 1 ?
    '1 accessibility issue was found' :
    `${issues.length} accessibility issues were found`;

  accessibilityUtils.announceToScreenReader(summary, 'polite');

  // Return the report
  return {
    success: false,
    message: 'Accessibility issues were found',
    report: report
  };
}

// New function to create in-page button
function createInPageButton(text, onClick, options = {}) {
  const {
    ariaLabel = text,
    className = '',
    id = '',
    disabled = false,
    type = 'button'
  } = options;

  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('aria-label', ariaLabel);
  button.type = type;

  if (className) button.className = className;
  if (id) button.id = id;
  if (disabled) button.disabled = true;

  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);

    // Add keyboard support
    button.addEventListener('keydown', (e) => {
      accessibilityUtils.handleKeyboardNav(e, {
        Enter: () => button.click(),
        ' ': () => button.click()
      });
    });
  }

  return button;
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
  newFocusTrap,
  log,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  initAccessibility,
  groupByCategory,
  transformInputData,
  validateTableAccessibility,
  ensureElementHasId,
  generateAccessibilityReport,
  getLangAttribute,
  personName,
  validateTableStructure,
  getSvgAccessibleName,
  createAccessibleLink,
  handleAccessibilityErrors,
  handleAccessibilityIssues,
  createInPageButton
};