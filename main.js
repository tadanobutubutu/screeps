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

  return (
    <div>
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
  let newName = `${baseName} ${counter}`;
  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName} ${counter}`;
  }
  return newName;
}

// REACT_025: Ensure unique landmarks function
export function ensureUniqueLandmarks(container = document) {
  const landmarks = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"], header, nav, main, footer');
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

// REACT_028: Validate landmark accessibility
export function validateLandmark(landmark) {
  const issues = [];
  
  if (!landmark) {
    return issues;
  }
  
  const tagName = landmark.tagName?.toLowerCase();
  const role = landmark.getAttribute('role');
  const ariaLabel = landmark.getAttribute('aria-label');
  const ariaLabelledby = landmark.getAttribute('aria-labelledby');
  const title = landmark.getAttribute('title');
  
  // Check for valid landmark role or semantic element
  const validLandmarkRoles = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search', 'form', 'region'];
  const validLandmarkTags = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'form', 'search'];
  
  const isLandmarkRole = role && validLandmarkRoles.includes(role);
  const isLandmarkTag = validLandmarkTags.includes(tagName);
  
  if (!isLandmarkRole && !isLandmarkTag) {
    issues.push({
      element: landmark,
      message: 'Element is not a recognized landmark',
      severity: 'error'
    });
  }
  
  // Check for accessible name
  if (!ariaLabel && !ariaLabelledby && !title) {
    issues.push({
      element: landmark,
      message: 'Landmark missing accessible name (aria-label, aria-labelledby, or title)',
      severity: 'warning'
    });
  }
  
  return issues;
}

// REACT_041: Add accessible names to SVGs
export function addSvgAccessibleName(svgElement, accessibleName) {
  if (!svgElement) return;

  // Remove any existing title elements
  const existingTitle = svgElement.querySelector('title');
  if (existingTitle) {
    existingTitle.remove();
  }

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
  if (!element) return false;
  
  const tagName = element.tagName.toLowerCase();
  const href = element.getAttribute('href');
  
  // Check if it's an anchor tag with valid href
  if (tagName === 'a') {
    return href && href !== '#' && href !== '';
  }
  
  // Check for role="link"
  const role = element.getAttribute('role');
  if (role === 'link') {
    return true;
  }
  
  return false;
}

// REACT_027: Add scope to table headers
export function addScopeToHeaders(tableElement) {
  if (!tableElement) return [];
  
  const headers = tableElement.querySelectorAll('th');
  const updates = [];
  
  headers.forEach((th) => {
    const row = th.closest('tr');
    const rowIndex = row ? Array.from(row.parentNode.children).indexOf(row) : 0;
    const cellIndex = row ? Array.from(row.children).indexOf(th) : 0;
    
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

function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);
}

function manageFocusOnNavigation() {
  const mainContent = document.querySelector('[role="main"]');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();
  }
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function setAriaExpanded(element, expanded) {
  if (element) {
    element.setAttribute('aria-expanded', expanded);
  }
}

function hasAccessibleName(element) {
  return !!(element.getAttribute('aria-label') || element.getAttribute('aria-labelledby') || element.textContent.trim());
}

// Accessibility issue addressing functions
function addressIssues(issues) {
  issues.forEach((issue) => {
    console.log(`Addressing issue: ${issue.issue}`);
    console.log(`Solution: ${issue.solution}`);
  });
}

function newFunction() {
  // implementation of new function
}

export function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export function addAriaLabel(element, label) {
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

export function renderDependencyGraphs() {
  // Logic to render dependency graphs
}

export function AppWithAccessibility() {
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

  return (
    <div role="application" aria-label="Main application container">
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  );
}

// Address accessibility issues from insight report
export function addressAccessibilityIssues(container = document) {
  const issues = [];
  
  // REACT_015: Ensure document has lang attribute
  const htmlElement = container.querySelector('html') || document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    issues.push({
      issue: 'REACT_015',
      element: htmlElement,
      message: 'Document missing lang attribute',
      solution: 'Add lang attribute to html element for screen readers'
    });
  }
  
  // REACT_017: Add landmark roles and verify proper landmark structure
  const landmarks = container.querySelectorAll('nav, main, footer, [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]');
  landmarks.forEach((landmark) => {
    const role = landmark.getAttribute('role');
    const tagName = landmark.tagName.toLowerCase();
    
    if (!role && ['header', 'nav',