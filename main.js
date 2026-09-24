// Import the new modules
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { WindowContext } from 'react-open-window';

// CommonJS requires
const main = require('./utilities');
const { requireDir } = require('require-dir');
requireDir(require.resolve('./utilities'));

// Import all utilities functions for convenience
const {
  createInPageButton,
  createWebResourceButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  getSvgAccessibleName,
  getLangAttribute,
  ensureElementId,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addMainLandmark,
  addLangAttribute,
  fixTableStructureIssues,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  renderDependencyGraphAria,
  addMainLandmarkToIndex,
  // New function to handle focus trap
  newFocusTrap: newMainFocusTrap,
  // New functions to address new accessibility issues from insight report
  newAddressAccessibilityIssues: addressAccessibilityIssues
} = main;

const http = require('http');

const a11yStore = {
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    })
  },

  announceToScreenReader: (message, priority = 'polite') => {
    const announcer = document.createElement('div')
    announcer.setAttribute('role', 'status')
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.style.position = 'absolute'
    announcer.style.left = '-9999px'
    announcer.textContent = message
    document.body.appendChild(announcer)
    setTimeout(function () {
      announcer.remove()
    }, 1000)
  },

  handleKeyboardNav: (e, handlers) => {
    const key = e.key
    if (handlers[key]) {
      handlers[key](e)
    }
  },

  // Get language attribute for HTML element
  getLangAttribute: () => {
    return document.documentElement.getAttribute('lang') || 'en'
  },

  // Validate table accessibility
  validateTableAccessibility: (table) => {
    // Check for proper table structure and ARIA attributes
    if (!table.querySelector('thead') || !table.querySelector('tbody')) {
      console.warn('Table missing thead or tbody')
      return false
    }
    return true
  },

  // Validate table structure
  validateTableStructure: (table) => {
    // Check for proper table structure
    const rows = table.querySelectorAll('tr')
    if (rows.length === 0) {
      console.warn('Table has no rows')
      return false
    }
    return true
  },

  // Validate landmark elements
  validateLandmark: () => {
    const landmarks = ['header', 'nav', 'main', 'footer']
    landmarks.forEach((landmark) => {
      const elements = document.querySelectorAll(landmark)
      if (elements.length > 1) {
        console.warn(`Multiple ${landmark} elements found`)
      }
    })
  },

  // Validate landmark structure
  validateLandmarkStructure: () => {
    const main = document.querySelector('main')
    if (!main) {
      console.warn('Main landmark missing')
      return false
    }
    return true
  },

  // Get accessible name for SVG
  getSvgAccessibleName: (svg) => {
    const title = svg.querySelector('title')
    const desc = svg.querySelector('desc')
    if (title) return title.textContent
    if (desc) return desc.textContent
    return svg.getAttribute('aria-label') || 'SVG graphic'
  },

  // Create in-page button with proper accessibility attributes
  createInPageButton: (text, href) => {
    const button = document.createElement('a')
    button.textContent = text
    button.href = href
    button.setAttribute('role', 'button')
    button.setAttribute('tabindex', '0')
    return button
  },

  // Get person name with proper accessibility attributes
  personName: (name) => {
    const span = document.createElement('span')
    span.textContent = name
    span.setAttribute('aria-label', name)
    return span
  },

  // New focus trap implementation
  newFocusTrap: (element) => {
    if (!element) {
      console.warn('No element provided for focus trap')
      return
    }

    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) {
      console.warn('No focusable elements found in the provided element')
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Set initial focus to first element
    firstElement.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    element.addEventListener('keydown', handleKeyDown)

    return {
      destroy: () => {
        element.removeEventListener('keydown', handleKeyDown)
      }
    }
  }

  // Check for site name in the origin and set it as the username
  const siteName = document.location.hostname;
  const username = siteName.split('.').slice(0, 2).join('.');

  // Handle the credentialResponse
  const authentication = credentialResponse.getBasicProfile();
  if (authentication) {
    const idToken = credentialResponse.getIdToken();

    // Store the session data
    const sessionData = {
      idToken,
      email: authentication.getEmail(),
      username,
      firstName: authentication.getGivenName(),
      lastName: authentication.getFamilyName(),
      imageUrl: authentication.getImageUrl(),
    };

    // Add or update session data in the state
    const existingSession = appState.sessions.get(sessionData.idToken);
    if (existingSession) {
      existingSession.email = sessionData.email;
      existingSession.firstName = sessionData.firstName;
      existingSession.lastName = sessionData.lastName;
      existingSession.imageUrl = sessionData.imageUrl;
    } else {
      appState.sessions.set(sessionData.idToken, sessionData);
    }

    // Announce success to screen readers (guard in case function missing)
    if (accessibilityUtils.announceToScreenReader) {
      accessibilityUtils.announceToScreenReader(`Logged in as ${sessionData.username}`);
    }

    return { status: 'success', data: sessionData };
  }

  return { status: 'error', message: 'User does not have a Google account' };
};

/**
 * Adds an aria-label attribute to an element.
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text to set
 * @returns {HTMLElement} The element with the aria-label added
 */
function addAriaLabel(element, label) {
  if (!element) {
    return
  }

  if (typeof label !== 'string' || label.trim() === '') {
    return element
  }

  element.setAttribute('aria-label', label)
  return element
}

// Add the new module usage to renderMyComponent
function renderMyComponent(props) {
  // use the imported React module here and other necessary work
  // ...
}

// Add the new module usage to renderAnotherComponent
function renderAnotherComponent(props) {
  // use the imported React module, Testing Library, and WindowContext here and other necessary work
  // ...
}

/**
 * Renders the graph index view
 * @param {Object} graphData - The graph data to render
 * @returns {string} Rendered graph index HTML
 */
function renderGraphIndex(graphData) {
  // Use the existing renderDependencyGraph function for actual rendering
  return renderDependencyGraph(graphData);
}

// Accessibility function (merged from both branches)
function setSvgAccessibleProps(svg) {
  addSvgAccessibleNames(svg); // From branch HEAD
  validateLandmarkStructure(svg); // From branch origin/main
  const titleElement = main.getSvgAccessibleName(svg);
  if (titleElement) {
    svg.setAttribute('aria-labelledby', titleElement.id);
  }
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
}

/**
 * Renders the dependency graph view
 * @param {Object} deps - Dependencies object
 * @param {Object} options - Rendering options
 * @returns {string} Rendered dependency graph HTML
 */
function renderDependencyGraph(deps, options = {}) {
  // Use dependencyGraphContent from the imported module
  // Note: dependencyGraphContent should be provided by the utilities module
  return dependencyGraphContent(deps, options);
}

// Export all functions that need to be available externally
module.exports = {
  createInPageButton,
  createWebResourceButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  getSvgAccessibleName,
  getLangAttribute,
  ensureElementId,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addMainLandmark,
  addLangAttribute,
  fixTableStructureIssues,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  renderDependencyGraphAria,
  addMainLandmarkToIndex,
  newMainFocusTrap,
  addressAccessibilityIssues,
  addAriaLabel,
  renderGraphIndex,
  renderDependencyGraph,
  renderMyComponent,
  renderAnotherComponent,
  // Export the new modules and functions
  React,
  render,
  WindowContext
};