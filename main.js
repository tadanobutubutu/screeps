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
import React from 'react';
import { render } from 'react-dom';

// Accessibility Helper Functions

/**
 * REACT_015: Add lang attribute to HTML element
 * Ensures the HTML element has a proper lang attribute for screen readers
 */
export function addLangAttribute(document, lang = 'en') {
  let htmlElement = document.querySelector('html');
  if (!htmlElement) {
    htmlElement = document.getElementsByTagName('html')[0];
  }
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
  return htmlElement;
}

/**
 * REACT_027: Fix table structure issues
 * Ensures tables have proper structure with headers and captions
 */
export function fixTableStructure(tableElement) {
  if (!tableElement) return null;
  
  // Ensure table has proper scope attributes on headers
  const headers = tableElement.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      const row = th.closest('tr');
      const cellIndex = Array.from(row.children).indexOf(th);
      th.setAttribute('scope', cellIndex === 0 ? 'row' : 'col');
    }
  });
  
  // Add caption if missing and table doesn't have one
  if (!tableElement.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Data table';
    caption.style.srOnly = true;
    tableElement.insertBefore(caption, tableElement.firstChild);
  }
  
  return tableElement;
}

/**
 * REACT_017: Fix landmark issues - Add landmark regions
 */
export function fixLandmarkIssues(container) {
  if (!container) return null;
  
  // Ensure main content is wrapped in main landmark
  const mainElement = container.querySelector('main') || container.querySelector('[role="main"]');
  if (!mainElement) {
    const existingMain = container.querySelector('#main-content');
    if (existingMain) {
      existingMain.setAttribute('role', 'main');
    }
  }
  
  // Ensure navigation has proper nav landmarks
  const navElements = container.querySelectorAll('nav');
  navElements.forEach(nav => {
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', 'Navigation');
    }
  });
  
  // Ensure footer has proper footer landmark
  const footerElement = container.querySelector('footer');
  if (footerElement) {
    footerElement.setAttribute('role', 'contentinfo');
  }
  
  return container;
}

/**
 * REACT_017: Add main landmark
 */
export function addMainLandmark(container) {
  if (!container) return null;
  
  let mainElement = container.querySelector('main');
  if (!mainElement) {
    mainElement = container.querySelector('[role="main"]');
  }
  
  if (!mainElement) {
    // Create a main landmark if none exists
    mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    const body = container.querySelector('body');
    if (body) {
      body.insertBefore(mainElement, body.firstChild);
    }
  }
  
  return mainElement;
}

/**
 * REACT_017: Add landmark regions
 */
export function addLandmarkRegions(container) {
  if (!container) return null;
  
  const landmarks = [
    { selector: 'header', role: 'banner', label: 'Site header' },
    { selector: 'nav', role: 'navigation', label: 'Navigation' },
    { selector: 'main', role: 'main', label: 'Main content' },
    { selector: 'aside', role: 'complementary', label: 'Complementary content' },
    { selector: 'footer', role: 'contentinfo', label: 'Site footer' }
  ];
  
  landmarks.forEach(landmark => {
    let element = container.querySelector(landmark.selector);
    if (!element) {
      element = container.querySelector(`[role="${landmark.role}"]`);
    }
    
    if (element && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
      element.setAttribute('aria-label', landmark.label);
    }
  });
  
  return container;
}

/**
 * REACT_025: Ensure unique landmarks
 */
export function ensureUniqueLandmarks(container) {
  if (!container) return null;
  
  const landmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  
  landmarks.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"]`);
    elements.forEach((el, index) => {
      if (index > 0 && !el.getAttribute('aria-label')) {
        const count = index + 1;
        el.setAttribute('aria-label', `${role} ${count}`);
      }
    });
  });
  
  return container;
}

/**
 * REACT_025: Unique landmarks helper
 */
export function uniqueLandmarks(container) {
  return ensureUniqueLandmarks(container);
}

/**
 * REACT_041: Add accessible names to SVGs
 */
export function addSvgAccessibleNames(svgElement, accessibleName) {
  if (!svgElement) return null;
  
  // Add title element inside SVG
  let title = svgElement.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svgElement.insertBefore(title, svgElement.firstChild);
  }
  title.textContent = accessibleName;
  
  // Add aria-labelledby reference
  const titleId = `svg-title-${Date.now()}`;
  title.setAttribute('id', titleId);
  svgElement.setAttribute('aria-labelledby', titleId);
  
  // Ensure role is set
  if (!svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
  
  return svgElement;
}

/**
 * REACT_041: Add accessible names to all SVGs in container
 */
export function addAccessibleNamesToSVGs(container) {
  if (!container) return;
  
  const svgs = container.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      addSvgAccessibleNames(svg, `Icon ${index + 1}`);
    }
  });
  
  return container;
}

/**
 * REACT_036: Fix fake link issue
 */
export function fixFakeLinkIssue(element) {
  if (!element) return null;
  
  // Check if element is a fake link (clickable non-link element)
  const tagName = element.tagName.toLowerCase();
  const role = element.getAttribute('role');
  const onClick = element.getAttribute('onclick');
  
  if (onClick && tagName !== 'a' && tagName !== 'button') {
    // Convert to proper button or anchor
    if (role !== 'button') {
      element.setAttribute('role', 'button');
    }
    
    // Add keyboard accessibility
    if (!element.getAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
    
    // Add keyboard activation handler
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        element.click();
      }
    });
  }
  
  return element;
}

/**
 * REACT_036: Fix all fake link issues in container
 */
export function fixFakeLinkIssues(container) {
  if (!container) return null;
  
  const clickableElements = container.querySelectorAll('[onclick]');
  clickableElements.forEach(el => {
    const tagName = el.tagName.toLowerCase();
    if (tagName !== 'a' && tagName !== 'button' && tagName !== 'input') {
      fixFakeLinkIssue(el);
    }
  });
  
  return container;
}

/**
 * REACT_037: Google sign-in logic
 */
export function googleSignIn() {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        callback: async (response) => {
          try {
            // Handle the token
            const userInfo = decodeJwtResponse(response.credential);
            resolve({
              success: true,
              user: userInfo
            });
          } catch (error) {
            reject(error);
          }
        }
      });
      
      window.google.accounts.id.prompt();
    } else {
      reject(new Error('Google Sign-In not available'));
    }
  });
}

// Helper to decode JWT
function decodeJwtResponse(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
  );
  return JSON.parse(jsonPayload);
}

/**
 * REACT_040: Fix button identifiers
 */
export function fixButtonIdentifiers(container) {
  if (!container) return null;
  
  const buttons = container.querySelectorAll('button');
  buttons.forEach((button, index) => {
    // Generate unique id if missing
    if (!button.id) {
      const existingId = button.getAttribute('data-testid') || button.getAttribute('aria-label');
      if (existingId) {
        button.id = existingId.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      } else {
        button.id = `button-${index + 1}`;
      }
    }
    
    // Remove generic placeholder ids
    if (button.id === 'my-button' || button.id === 'button') {
      button.id = `button-${Date.now()}-${index}`;
    }
  });
  
  return container;
}

/**
 * NEW: Ensure element has an id
 */
export function ensureElementHasId(element, prefix = 'element') {
  if (!element) return null;
  
  if (!element.id) {
    element.id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  return element;
}

/**
 * NEW: Add aria-label to element
 */
export function addAriaLabel(element, label) {
  if (!element) return null;
  
  if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
    element.setAttribute('aria-label', label);
  }
  
  return element;
}

/**
 * NEW: Render dependency graphs
 */
export function renderDependencyGraphs(container, dependencies = []) {
  if (!container) return null;
  
  const graphContainer = document.createElement('div');
  graphContainer.setAttribute('role', 'img');
  graphContainer.setAttribute('aria-label', `Dependency graph with ${dependencies.length} dependencies`);
  graphContainer.id = 'dependency-graph';
  
  // Create SVG for graph visualization
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');