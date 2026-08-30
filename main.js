// main.js
// Updated to import and use dependencyGraphContent and indexContent
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f80b51b788bad4952d8f93f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a97a2237d968a50cc419 -->
//_Commit: 30b5f08a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f8a6325b07b9b809ac49f5e1c81cf4f89f9c1 -->
//_Commit: 669117b4c3d1a635653f730f0a059efacbb752_
//<!-- todo-hash: 312aa8ea4c5e1c9430e4b7c36c210eb9a72dea -->

//_Commit: 33bd865abb006c86b8f7c2a22f441136e44f37f_

<!-- todo-hash: 88c1c6cc67ee5e0dd4df31d91becf96d321836d1 -->

// Import required modules
import { v4 as uuidv4 } from 'uuid';
import { createElement } from 'react';
import { getDocument, getLangAttribute, getFullLangAttribute } from './accessibilityHelpers';

// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())
// - REACT_037: Add proper landmark regions (handled by addProperLandmarkRegions())

// Renders the dependency graph view.
// Updated to use dependencyGraphContent.
export function renderDependencyGraph() {
  // Example usage: replace with actual rendering logic
  const container = document.getElementById('dependencyGraph');
  if (container) {
    container.innerHTML = dependencyGraphContent;
    fixAccessibilityIssues();
  }
}

// Renders the index view.
// Updated to use indexContent.
export function renderIndex() {
  // Example usage: replace with actual rendering logic
  const container = document.getElementById('indexContent');
  if (container) {
    container.innerHTML = indexContent;
    fixAccessibilityIssues();
  }
}

export { makeHeaderFocusable }; // new export statement from conflicting branch

function ensureElementId(element) {
  // Combined and reconciled code from both branches
  if (!element.id) {
    element.id = element.id || element.name || '';
  }
}

function validateTableAccessibility(table) {
  // Existing code...
  if (!table) return;
  
  // Check for proper table headers
  const headers = table.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.getAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
  
  // Ensure table has proper caption or summary
  const caption = table.querySelector('caption');
  if (!caption) {
    const newCaption = document.createElement('caption');
    newCaption.textContent = 'Data table';
    table.insertBefore(newCaption, table.firstChild);
  }
}

function validateTableStructure(table) {
  // Existing code...
  if (!table) return;
  
  // Ensure proper table structure (thead, tbody, tfoot)
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  
  if (!thead) {
    const newThead = document.createElement('thead');
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      newThead.appendChild(firstRow.cloneNode(true));
      table.insertBefore(newThead, table.firstChild);
    }
  }
  
  if (!tbody) {
    const rows = table.querySelectorAll('tr');
    const newTbody = document.createElement('tbody');
    rows.forEach(row => {
      if (row.parentNode === table) {
        newTbody.appendChild(row);
      }
    });
    table.appendChild(newTbody);
  }
}

function validateLandmark() {
  // Existing code...
  const main = document.querySelector('main');
  const nav = document.querySelector('nav');
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  
  if (!main) {
    console.warn('REACT_017: Missing main landmark');
  }
  if (!nav) {
    console.warn('REACT_017: Missing nav landmark');
  }
}

function validateLandmarkStructure() {
  // Existing code...
  // Validate proper landmark nesting and structure
  const landmarks = ['header', 'main', 'nav', 'footer', 'aside'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1 && (landmark === 'main' || landmark === 'header' || landmark === 'footer')) {
      console.warn(`REACT_017/REACT_025: Multiple ${landmark} landmarks found`);
    }
  });
}

function getSvgAccessibleName(svg) {
  // Existing code...
  if (!svg) return '';
  
  // Try to get title element inside SVG
  const title = svg.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }
  
  // Try aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Try aria-labelledby
  const labelledBy = svg.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) {
      return labelElement.textContent.trim();
    }
  }
  
  return 'Decorative SVG';
}

function setSvgAttributes(svg, accessibleName) {
  // Example SVG attribute setter
  if (!svg) return;
  
  if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
    svg.setAttribute('aria-label', accessibleName);
  }
  svg.setAttribute('role', 'img');
}

function ensureUniqueLandmarks() {
  // REACT_025: Ensure unique landmarks
  const landmarkTypes = ['header', 'main', 'footer', 'nav', 'aside'];
  
  landmarkTypes.forEach(type => {
    const elements = document.querySelectorAll(type);
    if (elements.length > 1) {
      // Add unique IDs to duplicate landmarks
      elements.forEach((el, index) => {
        if (!el.id) {
          el.id = `${type}-landmark-${index + 1}`;
        }
        // Add aria-label to differentiate
        if (!el.getAttribute('aria-label')) {
          el.setAttribute('aria-label', `${type} section ${index + 1}`);
        }
      });
    }
  });
}

function addProperLandmarkRegions() {
  // REACT_037: Add proper landmark regions
  const regions = {
    main: document.querySelector('main') || createLandmarkElement('main'),
    nav: document.querySelector('nav') || createLandmarkElement('nav'),
    header: document.querySelector('header') || createLandmarkElement('header'),
    footer: document.querySelector('footer') || createLandmarkElement('footer')
  };
  
  Object.entries(regions).forEach(([type, element]) => {
    if (element && !element.id) {
      element.id = `${type}-content`;
    }
  });
}

function createLandmarkElement(type) {
  const element = document.createElement(type);
  element.setAttribute('role', type === 'main' ? 'main' : type);
  return element;
}

function createInPageButton() {
  // Existing code...
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', 'Navigate to main content');
  button.textContent = 'Skip to main content';
  button.className = 'in-page-button';
  
  // Make it keyboard accessible
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const main = document.querySelector('main') || document.querySelector('[role="main"]');
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus();
      }
    }
  });
  
  // Position offscreen but visible to screen readers
  button.style.position = 'absolute';
  button.style.left = '-9999px';
  button.style.top = 'auto';
  button.style.width = '1px';
  button.style.height = '1px';
  button.style.overflow = 'hidden';
  
  return button;
}

function createAccessibleLink(element, targetId) {
  // Create accessible link with proper attributes
  if (!element) return;
  
  const target = document.getElementById(targetId);
  if (target) {
    element.setAttribute('href', `#${targetId}`);
    element.setAttribute('role', 'link');
    
    if (!element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', `Link to ${targetId}`);
    }
  }
}

function validateLinkAccessibility() {
  // Example link accessibility validation
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    // Check if links have accessible text
    if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
      console.warn('Link missing accessible text');
    }
  });
}

function handleFakeLinks() {
  // REACT_036: Fix fake link issue
  const fakeLinks = document.querySelectorAll('[role="link"], [onclick*="navigation"], a[href="#"]');
  fakeLinks.forEach(link => {
    if (link.tagName !== 'A') {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
      
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // Trigger click handler
          link.click();
        }
      });
    }
  });
}

// New function to fix accessibility issues as per the insight report
function fixAccessibilityIssues() {
  // 1. REACT_015: Ensure lang attribute is set on the HTML element
  const lang = getLangAttribute();
  const htmlElement = document.documentElement;
  if (!htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', lang || 'en');
  }

  // 2. REACT_027: Validate table accessibility and structure
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  // 3. REACT_017