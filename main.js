import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

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

  // REACT_015: Set the lang attribute on the HTML element
  useEffect(() => {
    document.documentElement.setAttribute('lang', 'en');
  }, []);

  // REACT_017: Add landmark roles and fix landmark issues
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

const wrapPrimaryContentInMain = (document) => {
  if (!document || !document.body) {
    return document;
  }

  // Check if main element already exists with main-content id
  const existingMain = document.getElementById('main-content');
  if (existingMain) {
    return document;
  }

  // Check if any main element exists
  const anyMain = document.querySelector('main');
  if (anyMain) {
    // Add id to existing main element if it doesn't have one
    if (!anyMain.id) {
      anyMain.id = 'main-content';
    }
    return document;
  }

  // Create main element and wrap appropriate content
  const main = document.createElement('main');
  main.id = 'main-content';
  main.setAttribute('role', 'main');

  const body = document.body;

  // Get all direct children of body
  const bodyChildren = Array.from(body.childNodes).filter(node => node.nodeType === 1);

  if (bodyChildren.length > 0) {
    // Move children to main element
    bodyChildren.forEach(child => {
      main.appendChild(child);
    });

    // Append main to body
    body.appendChild(main);
  }

  return document;
};

const addSkipLink = (document) => {
  if (!document || !document.body) {
    return document;
  }

  const existingSkipLink = document.getElementById('skip-link');
  if (existingSkipLink) {
    return document;
  }

  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.id = 'skip-link';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  skipLink.style.position = 'absolute';
  skipLink.style.top = '-40px';
  skipLink.style.left = '0';
  skipLink.style.backgroundColor = '#000';
  skipLink.style.color = '#fff';
  skipLink.style.padding = '8px 16px';
  skipLink.style.zIndex = '10000';
  skipLink.style.transition = 'top 0.3s';

  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });

  if (document.body) {
    document.body.insertBefore(skipLink, document.body.firstChild);
  } else {
    document.documentElement.insertBefore(skipLink, document.documentElement.firstChild);
  }

  return document;
};

const getAccessibleName = (node) => {
  if (!node) {
    return null;
  }

  if (node.hasAttribute('aria-labelledby')) {
    const labelledById = node.getAttribute('aria-labelledby');
    const labelledElement = document.getElementById(labelledById);
    return labelledElement ? labelledElement.textContent : null;
  }

  if (node.hasAttribute('aria-label')) {
    return node.getAttribute('aria-label');
  }

  if (node.tagName === 'INPUT' && node.type !== 'submit' && node.type !== 'reset') {
    if (node.labels && node.labels.length > 0) {
      return node.labels[0].textContent;
    }
  }

  const titleEl = node.querySelector('title');
  if (titleEl && titleEl.textContent) {
    return titleEl.textContent;
  }

  if (node.textContent && node.textContent.trim()) {
    return node.textContent.trim();
  }

  return null;
};

const setAccessibleName = (node, accessibleName) => {
  if (!node) {
    return;
  }

  if (typeof node.setAttribute === 'function') {
    node.setAttribute('aria-label', accessibleName);
    return;
  }

  if (node.querySelector) {
    const titleEl = node.querySelector('title');
    if (titleEl) {
      titleEl.textContent = accessibleName;
    }

    const ariaLabelEl = node.querySelector('[aria-label]');
    if (ariaLabelEl && typeof ariaLabelEl.setAttribute === 'function') {
      ariaLabelEl.setAttribute('aria-label', accessibleName);
    }
  }
};

const addProperLandmarkRegions = (document) => {
  const landmarkTypes = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  landmarkTypes.forEach(type => {
    const elements = document.querySelectorAll(`[role="${type}"]`);
    elements.forEach((element) => {
      if (!element.id) {
        let idSuffix = 1;
        const existingIds = Array.from(document.querySelectorAll('*[id]')).map(el => el.id);
        let id = `${type}-${idSuffix}`;
        while (existingIds.includes(id)) {
          idSuffix++;
          id = `${type}-${idSuffix}`;
        }
        element.id = id;
      }
    });
  });
};

// Add the updated addressAccessibilityIssues function
const addressAccessibilityIssues = (document) => {
  if (!document) {
    return document;
  }

  wrapPrimaryContentInMain(document);
  addSkipLink(document);
  addLangAttribute(document);
  fixTableStructureIssues(document);
  ensureUniqueLandmarks(document);
  addSvgAccessibleNames(document);
  fixFakeLinkIssue(document);

  return document;
};

// New function to address accessibility issues from insight report
function newFunction() {
  // implementation of new function
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

// Accessibility Helper Functions

/**
 * Announces a message to screen readers using ARIA live regions
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

/**
 * Traps focus within a specified element (useful for modals)
 * @param {HTMLElement} element - The container element to trap focus within
 * @returns {Function} - Cleanup function to remove the trap
 */
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  firstElement?.focus();

  return () => element.removeEventListener('keydown', handleKeyDown);
}

/**
 * Manages focus when navigating between sections
 * @param {string} selector - CSS selector of the target section
 */
function manageFocusOnNavigation(selector) {
  const target = document.querySelector(selector);
  if (target) {
    target.setAttribute('tabindex', '-1');
    target.focus();
    target.removeAttribute('tabindex');
  }
}

/**
 * Checks if user prefers reduced motion
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Safely manages aria-expanded state
 * @param {HTMLElement} trigger - The element that triggers the toggle
 * @param {boolean} isExpanded - Current expanded state
 */
function setAriaExpanded(trigger, isExpanded) {
  if (trigger) {
    trigger.setAttribute('aria-expanded', String(isExpanded));
  }
}

/**
 * Validates that an interactive element has proper accessible name
 * @param {HTMLElement} element - The element to validate
 * @returns {boolean}
 */
function hasAccessibleName(element) {
  return !!(
    element.textContent?.trim() ||
    element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    element.getAttribute('alt') ||
    element.getAttribute('title')
  );
}

// New functions to be added
const addLangAttribute = (document) => {
  const html = document.documentElement;
  if (html && !html.lang) {
    html.lang = 'en';
  }
  return document;
};

const fixTableStructureIssues = (document) => {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
      }
    }

    if (table.querySelector('tbody') === null) {
      const rows = Array.from(table.querySelectorAll('tr'));
      if (rows.length > 0) {
        const newTbody = document.createElement('tbody');
        rows.forEach((row) => newTbody.appendChild(row));
        table.appendChild(newTbody);
      }
    }

    const thead = table.querySelector('thead');
    if (thead) {
      thead.querySelectorAll('th').forEach(th => th.setAttribute('scope', 'col'));
    }

    const tbodies = table.querySelectorAll('tbody');
    tbodies.forEach(tbody => {
      tbody.querySelectorAll('th').forEach(th => th.setAttribute('scope', 'row'));
    });
  });
  return document;
};

const ensureUniqueLandmarks = (document) => {
  const landmarkTypes = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  const usedIds = new Set();

  landmarkTypes.forEach(type => {
    const elements = document.querySelectorAll(`[role="${type}"]`);
    elements.forEach((element) => {
      if (!element.id) {
        let idSuffix = 1;
        const existingIds = Array.from(document.querySelectorAll('*[id]')).map(el => el.id);
        let id = `${type}-${idSuffix}`;
        while (existingIds.includes(id)) {
          idSuffix++;
          id = `${type}-${idSuffix}`;
        }
        element.id = id;
      }
    });
  });
};

const addSvgAccessibleNames = (document) => {
  const svgs = document.querySelectorAll('svg');
  let svgIndex = 0;
  svgs.forEach((svg) => {
    if (!svg.querySelector('title') && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = document.createElement('title');
      title.textContent = `SVG ${svgIndex + 1}`;
      title.id = `svg-title-${svgIndex + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
    svgIndex++;
  });
  return document;
};

const fixFakeLinkIssue = (document) => {
  const fakeLinks = document.querySelectorAll('[href="#"], [role="button"]:not(button):not(a)');
  fakeLinks.forEach(link => {
    // Add role="link" to ensure it's recognized as a link by screen readers
    if (!link.hasAttribute('role') || link.getAttribute('role') === 'button') {
      link.setAttribute('role', 'link');
    }
    // Ensure the link has accessible name
    if (link.getAttribute('role') === 'link' && !link.textContent.trim()) {
      link.setAttribute('aria-label', 'Link');
    }
    // Remove href="#" and add href="#" with proper handling
    if (link.getAttribute('href') === '#') {
      link.setAttribute('href', 'javascript:void(0);');
    }
  });
  return document;
};

// Export all functions for use in tests and other parts of the application
export {
  newFunction,
  wrapPrimaryContentInMain,
  addSkipLink,
  getAccessibleName,
  setAccessibleName,
  addProperLandmarkRegions,
  addressAccessibilityIssues,
  addLangAttribute,
  fixTableStructureIssues,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  announceToScreenReader,
  trapFocus,
  manageFocusOnNavigation,
  prefersReducedMotion,
  setAriaExpanded,
  hasAccessibleName,
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);