// main.js - Entry point for the application with accessibility fixes for React components
// This file preserves all existing functionality.
// The GitHub issue is a Renovate Dependency Dashboard report showing available dependency updates.
// Existing tests in /tests/ must continue to pass.

import React from 'react';

// Fix REACT_015: Add proper lang attribute to HTML element
export function createHtmlElement(language = 'en') {
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
export function createPageLayout(children) {
  return {
    type: 'div',
    props: {
      children: [
        {
          type: 'header',
          props: {
            role: 'banner',
            children: children.header || []
          }
        },
        {
          type: 'nav',
          props: {
            'aria-label': 'Main navigation', // Unique landmark label
            children: children.nav || []
          }
        },
        {
          type: 'main',
          props: {
            role: 'main',
            'aria-label': 'Main content', // Unique landmark label
            children: children.main || []
          }
        },
        {
          type: 'footer',
          props: {
            role: 'contentinfo',
            children: children.footer || []
          }
        }
      ]
    }
  };
}

// Fix REACT_036: Use real <a> elements instead of fake links
export function createNavigationLink(href, children) {
  return {
    type: 'a',
    props: {
      href: href, // Real href attribute makes it a proper link
      children: children
    }
  };
}

// Ensure unique landmarks across the application
export function ensureUniqueLandmarks(container) {
  const landmarks = container.querySelectorAll('[role="main"], [role="contentinfo"], header, nav, main, footer');
  const seenIds = new Set();
  
  landmarks.forEach((landmark) => {
    let id = landmark.id;
    if (!id) {
      id = 'landmark-' + Math.random().toString(36).substring(2, 9);
      landmark.id = id;
    }
    if (seenIds.has(id)) {
      id = 'landmark-' + Math.random().toString(36).substring(2, 9);
      landmark.id = id;
    }
    seenIds.add(id);
  });
};

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
  // Address accessibility issues from insight report:
  // - REACT_015: Add lang attribute to HTML element
  // - REACT_017: Add/fix 4 landmark issues
  // - REACT_041: Add accessible names to 2 SVGs (handled elsewhere)
  // - REACT_025: Ensure unique landmarks (2 issues)
  // - REACT_036: Fix 1 fake link issue (handled elsewhere)

  // Add lang attribute to HTML element
  document.documentElement.lang = 'en';

  // Enhance focus visibility for keyboard navigation
  enhanceFocusVisibility();

  // Ensure unique landmarks (pass document as container)
  ensureUniqueLandmarks(document);
};

const setLanguageAttribute = function(lang) {
  // Assuming the document object is available in the global scope
  document.documentElement.lang = lang;
};

const calculateAverage = function(numbers) {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

// Export all components and utilities
export { 
  FakeLinkAsButton,
  DependencyGraphTable,
  AccessibleIconSVG,
  GraphIcon,
  SettingsIcon,
  AppWrapper,
  HtmlLangProvider,
  PageLayout,
  fixTableStructureIssues,
  ensureUniqueLandmarks,
  createAccessibleFaviconSvg,
  faviconGenerators,
  StatusPage,
  ContentPanel,
  generateId,
  setHtmlLang,
  setLanguageAttribute,
  calculateAverage,
  addressAccessibilityIssues,
  enhanceFocusVisibility
};

export default {
  createHtmlElement,
  createTable,
  createSvgIcon,
  createPageLayout,
  createNavigationLink
};

// Set default language attribute for the HTML root element and trigger accessibility improvements
document.documentElement.lang = 'en';
addressAccessibilityIssues();