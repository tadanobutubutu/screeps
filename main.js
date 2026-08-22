// FILENAME: main.js
// main.js - Entry point for the application
// This file preserves all existing functionality.
// The GitHub issue is a Renovate Dependency Dashboard report showing available dependency updates.
// Existing tests in /tests/ must continue to pass.
// Beginner Overview: The existing code needs to be preserved in the main.js file, while adding new functions requested in the issue. The new functions should not remove or rename the existing exports.

// TODO: Import required module(s) and export the new necessary function(s) here in main.js

const docPromise = import('document');

// TODO: Address accessibility issues from insight report
// - Add lang attribute to HTML element
addLangAttribute();

// Function to ensure unique landmarks across the application
// This addresses REACT_017: Add/fix 4 landmark issues
// This addresses REACT_025: Ensure unique landmarks (2 issues)
const ensureUniqueLandmarks = function() {
  // Function to ensure unique landmarks across the application
  // This addresses REACT_017: Add/fix 4 landmark issues
  // This addresses REACT_025: Ensure unique landmarks (2 issues)
  const landmarks = document.querySelectorAll('footer, header, section, article');
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
      landmark.setAttribute('aria-label', 'region');
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
      if (!headerCell.getAttribute('scope')) {
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
    }`;
  document.head.appendChild(style);
};

const addSvgAccessibleNames = function() {
  // Add accessible names to 2 SVGs from the insight report
  const logoSelector = '.logo svg, [class*="logo"] svg, svg.logo';
  const navIconSelector = '.nav svg, [class*="nav"] svg, svg.nav-icon';
  let logoNodes = [];
  for (const selector of [logoSelector, navIconSelector]) {
    const nodes = document.querySelectorAll(selector);
    for (const node of nodes) {
      if (logoNodes.includes(node)) continue;
      logoNodes.push(node);
    }
  }
  if (logoNodes.length > 0) {
    for (const i of [0, 1]) {
      const svgNode = logoNodes[i];
      if (svgNode) {
        if (!svgNode.getAttribute('aria-label') && !svgNode.getAttribute('aria-labelledby')) {
          if (i === 0) {
            svgNode.setAttribute('aria-label', 'Language selector');
          } else {
            svgNode.setAttribute('aria-label', 'Navigation icon');
          }
        }
      }
    }
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

const fixHashLinkToButton = function() {
  // Fix REACT_036: Convert <a href="#"> to <button> for in-page actions
  const links = document.querySelectorAll('a[href="#"]');
  links.forEach((link) => {
    if (link.tagName === 'A' && link.getAttribute('href') === '#') {
      const button = document.createElement('button');
      const attrs = link.attributes;
      for (let i of Array.from({length: attrs.length})) {
        const attr = attrs[i];
        if (attr.name !== 'href') {
          button.setAttribute(attr.name, attr.value);
        }
      }
      button.textContent = link.textContent;
      link.parentNode.replaceChild(button, link);
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
  document.documentElement.lang = 'en';
  ensureUniqueLandmarks();
  fixTableStructure();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
  fixHashLinkToButton();
};

const setLanguageAttribute = function(lang) {
  // Assuming the document object is available in the global scope
  document.documentElement.lang = lang;
};

const calculateAverage = function(numbers) {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

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

const runAllAccessibilityFixes = function() {
  addLangAttribute();
  addMainLandmark();
  ensureUniqueLandmarks();
  fixTableStructure();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
  fixHashLinkToButton();
};

const initializeAccessibility = function() {
  // New function to initialize accessibility features
  runAllAccessibilityFixes();
  enhanceFocusVisibility();
};

// Added new export function
module.exports.newExport = function() {
  // Export the new accessibility-related functions
  return {
    initializeAccessibility: initializeAccessibility,
    runAllAccessibilityFixes: runAllAccessibilityFixes,
    addLangAttribute: addLangAttribute,
    addMainLandmark: addMainLandmark,
    ensureUniqueLandmarks: ensureUniqueLandmarks,
    addressAccessibilityIssues: addressAccessibilityIssues,
    enhanceFocusVisibility: enhanceFocusVisibility,
    fixTableStructure: fixTableStructure,
    addSvgAccessibleNames: addSvgAccessibleNames,
    fixFakeLinkIssue: fixFakeLinkIssue,
    fixHashLinkToButton: fixHashLinkToButton,
    calculateAverage: calculateAverage
  };
};

document.documentElement.lang = 'en';
addressAccessibilityIssues();