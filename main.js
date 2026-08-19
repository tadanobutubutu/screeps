// main.js
import React from 'react';

// Existing exports and functions should remain unchanged
// Only adding new accessibility-related functions or modifications

/**
 * Adds language attribute to the HTML element for better screen reader support
 * Fixes REACT_015: React Language Attribute
 */
export const addLanguageAttribute = () => {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en'); // Default to English
  }
};

/**
 * Ensures proper table structure with thead, tbody, and scope attributes
 * Fixes REACT_027: React Table Structure
 */
export const enhanceTableAccessibility = (tableId) => {
  const table = document.getElementById(tableId);
  if (!table) return;

  // Add scope attributes to headers
  const headers = table.querySelectorAll('th');
  headers.forEach((header, index) => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });

  // Ensure proper table structure
  if (!table.querySelector('thead') && table.querySelector('th')) {
    const thead = document.createElement('thead');
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
    }
  }

  if (!table.querySelector('tbody') && table.querySelector('tr:not(:first-child)')) {
    const tbody = document.createElement('tbody');
    const rows = table.querySelectorAll('tr:not(:first-child)');
    rows.forEach(row => tbody.appendChild(row));
    table.appendChild(tbody);
  }
};

/**
 * Adds ARIA landmarks to improve screen reader navigation
 * Fixes REACT_017: React Landmarks
 */
export const addLandmarks = () => {
  // Add main landmark if not present
  if (!document.querySelector('main[role="main"]')) {
    const mainContent = document.querySelector('main') || document.querySelector('div[role="main"]');
    if (mainContent) {
      mainContent.setAttribute('role', 'main');
    }
  }

  // Add navigation landmark if not present
  if (!document.querySelector('nav[role="navigation"]')) {
    const nav = document.querySelector('nav');
    if (nav) {
      nav.setAttribute('role', 'navigation');
    }
  }
};

/**
 * Ensures SVGs have accessible names
 * Fixes REACT_041: React SVG Accessible Name
 */
export const makeSvgAccessible = (svgId, title) => {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  // Add title element if missing
  if (!svg.querySelector('title')) {
    const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    titleElement.textContent = title;
    svg.insertBefore(titleElement, svg.firstChild);
  }

  // Add ARIA label if missing
  if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
    svg.setAttribute('aria-label', title);
  }
};

/**
 * Ensures unique landmarks for better screen reader navigation
 * Fixes REACT_025: React Unique Landmarks
 */
export const ensureUniqueLandmarks = () => {
  const landmarks = ['main', 'navigation', 'search', 'region', 'complementary', 'contentinfo'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.removeAttribute('role');
        }
      });
    }
  });
};

/**
 * Replaces fake links with proper anchor elements
 * Fixes REACT_036: React Fake Link
 */
export const replaceFakeLinks = () => {
  const fakeLinks = document.querySelectorAll('[role="link"], [role="button"]');
  fakeLinks.forEach(link => {
    if (link.getAttribute('role') === 'link' && !link.tagName.toLowerCase() === 'a') {
      const anchor = document.createElement('a');
      anchor.href = link.getAttribute('href') || '#';
      anchor.textContent = link.textContent;
      link.replaceWith(anchor);
    }
  });
};

// Initialize accessibility improvements when the component mounts
export const initializeAccessibility = () => {
  addLanguageAttribute();
  addLandmarks();
  ensureUniqueLandmarks();
  replaceFakeLinks();

  // Enhance tables - you would call this with specific table IDs
  // enhanceTableAccessibility('your-table-id');

  // Make SVGs accessible - you would call this with specific SVG IDs and titles
  // makeSvgAccessible('your-svg-id', 'Accessible SVG Title');
};