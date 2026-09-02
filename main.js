import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';

import { axe } from 'axe-core';
import fastMap from 'fast-map';
import path from 'path';

import { greet, add, getDependencies, addDependency, removeDependency, countDependencies, appData, someFunction, validateInput, processData, formatResponse } from './mainAdapted';
import { validateTableAccessibility, validateTableStructure, fixTableStructure, addMainLandmark, validateLandmark, validateLandmarkAttributes, validateLandmarkStructure } from './mainAccessibility';

const fs = require('fs');

const config = {};

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
export function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

/**
 * Adds lang attribute to HTML element
 */
export function addLangAttribute() {
  document.documentElement.setAttribute('lang', getLangAttribute());
}

/**
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
export function validateTableAccessibility(table) {
  if (!table) return false;

  const hasCaption = table.querySelector('caption') !== null;
  const hasHeaders = table.querySelector('thead') !== null || table.querySelector('th') !== null;
  const headers = table.querySelectorAll('th');
  let hasScope = true;
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      hasScope = false;
    }
  });

  return hasCaption && hasHeaders && hasScope;
}

/**
 * Validates table structure
 */
export function validateTableStructure(tableElement) {
  if (!tableElement) return false;

  const rows = tableElement.querySelectorAll('tr');
  let validStructure = true;

  rows.forEach(row => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      validStructure = false;
    }
  });

  return validStructure;
}

/**
 * Fixes table structure issues
 */
export function fixTableStructure() {
  // Implementation to be added
}

/**
 * Adds main landmark to page
 */
export function addMainLandmark() {
  const main = document.querySelector('main') || document.createElement('main');
  if (!main.id) main.id = 'main-content';
  document.body.insertBefore(main, document.body.firstChild);
}

/**
 * Validates landmark accessibility
 */
export function validateLandmark(landmarkElement) {
  if (!landmarkElement) return false;

  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];
  const role = landmarkElement.getAttribute('role');

  return validRoles.includes(role);
}

/**
 * Validates landmark structure
 */
export function validateLandmarkStructure(landmarkElement) {
  if (!landmarkElement) return false;

  const heading = landmarkElement.querySelector('h1, h2, h3, h4, h5, h6');
  return heading !== null;
}

/**
 * Validates landmark attributes
 */
export function validateLandmarkAttributes() {
  // Implementation to be added
}

/**
 * Gets SVG accessible name
 * @returns {string} The accessible name for SVG element
 */
export function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';

  const title = svgElement.querySelector('title');
  const desc = svgElement.querySelector('desc');

  if (title) return title.textContent;
  if (desc) return desc.textContent;

  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }

  if (svgElement.hasAttribute('aria-labelledby')) {
    const id = svgElement.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(id);
    return labelElement ? labelElement.textContent : '';
  }

  return '';
}

/**
 * Sets SVG attributes for accessibility
 */
export function setSvgAttributes(svgElement, name) {
  if (!svgElement || !name) return;

  if (!svgElement.hasAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', name);
  }

  if (!svgElement.hasAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
}

/**
 * Ensures unique landmarks on the page
 */
export function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  const counts = {};
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    counts[role] = (counts[role] || 0) + 1;
  });
  return counts;
}

/**
 * Creates an in-page navigation button
 */
export function createInPageButton() {
  const button = document.createElement('button');
  button.textContent = 'Accessibility Info';
  button.setAttribute('aria-label', 'Show accessibility information');
  document.body.appendChild(button);
}

/**
 * Validates link accessibility
 */
export function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  const issues = [];
  links.forEach(link => {
    if (!link.textContent.trim() && !link.hasAttribute('aria-label')) {
      issues.push({ type: 'empty-link', element: link });
    }
  });
  return issues;
}

/**
 * Handles fake links on the page
 */
export function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('[role="link"]');
  fakeLinks.forEach(link => {
    link.setAttribute('tabindex', '0');
    link.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        link.click();
      }
    });
  });
}

/**
 * Adds proper landmark regions to the page
 */
export function addProperLandmarkRegions() {
  const regions = document.querySelectorAll('section:not([role])');
  regions.forEach((region, index) => {
    if (!region.hasAttribute('aria-label') && !region.querySelector('h1, h2, h3, h4, h5, h6')) {
      region.setAttribute('aria-label', `Section ${index + 1}`);
    }
  });
}

function addressAccessibilityIssues() {
  const rootContainer = document.getElementById('root') ? document.getElementById('root').parentElement : null;
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  const skipLink = document.querySelector('[href^="#"]');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

  document.querySelectorAll('[role="button"]').forEach(function(button) {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });

  const modalElement = document.getElementById('modal');
  if (modalElement && a11y && a11y.trapFocus) {
    a11y.trapFocus(modalElement);
  }
  if (a11y && a11y.announce) {
    a11y.announce('Welcome to the bot!', 'assertive');
  }

  const imageElement = document.getElementById('example-image');
  if (imageElement) {
    imageElement.setAttribute('alt', 'A description of the image');
  }

  const divElement = document.getElementById('example-div');
  if (divElement) {
    divElement.setAttribute('role', 'list');
  }

  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

function importAndExecute(modulePath, functionName, callback) {
  require(modulePath)[functionName](callback);
}

function renderIndexView() {
  const dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'region');
    dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
  }
}

function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

const initialize = () => {
  addMainLandmark();
};

if (require.main === module) {
  initialize();
}

export {
  greet,
  add,
  getDependencies,
  addDependency,
  removeDependency,
  countDependencies,
  appData,
  someFunction,
  validateInput,
  processData,
  formatResponse,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkAttributes,
  validateLandmarkStructure,
  initialize
};

module.exports = {
  generateAccessibilityReport: async function () {
    const report = await scanAccessibility();
    writeReport(report);
  },
  addressAccessibilityIssues,
  getLangAttribute,
  createInPageButton,
  a11y,
  importAndExecute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  renderIndexView
};

function finalInitialize() {
  const dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'region');
    dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
  }

  addressAccessibilityIssues();

  createInPageButton();

  if (a11y && a11y.init) {
    a11y.init();
  }

  renderIndexView();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', finalInitialize);
  } else {
    finalInitialize();
  }
}