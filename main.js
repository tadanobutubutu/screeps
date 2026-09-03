// TODO: This is the existing code that needs to be preserved
// Commit: 4b6a2d9cd5c9157ab5c9882ae41c5814f0c4ce60

const main = require('./utilities')

const {
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
  addAriaLabel,
  renderDependencyGraphs,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  uniqueLandmarks,
  addSvgAccessibleNames,
  checkAccessibility,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues
} = require('./AccessibilityHelpers')

import React from 'react'

// Module-level function definitions
function affectedFunction() {
  return main.affectedFunction()
}

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en'
  }
  return lang || 'en'
}

// Placeholder functions from HEAD - keeping them to avoid removing unused code
function newFunction() {
  // New function implementation
}

function anotherNewFunction() {
  // Another new function implementation
}

// Combined addAccessibleName function - merges HEAD's simple implementation with origin/main's validation logic
function addAccessibleName(svgString) {
  const parser = new DOMParser()
  const svg = parser.parseFromString(svgString, 'image/svg+xml')
  const svgElement = svg.documentElement
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', getSvgAccessibleName(svgElement))
  }
}

// Additional landmark-related functions from origin/main
function validateLandmark(landmark) {
  // Implementation from origin/main
  if (!landmark || typeof landmark !== 'object') {
    throw new Error('Invalid landmark object')
  }
  if (!landmark.id) {
    throw new Error('Landmark missing id')
  }
  if (!landmark.name) {
    throw new Error('Landmark missing name')
  }
  return true
}

function validateLandmarkStructure(landmark) {
  // Validation logic for landmark structure
  if (!landmark.title) {
    throw new Error('Landmark missing title')
  }
  if (!landmark.description) {
    throw new Error('Landmark missing description')
  }
  return true
}

// Updated validateTableAccessibility - combines HEAD wrapper with origin/main details
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] }
  }

  const errors = []

  // Check for proper caption or summary
  const hasCaption = !!tableElement.querySelector('caption')
  const hasSummary = !!tableElement.querySelector('summary')
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility')
  }

  // Validate table structure
  if (!tableElement.tBrowsableElementType) {
    errors.push('Table is missing required table structure')
  }

  const thead = tableElement.querySelector('thead')
  if (!thead) {
    errors.push('Table header row is missing <thead> element')
  }

  const thElements = thead?.querySelectorAll('th')
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements')
  }

  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`)
    }
  })

  return { valid: errors.length === 0, errors }
}

// Updated validateTableStructure - combines HEAD wrapper with origin/main details
function validateTableStructure(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] }
  }

  const errors = []

  // Check for proper caption or summary
  const hasCaption = !!tableElement.querySelector('caption')
  const hasSummary = !!tableElement.querySelector('summary')
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility')
  }

  // Validate table structure
  if (!tableElement.tBrowsableElementType) {
    errors.push('Table is missing required table structure')
  }

  const thead = tableElement.querySelector('thead')
  if (!thead) {
    errors.push('Table header row is missing <thead> element')
  }

  const thElements = thead?.querySelectorAll('th')
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements')
  }

  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`)
    }
  })

  return { valid: errors.length === 0, errors }
}

// Other utility functions from HEAD remain unchanged
function handleCredentialResponse(response) {
  console.log('Credential Response:', response)
}

export default main