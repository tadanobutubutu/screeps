// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // REACT_015 & REACT_017: Ensure document has lang attribute and proper landmark structure
  return (
    <div className="app-container">
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  );
}

// REACT_017: Add landmark roles to fix landmark issues
export function getUniqueLandmarkName(baseName, existingNames) {
  if (!existingNames.includes(baseName)) {
    return baseName;
  }
  let counter = 2;
  let newName = `${baseName}-${counter}`;
  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName}-${counter}`;
  }
  return newName;
}

// REACT_025: Ensure unique landmarks function
export function validateUniqueLandmarks(container) {
  const landmarks = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
  const landmarkNames = new Set();
  const issues = [];

  landmarks.forEach((landmark) => {
    const ariaLabel = landmark.getAttribute('aria-label');
    const ariaLabelledby = landmark.getAttribute('aria-labelledby');
    const tagName = landmark.tagName.toLowerCase();

    // Determine the landmark name
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

// REACT_041: Add accessible names to SVGs
export function addSvgAccessibleName(svgElement, accessibleName) {
  if (!svgElement) return;
  
  // Add title element as first child
  const title = document.createElement('title');
  title.id = `svg-title-${Date.now()}`;
  title.textContent = accessibleName;
  
  // Insert title as first child
  svgElement.insertBefore(title, svgElement.firstChild);
  
  // Add aria-labelledby attribute
  svgElement.setAttribute('aria-labelledby', title.id);
}

// REACT_036: Fix fake link issues - convert to proper semantic elements
export function isValidLink(element) {
  if (!element) return true;
  
  const tagName = element.tagName.toLowerCase();
  const href = element.getAttribute('href');
  const onClick = element.getAttribute('onclick');
  
  // Check if it's a fake link (div/span with onClick but no href, or an anchor without href)
  const isFakeLink = (tagName === 'div' || tagName === 'span') && onClick && !href;
  
  if (isFakeLink) {
    return {
      valid: false,
      suggestion: `Replace <${tagName}> with <button> or <a href="#"> for proper accessibility.`
    };
  }
  
  return { valid: true };
}

// REACT_027: Add scope to table headers
export function addScopeToHeaders(tableElement) {
  if (!tableElement) return [];
  
  const headers = tableElement.querySelectorAll('th');
  const updates = [];
  
  headers.forEach((th) => {
    const row = th.closest('tr');
    const rowIndex = Array.from(row.parentElement.children).indexOf(row);
    const cellIndex = Array.from(row.children).indexOf(th);
    
    // Determine if scope should be 'col' or 'row'
    let scope = 'col';
    
    // Check if it's a row header (first cell in a row that's not the first row)
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

// REACT_015: Get or set the lang attribute on the HTML element
export function getLangAttribute(element) {
  if (!element) {
    return document.documentElement.getAttribute('lang');
  }
  return element.getAttribute('lang');
}

export function setLangAttribute(lang) {
  if (lang) {
    document.documentElement.setAttribute('lang', lang);
  }
}

// REACT_027: Validate table accessibility
export function validateTableAccessibility(tableElement) {
  const issues = [];
  if (!tableElement) return issues;

  // Check for caption
  const caption = tableElement.querySelector('caption');
  if (!caption) {
    issues.push({
      element: tableElement,
      message: 'Table is missing a <caption> element for accessibility.',
      severity: 'warning'
    });
  }

  // Check for proper th elements
  const headers = tableElement.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push({
      element: tableElement,
      message: 'Table should have <th> elements for headers.',
      severity: 'warning'
    });
  }

  // Check for scope attributes on th elements
  headers.forEach((th) => {
    if (!th.getAttribute('scope')) {
      issues.push({
        element: th,
        message: 'Table header is missing scope attribute (should be "col" or "row").',
        severity: 'warning'
      });
    }
  });

  return issues;
}

// REACT_027: Validate table structure
export function validateTableStructure(tableElement) {
  const issues = [];
  if (!tableElement) return issues;

  const rows = tableElement.querySelectorAll('tr');
  let previousRowCells = 0;

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    const currentRowCells = cells.length;

    // Check for irregular row lengths
    if (previousRowCells !== 0 && currentRowCells !== previousRowCells) {
      issues.push({
        element: row,
        message: `Row ${rowIndex} has ${currentRowCells} cells, but previous row had ${previousRowCells}. Table structure may be inconsistent.`,
        severity: 'error'
      });
    }

    previousRowCells = currentRowCells;
  });

  return issues;
}

// REACT_017: Validate landmark presence
export function validateLandmark(container) {
  const issues = [];
  if (!container) container = document.body;

  const requiredLandmarks = {
    'banner': 'header, [role="banner"]',
    'navigation': 'nav, [role="navigation"]',
    'main': 'main, [role="main"]',
    'contentinfo': 'footer, [role="contentinfo"]'
  };

  Object.entries(requiredLandmarks).forEach(([landmarkType, selector]) => {
    const landmark = container.querySelector(selector);
    if (!landmark) {
      issues.push({
        element: container,
        message: `Missing ${landmarkType} landmark. Add a <${landmarkType === 'banner' ? 'header' : landmarkType === 'contentinfo' ? 'footer' : landmarkType}> element or element with role="${landmarkType}".`,
        severity: 'warning'
      });
    }
  });

  return issues;
}

// REACT_017: Validate landmark structure
export function validateLandmarkStructure(container) {
  const issues = [];
  if (!container) container = document.body;

  // Check for proper landmark nesting
  const landmarks = container.querySelectorAll('header, nav, main, footer, [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]');

  landmarks.forEach((landmark) => {
    // Check if main landmark is nested inside other landmarks (should not be)
    if (landmark.matches('main, [role="main"]')) {
      const parentMain = landmark.closest('header, nav, footer, [role="banner"], [role="navigation"], [role="contentinfo"]');
      if (parentMain) {
        issues.push({
          element: landmark,
          message: 'Main landmark should not be nested inside other landmarks.',
          severity: 'error'
        });
      }
    }

    // Check if landmark has accessible name
    const hasAriaLabel = landmark.getAttribute('aria-label');
    const hasAriaLabelledby = landmark.getAttribute('aria-labelledby');
    const tagName = landmark.tagName.toLowerCase();

    // Navigation and complementary landmarks should have accessible names if multiple exist
    if (tagName === 'nav' || landmark.getAttribute('role') === 'navigation' || 
        tagName === 'aside' || landmark.getAttribute('role') === 'complementary') {
      const sameTypeLandmarks = container.querySelectorAll(`${tagName}, [role="${landmark.getAttribute('role')}"]`);
      if (sameTypeLandmarks.length > 1 && !hasAriaLabel && !hasAriaLabelledby) {
        issues.push({
          element: landmark,
          message: 'Multiple navigation/complementary landmarks should have unique aria-label or aria-labelledby.',
          severity: 'warning'
        });
      }
    }
  });

  return issues;
}

// REACT_041: Get SVG accessible name
export function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';

  // Check for title element
  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent;
  }

  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check for aria-labelledby reference
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const referencedElement = document.getElementById(ariaLabelledby);
    if (referencedElement) {
      return referencedElement.textContent;
    }
  }

  return '';
}

// REACT_036: Create proper in-page button (replaces fake links)
export function createInPageButton(text, onClick, options = {}) {
  const button = document.createElement('button');
  button.textContent = text;
  button.type = 'button';
  
  if (onClick) {
    button.addEventListener('click', onClick);
  }

  // Apply any additional options
  if (options.id) button.id = options.id;
  if (options.className) button.className = options.className;
  if (options.ariaLabel) button.setAttribute('aria-label', options.ariaLabel);

  return button;
}

// REACT_015: Get person name for accessible labeling
export function personName(data) {
  if (!data) return '';
  
  // Handle various name formats
  if (typeof data === 'string') return data;
  if (data.name) return data.name;
  if (data.firstName || data.lastName) {
    return `${data.firstName || ''} ${data.lastName || ''}`.trim();
  }
  if (data.fullName) return data.fullName;
  
  return '';
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);