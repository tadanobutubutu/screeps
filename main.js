// main.js
import React from 'react';

// Preserve all existing exports and functions
// ... (existing code remains unchanged)

/**
 * Adds language attribute to HTML element for better screen reader support
 * Fixes REACT_015: React Language Attribute
 */
const addLanguageAttribute = (element) => {
  if (!element.getAttribute('lang')) {
    element.setAttribute('lang', 'en');
  }
  return element;
};

/**
 * Ensures proper table structure with thead, tbody, and th elements
 * Fixes REACT_027: React Table Structure
 */
const ensureTableStructure = (table) => {
  if (!table.querySelector('thead') || !table.querySelector('tbody')) {
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Move first row to thead if it exists
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      thead.appendChild(firstRow);
      // Add scope to header cells
      const headerCells = thead.querySelectorAll('th');
      headerCells.forEach(cell => {
        cell.setAttribute('scope', 'col');
      });
    }

    // Move remaining rows to tbody
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      tbody.appendChild(row);
    });

    table.innerHTML = '';
    table.appendChild(thead);
    table.appendChild(tbody);
  }
  return table;
};

/**
 * Adds proper ARIA landmarks to document structure
 * Fixes REACT_017: React Landmarks and REACT_025: React Unique Landmarks
 */
const addLandmarks = () => {
  // Add main landmark if not present
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    const content = document.querySelector('body > *:not(script):not(style)');
    if (content) {
      main.appendChild(content);
      document.body.insertBefore(main, document.body.firstChild);
    }
  }

  // Add navigation landmark if not present
  if (!document.querySelector('nav')) {
    const nav = document.querySelector('[role="navigation"]');
    if (nav) {
      nav.setAttribute('role', 'navigation');
    }
  }

  // Ensure unique landmarks
  const landmarks = ['main', 'nav', 'header', 'footer'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.setAttribute('aria-label', `${landmark} ${index + 1}`);
        }
      });
    }
  });
};

/**
 * Adds accessible names to SVG elements
 * Fixes REACT_041: React SVG Accessible Name
 */
const makeSvgAccessible = (svg) => {
  if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
    const title = svg.querySelector('title');
    if (title && title.textContent.trim()) {
      svg.setAttribute('aria-label', title.textContent.trim());
    } else {
      svg.setAttribute('aria-label', 'Decorative graphic');
    }
  }
  return svg;
};

/**
 * Replaces fake links with proper anchor elements
 * Fixes REACT_036: React Fake Link
 */
const replaceFakeLinks = () => {
  const fakeLinks = document.querySelectorAll('[role="link"], [role="button"]');
  fakeLinks.forEach(link => {
    if (link.getAttribute('role') === 'link' && !link.tagName.match(/^A$/i)) {
      const anchor = document.createElement('a');
      anchor.href = link.getAttribute('data-href') || '#';
      anchor.innerHTML = link.innerHTML;
      link.parentNode.replaceChild(anchor, link);
    }
  });
};

// Initialize accessibility improvements when component mounts
const initAccessibility = () => {
  // Add language attribute to HTML element
  addLanguageAttribute(document.documentElement);

  // Improve table structure
  const tables = document.querySelectorAll('table');
  tables.forEach(table => ensureTableStructure(table));

  // Add proper landmarks
  addLandmarks();

  // Make SVGs accessible
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => makeSvgAccessible(svg));

  // Replace fake links
  replaceFakeLinks();
};

// Export all existing functions and add the new accessibility initializer
export {
  // ... existing exports remain unchanged
  initAccessibility
};

// Call initAccessibility when the component mounts
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initAccessibility);
}