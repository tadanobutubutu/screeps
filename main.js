const fs = require('fs');
const main = require('./utilities');
const accessibilityHelpers = require('./accessibility-helpers'); // Assuming this module exists based on origin/main usage

// Combine destructuring from both branches, removing duplicates
const {
  createInPageButton,
  createWebResourceButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  handleCredentialResponse,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  // From origin/main branch
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  uniqueLandmarks,
  addSvgAccessibleName,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  decodeJwtResponse,
  checkAccessibility,
  validateTableStructureForAccessibility,
  implementAccessibilityFixesFromReport,
  checkAccessibilityForReport,
  renderGraphIndex,
  trapFocus,
  getActiveSessionsCount,
  validateSession,
  accessibilityUtils,
  createAnnouncer,
  prefersReducedMotion,
  renderSimpleDependencyGraph,
  addAccessibleName,
  addLangAttribute,
  initializeAccessibility,
  renderIndex,
  validateHeadingHierarchy,
  ensureHeadingHierarchy,
  newFocusTrap,
  // Ensure all functions from HEAD are included
  ...remainingMain
} = main;

// Merge accessibilityHelpers destructuring with main's accessibilityUtils if needed
const {
  fixDependencyGraphAria: helperFixDependencyGraphAria,
  addMainLandmarkToIndex: helperAddMainLandmarkToIndex,
  focusTrap: helperFocusTrap,
  createWebResourceButton: helperCreateWebResourceButton,
  validateLandmark: helperValidateLandmark,
  validateLandmarkStructure: helperValidateLandmarkStructure,
  getSvgAccessibleName: helperGetSvgAccessibleName,
  getLangAttribute: getLangAttributeHelper,
  validateAccessibilityReport: helperValidateAccessibilityReport,
  exportUtils: helperExportUtils,
  addressAccessibilityIssues: helperAddressAccessibilityIssues,
  renderGraphIndex: renderGraphIndexHelper,
  trapFocus: helperTrapFocus,
  renderAdditionalContent: helperRenderAdditionalContent,
  checkAccessibilityForReport: helperCheckAccessibilityForReport,
  setupFocusTrap,
  restoreFocus,
  addLangAttribute: addLangAttributeHelper
} = accessibilityHelpers;

// Utility function from HEAD
const ensureElementIdUtil = (element) => {
  if (element && !element.id) {
    element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
};

// Accessibility utilities object from HEAD, enhanced with origin/main functions
const accessibilityUtils = {
  initSkipLink: function () {
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

  trapFocus: function (element) {
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

  getFullLangAttribute: function (locale = 'en') {
    return `${locale}-RU`;
  },

  createInPageButton: createInPageButton,
  createWebResourceButton: createWebResourceButton,

  ensureUniqueLandmarkId: function (landmark) {
    if (!landmark) return;
    if (landmark.id) return landmark.id;
    landmark.id = `landmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return landmark.id;
  },

  uniqueLandmarks: function () {
    const landmarks = document.querySelectorAll('[role=banner], [role=navigation]');
    const ids = new Set();

    landmarks.forEach((landmark) => {
      const id = landmark.id;
      if (id) ids.add(id);
    });

    return ids.size < 2;
  },

  createAccessibleLink: function (url, text, target) {
    const link = document.createElement('a');
    link.href = url;
    link.textContent = text;
    link.setAttribute('target', target || '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.setAttribute('aria-label', `Open ${text} in new window`);
    return link;
  },

  handleAccessibilityIssues: function () {
    // Implementation to address accessibility issues in the report
    // This function should validate the report and fix issues as needed
  },

  addLangAttribute: function (element, locale = 'en') {
    if (element) {
      element.setAttribute('lang', locale);
    }
  },

  // Include functions from origin/main that are relevant
  fixTableStructure: fixTableStructure,
  fixLandmarkIssues: fixLandmarkIssues,
  addMainLandmark: addMainLandmark,
  addLandmarkRegions: addLandmarkRegions,
  ensureUniqueLandmarks: ensureUniqueLandmarks,
  addSvgAccessibleNames: addSvgAccessibleNames,
  addSvgAccessibleName: addSvgAccessibleName,
  addAccessibleNamesToSVGs: addAccessibleNamesToSVGs,
  fixFakeLinkIssue: fixFakeLinkIssue,
  fixFakeLinkIssues: fixFakeLinkIssues,
  googleSignIn: googleSignIn,
  decodeJwtResponse: decodeJwtResponse,
  checkAccessibility: checkAccessibility,
  validateTableStructureForAccessibility: validateTableStructureForAccessibility,
  implementAccessibilityFixesFromReport: implementAccessibilityFixesFromReport,
  checkAccessibilityForReport: checkAccessibilityForReport,
  renderGraphIndex: renderGraphIndex,
  trapFocus: trapFocus,
  getActiveSessionsCount: getActiveSessionsCount,
  validateSession: validateSession,
  createAnnouncer: createAnnouncer,
  prefersReducedMotion: prefersReducedMotion,
  renderSimpleDependencyGraph: renderSimpleDependencyGraph,
  addAccessibleName: addAccessibleName,
  initializeAccessibility: initializeAccessibility,
  renderIndex: renderIndex,
  validateHeadingHierarchy: validateHeadingHierarchy,
  ensureHeadingHierarchy: ensureHeadingHierarchy,
  setupFocusTrap: setupFocusTrap,
  restoreFocus: restoreFocus
};

// Dependency Graph ARIA management - merged function from origin/main
function ensureDependencyGraphARIA(container) {
  if (!container) return;
  
  const graphElements = container.querySelectorAll('[data-dependency-graph]');
  graphElements.forEach(el => {
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', 'Dependency graph visualization');
  });
}

// New function from origin/main
function newFunction() {
  // New function implementation
}

function anotherNewFunction() {
  // Another new function implementation
}

// Ensure dependency graph has ARIA attributes (from origin/main)
const dependencyGraph = document.getElementById('dependencyGraph');
if (dependencyGraph) {
  if (!dependencyGraph.getAttribute('role')) {
    dependencyGraph.setAttribute('role', 'region');
  }
  if (!dependencyGraph.getAttribute('aria-label')) {
    dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
  }
  if (!dependencyGraph.getAttribute('id')) {
    dependencyGraph.setAttribute('id', 'dependencyGraph');
  }
  if (typeof setupFocusTrap === 'function') {
    setupFocusTrap('#dependencyGraph');
  }
}

// Add lang attribute to HTML element if missing (from origin/main)
if (typeof addLangAttributeHelper === 'function') {
  addLangAttributeHelper(document.documentElement);
}

// Functions from HEAD that were not in origin/main
function generateAccessibilityReport() {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalIssues: 0,
            critical: 0,
            moderate: 0,
            passed: 0
        },
        issues: [],
        passed: []
    };

    // Check SVG accessibility
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
        const title = svg.querySelector('title');
        const desc = svg.querySelector('desc');
        if (title && desc) {
            report.passed.push({
                category: 'REACT_041',
                message: `SVG ${index + 1} has accessible title and description`,
                status: 'passed'
            });
            report.summary.passed++;
        } else {
            report.issues.push({
                category: 'REACT_041',
                message: `SVG ${index + 1} is missing accessible name`,
                status: 'moderate'
            });
            report.summary.moderate++;
            report.summary.totalIssues++;
        }
    });

    // Check link accessibility
    const links = document.querySelectorAll('a');
    links.forEach((link, index) => {
        if (link.textContent.trim() === '') {
            report.issues.push({
                category: 'REACT_036',
                message: `Link ${index + 1} has no accessible text`,
                status: 'moderate'
            });
            report.summary.moderate++;
            report.summary.totalIssues++;
        } else {
            report.passed.push({
                category: 'REACT_036',
                message: `Link ${index + 1} has accessible text`,
                status: 'passed'
            });
            report.summary.passed++;
        }
    });

    return report;
}

function renderAccessibilityReportHtml(report) {
    let html = `<div class="accessibility-report">
        <h1>Accessibility Report</h1>
        <p>Generated: ${report.timestamp}</p>

        <div class="summary">
            <h2>Summary</h2>
            <ul>
                <li>Total Issues: ${report.summary.totalIssues}</li>
                <li>Critical: ${report.summary.critical}</li>
                <li>Moderate: ${report.summary.moderate}</li>
                <li>Passed: ${report.summary.passed}</li>
            </ul>
        </div>

        <div class="issues">
            <h2>Issues Found</h2>`;

    if (report.issues.length === 0) {
        html += '<p>No issues found!</p>';
    } else {
        report.issues.forEach(issue => {
            html += `<div class="issue ${issue.status}">
                <strong>${issue.category}</strong>: ${issue.message}
            </div>`;
        });
    }

    html += `</div>

        <div class="passed">
            <h2>Passed Checks</h2>`;

    if (report.passed.length === 0) {
        html += '<p>No checks passed yet.</p>';
    } else {
        report.passed.forEach(item => {
            html += `<div class="passed-item">
                <strong>${item.category}</strong>: ${item.message}
            </div>`;
        });
    }

    html += '</div></div>';

    return html;
}

function generateAndDisplayReport() {
    const report = generateAccessibilityReport();

    console.log('=== Accessibility Report ===');
    console.log(`Generated: ${report.timestamp}`);
    console.log(`Total Issues: ${report.summary.totalIssues}`);
    console.log(`Critical: ${report.summary.critical}`);
    console.log(`Moderate: ${report.summary.moderate}`);
    console.log(`Passed: ${report.summary.passed}`);

    if (report.issues.length > 0) {
        console.log('\n--- Issues ---');
        report.issues.forEach(issue => {
            console.log(`[${issue.status.toUpperCase()}] ${issue.category}: ${issue.message}`);
        });
    }

    if (report.passed.length > 0) {
        console.log('\n--- Passed Checks ---');
        report.passed.forEach(item => {
            console.log(`[PASSED] ${item.category}: ${item.message}`);
        });
    }

    return report;
}

function createLandmarkRegion({ role, label, id, container = document.body } = {}) {
    if (!role) {
        throw new Error('Role is required to create a landmark region');
    }

    const landmark = document.createElement('div');
    landmark.setAttribute('role', role);

    if (label) {
        landmark.setAttribute('aria-label', label);
    }

    if (id) {
        landmark.id = accessibilityUtils.ensureUniqueLandmarkId(id);
    } else {
        landmark.id = accessibilityUtils.ensureUniqueLandmarkId(role);
    }

    landmark.style.border = '1px solid #ccc';
    landmark.style.padding = '10px';
    landmark.style.margin = '10px 0';

    if (container) {
        container.appendChild(landmark);
    }

    return landmark;
}

function newAccessibilityCheck() {
  // Implementation for a new accessibility check
}

// Functions from origin/main that were not in HEAD
function updateFunction() {
  return 'update function result';
}

function accessibleFunction() {
  return 'accessible function result';
}

function newFunction1() {
  return 'new function 1 result';
}

function newFunction2() {
  return 'new function 2 result';
}

// Table accessibility validation from origin/main
const validateTableAccessibility = (html) => {
  const issues = [];
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let match;

  while ((match = tableRegex.exec(html)) !== null) {
    const tableContent = match[0];
    const tableNumber = (html.slice(0, match.index).match(/<table/gi) || []).length + 1;

    const hasCaption = /<caption[^>]*>[\s\S]*?<\/caption>/i.test(tableContent);
    if (!hasCaption) {
      issues.push({
        type: 'table',
        severity: 'warning',
        message: `Table ${tableNumber} is missing a <caption> element for accessibility`,
        suggestion: 'Add a <caption> element immediately after the <table> tag to describe the purpose of the table'
      });
    }

    const hasHeaders = /<th[^>]*>/i.test(tableContent);
    if (!hasHeaders) {
      issues.push({
        type: 'table',
        severity: 'warning',
        message: `Table ${tableNumber} appears to be a data table but has no <th> (table header) elements`,
        suggestion: 'Add <th> elements for column or row headers to improve accessibility for screen readers'
      });
    }

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

// Functions from HEAD branch that were duplicated
function ensureElementId(element) {
  if (!element.id) {
    element.id = `element-${Math.floor(Math.random() * 10000)}`;
  }
  return element.id;
}

function addAriaLabel(element, label) {
  element.setAttribute('aria-label', label);
}

function renderDependencyGraph(data) {
  return data;
}

// Functions from origin/main branch
function mainEntry() {
  return 'main function executed';
}

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function newFocusTrap() {
  // Focus trap implementation
}

function addLangAttribute(lang = 'en') {
  document.documentElement.lang = lang;
}

function fixTableStructure(tableElement) {
  if (!tableElement) return null;

  const headers = tableElement.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      const row = th.closest('tr');
      const cellIndex = Array.from(row.children).indexOf(th);
      th.setAttribute('scope', cellIndex === 0 ? 'row' : 'col');
    }
  });
  return tableElement;
}

function addLandmarkIssues(issues) {
  return issues;
}

function addSvgAccessibleNames() {
  // Add accessible names to SVG elements
}

function ensureUniqueLandmarks() {
  // Ensure landmark elements have unique identifiers
}

function fixFakeLinkIssue() {
  // Fix fake link accessibility issues
}

function renderGraphIndex() {
  // Render graph index
}

function updateGraphVisualization() {
  // Update graph
}

// Export merged functionality
module.exports = {
  ...main,
  ...accessibilityUtils,
  ensureElementIdUtil,
  newFocusTrap,
  // Additional exports from both branches
  ensureDependencyGraphARIA,
  newFunction,
  anotherNewFunction,
  updateFunction,
  accessibleFunction,
  newFunction1,
  newFunction2,
  validateTableAccessibility,
  ensureElementId,
  addAriaLabel,
  renderDependencyGraph,
  mainEntry,
  getLangAttribute,
  fixTableStructure,
  addLandmarkIssues,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  renderGraphIndex,
  updateGraphVisualization,
  generateAccessibilityReport,
  renderAccessibilityReportHtml,
  generateAndDisplayReport,
  createLandmarkRegion,
  newAccessibilityCheck
};