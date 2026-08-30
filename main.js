// Core module for accessibility features and component rendering
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';

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
    fetchData();
  }, []);

  // REACT_017: Add landmark roles to fix landmark issues
  // REACT_025: Ensure unique landmarks
  // REACT_036: Fix fake link issues
  // REACT_041: Add accessible names to SVGs

  // REACT_015 & REACT_017: Ensure document has lang attribute and proper landmark structure
  return (
    <div className="app">
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  );
}

export function getUniqueLandmarkName(existingNames) {
  if (existingNames.includes('main')) {
    return 'main-content';
  }
  let counter = 2;
  let newName = `main-${counter}`;
  while (existingNames.includes(newName)) {
    counter++;
    newName = `main-${counter}`;
  }
  return newName;
}

export function validateUniqueLandmarks() {
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

export function validateLandmarks() {
  return validateUniqueLandmarks();
}

export function validateTableAccessibility(tableElement) {
  const issues = [];

  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    issues.push({
      element: tableElement,
      message: 'Element is not a valid table.',
      severity: 'error'
    });
    return issues;
  }

  // Check for caption
  const caption = tableElement.querySelector('caption');
  if (!caption || !caption.textContent.trim()) {
    issues.push({
      element: tableElement,
      message: 'Table is missing a <caption> element with descriptive text.',
      severity: 'warning'
    });
  }

  // Check for headers
  const headers = tableElement.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push({
      element: tableElement,
      message: 'Table is missing <th> elements to define header cells.',
      severity: 'error'
    });
  }

  // Check headers for scope or id
  headers.forEach((header) => {
    const hasScope = header.hasAttribute('scope');
    const hasId = header.hasAttribute('id');
    if (!hasScope && !hasId) {
      issues.push({
        element: header,
        message: 'Table header cell is missing a "scope" or "id" attribute.',
        severity: 'warning'
      });
    }
  });

  // Check for table role
  const hasRole = tableElement.getAttribute('role') === 'table';
  if (!hasRole) {
    issues.push({
      element: tableElement,
      message: 'Table is missing role="table" attribute.',
      severity: 'warning'
    });
  }

  return issues;
}

export function validateTableStructure(tableElement) {
  const issues = [];

  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    issues.push({
      element: tableElement,
      message: 'Element is not a valid table.',
      severity: 'error'
    });
    return issues;
  }

  // Check for thead, tbody, tfoot
  const hasThead = tableElement.querySelector('thead') !== null;
  const hasTbody = tableElement.querySelector('tbody') !== null;

  if (!hasThead) {
    issues.push({
      element: tableElement,
      message: 'Table is missing a <thead> section.',
      severity: 'warning'
    });
  }

  if (!hasTbody) {
    issues.push({
      element: tableElement,
      message: 'Table is missing a <tbody> section.',
      severity: 'warning'
    });
  }

  // Check for proper row structure
  const rows = tableElement.querySelectorAll('tr');
  if (rows.length === 0) {
    issues.push({
      element: tableElement,
      message: 'Table contains no rows.',
      severity: 'error'
    });
  }

  // Check for nested tables
  const nestedTables = tableElement.querySelectorAll('table table');
  if (nestedTables.length > 0) {
    issues.push({
      element: tableElement,
      message: 'Table contains nested tables, which can be confusing for screen readers.',
      severity: 'warning'
    });
  }

  return issues;
}

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

export function isValidLink(element) {
  // Check if element is an anchor with href
  const isAnchor = element.tagName === 'A' && element.href;
  // Check if it's a button acting as a link
  const isFakeLink = element.getAttribute('role') === 'link' && (element.href || element.onclick);
  return isAnchor || isFakeLink;
}

export function addScopeToHeaders(table) {
  const headers = table.querySelectorAll('th');
  headers.forEach((header) => {
    header.setAttribute('scope', 'col');
  });
}

export function addressAccessibilityIssues(issues) {
  issues.forEach((issue) => {
    console.log(`Addressing issue: ${issue.issue}`);
    // TODO: Implement solution to the issue
    console.log(`Solution: ${issue.solution}`);
    // ... code to apply the solution ...
  });
}

function newFunction() {
  // implementation of new function
}

export const accessibilityUtils = newFunction;

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

export {
  function3,
  App,
  getUniqueLandmarkName,
  validateUniqueLandmarks,
  validateLandmarks,
  validateTableAccessibility,
  validateTableStructure,
  addSvgAccessibleName,
  isValidLink,
  addScopeToHeaders,
  addressAccessibilityIssues,
  announceToScreenReader,
  trapFocus,
  manageFocusOnNavigation,
  prefersReducedMotion,
  setAriaExpanded,
  hasAccessibleName,
  newFunction
};