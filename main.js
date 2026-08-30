import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

document.documentElement.lang = 'en';

reportWebVitals();

const VERSION = '1.0.0';

const CONFIG = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development'
};

function initialize() {
  console.log('Application initialized');
  return true;
}

function getConfig() {
  return CONFIG;
}

function getVersion() {
  return VERSION;
}

// Function to get the lang attribute
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// Function to validate table accessibility
function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  const issues = [];
  
  tables.forEach((table, index) => {
    const hasCaption = table.querySelector('caption') !== null;
    const hasAriaLabel = table.getAttribute('aria-label') !== null;
    const hasAriaLabelledby = table.getAttribute('aria-labelledby') !== null;
    
    if (!hasCaption && !hasAriaLabel && !hasAriaLabelledby) {
      issues.push({
        type: 'REACT_027',
        message: `Table ${index + 1} lacks accessible name (caption, aria-label, or aria-labelledby)`,
        severity: 'warning'
      });
    }
  });
  
  return issues;
}

// Function to validate table structure
function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  const issues = [];
  
  tables.forEach((table, index) => {
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const headers = table.querySelectorAll('th');
    
    if (!thead) {
      issues.push({
        type: 'REACT_027',
        message: `Table ${index + 1} missing thead element`,
        severity: 'warning'
      });
    }
    
    if (!tbody) {
      issues.push({
        type: 'REACT_027',
        message: `Table ${index + 1} missing tbody element`,
        severity: 'warning'
      });
    }
    
    if (headers.length === 0) {
      issues.push({
        type: 'REACT_027',
        message: `Table ${index + 1} missing th elements for headers`,
        severity: 'warning'
      });
    }
  });
  
  return issues;
}

// Function to get SVG accessible name
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';
  
  // Check for title element inside SVG
  const title = svgElement.querySelector('title');
  if (title && title.textContent) {
    return title.textContent;
  }
  
  // Check for aria-label attribute
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby attribute
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const referencedElement = document.getElementById(ariaLabelledby);
    if (referencedElement) {
      return referencedElement.textContent;
    }
  }
  
  return '';
}

// Function to validate SVG accessibility
function validateSvgAccessibility() {
  const svgs = document.querySelectorAll('svg');
  const issues = [];
  
  svgs.forEach((svg, index) => {
    const accessibleName = getSvgAccessibleName(svg);
    if (!accessibleName) {
      issues.push({
        type: 'REACT_041',
        message: `SVG ${index + 1} lacks accessible name (title, aria-label, or aria-labelledby)`,
        severity: 'warning'
      });
    }
  });
  
  return issues;
}

// Function to ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  const issues = [];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    const roleAttr = `[role="${landmark}"]`;
    const roleElements = document.querySelectorAll(roleAttr);
    
    // For main, header, footer, aside - there should typically be only one
    if (['main', 'header', 'footer', 'aside'].includes(landmark)) {
      if (elements.length > 1 || roleElements.length > 1) {
        issues.push({
          type: 'REACT_025',
          message: `Multiple ${landmark} landmarks detected (${elements.length + roleElements.length} found)`,
          severity: 'warning'
        });
      }
    }
  });
  
  return issues;
}

// Function to fix fake link issues
function fixFakeLinkIssues() {
  const issues = [];
  
  // Find elements with onclick that look like links but aren't
  const anchorsWithoutHref = document.querySelectorAll('a:not([href])');
  const clickableElements = document.querySelectorAll('[onclick]');
  
  clickableElements.forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    const hasHref = element.getAttribute('href');
    const hasOnClick = element.hasAttribute('onclick');
    
    // Check if element looks like a link (has cursor pointer, styled as link, etc.)
    const computedStyle = window.getComputedStyle(element);
    const isClickable = computedStyle.cursor === 'pointer' || 
                        element.classList.contains('link') ||
                        element.classList.contains('btn-link');
    
    if (isClickable && !hasHref && hasOnClick) {
      // Check if it's in a navigation context
      const parentNav = element.closest('nav');
      const parentList = element.closest('ul, ol');
      
      if (parentNav || parentList) {
        issues.push({
          type: 'REACT_036',
          message: `Element ${index + 1} appears to be a fake link (clickable element without href in navigation)`,
          severity: 'warning',
          suggestion: 'Consider using an <a> element with href attribute for proper accessibility'
        });
      }
    }
  });
  
  return issues;
}

// Function to create accessible in-page button
function createInPageButton(options = {}) {
  const { id, text, onClick, className = '' } = options;
  
  const button = document.createElement('button');
  if (id) button.id = id;
  button.textContent = text || 'Button';
  button.className = className;
  button.type = 'button';
  
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

// Function to add accessible name to person name element
function personName(element) {
  if (!element) return null;
  
  // Check if element already has accessible name
  const existingAriaLabel = element.getAttribute('aria-label');
  const existingAriaLabelledby = element.getAttribute('aria-labelledby');
  
  if (existingAriaLabel || existingAriaLabelledby) {
    return existingAriaLabel || 'Person name';
  }
  
  // If element has text content, use it
  const textContent = element.textContent?.trim();
  if (textContent) {
    element.setAttribute('aria-label', textContent);
  }
  
  return element;
}

// New functions to address accessibility issues (as per TODO)

// Function to ensure lang attribute is present
function addLangAttribute() {
  if (!document.documentElement.lang) {
    document.documentElement.lang = 'en';
  }
}

// Function to fix table structure issues
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  const fixesApplied = [];

  tables.forEach((table, index) => {
    // Ensure thead
    let thead = table.querySelector('thead');
    if (!thead) {
      thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        firstRow.remove();
        thead.appendChild(firstRow);
      }
      table.insertBefore(thead, table.firstChild);
      fixesApplied.push({
        type: 'REACT_027',
        tableIndex: index,
        issue: 'Added missing thead element',
      });
    }

    // Ensure tbody
    let tbody = table.querySelector('tbody');
    if (!tbody) {
      tbody = document.createElement('tbody');
      Array.from(table.querySelectorAll('tr')).forEach(tr => {
        if (!thead.contains(tr)) {
          tbody.appendChild(tr);
        }
      });
      table.appendChild(tbody);
      fixesApplied.push({
        type: 'REACT_027',
        tableIndex: index,
        issue: 'Added missing tbody element',
      });
    }

    // Ensure header cells are th
    const headerRows = thead ? thead.querySelectorAll('tr') : [];
    headerRows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      cells.forEach(cell => {
        if (cell.tagName.toLowerCase() === 'td') {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          cell.replaceWith(th);
          fixesApplied.push({
            type: 'REACT_027',
            tableIndex: index,
            issue: 'Replaced td with th in header row',
          });
        }
      });
    });
  });

  return fixesApplied;
}

// Function to add a main landmark
function addMainLandmark() {
  const container = document.getElementById('root');
  if (!container) return;

  const existingMain = container.closest('main');
  if (existingMain) return;

  const parent = container.parentNode;
  const main = document.createElement('main');
  parent.insertBefore(main, container);
  main.appendChild(container);
}

// Function to add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  let count = 0;
  svgs.forEach(svg => {
    if (!getSvgAccessibleName(svg)) {
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = 'SVG image';
      svg.insertBefore(title, svg.firstChild);
      count++;
    }
  });
  return count;
}

// Function to fix a fake link issue (singular)
function fixFakeLinkIssue() {
  const clickableElements = document.querySelectorAll('[onclick]');
  for (const element of clickableElements) {
    const tagName = element.tagName.toLowerCase();
    const hasHref = element.getAttribute('href');
    const hasOnClick = element.hasAttribute('onclick');
    const computedStyle = window.getComputedStyle(element);
    const isClickable = computedStyle.cursor === 'pointer' ||
                        element.classList.contains('link') ||
                        element.classList.contains('btn-link');

    if (isClickable && !hasHref && hasOnClick) {
      const parentNav = element.closest('nav');
      const parentList = element.closest('ul, ol');
      if (parentNav || parentList) {
        element.setAttribute('href', '#');
        return element;
      }
    }
  }
  return null;
}

// Main function to address all accessibility issues
function addressAccessibilityIssues() {
  const results = {
    langAttribute: getLangAttribute(),
    tableAccessibilityIssues: validateTableAccessibility(),
    tableStructureIssues: validateTableStructure(),
    svgAccessibilityIssues: validateSvgAccessibility(),
    landmarkIssues: ensureUniqueLandmarks(),
    fakeLinkIssues: fixFakeLinkIssues()
  };
  
  // Log all issues
  const allIssues = [
    ...results.tableAccessibilityIssues,
    ...results.tableStructureIssues,
    ...results.svgAccessibilityIssues,
    ...results.landmarkIssues,
    ...results.fakeLinkIssues
  ];
  
  if (allIssues.length > 0) {
    console.group('Accessibility Issues Found:');
    allIssues.forEach(issue => {
      console.warn(`[${issue.type}] ${issue.message}`);
      if (issue.suggestion) {
        console.info(`Suggestion: ${issue.suggestion}`);
      }
    });
    console.groupEnd();
  }
  
  return {
    totalIssues: allIssues.length,
    issues: allIssues,
    lang: results.langAttribute
  };
}

export {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  validateSvgAccessibility,
  ensureUniqueLandmarks,
  fixFakeLinkIssues,
  createInPageButton,
  personName,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinkIssue
};

export default {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  validateSvgAccessibility,
  ensureUniqueLandmarks,
  fixFakeLinkIssues,
  createInPageButton,
  personName,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinkIssue
};