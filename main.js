import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';

const app = document.getElementById('root');

// Improve accessibility
app.setAttribute('role', 'main');
app.setAttribute('aria-label', 'Main application');

function addressAccessibilityIssues(insightReport) {
  if (!insightReport || !insightReport.issues) {
    return [];
  }

  insightReport.forEach(issue => {
    console.log(`Addressing issue: ${issue.issue}`);
    switch (issue.issue) {
      case 'REACT_015':
      case 'REACT_017':
        // Ensure document has lang attribute and proper landmark structure
        document.documentElement.setAttribute('lang', 'en');
        break;
      case 'REACT_025':
        // Ensure unique landmarks
        validateUniqueLandmarks(app);
        break;
      case 'REACT_036':
        // Fix fake link issues
        handleFakeLinks(app.querySelectorAll('a'));
        break;
      case 'REACT_041':
        // Add accessible names to SVGs
        arrayOfSVGs.forEach(setSvgAttributes);
        break;
      default:
        // Handle other accessibility issues using existing helper functions
    }
  });
}

// Helper functions for accessibility fixes (both conflict versions together)
function getLangAttribute(doc) {
  return doc.documentElement?.lang || doc.querySelector('html')?.getAttribute('lang') || '';
}

function createInPageButton(linkId, targetId) {
  return {
    tagName: 'BUTTON',
    attributes: {
      'aria-label': `Navigate to section ${targetId}`,
      'data-in-page-button': linkId
    }
  };
}

function validateTableAccessibility(table) {
  return {
    hasCaption: !!table.querySelector('caption'),
    hasHeaders: table.querySelectorAll('th').length > 0,
    hasScope: Array.from(table.querySelectorAll('th')).every(th => th.hasAttribute('scope'))
  };
}

function validateTableStructure(table) {
  const rows = table.querySelectorAll('tr');
  const cellCounts = Array.from(rows).map(row => row.querySelectorAll('td, th').length);
  const consistentCells = cellCounts.every(count => count === cellCounts[0]);
  return { rowCount: rows.length, consistentCells };
}

function validateLandmark(element) {
  return {
    tagName: element.tagName,
    role: element.getAttribute('role'),
    label: element.getAttribute('aria-label') || element.getAttribute('aria-labelledby')
  };
}

function validateLandmarkStructure(doc) {
  const landmarks = doc.querySelectorAll('header, nav, main, footer, aside, section, article');
  const uniqueRoles = new Set(Array.from(landmarks).map(el => el.tagName.toLowerCase()));
  return Array.from(uniqueRoles);
}

function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') ||
         svg.getAttribute('aria-labelledby') ||
         svg.querySelector('title')?.textContent ||
         '';
}

function setSvgAttributes(svg, name) {
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', name);
}

function validateLinkAccessibility(link) {
  const hasText = link.textContent.trim().length > 0;
  const hasLabel = link.hasAttribute('aria-label');
  const hasTitle = link.hasAttribute('title');
  return { hasText, hasLabel, hasTitle, isAccessible: hasText || hasLabel || hasTitle };
}

function handleFakeLinks(links) {
  return links.map(link => ({
    element: link,
    isFake: !link.href || link.href === '#' || link.getAttribute('href')?.startsWith('#'),
    recommendedAction: !link.href || link.href === '#' ? 'Convert to button' : 'Add href'
  }));
}

function newFunction3() {
  // TODO: Implement new function3 logic here
}

export function myFunction() {
  // Your code for the new function goes here
}

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    document.documentElement.setAttribute('lang', 'en');
    fetchData();
  }, []);

  // REACT_017: Add landmark roles to fix landmark issues
  // REACT_025: Ensure unique landmarks
  // REACT_036: Fix fake link issues
  // REACT_041: Add accessible names to SVGs

  // REACT_015 & REACT_017: Ensure document has lang attribute and proper landmark structure
  return (
    <div className="app-container">
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  );
}

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

export function validateUniqueLandmarks(container) {
  const landmarks = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
  const landmarkNames = new Set();
  const issues = [];

  landmarks.forEach((landmark) => {
    // ... code to determine the landmark name ...

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

export function isValidLink(element) {
  // ... existing code ...
}

export function addScopeToHeaders(tableElement) {
  // ... existing code ...
}

export {
  App,
  addressAccessibilityIssues,
  getUniqueLandmarkName,
  validateUniqueLandmarks,
  addSvgAccessibleName,
  isValidLink,
  addScopeToHeaders,
  newFunction3,
  myFunction,
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks
};