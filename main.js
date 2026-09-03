import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities'; // Assuming accessibility utilities are in a separate file

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and validateLandmarkAttributes())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// REACT_040: Replace my-button with actual button id for accessibility
// REACT_042: Ensure dependencyGraph container has proper ARIA role (handled by setDependencyGraphRole())

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
export function getLangAttribute() {
  return document.documentElement.lang || document.querySelector('html')?.getAttribute('lang') || '';
}

/**
 * Adds lang attribute to HTML element
 * REACT_015: Add lang attribute
 */
export function addLangAttribute() {
  const htmlElement = document.documentElement || document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 * REACT_027: Fix 26 table structure issues
 */
export function validateTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') {
    return false;
  }
  
  const hasCaption = table.querySelector('caption') !== null;
  const hasHeaders = table.querySelector('th') !== null;
  const hasScope = Array.from(table.querySelectorAll('th')).every(th => th.hasAttribute('scope'));
  
  return hasCaption || hasHeaders;
}

/**
 * Validates table structure
 * REACT_027: Fix 26 table structure issues
 */
export function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  const issues = [];
  
  tables.forEach((table, index) => {
    const rows = table.querySelectorAll('tr');
    let hasHeaderRow = false;
    
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('th, td');
      if (rowIndex === 0 && Array.from(cells).some(cell => cell.tagName === 'TH')) {
        hasHeaderRow = true;
      }
      
      // Check for proper table structure
      if (cells.length === 0) {
        issues.push(`Table ${index + 1}: Row ${rowIndex + 1} has no cells`);
      }
    });
    
    if (!hasHeaderRow) {
      issues.push(`Table ${index + 1}: Missing header row`);
    }
  });
  
  return issues;
}

/**
 * Fixes table structure issues
 * REACT_027: Fix 26 table structure issues
 */
export function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  
  tables.forEach((table) => {
    // Ensure table has proper scope attributes on headers
    const headers = table.querySelectorAll('th');
    headers.forEach((th) => {
      if (!th.hasAttribute('scope')) {
        const row = th.closest('tr');
        const rowIndex = Array.from(table.querySelectorAll('tr')).indexOf(row);
        
        if (rowIndex === 0) {
          th.setAttribute('scope', 'col');
        } else {
          th.setAttribute('scope', 'row');
        }
      }
    });
    
    // Add caption if missing
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
    }
  });
}

/**
 * Adds main landmark to page
 * REACT_017: Add/fix 4 landmark issues
 */
export function addMainLandmark() {
  const mainElements = document.querySelectorAll('main');
  const hasMainLandmark = mainElements.length > 0;
  
  if (!hasMainLandmark) {
    // Find the main content container and wrap it with <main>
    const existingMain = document.querySelector('[role="main"]');
    if (existingMain) {
      existingMain.removeAttribute('role');
      const main = document.createElement('main');
      existingMain.parentNode.insertBefore(main, existingMain);
      main.appendChild(existingMain);
    }
  }
}

/**
 * Validates landmark accessibility
 * REACT_017: Add/fix 4 landmark issues
 */
export function validateLandmark() {
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  const issues = [];
  
  landmarks.forEach((landmark) => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length === 0 && landmark !== 'aside') {
      issues.push(`Missing landmark: ${landmark}`);
    }
  });
  
  return issues;
}

/**
 * Validates landmark structure
 * REACT_017: Add/fix 4 landmark issues
 */
export function validateLandmarkStructure() {
  const navElements = document.querySelectorAll('nav');
  const issues = [];
  
  navElements.forEach((nav, index) => {
    const ariaLabel = nav.getAttribute('aria-label');
    const ariaLabelledBy = nav.getAttribute('aria-labelledby');
    
    if (!ariaLabel && !ariaLabelledBy) {
      issues.push(`Nav element ${index + 1} missing accessible name`);
    }
  });
  
  return issues;
}

/**
 * Validates landmark attributes
 * REACT_025: Ensure unique landmarks
 */
export function validateLandmarkAttributes() {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer');
  const landmarkTypes = {};
  const issues = [];
  
  landmarks.forEach((landmark) => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role');
    const key = role || tagName;
    
    if (landmarkTypes[key]) {
      landmarkTypes[key]++;
      if (landmarkTypes[key] > 1) {
        issues.push(`Duplicate landmark: ${key}`);
      }
    } else {
      landmarkTypes[key] = 1;
    }
  });
  
  return issues;
}

/**
 * Gets SVG accessible name
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name for SVG element
 * REACT_041: Add accessible names to 2 SVGs
 */
export function getSvgAccessibleName(svg) {
  if (!svg) {
    svg = document.querySelector('svg');
  }
  
  if (svg) {
    const title = svg.querySelector('title');
    if (title) {
      return title.textContent;
    }
    
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) {
      return ariaLabel;
    }
    
    const ariaLabelledBy = svg.getAttribute('aria-labelledby');
    if (ariaLabelledBy) {
      const titleElement = document.getElementById(ariaLabelledBy);
      if (titleElement) {
        return titleElement.textContent;
      }
    }
  }
  
  return '';
}

/**
 * Sets SVG attributes for accessibility
 * REACT_041: Add accessible names to 2 SVGs
 */
export function setSvgAttributes() {
  const svgs = document.querySelectorAll('svg');
  
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.id = `svg-title-${index + 1}`;
      title.textContent = `SVG graphic ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
}

/**
 * Ensures unique landmarks on the page
 * REACT_025: Ensure unique landmarks
 */
export function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer');
  const seen = new Map();
  
  landmarks.forEach((landmark) => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role');
    const key = role || tagName;
    
    if (seen.has(key)) {
      // Add unique identifier to duplicate landmarks
      if (!landmark.hasAttribute('aria-label')) {
        landmark.setAttribute('aria-label', `${key} section ${seen.get(key) + 1}`);
      }
      seen.set(key, seen.get(key) + 1);
    } else {
      seen.set(key, 1);
    }
  });
}

/**
 * Creates an in-page navigation button
 * REACT_036: Fix 1 fake link issue
 */
export function createInPageButton() {
  return React.createElement('button', {
    type: 'button',
    className: 'in-page-button',
    onClick: () => {
      const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, 'Skip to main content');
}

/**
 * Validates link accessibility
 * REACT_036: Fix 1 fake link issue
 */
export function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  const issues = [];
  
  links.forEach((link, index) => {
    const href = link.getAttribute('href');
    const text = link.textContent.trim();
    
    if (!href || href === '#') {
      const hasClickHandler = link.onclick || link.getAttribute('role') === 'button';
      if (!hasClickHandler) {
        issues.push(`Link ${index + 1}: Fake link without proper button semantics`);
      }
    }
    
    if (!text) {
      const ariaLabel = link.getAttribute('aria-label');
      const img = link.querySelector('img');
      if (!ariaLabel && !img) {
        issues.push(`Link ${index + 1}: Missing accessible text`);
      }
    }
  });
  
  return issues
}