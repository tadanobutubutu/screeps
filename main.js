// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// - REACT_041: Add accessible names to SVGs
// (Added functions for REACT_017 and new REACT_025)

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';

// REACT_015: Add lang attribute to HTML element
export function addLangAttribute(document, lang = 'en') {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
  return html;
}

// REACT_027: Fix table structure issues
export function fixTableStructureIssues(document) {
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

export function getUniqueName(baseName, existingNames) {
  if (!existingNames || existingNames.length === 0 || !existingNames.includes(baseName)) {
    return baseName;
  }
  let counter = 2;
  let newName = `${baseName} ${counter}`;
  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName} ${counter}`;
  }
  return newName;
}

export function ensureUniqueLandmarks(container = document) {
  const landmarks = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
  const landmarkNames = new Set();
  const issues = [];

  landmarks.forEach((landmark) => {
    const ariaLabel = landmark.getAttribute('aria-label');
    const ariaLabelledby = landmark.getAttribute('aria-labelledby');
    const tagName = landmark.tagName.toLowerCase();

    let landmarkName = ariaLabel || ariaLabelledby || tagName;

    if (landmarkNames.has(landmarkName)) {
      issues.push({
        element: landmark,
        message: `Duplicate landmark found: "${landmarkName}". Use unique aria-label or aria-labelledby.`,
        severity: 'warning'
      });
    } else {
      landmarkNames.add(landmarkName);
    }
  });

  return issues;
}

export function addSvgAccessibleName(svgElement, accessibleName) {
  if (!svgElement) return;

  const title = document.createElement('title');
  title.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
  title.textContent = accessibleName;

  svgElement.insertBefore(title, svgElement.firstChild);

  svgElement.setAttribute('aria-labelledby', title.id);
}

export function isValidLink(element) {
  if (!element) return true;

  const tagName = element.tagName.toLowerCase();
  const href = element.getAttribute('href');

  const onClick = element.getAttribute('onclick');

  const isFakeLink = (tagName === 'div' || tagName === 'span') && onClick && !href;

  if (isFakeLink) {
    return {
      valid: false,
      suggestion: `Replace <${tagName}> with <button> or <a href="#"> for proper accessibility.`
    };
  }

  return { valid: true };
}

export function addScopeToHeaders(tableElement) {
  if (!tableElement) return [];

  const headers = tableElement.querySelectorAll('th');
  const updates = [];

  headers.forEach((th) => {
    const row = th.closest('tr');
    const rowIndex = Array.from(row.parentNode.children).indexOf(row);
    const cellIndex = Array.from(row.children).indexOf(th);

    let scope = 'col';

    if (cellIndex === 0 && rowIndex > 0) {
      scope = 'row';
    }

    if (!th.getAttribute('scope')) {
      th.setAttribute('scope', scope);
      updates.push({
        element: th,
        scope: scope,
        position: { row: rowIndex, col: cellIndex }
      });
    }
  });

  return updates;
}

export function createInPageButtons(container) {
  // Your code for creating in-page buttons goes here

  const buttonsContainer = document.createElement("div");
  buttonsContainer.setAttribute("id", "in-page-buttons");
  buttonsContainer.style.position = "fixed";
  buttonsContainer.style.bottom = "0";
  buttonsContainer.style.left = "0";
  buttonsContainer.style.zIndex = "1000";

  const button1 = document.createElement("button");
  button1.textContent = "Button 1";
  button1.addEventListener("click", () => {
    // Add your button 1 logic here
  });

  const button2 = document.createElement("button");
  button2.textContent = "Button 2";
  button2.addEventListener("click", () => {
    // Add your button 2 logic here
  });

  buttonsContainer.appendChild(button1);
  buttonsContainer.appendChild(button2);

  container.appendChild(buttonsContainer);
}

// REACT_017: Add landmark roles to fix landmark issues
export function getMainLandmark(document) {
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
export function addSvgAccessibleNames(document) {
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

// REACT_036: Fix fake link issue
export function fixFakeLinkIssue(document) {
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

export function addressAccessibilityIssues(insightReport) {
  // Assuming insightReport is an array of objects with 'issue' and 'solution' properties
}

export function applyAccessibilityFixes(document, options = {}) {
  const lang = options.lang || 'en';

  return {
    langAdded: addLangAttribute(document, lang),
    tablesFixed: fixTableStructureIssues(document),
    mainsAdded: addMainLandmark(document),
    svgsFixed: addSvgAccessibleNames(document),
    landmarksEnsured: ensureUniqueLandmarks(document),
    linksFixed: fixFakeLinkIssue(document)
  };
}

// New exported function to make affected accessibility functions accessible
/**
 * Returns an object containing all accessibility helper functions for external use
 * @returns {Object} - Object with accessibility functions
 */
export function getAccessibilityFunctions() {
  return {
    getUniqueLandmarkName,
    validateUniqueLandmarks,
    addSvgAccessibleName,
    isValidLink,
    addScopeToHeaders,
    addressAccessibilityIssues,
    announceToScreenReader,
    trapFocus,
    manageFocusOnNavigation,
    prefersReducedMotion,
    setAriaExpanded,
    hasAccessibleName
  };
}

// Add new function for creating in-page buttons
export function createInPageButtons(container) {
  // Your code for creating in-page buttons goes here

  const buttonsContainer = document.createElement("div");
  buttonsContainer.setAttribute("id", "in-page-buttons");
  buttonsContainer.style.position = "fixed";
  buttonsContainer.style.bottom = "0";
  buttonsContainer.style.left = "0";
  buttonsContainer.style.zIndex = "1000";

  const button1 = document.createElement("button");
  button1.textContent = "Button 1";
  button1.addEventListener("click", () => {
    // Add your button 1 logic here
  });

  const button2 = document.createElement("button");
  button2.textContent = "Button 2";
  button2.addEventListener("click", () => {
    // Add your button 2 logic here
  });

  buttonsContainer.appendChild(button1);
  buttonsContainer.appendChild(button2);

  container.appendChild(buttonsContainer);
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);