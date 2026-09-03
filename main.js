// TODO: This is the existing code that needs to be preserved

const main = require('./utilities')

const {
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  addSvgAccessibleName,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  decodeJwtResponse,
  fixButtonIdentifiers,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  uniqueLandmarks,
  addSvgAccessibleNames,
  checkAccessibility,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues
} = require('./AccessibilityHelpers')

import React from 'react';

// Module-level function definitions
function affectedFunction() {
  return main.affectedFunction();
}

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang;
  }
  return null;
}

function detectAndSetLang() {
  // ... implementation ...
}

function newFunction() {
  // New function implementation
}

function anotherNewFunction() {
  // Another new function implementation
}

// Implement the function to add an accessible name to SVGs
// Required changes to fix the React SVG Accessible Name issue
function addAccessibleName(svgString) {
  const parser = new DOMParser();
  const svg = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = svg.documentElement;
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', getSvgAccessibleName(svgElement));
  }
  return svgElement.outerHTML;
}

function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }

  const errors = [];

  // Check if table has proper structure
  if (!tableElement.querySelector('thead')) {
    errors.push('Table is missing <thead> element');
  }

  if (!tableElement.querySelector('tbody')) {
    errors.push('Table is missing <tbody> element');
  }

  // Check for th elements in thead
  const thead = tableElement.querySelector('thead');
  const thElements = thead ? thead.querySelectorAll('th') : [];
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements');
  }

  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });

  // Check for proper caption or summary
  const hasCaption = !!tableElement.querySelector('caption');
  const hasSummary = tableElement.hasAttribute('summary') || tableElement.hasAttribute('aria-describedby');
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }

  return { valid: errors.length === 0, errors };
}

function validateLandmark(element) {
  const role = element.getAttribute('role');
  const tag = element.tagName.toLowerCase();
  const landmarkRoles = ['banner', 'main', 'navigation', 'search', 'complementary', 'contentinfo', 'region', 'form'];
  return landmarkRoles.includes(role) || (tag === 'main');
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="main"], [role="navigation"], [role="search"], [role="complementary"], [role="contentinfo"], [role="region"], [role="form"], main');
  const issues = [];
  landmarks.forEach((landmark, index) => {
    if (!landmark.id) {
      issues.push(`Landmark ${index + 1} is missing an id attribute`);
    }
  });
  return { valid: issues.length === 0, issues };
}

function getSvgAccessibleName(svgElement) {
  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent;
  }
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  const ariaLabelledBy = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) {
      return labelElement.textContent;
    }
  }
  return 'SVG Image';
}

function uniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="main"], [role="navigation"], [role="search"], [role="complementary"], [role="contentinfo"], [role="region"], [role="form"], main');
  const ids = new Set();
  const duplicates = [];
  landmarks.forEach((landmark) => {
    const id = landmark.id;
    if (id) {
      if (ids.has(id)) {
        duplicates.push(id);
      } else {
        ids.add(id);
      }
    }
  });
  return duplicates;
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      const name = getSvgAccessibleName(svg);
      svg.setAttribute('aria-label', name);
    }
  });
}

function checkAccessibility() {
  const issues = [];
  // Check images for alt text
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.hasAttribute('alt')) {
      issues.push(`Image ${index + 1} is missing alt attribute`);
    }
  });

  // Check form inputs for labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    if (!input.hasAttribute('id') && !input.hasAttribute('aria-label')) {
      issues.push(`Form control ${index + 1} is missing label or aria-label`);
    }
  });

  // Check for keyboard focus issues
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
  interactiveElements.forEach((element, index) => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });

  return { valid: issues.length === 0, issues };
}

function validateAccessibilityReport() {
  const report = checkAccessibility();
  const tableIssues = validateTableAccessibility(document.querySelector('table'));
  const landmarkIssues = validateLandmarkStructure();
  const duplicateLandmarks = uniqueLandmarks();

  return {
    valid: report.valid && tableIssues.valid && landmarkIssues.valid && duplicateLandmarks.length === 0,
    issues: report.issues.concat(tableIssues.errors, landmarkIssues.issues, duplicateLandmarks.map(id => `Duplicate landmark id: ${id}`))
  };
}

function exportUtils() {
  return {
    setHtmlLangAttribute,
    getLangAttribute,
    detectAndSetLang,
    newFunction,
    anotherNewFunction,
    addAccessibleName,
    validateTableAccessibility,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    uniqueLandmarks,
    addSvgAccessibleNames,
    checkAccessibility,
    validateAccessibilityReport
  };
}

function addressAccessibilityIssues() {
  addSvgAccessibleNames();
  addAccessibleNamesToSVGs();
  fixFakeLinkIssues();
  fixFakeLinkIssue();
  fixTableStructure();
  fixLandmarkIssues();
  addMainLandmark();
  addLandmarkRegions();
  ensureUniqueLandmarks();
  fixButtonIdentifiers();
  ensureElementHasId();
  ensureElementHasIdOrigin();
  addAriaLabel();
  renderDependencyGraphs();
  fixDependencyGraphAria();
  addMainLandmarkToIndex();
  focusTrap();
  createInPageButton();
  createWebResourceButton();
  googleSignIn();
  decodeJwtResponse();
}