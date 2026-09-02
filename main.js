const main = require('./utilities')

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
  checkAccessibility,
  validateTableStructureForAccessibility,
  implementAccessibilityFixesFromReport,
  checkAccessibilityForReport,
  renderGraphIndex,
  trapFocus,
  addLandmarkRegions,
  uniqueLandmarks,
  fixFakeLinkIssues,
  getActiveSessionsCount,
  validateSession,
  handleCredentialResponse,
  accessibilityUtils,
  createAnnouncer,
  prefersReducedMotion,
  renderSimpleDependencyGraph,
  addAccessibleName,
  addAccessibleNamesToSVGs,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  googleSignIn,
  decodeJwtResponse,
  renderDependencyGraph,
  fixLandmarkIssues,
  validateTableAccessibility,
  validateTableStructure,
  initializeAccessibility,
  renderIndex,
  validateHeadingHierarchy,
  ensureHeadingHierarchy,
  renderAdditionalContent
} = require('./AccessibilityHelpers')

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
  if (!dependencyGraph.id) {
    dependencyGraph.id = 'dependencyGraph'
  }

  // Ensure the container is focusable if it's interactive
  if (!dependencyGraph.hasAttribute('tabindex')) {
    dependencyGraph.setAttribute('tabindex', '0')
  }

  // New accessibility function: Manage focus restoration for modal dialogs
  function setupFocusTrap(containerSelector) {
    const container = document.querySelector(containerSelector)
    if (!container) {
      console.error('Focus trap container not found:', containerSelector)
      return
    }

    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) {
      console.error('No focusable elements found in container:', containerSelector)
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)

    // Focus the first element initially
    firstElement.focus()

    // Return a cleanup function to remove the event listener
    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }

  // New accessibility function: Restore focus to previously focused element
  function restoreFocus(previousElementId) {
    const previousElement = document.getElementById(previousElementId)
    if (previousElement) {
      previousElement.focus()
    } else {
      console.warn('Previous element not found for focus restoration:', previousElementId)
    }
  }
}

// Required changes to fix the React SVG Accessible Name issue
function addAccessibleName(svgString) {
  // This function adds an `aria-label` attribute to the SVG if it doesn't already have one
  // and returns the modified SVG string.
  // Note: This is a simplified example and might need adjustments based on the actual SVG structure.
  const { DOMParser } = require('@xmldom/xmldom')
  const parser = new DOMParser()
  const svg = parser.parseFromString(svgString, 'image/svg+xml')
  const svgElement = svg.documentElement
  if (!svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', 'Descriptive label for SVG')
  }
  const { XMLSerializer } = require('@xmldom/xmldom')
  const serializer = new XMLSerializer()
  return serializer.serializeToString(svg)
}

// Example usage of the function
const originalSvgString =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" ...'
const modifiedSvgString = addAccessibleName(originalSvgString)

/**
 * Validates table accessibility
 * @param {HTMLElement} container - Container element to validate tables in
 * @returns {Array} Array of accessibility issues found in tables
 */
function validateTableAccessibility(container) {
  return validateTableStructureForAccessibility(container)
}

/**
 * Validates table structure
 * @param {HTMLElement} container - Container element to validate table structure in
 * @returns {Array} Array of structural issues found in tables
 */
function validateTableStructure(container) {
  return validateTableStructureForAccessibility(container)
}

/**
 * Validates table structure for accessibility issues
 * Checks for proper table headers, scope attributes, captions, and structure
 * @param {HTMLElement} container - The container element to check for tables
 * @returns {Array} Array of accessibility issues found
 */
function validateTableStructureForAccessibility(container) {
  const issues = []
  if (!container) return issues

  const tables = container.querySelectorAll('table')
  tables.forEach((table, index) => {
    // Check for caption
    if (!table.querySelector('caption')) {
      issues.push({
        type: 'missing-caption',
        element: table,
        message: `Table ${index + 1} is missing a <caption> element`
      })
    }

    // Check for headers
    const headers = table.querySelectorAll('th')
    if (headers.length === 0) {
      issues.push({
        type: 'missing-headers',
        element: table,
        message: `Table ${index + 1} has no header cells (th)`
      })
    } else {
      headers.forEach((header, headerIndex) => {
        if (!header.hasAttribute('scope')) {
          issues.push({
            type: 'missing-scope',
            element: header,
            message: `Table ${index + 1}, header ${headerIndex + 1} is missing scope attribute`
          })
        }
      })
    }

    // Check for proper structure (thead, tbody, tfoot)
    if (!table.querySelector('thead') && !table.querySelector('tbody') && !table.querySelector('tfoot')) {
      issues.push({
        type: 'missing-structure',
        element: table,
        message: `Table ${index + 1} should have thead, tbody, or tfoot elements`
      })
    }
  })

  return issues
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer()
  // Add language attribute if missing
  addLangAttribute()
  // Fix table structure
  fixTableStructure()
  // Add main landmark
  addMainLandmark()
  // Fix landmark issues
  fixLandmarkIssues()
  // Ensure unique landmarks
  ensureUniqueLandmarks()
  // Add SVG accessible names
  addSvgAccessibleNames()
  addAccessibleNamesToSVGs()
  // Fix fake link issues
  fixFakeLinkIssue()
  // Initialize Google Sign-In
  googleSignIn()
  // Fix button identifiers
  fixButtonIdentifiers()
}

function validateHeadingHierarchy(headings) {
  if (!headings || headings.length === 0) return true

  let previousLevel = 0
  for (const heading of headings) {
    const currentLevel = parseInt(heading.tagName.substring(1), 10)
    if (previousLevel > 0 && currentLevel - previousLevel > 1) {
      return false
    }
    previousLevel = currentLevel
  }
  return true
}

function ensureHeadingHierarchy(container) {
  if (!container) return null

  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  let previousLevel = 0

  headings.forEach(heading => {
    const currentLevel = parseInt(heading.tagName.substring(1), 10)
    if (previousLevel > 0 && currentLevel - previousLevel > 1) {
      // Fix skipped heading levels by promoting or demoting as needed
      const correctedLevel = previousLevel + 1
      const newHeading = document.createElement(`h${correctedLevel}`)
      newHeading.innerHTML = heading.innerHTML
      newHeading.className = heading.className
      heading.parentNode.replaceChild(newHeading, heading)
      previousLevel = correctedLevel
    } else {
      previousLevel = currentLevel
    }
  })

  return container
}

/**
 * New function to handle additional rendering logic
 * @param {Object} additionalData - Additional data for rendering
 * @returns {string} Rendered additional content HTML
 */
function renderAdditionalContent(additionalData) {
  // Implementation of the new function
  // Placeholder for actual implementation
  return `<div class="additional-content">${additionalData?.content || ''}</div>`
}

/**
 * Implement the function for addressing accessibility issues from insight report
 */
function newFunction() {
  // TODO: Implement the new function as per the issue requirements
}

// Call the functions to address the accessibility issues
initializeAccessibility()

// Call the new functions
validateTableAccessibility(document.body)
validateTableStructure(document.body)

module.exports = {
  ...main,
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
  checkAccessibility,
  validateTableStructureForAccessibility,
  implementAccessibilityFixesFromReport,
  checkAccessibilityForReport,
  renderGraphIndex,
  trapFocus,
  addLandmarkRegions,
  uniqueLandmarks,
  fixFakeLinkIssues,
  getActiveSessionsCount,
  validateSession,
  handleCredentialResponse,
  accessibilityUtils,
  createAnnouncer,
  prefersReducedMotion,
  renderSimpleDependencyGraph,
  addAccessibleName,
  addAccessibleNamesToSVGs,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  googleSignIn,
  decodeJwtResponse,
  renderDependencyGraph,
  fixLandmarkIssues,
  validateTableAccessibility,
  validateTableStructure,
  initializeAccessibility,
  renderIndex,
  validateHeadingHierarchy,
  ensureHeadingHierarchy,
  renderAdditionalContent,
  newFunction,
  setupFocusTrap,
  restoreFocus
}