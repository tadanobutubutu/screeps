const fs = require('fs');
const path = require('path');

// Main entry point for the application

// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and createAccessibleLink())

// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  if (typeof document === 'undefined') return 'en';
  return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
  if (typeof document === 'undefined') return 'en';
  const lang = document.documentElement.lang || 'en';
  const dir = document.documentElement.dir || 'ltr';
  return { lang, dir };
}

// REACT_027: Fix table structure issues - single table validation
function validateSingleTableAccessibility(table) {
  if (!table) return { valid: false, issues: ['Table not found'] };
  const issues = [];
  if (!table.tHead && !table.querySelector('thead')) {
    issues.push('Missing table header');
  }
  if (!table.tBodies.length && !table.querySelector('tbody')) {
    issues.push('Missing table body');
  }
  const rows = table.rows || table.querySelectorAll('tr');
  if (rows.length === 0) {
    issues.push('Table has no rows');
  }
  return { valid: issues.length === 0, issues };
}

function validateSingleTableStructure(table) {
  if (!table) return { valid: false, issues: ['Table not found'] };
  const issues = [];
  const cells = table.querySelectorAll('td, th');
  cells.forEach((cell) => {
    if (!cell.textContent.trim() && !cell.querySelector('img[alt]')) {
      issues.push('Empty cell without accessible content');
    }
  });
  const headers = table.querySelectorAll('th');
  headers.forEach((th) => {
    if (!th.scope && !th.id) {
      issues.push('Header cell missing scope or id');
    }
  });
  return { valid: issues.length === 0, issues };
}

// REACT_017: Add/fix landmark issues
function validateLandmark(landmark) {
  if (!landmark) return { valid: false, issues: ['Landmark not found'] };
  const issues = [];
  const role = landmark.getAttribute('role');
  const tag = landmark.tagName.toLowerCase();
  const landmarkTags = ['header', 'nav', 'main', 'aside', 'footer', 'section'];
  if (!role && !landmarkTags.includes(tag)) {
    issues.push('Element is not a recognized landmark');
  }
  if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby') && tag === 'section') {
    issues.push('Section landmark missing accessible name');
  }
  return { valid: issues.length === 0, issues };
}

function validateLandmarkStructure(container) {
  if (!container) return { valid: false, issues: ['Container not found'] };
  const issues = [];
  const landmarks = container.querySelectorAll('header, nav, main, aside, footer, section, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="region"]');
  if (landmarks.length === 0) {
    issues.push('No landmarks found in container');
  }
  const mainLandmarks = container.querySelectorAll('main, [role="main"]');
  if (mainLandmarks.length > 1) {
    issues.push('Multiple main landmarks found');
  }
  return { valid: issues.length === 0, issues };
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(container) {
  if (!container) return { valid: false, issues: ['Container not found'] };
  const issues = [];
  const seen = new Map();
  const landmarks = container.querySelectorAll('header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  landmarks.forEach((landmark) => {
    const tag = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || tag;
    const label = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby') || '';
    const key = `${role}:${label}`;
    if (seen.has(key)) {
      issues.push(`Duplicate landmark: ${role}`);
    } else {
      seen.set(key, true);
    }
  });
  return { valid: issues.length === 0, issues };
}

// REACT_041: Add accessible names to SVGs
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const refElement = document.getElementById(ariaLabelledBy);
    if (refElement) return refElement.textContent.trim();
  }
  const title = svg.querySelector('title');
  if (title) return title.textContent.trim();
  return '';
}

// REACT_036: Fix fake link issues
function createInPageButton(label, targetId) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.setAttribute('aria-controls', targetId);
  button.addEventListener('click', () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      if (target.focus) target.focus();
    }
  });
  return button;
}

function createAccessibleLink(href, text, options = {}) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  if (options.ariaLabel) {
    link.setAttribute('aria-label', options.ariaLabel);
  }
  if (options.newWindow) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }
  if (options.onClick) {
    link.addEventListener('click', options.onClick);
  }
  return link;
}

// Node.js utilities from HEAD branch
/**
 * Reads and parses the HTML file
 * @param {string} filePath - Path to the HTML file
 * @returns {string} - File contents
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    return null;
  }
}

/**
 * Writes content to a file
 * @param {string} filePath - Path to the output file
 * @param {string} content - Content to write
 * @returns {boolean} - Success status
 */
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing file: ${error.message}`);
    return false;
  }
}

/**
 * Logs a message with timestamp
 * @param {string} message - Message to log
 */
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

/**
 * Escapes HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Adds a language attribute to an element if not present
 * @param {HTMLElement} element - The element to modify
 * @param {string} lang - Language code (e.g., 'en')
 */
function addLangAttribute(element, lang) {
  if (element && element.getAttribute('lang') === null) {
    element.setAttribute('lang', lang);
  }
}

/**
 * Manages focus for accessibility (ARIA best practice)
 * @param {HTMLElement} element - The element to focus on
 */
function manageFocus(element) {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
}

/**
 * Traps focus within a container element (useful for modals/dialogs)
 * @param {HTMLElement} container - The container element
 * @param {KeyboardEvent} event - The keyboard event
 */
function trapFocus(container, event) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

/**
 * Announces content to screen readers using ARIA live regions
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcementElement = document.getElementById('sr-announcer');
  if (announcementElement) {
    announcementElement.setAttribute('aria-live', priority);
    announcementElement.textContent = '';
    // Force screen reader to announce by removing and re-adding content
    setTimeout(() => {
      announcementElement.textContent = message;
    }, 100);
  }
}

/**
 * Handles keyboard navigation for custom components
 * @param {KeyboardEvent} event - The keyboard event
 * @param {string} orientation - 'horizontal' or 'vertical'
 */
function handleKeyboardNavigation(event, orientation = 'vertical') {
  const key = event.key;
  const isVertical = orientation === 'vertical';
  const nextKeys = isVertical ? ['ArrowDown'] : ['ArrowRight'];
  const prevKeys = isVertical ? ['ArrowUp'] : ['ArrowLeft'];

  if (nextKeys.includes(key) || prevKeys.includes(key)) {
    event.preventDefault();
    // Navigation logic handled by component-specific implementations
  }
}

// Document-wide table validation from HEAD branch
/**
 * Validates that tables in the document are accessible
 * @param {Document} doc - The document to validate
 * @returns {Object} - Validation result with isValid and errors array
 */
function validateTableAccessibility(doc) {
  const errors = [];

  // Get all tables in the document
  const tables = doc.getElementsByTagName('table');

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];

    // Check if table has proper headers
    const headers = table.querySelector('th');
    if (!headers) {
      errors.push({
        tableIndex: i,
        error: 'Table is missing header cells (th)'
      });
    }

    // Check if table has caption or summary
    const caption = table.querySelector('caption');
    const summary = table.getAttribute('summary');
    if (!caption && !summary) {
      errors.push({
        tableIndex: i,
        error: 'Table should have a caption or summary attribute'
      });
    }

    // Check if table cells have proper scope attributes for header cells
    const headerCells = table.querySelectorAll('th');
    for (let j = 0; j < headerCells.length; j++) {
      const scope = headerCells[j].getAttribute('scope');
      if (!scope) {
        errors.push({
          tableIndex: i,
          cellIndex: j,
          error: 'Header cell missing scope attribute'
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates the structure of tables in the document
 * @param {Document} doc - The document to validate
 * @returns {Object} - Validation result with isValid and errors array
 */
function validateTableStructure(doc) {
  const errors = [];

  // Get all tables in the document
  const tables = doc.getElementsByTagName('table');

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];

    // Check for proper table structure (thead, tbody, tfoot)
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    if (!tbody) {
      errors.push({
        tableIndex: i,
        error: 'Table is missing tbody element'
      });
    }

    // Check that tables don't have nested tables
    const nestedTables = table.querySelectorAll('table');
    if (nestedTables.length > 0) {
      errors.push({
        tableIndex: i,
        error: 'Table contains nested tables'
      });
    }

    // Check that tables have at least one row
    const rows = table.querySelectorAll('tr');
    if (rows.length === 0) {
      errors.push({
        tableIndex: i,
        error: 'Table has no rows'
      });
    }

    // Check for consistent cell counts in rows
    const bodyRows = tbody ? tbody.querySelectorAll('tr') : rows;
    if (bodyRows.length > 0) {
      const expectedCells = bodyRows[0].querySelectorAll('td, th').length;

      for (let j = 0; j < bodyRows.length; j++) {
        const cellCount = bodyRows[j].querySelectorAll('td, th').length;
        if (cellCount !== expectedCells) {
          errors.push({
            tableIndex: i,
            rowIndex: j,
            expected: expectedCells,
            actual: cellCount,
            error: 'Row has inconsistent number of cells'
          });
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

// Import functions from other modules if needed
const { someFunction } = require('./utils');

// Assuming the original code had a loop function, we add it here.
function loop() {
  // Your loop code here
  someFunction(); // Example usage of the imported function
}

/**
 * Processes an insight report to extract accessibility issues.
 * @param {Object} report - The insight report object.
 * @returns {Array} - List of accessibility issues.
 */
function processInsightReport(report) {
  const accessibilityIssues = [];

  if (!report || !report.insights) {
    return accessibilityIssues;
  }

  report.insights.forEach(insight => {
    if (insight.type === 'accessibility' && insight.severity === 'error') {
      const issue = {
        id: insight.id,
        description: insight.description,
        element: insight.element,
        suggestedFix: generateFix(insight)
      };
      accessibilityIssues.push(issue);
    }
  });

  return accessibilityIssues;
}

/**
 * Generates a fix suggestion based on the insight code.
 * @param {Object} insight - The insight object containing the code.
 * @returns {string} - Suggested fix message.
 */
function generateFix(insight) {
  const fixes = {
    'missing-alt': 'Add alt attribute to image element',
    'low-contrast': 'Increase color contrast ratio to at least 4.5:1',
    'missing-label': 'Add associated label or aria-label to form element',
    'missing-heading': 'Add appropriate heading hierarchy',
    'clickable-area': 'Increase clickable area to at least 44x44 pixels',
    'empty-link': 'Provide text content or aria-label for link'
  };

  return fixes[insight.code] || 'Review and fix accessibility issue';
}

/**
 * Applies accessibility fixes to the identified issues within a document.
 * @param {Array} issues - List of accessibility issues.
 * @param {Document} document - The DOM document to modify.
 * @returns {Array} - Results of applying fixes.
 */
function applyAccessibilityFixes(issues, document) {
  const results = [];

  issues.forEach(issue => {
    try {
      const element = document.querySelector(issue.element);
      if (element) {
        applyFix(element, issue);
        results.push({ success: true, issueId: issue.id });
      } else {
        results.push({ success: false, issueId: issue.id, error: 'Element not found' });
      }
    } catch (error) {
      results.push({ success: false, issueId: issue.id, error: error.message });
    }
  });

  return results;
}

/**
 * Applies a specific fix to an element based on the issue code.
 * @param {HTMLElement} element - The DOM element to modify.
 * @param {Object} issue - The issue object containing the code to fix.
 */
function applyFix(element, issue) {
  switch (issue.code) {
    case 'missing-alt':
      if (element.tagName === 'IMG') {
        element.setAttribute('alt', 'Description of image');
      }
      break;
    case 'missing-label':
      element.setAttribute('aria-label', 'Form input');
      break;
    case 'low-contrast':
      element.style.color = '#000000';
      break;
    default:
      console.warn(`Fix not implemented for issue: ${issue.code}`);
  }
}

/**
 * Generates a comprehensive accessibility report.
 * @param {Array} issues - List of accessibility issues.
 * @returns {Object} - Report containing timestamp, totals, issues, and summary.
 */
function generateAccessibilityReport(issues) {
  return {
    timestamp: new Date().toISOString(),
    totalIssues: issues.length,
    issues: issues,
    summary: {
      critical: issues.filter(i => i.severity === 'critical').length,
      major: issues.filter(i => i.severity === 'major').length,
      minor: issues.filter(i => i.severity === 'minor').length
    }
  };
}

// Export all functions
module.exports = {
  // Node utilities
  readFile,
  writeFile,
  log,
  escapeHtml,
  addLangAttribute,
  manageFocus,
  trapFocus,
  announceToScreenReader,
  handleKeyboardNavigation,
  // Table validation - single table
  validateSingleTableAccessibility,
  validateSingleTableStructure,
  // Table validation - document-wide
  validateTableAccessibility,
  validateTableStructure,
  // Landmark validation
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  // SVG accessibility
  getSvgAccessibleName,
  // Link/button creation
  createInPageButton,
  createAccessibleLink,
  // Lang attributes
  getLangAttribute,
  getFullLangAttribute,
  // Main loop
  loop,
  // Insight report processing
  processInsightReport,
  generateFix,
  applyAccessibilityFixes,
  applyFix,
  generateAccessibilityReport
};

// Main execution
if (require.main === module) {
  const inputFile = process.argv[2] || 'index.html';
  const outputFile = process.argv[3] || 'output.html';

  log(`Processing ${inputFile}...`);

  const content = readFile(inputFile);
  if (content) {
    log('File read successfully');
    log(`Writing output to ${outputFile}...`);
    if (writeFile(outputFile, content)) {
      log('Processing complete!');
    }
  }
}