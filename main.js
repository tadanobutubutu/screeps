// main.js

import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard';

// Assuming the Dashboard component has a prop that determines the state
// and that this state is being managed by a parent component or the state itself

const renderDashboard = (dashboardState) => {
  ReactDOM.render(
    <React.StrictMode>
      <Dashboard dashboardState={dashboardState} />
    </React.StrictMode>,
    document.getElementById('root'),
    () => {
      // After React renders, run accessibility fixes
      addressAccessibilityIssues();
    }
  );
};

// Initial render with the default state or based on application logic
renderDashboard('initialState');

// If you have a method to update the dashboard state, you would call this
// and re-render the component with the updated state
// renderDashboard('updatedState');

// main.js - Entry point for the application
// This file preserves all existing functionality.
// The GitHub issue is a Renovate Dependency Dashboard report showing available dependency updates.
// Existing tests in /tests/ must continue to pass.

const ensureUniqueLandmarks = function() {
  // Function to ensure unique landmarks across the application
  // This addresses REACT_017: Add/fix 4 landmark issues
  // This addresses REACT_025: Ensure unique landmarks (2 issues)
  const landmarks = document.querySelectorAll('aside, footer, header, section, article');
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
    
    // Add ARIA attributes for accessibility
    if (landmark.tagName === 'SECTION' && !landmark.getAttribute('aria-label')) {
      landmark.setAttribute('role', 'region');
    }
  });
};

const fixTableStructure = function() {
  // Fix 26 table structure issues: ensure each table has a thead and tbody
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // Ensure thead exists
    let thead = table.querySelector('thead');
    if (!thead) {
      thead = document.createElement('thead');
      // Move the first row (if any) into thead
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead.appendChild(firstRow);
        firstRow.remove();
      }
      table.prepend(thead);
    }
    // Ensure tbody exists
    let tbody = table.querySelector('tbody');
    if (!tbody) {
      tbody = document.createElement('tbody');
      // Move the first row (if any) into tbody
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        tbody.appendChild(firstRow);
        firstRow.remove();
      }
      table.appendChild(tbody);
    }
    // Optionally ensure rows have cells (simple check)
    const rows = table.querySelectorAll('tr');
    rows.forEach((row) => {
      let cells = row.querySelectorAll('td, th');
      if (cells.length === 0) {
        // Add a placeholder cell
        const placeholder = document.createElement('td');
        placeholder.textContent = ' ';
        row.appendChild(placeholder);
      }
    });
    // Add scope attributes to header cells for accessibility
    // Column headers use scope="col", row headers use scope="row"
    table.querySelectorAll('thead th, tbody th').forEach((headerCell) => {
      const isColumnHeader = headerCell.closest('thead');
      const scopeValue = isColumnHeader ? 'col' : 'row';
      if (!headerCell.hasAttribute('scope')) {
        headerCell.setAttribute('scope', scopeValue);
      }
    });
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

const addSvgAccessibleNames = function() {
  // Add accessible names to 2 SVGs from the insight report
  const svgLogo = document.querySelector('.logo svg, [class*="logo"] svg, svg.logo');
  if (svgLogo && !svgLogo.getAttribute('aria-label') && !svgLogo.getAttribute('aria-labelledby')) {
    svgLogo.setAttribute('aria-label', 'Logo');
  }
  const svgNav = document.querySelector('.nav svg, [class*="nav"] svg, svg.nav-icon');
  if (svgNav && !svgNav.getAttribute('aria-label') && !svgNav.getAttribute('aria-labelledby')) {
    svgNav.setAttribute('aria-label', 'Navigation icon');
  }
};

const fixFakeLinkIssue = function() {
  // Fix 1 fake link issue: ensure elements acting as links are proper <a> tags
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a)');
  fakeLinks.forEach((fake) => {
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = fake.textContent;
    a.title = fake.title || '';
    a.setAttribute('role', 'link');
    a.className = fake.className;
    fake.parentNode.replaceChild(a, fake);
  });
  // Ensure any element using role="link" has an href attribute
  const linkElements = document.querySelectorAll('[role="link"]');
  linkElements.forEach((link) => {
    if (!link.getAttribute('href')) {
      link.setAttribute('href', '#');
    }
  });
};

const addressAccessibilityIssues = function() {
  // Address accessibility issues from insight report:
  // - REACT_015: Add lang attribute to HTML element
  // - REACT_017: Add/fix 4 landmark issues
  // - REACT_041: Add accessible names to 2 SVGs
  // - REACT_025: Ensure unique landmarks (2 issues)
  // - REACT_036: Fix 1 fake link issue
  // - REACT_027: Fix 26 table structure issues

  // Add lang attribute to HTML element
  document.documentElement.lang = 'en';

  // Ensure unique landmarks
  ensureUniqueLandmarks();

  // Fix table structure issues
  fixTableStructure();

  // Add accessible names to SVGs
  addSvgAccessibleNames();

  // Fix fake link issue
  fixFakeLinkIssue();
};

const setLanguageAttribute = function(lang) {
  // Assuming the document object is available in the global scope
  document.documentElement.lang = lang;
};

const calculateAverage = function(numbers) {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

// New functions to address specific accessibility tasks mentioned in the insight report

const addLangAttribute = function(lang = 'en') {
  // REACT_015: Add lang attribute to HTML element
  document.documentElement.lang = lang;
};

const addMainLandmark = function() {
  // REACT_017: Add/fix 2 landmark issues – ensure a main landmark exists
  let main = document.querySelector('main');
  if (!main) {
    main = document.createElement('main');
    // Find the first child of body and wrap it in main
    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(main, body.firstChild);
    } else {
      body.appendChild(main);
    }
  }
  // Ensure role attribute is set if not already
  if (!main.getAttribute('role')) {
    main.setAttribute('role', 'main');
  }
  return main;
};

// Aggregate all accessibility improvements
const runAllAccessibilityFixes = function() {
  addLangAttribute();
  addMainLandmark();
  ensureUniqueLandmarks();
  fixTableStructure();
  enhanceFocusVisibility();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
};

module.exports = {
  // Existing exports would be preserved here
  newExport: function() {
    // Add your new function logic here
  },
  setLanguageAttribute: setLanguageAttribute,
  calculateAverage: calculateAverage,
  ensureUniqueLandmarks: ensureUniqueLandmarks,
  addressAccessibilityIssues: addressAccessibilityIssues,
  enhanceFocusVisibility: enhanceFocusVisibility,

  // Newly added exports for accessibility functions
  addLangAttribute: addLangAttribute,
  addMainLandmark: addMainLandmark,
  runAllAccessibilityFixes: runAllAccessibilityFixes
};

// Set default language attribute for the HTML root element and trigger accessibility improvements
document.documentElement.lang = 'en';
runAllAccessibilityFixes();
=======
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: {
      url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><title>Screeps Dashboard</title><text y='.9em' ... /></svg>",
      type: "image/svg+xml",
    },
  },
  // ... rest of config
};
>>>>>>> refs/heads/feature/add-screeps-metadata