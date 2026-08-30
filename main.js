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
    document.documentElement.setAttribute('lang', 'en');
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
    <div className="app-container">
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  );
}

export function getUniqueLandmarkName(baseName, existingNames) {
  if (existingNames.indexOf(baseName) === -1) {
    return baseName;
  }
  let counter = 2;
  let newName = `${baseName} ${counter}`;
  while (existingNames.indexOf(newName) !== -1) {
    counter++;
    newName = `${baseName} ${counter}`;
  }
  return newName;
}

export function validateUniqueLandmarks(container) {
  const landmarks = container.querySelectorAll('[role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
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
  title.id = `${accessibleName.replace(/\s+/g, '-').toLowerCase()}-title`;
  title.textContent = accessibleName;
  
  svgElement.insertBefore(title, svgElement.firstChild);
  
  svgElement.setAttribute('aria-labelledby', title.id);
}

export function isValidLink(element) {
  if (!element) return true;
  
  const tagName = element.tagName.toLowerCase();
  const href = element.getAttribute('href');
  const onClick = element.getAttribute('onClick');
  
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
    const cellIndex = Array.from(row.cells).indexOf(th);
    
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

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

function manageFocusOnNavigation() {
  const mainContent = document.querySelector('main');
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
function addressAccessibilityIssues(insightReport) {
  insightReport.forEach((issue) => {
    console.log(`Addressing issue: ${issue.issue}`);
    console.log(`Solution: ${issue.solution}`);
  });
}

function newFunction() {
  // implementation of new function
}

export function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `generated-id-${Date.now()}`;
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
    document.documentElement.setAttribute('lang', 'en');
    fetchData();
  }, []);

  return (
    <div className="app-container">
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  );
}

export {
  AppWithAccessibility,
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
  hasAccessibleName,
  newFunction,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs
};

const container = document.querySelector('#root');
const root = createRoot(container);
root.render(<App />);