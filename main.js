const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec } = require('child_process');
const { createServer, startApp, config } = require('./');

// Find the primary content element in the DOM
const primaryContent = (typeof document !== 'undefined')
  ? (document.querySelector('.primary-content') ||
    document.querySelector('[role="main"]') ||
    document.getElementById('main-content') ||
    document.querySelector('#content'))
  : null;

const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

function checkElementAccessibility(element) {
  if (!element || !(element.tagName === 'A' || element.tagName === 'BUTTON')) {
    return false;
  }

  // Check for proper ARIA attributes if present
  const ariaHidden = element.getAttribute('aria-hidden');
  if (ariaHidden === 'true') {
    return false;
  }

  // Check for visible label or accessible name
  const ariaLabel = element.getAttribute('aria-label');
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  const hasTextContent = element.textContent.trim().length > 0;

  if (!ariaLabel && !ariaLabelledBy && !hasTextContent) {
    return false;
  }

  // Check if element is visually hidden but not hidden from screen readers
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') {
    if (element.getAttribute('aria-hidden') !== 'true') {
      return false;
    }
  }

  return true;
}

function setupHandlers() {
  console.log('Setting up event handlers...');
}

function validateInput(input) {
  return input !== null && input !== undefined;
}

function processData(data) {
  if (!validateInput(data)) {
    throw new Error('Invalid input data');
  }
}

const AddressabilityIssues = {
  validateTableAccessibility: function(table) {
    return true;
  },

  addressAccessibilityIssues(insightReport) {
    // Implementation for addressing accessibility issues
  },

  generateAccessibilityReport(accessibilityReport) {
    if (!accessibilityReport || !Array.isArray(accessibilityReport.issues)) {
      return [];
    }

    const report = accessibilityReport.issues.map(issue => ({
      issueType: issue.type,
      status: issue.status || 'pending',
      fixApplied: issue.fixApplied || ''
    }));

    return report;
  },

  calculateAccessibilityScore(fixedIssues) {
    if (!Array.isArray(fixedIssues)) {
      fixedIssues = [];
    }

    const scorePoints = {
      'color-contrast': 5,
      'missing-alt-text': 3,
      'missing-aria-label': 5,
      'heading-order': 2,
      'other': 1
    };

    return fixedIssues.reduce((score, issue) => {
      const points = scorePoints[issue.type] || scorePoints['other'];
      return score + points;
    }, 0);
  }
};

function addLangAttribute(element, lang) {
  if (element && typeof element.setAttribute === 'function') {
    element.setAttribute('lang', lang);
  }
  return element;
}

function ensureLandmarkUniqueness(elements) {
  if (!Array.isArray(elements)) {
    return [];
  }

  const uniqueElements = [];
  const seen = new Map();

  elements.forEach(element => {
    const key = element.id || element.name || JSON.stringify(element);
    if (!seen.has(key)) {
      seen.set(key, true);
      uniqueElements.push(element);
    }
  });

  return uniqueElements;
}

function renderDependencyGraphContent() {
  if (typeof document === 'undefined') {
    return;
  }
  const container = document.getElementById('dependencyGraph');
  if (!container) {
    return;
  }

  // Use the new functions for rendering
  if (typeof renderDependencyGraph === 'function') {
    renderDependencyGraph(container);
  }
  if (typeof renderIndexView === 'function') {
    renderIndexView(container);
  }
}

function fixFakeLinkIssue(document) {
  // Find elements that look like links but aren't <a> tags
  const clickableElements = document.querySelectorAll('[role="link"]:not(a), [onclick]');
  let count = 0;

  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const hasHref = element.hasAttribute('href');

    if (tagName !== 'a' && !hasHref) {
      // Check if it should be a real link
      const isInteractive = element.getAttribute('role') === 'link' ||
                             (element.hasAttribute('onclick') && element.onclick.toString().includes('window.location'));

      if (isInteractive && !element.hasAttribute('aria-label')) {
        // Add accessible name
        const text = element.textContent.trim();
        if (text) {
          element.setAttribute('aria-label', text);
        }
      }
      count++;
    }
  });
}

// Combined implementation for adding the language attribute
function addDocumentLang(document, lang = 'en') {
  if (document && document.documentElement) {
    const htmlElement = document.documentElement;
    if (!htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', lang);
    }
    return 1;
  }
  if (typeof document !== 'undefined') {
    addLangAttribute(document.documentElement, lang);
    return 1;
  } else {
    const path = require('path');
    const fs = require('fs');
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
      dependencies: Object.keys(dependencies),
      devDependencies: Object.keys(devDependencies),
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  }
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  countDependencies,
  addressAccessibilityIssues,
  generateAccessibilityReport,
  calculateAccessibilityScore,
  validateLandmark,
  fixDependencyGraphAccessibility,
  addSvgAccessibleName,
  ensureElementHasId,
  AddressabilityIssues,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues,
  addLangAttribute,
  ensureLandmarkUniqueness,
  renderDependencyGraphContent,
  fixFakeLinkIssue,
  addDocumentLang,
  checkLinkAndButtonAccessibility,
  newFocusTrap,
  fixTableStructure,
  applyAccessibilityFixes,
  handleCredentialResponse,
  addMainLandmark,
  addSvgAccessibleNames,
  loop,
  addressInsightIssues,
  initializeApp,
  primaryContent,
  checkElementAccessibility,
  setupHandlers,
  validateInput,
  processData
};