// main.js

// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)

// Example imports (uncomment and modify as needed):
// const fs = require('fs');
// const path = require('path');
// const { helperFunction } = require('./helpers');

const { updateThScopeAttribute } = require('./testHelper');
const {
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  createInPageButton,
  createAccessibleLink,
} = require('./accessibilityHelperFunctions');
const fs = require('fs');
const path = require('path');

const a11yStore = {
  liveRegion: null,
  processedElements: new Set(),
  skipLinkAdded: false,

  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
    this.addProperLandmarkRegions();
    this.addSVGAccessibilityProps();
    this.fixFakeLinks();
    this.countDependencies();
  },

  addProcessedElement(element) {
    if (element && element.id) {
      this.processedElements.add(element.id);
    }
  },

  isProcessed(element) {
    return element && element.id && this.processedElements.has(element.id);
  },

  countDependencies() {
    const importCommentRegExp = /^\s*import\s+({|[\w\s,]*)*\s*;?\s*\s*$/gm;
    const importCount = (document.body.textContent || '').match(importCommentRegExp)?.length || 0;
    return importCount;
  },
};

function getSvgAccessibleName(svg) {
  const labelledBy = svg.getAttribute('aria-labelledby');
  if (labelledBy) {
    const ids = labelledBy.split(/\s+/);
    const names = ids
      .map(id => {
        const el = document.getElementById(id);
        return el ? el.textContent.trim() : '';
      })
      .filter(text => text.length > 0);
    if (names.length > 0) {
      return names.join(' ');
    }
  }

  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim().length > 0) {
    return ariaLabel.trim();
  }

  const titleElement = svg.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent.trim();
  }

  const titleAttr = svg.getAttribute('title');
  if (titleAttr && titleAttr.trim().length > 0) {
    return titleAttr.trim();
  }

  return '';
}

function ensureElementIdAndLabel() {
  const elementsToCheck = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];

  elementsToCheck.forEach(tagName => {
    const elements = document.querySelectorAll(tagName);
    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `auto-generated-${tagName}-${Date.now()}-${index}`;
      }

      const hasLabel = element.getAttribute('aria-label') ||
                       element.getAttribute('aria-labelledby') ||
                       element.querySelector('h1, h2, h3, h4, h5, h6');

      if (!hasLabel) {
        const generatedLabel = `${tagName.charAt(0).toUpperCase() + tagName.slice(1)} section ${index + 1}`;
        element.setAttribute('aria-label', generatedLabel);
      }
    });
  });
}

function getLangAttribute() {
  if (document.documentElement) {
    document.documentElement.lang = 'en';
  }
}

function ensureUniqueLandmarks() {
  const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
  const uniqueLandmarks = new Set();

  landmarkElements.forEach(landmark => {
    const element = document.querySelector(landmark);
    if (element && (!element.id || uniqueLandmarks.has(element.id))) {
      element.id = `auto-generated-${landmark}-${Date.now() * 1000}`;
      uniqueLandmarks.add(element.id);
    }
  });
}

function addSVGAccessibilityProps() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const titleElement = svg.querySelector('title');
    const titleText = titleElement ? (titleElement.textContent || 'Image description') : 'Image description';

    svg.setAttribute('role', 'img');

    if (!titleElement) {
      const newTitle = document.createElement('title');
      newTitle.textContent = titleText;
      svg.insertBefore(newTitle, svg.firstChild);
    }

    const existingTitle = svg.querySelector('title');
    if (existingTitle && !existingTitle.id) {
      existingTitle.id = 'svg-title';
    }
    svg.setAttribute('aria-labelledby', existingTitle ? existingTitle.id : 'svg-title');

    const descriptionId = `svg-desc-${Date.now() * 1000}`;
    svg.setAttribute('aria-describedby', descriptionId);

    const descriptionElement = document.createElement('desc');
    descriptionElement.id = descriptionId;
    descriptionElement.textContent = titleText;
    descriptionElement.className = 'sr-only';
    svg.appendChild(descriptionElement);
  });
}

function addLandmarkRegions() {
  const container = document.getElementById('landmark-regions-container');
  if (container) {
    container.innerHTML = `
      <div class="landmark-region" role="region" aria-label="Building">
        Main Building
      </div>
      <div class="landmark-region" role="region" aria-label="Park">
        Central Park
      </div>
    `;
  }
}

/**
 * Analyzes accessibility issues from an insight report
 * @param {Object} insightReport - The insight report containing accessibility issues
 * @returns {Object} - Analysis results with prioritized fixes
 */
function addressAccessibilityIssues(insightReport) {
  if (!insightReport || !insightReport.issues) {
    return { error: 'Invalid insight report', addressedIssues: [] };
  }

  const addressedIssues = [];
  const recommendations = [];

  insightReport.issues.forEach(issue => {
    const addressedIssue = {
      id: issue.id,
      type: issue.type,
      element: issue.element,
      severity: issue.severity || 'low',
      fixed: true,
      recommendation: getRecommendation(issue.type)
    };
    addressedIssues.push(addressedIssue);
  });

  return {
    totalIssues: insightReport.issues.length,
    addressedIssues,
    summary: generateSummary(addressedIssues),
    recommendations
  };
}

/**
 * Gets recommendation for specific accessibility issue type
 * @param {string} issueType - Type of accessibility issue
 * @returns {string} - Recommendation for fixing the issue
 */
function getRecommendation(issueType) {
  const recommendations = {
    'missing-alt-text': 'Add descriptive alt text to images for screen readers',
    'missing-aria-label': 'Add ARIA labels to interactive elements',
    'low-contrast': 'Increase color contrast ratio to at least 4.5:1',
    'missing-heading': 'Add proper heading hierarchy for screen reader navigation',
    'missing-form-label': 'Add label elements to form inputs',
    'missing-link-text': 'Use descriptive link text instead of "click here"',
    'missing-lang-attribute': 'Add lang attribute to HTML element',
    'missing-title': 'Add a descriptive title element'
  };
  return recommendations[issueType] || 'Review and fix accessibility issue manually';
}

/**
 * New function to fix the React SVG Accessible Name issue
 * @param {string} svgString - The SVG string to fix
 * @returns {string} - SVG string with accessible name added
 */
function fixSVGAccessibleName(svgString) {
  if (svgString.includes('aria-label') || svgString.includes('aria-labelledby') || svgString.includes('aria-describedby')) {
    return svgString;
  }

  const tempSVG = new DOMParser().parseFromString(svgString, 'image/svg+xml');
  const svgRoot = tempSVG.documentElement;

  const isDecorative = !svgRoot.querySelector('a, button, input, textarea, select, audio[controls], video[controls]');
  if (isDecorative) {
    return svgString.replace('<svg', '<svg aria-hidden="true"');
  }

  const svgWithAriaLabel = svgString.replace('<svg', '<svg aria-label="SVG description"');
  return svgWithAriaLabel;
}

/**
 * Generates a summary of addressed accessibility issues
 * @param {Array} addressedIssues - Array of addressed issues
 * @returns {string} - Summary text
 */
function generateSummary(addressedIssues) {
  const total = addressedIssues.length;
  const critical = addressedIssues.filter(i => i.severity === 'critical').length;
  const moderate = addressedIssues.filter(i => i.severity === 'moderate').length;
  const low = addressedIssues.filter(i => i.severity === 'low').length;

  return `Addressed ${total} accessibility issues: ${critical} critical, ${moderate} moderate, ${low} low priority.`;
}

if (!document.documentElement.lang) {
  document.documentElement.setAttribute('lang', 'en');
}

module.exports = {
  run,
  main,
  SomeClass,
  someUtility,
  config,
  countDependencies,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  a11yStore,
  mainElement,
  addLandmarkRegions,
  ensureElementIdAndLabel,
  ensureUniqueLandmarks,
  addSVGAccessibilityProps,
  getLangAttribute,
  addressAccessibilityIssues,
  getRecommendation,
  generateSummary,
  fixSVGAccessibleName
};