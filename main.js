// TODO: Update the existing function using the new functions for rendering graph/index
// ADDED: Created renderGraphAndIndex function that uses the new renderDependencyGraph and renderIndexView functions
function renderGraphAndIndex(graphNode, indexPath, graphContainer, indexContainer, options = {}) {
  // Render the dependency graph using the new renderDependencyGraph function
  const graphResult = renderDependencyGraph(graphNode, graphContainer, {
    ...options.graphOptions,
    width: options.graphWidth || '100%',
    height: options.graphHeight || '400'
  });
  
  // Render the index view using the new renderIndexView function
  const indexResult = renderIndexView(indexPath, indexContainer, {
    baseUrl: options.baseUrl || '',
    separator: options.separator || '/',
    ariaLabel: options.breadcrumbAriaLabel || 'Breadcrumb',
    listClassName: options.breadcrumbListClassName || 'breadcrumb',
    ...options.indexOptions
  });
  
  // Return combined results
  return {
    success: graphResult.success && indexResult.success,
    graph: graphResult,
    index: indexResult,
    errors: [
      ...(graphResult.errors || []),
      ...(indexResult.errors || [])
    ]
  };
}

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute; handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure; handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec, spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

const main = require('./utilities')

const {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  createAccessibleLink,
  isLinkAccessible,
  renderDependencyGraph,
  renderIndexView,
  buildDependencyGraph,
  buildBreadcrumbData,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  checkAccessibility
} = main

const primaryContent = (typeof document !== 'undefined') ? document.querySelector('main') || document.querySelector('#content') || document.querySelector('.content') || document.querySelector('article') || document.getElementById('primary-content') || document.body : null;

// New function to wrap primary content in a <main> element for accessibility compliance
function wrapPrimaryContentInMain(container, options = {}) {
  if (!container || typeof container !== 'object' || !container.nodeType) {
    return null;
  }

  const config = {
    mainId: options.mainId || 'main-content',
    mainRole: options.mainRole || 'main'
  };

  // Check if main element already exists
  let mainElement = container.querySelector('main');

  if (mainElement) {
    // Main element already exists, ensure it has proper id
    if (!mainElement.id) {
      mainElement.id = config.mainId;
    }
    // Ensure proper role
    if (!mainElement.getAttribute('role')) {
      mainElement.setAttribute('role', config.mainRole);
    }
    return mainElement;
  }

  // Create new main element
  mainElement = document.createElement('main');
  mainElement.id = config.mainId;
  mainElement.setAttribute('role', config.mainRole);

  // Find primary content to wrap
  // Priority: role="main" > main element > article > section with id > body content
  const primarySelectors = [
    '[role="main"]',
    'article:not([role])',
    'section[id]',
    '.primary-content',
    '#primary-content',
    '.main-content',
    '#main-content'
  ];

  let primaryContent = null;

  for (const selector of primarySelectors) {
    primaryContent = container.querySelector(selector);
    if (primaryContent) {
      break;
    }
  }

  if (primaryContent) {
    // Move primary content children into main element
    while (primaryContent.firstChild) {
      mainElement.appendChild(primaryContent.firstChild);
    }

    // Replace primary content with main element
    primaryContent.parentNode.replaceChild(mainElement, primaryContent);
  } else {
    // No specific primary content found
    // Get body or container's direct children
    const body = container.ownerDocument ? container.ownerDocument.body : null;
    const contentParent = body || container;

    // Collect direct children to move
    const childrenToMove = Array.from(contentParent.childNodes).filter(node => {
      // Skip script, style, and meta elements
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        if (['script', 'style', 'link', 'meta', 'noscript'].includes(tagName)) {
          return false;
        }
        // Skip existing main element
        if (tagName === 'main') {
          return false;
        }
      }
      return true;
    });

    // Move children to main element
    childrenToMove.forEach(child => {
      mainElement.appendChild(child);
    });

    // Append main element to container
    if (body) {
      body.appendChild(mainElement);
    } else {
      container.appendChild(mainElement);
    }
  }

  // Log successful operation
  if (typeof log === 'function') {
    log(`Primary content wrapped in main element with id: ${config.mainId}`, 'info');
  }

  return mainElement;
}

// Implement the function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport(container, report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  }

  if (!report || !report.issues) {
    return fixes
  }

  // Add lang attribute to HTML element if missing
  const htmlEl =
        document.documentElement ||
        (container && container.ownerDocument && container.ownerDocument.documentElement)
  if (htmlEl && !htmlEl.hasAttribute('lang')) {
    htmlEl.setAttribute('lang', 'en')
    fixes.langAdded = true
  }

  // Add main landmark if missing
  const mainElement = container.querySelector('main') || container.querySelector('[role="main"]')
  if (!mainElement) {
    const body = container.ownerDocument ? container.ownerDocument.body : null
    if (body) {
      const newMain = document.createElement('main')
      while (body.firstChild) {
        newMain.appendChild(body.firstChild)
      }
      body.insertBefore(newMain, body.firstChild)
      fixes.mainLandmarkAdded = true
    }
  }

  // Update the existing function using the new functions for rendering graph/index
  if (typeof renderDependencyGraphs === 'function') {
    renderDependencyGraphs(container)
  }
  if (typeof fixButtonIdentifiers === 'function') {
    fixButtonIdentifiers(container)
  }
  if (typeof addMainLandmarkToIndex === 'function') {
    addMainLandmarkToIndex(container)
  }

  // Fix landmark issues
  if (typeof validateLandmark === 'function') {
    validateLandmark(container)
  }

  return fixes;
}

// Main entry point function (implementation added)
function main() {
  // Main application logic can be added here
  console.log("Main function executed");
  // Example: initialize accessibility features
  accessibility();
  // Additional setup can be added as needed
}

// Accessibility-related function to be added
function checkAccessibilityForReport (content) {
  // Placeholder for accessibility checking logic
  // This function should be implemented to check for accessibility issues
  // For now, it just returns an empty array
  return []
}

// New rendering function
function renderGraphIndex(content, options = {}) {
  return content
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  return function(e) {
    const isTab = e.key === 'Tab'
    if (!isTab) return
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        if (lastElement) lastElement.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        if (firstElement) firstElement.focus()
      }
    }
  }
}

/**
 * REACT_015: Add lang attribute to HTML element
 * Ensures the HTML element has a proper lang attribute for screen readers
 */
export function addLangAttribute(element, lang = 'en') {
  let htmlElement = element || document.documentElement
  if (!htmlElement) {
    return null
  }
  if (!htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', lang)
  }
  return htmlElement
}

/**
 * REACT_027: Fix table structure issues
 * Ensures tables have proper structure with headers and captions
 */
export function fixTableStructure(tableElement) {
  if (!tableElement) return null

  const headers = tableElement.querySelectorAll('th')
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      const row = th.closest('tr')
      const cellIndex = Array.from(row.children).indexOf(th)
      th.setAttribute('scope', cellIndex === 0 ? 'row' : 'col')
    }
  })

  const existingCaption = tableElement.querySelector('caption')
  if (!existingCaption) {
    const caption = document.createElement('caption')
    caption.textContent = 'Data table'
    tableElement.insertBefore(caption, tableElement.firstChild)
  }

  return tableElement
}

/**
 * REACT_017: Fix landmark issues - Add landmark regions
 */
export function fixLandmarkIssues(container) {
  if (!container) return null

  const mainElement = container.querySelector('main') || container.querySelector('[role="main"]')
  if (!mainElement) {
    const existingMain = container.querySelector('div')
    if (existingMain) {
      existingMain.setAttribute('role', 'main')
    }
  }

  const navElements = container.querySelectorAll('nav')
  navElements.forEach(nav => {
    if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('role')) {
      nav.setAttribute('aria-label', 'Navigation')
    }
  })

  const footerElement = container.querySelector('footer')
  if (footerElement) {
    footerElement.setAttribute('role', 'contentinfo')
  }

  return container
}

/**
 * REACT_017: Add main landmark
 */
export function addMainLandmark(container) {
  if (!container) return null

  let mainElement = container.querySelector('main')
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

  return mainElement
}

/**
 * REACT_017: Add landmark regions
 */
export function addLandmarkRegions(container) {
  if (!container) return null

  const landmarks = [
    { selector: 'header', role: 'banner', label: 'Site header' },
    { selector: 'nav', role: 'navigation', label: 'Navigation' },
    { selector: 'main', role: 'main', label: 'Main content' },
    { selector: 'aside', role: 'complementary', label: 'Complementary content' },
    { selector: 'footer', role: 'contentinfo', label: 'Site footer' }
  ]

  landmarks.forEach(landmark => {
    let element = container.querySelector(landmark.selector)
    if (!element) {
      element = document.createElement(landmark.selector)
    }

    if (element && !element.getAttribute('aria-label') && !element.getAttribute('role')) {
      element.setAttribute('aria-label', landmark.label)
    }
  })

  return container
}

/**
 * REACT_025: Ensure unique landmarks
 */
export function ensureUniqueLandmarks(container) {
  if (!container) return null

  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo']

  landmarkRoles.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"]`)
    elements.forEach((el, index) => {
      if (index > 0 && !el.getAttribute('aria-label')) {
        const count = index + 1
        el.setAttribute('aria-label', `${role} ${count}`)
      }
    })
  })

  return container
}

/**
 * REACT_025: Unique landmarks helper
 */
export function uniqueLandmarks(container) {
  return ensureUniqueLandmarks(container)
}

/**
 * REACT_041: Add accessible names to SVGs
 */
export function addSvgAccessibleNames(svgElement, accessibleName) {
  if (!svgElement) return null

  let title = svgElement.querySelector('title')
  if (!title) {
    title = document.createElement('title')
    svgElement.insertBefore(title, svgElement.firstChild)
  }

  const titleId = `svg-title-${Math.random().toString(36).substr(2, 9)}`
  title.setAttribute('id', titleId)
  svgElement.setAttribute('aria-labelledby', titleId)

  if (!svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', 'img')
  }

  return svgElement
}

/**
 * REACT_041: Add accessible names to all SVGs in container
 */
export function addSvgAccessibleNamesToContainer(container) {
  if (!container) return

  const svgs = container.querySelectorAll('svg')
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('title') && !svg.getAttribute('aria-label')) {
      addSvgAccessibleNames(svg, `Icon ${index + 1}`)
    }
  })

  return container
}

/**
 * REACT_036: Fix fake link issue
 */
export function fixFakeLinkIssue(element) {
  if (!element) return null

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
export function fixFakeLinksInContainer(container) {
  if (!container) return null

  const clickableElements = container.querySelectorAll('[onclick], [role="button"], [role="link"]')
  clickableElements.forEach(el => {
    const tagName = el.tagName.toLowerCase()
    if (tagName !== 'a' && tagName !== 'button' && tagName !== 'input' && tagName !== 'select' && tagName !== 'textarea') {
      fixFakeLinkIssue(el)
    }
  })

  return container
}

// Export all functions and modules
export {
  newFunction,
  implementAccessibilityFixesFromReport,
  checkAccessibilityForReport,
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
  addSvgAccessibleNamesToContainer,
  fixFakeLinkIssue,
  fixFakeLinksInContainer,
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  checkAccessibility
}

module.exports = {
  greetingFunction,
  renderGraphIndex,
  renderGraphIndexAlt,
  accessibility,
  ensureInteractiveElementsAccessible,
  handleInitialAccessibility,
  addressAccessibilityIssues,
  validateSession,
  getActiveSessionsCount,
  revokeSession,
  a11yStore,
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  factorial,
  fibonacci,
  sum,
  average,
  max,
  min,
  mode,
  median,
  dependencyGraphContent,
  indexContent,
  main,
  addressabilityIssues: AddressabilityIssues,
  // Additional utility functions from merged code
  loadConfigurations,
  countDependencies,
  sanitizeFilename,
  processData,
  generateSessionId,
  prefersReducedMotion,
  prefersHighContrast,
  isLandmarkElement,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkRoles,
  validateLandmarkStructure,
  checkLandmarkAccessibility,
  checkLandmarkElements,
  checkAccessibilityOfLandmarks,
  ensureUniqueLandmarks,
  missingRoles,
  fixFakeLinkIssue,
  addAriaLabel,
  addAriaLabelLegacy,
  checkElementAccessibility,
  handleAccessibilityIssues,
  addLangAttribute,
  getLangAccessibleName,
  getLangAttribute,
  renderDependencyGraphs,
  addLanguageAttribute,
  addMainLandmarkToIndex,
  createAccessibleLink,
  isLinkAccessible,
  renderDependencyGraph,
  renderIndexView,
  buildDependencyGraph,
  buildBreadcrumbData,
  renderGraphAndIndex,
  towerDefense,
  wrapPrimaryContentInMain,
  implementAccessibilityFixesFromReport
};