const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const { a11y, validateInput, processData, formatResponse, config: CONFIG, generateAccessibilityReport, loadLandmarks, processLandmarks, sortLandmarks, getLandmarkById, ensureUniqueLandmarks, isValidLandmark, writeReport, scanAccessibility, filterIssuesByRules, generateReportSummary, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, setSvgAttributes, implementAccessibilityFixesFromReport, validatePersonName, addKeyboardNavigation, addAriaLabels, addScreenReaderAnnouncements, addFocusTrap, helper, formatDate, validateInput, processData, fetchUser, clearCache, someFunction, sortByTitle, sortByAuthor, checkLinkAccessibility, createInPageButton, primaryContent, wrapPrimaryContentInMain, ensureDependencyGraphAriaRole, ...otherExports, fixTableStructureIssues, fixTableHeaderCellScope, addMainLandmark, addSvgAccessibleNames, fixFakeLinks, ensureLandmarkRolesAndFixIssues, addProperLandmarkRegions } = require('./');

const a11yUtilFunctions = requireAll('./utils/a11y-utils');

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

function getLangAttribute() {
    // Implementation to get language attribute
    return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
    return document.documentElement.lang || navigator.language || 'en-US';
}

function addLangAttribute(element) {
  element.lang = getFullLangAttribute();
  return element;
}

function personName(firstName, lastName) {
  const name = [firstName, lastName].filter(Boolean).join(' ');
  return name || '';
}

function getUniqueLandmarks() {
  return otherExports.uniqueLandmarks;
}

function validateLandmark(element) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!element.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${element.tagName}`);
  }
  if (!element.hasAttribute('id')) {
    issues.push('Missing id attribute');
  }

  if (!element.getAttribute('role')) {
    issues.push('Missing role attribute');
  }

  return {
    success: issues.length === 0,
    issues
  };
}

function validateTableAccessibility(table) {
  const issues = [];

  // Check for caption (from origin/main)
  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }

  // Check for headers attribute (from HEAD)
  if (!table.getAttribute('headers')) {
    issues.push('Missing headers attribute');
  }

  // Check for scope attribute on header cells (from HEAD and HEAD modified by a11y-utils)
  const headerCells = table.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      issues.push('Missing scope attribute on header cell');
    }
  });

  return {
    success: issues.length === 0,
    issues
  };
}

function validateLandmarkStructure(landmarks) {
  const issues = [];

  // If landmarks array is provided, validate each one (from HEAD)
  if (Array.isArray(landmarks)) {
    landmarks.forEach((landmark, index) => {
      const result = validateLandmark(landmark);
      if (!result.success) {
        issues.push({
          landmarkIndex: index,
          issues: result.issues
        });
      }
    });
  } else {
    // Otherwise, check for required landmarks in the DOM (from origin/main)
    const allLandmarks = document.querySelectorAll('[role]');
    let hasMain = false;
    let hasNavigation = false;

    allLandmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
    });

    if (!hasMain) {
      issues.push('Missing main landmark');
    }
    if (!hasNavigation) {
      issues.push('Missing navigation landmark');
    }
  }

  return {
    success: issues.length === 0,
    issues
  };
}

function ensureUniqueLandmarks(landmarks) {
  return ensureUniqueLandmarks(landmarks || []);
}

function enhanceLandmarks() {
  // Ensure unique landmarks (DONE: ensureUniqueLandmarks)
  ensureUniqueLandmarks();

  // Add landmark roles and fix issues (HEAD)
  ensureLandmarkRolesAndFixIssues();

  // Add proper landmark regions (HEAD)
  addProperLandmarkRegions();
}

function improveAccessibility() {
  fixTableStructureIssues();
  fixTableHeaderCellScope();
  addMainLandmark();
  addSvgAccessibleNames();
  fixFakeLinks();
  ensureUniqueLandmarks();
  addLandmarkRolesAndFixIssues();
  renderDependencyGraphContent();
  a11y(document.body);
}

async function scanAndReportAccessibility() {
  const axeInstance = axe.createInstance({
    ...config,
    rules: {
      'color-contrast': { enabled: true },
      ...config.rules || {}
    }
  });

  const tree = await axeInstance.analyze(document);

  const report = generateAccessibilityReport({
    context: document,
    issues: tree.violations
  });

  writeReport(report);
}

function initializeApp() {
  appState.initialized = true;
  console.log('Initializing application...');
  return true;
}

function getConfig() {
  return config;
}

function validateInput(input) {
  return input !== null && input !== undefined;
}

function processData(data) {
  if (!validateInput(data)) {
    throw new Error('Invalid input data');
  }
  return {
    processed: true,
    data: data,
    timestamp: Date.now()
  };
}

function createInPageButton(text, onClick) {
    // Implementation to create accessible in-page button (conflict resolved: merged implementation)
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    button.setAttribute('aria-label', text);
    return button;
}

/**
 * Handles accessibility issues found during validation
 * @param {Array} issues - Array of accessibility issues (optional)
 * @returns {Object} Summary of handled issues
 */
function handleAccessibilityIssues(issues = []) {
  const handled = [];
  const unhandled = [];

  // Process provided issues (from HEAD)
  issues.forEach(issue => {
    if (issue.fixable) {
      handled.push(issue);
    } else {
      unhandled.push(issue);
    }
  });

  // Perform DOM validation (from origin/main)
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  const landmarks = document.querySelectorAll('[role]');
  landmarks.forEach(landmark => {
    validateLandmark(landmark);
  });

  validateLandmarkStructure();
  ensureUniqueLandmarks();

  const svgs = document.querySelectorAll ? document.querySelectorAll('svg') : [];
  svgs.forEach(svg => {
    getSvgAccessibleName(svg);
  });

  return {
    total: issues.length,
    handled: handled.length,
    unhandled: unhandled.length,
    unhandledIssues: unhandled
  };
}

module.exports = {
    ...otherExports,
    improveAccessibility,
    scanAndReportAccessibility,
    ...a11yUtilFunctions,
    getLangAttribute,
    getFullLangAttribute,
    addLangAttribute,
    personName,
    validateLandmark,
    validateLandmarkStructure,
    validateTableAccessibility,
    validateTableStructure,
    getUniqueLandmarks,
    ensureUniqueLandmarks,
    handleAccessibilityIssues,
    initializeApp,
    getConfig,
    validateInput,
    processData,
    createInPageButton
};