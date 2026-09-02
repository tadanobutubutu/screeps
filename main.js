// Accessibility Functions for Screeps

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');

let dependencyGraph = {};
let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice";

/**
 * Gets the dependency graph
 * @returns {Object} The dependency graph or a message
 */
function getDependencyGraph() {
  if (Object.keys(dependencyGraph).length === 0) {
    return { message: "No dependency graph found." };
  }
  return dependencyGraph;
}

/**
 * Helper function for accessibility tasks
 * @param {...*} args - Variable arguments
 * @returns {Array} Array of arguments
 */
const accessiblyHelper = async (...args) => {
  return args;
};

/**
 * Gets user safety advice
 * @returns {string} A random safety category
 */
function getUserSafetyAdvice() {
  const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
}

/**
 * Generates an accessibility report
 * @param {Object} issuesData - Optional issues data
 * @returns {Object} Accessibility report
 */
function generateAccessibilityReport(issuesData) {
  let issues;

  if (!issuesData) {
    // ... (preserve existing logic for generating issues)
  } else {
    issues = axe.analyze('./index.html');

    const report = {
      introduction: 'Accessibility report for the application',
      data: issues,
      conclusions: '',
    };

    return report;
  }
}

/**
 * Gets the language attribute value for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  const htmlElement = document.documentElement;
  return htmlElement.getAttribute('lang') || 'en';
}

/**
 * Creates an accessible in-page navigation button
 * @param {string} targetId - The ID of the target element
 * @param {string} label - The accessible label for the button
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(targetId, label) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', label);
  button.textContent = label;
  button.addEventListener('click', () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
  return button;
}

/**
 * Validates table accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
function validateTableAccessibility(table) {
  if (!table) return false;
  
  const headers = table.querySelectorAll('th');
  const hasHeaders = headers.length > 0;
  const hasScope = Array.from(headers).every(th => th.hasAttribute('scope'));
  
  return hasHeaders && hasScope;
}

/**
 * Validates table structure for accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with issues
 */
function validateTableStructure(table) {
  const issues = [];
  
  if (!table) {
    issues.push('Table element is missing');
    return { valid: false, issues };
  }
  
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  
  if (!tbody) issues.push('Missing tbody element');
  if (!thead) issues.push('Missing thead element');
  
  const rows = table.querySelectorAll('tr');
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      issues.push(`Row ${index} has no cells`);
    }
  });
  
  return { valid: issues.length === 0, issues };
}

/**
 * Validates landmarks on the page
 * @returns {Array} Array of landmark validation issues
 */
function validateLandmark() {
  const issues = [];
  const landmarks = getLandmarks();
  
  const banner = document.querySelector('[role="banner"]');
  const main = document.querySelector('main, [role="main"]');
  const footer = document.querySelector('[role="contentinfo"]');
  
  if (!banner) issues.push('Missing banner landmark');
  if (!main) issues.push('Missing main landmark');
  if (!footer) issues.push('Missing footer landmark');
  
  return issues;
}

/**
 * Gets all landmarks on the page
 * @returns {Array} Array of landmark elements
 */
function getLandmarks() {
  const landmarkSelectors = [
    'header:not([role])',
    '[role="banner"]',
    'nav',
    '[role="navigation"]',
    'main',
    '[role="main"]',
    'aside',
    '[role="complementary"]',
    'footer:not([role])',
    '[role="contentinfo"]'
  ];
  
  const landmarks = [];
  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => landmarks.push(el));
  });
  
  return landmarks;
}

/**
 * Processes landmarks for accessibility
 * @param {Array} landmarks - Array of landmark elements
 * @returns {Array} Processed landmark data
 */
function processLandmarks(landmarks) {
  return landmarks.map(landmark => ({
    element: landmark,
    tagName: landmark.tagName.toLowerCase(),
    role: landmark.getAttribute('role') || null,
    label: landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby') || null,
    id: landmark.id || null
  }));
}

/**
 * Sorts landmarks by their position in the DOM
 * @param {Array} landmarks - Array of landmark elements
 * @returns {Array} Sorted landmarks
 */
function sortLandmarks(landmarks) {
  return landmarks.sort((a, b) => {
    const positionA = a.element.getBoundingClientRect();
    const positionB = b.element.getBoundingClientRect();
    return positionA.top - positionB.top;
  });
}

/**
 * Gets a landmark by its ID
 * @param {string} id - The landmark ID
 * @returns {HTMLElement|null} The landmark element
 */
function getLandmarkById(id) {
  const element = document.getElementById(id);
  if (!element) return null;
  
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  const tagName = element.tagName.toLowerCase();
  const role = element.getAttribute('role');
  
  const isLandmark = landmarkRoles.includes(role) ||
    ['header', 'nav', 'main', 'aside', 'footer'].includes(tagName);
  
  return isLandmark ? element : null;
}

/**
 * Gets accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const titleElement = document.getElementById(ariaLabelledby);
    return titleElement ? titleElement.textContent : '';
  }
  
  return '';
}

/**
 * Sets accessibility attributes on SVG elements
 * @param {SVGElement} svg - The SVG element
 * @param {string} accessibleName - The accessible name to set
 */
function setSvgAttributes(svg, accessibleName) {
  if (!svg) return;
  
  if (!svg.querySelector('title')) {
    const title = document.createElement('title');
    title.textContent = accessibleName;
    svg.insertBefore(title, svg.firstChild);
  }
  
  svg.setAttribute('role', 'img');
  if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
    svg.setAttribute('aria-label', accessibleName);
  }
}

/**
 * Ensures all landmarks have unique identifiers
 * @returns {Array} Array of issues found
 */
function ensureUniqueLandmarks() {
  const issues = [];
  const landmarks = getLandmarks();
  const processed = processLandmarks(landmarks);
  const sorted = sortLandmarks(processed);
  
  const ids = new Set();
  
  sorted.forEach(landmark => {
    if (landmark.id) {
      if (ids.has(landmark.id)) {
        issues.push(`Duplicate landmark ID: ${landmark.id}`);
      } else {
        ids.add(landmark.id);
      }
    }
  });
  
  return issues;
}

/**
 * Handles fake links (elements that look like links but aren't)
 * @returns {Array} Array of fake links found
 */
function handleFakeLinks() {
  const fakeLinks = [];
  const clickableElements = document.querySelectorAll('[onclick], [role="button"]');
  
  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    if (tagName !== 'a' && tagName !== 'button') {
      if (!element.hasAttribute('role')) {
        element.setAttribute('role', 'button');
      }
      if (!element.textContent && !element.getAttribute('aria-label')) {
        fakeLinks.push({
          element,
          issue: 'Fake link has no accessible name'
        });
      }
    }
  });
  
  return fakeLinks;
}

async function renderFunction1() {
  // ... (combine the logic from both changes)
}

async function renderFunction2() {
  // ... (combine the logic from both changes)
}

module.exports = {
  getDependencyGraph,
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  getLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  handleFakeLinks,
  accessiblyHelper,
  getUserSafetyAdvice,
  generateAccessibilityReport,
  renderFunction1,
  renderFunction2,
};