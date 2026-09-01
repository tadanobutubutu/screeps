const fs = require('fs');
const main = require('./utilities');

const { createInPageButton, createWebResourceButton, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, getLangAttribute, validateAccessibilityReport, exportUtils, addressAccessibilityIssues, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, focusTrap, renderAdditionalContent } = main;

const ensureElementIdUtil = (element) => {
  if (element && !element.id) {
    element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
};

const newFocusTrap = accessibilityUtils.newFocusTrap;

const accessibilityUtils = {
  ...accessibilityUtils,
  ...{
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

    // Address accessibility issues from insight report
    handleAccessibilityIssues: function () {
      // Implementation to address accessibility issues in the report
      // This function should validate the report and fix issues as needed
    },

    addLangAttribute: function (element, locale = 'en') {
      if (element) {
        element.setAttribute('lang', locale);
      }
    }
  }
};

module.exports = {
  ...main,
  ...accessibilityUtils,
  ensureElementId,
  ensureElementIdUtil,
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
  displayModuleStructure,
  generateDependencyGraph,
  validateAccessibilityReport,
  addressAccessibilityIssues,
  newAccessibilityCheck,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  checkLinkAccessibility,
  createInPageButton,
  createWebResourceButton,
  addAriaLabel,
  ...accessibilityUtils
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
        }
    });

    return report;
}

/**
 * Renders the accessibility report as an HTML string.
 * @param {Object} report - The accessibility report object.
 * @returns {string} HTML string representing the report.
 */
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

/**
 * Generates and displays the accessibility report in the console and returns the report object.
 * @returns {Object} The accessibility report object.
 */
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

/**
 * Creates a landmark region with proper ARIA attributes and structure.
 * @param {Object} options - Configuration options for the landmark.
 * @param {string} options.role - The ARIA role for the landmark (e.g., 'banner', 'navigation').
 * @param {string} [options.label] - Accessible label for the landmark.
 * @param {string} [options.id] - Unique ID for the landmark.
 * @param {HTMLElement} [options.container] - Container element to append the landmark to.
 * @returns {HTMLElement} The created landmark element.
 */
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
        landmark.id = ensureUniqueLandmarkId(id);
    } else {
        landmark.id = ensureUniqueLandmarkId(role);
    }

    // Add basic styling to make landmarks visible in development
    landmark.style.border = '1px solid #ccc';
    landmark.style.padding = '10px';
    landmark.style.margin = '10px 0';

    if (container) {
        container.appendChild(landmark);
    }

    return landmark;
}

// Export the new landmark function
export { createLandmarkRegion };

function newAccessibilityCheck() {
  // Implementation for a new accessibility check
  // This function should perform additional checks for accessibility issues
  // Replace this with your custom implementation as needed
}