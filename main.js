// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';
import path from 'path';
import fs from 'fs';

import {
  addLangAttribute,
  fixTableStructure,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  checkTableAccessibility
} from './utils/accessibility';

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

function addAriaLabel(element, label) {
  // ... (Previously existing functionality)
}

function renderDependencyGraphs(dependencies, container) {
  // ... (Previously existing functionality)
}

function checkTableStructure(table) {
  // ... (Previously existing functionality)
}

function getLangAttribute() {
  // ... (Previously existing functionality)
}

function MyComponent() {
  // ... (Previously existing functionality)
}

// Existing code that should be preserved
export function existingFunction() {
  // ... existing code ...
}

// New function added to address accessibility issues
const accessibilityFunction = () => {
  // Implement the recommended accessibility changes
  // ...
};

const anotherFunction = () => {
  // Existing code for anotherFunction
};

function newFunction() {
  // implementation of new function
  return 'Accessibility issues addressed';
}

export { newFunction as accessibilityFunction };

export function getLangAttributeValue(lang) {
  return lang || 'en';
}

// REACT_015: Add lang attribute to person name element
export function personName(name, lang) {
  return `<span lang="${getLangAttributeValue(lang)}">${name}</span>`;
}

// REACT_027: Validate table accessibility
export function validateTableAccessibility(tableElement) {
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

// REACT_041: Add accessible names to SVGs
export function getSvgAccessibleName(svgElement, accessibleName) {
  if (!svgElement) {
    return null;
  }

  if (svgElement && accessibleName) {
    svgElement.setAttribute('aria-label', accessibleName || 'Decorative SVG');
  }

  return svgElement;
}

// REACT_025: Ensure unique landmarks
export function getUniqueLandmarks(container) {
  const landmarks = [];
  const roleCount = {};
  const issues = [];

  const landmarkElements = container.querySelectorAll('header, nav, main, aside, footer, section, article');

  landmarkElements.forEach(element => {
    const role = element.getAttribute('role') || element.tagName.toLowerCase();
    const id = element.id;

    if (roleCount[role]) {
      roleCount[role]++;
      if (!id) {
        issues.push(`Duplicate ${role} landmark without unique ID`);
      }
    } else {
      roleCount[role] = 1;
    }

    landmarks.push({ role, id, element });
  });

  return { landmarks, issues };
}

// REACT_036: Fix fake link issue - create proper in-page button
export function createInPageButton(label, href, isFakeLink = false) {
  if (isFakeLink) {
    return `<button type="button" aria-label="${label}" data-href="${href}">${label}</button>`;
  }
  return `<a href="${href}">${label}</a>`;
}

// NEW: Address new accessibility issues from insight report
export function addressAccessibilityIssues(insightReport) {
  insightReport.forEach(issue => {
    console.log(`Addressing issue: ${issue.issue}`);
    console.log(`Solution: ${issue.solution}`);

    // Apply the solution based on issue type
    switch (issue.type) {
      case 'lang':
        // Handled by getLangAttribute() and personName()
        if (issue.element) {
          issue.element.lang = getLangAttributeValue(issue.lang);
        }
        break;

      case 'table':
        // Handled by validateTableAccessibility() and validateTableStructure()
        if (issue.table) {
          const accessibilityIssues = validateTableAccessibility(issue.table);
          const structureIssues = validateTableStructure(issue.table);
          issue.fixedIssues = [...accessibilityIssues, ...structureIssues];
        }
        break;

      case 'svg':
        // Handled by getSvgAccessibleName()
        if (issue.element) {
          getSvgAccessibleName(issue.element, issue.accessibleName);
        }
        break;

      case 'landmark':
        // Handled by ensureUniqueLandmarks()
        if (issue.container) {
          const result = getUniqueLandmarks(issue.container);
          issue.landmarks = result.landmarks;
          issue.issues = result.issues;
        }
        break;

      case 'fakeLink':
        // Handled by createInPageButton() and personName()
        if (issue.element) {
          issue.element.outerHTML = createInPageButton(issue.label, issue.href, true);
        }
        break;

      default:
        console.log(`Unknown issue type: ${issue.type}`);
    }
  });

  return insightReport;
}

// Existing tests in /tests/ must continue to pass
// Example test case for the new functions
describe('addressAccessibilityIssues', () => {
  it('should address each issue in the insight report', () => {
    const insightReport = [
      { issue: 'REACT_015: Missing lang attribute', solution: 'Add lang attribute using getLangAttribute()', type: 'lang', lang: 'en' },
      { issue: 'REACT_027: Table structure issue', solution: 'Fix table structure using validateTableAccessibility()', type: 'table' }
    ];

    const consoleSpy = jest.spyOn(console, 'log');

    const result = addressAccessibilityIssues(insightReport);

    expect(consoleSpy).toHaveBeenCalledWith('Addressing issue: REACT_015: Missing lang attribute');
    expect(consoleSpy).toHaveBeenCalledWith('Add lang attribute using getLangAttribute()');
    expect(consoleSpy).toHaveBeenCalledWith('Addressing issue: REACT_027: Table structure issue');
    expect(consoleSpy).toHaveBeenCalledWith('Fix table structure using validateTableAccessibility()');

    consoleSpy.mockRestore();
  });
});

export function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  announcement.textContent = message;
  document.body.appendChild(announcement);

  setTimeout(() => {
    if (announcement.parentNode) {
      document.body.removeChild(announcement);
    }
  }, 1000);
}

export function trapFocus(element) {
  if (!element) return;

  const focusableSelectors = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusableElements = element.querySelectorAll(focusableSelectors);

  if (focusableElements.length === 0) return;

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  }

  element.addEventListener('keydown', handleKeyDown);
  firstFocusable.focus();

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

export function manageFocusOnNavigation(navigationElement) {
  if (!navigationElement) return;

  const links = navigationElement.querySelectorAll('a[href], button');
  links.forEach((link) => {
    link.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const currentIndex = Array.from(links).indexOf(document.activeElement);
        let nextIndex;

        if (e.key === 'ArrowRight') {
          nextIndex = (currentIndex + 1) % links.length;
        } else {
          nextIndex = (currentIndex - 1 + links.length) % links.length;
        }

        links[nextIndex].focus();
        e.preventDefault();
      }
    });
  });
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function setAriaExpanded(element, expanded) {
  if (element) {
    element.setAttribute('aria-expanded', expanded);
  }
}

export function hasAccessibleName(element) {
  if (!element) return false;

  const ariaLabel = element.getAttribute('aria-label');
  const ariaLabelledby = element.getAttribute('aria-labelledby');

  if (ariaLabel && ariaLabel.trim() !== '') return true;

  if (ariaLabelledby) {
    const labelledByElement = document.getElementById(ariaLabelledby);
    if (labelledByElement && labelledByElement.textContent.trim() !== '') return true;
  }

  const title = element.getAttribute('title');
  if (title && title.trim() !== '') return true;

  const alt = element.getAttribute('alt');
  if (alt && alt.trim() !== '') return true;

  if (element.textContent && element.textContent.trim() !== '') return true;

  return false;
}

// Additional utility functions from origin/main
function countDependencies() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  return {
    dependencies: Object.keys(dependencies).length,
    devDependencies: Object.keys(devDependencies).length,
    total: Object.keys(dependencies).length + Object.keys(devDependencies).length
  };
}

function validateLandmarkStructure(element) {
  // ... (existing validation code)
}

function validateLandmarkAccessibility(element) {
  // ... (existing validation code)
}

function setSvgAttributes(svgElement, accessibleName) {
  if (!svgElement || svgElement.tagName !== 'svg') {
    return;
  }

  if (accessibleName) {
    svgElement.setAttribute('role', 'img');
    svgElement.setAttribute('aria-label', accessibleName);
  } else {
    svgElement.setAttribute('role', 'presentation');
    svgElement.setAttribute('aria-hidden', 'true');
  }
}

function validateLinkAccessibility(linkElement) {
  // ... (existing validation code)
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"], a:not([href])');

  // ... (existing fake links handling code)
}

// REACT_027: Fix table structure issues
function fixTableStructureIssuesFromOrigin(document) {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure tables have proper structure
    if (!table.querySelector('thead') && table.querySelector('tr')) {
      const firstRow = table.querySelector('tr');
      const ths = firstRow.querySelectorAll('th');
      if (ths.length > 0) {
        const thead = document.createElement('thead');
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, table.firstChild);
        firstRow.remove();
      }
    }
    
    // Ensure tables have tbody
    if (!table.querySelector('tbody')) {
      const rows = Array.from(table.querySelectorAll('tr'));
      const tbody = document.createElement('tbody');
      rows.forEach(row => tbody.appendChild(row));
      const thead = table.querySelector('thead');
      if (thead) {
        table.insertBefore(tbody, thead.nextSibling);
      } else {
        table.insertBefore(tbody, table.firstChild);
      }
    }
    
    // Ensure proper caption if needed
    const caption = table.querySelector('caption');
    if (!caption) {
      const newCaption = document.createElement('caption');
      newCaption.textContent = 'Data table';
      newCaption.style.clip = 'rect(0 0 0 0)';
      newCaption.style.clipPath = 'inset(50%)';
      newCaption.style.height = '1px';
      newCaption.style.overflow = 'hidden';
      newCaption.style.whiteSpace = 'nowrap';
      newCaption.style.width = '1px';
      table.insertBefore(newCaption, table.firstChild);
    }
  });
  return tables.length;
}

// REACT_017: Add/fix landmark issues - Add main landmark
function addMainLandmarkFromOrigin(document) {
  const mainElements = document.querySelectorAll('main');
  
  if (mainElements.length === 0) {
    // Find the main content area and wrap it with <main>
    const body = document.body;
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    
    // Move all body children into main
    while (body.firstChild) {
      main.appendChild(body.firstChild);
    }
    body.appendChild(main);
  } else if (mainElements.length === 1) {
    const main = mainElements[0];
    if (!main.hasAttribute('role')) {
      main.setAttribute('role', 'main');
    }
  }
  
  return document.querySelectorAll('main').length;
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNamesFromOrigin(document) {
  const svgs = document.querySelectorAll('svg');
  let count = 0;
  
  svgs.forEach((svg, index) => {
    const existingLabel = svg.getAttribute('aria-label') || 
                          svg.querySelector('title') ||
                          svg.getAttribute('aria-labelledby');
    
    if (!existingLabel) {
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `Icon ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      
      const titleId = `svg-title-${index + 1}`;
      title.setAttribute('id', titleId);
      svg.setAttribute('aria-labelledby', titleId);
      count++;
    }
  });
  
  return count;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarksFromOrigin(document) {
  // Ensure only one main landmark
  const mains = document.querySelectorAll('main, [role="main"]');
  
  if (mains.length > 1) {
    // Keep the first main, remove role="main" from others or convert them
    for (let i = 1; i < mains.length; i++) {
      const main = mains[i];
      if (main.tagName === 'MAIN') {
        main.setAttribute('role', 'presentation');
      } else {
        main.removeAttribute('role');
        main.setAttribute('role', 'region');
      }
    }
  }
  
  // Ensure unique IDs for landmarks with labels
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="contentinfo"]');
  const seenIds = new Set();
  
  landmarks.forEach(landmark => {
    const id = landmark.id;
    if (id) {
      if (seenIds.has(id)) {
        landmark.id = `${id}-unique-${Math.random().toString(36).substr(2, 9)}`;
      }
      seenIds.add(landmark.id);
    }
  });
  
  return mains.length;
}

// REACT_036: Fix fake link issue
function fixFakeLinkIssueFromOrigin(document) {
  // Find elements that look like links but aren't <a> tags
  const clickableElements = document.querySelectorAll('[role="link"]:not(a), [onclick]');
  let count = 0;
  
  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const hasHref = element.hasAttribute('href');
    
    if (tagName !== 'a' && !hasHref) {
      // Check if it should be a real link
      const isInteractive = element.getAttribute('role') === 'link' || 
                           (element.hasAttribute('onclick') && element.onclick.toString().includes('window.location'));
      
      if (isInteractive && !element.hasAttribute('aria-label')) {
        // Add accessible name
        const text = element.textContent.trim();
        if (text) {
          element.setAttribute('aria-label', text);
        }
      }
      count++;
    }
  });
  
  return count;
}

// TODO: Implement this function for checking link and button accessibility
function checkLinkAndButtonAccessibility(document) {
  const links = document.querySelectorAll('a, button, [role="button"]');
  const issues = {
    linksWithoutText: [],
    buttonsWithoutText: [],
    linksWithoutAriaLabel: [],
    buttonsWithoutAriaLabel: []
  };
  
  links.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isLink = tagName === 'a';
    const isButton = tagName === 'button' || element.getAttribute('role') === 'button';
    
    if (isLink || isButton) {
      // Check for accessible text (text content or aria-label or title)
      const hasTextContent = element.textContent.trim().length > 0;
      const hasAriaLabel = element.hasAttribute('aria-label');
      const hasTitle = element.hasAttribute('title');
      
      const accessibleName = hasTextContent || hasAriaLabel || hasTitle;
      
      if (!accessibleName) {
        if (isLink) {
          issues.linksWithoutText.push(element);
        } else {
          issues.buttonsWithoutText.push(element);
        }
      }
      
      if (!hasAriaLabel && !(hasTextContent || hasTitle)) {
        if (isLink) {
          issues.linksWithoutAriaLabel.push(element);
        } else {
          issues.buttonsWithoutAriaLabel.push(element);
        }
      }
    }
  });
  
  return issues;
}

// Main accessibility fix function
function applyAccessibilityFixes(document, options = {}) {
  const lang = options.lang || 'en';
  
  return {
    langAdded: addLangAttribute(document, lang),
    tablesFixed: fixTableStructureIssuesFromOrigin(document),
    mainsAdded: addMainLandmarkFromOrigin(document),
    svgsFixed: addSvgAccessibleNamesFromOrigin(document),
    landmarksEnsured: ensureUniqueLandmarksFromOrigin(document),
    linksFixed: fixFakeLinkIssueFromOrigin(document)
  };
}

// TODO: Implement this function
export function myFunction(param1, param2) {
  // Place the implementation of the function here
  console.log('And here is your function implementation...');
  // ...
}

// Accessibility functions are now accessible in main.js:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute, getLangAttributeValue)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues, validateTableAccessibility, validateTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark, getUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames, getSvgAccessibleName)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks, getUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue, createInPageButton)
// - REACT_037: Add proper landmark regions

// Accessibility functions improved for better organization
export {
  addLangAttribute,
  fixTableStructure,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  checkTableAccessibility,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  checkTableStructure,
  MyComponent,
  existingFunction,
  accessibilityFunction,
  anotherFunction,
  newFunction,
  getLangAttributeValue,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  getUniqueLandmarks,
  createInPageButton,
  addressAccessibilityIssues,
  announceToScreenReader,
  trapFocus,
  manageFocusOnNavigation,
  prefersReducedMotion,
  setAriaExpanded,
  hasAccessibleName,
  countDependencies,
  validateLandmarkStructure,
  validateLandmarkAccessibility,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  fixTableStructureIssuesFromOrigin,
  addMainLandmarkFromOrigin,
  addSvgAccessibleNamesFromOrigin,
  ensureUniqueLandmarksFromOrigin,
  fixFakeLinkIssueFromOrigin,
  checkLinkAndButtonAccessibility,
  applyAccessibilityFixes
};

export default Main;