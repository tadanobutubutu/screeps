// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: 4b0a76170c9695891c503753fc8449a3a8434fd3_
// <!-- todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888 -->
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

// Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)

const main = require('./utilities');

// Import necessary dependencies
import React from 'react';
import { render } from 'react-dom';
import {
  googleSignIn,
  decodeJwtResponse,
  fixButtonIdentifiers,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs
} from './AccessibilityHelpers';

const main = require('./utilities');

// TODO: Create or update the affected functions to be accessible
// The functions below have been created to match the exported names

const {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  checkAccessibility
} = main;

// Helper function for logging
function log(message, level = 'info') {
  const levels = ['info', 'warn', 'error'];
  if (levels.includes(level)) {
    console[level](`[Accessibility] ${message}`);
  }
}

/**
 * Create an accessible in-page button
 * @param {Object} options - Button configuration options
 * @param {string} options.text - Button text content
 * @param {Function} options.onClick - Click handler function
 * @param {string} options.id - Button ID
 * @param {string} options.className - Additional CSS classes
 * @param {string} options.ariaLabel - Accessible label for screen readers
 * @param {boolean} options.disabled - Whether button is disabled
 * @param {string} options.title - Title attribute for tooltip
 * @param {string} options.icon - Icon HTML to include in button
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(options = {}) {
  const {
    text = '',
    onClick = null,
    id = `in-page-btn-${Math.random().toString(36).substr(2, 9)}`,
    className = '',
    ariaLabel = '',
    disabled = false,
    title = '',
    icon = ''
  } = options;
  
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('id', id);
  button.setAttribute('role', 'button');
  
  if (className) {
    button.className = className;
  }
  
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }
  
  if (title) {
    button.setAttribute('title', title);
  }
  
  if (disabled) {
    button.setAttribute('disabled', 'disabled');
    button.setAttribute('aria-disabled', 'true');
  }
  
  if (icon) {
    button.innerHTML = icon;
    const span = document.createElement('span');
    span.textContent = text;
    if (ariaLabel) {
      span.setAttribute('class', 'sr-only');
    } else {
      span.setAttribute('aria-hidden', 'true');
    }
    button.appendChild(span);
  } else {
    button.textContent = text;
  }
  
  if (onClick && !disabled) {
    button.addEventListener('click', onClick);
    
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(e);
      }
    });
  }
  
  return button;
}

/**
 * Create an accessible web resource button
 * @param {Object} options - Button configuration options
 * @param {string} options.text - Button text content
 * @param {string} options.href - URL to navigate to
 * @param {string} options.id - Button ID
 * @param {string} options.className - Additional CSS classes
 * @param {string} options.ariaLabel - Accessible label for screen readers
 * @param {boolean} options.disabled - Whether button is disabled
 * @param {string} options.title - Title attribute for tooltip
 * @param {string} options.target - Link target (_blank, _self, etc.)
 * @param {string} options.rel - Relationship attribute for security
 * @param {boolean} options.external - Whether link opens in new tab
 * @returns {HTMLElement} The created anchor element styled as button
 */
function createWebResourceButton(options = {}) {
  const {
    text = '',
    href = '#',
    id = `web-resource-btn-${Math.random().toString(36).substr(2, 9)}`,
    className = '',
    ariaLabel = '',
    disabled = false,
    title = '',
    target = '',
    rel = '',
    external = false
  } = options;
  
  const button = document.createElement('a');
  button.setAttribute('id', id);
  button.setAttribute('role', 'button');
  
  if (className) {
    button.className = className;
  }
  
  if (href && !disabled) {
    button.setAttribute('href', href);
  }
  
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }
  
  if (title) {
    button.setAttribute('title', title);
  }
  
  if (disabled) {
    button.setAttribute('aria-disabled', 'true');
    button.removeAttribute('href');
    button.style.cursor = 'not-allowed';
    button.style.pointerEvents = 'none';
  }
  
  if (external || target === '_blank') {
    button.setAttribute('target', '_blank');
    if (!rel) {
      button.setAttribute('rel', 'noopener noreferrer');
    }
  } else if (target) {
    button.setAttribute('target', target);
  }
  
  if (rel) {
    button.setAttribute('rel', rel);
  }
  
  button.textContent = text;
  
  return button;
}

// Implement the function for addressing accessibility issues from insight report
function newFunction () {
  // TODO: Implement the new function as per the issue requirements
}

// Implement the function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport (container, report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  if (!report || !report.issues) {
    return fixes;
  }

  // Add lang attribute to HTML element if missing
  const htmlEl = document.documentElement || (container.ownerDocument && container.ownerDocument.documentElement)
  if (htmlEl && !htmlEl.getAttribute('lang')) {
    htmlEl.setAttribute('lang', 'en');
    fixes.langAdded = true;
  }

  // Add main landmark if missing
  const mainElement = container.querySelector('main');
  if (!mainElement) {
    const body = container.ownerDocument ? container.ownerDocument.body : document.body;
    if (body) {
      const newMain = document.createElement('main');
      while (body.firstChild) {
        newMain.appendChild(body.firstChild);
      }
      body.insertBefore(newMain, body.firstChild)
      fixes.mainLandmarkAdded = true
    }
  }

  // Update the existing function using the new functions for rendering graph/index
  renderDependencyGraphs(container)
  fixButtonIdentifiers(container)
  ensureElementHasId(container)
  addAriaLabel(container)
  addMainLandmarkToIndex(container)

  // Fix landmark issues
  validateLandmark(container)
  fixes.landmarksFixed++

  // Fix SVG accessible names
  const svgElements = container.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg)
    if (
      accessibleName &&
      accessibleName.length > 0 &&
      !svg.querySelector('title')
    ) {
      const title = document.createElement('title')
      title.textContent = accessibleName
      svg.insertBefore(title, svg.firstChild)
      fixes.svgNamesAdded++
    }
  });

  // Fix fake link issues (elements that look like links but are missing href)
  const fakeLinks = container.querySelectorAll('[onclick]:not(a):not(button)')
  fakeLinks.forEach(link => {
    link.setAttribute('href', '#' + (link.id || 'link'));
    link.setAttribute('role', 'link');
    fixes.fakeLinksFixed++;
  });

  // Validate accessibility report
  const accessibilityReport = validateAccessibilityReport(report)
  if (accessibilityReport && accessibilityReport.issues && accessibilityReport.issues.length > 0) {
    console.warn('Accessibility report contains ' + accessibilityReport.issues.length + ' remaining issues')
  }

  // Implement focus trap for keyboard navigation
  focusTrap(container);

  if (fixes.langAdded) {
    console.log('Lang attribute added to HTML element', 'info')
  }

  if (fixes.mainLandmarkAdded) {
    console.log('Main landmark added', 'info')
  }

  // Check for new accessibility issues
  const newAccessibilityIssues = checkAccessibility(container);
  if (newAccessibilityIssues.length > 0) {
    console.error('New accessibility issues found: ' + newAccessibilityIssues.length)
  }

  const landmarkFixesCount = fixes.landmarksFixed || 0;
  if (landmarkFixesCount > 0) {
    console.log('Fixed ' + landmarkFixesCount + ' unique landmarks', 'info')
  }

  const svgFixes = fixes.svgNamesAdded || 0;
  if (svgFixes > 0) {
    console.log('Fixed accessible names for ' + svgFixes + ' SVGs', 'info')
  }

  const fakeLinkFixes = fixes.fakeLinksFixed || 0;
  if (fakeLinkFixes > 0) {
    console.log('Fixed fake link issues for ' + fakeLinkFixes + ' elements', 'info')
  }

  return fixes;
}

// Accessibility-related function to be added
function checkAccessibilityForReport (content) {
  // Placeholder for accessibility checking logic
  // This function should be implemented to check for accessibility issues
  // For now, it just returns an empty array
  return [];
}

// New rendering function
function renderGraphIndex(content, options = {}) {
  // TODO: Update the existing function using the new functions for rendering graph/index
  // Use renderDependencyGraphs to render the graph content
  const container = typeof content === 'string' 
    ? document.createElement('div') 
    : content;
  
  // If content is a string, set it as innerHTML
  if (typeof content === 'string') {
    container.innerHTML = content;
  }
  
  // Apply accessibility fixes for the dependency graph/index
  if (options.fixAccessibility !== false) {
    renderDependencyGraphs(container);
    fixButtonIdentifiers(container);
    fixDependencyGraphAria(container);
    ensureElementHasId(container);
    addAriaLabel(container);
    addMainLandmarkToIndex(container);
  }
  
  // Apply landmark validation if enabled
  if (options.validateLandmarks !== false) {
    validateLandmark(container);
    validateLandmarkStructure(container);
  }
  
  // Fix SVG accessible names if enabled
  if (options.fixSvgNames !== false) {
    const svgElements = container.querySelectorAll('svg');
    svgElements.forEach(svg => {
      const accessibleName = getSvgAccessibleName(svg);
      if (
        accessibleName &&
        !svg.getAttribute('aria-label') &&
        !svg.querySelector('title')
      ) {
        svg.setAttribute('aria-label', accessibleName);
      }
    });
  }
  
  // Return based on input type
  if (typeof content === 'string') {
    return container.innerHTML;
  }
  
  return container;
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, ...
  );
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1];

  return function(e) {
    const isTab = e.key === 'Tab';
    if (!isTab) return;
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        if (lastElement) lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        if (firstElement) firstElement.focus();
      }
    }
  };
}

/**
 * REACT_015: Add lang attribute to HTML element
 * Ensures the HTML element has a proper lang attribute for screen readers
 */
export function addLangAttribute(element, lang) {
  lang = lang || 'en'
  let htmlElement = element || document.documentElement;
  if (!htmlElement) {
    return null;
  }
  if (htmlElement && ... {
    ... lang);
  }
  return htmlElement;
}

/**
 * REACT_027: Fix table structure issues
 * Ensures tables have proper structure with headers and captions
 */
function fixTableStructure(tableElement) {
  if (!tableElement) return null;
  
  const headers = tableElement.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      const row = th.closest('tr')
      const cellIndex = Array.from(row.children).indexOf(th)
      th.setAttribute('scope', cellIndex === 0 ? 'row' : 'col')
    }
  });
  
  const existingCaption = tableElement.querySelector('caption');
  if (!existingCaption) {
    const caption = document.createElement('caption')
    caption.textContent = 'Data table'
    tableElement.insertBefore(caption, tableElement.firstChild)
  }
  
  return tableElement;
}

/**
 * REACT_017: Fix landmark issues - Add landmark regions
 */
export function validateLandmarkStructure(container) {
  if (!container) return null;
  
  const mainElement = container.querySelector('main') || container.querySelector('[role="main"]')
  if (!mainElement) {
    const existingMain = container.querySelector('div')
    if (existingMain) {
      existingMain.setAttribute('role', 'main')
    }
  }
  
  const navElements = container.querySelectorAll('nav');
  navElements.forEach(nav => {
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('role')) {
      nav.setAttribute('aria-label', 'Navigation')
    }
  });
  
  const footerElement = container.querySelector('footer')
  if (footerElement) {
    footerElement.setAttribute('role', 'contentinfo')
  }
  
  return container;
}

/**
 * REACT_017: Add main landmark
 */
function addMainLandmark(container) {
  if (!container) return null;
  
  let mainElement = container.querySelector('main');
  if (!mainElement) {
    mainElement = container.querySelector('[role="main"]')
  }
  
  if (!mainElement) {
    mainElement = document.createElement('main')
    mainElement.setAttribute('id', 'main-content')
    const body = document.body
    if (body && body.firstChild) {
      body.insertBefore(mainElement, body.firstChild)
    }
  }
  
  return mainElement;
}

/**
 * REACT_017: Add landmark regions
 */
function addLandmarkRegions(container) {
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
      element = document.createElement(landmark.selector);
    }
    
    if (element && !element.getAttribute('aria-label') && !element.getAttribute('role')) {
      element.setAttribute('aria-label', landmark.label)
    }
  });
  
  return container;
}

/**
 * REACT_025: Ensure unique landmarks
 */
function ensureUniqueLandmarks(container) {
  if (!container) return null;
  
  const landmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  
  landmarks.forEach(role => {
    const elements = container.querySelectorAll('[role="' + role + '"], ' + role);
    elements.forEach((el, index) => {
      if (index > 0 && !el.getAttribute('aria-label')) {
        const count = index + 1;
        el.setAttribute('aria-label', `${role} ${count}`)
      }
    });
  });
  
  return container;
}

/**
 * REACT_025: Unique landmarks helper
 */
export function uniqueLandmarks() {
  return ensureUniqueLandmarks
}

/**
 * REACT_041: Add accessible names to SVGs
 */
export function addSvgAccessibleName(svgElement, accessibleName) {
  if (!svgElement) return null;
  
  let title = svgElement.querySelector('title')
  if (!title) {
    title = document.createElement('title')
    svgElement.insertBefore(title, svgElement.firstChild)
  }
  title.textContent = accessibleName
  
  const titleId = `svg-title-${Math.random().toString(36).substr(2, 9)}`
  title.setAttribute('id', titleId)
  svgElement.setAttribute('aria-labelledby', titleId)
  
  if (!svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
  
  return svgElement;
}

/**
 * REACT_041: Add accessible names to all SVGs in container
 */
export function addAccessibleNamesToSVGs(container, defaultName) {
  if (!container) return;
  
  const svgs = container.querySelectorAll('svg')
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && !svg.querySelector('title')) {
      addSvgAccessibleNames(svg, defaultName || `Icon ${index + 1}`);
    }
  });
  
  return container;
}

/**
 * REACT_036: Fix fake link issue
 */
export function fixFakeLinkIssue(element) {
  if (!element) return null;
  
  const tagName = element.tagName.toLowerCase()
  const role = element.getAttribute('role')
  const onClick = element.getAttribute('onclick') || element.onclick
  
  if (onClick && tagName !== 'a' && tagName !== 'button') {
    if (role !== 'button') {
      element.setAttribute('role', 'button')
    }
    
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0')
    }
    
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        element.click()
      }
    })
  }
  
  return element
}

/**
 * REACT_036: Fix all fake link issues in container
 */
export function fixAllFakeLinks(container) {
  if (!container) return null;
  
  const clickableElements = container.querySelectorAll('[onclick], [role="button"], [role="link"]')
  clickableElements.forEach(el => {
    const tagName = el.tagName.toLowerCase()
    if (tagName !== 'a' && tagName !== 'button' && tagName !== 'input') {
      fixFakeLinkIssue(el)
    }
  })
  
  return container
}

// Helper functions for session management
function getActiveSessionsCount() {
  return appState.sessions.size
}

function validateSession(sessionId) {
  return appState.sessions.get(sessionId) || null
}

function handleCredentialResponse(credentialResponse) {
  if (!credentialResponse || typeof credentialResponse !== 'object') {
    return { status: 'error', message: 'Invalid credential response' }
  }
  return { status: 'success', credential: credentialResponse }
}

// Accessibility Utilities
const accessibilityUtils = {
  initSkipLink: function() {
    const skipLink = document.querySelector('a[href^="#skip"]')
    if (skipLink) {
      skipLink.addEventListener('click', function(e) {
        e.preventDefault()
        const target = document.querySelector(skipLink.getAttribute('href'))
        if (target) {
          target.setAttribute('tabindex', '-1')
          target.focus()
        }
      })
    }
  },
  
  announceToScreenReader: function(message, priority) {
    if (priority === undefined) {
      priority = 'polite'
    }
    
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.style.position = 'absolute'
    announcer.style.left = '-9999px'
    announcer.textContent = message
    document.body.appendChild(announcer)
    
    setTimeout(function() {
      announcer.remove()
    }, 1000)
  }
};

// Create announcer function
function createAnnouncer() {
  let currentMessage = ''
  let timeoutId = null
  
  return {
    announce: function(message, priority = 'polite') {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      const announcer = document.createElement('div')
      announcer.setAttribute('aria-live', priority)
      announcer.setAttribute('aria-atomic', 'true')
      announcer.className = 'sr-only'
      announcer.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;'
      announcer.textContent = message
      document.body.appendChild(announcer)
      
      currentMessage = message
      
      timeoutId = setTimeout(function() {
        announcer.remove()
        currentMessage = ''
      }, 1000)
    },
    getLastMessage: function() {
      return currentMessage
    }
  }
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Access the dependencyGraph container and ensure it has proper ARIA role
const dependencyGraph = document.getElementById('dependencyGraph')

if (dependencyGraph) {
  // Set appropriate ARIA role for the dependency graph container
  // Using 'region' role for a contained section of content
  if (!dependencyGraph.getAttribute('role')) {
    dependencyGraph.setAttribute('role', 'region')
  }

  // Add accessible label if not already present
  if (!dependencyGraph.getAttribute('aria-label')) {
    dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization')
  }

  // Ensure element has an ID if not present
  if (!dependencyGraph.getAttribute('id')) {
    dependencyGraph.setAttribute('id', 'dependencyGraph')
  }

  // Ensure the container is focusable if it's interactive
  if (!dependencyGraph.getAttribute('tabindex')) {
    dependencyGraph.setAttribute('tabindex', '0')
  }
}

// Function to render dependency graph
function renderDependencyGraph(element) {
  console.log('Rendering dependency graph for element:', element)
}

// Function to render a simple dependency graph
function renderSimpleDependencyGraph(element) {
  console.log('Rendering simple dependency graph for element:', element)
}

// Required changes to fix the React SVG Accessible Name issue
function addAccessibleName (svgString) {
  // This function adds an `aria-label` attribute to the SVG if it doesn't already have one
  // and returns the modified SVG string.
  // Note: This is a simplified example and might need adjustments based on the actual SVG structure.
  const svg = new DOMParser().parseFromString(svgString, 'image/svg+xml')
  const svgElement = svg.documentElement
  if (!svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', 'Descriptive label for SVG')
  }
  return new XMLSerializer().serializeToString(svgElement)
}

// Example usage of the function
const originalSvgString =
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>'
const modifiedSvgString = addAccessibleName(originalSvgString)

/**
 * Validates table accessibility
 * @param {Array} tableData - Table data to validate
 * @returns {boolean} True if table is accessible, false otherwise
 */
function validateTableAccessibility (tableData) {
  // Implementation placeholder - function to be implemented
  return true
}

/**
 * Validates table structure
 * @param {Array} tableData - Table data to validate
 * @returns {boolean} True if table structure is valid, false otherwise
 */
function validateTableStructure (tableData) {
  // Implementation placeholder - function to be implemented
  return true
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer()
  
  ensureUniqueLandmarks(document.body)
  
  return {
    announce: announcer.announce,
    getLastMessage: announcer.getLast
  }
}

// Call the functions to address the accessibility issues
addLangAttribute()
fixTableStructure()
addMainLandmark()
fixLandmarkIssues()
ensureUniqueLandmarks()
addSvgAccessibleNames()
addAccessibleNamesToSVGs()
fixFakeLinkIssue()
googleSignIn()
fixButtonIdentifiers()

// Other code...

// Preserve all existing exports
module.exports = {
  renderDependencyGraph,
  renderIndex,
  validateTableAccessibility,
  validateTableStructure,
  // Preserve any other existing exports here
  // Required exports restored from previous version
  // Re-export the imported dependencies that were previously exported
  googleSignIn,
  decodeJwtResponse,
  fixButtonIdentifiers,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  // Re-export the local functions that were previously exported
  renderGraphIndex,
  trapFocus,
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
  renderSimpleDependencyGraph,
  addAccessibleName,
  accessibilityUtils,
  createAnnouncer,
  prefersReducedMotion,
  initializeAccessibility,
  getActiveSessionsCount,
  validateSession,
  handleCredentialResponse
}

// New function or changes requested in the issue
/**
 * New function to handle additional rendering logic
 * @param {Object} additionalData - Additional data for rendering
 * @returns {string} Rendered additional content HTML
 */
function renderAdditionalContent (additionalData) {
  // Implementation of the new function
  // Placeholder for actual implementation
  return `<div>${JSON.stringify(additionalData)}</div>`
}

// Add the new function to the exports
module.exports.renderAdditionalContent = renderAdditionalContent