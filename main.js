const main = require('./utilities')

import React from 'react';
import { render } from 'react-dom';
import {
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  addSvgAccessibleName,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  decodeJwtResponse,
  fixButtonIdentifiers,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel
} from './AccessibilityHelpers'

const dependencyGraph = ...

if (dependencyGraph) {
  if ... {
    ... 'region')
  }

  if ... {
    ... 'Dependency graph visualization')
  }

  if ... {
    ... 'dependencyGraph');
}

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

/**
 * Creates an accessible button/link for external web resources (e.g., GitHub, Stack Overflow, etc.)
 * @param {Object} options - Configuration options for the web resource button
 * @param {string} options.url - The URL to link to
 * @param {string} options.label - The accessible label/name for the button (required for screen readers)
 * @param {string} options.icon - Optional icon class name or SVG markup to display
 * @param {string} options.type - Type of resource (e.g., 'github', 'stackoverflow', 'twitter', 'linkedin')
 * @param {string} options.variant - Button variant style (e.g., 'primary', 'secondary', 'icon-only')
 * @param {string} options.className - Additional CSS class names
 * @param {boolean} options.openInNewTab - Whether to open link in new tab (default: true for external resources)
 * @param {string} options.ariaDescription - Additional aria-description for more context
 * @returns {HTMLAnchorElement|HTMLButtonElement} - The accessible web resource button element
 */
export function createWebResourceButton(options = {}) {
  const {
    url,
    label,
    icon,
    type,
    variant = 'secondary',
    className = '',
    openInNewTab = true,
    ariaDescription
  } = options;

  // Validate required parameters
  if (!url || typeof url !== 'string') {
    console.warn('createWebResourceButton: URL is required and must be a string');
    return null;
  }

  if (!label || typeof label !== 'string') {
    console.warn('createWebResourceButton: Label is required for accessibility and must be a string');
    return null;
  }

  // Create the anchor element for external links
  const button = document.createElement('a');
  
  // Set core attributes
  button.href = url;
  button.textContent = label;
  
  // Ensure accessible name for screen readers
  button.setAttribute('aria-label', label);
  
  // Handle external link accessibility
  if (openInNewTab || url.startsWith('http://') || url.startsWith('https://')) {
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    // Announce that link opens in new tab for screen reader users
    button.setAttribute('aria-describedby', 'external-link-description');
  }

  // Add type-specific class for styling
  if (type) {
    button.classList.add(`web-resource-btn`, `web-resource-btn--${type.toLowerCase()}`);
  }

  // Add variant class
  button.classList.add(`btn`, `btn--${variant}`);
  
  // Add any additional custom classes
  if (className) {
    const additionalClasses = className.split(' ').filter(c => c.trim());
    additionalClasses.forEach(c => button.classList.add(c));
  }

  // Add icon if provided
  if (icon) {
    if (icon.startsWith('<')) {
      // SVG markup - insert as HTML
      button.innerHTML = icon + label;
    } else {
      // Icon class - wrap in span
      const iconSpan = document.createElement('span');
      iconSpan.className = icon;
      iconSpan.setAttribute('aria-hidden', 'true');
      button.insertBefore(iconSpan, button.firstChild);
    }
  }

  // Add additional aria-description if provided
  if (ariaDescription) {
    button.setAttribute('aria-description', ariaDescription);
  }

  // Ensure keyboard accessibility
  button.tabIndex = 0;
  
  // Add Enter key support for keyboard activation
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      button.click();
    }
  });

  return button;
}

function implementAccessibilityFixesFromReport (container, report) {
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

  const htmlEl =
    ... ||
    (container.ownerDocument && ...
  if (htmlEl && ... {
    ... 'en')
    fixes.langAdded = true
  }

  const mainElement = ...
  if (!mainElement) {
    const body = ...
    if (body) {
      const newMain = document.createElement('main')
      while (body.firstChild) {
        ...
      }
      ...
      fixes.mainLandmarkAdded = true
    }
  }

  renderDependencyGraphs(container)
  fixButtonIdentifiers(container)
  ...

  validateLandmark(container)
  ...
  fixes.landmarksFixed++

  const svgElements = ...
  ... => {
    const accessibleName = getSvgAccessibleName(svg)
    if (
      accessibleName &&
            ... &&
      ...
    ) {
      ... accessibleName)
      fixes.svgNamesAdded++
    }
  })

  const fakeLinks = ...
  ... => {
    link.setAttribute('href', '#' + (link.id || ...
    link.setAttribute('role', 'link')
    fixes.fakeLinksFixed++
  })

  const accessibilityReport = ...
  if (accessibilityReport && accessibilityReport.issues && accessibilityReport.issues.length > 0) {
    log(`Accessibility report contains ... remaining issues`, 'warn')
  }

  focusTrap(container)

  if (fixes.langAdded) {
    log('Lang attribute added to HTML element', 'info')
  }

  if (fixes.mainLandmarkAdded) {
    log('Main landmark added', 'info')
  }

  const newAccessibilityIssues = checkAccessibility(container)
  if (newAccessibilityIssues.length > 0) {
    log(`New accessibility issues found: ... ')}`, 'error')
  }

  const landmarkFixesCount = fixes.landmarksFixed || 0
  if (landmarkFixesCount > 0) {
    log(`Fixed ... unique landmarks`, 'info')
  }

  const svgFixes = fixes.svgNamesAdded || 0
  if (svgFixes > 0) {
    log(`Fixed accessible names for ${svgFixes} SVGs`, 'info')
  }

  const fakeLinkFixes = fixes.fakeLinksFixed || 0
  if (fakeLinkFixes > 0) {
    log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info')
  }

  return fixes
}

function validateSession() {
  return false
}

function handleCredentialResponse(response) {
  // Implementation of the handleCredentialResponse function
  // Process the credential response and extract relevant information
  
  if (!response) {
    console.warn('No credential response provided');
    return { success: false };
  }
  
  // Extract token from various possible locations in the response
  const token = response.token || 
                response.access_token || 
                response.auth_token || 
                response.credentials?.token;
  
  if (!token) {
    console.warn('No valid token found in credential response');
    return { success: false };
  }
  
  // Optionally decode the JWT token if needed
  // Using the existing decodeJwtResponse helper
  // Note: This would typically happen before storing the token
  // For now, we'll just log it
  
  console.log('Credential Response processed successfully');
  console.log('Extracted token:', token);
  
  return { success: true, token };
}

function renderAdditionalContent(additionalData) {
  return ''
}

function checkAccessibilityForReport (content) {
  return []
}

/**
 * Renders dependency graphs for the given container
 * @param {HTMLElement} container - The container element to render dependency graphs in
 * @param {Object} options - Rendering options
 * @returns {HTMLElement} The rendered graph element
 */
export function renderDependencyGraphs(container, options = {}) {
  if (!container) {
    console.warn('No container provided for dependency graph rendering')
    return null
  }

  const {
    graphType = 'dependency',
    showLabels = true,
    interactive = true
  } = options

  // Find or create a container for the dependency graph
  let graphContainer = container.querySelector('[data-dependency-graph]')
  if (!graphContainer) {
    graphContainer = document.createElement('div')
    graphContainer.setAttribute('data-dependency-graph', 'true')
    graphContainer.setAttribute('role', 'img')
    graphContainer.setAttribute('aria-label', `Dependency graph showing ${graphType} relationships`)
    container.appendChild(graphContainer)
  }

  // Add accessible attributes based on options
  if (showLabels) {
    graphContainer.setAttribute('aria-label', `Dependency graph: ${graphType} visualization`)
  }

  if (interactive) {
    graphContainer.setAttribute('tabindex', '0')
    graphContainer.setAttribute('role', 'application')
  }

  return graphContainer
}

/**
 * Renders the graph index with proper accessibility
 * @param {string} content - The content to render
 * @param {Object} options - Rendering options
 * @returns {string} Rendered content HTML
 */
export function renderGraphIndex(content, options = {}) {
  if (!content) {
    return ''
  }

  const {
    includeGraph = true,
    accessibilityLabel = 'Dependency graph index'
  } = options

  // If content is already HTML, return it with accessibility attributes
  if (typeof content === 'string' && content.includes('<')) {
    // Wrap in accessible container
    return `<div class="graph-index" role="region" aria-label="${accessibilityLabel}">
      ${includeGraph ? `<div class="graph-container" data-graph-index="true">${content}</div>` : content}
    </div>`
  }

  // For non-HTML content, create structured output
  return `<div class="graph-index" role="region" aria-label="${accessibilityLabel}">
    ${includeGraph ? `<div class="graph-container" data-graph-index="true">${content}</div>` : content}
  </div>`
}

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


export function addLangAttribute(element, lang = 'en') {
  let htmlElement = element || document.documentElement
  if (!htmlElement) {
    return null
  }

  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang)
  }
  return htmlElement
}

export function fixTableStructure(tableElement) {
  if (!tableElement) return null
  
  const headers = tableElement.querySelectorAll('th')
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      const row = th.closest('tr')
      const cellIndex = Array.from(row.children).indexOf(th)
      th.setAttribute('scope', 'col')
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

// Function to create in-page buttons
function createInPageButton(text, container = document.body, options = {}) {
  const button = document.createElement('button');
  button.textContent = text;
  if (options.id) {
    button.id = options.id;
  }
  if (options.className) {
    button.className = options.className;
  }
  if (options.ariaLabel) {
    button.setAttribute('aria-label', options.ariaLabel);
  }
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  container.appendChild(button);
  return button;
}

module.exports.renderAdditionalContent = renderAdditionalContent
module.exports.implementAccessibilityFixesFromReport = implementAccessibilityFixesFromReport
module.exports.checkAccessibilityForReport = checkAccessibilityForReport
module.exports.renderGraphIndex = renderGraphIndex
module.exports.trapFocus = trapFocus
module.exports.createInPageButton = createInPageButton
module.exports.createWebResourceButton = createWebResourceButton
module.exports.renderDependencyGraphs = renderDependencyGraphs