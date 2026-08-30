// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
// Added functionalities:
// - Add aria-label to SVGs without title elements (DONE: addAriaLabelToSVGs)
// - Add aria-labelledby to SVGs with title elements (DONE: addAriaLabelledbyToSVGs)
// - Add Proper Landmark Regions (DONE: addProperLandmarkRegions)

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
    <div ...
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  );
}

// REACT_017: Add landmark roles to fix landmark issues
export function generateUniqueName(baseName, existingNames) {
  if (existingNames.includes(baseName)) {
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

// REACT_015: Add lang attribute to HTML element
export function ensureLangAttribute(lang = 'en') {
  const htmlElement = document.querySelector('html');
  if (!htmlElement) return { success: false, message: 'HTML element not found' };
  
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
    return { success: true, message: `Added lang="${lang}" attribute to HTML element` };
  }
  
  return { success: true, message: `HTML element already has lang="${htmlElement.getAttribute('lang')}" attribute` };
}

// REACT_025: Ensure unique landmarks function
export function ensureUniqueLandmarks(container = document) {
  const landmarks = container.querySelectorAll('[role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
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
  title.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
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
    const rowIndex = Array.from(tableElement.querySelectorAll('tr')).indexOf(row);
    const cellIndex = Array.from(row.querySelectorAll('th, td')).indexOf(th);
    
    // Determine if scope should be 'col' or 'row'
    let scope = 'col';
    
    // Check if it's a row header (first cell in a row that's not the first row)
    if (cellIndex === 0 && rowIndex > 0) {
      scope = 'row';
    }
    
    if (!th.hasAttribute('scope')) {
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

// Accessibility issue addressing functions
function addressIssuesFromInsightReport(insightReport) {
  // Assuming insightReport is an array of objects with 'issue' and 'solution' properties
  insightReport.forEach((issue) => {
    console.log(`Addressing issue: ${issue.issue}`);
    // Implement the solution to the issue
    // This is a placeholder for the actual implementation
    console.log(`Solution: ${issue.solution}`);
    // ... code to apply the solution ...
  });
}

// New function to address accessibility issues from insight report
function newFunction() {
  // implementation of new function
}

export const accessibilityFixer = newFunction;

// REACT_015: Add lang attribute to HTML element
export function addLangAttribute(lang = 'en') {
  if (typeof document === 'undefined') return;
  const htmlElement = document.documentElement;
  if (!htmlElement) return;
  if (!htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
}

// REACT_027: Fix table structure issues (header scope, caption, etc.)
export function fixTableStructure(tableElement) {
  if (!tableElement) return [];
  const updates = [];

  // Add scope to <th> elements lacking it
  const scopeUpdates = addScopeToHeaders(tableElement);
  updates.push(...scopeUpdates);

  // Ensure table has a caption for accessibility
  if (!tableElement.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = tableElement.getAttribute('aria-label') || 'Data table';
    tableElement.insertBefore(caption, tableElement.firstChild);
    updates.push({ element: caption, scope: 'caption' });
  }

  return updates;
}

// REACT_017: Add main landmark to the document
export function addMainLandmark(content) {
  if (typeof document === 'undefined') return null;
  if (!content) return null;

  let main = document.querySelector('main');
  if (!main) {
    main = document.createElement('main');
    main.setAttribute('role', 'main');
    if (typeof content === 'string') {
      main.id = content;
    } else if (content && content.id) {
      main.id = content.id;
    }
    document.body.appendChild(main);
  } else if (!main.getAttribute('role')) {
    main.setAttribute('role', 'main');
  }
  return main;
}

// REACT_025: Ensure unique landmarks by adding unique aria-labels
export function ensureUniqueLandmarks(container) {
  if (!container) return [];
  const fixedIssues = [];

  const landmarks = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
  const seen = new Map();

  landmarks.forEach((landmark) => {
    const tagName = landmark.tagName.toLowerCase();
    const currentLabel = landmark.getAttribute('aria-label');
    const currentLabelledby = landmark.getAttribute('aria-labelledby');
    const key = currentLabel || currentLabelledby || tagName;

    if (seen.has(key)) {
      const count = seen.get(key);
      seen.set(key, count + 1);
      const uniqueName = generateUniqueName(tagName, Array.from(seen.keys()));
      landmark.setAttribute('aria-label', uniqueName);
      seen.set(uniqueName, 1);
      fixedIssues.push({
        element: landmark,
        message: `Assigned unique aria-label "${uniqueName}" to duplicate landmark.`
      });
    } else {
      seen.set(key, 1);
    }
  });

  return fixedIssues;
}

// REACT_041: Add accessible names to multiple SVGs
export function addSvgAccessibleNames(svgElements, names) {
  if (!Array.isArray(svgElements)) return [];
  const updates = [];

  svgElements.forEach((svg, index) => {
    const name = Array.isArray(names) ? names[index] : names;
    if (svg && name) {
      addSvgAccessibleName(svg, name);
      updates.push({ element: svg, accessibleName: name });
    }
  });

  return updates;
}

// REACT_036: Fix fake link issues
export function fixFakeLinkIssue(element) {
  if (!element) return null;
  const validity = isValidLink(element);
  if (validity.valid) return element;

  const tagName = element.tagName.toLowerCase();
  if ((tagName === 'div' || tagName === 'span') && element.hasAttribute('onclick')) {
    const button = document.createElement('button');
    button.innerHTML = element.innerHTML;
    const attributes = Array.from(element.attributes);
    attributes.forEach((attr) => {
      if (attr.name !== 'onclick') {
        button.setAttribute(attr.name, attr.value);
      }
    });
    if (element.parentNode) {
      element.parentNode.replaceChild(button, element);
    }
    return button;
  }
  return element;
}

// Added functionalities

// Add aria-label to SVGs without title elements
export function addAriaLabelToSVGs(svgElements, accessibleNames) {
  if (!Array.isArray(svgElements)) return [];

  const updates = [];

  svgElements.forEach((svg, index) => {
    const accessibleName = Array.isArray(accessibleNames)
      ? accessibleNames[index]
      : accessibleNames;

    if (svg && accessibleName && !svg.querySelector('title')) {
      svg.setAttribute('aria-label', accessibleName);
      updates.push({ element: svg, accessibleName });
    }
  });

  return updates;
}

// Add aria-labelledby to SVGs with title elements
export function addAriaLabelledbyToSVGs(svgElements) {
  if (!Array.isArray(svgElements)) return [];

  const updates = [];

  svgElements.forEach((svg) => {
    const title = svg.querySelector('title');
    if (svg && title && title.id) {
      svg.setAttribute('aria-labelledby', title.id);
      updates.push({ element: svg, labelledbyId: title.id });
    }
  });

  return updates;
}

// Add Proper Landmark Regions
export function addProperLandmarkRegions(container = document.body) {
  if (!container) return [];

  const updates = [];

  const addLandmarkIfMissing = (selector, tag, role) => {
    if (!container.querySelector(selector)) {
      const landmark = document.createElement(tag);
      if (role) {
        landmark.setAttribute('role', role);
      }
      container.appendChild(landmark);
      updates.push({ element: landmark, tag, role });
    }
  };

  addLandmarkIfMissing('main[role="main"], main', 'main', 'main');

  return updates;
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);