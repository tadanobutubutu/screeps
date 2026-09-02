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

// Existing code that needs to be preserved

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

// New functions to address the listed issues
function addLangAttribute(element) {
  if (element && typeof element.setAttribute === 'function') {
    element.setAttribute('lang', 'en');
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

  return count;
}

function addDocumentLang(document, lang = 'en') {
  if (document && document.documentElement) {
    const htmlElement = document.documentElement;
    if (!htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', lang);
      return 1;
    }
  }
  return 0;
}

function checkLinkAndButtonAccessibility(document) {
  const links = document.querySelectorAll('a, button, [role="button"]');
  const issues = {
    linksWithoutText: [],
    buttonsWithoutText: [],
    linksWithoutAriaLabel: [],
    buttonsWithoutAriaLabel: []
  };

  links.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isLink = tagName === 'a';
    const isButton = tagName === 'button' || element.getAttribute('role') === 'button';

    if (isLink || isButton) {
      // Check for accessible text (text content or aria-label or title)
      const hasTextContent = element.textContent.trim().length > 0;
      const hasAriaLabel = element.hasAttribute('aria-label');
      const hasTitle = element.hasAttribute('title');

      const accessibleName = hasTextContent || hasAriaLabel || hasTitle;

      if (!accessibleName) {
        if (isLink) {
          issues.linksWithoutText.push(element);
        } else {
          issues.buttonsWithoutText.push(element);
        }
      }

      if (!hasAriaLabel && !(hasTextContent || hasTitle)) {
        if (isLink) {
          issues.linksWithoutAriaLabel.push(element);
        } else {
          issues.buttonsWithoutAriaLabel.push(element);
        }
      }
    }
  });

  return issues;
}

// Add the lang attribute to the HTML element with the getLangAttribute() function
addLangAttribute(getLangAttribute());

function getLangAttribute() {
  // If the language is not explicitly set, determine the language based on the content
  // Replace 'yourContentVariable' with the actual variable storing the content
  let lang = 'en'; // Default to English

  // Your code for detecting the language based on the content

  if (container && container.setAttribute) {
    if (!container.getAttribute('role')) {
      container.setAttribute('role', 'img');
    }
    if (!container.getAttribute('aria-label')) {
      container.setAttribute('aria-label', 'Dependency graph');
    }
  }

  return container;
}

// Add the lang attribute to the HTML element with the getLangAttribute() function
addDocumentLang(getLangAttribute());

// Process accessibility report issues
const report = accessibilityReport.issues.map(issue => ({
  issueType: issue.type,
  status: issue.status || 'pending',
  fixApplied: issue.fixApplied || ''
}));

// Address all accessibility issues
function addressAccessibilityIssues() {
  getLangAttribute();
  addLangAttribute(typeof document !== 'undefined' ? (document.documentElement || document.body) : null);

  if (typeof landmarks !== 'undefined' && Array.isArray(landmarks)) {
    ensureLandmarkUniqueness(landmarks);
  }
  ensureUniqueLandmarks();

  validateTableAccessibility();
  validateTableStructure();

  getSvgAccessibleName();

  createInPageButton();
  createAccessibleLink();
  handleAccessibilityIssues();

  validateLandmark();
  validateLandmarkStructure();
}

// Initialize app
function initializeApp() {
  addressAccessibilityIssues();
  if (typeof wrapPrimaryContentInMain === 'function') {
    wrapPrimaryContentInMain();
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