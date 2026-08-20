// main.js - Helper utilities for accessibility fixes

/**
 * Checks if the given JSX/TSX content has a <main> landmark
 * @param {string} content - File content to check
 * @returns {boolean} - True if <main> landmark exists
 */
function hasMainLandmark(content) {
  const mainRegex = /<main[\s>]/gi;
  return mainRegex.test(content);
}

/**
 * Wraps children in a <main> landmark
 * @param {string} content - File content to modify
 * @param {string} childrenTag - The tag containing main children (e.g., 'body', 'div')
 * @returns {string} - Modified content with <main> landmark
 */
function addMainLandmark(content, childrenTag = 'children') {
  // Pattern to find <body>{children}</body> or <div>{children}</div>
  const bodyPattern = /<(\w+)>\s*\{(\w+)\}\s*<\/\1>/g;
  
  return content.replace(bodyPattern, (match, tag, children) => {
    if (tag === 'body' || tag === 'div' || tag === 'section') {
      return `<${tag}>\n    <main>\n        {${children}}\n    </main>\n</${tag}>`;
    }
    return match;
  });
}

/**
 * Escapes HTML entities in a string
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeHtml(str) {
  const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, char => htmlEscapeMap[char]);
}

// Export utilities for testing
module.exports = {
  hasMainLandmark,
  addMainLandmark,
  escapeHtml
};

// REACT_015: React Language Attribute
// Add lang attribute to root element if missing
if (typeof window !== 'undefined') {
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en'); // Default to English
  }
}

// REACT_027: React Table Structure
// Ensure tables have proper structure with <thead>, <tbody>, and <th> elements
function ensureTableStructure(table) {
  if (!table.querySelector('thead') || !table.querySelector('tbody')) {
    const rows = table.querySelectorAll('tr');
    if (rows.length > 0) {
      const thead = document.createElement('thead');
      thead.appendChild(rows[0]);
      table.insertBefore(thead, table.firstChild);

      const tbody = document.createElement('tbody');
      while (rows.length > 0) {
        tbody.appendChild(rows[0]);
      }
      table.appendChild(tbody);
    }
  }

  // Ensure first row has <th> elements
  const firstRow = table.querySelector('thead tr');
  if (firstRow) {
    const cells = firstRow.querySelectorAll('td');
    cells.forEach(cell => {
      const th = document.createElement('th');
      th.textContent = cell.textContent;
      cell.replaceWith(th);
    });
  }
}

// REACT_017: React Landmarks
// Add proper ARIA landmarks
function addLandmarks() {
  const main = document.querySelector('main');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }

  const header = document.querySelector('header');
  if (header && !header.hasAttribute('role')) {
    header.setAttribute('role', 'banner');
  }

  const footer = document.querySelector('footer');
  if (footer && !footer.hasAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
}

// REACT_041: React SVG Accessible Name
// Add title/desc to SVGs if missing
function ensureSVGAccessibility() {
  document.querySelectorAll('svg').forEach(svg => {
    if (!svg.querySelector('title') && !svg.querySelector('desc')) {
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = 'Graphic';
      svg.insertBefore(title, svg.firstChild);
    }
  });
}

// REACT_025: React Unique Landmarks
// Ensure landmarks are unique
function ensureUniqueLandmarks() {
  const landmarks = {
    'banner': 0,
    'main': 0,
    'contentinfo': 0,
    'navigation': 0,
    'search': 0
  };

  document.querySelectorAll('[role]').forEach(element => {
    const role = element.getAttribute('role');
    if (landmarks[role] !== undefined) {
      landmarks[role]++;
      if (landmarks[role] > 1) {
        console.warn(`Multiple ${role} landmarks found. Only one should exist.`);
      }
    }
  });
}

// REACT_036: React Fake Link
// Replace fake links with proper <a> elements
function replaceFakeLinks() {
  document.querySelectorAll('[role="link"]').forEach(element => {
    if (element.tagName.toLowerCase() !== 'a') {
      const link = document.createElement('a');
      link.href = element.getAttribute('href') || '#';
      link.textContent = element.textContent;
      element.replaceWith(link);
    }
  });
}

// Initialize accessibility improvements when DOM is loaded
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Run all accessibility improvements
    ensureTableStructure(document.querySelector('table'));
    addLandmarks();
    ensureSVGAccessibility();
    ensureUniqueLandmarks();
    replaceFakeLinks();
  });
}

// [Rest of existing code remains unchanged]

import React, { useState, useEffect } from 'react';