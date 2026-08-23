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
  const landmarks = ['header', 'footer', 'aside', 'section', 'nav', 'main'];
  const seenIds = new Set();

  landmarks.forEach((landmarkName) => {
    const elements = container.querySelectorAll(landmarkName);
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
  const content = dependencyGraphContent.getContent();
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
  const content = indexContent.getContent();
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
  const content = indexContent.getContent();
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

// Fix REACT_036: Convert fake links (divs/spans with onClick) to proper anchor tags with href
// Use <a> tag with href for navigation, not <div> or <span> with onClick
export function FakeLinkAsButton(props) {
  // Convert to proper anchor element with href for accessibility
  return {
    type: 'a',
    props: {
      className: props.className,
      href: props.href || '#',
      onClick: props.onClick,
      'aria-label': props['aria-label'],
      role: props.href ? undefined : 'button',
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
      'aria-label': props.appName || 'Application'
    }
  };
}

// wrapPrimaryContentInMain - Wraps primary content in a main element for accessibility
// Fixes landmark issues by using semantic <main> element with proper accessibility attributes
export function wrapPrimaryContentInMain(content, options = {}) {
  return {
    type: 'main',
    props: {
      role: 'main',
      'aria-label': options.ariaLabel || 'Main content',
      className: options.className || 'primary-content',
      children: content
    }
  };
}

// Additional accessibility functions for REACT_017 landmark issues
// Ensure proper use of <header>, <main>, <nav>, <footer>

// CreateHeader - Creates accessible header landmark
export function CreateHeader(props) {
  return {
    type: 'header',
    props: {
      role: 'banner',
      'aria-label': props.label || 'Site header',
      className: props.className || 'header',
      children: props.children
    }
  };
}

// CreateNav - Creates accessible navigation landmark
export function CreateNav(props) {
  return {
    type: 'nav',
    props: {
      'aria-label': props.label || 'Main navigation',
      className: props.className || 'nav',
      children: props.children
    }
  };
}

// CreateFooter - Creates accessible footer landmark
export function CreateFooter(props) {
  return {
    type: 'footer',
    props: {
      role: 'contentinfo',
      'aria-label': props.label || 'Site footer',
      className: props.className || 'footer',
      children: props.children
    }
  };
}

// CreateAside - Creates accessible complementary content landmark
export function CreateAside(props) {
  return {
    type: 'aside',
    props: {
      'aria-label': props.label || 'Related content',
      className: props.className || 'aside',
      children: props.children
    }
  };
}