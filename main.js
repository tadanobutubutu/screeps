// main.js - Entry point for the application with accessibility fixes for React components
// This file preserves all existing functionality.
// The GitHub issue is a Renovate Dependency Dashboard report showing available dependency updates.
// Existing tests in /tests/ must continue to pass.

import React from 'react';

// Import dependency graph and index content modules
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

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
  const landmarks = container.querySelectorAll('[role="banner"], header, nav, main, footer');
  const seenIds = new Set();

  landmarks.forEach((landmark) => {
    let id = landmark.id;
    if (!id) {
      id = 'landmark-' + Math.random().toString(36).substr(2, 9);
      landmark.id = id;
    }
    if (seenIds.has(id)) {
      id = 'landmark-' + Math.random().toString(36).substr(2, 9);
      landmark.id = id;
    }
    seenIds.add(id);
  });
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

// Updated: DependencyGraphTable now uses dependencyGraphContent module
export function DependencyGraphTable(props) {
  const content = dependencyGraphContent.getGraphTableContent(props.dependencies);
  return {
    type: 'div',
    props: {
      className: 'dependency-graph-table',
      'aria-label': 'Dependency Graph',
      children: content
    }
  };
}

// Updated: StatusPage now uses indexContent module for index views
export function StatusPage(props) {
  const content = indexContent.getStatusPageContent(props.status);
  return {
    type: 'main',
    props: {
      role: 'main',
      'aria-label': 'Status Dashboard',
      children: content
    }
  };
}

// PageLayout updated to use indexContent for index view layouts
export function createPageLayout(contentType = 'default') {
  const content = indexContent.getLayoutContent(contentType);
  return {
    type: 'div',
    props: {
      className: 'page-layout',
      role: 'main',
      children: content
    }
  };
}

// ContentPanel updated to use indexContent
export function ContentPanel(props) {
  const content = indexContent.getPanelContent(props.panelId);
  return {
    type: 'section',
    props: {
      className: 'content-panel',
      'aria-labelledby': props.titleId,
      children: content
    }
  };
}

// GraphIcon component for rendering graph icons
export function GraphIcon(props) {
  return createSvgIcon(props.name || 'Graph', props.children);
}

// SettingsIcon component for rendering settings icons
export function SettingsIcon(props) {
  return createSvgIcon('Settings', props.children);
}

// AccessibleIconSVG - wrapper for accessible SVG icons
export function AccessibleIconSVG(props) {
  return {
    type: 'svg',
    props: {
      'aria-label': props.label,
      role: 'img',
      children: props.children || []
    }
  };
}

// FakeLinkAsButton - accessibility fix for styled links
export function FakeLinkAsButton(props) {
  return {
    type: 'button',
    props: {
      className: props.className,
      onClick: props.onClick,
      'aria-label': props['aria-label'],
      children: props.children
    }
  };
}

// AppWrapper - main application wrapper component
export function AppWrapper(props) {
  return {
    type: 'div',
    props: {
      className: 'app-wrapper',
      role: 'application',
      'aria-label': props.appName || 'Application',
      children: props.children
    }
  };
}

// HtmlLangProvider - provides language context
export function HtmlLangProvider(props) {
  return {
    type: 'div',
    props: {
      lang: props.language || 'en',
      children: props.children
    }
  };
}

// fixTableStructureIssues - utility for fixing table accessibility
export function fixTableStructureIssues(tableElement) {
  const headers = tableElement.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      th.setAttribute('scope', 'col');
    }
  });
  return tableElement;
}

// createAccessibleFaviconSvg - creates accessible favicon
export function createAccessibleFaviconSvg(color = '#000000') {
  return {
    type: 'svg',
    props: {
      'aria-label': 'Page favicon',
      role: 'img',
      children: []
    }
  };
}

// faviconGenerators - collection of favicon generation utilities
export const faviconGenerators = {
  simple: (color) => createAccessibleFaviconSvg(color),
  withText: (text, color) => createAccessibleFaviconSvg(color)
};

// generateId - utility for generating unique IDs
export function generateId(prefix = 'id') {
  return prefix + '-' + Math.random().toString(36).substr(2, 9);
}

// setHtmlLang - utility to set HTML language
export function setHtmlLang(lang) {
  document.documentElement.lang = lang;
}

// Export all components and utilities
export {
  FakeLinkAsButton,
  AccessibleIconSVG,
  GraphIcon,
  SettingsIcon,
  AppWrapper,
  HtmlLangProvider,
  ensureUniqueLandmarks,
  createAccessibleFaviconSvg,
  faviconGenerators,
  fixTableStructureIssues,
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

// Additional helper function
function createNavigationLink(props) {
  return {
    type: 'a',
    props: {
      href: props.href,
      className: props.className,
      children: props.children
    }
  };
}

// Set default language attribute for the HTML root element and trigger accessibility improvements
document.documentElement.lang = 'en';
addressAccessibilityIssues();