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
    <div role="application" aria-label="Main application container">
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  );
}

// Address accessibility issues from insight report
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

// Validate landmarks for accessibility
export function validateLandmarks(container = document) {
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

// Add accessible name to SVG elements
export function addSvgAccessibleName(svgElement, accessibleName) {
  if (!svgElement) return;

  // Remove any existing title elements
  const existingTitle = svgElement.querySelector('title');
  if (existingTitle) {
    existingTitle.remove();
  }

  // Add title element as first child
  const title = document.createElement('title');
  title.id = `svg-title-${Date.now()}`;
  title.textContent = accessibleName;

  // Insert title as first child
  svgElement.insertBefore(title, svgElement.firstChild);

  // Add aria-labelledby attribute
  svgElement.setAttribute('aria-labelledby', title.id);
}

// Validate links for accessibility
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

// Add scope attribute to table headers
export function addScopeToHeaders(table) {
  if (!table) return;
  
  const headers = table.querySelectorAll('th');
  headers.forEach((header) => {
    if (!header.hasAttribute('scope')) {
      const row = header.parentElement;
      const rowHeaders = row.querySelectorAll('th');
      const headerIndex = Array.from(rowHeaders).indexOf(header);
      
      if (headerIndex === 0) {
        header.setAttribute('scope', 'row');
      } else {
        header.setAttribute('scope', 'col');
      }
    }
  });
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
  const landmarks = container.querySelectorAll('header, nav, main, footer, [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]');
  landmarks.forEach((landmark) => {
    const role = landmark.getAttribute('role');
    const tagName = landmark.tagName.toLowerCase();
    
    if (!role && ['header', 'nav', 'main', 'footer'].includes(tagName)) {
      const roleMapping = {
        header: 'banner',
        nav: 'navigation',
        main: 'main',
        footer: 'contentinfo'
      };
      
      issues.push({
        issue: 'REACT_017',
        element: landmark,
        message: `Landmark missing explicit role attribute`,
        solution: `Add role="${roleMapping[tagName]}" to ${tagName} element`
      });
    }
  });
  
  // REACT_025: Ensure unique landmark names
  const landmarkValidation = validateLandmarks(container);
  landmarkValidation.forEach((issue) => {
    issues.push({
      issue: 'REACT_025',
      element: issue.element,
      message: issue.message,
      solution: 'Ensure each landmark has a unique name via aria-label'
    });
  });
  
  // REACT_036: Fix fake link issues
  const fakeLinks = container.querySelectorAll('[role="link"]:not(a)');
  fakeLinks.forEach((link) => {
    const tabIndex = link.getAttribute('tabindex');
    if (tabIndex === null || tabIndex === undefined) {
      issues.push({
        issue: 'REACT_036',
        element: link,
        message: 'Fake link missing keyboard support',
        solution: 'Add tabindex="0" to make the element focusable via keyboard'
      });
    }
  });
  
  // REACT_041: Add accessible names to SVGs
  const svgs = container.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  svgs.forEach((svg) => {
    const hasTitle = svg.querySelector('title');
    if (!hasTitle) {
      issues.push({
        issue: 'REACT_041',
        element: svg,
        message: 'SVG missing accessible name',
        solution: 'Add a title element or aria-label to the SVG'
      });
    }
  });
  
  // Add ARIA labels to form controls
  const formControls = container.querySelectorAll('input:not([aria-label]):not([aria-labelledby]), select:not([aria-label]):not([aria-labelledby]), textarea:not([aria-label]):not([aria-labelledby])');
  formControls.forEach((control) => {
    const label = control.id ? container.querySelector(`label[for="${control.id}"]`) : null;
    if (!label) {
      issues.push({
        issue: 'ARIA_FORM_LABEL',
        element: control,
        message: 'Form control missing accessible name',
        solution: 'Add aria-label, aria-labelledby, or associate a label element'
      });
    }
  });
  
  // Apply solutions for the issues
  issues.forEach((issue) => {
    console.log(`Addressing issue: ${issue.issue}`);
    console.log(`Solution: ${issue.solution}`);
    
    // Apply the solution based on the issue type
    switch (issue.issue) {
      case 'REACT_015':
        if (!htmlElement.hasAttribute('lang')) {
          htmlElement.setAttribute('lang', 'en');
        }
        break;
      case 'REACT_017':
        const roleMap = {
          header: 'banner',
          nav: 'navigation',
          main: 'main',
          footer: 'contentinfo'
        };
        const tagName = issue.element.tagName.toLowerCase();
        if (!issue.element.hasAttribute('role') && roleMap[tagName]) {
          issue.element.setAttribute('role', roleMap[tagName]);
        }
        break;
      case 'REACT_036':
        if (!issue.element.hasAttribute('tabindex')) {
          issue.element.setAttribute('tabindex', '0');
        }
        break;
      case 'REACT_041':
        const svgTitle = document.createElement('title');
        svgTitle.id = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        svgTitle.textContent = 'SVG Image';
        issue.element.insertBefore(svgTitle, issue.element.firstChild);
        issue.element.setAttribute('aria-labelledby', svgTitle.id);
        break;
      default:
        break;
    }
  });
  
  return issues;
}

// Announce message to screen readers
export function announceToScreenReader(message, priority = 'polite') {
  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
  announcer.textContent = message;
  document.body.appendChild(announcer);
  
  setTimeout(() => {
    announcer.remove();
  }, 1000);
}

// Trap focus within an element (for modals, dialogs, etc.)
export function trapFocus(element) {
  if (!element) return;
  
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
    
    if (e.key === 'Escape') {
      element.dispatchEvent(new CustomEvent('escape-pressed'));
    }
  };
  
  element.addEventListener('keydown', handleKeyDown);
  
  if (firstFocusable) {
    firstFocusable.focus();
  }
  
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

// Manage focus on navigation
export function manageFocusOnNavigation() {
  const mainContent = document.querySelector('main, [role="main"]');
  
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-