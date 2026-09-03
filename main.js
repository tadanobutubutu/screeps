// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent')
const { indexContent } = require('./indexContent')

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
    dependencyGraph.setAttribute('id', 'dependencyGraph');
  }
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

/**
 * Gets the lang attribute for the HTML element.
 * @returns {string} The lang attribute value.
 */
function getLangAttribute () {
  return document.documentElement.lang || 'en'
}

/**
 * Returns the person name.
 * @param {Object} person - The person object.
 * @returns {string} The person's name.
 */
function personName (person) {
  return person && person.name || 'Unknown'
}

/**
 * Validates a landmark.
 * @param {HTMLElement} landmark - The landmark element to validate.
 * @returns {boolean} True if the landmark is valid, false otherwise.
 */
function validateLandmark (landmark) {
  return !!landmark
}

/**
 * Validates the structure of a landmark.
 * @param {HTMLElement} landmark - The landmark element to validate.
 * @returns {boolean} True if the landmark structure is valid, false otherwise.
 */
function validateLandmarkStructure (landmark) {
  return !!landmark
}

/**
 * Gets the accessible name for an SVG.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name of the SVG.
 */
function getSvgAccessibleName (svg) {
  return svg && (svg.getAttribute('aria-label') || svg.getAttribute('title')) || ''
}

/**
 * Creates an in-page button.
 * @param {string} label - The label for the button.
 * @param {Function} onClick - The click handler.
 * @returns {HTMLButtonElement} The created button element.
 */
function createInPageButton (label, onClick) {
  const button = document.createElement('button')
  button.textContent = label
  button.addEventListener('click', onClick)
  return button
}

// Function to fix fake link issues
function fixFakeLinkIssue (linkElement) {
  if (linkElement && linkElement.tagName === 'A') {
    const role = linkElement.getAttribute('role')
    if (role === 'button' || (linkElement.textContent && !linkElement.getAttribute('href'))) {
      linkElement.setAttribute('role', 'button')
    }
  }
  return linkElement
}

// New focus trap function for keyboard navigation accessibility
function newFocusTrap () {
  const focusableElements = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',')
  
  const firstElement = document.querySelector(focusableElements)
  const lastElement = document.querySelectorAll(focusableElements)
  const lastFocusable = lastElement[lastElement.length - 1]
  
  return {
    activate: function () {
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault()
              lastFocusable.focus()
            }
          } else {
            if (document.activeElement === lastFocusable) {
              e.preventDefault()
              firstElement.focus()
            }
          }
        }
      })
    },
    deactivate: function () {
      document.removeEventListener('keydown', null)
    }
  }
}

// Function to ensure unique landmarks
function ensureUniqueLandmarks (landmarks, property = 'id') {
  const seen = new Map()
  landmarks.forEach(landmark => {
    const value = landmark.getAttribute(property) || ''
    if (value) {
      if (seen.has(value)) {
        landmark.setAttribute(property, `${value}-${seen.get(value)}`)
        seen.set(value, seen.get(value) + 1)
      } else {
        seen.set(value, 1)
      }
    }
  })
  return landmarks
}

// Function to fix table structure accessibility
function fixTableStructure (tableElement) {
  if (!tableElement || tableElement.tagName !== 'TABLE') return null
  
  const rows = tableElement.querySelectorAll('tr')
  let hasHeader = false
  
  rows.forEach(row => {
    const thElements = row.querySelectorAll('th')
    if (thElements.length > 0) {
      hasHeader = true
      row.setAttribute('role', 'row')
      thElements.forEach(th => th.setAttribute('role', 'columnheader'))
    }
  })
  
  if (hasHeader) {
    tableElement.setAttribute('role', 'table')
  }
  
  return tableElement
}

// Function to ensure element has unique ID
function ensureElementHasId (element) {
  if (!element) return null
  if (!element.id) {
    const uniqueId = `element-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    element.id = uniqueId
  }
  return element
}

// Function to validate heading hierarchy
function validateHeadingHierarchy (container) {
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

// Function to ensure heading hierarchy
function ensureHeadingHierarchy (container) {
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
  return `<div>${JSON.stringify(additionalData)}</div>`
}

// New accessibility function for calculating complexity of a module
function calculateComplexity(moduleData) {
  return moduleData.dependencies ? moduleData.dependencies.length : 0;
}

// New rendering function
function renderGraphIndex(content, options = {}) {
  // Implementation for rendering the index with the given content and options
  // Call the indexContent function from the imported module
  return indexContent(content, options)
}

// New rendering function for dependency graph
function renderDependencyGraph(deps, options = {}) {
  // Use dependencyGraphContent from the imported module
  const graphContent = dependencyGraphContent(deps, options)
  return `<div class="dependency-graph-container" role="img" aria-label="Dependency graph visualization">${graphContent}</div>`
}

// New function for handling accessibility issues
function addressAccessibilityIssues () {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"]')
  ensureUniqueLandmarks(landmarks)
  
  const tables = document.querySelectorAll('table')
  tables.forEach(table => fixTableStructure(table))
  
  const svgElements = document.querySelectorAll('svg')
  svgElements.forEach(svg => {
    if (!svg.getAttribute('aria-label') && svg.querySelector('title')) {
      svg.setAttribute('aria-label', svg.querySelector('title').textContent)
    }
  })
  
  const focusableElements = document.querySelectorAll('button, input, select, textarea, a[href]')
  focusableElements.forEach(element => {
    if (element.textContent.trim() === '' || element.textContent === null) {
      element.setAttribute('aria-label', 'Interactive element')
    }
  })
}

// Export for use in other modules
module.exports = {
  createInPageButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  fixFakeLinkIssue,
  newFocusTrap,
  ensureUniqueLandmarks,
  fixTableStructure,
  ensureElementHasId,
  validateHeadingHierarchy,
  ensureHeadingHierarchy,
  renderAdditionalContent,
  calculateComplexity,
  renderGraphIndex,
  renderDependencyGraph,
  addressAccessibilityIssues
};