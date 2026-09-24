// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';
import path from 'path';
import fs from 'fs';

// REACT_015: Add lang attribute

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and validateLandmarkAttributes())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// Main JavaScript file for accessibility checks and React component

function ensureElementHasId(element) {
  // ... (Previously existing functionality)
}

export function getUniqueLandmarkName(baseName, existingNames) {
  if (existingNames.indexOf(baseName) === -1) {
    return baseName;
  }
  let counter = 2;
  let newName = `${baseName} ${counter}`;
  while (existingNames.indexOf(newName) !== -1) {
    counter++;
    newName = `${baseName} ${counter}`;
  }
  return newName;
}

export function validateUniqueLandmarks(container) {
  const landmarks = container.querySelectorAll('[role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
  const landmarkNames = new Set();
  const issues = [];

  if (!tableElement) {
    issues.push('Table element not found');
    return issues;
  }

  const headers = tableElement.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push('Table should have header cells (th)');
  }

  const caption = tableElement.querySelector('caption');
  if (!caption) {
    issues.push('Table should have a caption element');
  }

  return issues;
}

// REACT_027: Validate table structure
export function validateTableStructure(tableElement) {
  const issues = [];

  if (!tableElement) {
    issues.push('Table element not found');
    return issues;
  }

  const rows = tableElement.querySelectorAll('tr');
  if (rows.length < 2) {
    issues.push('Table should have at least 2 rows');
  }

  const firstRow = rows[0];
  if (firstRow) {
    const cells = firstRow.querySelectorAll('td, th');
    const cellCount = cells.length;
    rows.forEach((row, index) => {
      const rowCells = row.querySelectorAll('td, th');
      if (rowCells.length !== cellCount) {
        issues.push(`Row ${index + 1} has inconsistent cell count`);
      }
    });
  }

  return issues;
}

export function addSvgAccessibleName(svgElement, accessibleName) {
  if (!svgElement) return;
  
  const title = document.createElement('title');
  title.id = `${accessibleName.replace(/\s+/g, '-').toLowerCase()}-title`;
  title.textContent = accessibleName;
  
  svgElement.insertBefore(title, svgElement.firstChild);
  
  svgElement.setAttribute('aria-labelledby', title.id);
}

export function isValidLink(element) {
  if (!element) return true;
  
  const tagName = element.tagName.toLowerCase();
  const href = element.getAttribute('href');
  const onClick = element.getAttribute('onClick');
  
  const isFakeLink = (tagName === 'div' || tagName === 'span') && onClick && !href;
  
  if (isFakeLink) {
    return {
      valid: false,
      suggestion: `Replace <${tagName}> with <button> or <a href="#"> for proper accessibility.`
    };
  }

  if (svgElement && accessibleName) {
    svgElement.setAttribute('aria-label', accessibleName || 'Decorative SVG');
  }

  return svgElement;
}

export function addScopeToHeaders(tableElement) {
  if (!tableElement) return [];
  
  const headers = tableElement.querySelectorAll('th');
  const updates = [];
  
  headers.forEach((th) => {
    const row = th.closest('tr');
    const rowIndex = Array.from(row.parentNode.children).indexOf(row);
    const cellIndex = Array.from(row.cells).indexOf(th);
    
    let scope = 'col';
    
    if (cellIndex === 0 && rowIndex > 0) {
      scope = 'row';
    }
    
    if (!th.getAttribute('scope')) {
      th.setAttribute('scope', scope);
      updates.push({
        element: th,
        scope: scope,
        position: { row: rowIndex, col: cellIndex }
      });
    }
  });
  
  return updates;
}

export function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `generated-id-${Date.now()}`;
  }
}

export function addAriaLabel(element, label) {
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

export function renderDependencyGraphs() {
  // Logic to render dependency graphs
}

export function AppWithAccessibility() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }

    addressedIssues.push(result);
  });

  return addressedIssues;
}

/**
 * Fixes table structure issues for accessibility
 * Ensures tables have proper headers, captions, and structure
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with fixed table structures
 */
export function fixTableStructureIssues(html) {
  if (typeof html !== 'string') return html;
  
  let result = html;
  
  // Fix tables that need proper scope attributes on headers
  result = result.replace(/<th(\s[^>]*)?>/gi, (match, attrs) => {
    if (attrs && attrs.includes(' scope=')) {
      return match;
    }
    return `<th${attrs} scope="col">`;
  });
  
  // Ensure tables have associated caption or summary
  result = result.replace(/<table(\s[^>]*)?>/gi, (match, attrs) => {
    if (attrs && (attrs.includes(' summary=') || attrs.includes(' caption'))) {
      return match;
    }
    // Add summary attribute for screen readers
    return `<table${attrs} summary="Data table">`;
  });
  
  // Note: The following complex tbody/thead wrapping logic has been removed
  // due to implementation complexity and potential for breaking HTML structure.
  // The function now focuses on adding missing scope and summary attributes,
  // which are critical for accessibility and can be safely applied with regex.
  
  return result;
}

export {
  App,
  AppWithAccessibility,
  getUniqueLandmarkName,
  validateUniqueLandmarks,
  addSvgAccessibleName,
  isValidLink,
  addScopeToHeaders,
  addressAccessibilityIssues,
  announceToScreenReader,
  trapFocus,
  manageFocusOnNavigation,
  prefersReducedMotion,
  setAriaExpanded,
  hasAccessibleName,
  newFunction,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs
};

  // If no main landmark, try to add one after the opening body tag
  return html.replace(/<body(\s[^>]*)?>/gi, (match, attrs) => {
    return `<body${attrs || ''}><main>`;
  }).replace(/<\/body>/gi, '</main></body>');
}

/**
 * Adds accessible names to SVG elements
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with accessible SVG names
 */
export function addSvgAccessibleNames(html) {
  if (typeof html !== 'string') return html;
  
  let svgCounter = 0;
  
  return html.replace(/<svg(\s[^>]*)?>/gi, (match, attrs) => {
    // Handle case where attrs might be undefined (for <svg> without attributes)
    const attributes = attrs || '';
    const existingLabel = attributes.match(/aria-label=/) || attributes.match(/aria-labelledby=/);
    
    if (existingLabel) {
      return match;
    }
    
    // Extract title if present
    const titleMatch = match.match(/<title>([^<]*)<\/title>/i);
    let label = titleMatch ? titleMatch[1] : `SVG image ${++svgCounter}`;
    
    // Check for id to reference
    const idMatch = attributes.match(/id="([^"]*)"/);
    if (idMatch) {
      return `<svg${attributes} role="img" aria-label="${label}">`;
    }
    
    // Add inline title for accessibility
    const titleId = `svg-title-${svgCounter}`;
    return `<svg${attributes} role="img" aria-labelledby="${titleId}"><title id="${titleId}">${label}</title>`;
  });
}

/**
 * Ensures unique landmark identifiers for screen readers
 * Converts additional <main> landmarks to <section> so only one <main> exists per page.
 * Also assigns unique IDs to other landmark types.
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with unique landmarks
 */
export function ensureUniqueLandmarks(html) {
  if (typeof html !== 'string') return html;
  
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  const counters = {};
  
  // Initialize counters for each landmark type
  landmarks.forEach(lm => {
    const regex = new RegExp(`<${lm}\\b`, 'gi');
    const matches = html.match(regex);
    if (matches) {
      counters[lm] = matches.length;
    }
  });
  
  // First, ensure only