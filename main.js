// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent')
const { indexContent } = require('./indexContent')

/**
 * Main entry point for the Screeps bot.
 * Handles core game logic and integration points.
 */
class ScreepsBot {
  // ... Remaining code from both branches ...
}

function getSvgAccessibleName(svg) {
  // Check for title element
  const title = svg.querySelector('title')
  if (title && title.textContent.trim()) {
    return title.textContent.trim()
  }

  // Check for aria-label attribute
  if (svg.hasAttribute('aria-label')) {
    return svg.getAttribute('aria-label').trim()
  }

  // Check for aria-labelledby attribute
  if (svg.hasAttribute('aria-labelledby')) {
    const id = svg.getAttribute('aria-labelledby')
    const element = document.getElementById(id)
    if (element) {
      return element.textContent.trim()
    }
  }

  // Check for desc element
  const desc = svg.querySelector('desc')
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim()
  }

  return null
}

function renderDependencyGraph(deps, options = {}) {
  // Use dependencyGraphContent from the imported module
  const graphContent = dependencyGraphContent(deps, options)
  return `<div class="dependency-graph-container" role="img" aria-label="Dependency graph visualization">${graphContent}</div>`
}

function renderIndex(data, options = {}) {
  // Use indexContent from the imported module
  return indexContent(data, options)
}

const accessibilityUtils = {
  // Fix landmark issues
  fixAccessibilityIssues: (container) => {
    const fixes = {}

    const landmarkFixes = validateLandmark(container)
    if (landmarkFixes && landmarkFixes.length > 0) {
      fixes.landmarksFixed = landmarkFixes.length
    }
    const landmarkStructureFixes = validateLandmarkStructure(container)
    if (landmarkStructureFixes && landmarkStructureFixes.length > 0) {
      fixes.landmarksFixed += landmarkStructureFixes.length
    }

    // Fix SVG accessible names
    const svgElements = container.querySelectorAll('svg')
    svgElements.forEach(svg => {
      const accessibleName = getSvgAccessibleName(svg)
      if (accessibleName && accessibleName.length > 0) {
        setSvgAccessibilityProps(svg, accessibleName)
        fixes.svgNamesAdded++
      }
    })

    // Fix fake link issues (elements that look like links but are missing href)
    const fakeLinks = container.querySelectorAll('[style*="cursor: pointer"]')
    fakeLinks.forEach(link => {
      const style = window.getComputedStyle(link)
      if (style.cursor === 'pointer' || link.style.cursor === 'pointer') {
        link.setAttribute('role', 'link')
        link.setAttribute('tabindex', '0')
        fixes.fakeLinksFixed++
      }
    })

    // Validate accessibility report
    const report = validateAccessibilityReport(container)
    if (report && report.length > 0) {
      log(`Accessibility report contains ${report.length} remaining issues`, 'warn')
    }

    if (fixes.langAdded) {
      log('Lang attribute added to HTML element', 'info')
    }

    if (fixes.mainLandmarkAdded) {
      log('Main landmark added', 'info')
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
  },

  // TODO: Implement a new function to handle focus trap for keyboard navigation
  focusTrap: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    let activeElementIndex = focusableElements.length - 1

    function setActiveElement(index) {
      if (index < 0) {
        index = focusableElements.length - 1
      } else if (index >= focusableElements.length) {
        index = 0
      }

      if (focusableElements[index]) {
        focusableElements[index].focus()
      } else {
        focusableElements[0].focus()
      }
      activeElementIndex = index
    }

    function nextFocusableElement() {
      setActiveElement(activeElementIndex + 1)
    }

    function prevFocusableElement() {
      setActiveElement(activeElementIndex - 1)
    }

    function moveFocusToFirst() {
      setActiveElement(0)
    }

    function moveFocusToLast() {
      setActiveElement(focusableElements.length - 1)
    }

    element.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Tab':
          if (e.shiftKey) {
            prevFocusableElement()
          } else {
            nextFocusableElement()
          }
          e.preventDefault()
          break
        case 'ArrowLeft':
          prevFocusableElement()
          e.preventDefault()
          break
        case 'ArrowRight':
          nextFocusableElement()
          e.preventDefault()
          break
        case 'Home':
          moveFocusToFirst()
          e.preventDefault()
          break
        case 'End':
          moveFocusToLast()
          e.preventDefault()
          break
      }
    })
  },

  // TODO: Import the new function to create a button with correct accessibility properties for in-page linking
  createInPageButton: (text, href, options = {}) => {
    const button = document.createElement('button')
    button.textContent = text
    button.setAttribute('aria-label', options.ariaLabel || text)
    button.setAttribute('role', 'link')
    button.setAttribute('tabindex', '0')

    if (href) {
      button.addEventListener('click', () => {
        window.location.href = href
      })
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          window.location.href = href
        }
      })
    }

    return button
  },

  // TODO: Create a utility function to create a web resource button suitable for accessibility (e.g., Github, Stack Overflow, etc.)
  createWebResourceButton: (text, url, options = {}) => {
    const button = document.createElement('button')
    button.textContent = text
    button.setAttribute('aria-label', options.ariaLabel || `Link to ${text}`)
    button.setAttribute('role', 'link')
    button.setAttribute('tabindex', '0')

    if (url) {
      button.addEventListener('click', () => {
        window.open(url, '_blank', 'noopener,noreferrer')
      })
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          window.open(url, '_blank', 'noopener,noreferrer')
        }
      })
    }

    return button
  },

  // TODO: Validate the table structure for accessibility issues
  validateTableAccessibility: (table) => {
    const issues = []

    // Check if table has a caption
    if (!table.querySelector('caption')) {
      issues.push('Table is missing a caption')
    }

    // Check if table has proper headers
    const headers = table.querySelectorAll('th')
    if (headers.length === 0) {
      issues.push('Table is missing header cells')
    }

    // Check if table has proper scope attributes for headers
    headers.forEach(header => {
      if (!header.hasAttribute('scope')) {
        issues.push('Table header is missing scope attribute')
      }
    })

    // Check if table cells have proper headers
    const cells = table.querySelectorAll('td')
    cells.forEach(cell => {
      if (!cell.hasAttribute('headers')) {
        issues.push('Table cell is missing headers attribute')
      }
    })

    return issues
  },

  validateTableStructure: (table) => {
    const issues = []

    // Check if table has proper structure
    const rows = table.querySelectorAll('tr')
    if (rows.length === 0) {
      issues.push('Table is missing rows')
    }

    // Check if table has proper cells
    const cells = table.querySelectorAll('td, th')
    if (cells.length === 0) {
      issues.push('Table is missing cells')
    }

    return issues
  },

  // TODO: Validate the landmark structure for accessibility issues
  validateLandmark: validateLandmark,
  validateLandmarkStructure: validateLandmarkStructure,

  // TODO: Extract the accessible name for an SVG from its content
  getSvgAccessibleName: (svg) => {
    // Check for title element
    const title = svg.querySelector('title')
    if (title && title.textContent.trim()) {
      return title.textContent.trim()
    }

    // Check for aria-label attribute
    if (svg.hasAttribute('aria-label')) {
      return svg.getAttribute('aria-label').trim()
    }

    // Check for aria-labelledby attribute
    if (svg.hasAttribute('aria-labelledby')) {
      const id = svg.getAttribute('aria-labelledby')
      const element = document.getElementById(id)
      if (element) {
        return element.textContent.trim()
      }
    }

    // Check for desc element
    const desc = svg.querySelector('desc')
    if (desc && desc.textContent.trim()) {
      return desc.textContent.trim()
    }

    return null
  },

  // TODO: Add a language attribute to the HTML element
  getLangAttribute: (element) => {
    return element.getAttribute('lang') || element.getAttribute('xml:lang')
  },

  // TODO: Validate the accessibility report for issues
  validateAccessibilityReport: validateAccessibilityReport,

  // TODO: Address new accessibility issues from insight report ( implement new functions and fixes as needed)

  // Credential response handling
  handleCredentialResponse: async (response) => {
    if (!response) {
      throw new Error('No response received')
    }

    if (response.error) {
      throw new Error(response.error)
    }

    if (response.token) {
      return {
        success: true,
        token: response.token,
        expiresIn: response.expiresIn || 3600
      }
    }

    throw new Error('Invalid credential response')
  },

  // Existing utility functions
  log: (message, level = 'info') => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] [${level}] ${message}`)
  },

  // Export functionality with accessibility support
  exportUtils,

  // New focus trap functionality for keyboard navigation
  focusTrap
}

// Update UI function
const updateUI = () => {
  // ... Remaining code from both branches ...
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ScreepsBot,
    updateUI,
    renderDependencyGraph,
    renderIndex,
    accessibilityUtils,
  }
}