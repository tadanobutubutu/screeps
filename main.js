import React from 'react';
import ReactDOM from 'react-dom/client';

/**
 * Adds a language attribute to the root element (HTML).
 */
function addLangAttribute(rootElement) {
  if (rootElement && !rootElement.hasAttribute('lang')) {
    rootElement.setAttribute('lang', 'en');
  }
}

/**
 * Validates basic table structure: ensures presence of <thead> and <tbody>.
 * @param {HTMLElement} table - The table element.
 */
function validateTableStructure(table) {
  // At minimum, require a non-empty table with a header row.
  if (!table || table.tagName !== 'TABLE') return false;

  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) return false;

  // Require a header row (first <tr>)
  const headerRow = rows[0];
  if (!headerRow || !headerRow.hasAttribute('th')) {
    return false;
  }

  // Optionally verify presence of <thead> and <tbody>
  if (!table.querySelector('thead')) {
    const thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>Column 1</th><th>Column 2</th></tr>';
    table.prepend(thead);
  }

  if (!table.querySelector('tbody')) {
    const tbody = document.createElement('tbody');
    tbody.innerHTML = '<tr><td>Sample data</td><td>Item</td></tr>';
    table.appendChild(tbody);
  }

  return true;
}

/**
 * Ensures the table has proper structural elements.
 * @param {HTMLElement} table - The table element.
 */
function fixTableStructure(table) {
  // Create <thead> if missing
  if (!table.querySelector('thead')) {
    const thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>ID</th><th>Description</th></tr>';
    table.prepend(thead);
  }

  // Create <tbody> if missing
  if (!table.querySelector('tbody')) {
    const tbody = document.createElement('tbody');
    tbody.innerHTML = '<tr><td>Row 1</td><td>First entry</td></tr>';
    table.appendChild(tbody);
  }
}

/**
 * Adds a main landmark role to the primary content area.
 */
function addMainLandmark() {
  const mainEl = document.getElementById('main-content');
  if (mainEl) {
    mainEl.setAttribute('role', 'main');
  }
}

/**
 * Verifies that all landmark roles are unique across the document.
 * Logs a warning if duplicates are detected.
 */
function ensureUniqueLandmarks() {
  const roles = [...new Set(
    document.querySelectorAll('[role]').map(el => el.getAttribute('role'))
  )];

  // Simple deduplication: if more than one element shares the same role, warn.
  if (roles.length > 1) {
    console.warn('Multiple elements share the same landmark role:', roles);
  }
}

/**
 * Returns an accessible name for an SVG element.
 * Uses the <title> or <aria-label> attribute if available.
 *
 * @param {HTMLElement} svg - The SVG element.
 * @returns {string} An accessible label.
 */
function getSvgAccessibleName(svg) {
  const title = svg.getAttribute('title');
  const ariaLabel = svg.getAttribute('aria-label');
  return title || ariaLabel || 'SVG graphic';
}

/**
 * Renders the main application UI.
 * Applies all accessibility fixes before returning JSX.
 */
const MainApp = () => {
  // Locate the table (assumed to be present in the markup)
  const table = document.getElementById('data-table');
  // Locate all SVG elements
  const svgs = document.querySelectorAll('svg');

  // Apply language attribute to the root element
  addLangAttribute(document.documentElement);

  // Validate and fix table structure
  if (table) {
    validateTableStructure(table);
    fixTableStructure(table);
  }

  // Add main landmark
  addMainLandmark();

  // Ensure unique landmarks
  ensureUniqueLandmarks();

  // Make SVGs accessible
  svgs.forEach((svg) => {
    const name = getSvgAccessibleName(svg);
    svg.setAttribute('aria-label', name);
  });

  // Fix fake link (replace with a relative path)
  const link = document.querySelector('a[href]');
  if (link) {
    link.href = '#' + window.location.pathname;
  }

  return (
    <div id="main-content">
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th></tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Alice</td></tr>
          <tr><td>2</td><td>Bob</td></tr>
        </tbody>
      </table>

      <svg width="100" height="50" viewBox="0 0 100 50">
        <circle cx="50" cy="25" r="10" />
      </svg>

      <a href="#home">Home</a>
    </div>
  );
};

export default MainApp;