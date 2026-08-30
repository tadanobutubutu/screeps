// Existing code from main.js
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';

// Initial setup
const app = document.getElementById('root') || document.getElementById('app');

// Improve accessibility
if (app) {
  app.setAttribute('role', 'main');
  app.setAttribute('aria-label', 'Main application');
}

// New function as per the issue - renderIndexView implementation
export function renderIndexView(container = app) {
  if (!container) {
    console.error('No root container found for rendering. Please ensure an element with id "root" or "app" exists.');
    return null;
  }
  
  try {
    const root = createRoot(container);
    root.render(<App />);
    return root;
  } catch (error) {
    console.error('Error rendering index view:', error);
    return null;
  }
}

// Placeholder function for landmarks (from original TODO)
function processLandmarks(landmarks) {
  // Assuming landmarks is an array of objects with 'name' and 'coordinates' properties
  landmarks.forEach(landmark => {
    // Perform any necessary operations on the landmark
    // For example, you might want to add it to a map or a database, or calculate the distance to another landmark
    console.log(`Adding landmark: ${landmark.name} at coordinates ${JSON.stringify(landmark.coordinates)}`);
    // Add your logic here
  });
}

// Assuming there's a way to retrieve landmarks, you would call the function like this:
// const allLandmarks = getLandmarks(); // Placeholder function
// processLandmarks(allLandmarks);

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

function function3() {
  // TODO: Implement new function3 logic here
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
    <div>
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  );
}

export function getUniqueLandmarkName(baseName, existingNames) {
  if (!existingNames.has(baseName)) {
    return baseName;
  }
  let counter = 2;
  let newName = `${baseName} ${counter}`;
  while (existingNames.has(newName)) {
    counter++;
    newName = `${baseName} ${counter}`;
  }
  return newName;
}

export function validateLandmarks() {
  const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
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
  if (!element) return false;
  const href = element.getAttribute('href');
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  return tagName === 'a' && href && href !== '#' && href !== 'javascript:void(0)';
}

export function addScopeToHeaders() {
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      const parentRow = header.closest('tr');
      const isFirstCell = parentRow && parentRow.cells[0] === header;
      const isHeaderRow = parentRow && parentRow.parentElement && parentRow.parentElement.tagName === 'THEAD';
      
      if (isHeaderRow) {
        header.setAttribute('scope', 'col');
      } else if (isFirstCell) {
        header.setAttribute('scope', 'row');
      }
    }
  });
}

export function addressAccessibilityIssues(issues) {
  issues.forEach(issue => {
    console.log(`Addressing issue: ${issue.issue}`);
    // TODO: Implement solution to the issue
    console.log(`Solution: ${issue.solution}`);
    // ... code to apply the solution ...
  });
}

export function myFunction() {
  // Your code for the new function goes here
}

function newFunction() {
  // implementation of new function
}

// Export Screeps bot functions
module.exports = { addProperLandmarkRegions: processLandmarks };

// Export accessibility functions
module.exports.getUniqueLandmarkName = getUniqueLandmarkName;
module.exports.validateLandmarks = validateLandmarks;
module.exports.addSvgAccessibleName = addSvgAccessibleName;
module.exports.isValidLink = isValidLink;
module.exports.addScopeToHeaders = addScopeToHeaders;
module.exports.addressAccessibilityIssues = addressAccessibilityIssues;
module.exports.newFunction = newFunction;
module.exports.renderIndexView = renderIndexView;

// <!--- END ADDITIONAL FUNCTION --->
// <!--- START MODIFIED FUNCTION --->
function modifiedFunction() {
  // Modified implementation of the function
  console.log('This function has been modified.');
}

// <!--- END MODIFIED FUNCTION --->
//_Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: ... -->
// <!--- Any other modifications or additions go here --->

// ============================================
// NEW ACCESSIBILITY FUNCTIONS (from issue)
// ============================================

// REACT_015: Get lang attribute from HTML element
export function getLangAttribute() {
  const htmlElement = document.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

// REACT_015 & REACT_036: Get or create person name for accessible naming
export function personName(person) {
  if (!person) return null;
  if (typeof person === 'string') return person;
  return person.name || person.displayName || person.username || null;
}

// REACT_036: Create in-page button to fix fake link issues
export function createInPageButton(linkElement, options = {}) {
  if (!linkElement) return null;
  
  const { onClick, buttonText, ariaLabel } = options;
  const isFakeLink = linkElement.tagName !== 'BUTTON' && 
                     linkElement.getAttribute('role') !== 'button' &&
                     !linkElement.href;
  
  if (!isFakeLink) return linkElement;
  
  const button = document.createElement('button');
  button.textContent = buttonText || linkElement.textContent;
  if (ariaLabel) button.setAttribute('aria-label', ariaLabel);
  if (onClick) button.addEventListener('click', onClick);
  
  // Copy styles from original element
  const computedStyle = window.getComputedStyle(linkElement);
  button.style.cssText = computedStyle.cssText;
  
  // Replace the fake link with the button
  linkElement.parentNode.replaceChild(button, linkElement);
  
  return button;
}

// REACT_041: Get SVG accessible name from title element
export function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;
  
  // Check for title element inside SVG
  const titleElement = svgElement.querySelector('title');
  if (titleElement && titleElement.textContent.trim()) {
    return titleElement.textContent.trim();
  }
  
  // Check aria-label on SVG
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check aria-labelledby reference
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const referencedElement = document.getElementById(ariaLabelledby);
    if (referencedElement) return referencedElement.textContent.trim();
  }
  
  return null;
}

// REACT_017: Validate landmark structure
export function validateLandmarkStructure() {
  const issues = [];
  
  // Check for proper landmark roles
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    const tagName = landmark.tagName.toLowerCase();
    
    // Validate landmark placement
    if (role === 'banner' && tagName !== 'header') {
      issues.push({
        element: landmark,
        message: 'Banner landmark should be in a <header> element.',
        severity: 'warning'
      });
    }
    
    if (role === 'navigation' && tagName !== 'nav') {
      issues.push({
        element: landmark,
        message: 'Navigation landmark should be in a <nav> element.',
        severity: 'warning'
      });
    }
    
    if (role === 'main' && tagName !== 'main') {
      issues.push({
        element: landmark,
        message: 'Main landmark should be in a <main> element.',
        severity: 'warning'
      });
    }
    
    if (role === 'contentinfo' && tagName !== 'footer') {
      issues.push({
        element: landmark,
        message: 'Contentinfo landmark should be in a <footer> element.',
        severity: 'warning'
      });
    }
    
    // Check for proper naming
    const hasLabel = landmark.getAttribute('aria-label') || 
                     landmark.getAttribute('aria-labelledby') ||
                     landmark.querySelector('h1, h2, h3, h4, h5, h6');
    
    if (!hasLabel && landmarks.length > 1) {
      issues.push({
        element: landmark,
        message: `Multiple ${role} landmarks should have unique accessible names.`,
        severity: 'warning'
      });
    }
  });
  
  return issues;
}

// REACT_017: Validate landmarks (additional check for landmark roles)
export function validateLandmark() {
  const issues = [];
  const landmarks = document.querySelectorAll('header, nav, main, footer, aside, section');
  
  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    const hasRole = landmark.getAttribute('role');
    const hasLabel = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby');
    
    // Check if semantic HTML elements have appropriate landmark roles
    if (tagName === 'nav' && !hasRole) {
      landmark.setAttribute('role', 'navigation');
    }
    
    if (tagName === 'main' && !hasRole) {
      landmark.setAttribute('role', 'main');
    }
    
    if (tagName === 'aside' && !hasRole) {
      landmark.setAttribute('role', 'complementary');
    }
    
    // Report issues for missing labels on multiple landmarks
    const sameTypeLandmarks = document.querySelectorAll(`${tagName}:not([aria-label]):not([aria-labelledby])`);
    if (sameTypeLandmarks.length > 1) {
      issues.push({
        element: landmark,
        message: `Multiple ${tagName} elements without accessible names.`,
        severity: 'warning'
      });
    }
  });
  
  return issues;
}