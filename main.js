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
  addAriaLabel,
  renderDependencyGraphs,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  newFocusTrap
} from './AccessibilityHelpers'

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
    dependencyGraph.setAttribute('id', 'dependencyGraph')
  }

  // Ensure the container is focusable if it's interactive
  if (!dependencyGraph.getAttribute('tabindex')) {
    dependencyGraph.setAttribute('tabindex', '0')
  }
}

// Required changes to fix the React SVG Accessible Name issue
function addAccessibleName (svgString) {
  const svg = new DOMParser().parseFromString(svgString, 'image/svg+xml')
  const svgElement = svg.documentElement
  if (!svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', 'Descriptive label for SVG')
  }
  return new XMLSerializer().serializeToString(svg)
}

// Handle accessibility issues from the report
function addressAccessibilityIssues (container) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0
  }

  // Add lang attribute to HTML element if missing
  const htmlElement = document.documentElement
  const langAttr = getLangAttribute(htmlElement)
  if (!langAttr) {
    addLangAttribute(htmlElement, 'en')
    fixes.langAdded = true
  }

  // Add main landmark if missing
  const mainElement = container.querySelector('main') || container.querySelector('[role="main"]')
  if (!mainElement) {
    const body = container.querySelector('body')
    if (body) {
      const newMain = document.createElement('main')
      while (body.firstChild) {
        newMain.appendChild(body.firstChild)
      }
      body.insertBefore(newMain, body.firstChild)
      fixes.mainLandmarkAdded = true
    }
  }

  // Fix landmark issues
  const landmarksToFix = validateLandmark(container)
  if (landmarksToFix && landmarksToFix.length > 0) {
    landmarksToFix.forEach((element) => {
      addLandmarkRegions(element)
      addLandmarkRegions(addMainLandmark(element))
    })
    fixes.landmarksFixed += landmarksToFix.length
  }

  // Validate accessibility report
  const accessibilityReport = validateAccessibilityReport(container)
  if (accessibilityReport && accessibilityReport.length > 0) {
    log(`Accessibility report contains ${accessibilityReport.length} remaining issues`)
  }

  if (fixes.langAdded) {
    log('Lang attribute added to HTML element')
  }

  if (fixes.mainLandmarkAdded) {
    log('Main landmark added')
  }

  const landmarkFixesCount = fixes.landmarksFixed || 0
  if (landmarkFixesCount > 0) {
    log(`Fixed ${landmarkFixesCount} unique landmarks`)
  }

  return fixes
}

// Main function to initiate rendering and accessibility adjustments
function main () {
  const root = document.getElementById('root')

  if (root) {
    // Render app content
    render(
      <>
        {dependencyGraphContent}
        {indexContent}
      </>,
      root
    )

    // Address accessibility issues from the report
    addressAccessibilityIssues(root)
  }
}

// Export the main function
module.exports = { main }
