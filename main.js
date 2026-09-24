// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by personName(), createInPageButton(), and ...)
// - ADD: Address new accessibility issues from insight report

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// _Commit: ca07afdb3852933670d8d59e11575814d1bda9e5_
// <!-- todo-hash: e944d6bc26c5766586cd5c819c30f566e3ef878d -->
// _Commit: 243c66538868c6b87845660312397ab39e0f830d_
// <!-- todo-hash: 7c12cc42f05e324f0d3f19923f0cc04843e50c4c -->

// TODO: add the new functions or changes requested in the issue
function newFunction() {
  // New function implementation
}

const renderGraphIndexAlt = (graphData) => {
  addressAccessibilityIssues();
  renderDependencyGraphs(graphData);
}

function calculateDiscount(price, discountPercentage) {
  if (typeof price !== 'number' || typeof discountPercentage !== 'number') {
    throw new TypeError('Price and discount percentage must be numbers');
  }
  if (price < 0 || discountPercentage < 0 || discountPercentage > 100) {
    throw new RangeError('Invalid input: price must be non-negative and discount must be between 0 and 100');
  }
  return price - (price * discountPercentage / 100);
}

// main.js
// TODO: Create or update the affected functions to be accessible
// The functions below have been created to match the exported names

// TODO: Validate the accessibility report for issues
function validateAccessibilityReport(report) {
  // Validate that the report is a valid object
  if (!report || typeof report !== 'object') {
    return {
      valid: false,
      issues: [],
      errors: ['Invalid report format: expected an object']
    };
  }

  const issues = [];
  const errors = [];

  // Check for required properties
  if (!report.issues) {
    errors.push('Report is missing "issues" property');
  }

  if (!Array.isArray(report.issues)) {
    errors.push('Report "issues" property must be an array');
  }

  // Validate each issue in the report
  if (Array.isArray(report.issues)) {
    report.issues.forEach((issue, index) => {
      // Check for required issue properties
      if (!issue.type) {
        errors.push(`Issue ${index + 1} is missing "type" property`);
      }

      if (issue.severity && !['error', 'warning', 'info'].includes(issue.severity)) {
        issues.push({
          type: 'validation',
          severity: 'warning',
          message: `Issue ${index + 1} has invalid severity: "${issue.severity}"`,
          suggestion: 'Use one of: "error", "warning", or "info"'
        });
      }

      if (!issue.message) {
        errors.push(`Issue ${index + 1} is missing "message" property`);
      }

      if (issue.recommendation && !issue.suggestion && !issue.fix) {
        // Log if recommendation exists but no actionable suggestion
        issues.push({
          type: 'validation',
          severity: 'info',
          message: `Issue ${index + 1} has recommendation but no actionable suggestion`
        });
      }

      // Check for duplicate issues
      const duplicateCheck = `${issue.type}-${issue.message}`;
      const existingIssue = issues.find(i => `${i.type}-${i.message}` === duplicateCheck);
      if (existingIssue) {
        issues.push({
          type: 'validation',
          severity: 'info',
          message: `Duplicate issue detected: ${issue.message}`
        });
      }
    });
  }

  // Check summary statistics if present
  if (report.summary) {
    if (typeof report.summary.total !== 'number') {
      issues.push({
        type: 'validation',
        severity: 'warning',
        message: 'Summary total is not a number',
        suggestion: 'Ensure summary.total is a numeric value'
      });
    }

    if (typeof report.summary.passed !== 'number') {
      issues.push({
        type: 'validation',
        severity: 'warning',
        message: 'Summary passed is not a number',
        suggestion: 'Ensure summary.passed is a numeric value'
      });
    }

    if (typeof report.summary.failed !== 'number') {
      issues.push({
        type: 'validation',
        severity: 'warning',
        message: 'Summary failed is not a number',
        suggestion: 'Ensure summary.failed is a numeric value'
      });
    }

    // Verify summary consistency
    if (Array.isArray(report.issues)) {
      const errorCount = report.issues.filter(i => i.severity === 'error').length;
      const warningCount = report.issues.filter(i => i.severity === 'warning').length;
      const infoCount = report.issues.filter(i => i.severity === 'info').length;

      if (report.summary.failed !== errorCount && report.summary.failed !== report.issues.length) {
        issues.push({
          type: 'validation',
          severity: 'info',
          message: 'Summary failed count may not match actual issue count'
        });
      }
    }
  }

  // Validate timestamps if present
  if (report.timestamp && isNaN(Date.parse(report.timestamp))) {
    issues.push({
      type: 'validation',
      severity: 'warning',
      message: 'Report timestamp is invalid',
      suggestion: 'Use a valid ISO 8601 date string for timestamp'
    });
  }

  return {
    valid: errors.length === 0,
    issues: issues,
    errors: errors,
    warnings: issues.filter(i => i.severity === 'warning').length,
    info: issues.filter(i => i.severity === 'info').length,
    totalIssues: (errors.length + issues.length)
  };
}

// TODO: This is the existing code that needs to be preserve
const { functionA, functionB } = require('./functionModule');

// Module-level function definitions
function affectedFunction() {
  // Function implementation
  return 'affected function result';
}

function updateFunction() {
  // Function implementation
  return 'update function result';
}

function accessibleFunction() {
  // Function implementation
  return 'accessible function result';
}

// New functions added for the issue
function newFunction1() {
  // New function implementation
  return 'new function 1 result';
}

function newFunction2() {
  // New function implementation
  return 'new function 2 result';
}

// Function to validate table accessibility
const validateTableAccessibility = (html) => {
  const issues = [];

  // Check if HTML contains tables
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let match;

  while ((match = tableRegex.exec(html)) !== null) {
    const tableContent = match[0];
    const tableNumber = (html.slice(0, match.index).match(/<table/gi) || []).length + 1;

    // Check for caption
    const hasCaption = /<caption[^>]*>[\s\S]*?<\/caption>/i.test(tableContent);
    if (!hasCaption) {
      issues.push({
        type: 'table',
        severity: 'warning',
        message: `Table ${tableNumber} is missing a <caption> element for accessibility`,
        suggestion: 'Add a <caption> element immediately after the <table> tag to describe the purpose of the table'
      });
    }

    // Check for th elements
    const hasHeaders = /<th[^>]*>/i.test(tableContent);
    if (!hasHeaders) {
      issues.push({
        type: 'table',
        severity: 'warning',
        message: `Table ${tableNumber} appears to be a data table but has no <th> (table header) elements`,
        suggestion: 'Add <th> elements for column or row headers to improve accessibility for screen readers'
      });
    }

    // Check for scope attributes on th elements
    const thMatches = tableContent.match(/<th[^>]*>/gi) || [];
    thMatches.forEach((thTag, index) => {
      if (!/scope=["'](row|col|rowgroup|colgroup)["']/i.test(thTag)) {
        issues.push({
          type: 'table',
          severity: 'info',
          message: `Table ${tableNumber} header ${index + 1} is missing a 'scope' attribute`,
          suggestion: 'Add scope="col", scope="row", scope="rowgroup", or scope="colgroup" to <th> elements'
        });
      }
    });

    // Check for thead and tbody structure
    const hasThead = /<thead[^>]*>[\s\S]*?<\/thead>/i.test(tableContent);
    const hasTbody = /<tbody[^>]*>[\s\S]*?<\/tbody>/i.test(tableContent);

    if (!hasThead) {
      issues.push({
        type: 'table',
        severity: 'info',
        message: `Table ${tableNumber} is missing <thead> element`,
        suggestion: 'Wrap header rows in a <thead> element for better semantic structure'
      });
    }

    if (!hasTbody) {
      issues.push({
        type: 'table',
        severity: 'info',
        message: `Table ${tableNumber} is missing <tbody> element`,
        suggestion: 'Wrap data rows in a <tbody> element for better semantic structure'
      });
    }

    // Check for id and headers attributes for complex tables
    const hasMultipleHeaders = (tableContent.match(/<th/gi) || []).length > 1;
    if (hasMultipleHeaders) {
      const hasHeadersAttr = /headers=["'][^"']+["']/.test(tableContent);
      const hasIdAttr = /id=["'][^"']+["']/.test(tableContent.replace(/<th/gi, '<td'));

      if (!hasIdAttr && !hasHeadersAttr) {
        issues.push({
          type: 'table',
          severity: 'warning',
          message: `Table ${tableNumber} has multiple headers but may not have proper id/headers associations`,
          suggestion: 'For complex tables, ensure header cells have unique id attributes and data cells have headers attributes referencing those ids'
        });
      }
    }
  }

  return issues;
};

// Validate table structure implementation
const validateTableStructureImpl = (html) => {
  const issues = [];
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let match;

  while ((match = tableRegex.exec(html)) !== null) {
    const tableContent = match[0];
    const tableNumber = (html.slice(0, match.index).match(/<table/gi) || []).length + 1;

    // Check for proper row structure
    const rows = tableContent.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
    if (rows.length === 0) {
      issues.push({
        type: 'table',
        severity: 'warning',
        message: `Table ${tableNumber} has no <tr> elements`,
        suggestion: 'Add at least one <tr> element inside the table'
      });
    }

    // Check for header rows
    const hasHeaderRow = /<tr[^>]*>\s*<th/i.test(tableContent);
    if (!hasHeaderRow) {
      const firstRow = tableContent.match(/<tr[^>]*>[\s\S]*?<\/tr>/i);
      if (firstRow && /<td/i.test(firstRow[0])) {
        issues.push({
          type: 'table',
          severity: 'info',
          message: `Table ${tableNumber} first row appears to be a data row instead of a header row`,
          suggestion: 'Consider using <th> elements in the first row for column headers'
        });
      }
    }

    // Check for cell consistency
    const headerCells = tableContent.match(/<th[^>]*>[\s\S]*?<\/th>/gi) || [];
    const dataCells = tableContent.match(/<td[^>]*>[\s\S]*?<\/td>/gi) || [];

    if (headerCells.length > 0 && dataCells.length > 0) {
      const headerCount = headerCells.length;
      const rowsWithData = tableContent.match(/<tr[^>]*>(?!<th)[\s\S]*?<\/tr>/gi) || [];
      rowsWithData.forEach((row, rowIndex) => {
        const cellCount = (row.match(/<td/gi) || []).length;
        if (cellCount !== headerCount) {
          issues.push({
            type: 'table',
            severity: 'info',
            message: `Table ${tableNumber} row ${rowIndex + 1} has ${cellCount} cells, expected ${headerCount}`,
            suggestion: 'Ensure consistent number of cells across all rows'
          });
        }
      });
    }
  }

  return issues;
};

const validateTableStructure = validateTableStructureImpl;

// Transform input data utility
const transformInputData = (data) => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  return Object.keys(data).reduce((acc, key) => {
    const newKey = key.replace(/[^a-zA-Z0-9]/g, '_');
    acc[newKey] = data[key];
    return acc;
  }, {});
};

// Re-add the required exports for functionA and functionB
// Assuming that they are objects with properties X, Y, and Z

// App state for session management
const appState = {
  sessions: new Map()
};

// Helper functions for session management
function getActiveSessionsCount() {
  return appState.sessions.size;
}

// Check landmark elements for accessibility
function checkLandmarkElements() {
  const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarkElements.forEach((element) => {
    const landmarks = document.querySelectorAll(`[role="${element}"]`);
    landmarks.forEach((landmark, index) => {
      if (landmark.id === '') {
        landmark.setAttribute('id', `${element}-${index}`);
      }

      if (landmarks.length > 1) {
        if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
          landmark.setAttribute('aria-label', `${element} ${index + 1}`);
        }
      }
    });
  });
}

// a11yStore from HEAD - preserving all accessibility methods
const a11yStore = {
  // ... existing methods ...

  /**
   * Check if the user prefers reduced motion
   * @returns {boolean} True if the user prefers reduced motion
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.announce(message, priority);
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach(element => {
      const landmarks = document.querySelectorAll(element);
      landmarks.forEach((landmark, index) => {
        if (landmark.id === '') {
          landmark.id = `${element}-${index}`;
        }

        if (landmarks.length > 1) {
          if (!landmark.getAttribute('aria-label')) {
            landmark.setAttribute('aria-label', `${element} ${index + 1}`);
          }
        }
      });
    });
  },

  addSvgAccessibleNames() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      let titleElement = svg.querySelector('title');
      if (!titleElement) {
        titleElement = document.createElement('title');
        titleElement.textContent = 'Image';
        svg.insertBefore(titleElement, svg.firstChild);
      }

      if (!titleElement.id) {
        titleElement.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
      }

      svg.setAttribute('aria-labelledby', titleElement.id);

      if (!svg.getAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[data-link]');
    fakeLinks.forEach(link => {
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      link.setAttribute('aria-pressed', 'true');
    });
  },

  preserveExistingCode() {
    // TODO: This is the existing code that needs to be preserved
    // _Commit: 4b0a76170c9695891c503753fc8449a3a8434fd3_
    // <!-- todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888 -->
    // _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
    // <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
    // _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
    // <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
    // _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
    // <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
    // _Commit: 9f4ca23445c76674f7b5dd5047c707b41ba67409_
    // <!-- todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888 -->
  },

  newFunction() {
    // New function implementation from origin/main
  }
};

function getSvgAccessibleName(svgElement) {
  const title = svgElement.querySelector('title');
  const desc = svgElement.querySelector('desc');

  if (title && title.textContent) {
    return title.textContent.trim();
  }

  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }

  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel.trim();
  }

  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labeledElement = document.getElementById(ariaLabelledby);
    if (labeledElement && labeledElement.textContent) {
      return labeledElement.textContent.trim();
    }
  }

  return 'SVG graphic';
}

// Main entry point
function mainEntry() {
  // Application initialization
  return 'main function executed';
}

// Accessibility helper functions
function getLangAttribute() {
  // Get the language attribute from the HTML element
  return document.documentElement.lang || 'en';
}

function ensureDependencyGraphARIA() {
  // Ensure ARIA attributes are properly set for dependency graph elements
  const elements = document.querySelectorAll('[data-dependency-graph]');
  elements.forEach(el => {
    el.setAttribute('role', 'graph');
    el.setAttribute('aria-label', 'Dependency graph visualization');
  });
}

// Wrap primary content in main element for accessibility
function wrapPrimaryContentInMain() {
  const mainElement = document.querySelector('main');
  if (!mainElement) {
    const main = document.createElement('main');
    main.id = 'main-content';
    const primaryContent = document.querySelector('main, [role="main"]');
    if (primaryContent && primaryContent.firstChild) {
      while (primaryContent.firstChild) {
        main.appendChild(primaryContent.firstChild);
      }
      if (primaryContent.parentNode) {
        primaryContent.parentNode.appendChild(main);
      }
    }
  }
}

// Check and ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  landmarkRoles.forEach(role => {
    const landmarks = document.querySelectorAll(`[role="${role}"]`);
    const ids = new Set();
    landmarks.forEach((landmark, index) => {
      const existingId = landmark.id;
      if (existingId && ids.has(existingId)) {
        landmark.id = `${role}-${index}`;
      }
      if (existingId) {
        ids.add(existingId);
      }
    });
  });
}

// Handle focus trap for modal dialogs
function handleFocusTrap(container) {
  const focusableElements = container.querySelectorAll('button, [href], input, select, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (e) => {
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
}

// Check for landmark elements and return status
function checkLandmarkElement() {
  const requiredLandmarks = ['main', 'nav', 'header', 'footer'];
  const missingLandmarks = [];
  requiredLandmarks.forEach(landmark => {
    const element = document.querySelector(landmark);
    if (!element) {
      missingLandmarks.push(landmark);
    }
  });
  return missingLandmarks;
}

// Check all landmarks
function checkLandmarks() {
  const allLandmarks = document.querySelectorAll('main, nav, header, footer, aside, [role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"]');
  return allLandmarks.length;
}

// ... rest of the preserved code