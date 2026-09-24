// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----

// Importing the necessary functions (for illustration purposes)
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';

// Some existing code here
function existingFunction () {
  return 'existing'
}

// New functions to address additional accessibility requirements
function addAriaLabel(element, label) {
  if (element && !element.hasAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

function ensureElementHasId(elementId) {
  const element = document.getElementById(elementId);
  if (element && !element.id) {
    element.setAttribute('id', elementId);
  }
}

function getFullLangAttribute() {
  const base = getLangAttribute ? getLangAttribute() : '';
  if (!base) {
    return '';
  }
  if (base.includes('-')) {
    return base;
  }
  // Default region fallback (kept lightweight and non-prescriptive)
  return `${base}`;
}

function createAccessibleLink({ href, text, ariaLabel, role = 'link' } = {}) {
  const a = (typeof document !== 'undefined') ? document.createElement('a') : null;
  if (!a) {
    return null;
  }
  a.setAttribute('href', href || '#');
  a.setAttribute('role', role);
  a.textContent = text || '';
  if (ariaLabel) {
    a.setAttribute('aria-label', ariaLabel);
  }
  return a;
}

function handleAccessibilityIssues(options = {}) {
  const root = options.root || (typeof document !== 'undefined' ? document : null);
  const report = {
      langApplied: false,
      landmarksValidated: 0,
      tablesValidated: 0,
      svgsLabeled: 0,
      fakeLinksHandled: 0
  };

  if (!root) {
    return report;
  }

  // ... original handleAccessibilityIssues function implementation ...

  return report;
}

function addLangAttribute() {
  const elementToModify = document.documentElement;
  if (elementToModify && !elementToModify.hasAttribute('lang')) {
    elementToModify.setAttribute('lang', 'en');
  }
}

// ... other new functions ...

module.exports = {
  existingFunction,

  // Preserve existing functionality

  // Importing the necessary functions (for illustration purposes)
  getLangAttribute: require('./utils/accessibilityUtils').getLangAttribute,
  createInPageButton: require('./utils/accessibilityUtils').createInPageButton,
  validateTableAccessibility: require('./utils/tableAccessibilityUtils').validateTableAccessibility,
  validateTableStructure: require('./utils/tableAccessibilityUtils').validateTableStructure,
  validateLandmark: require('./utils/landmarkUtils').validateLandmark,
  validateLandmarkStructure: require('./utils/landmarkUtils').validateLandmarkStructure,
  getSvgAccessibleName: require('./utils/svgAccessibilityUtils').getSvgAccessibleName,
  setSvgAttributes: require('./utils/svgAccessibilityUtils').setSvgAttributes,
  validateLinkAccessibility: require('./utils/linkAccessibilityUtils').validateLinkAccessibility,
  handleFakeLinks: require('./utils/linkAccessibilityUtils').handleFakeLinks,

  // New functions to address additional accessibility requirements
  addAriaLabel(element, label) {
    if (element && !element.hasAttribute('aria-label')) {
      element.setAttribute('aria-label', label);
    }
  },

  ensureElementHasId(elementId) {
    const element = document.getElementById(elementId);
    if (element && !element.id) {
      element.setAttribute('id', elementId);
    }
  },

  getFullLangAttribute() {
    const base = this.getLangAttribute ? this.getLangAttribute() : '';
    if (!base) {
      return '';
    }
    if (base.includes('-')) {
      return base;
    }
    // Default region fallback (kept lightweight and non-prescriptive)
    return `${base}`;
  },

  createAccessibleLink({ href, text, ariaLabel, role = 'link' } = {}) {
    const a = (typeof document !== 'undefined') ? document.createElement('a') : null;
    if (!a) {
      return null;
    }
    a.setAttribute('href', href || '#');
    a.setAttribute('role', role);
    a.textContent = text || '';
    if (ariaLabel) {
      a.setAttribute('aria-label', ariaLabel);
    }
    return a;
  },

  handleAccessibilityIssues(options = {}) {
    const root = options.root || (typeof document !== 'undefined' ? document : null);
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

    // Check lang attribute
    const htmlElement = document.querySelector('html');
    if (htmlElement && htmlElement.hasAttribute('lang')) {
        report.passed.push({
            category: 'REACT_015',
            message: 'HTML element has lang attribute',
            status: 'passed'
        });
    } else {
        report.issues.push({
            category: 'REACT_015',
            message: 'HTML element is missing lang attribute',
            status: 'critical'
        });
        report.summary.critical++;
        report.summary.totalIssues++;
    }

    // Check landmark uniqueness
    const landmarks = document.querySelectorAll('[role]');
    const landmarkIds = new Set();
    let duplicateLandmarks = [];

    landmarks.forEach(landmark => {
        const id = landmark.id;
        if (id) {
            if (landmarkIds.has(id)) {
                duplicateLandmarks.push(id);
                report.issues.push({
                    category: 'REACT_025',
                    message: `Duplicate landmark ID: ${id}`,
                    status: 'critical'
                });
                report.summary.critical++;
                report.summary.totalIssues++;
            }
            landmarkIds.add(id);
        }
    });

    if (duplicateLandmarks.length === 0) {
        report.passed.push({
            category: 'REACT_025',
            message: 'All landmarks have unique IDs',
            status: 'passed'
        });
    }

    // Check table accessibility
    const tables = document.querySelectorAll('table');
    tables.forEach((table, index) => {
        const headers = table.querySelectorAll('th');
        if (headers.length > 0) {
            report.passed.push({
                category: 'REACT_027',
                message: `Table ${index + 1} has proper header cells`,
                status: 'passed'
            });
        }
    });

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
  },

  addLangAttribute() {
    const elementToModify = document.documentElement;
    if (elementToModify && !elementToModify.hasAttribute('lang')) {
      elementToModify.setAttribute('lang', 'en');
    }
  },

  gameLoop(timestamp) {
    if (!this.lastTimestamp) this.lastTimestamp = timestamp;
    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    if (this.gameOver) {
      this.draw();
      return;
    }

  // Export all functions
  exports: {
    handleAccessibilityIssues: this.handleAccessibilityIssues,
    getFullLangAttribute: this.getFullLangAttribute,
    addAriaLabel: this.addAriaLabel,
    ensureElementHasId: this.ensureElementHasId,
    createAccessibleLink: this.createAccessibleLink,
    addLangAttribute: this.addLangAttribute
  }
};