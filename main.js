const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec } = require('child_process');
const app = express();
const { createServer, startApp, config } = require('./');

const port = PORT || 3000;

// New function for getting the language attribute based on the content
function getLangAttribute() {
  // If the language is not explicitly set, determine the language based on the content
  // Replace 'yourContentVariable' with the actual variable storing the content
  let lang = 'en'; // Default to English

  // Your code for detecting the language based on the content

  return lang;
}

// New function for validating table accessibility
function validateTableAccessibility(table) {
  // Check 26 table structure issues
  // Your code for validating the table accessibility
}

// New function for validating table structure
function validateTableStructure(table) {
  // Check the table structure and return a boolean value indicating the result
  // Your code for validating the table structure

  return true; // Set the default value to true
}

// New function for ensuring unique landmarks
function ensureUniqueLandmarks() {
  // Check for 2 unique landmarks issues and resolve them
  // Your code for ensuring unique landmarks
}

// personName() should handle REACT_036: Fix 1 fake link issue
function personName(name) {
  // Handle REACT_036: Fix 1 fake link issue
  if (!name) return '';

  // Create a proper anchor element instead of a fake link
  const link = document.createElement('a');
  link.href = `#person-${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`;
  link.textContent = name;
  link.className = 'person-link';

  // Return the anchor element if in browser context
  if (typeof document !== 'undefined') {
    return link;
  }

  // Fallback for non-browser environments
  return `<a href="#person-${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}" class="person-link">${name}</a>`;
}

// createInPageButton() should help handle REACT_036: Fix 1 fake link issue
function createInPageButton(text) {
  // Handle REACT_036: Fix 1 fake link issue
  if (!text) return null;

  // Create a proper anchor element for in-page navigation
  const button = document.createElement('a');
  button.href = '#';
  button.textContent = text;
  button.className = 'in-page-button';
  button.setAttribute('role', 'button');

  // Return the anchor element if in browser context
  if (typeof document !== 'undefined') {
    return button;
  }

  // Fallback for non-browser environments
  return `<a href="#" class="in-page-button" role="button">${text}</a>`;
}

function validateLandmark(element) {
  if (!element) return false;

  const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  const role = element.getAttribute('role');
  const tagName = element.tagName ? element.tagName.toLowerCase() : '';

  // Check if element has a valid landmark role or is a landmark element
  if (role && validLandmarks.includes(role.toLowerCase())) {
    return true;
  }

  // Check common landmark elements
  const landmarkElements = ['header', 'nav', 'main', 'aside', 'footer'];
  if (landmarkElements.includes(tagName)) {
    return true;
  }

  return false;
}

function addSvgAccessibleName(svgElement, name) {
  if (!svgElement || !name) return svgElement;

  let title = svgElement.querySelector('title');
  if (!title) {
    title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    svgElement.insertBefore(title, svgElement.firstChild);
  }
  title.textContent = name;

  const ariaLabelledBy = svgElement.getAttribute('aria-labelledby');
  if (!ariaLabelledBy) {
    title.id = `svg-title-${Math.random().toString(36).substring(2, 9)}`;
    svgElement.setAttribute('aria-labelledby', title.id);
  }

  return svgElement;
}

function ensureElementHasId(element) {
  if (!element) return;

  const name = element.getAttribute('id');
  if (!name) {
    element.id = `element-${Math.random().toString(36).substring(2, 11)}`;
  }
}

const AddressabilityIssues = {
  MISSING_ID: 'missing-id',
  MISSING_ARIA_LABEL: 'missing-aria-label',
  MISSING_ROLE: 'missing-role',
  MISSING_ALT: 'missing-alt',
  MISSING_HEADING: 'missing-heading',
  EMPTY_CONTENT: 'empty-content',
  FAKE_LINK: 'fake-link',

  detectIssues: function(insightReport) {
    if (!insightReport || !insightReport.sections) {
      return [];
    }

    const issues = [];

    insightReport.sections.forEach((section, index) => {
      if (!section.heading) {
        issues.push({
          type: 'missing-heading',
          severity: 'high',
          message: `Section ${index} is missing a heading`,
          suggestedFix: 'Add a descriptive heading to each section'
        });
      }

      if (!section.content || section.content.trim() === '') {
        issues.push({
          type: 'empty-content',
          severity: 'medium',
          message: `Section ${index} has no content`,
          suggestedFix: 'Add meaningful content to the section'
        });
      }

      if (section.content && section.content.includes('click here')) {
        issues.push({
          type: 'inaccessible-link-text',
          severity: 'low',
          message: `Section ${index} contains "click here" text which is not accessible`,
          suggestedFix: 'Use descriptive link text instead of "click here"'
        });
      }
    });

    return issues;
  },

  checkFakeLinks: function(elements) {
    const fakeLinkIssues = [];
    if (!elements || !Array.isArray(elements)) {
      return fakeLinkIssues;
    }

    elements.forEach((element, index) => {
      const tagName = element.tagName ? element.tagName.toLowerCase() : '';
      const role = element.getAttribute('role');
      const href = element.getAttribute('href');
      const onClick = element.getAttribute('onclick');

      // Check for fake links (elements that look like links but aren't proper anchors)
      if ((tagName === 'span' || tagName === 'div' || tagName === 'button') &&
          (role === 'link' || role === 'button') &&
          !href && !onClick) {
        fakeLinkIssues.push({
          type: 'fake-link',
          severity: 'high',
          index: index,
          message: `Element at index ${index} has role="${role}" but is not a proper link or button`,
          suggestedFix: 'Use an <a> element with href attribute or a <button> element'
        });
      }
    });

    return fakeLinkIssues;
  }
};

function processSvgElements() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    if (!svg.getAttribute('aria-labelledby') && !svg.querySelector('title')) {
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = 'SVG Image';
      title.id = `svg-title-${Math.random().toString(36).substring(2, 9)}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
}

// Function for addressing accessibility issues from insight report
function addressAccessibilityIssues(insightReport) {
  // If no report provided, return an empty array
  if (!insightReport || !Array.isArray(insightReport)) {
    return [];
  }

  // Process each insight item to improve accessibility
  return insightReport.map((item) => {
    // Ensure the item has an accessible label
    const label = item.description || '';
    if (label && !item.ariaLabel) {
      item.ariaLabel = label;
    }

    // If the item represents an image, add alt text
    if (typeof item.image === 'string') {
      item.altText = item.image;
    }

    // Mark the item as accessible
    item.accessible = true;

    return item;
  });
}

// Add the lang attribute to the HTML element with the getLangAttribute() function
if (typeof document !== 'undefined') {
  document.documentElement.lang = getLangAttribute();
}

// Helper function to validate and fix fake links
function fixFakeLinks(container) {
  if (!container) return;

  const elements = container.querySelectorAll('[role="link"]');
  elements.forEach(element => {
    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    if (tagName !== 'a') {
      // Convert to proper anchor element
      const anchor = document.createElement('a');
      anchor.href = element.getAttribute('data-href') || '#';
      anchor.textContent = element.textContent;
      anchor.className = element.className;
      anchor.onclick = element.onclick;
      element.parentNode.replaceChild(anchor, element);
    }
  });
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd

// Additional helper functions for accessibility
function ensureValidLink(element) {
  if (!element) return false;

  const tagName = element.tagName ? element.tagName.toLowerCase() : '';

  // A valid link must be an <a> element with href attribute
  if (tagName === 'a') {
    const href = element.getAttribute('href');
    return href !== null && href !== undefined && href !== '';
  }

  return false;
}

function createAccessibleLink(text, href, options = {}) {
  if (!text) return null;

  const link = document.createElement('a');
  link.href = href || '#';
  link.textContent = text;

  if (options.className) {
    link.className = options.className;
  }

  if (options.id) {
    link.id = options.id;
  }

  if (options.title) {
    link.title = options.title;
  }

  if (options.onClick) {
    link.onclick = options.onClick;
  }

  return link;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createServer,
    startApp,
    config,
    validateLandmark,
    getLangAttribute,
    addSvgAccessibleName,
    ensureElementHasId,
    AddressabilityIssues,
    addressAccessibilityIssues,
    fixFakeLinks,
    ensureValidLink,
    createAccessibleLink,
    personName,
    createInPageButton,
    processSvgElements
  };
} else {
  startApp();
}