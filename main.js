// TODO: This is the existing code that needs to be preserved
// _Commit: aabb40916364c3b608e08e010dc71de4a04dfa74_

// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)
const main = require('./utilities')

// Import necessary dependencies
import React from 'react';
import { render } from 'react-dom';
import {
  addLangAttribute,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  addSvgAccessibleName,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  decodeJwtResponse,
  fixButtonIdentifiers,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs
} from './AccessibilityHelpers'

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

// Implement the function for addressing accessibility issues from insight report
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

  // Add lang attribute to HTML element if missing
  const htmlEl =
    container.querySelector('html') ||
    (container.ownerDocument && container.ownerDocument.querySelector('html'))
  if (htmlEl && !htmlEl.hasAttribute('lang')) {
    htmlEl.setAttribute('lang', 'en')
    fixes.langAdded = true
  }

  // Add main landmark if missing
  const mainElement = container.querySelector('main')
  if (!mainElement) {
    const body = container.querySelector('body')
    if (body) {
      const newMain = document.createElement('main')
      while (body.firstChild) {
        newMain.appendChild(body.firstChild)
      }
      body.appendChild(newMain)
      fixes.mainLandmarkAdded = true
    }
  }

  // Update the existing function using the new functions for rendering graph/index
  renderDependencyGraphs(container)
  fixButtonIdentifiers(container)
  fixDependencyGraphAria(container)

  // Fix landmark issues
  validateLandmark(container)
  validateLandmarkStructure(container)
  fixes.landmarksFixed++

  // Fix SVG accessible names
  const svgElements = container.querySelectorAll('svg')
  svgElements.forEach((svg) => {
    const accessibleName = getSvgAccessibleName(svg)
    if (
      accessibleName &&
            !svg.getAttribute('aria-label') &&
            !svg.getAttribute('aria-labelledby')
    ) {
      svg.setAttribute('aria-label', accessibleName)
      fixes.svgNamesAdded++
    }
  })

  // Fix fake link issues (elements that look like links but are missing href)
  const fakeLinks = container.querySelectorAll('a:not([href])')
  fakeLinks.forEach((link) => {
    link.setAttribute('href', '#' + (link.id || `link-${Date.now()}`))
    link.setAttribute('role', 'link')
    fixes.fakeLinksFixed++
  })

  // Validate accessibility report
  const accessibilityReport = validateAccessibilityReport(container)
  if (accessibilityReport && accessibilityReport.issues && accessibilityReport.issues.length > 0) {
    log(`Accessibility report contains ${accessibilityReport.issues.length} remaining issues`, 'warn')
  }

  // Implement focus trap for keyboard navigation
  focusTrap(container)

  if (fixes.langAdded) {
    log('Lang attribute added to HTML element', 'info')
  }

  if (fixes.mainLandmarkAdded) {
    log('Main landmark added', 'info')
  }

  // Check for new accessibility issues
  const newAccessibilityIssues = checkAccessibility(container)
  if (newAccessibilityIssues.length > 0) {
    log(`New accessibility issues found: ${newAccessibilityIssues.join(', ')}`, 'error')
  }

  const landmarkFixesCount = fixes.landmarksFixed || 0
  if (landmarkFixesCount > 0) {
    log(`Fixed ${landmarkFixesCount} unique landmarks`, 'info')
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

// Helper functions for session management
function getActiveSessionsCount() {
  return appState.sessions.size
}

function validateSession() {
  // Implementation of the validateSession function
  // Placeholder for actual implementation
  return false
}

function handleCredentialResponse(response) {
  // Implementation of the handleCredentialResponse function
  // Placeholder for actual implementation
  console.log('Credential Response:', response)
}

// New function to handle additional rendering logic
// @param {Object} additionalData - Additional data for rendering
// @returns {string} Rendered additional content HTML
function renderAdditionalContent(additionalData) {
  // Implementation of the new function
  // Placeholder for actual implementation
  return ''
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
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
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
    if (!th.hasAttribute('scope')) {
      const row = th.closest('tr')
      const cellIndex = Array.from(row.children).indexOf(th)
      th.setAttribute('scope',