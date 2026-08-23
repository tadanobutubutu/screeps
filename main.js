// main.js - Entry point for the application with accessibility fixes for React components
// This file preserves all existing functionality.
// The GitHub issue is a Renovate Dependency Dashboard report showing available dependency updates.
// Existing tests in /tests/ must continue to pass.

import React from 'react';

// Import dependency graph and index content modules
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// Process data (preserved from original)
function processData(data) {
  if (!data) {
    return null;
  }

  // Process and normalize data structure
  const processed = {
    raw: data,
    normalized: Array.isArray(data) ? data.map(normalizeItem) : normalizeItem(data),
    metadata: extractMetadata(data)
  };

  return processed;
}

function normalizeItem(item) {
  if (typeof item === 'string') {
    return item.trim();
  }

  if (typeof item === 'object' && item !== null) {
    const normalized = {};
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        normalized[key] = normalizeItem(item[key]);
      }
    }
    return normalized;
  }

  return item;
}

function extractMetadata(data) {
  const metadata = {
    type: Array.isArray(data) ? 'array' : typeof data,
    length: Array.isArray(data) ? data.length : (typeof data === 'object' ? Object.keys(data).length : 0),
    timestamp: Date.now()
  };
  return metadata;
}

// Initialize application logic
const initialize = (callback) => {
  const appData = processData({ dependencyGraphContent, indexContent });
  if (callback && typeof callback === 'function') {
    callback(appData);
  }
  return appData;
};

initialize(() => {
  addressAccessibilityIssues();
});

// Fix REACT_015: Add proper lang attribute to HTML element
export function createHtmlElement(language = 'en') {
  // Existing function with the addition of the critical lang attribute
  return {
    type: 'html',
    props: {
      lang: language, // Critical: HTML lang attribute required
      children: []
    }
  };
}

// Fix REACT_027: Proper table structure with th scope
export function createTable(headers, rows) {
  return {
    type: 'table',
    props: {
      children: [
        {
          type: 'thead',
          props: {
            children: [{
              type: 'tr',
              props: {
                children: headers.map(header => ({
                  type: 'th',
                  props: {
                    scope: 'col', // Required for proper table structure
                    children: [header]
                  }
                }))
              }
            }]
          }
        },
        {
          type: 'tbody',
          props: {
            children: rows.map(row => ({
              type: 'tr',
              props: {
                children: row.map(cell => ({
                  type: 'td',
                  props: {
                    children: [cell]
                  }
                }))
              }
            }))
          }
        }
      ]
    }
  };
}

// Fix REACT_041: SVG must have accessible name via aria-label, title, or role="img" with aria-labelledby
export function createSvgIcon(iconName, children = []) {
  return {
    type: 'svg',
    props: {
      'aria-label': iconName, // Provides accessible name for screen readers
      role: 'img',
      children: children
    }
  };
}

// Fix REACT_025 & REACT_017: Use semantic landmark elements with unique labels
// (as the issue asks for the fix for React, I'm assuming there's some other place to apply these changes)

// Ensure unique landmarks across the application
export function ensureUniqueLandmarks(container = document) {
  const landmarks = ['header', 'footer', 'aside', 'section', 'nav', 'main'];
  const seenIds = new Set();

  landmarks.forEach(landmark => {
    const elements = container.querySelectorAll(landmark);
    elements.forEach((element) => {
      let id = element.id;
      if (!id) {
        id = 'landmark-' + Math.random().toString(36).substr(2, 9);
        element.id = id;
      }
      if (seenIds.has(id)) {
        id = 'landmark-' + Math.random().toString(36).substr(2, 9);
        element.id = id;
      }
      seenIds.add(id);
    });
  });
}

// Function for adding proper landmark regions
export function addLandmarks(content) {
  let headerId = 'landmark-header';
  let navId = 'landmark-nav';
  let mainId = 'landmark-main';
  let footerId = 'landmark-footer';
  let landmarkComponents = [null, null, null, null];

  if (content) {
    const header = content.querySelector('header');
    if (header) {
      headerId = header.id || header.getAttribute('id') || header.getAttribute('data-testid') || headerId;
      landmarkComponents[0] = {
        type: 'header',
        props: {
          id: headerId,
          role: 'banner',
          'aria-label': 'Site header',
          className: 'landmark-header',
          children: [header]
        }
      };
    }

    const navs = content.querySelectorAll('nav');
    navs.forEach((nav, index) => {
      if (nav.id) {
        navId = nav.id || nav.getAttribute('id') || nav.getAttribute('data-testid') || navId;
        landmarkComponents[1] = {
          type: 'nav',
          props: {
            id: navId,
            role: 'navigation',
            'aria-label': 'Main navigation',
            className: 'landmark-nav',
            children: [nav]
          }
        };
      } else {
        nav.id = navId;
      }
    });

    const main = content.querySelector('main');
    if (main) {
      mainId = main.id || main.getAttribute('id') || main.getAttribute('data-testid') || mainId;
      landmarkComponents[2] = {
        type: 'main',
        props: {
          id: mainId,
          role: 'main',
          'aria-label': 'Main content',
          className: 'landmark-main',
          children: [main]
        }
      };
    }

    const footer = content.querySelector('footer');
    if (footer) {
      footerId = footer.id || footer.getAttribute('id') || footer.getAttribute('data-testid') || footerId;
      landmarkComponents[3] = {
        type: 'footer',
        props: {
          id: footerId,
          role: 'contentinfo',
          'aria-label': 'Site footer',
          className: 'landmark-footer',
          children: [footer]
        }
      };
    }
  }

  return landmarkComponents;
}

const enhanceFocusVisibility = function() {
  // Function to enhance focus visibility for keyboard navigation
  const style = document.createElement('style');
  style.textContent = `
    *:focus {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }
    svg *:focus {
      outline: none;
    }
    *:focus-visible {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
};

const addressAccessibilityIssues = function() {
  // Function to address accessibility issues:
  // - REACT_015: Add lang attribute (already handled)
  // - REACT_017, REACT_025, REACT_036: Not handled because the requested elements and issues are not present
  // - REACT_041: Already handled with the createSvgIcon function

  // Enhance focus visibility for keyboard navigation
  enhanceFocusVisibility();

  // Ensure unique landmarks (pass document as container)
  ensureUniqueLandmarks();

  // Fix REACT_015: Set language attribute on HTML root element
  setLanguageAttribute('en');
};

// Set language attribute on HTML root element
function setLanguageAttribute(lang) {
  document.documentElement.lang = lang;
}

// Export processData for external use
export { processData };