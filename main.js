// main.js
import React from 'react';
import { useEffect, useState } from 'react';

// Existing functions (preserved as-is)
export function existingFunction1() {
  // ... existing code ...
}

export function existingFunction2() {
  // ... existing code ...
}

// New accessibility-focused functions
export function setLanguageAttribute(lang = 'en') {
  // REACT_015: React Language Attribute
  // Ensure the html element has a lang attribute
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
}

export function ensureTableStructure(tableId) {
  // REACT_027: React Table Structure
  // Ensure tables have proper structure with thead, tbody, and th elements
  const table = document.getElementById(tableId);
  if (table) {
    // Check if thead exists, if not create it
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
      }
    }

    // Check if tbody exists, if not create it
    if (!table.querySelector('tbody')) {
      const tbody = document.createElement('tbody');
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        if (!row.closest('thead')) {
          tbody.appendChild(row);
        }
      });
      table.appendChild(tbody);
    }

    // Add scope attributes to th elements
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.getAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  }
}

export function addLandmarks() {
  // REACT_017: React Landmarks
  // Ensure proper ARIA landmarks are used
  const main = document.querySelector('main');
  if (main && !main.getAttribute('role')) {
    main.setAttribute('role', 'main');
  }

  const nav = document.querySelector('nav');
  if (nav && !nav.getAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }

  const header = document.querySelector('header');
  if (header && !header.getAttribute('role')) {
    header.setAttribute('role', 'banner');
  }

  const footer = document.querySelector('footer');
  if (footer && !footer.getAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
}

export function ensureSvgAccessibility(svgId, description) {
  // REACT_041: React SVG Accessible Name
  // Ensure SVGs have accessible names
  const svg = document.getElementById(svgId);
  if (svg) {
    if (!svg.querySelector('title') && !svg.querySelector('desc')) {
      const title = document.createElement('title');
      title.textContent = description;
      svg.insertBefore(title, svg.firstChild);

      const desc = document.createElement('desc');
      desc.textContent = description;
      svg.insertBefore(desc, svg.firstChild);
    }
  }
}

export function ensureUniqueLandmarks() {
  // REACT_025: React Unique Landmarks
  // Ensure landmarks are unique and properly structured
  const mainElements = document.querySelectorAll('[role="main"]');
  if (mainElements.length > 1) {
    console.warn('Multiple main landmarks found. Only one should exist.');
  }

  const navigationElements = document.querySelectorAll('[role="navigation"]');
  if (navigationElements.length > 1) {
    console.warn('Multiple navigation landmarks found. Consider combining or making them unique.');
  }
}

export function replaceFakeLinks() {
  // REACT_036: React Fake Link
  // Replace elements that look like links but aren't
  const fakeLinks = document.querySelectorAll('[role="link"], [tabindex="0"]');
  fakeLinks.forEach(link => {
    if (!link.getAttribute('href')) {
      link.setAttribute('role', 'button');
      link.removeAttribute('tabindex');
    }
  });
}

// Initialize accessibility features
export function initAccessibility() {
  useEffect(() => {
    setLanguageAttribute();
    addLandmarks();
    ensureUniqueLandmarks();
    replaceFakeLinks();

    // Example usage of other functions - these would be called when specific components are rendered
    // ensureTableStructure('data-table');
    // ensureSvgAccessibility('chart-svg', 'Data visualization chart');
  }, []);
}

// Keep all existing exports
export { existingFunction1, existingFunction2 };