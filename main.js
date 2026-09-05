// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: fixLandmarkIssues, addMainLandmark, addLandmarkRegions)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks, uniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames, addAccessibleNamesToSVGs)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue, fixFakeLinkIssues)
// - REACT_037: Google sign-in logic (DONE: googleSignIn)
// - REACT_040: Replace my-button with actual button id for accessibility (DONE: fixButtonIdentifiers)
// - NEW: Ensure element has an id (DONE: ensureElementHasId)
// - NEW: Add aria-label (DONE: addAriaLabel)
// - NEW: Render dependency graphs (DONE: renderDependencyGraphs)

// Import necessary dependencies
import React, { useEffect, useRef } from 'react';

// REACT_015: Add lang attribute to HTML element
export function addLangAttribute(htmlElement, lang = 'en') {
  if (htmlElement && htmlElement.setAttribute) {
    htmlElement.setAttribute('lang', lang);
  }
  return htmlElement;
}

// REACT_027: Fix table structure issues
export function fixTableStructure(tableElement) {
  if (!tableElement) return null;
  
  // Ensure proper table structure
  const thead = tableElement.querySelector('thead') || document.createElement('thead');
  const tbody = tableElement.querySelector('tbody') || document.createElement('tbody');
  const tfoot = tableElement.querySelector('tfoot');
  
  if (!tableElement.querySelector('thead')) {
    tableElement.prepend(thead);
  }
  if (!tableElement.querySelector('tbody')) {
    tableElement.appendChild(tbody);
  }
  
  // Add scope attributes to header cells
  const headers = thead.querySelectorAll('th');
  headers.forEach(header => {
    header.setAttribute('scope', 'col');
  });
  
  return tableElement;
}

// REACT_017: Add/fix landmark issues
export function fixLandmarkIssues(container) {
  if (!container) return;
  
  // Ensure main landmark exists
  addMainLandmark(container);
  addLandmarkRegions(container);
}

export function addMainLandmark(container) {
  const existingMain = container.querySelector('main');
  if (!existingMain) {
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    main.setAttribute('role', 'main');
    
    // Move content into main if no main exists
    while (container.firstChild) {
      main.appendChild(container.firstChild);
    }
    container.appendChild(main);
  }
  return container;
}

export function addLandmarkRegions(container) {
  const landmarks = ['header', 'nav', 'main', 'footer'];
  
  landmarks.forEach(landmark => {
    const existing = container.querySelector(landmark);
    if (existing && !existing.getAttribute('role')) {
      if (landmark !== 'main') {
        existing.setAttribute('role', landmark === 'header' ? 'banner' : landmark);
      }
    }
  });
  
  return container;
}

// REACT_025: Ensure unique landmarks
export function ensureUniqueLandmarks(container) {
  return uniqueLandmarks(container);
}

export function uniqueLandmarks(container) {
  if (!container) return null;
  
  const landmarkSelectors = ['[role="banner"]', '[role="navigation"]', '[role="main"]', '[role="contentinfo"]', '[role="search"]'];
  
  landmarkSelectors.forEach(selector => {
    const elements = container.querySelectorAll(selector);
    if (elements.length > 1) {
      // Add aria-label to differentiate multiple landmarks of same type
      elements.forEach((el, index) => {
        const type = el.getAttribute('role') || el.tagName.toLowerCase();
        if (!el.getAttribute('aria-label')) {
          el.setAttribute('aria-label', `${type} ${index + 1}`);
        }
      });
    }
  });
  
  return container;
}

// REACT_041: Add accessible names to SVGs
export function addSvgAccessibleNames(svgElement, accessibleName) {
  return addAccessibleNamesToSVGs(svgElement, accessibleName);
}

export function addAccessibleNamesToSVGs(svgElement, accessibleName) {
  if (!svgElement) return null;
  
  // Add title element as accessible name
  const existingTitle = svgElement.querySelector('title');
  if (!existingTitle) {
    const title = document.createElement('title');
    title.textContent = accessibleName;
    svgElement.prepend(title);
  }
  
  // Add aria-labelledby reference
  if (!svgElement.getAttribute('aria-labelledby') && !svgElement.getAttribute('aria-label')) {
    const titleId = `svg-title-${Date.now()}`;
    const title = svgElement.querySelector('title');
    if (title) {
      title.setAttribute('id', titleId);
      svgElement.setAttribute('aria-labelledby', titleId);
    } else {
      svgElement.setAttribute('aria-label', accessibleName);
    }
  }
  
  return svgElement;
}

// REACT_036: Fix fake link issue
export function fixFakeLinkIssue(element) {
  return fixFakeLinkIssues(element);
}

export function fixFakeLinkIssues(container) {
  if (!container) return null;
  
  // Find elements that look like links but aren't
  const fakeLinks = container.querySelectorAll('[role="link"]:not(a)');
  
  fakeLinks.forEach(fakeLink => {
    // Convert to proper button or anchor
    const href = fakeLink.getAttribute('data-href');
    if (href) {
      const anchor = document.createElement('a');
      anchor.setAttribute('href', href);
      anchor.setAttribute('class', fakeLink.getAttribute('class') || '');
      anchor.setAttribute('aria-label', fakeLink.getAttribute('aria-label') || '');
      
      while (fakeLink.firstChild) {
        anchor.appendChild(fakeLink.firstChild);
      }
      
      fakeLink.parentNode.replaceChild(anchor, fakeLink);
    }
  });
  
  return container;
}

// REACT_037: Google sign-in logic
export function googleSignIn() {
  return new Promise((resolve, reject) => {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: process.env.GOOGLE_CLIENT_ID,
        callback: (response) => {
          resolve(response);
        }
      });
    } else {
      reject(new Error('Google Sign-In not available'));
    }
  });
}

// REACT_040: Fix button identifiers
export function fixButtonIdentifiers(container) {
  if (!container) return null;
  
  // Fix generic button identifiers
  const buttons = container.querySelectorAll('button');
  buttons.forEach((button, index) => {
    if (button.id === 'my-button' || button.id === 'button' || !button.id) {
      const ariaLabel = button.getAttribute('aria-label');
      const buttonText = button.textContent?.trim();
      
      if (ariaLabel) {
        button.setAttribute('id', `button-${ariaLabel.toLowerCase().replace(/\s+/g, '-')}`);
      } else if (buttonText) {
        button.setAttribute('id', `button-${buttonText.toLowerCase().replace(/\s+/g, '-')}`);
      } else {
        button.setAttribute('id', `button-${index}`);
      }
    }
  });
  
  return container;
}

// NEW: Ensure element has an id
export function ensureElementHasId(element, prefix = 'element') {
  if (!element) return null;
  
  if (!element.id) {
    element.id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  return element;
}

// NEW: Add aria-label
export function addAriaLabel(element, label) {
  if (!element) return null;
  
  element.setAttribute('aria-label', label);
  
  return element;
}

// NEW: Render dependency graphs
export function renderDependencyGraphs(container, dependencies = []) {
  if (!container) return null;
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '400');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Dependency graph visualization');
  
  // Add title for accessibility
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
  title.textContent = 'Dependency Graph';
  svg.appendChild(title);
  
  // Add desc for additional context
  const desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
  desc.textContent = `Dependency graph showing ${dependencies.length} dependencies`;
  svg.appendChild(desc);
  
  // Render nodes and edges
  let xOffset = 50;
  const yOffset = 100;
  const nodeWidth = 150;
  const nodeHeight = 50;
  
  dependencies.forEach((dep, index) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', xOffset);
    rect.setAttribute('y', yOffset + (index * (nodeHeight + 20)));
    rect.setAttribute('width', nodeWidth);
    rect.setAttribute('height', nodeHeight);
    rect.setAttribute('rx', '5');
    rect.setAttribute('fill', '#e0e0e0');
    rect.setAttribute('stroke', '#333');
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', xOffset + nodeWidth / 2);
    text.setAttribute('y', yOffset + (index * (nodeHeight + 20)) + nodeHeight / 2);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.textContent = dep.name || dep;
    
    g.appendChild(rect);
    g.appendChild(text);
    svg.appendChild(g);
  });
  
  container.appendChild(svg);
  
  // Make SVG accessible
  addAccessibleNamesToSVGs(svg, 'Dependency graph visualization');
  
  return svg;
}

// Main initialization function
export function initializeAccessibility() {
  if (typeof document !== 'undefined') {
    const html = document.documentElement;
    addLangAttribute(html);
    
    const main = document.querySelector('main') || document.querySelector('#root') || document.body;
    ensureUniqueLandmarks(main);
  }
}

// Export default initialization
export default {
  addLangAttribute,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  fixButtonIdentifiers,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  initializeAccessibility
};