// TODO: This is the existing code that needs to be preserved
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// _Commit: dec99b86b66013fcd30722b40439605891dd0ad1_
// _Commit: ca07afdb3852933670d8d59e11575814d1bda9e5_
// <!-- todo-hash: e944d6bc26c5766586cd5c819c30f566e3ef878d -->
// _Commit: 9b0a0d6bb0214c2d74db539b8e33b7af757187a3_
// <!-- todo-hash: 6c02eea5ebc55ce1d03924617c86b97c69d7d9d6 -->
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// _Commit: aabb40916364c3b608e08e010dc71de4a04dfa74_

// Import necessary dependencies
import React from 'react'
import { render } from 'react-dom'
import {
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
  decodeJwtResponse,
  fixButtonIdentifiers,
  ensureElementHasId,
  ensureElementHasIdOrigin
} from './AccessibilityHelpers'

// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
=======
const main = require('./utilities')
>>>>>>> origin/main

// Import necessary dependencies
import React from 'react'
import { render } from 'react-dom'
import {
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
  decodeJwtResponse,
  fixButtonIdentifiers,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
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
  getLangAttribute,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  renderGraphIndex,
  trapFocus,
  renderAdditionalContent,
  checkAccessibilityForReport
} = './AccessibilityHelpers'
>>>>>>> origin/main

// Access the dependencyGraph container and ensure it has proper ARIA role
const dependencyGraph = document.getElementById('dependencyGraph')

if (dependencyGraph) {
  // Set appropriate ARIA role for the dependency graph container
  // Using 'region' role for a contained section of content
  if (!dependencyGraph.hasAttribute('role')) {
    dependencyGraph.setAttribute('role', 'region')
  }

  // Add accessible label if not already present
  if (!dependencyGraph.hasAttribute('aria-label')) {
    dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization')
  }

  // Ensure element has an ID if not present
  if (!dependencyGraph.hasAttribute('id')) {
    dependencyGraph.id = 'dependencyGraph';
  }

  // Ensure the container is focusable if it's interactive
  if (!dependencyGraph.hasAttribute('tabindex')) {
    dependencyGraph.setAttribute('tabindex', '0')
}

// Import specific helper functions from main module
const {
  createInPageButton: createInPageButtonAlt,
  createWebResourceButton: createWebResourceButtonAlt,
  validateLandmark: validateLandmarkAlt,
  validateLandmarkStructure: validateLandmarkStructureAlt,
  getSvgAccessibleName: getSvgAccessibleNameAlt,
  getLangAttribute: getLangAttributeAlt,
  validateAccessibilityReport: validateAccessibilityReportAlt,
  exportUtils: exportUtilsAlt,
  addressAccessibilityIssues: addressAccessibilityIssuesAlt,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  createInPageButtonAlt,
  createWebResourceButtonAlt,
  validateLandmarkAlt,
  validateLandmarkStructureAlt,
  getSvgAccessibleNameAlt,
  getLangAttributeAlt,
  validateAccessibilityReportAlt,
  exportUtilsAlt,
  addressAccessibilityIssuesAlt,
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
  getSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  decodeJwtResponse,
  fixButtonIdentifiers,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  renderGraphIndex,
  trapFocus,
  renderAdditionalContent,
  checkAccessibilityForReport
} = main

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
  renderDependencyGraphs(dependencyGraph)
  fixButtonIdentifiers(dependencyGraph)
  fixDependencyGraphAria(dependencyGraph)

  // Fix landmark issues
  validateLandmark(dependencyGraph)
  validateLandmarkStructure(dependencyGraph)
  fixes.landmarksFixed++

  // Fix SVG accessible names
  const svgElements = dependencyGraph.querySelectorAll('svg')
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
  });

  // Fix fake link issues (elements that look like links but are missing href)
  const fakeLinks = dependencyGraph.querySelectorAll('a:not([href])')
  fakeLinks.forEach((link) => {
    link.setAttribute('href', '#' + (link.id || `link-${Date.now()}`))
    link.setAttribute('role', 'link')
    fixes.fakeLinksFixed++
  });

  // Validate accessibility report
  const accessibilityReport = validateAccessibilityReport(dependencyGraph)
  if (accessibilityReport && accessibilityReport.issues && accessibilityReport.issues.length > 0) {
    console.log(`Accessibility report contains ${accessibilityReport.issues.length} remaining issues`)
  }

  // Implement focus trap for keyboard navigation
  focusTrap(dependencyGraph)

  if (fixes.langAdded) {
    console.log('Lang attribute added to HTML element')
  }

  if (fixes.mainLandmarkAdded) {
    console.log('Main landmark added')
  }

  // Check for new accessibility issues
  const newAccessibilityIssues = checkAccessibility(dependencyGraph)
  if (newAccessibilityIssues && newAccessibilityIssues.length > 0) {
    console.log(`New accessibility issues found: ${newAccessibilityIssues.join(', ')}`, 'error')
  }

  const landmarkFixesCount = fixes.landmarksFixed || 0
  if (landmarkFixesCount > 0) {
    console.log(`Fixed ${landmarkFixesCount} unique landmarks`)
  }

  const svgFixes = fixes.svgNamesAdded || 0
  if (svgFixes > 0) {
    console.log(`Fixed accessible names for ${svgFixes} SVGs`)
  }

  const fakeLinkFixes = fixes.fakeLinksFixed || 0
  if (fakeLinkFixes > 0) {
    console.log(`Fixed fake link issues for ${fakeLinkFixes} elements`)
  }

  googleSignIn()
  fixButtonIdentifiers()
  return fixes
}

function getActiveSessionsCount() {
  return appState.sessions.size
}

// New feature: Priority-based task scheduling
function addTask(taskFn, priority = 'medium') {
  if (!this.tasks) {
    this.tasks = []
  }
  this.tasks.push({ task: taskFn, priority })
  this.scheduleTasks()
}

// Handle keyboard navigation (e.g., arrow keys, tab)
function handleKeyboardNavigation(key, event, activeElement) {
  switch (key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
      handleArrowNavigation(key, activeElement)
      break
    case 'Tab':
      handleTabNavigation(event, activeElement)
      break
    default:
      break
  }
}

// Helper for arrow key navigation
function handleArrowNavigation(key, activeElement) {
  // Implement custom navigation logic based on element type
  console.log(`Navigating with ${key} key`)
}

// Helper for tab key navigation
function handleTabNavigation(event, activeElement) {
  // Implement tab navigation logic
  console.log(`Handling Tab navigation`)
}

// Accessibility: Ensure the dependencyGraph container has a proper ARIA role
function setupDependencyGraphContainer(containerId) {
  const container = document.getElementById(containerId)
  if (container) {
    container.setAttribute('role', 'img')
    container.setAttribute('aria-label', 'Dependency graph')
  }
}

function validateSession() {
  // Implementation of the validateSession function
  // Placeholder for actual implementation
  return false
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
  return new XMLSerializer().serializeToString(svg)
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
  validateTableStructure
  // Preserve any other existing exports here
}

// New function or changes requested in the issue
/**
 * New function to handle additional rendering logic
 * @param {Object} additionalData - Additional data for rendering
 * @returns {string} Rendered additional content HTML
 */
function renderAdditionalContent (additionalData) {
  /**
   * New function to handle additional rendering logic
   * @param {Object} additionalData - Additional data for rendering
   * @returns {string} Rendered additional content HTML
   */
  function renderAdditionalContentData(additionalData) {
    return `<div>${JSON.stringify(additionalData)}</div>`
  }

  return renderAdditionalContentData(additionalData)
}

export { implementAccessibilityFixesFromReport, getActiveSessionsCount, validateSession, handleCredentialResponse, renderAdditionalContentData }

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

class ScreepsBot {
  constructor() {
    this.network = null
    this.tasks = []
    this.config = {}
    this.ensureDependencyGraphARIA() // Ensure ARIA role for dependency graph container
  }

  async start() {
    // Initialize network connection
    await this.network.connect()

    // Load initial data
    await this.loadData()

    // Ensure dependencyGraph container has proper ARIA role
    this.ensureDependencyGraphARIA()

    console.log('Screenspider bot started')
  }

  loadData() {
    // Placeholder for data loading logic
    // Implement actual data fetching here
  }

  // Accessibility enhancement: Ensure the dependencyGraph container has a proper ARIA role
  setDependencyGraphRole() {
    const dependencyGraph = document.getElementById('dependencyGraph')
    if (dependencyGraph) {
      dependencyGraph.setAttribute('role', 'graph')
    }
  }

  // Accessibility enhancement: Ensure all UI elements are properly labeled
  setElementLabel(elementId, label) {
    const el = document.getElementById(elementId)
    if (el) {
      // Only set aria-label if not already present
      if (!el.getAttribute('aria-label')) {
        el.setAttribute('aria-label', label)
      }
      // Set role to button if not already present
      if (!el.getAttribute('role') || el.getAttribute('role') !== 'button') {
        el.setAttribute('role', 'button')
      }
    }
  }

  // New feature: Priority-based task scheduling
  addTask(taskFn, priority = 'medium') {
    this.tasks.push({ task: taskFn, priority })
    this.scheduleTasks()
  }

  scheduleTasks() {
    // Sort tasks by priority (high > medium > low)
    this.tasks.sort((a, b) => {
      const prioOrder = { high: 0, medium: 1, low: 2 }
      return prioOrder[b.priority] - prioOrder[a.priority]
    })

    // Execute highest priority task
    if (this.tasks.length > 0) {
      const nextTask = this.tasks[0]
      try {
        nextTask.task()
      } catch (err) {
        console.error(`Task failed: ${err.message}`)
      }
    }
  }

  // New accessibility function: Focus management for keyboard navigation
  setFocus(elementId) {
    const element = document.getElementById(elementId)
    if (element) {
      element.focus()
      element.setAttribute('tabindex', '0')
    }
  }

  // New accessibility function: Keyboard event handler for accessibility
  handleKeyboardNavigation(event) {
    const key = event.key
    const activeElement = document.activeElement

    // Handle keyboard navigation (e.g., arrow keys, tab)
    switch (key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        this.handleArrowNavigation(key, activeElement)
        break
      case 'Tab':
        this.handleTabNavigation(event, activeElement)
        break
      default:
        break
    }
  }

  // Helper for arrow key navigation
  handleArrowNavigation(key, activeElement) {
    // Implement custom navigation logic based on element type
    console.log(`Navigating with ${key} key`)

    // Get all focusable elements in the document
    const focusableElements = document.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    if (!focusableElements || focusableElements.length === 0) {
      console.log('No focusable elements found for arrow navigation')
      return
    }

    const currentIndex = Array.from(focusableElements).indexOf(activeElement)
    if (currentIndex === -1) {
      console.log('Active element not found in focusable elements')
      return
    }

    let targetIndex

    switch (key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        targetIndex = Math.max(0, currentIndex - 1)
        break
      case 'ArrowDown':
      case 'ArrowRight':
        targetIndex = Math.min(focusableElements.length - 1, currentIndex + 1)
        break
      default:
        return
    }

    if (targetIndex !== currentIndex && focusableElements[targetIndex]) {
      focusableElements[targetIndex].focus()
      console.log(`Focus moved from index ${currentIndex} to ${targetIndex}`)
    } else {
      console.log(`Cannot navigate ${key}: at boundary (index ${currentIndex})`)
    }
  }

  // Helper for tab key navigation
  handleTabNavigation(event, activeElement) {
    const key = event.key
    if (key !== 'Tab') {
      return
    }

    const focusableElements = document.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) {
      return
    }

    if (activeElement === focusableElements[0]) {
      // First element, go to last
      focusableElements[focusableElements.length - 1].focus()
    } else {
      // Last element, go to first
      focusableElements[0].focus()
    }
  }

  // Ensure dependencyGraph container has proper ARIA role
  ensureDependencyGraphARIA() {
    const container = document.getElementById('dependencyGraph')
    if (container) {
      container.setAttribute('role', 'region')
      container.setAttribute('aria-label', 'Dependency graph')
    }
  }
}

/**
 * REACT_015: Add lang attribute to HTML element
 * Ensures the HTML element has a proper lang attribute for screen readers
 */
class ScreepsBot {
  constructor() {
    this.network = null
    this.tasks = []
    this.config = {}
    this.ensureDependencyGraphARIA()
  }

  async start() {
    // Initialize network connection
    await this.network.connect()

    // Load initial data
    await this.loadData()

    // Ensure dependencyGraph container has proper ARIA role
    this.ensureDependencyGraphARIA()

    console.log('Screenspider bot started')
  }

  loadData() {
    // Placeholder for data loading logic
    // Implement actual data fetching here
  }

  // Accessibility enhancement: Ensure the dependencyGraph container has a proper ARIA role
  setDependencyGraphRole() {
    const dependencyGraph = document.getElementById('dependencyGraph')
    if (dependencyGraph) {
      dependencyGraph.setAttribute('role', 'graph')
    }
  }

  // Accessibility enhancement: Ensure all UI elements are properly labeled
  setElementLabel(elementId, label) {
    const el = document.getElementById(elementId)
    if (el) {
      // Only set aria-label if not already present
      if (!el.getAttribute('aria-label')) {
        el.setAttribute('aria-label', label)
      }
      // Set role to button if not already present
      if (!el.getAttribute('role') || el.getAttribute('role') !== 'button') {
        el.setAttribute('role', 'button')
      }
    }
  }

  // New feature: Priority-based task scheduling
  addTask(taskFn, priority = 'medium') {
    this.tasks.push({ task: taskFn, priority })
    this.scheduleTasks()
  }

  scheduleTasks() {
    // Sort tasks by priority (high > medium > low)
    this.tasks.sort((a, b) => {
      const prioOrder = { high: 0, medium: 1, low: 2 }
      return prioOrder[b.priority] - prioOrder[a.priority]
    })

    // Execute highest priority task
    if (this.tasks.length > 0) {
      const nextTask = this.tasks[0]
      try {
        nextTask.task()
      } catch (err) {
        console.error(`Task failed: ${err.message}`)
      }
    }
  }

  // New accessibility function: Focus management for keyboard navigation
  setFocus(elementId) {
    const element = document.getElementById(elementId)
    if (element) {
      element.focus()
      element.setAttribute('tabindex', '0')
    }
  }

  // New accessibility function: Keyboard event handler for accessibility
  handleKeyboardNavigation(event) {
    const key = event.key
    const activeElement = document.activeElement

    // Handle keyboard navigation (e.g., arrow keys, tab)
    switch (key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        this.handleArrowNavigation(key, activeElement)
        break
      case 'Tab':
        this.handleTabNavigation(event, activeElement)
        break
      default:
        break
    }
  }

  // Helper for arrow key navigation
  handleArrowNavigation(key, activeElement) {
    // Implement custom navigation logic based on element type
    console.log(`Navigating with ${key} key`)

    // Get all focusable elements in the document
    const focusableElements = document.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    if (!focusableElements || focusableElements.length === 0) {
      console.log('No focusable elements found for arrow navigation')
      return
    }

    const currentIndex = Array.from(focusableElements).indexOf(activeElement)
    if (currentIndex === -1) {
      console.log('Active element not found in focusable elements')
      return
    }

    let targetIndex

    switch (key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        targetIndex = Math.max(0, currentIndex - 1)
        break
      case 'ArrowDown':
      case 'ArrowRight':
        targetIndex = Math.min(focusableElements.length - 1, currentIndex + 1)
        break
      default:
        return
    }

    if (targetIndex !== currentIndex && focusableElements[targetIndex]) {
      focusableElements[targetIndex].focus()
      console.log(`Focus moved from index ${currentIndex} to ${targetIndex}`)
    } else {
      console.log(`Cannot navigate ${key}: at boundary (index ${currentIndex})`)
    }
  }

  // Helper for tab key navigation
  handleTabNavigation(event, activeElement) {
    const key = event.key
    if (key !== 'Tab') {
      return
    }

    const focusableElements = document.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) {
      return
    }

    if (activeElement === focusableElements[0]) {
      // First element, go to last
      focusableElements[focusableElements.length - 1].focus()
    } else {
      // Last element, go to first
      focusableElements[0].focus()
    }
  }

  // Ensure dependencyGraph container has proper ARIA role
  ensureDependencyGraphARIA() {
    const container = document.getElementById('dependencyGraph')
    if (container) {
      container.setAttribute('role', 'region')
      container.setAttribute('aria-label', 'Dependency graph')
    }
  }
}

/**
 * REACT_027: Fix table structure issues
 * Ensures tables have proper structure with headers and captions
 */
function fixTableStructure(tableElement) {
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

// Add the new function to the exports
module.exports.renderAdditionalContent = renderAdditionalContent
module.exports.implementAccessibilityFixesFromReport = implementAccessibilityFixesFromReport
module.exports.checkAccessibilityForReport = checkAccessibilityForReport
module.exports.renderGraphIndex = renderGraphIndex
module.exports.trapFocus = trapFocus
module.exports.ScreepsBot = ScreepsBot
module.exports.fixTableStructure = fixTableStructure
module.exports.addLangAttribute = function(element, lang = 'en') {
  let htmlElement = element || document.documentElement
  if (!htmlElement) {
    return null
  }

  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang)
  }
  return htmlElement
}