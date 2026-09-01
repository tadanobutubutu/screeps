const main = require('./utilities')

const {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport
} = require('./utilities')

const {
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  ensureUniqueLandmarks,
  setSvgAccessibilityProps,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn,
  handleCredentialResponse,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  addressAccessibilityIssues
} = main

module.exports = {
  ...main,

  addressAccessibilityIssues: (container) => {
    const fixes = {
      langAdded: false,
      mainLandmarkAdded: false,
      landmarksFixed: 0,
      svgNamesAdded: 0,
      fakeLinksFixed: 0,
      tableStructureFixed: 0,
      ariaLabelsAdded: 0,
      buttonIdentifiersFixed: 0
    }

    // Add lang attribute to HTML element if missing
    const htmlElement = document.documentElement
    const langAttr = getLangAttribute(htmlElement)
    if (!langAttr) {
      htmlElement.lang = 'en'
      fixes.langAdded = true
    }

    // Add main landmark if missing
    const mainElement = document.querySelector('main')
    if (!mainElement) {
      const body = document.body
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
    svgElements.forEach((svg) => {
      const accessibleName = getSvgAccessibleName(svg)
      if (accessibleName && accessibleName.length > 0) {
        setSvgAccessibilityProps(svg, accessibleName)
        fixes.svgNamesAdded++
      }
    })

    // Fix fake link issues (elements that look like links but are missing href)
    const fakeLinks = container.querySelectorAll('[style*="cursor: pointer"]')
    fakeLinks.forEach((link) => {
      const style = window.getComputedStyle(link)
      if (style.cursor === 'pointer' || link.style.cursor === 'pointer') {
        link.setAttribute('role', 'link')
        link.setAttribute('tabindex', '0')
        fixes.fakeLinksFixed++
      }
    })

    // Fix table structure issues
    const tables = container.querySelectorAll('table')
    tables.forEach((table) => {
      if (!table.querySelector('th')) {
        const firstRow = table.querySelector('tr')
        if (firstRow) {
          const cells = firstRow.querySelectorAll('td')
          cells.forEach((cell) => {
            const th = document.createElement('th')
            th.textContent = cell.textContent
            cell.replaceWith(th)
          })
          fixes.tableStructureFixed++
        }
      }
    })

    // Add ARIA labels to buttons without text
    const buttons = container.querySelectorAll('button')
    buttons.forEach((button) => {
      if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
        const icon = button.querySelector('i, svg')
        if (icon) {
          const iconName = icon.className || 'icon'
          button.setAttribute('aria-label', iconName)
          fixes.ariaLabelsAdded++
        }
      }
    })

    // Fix button identifiers
    const buttonsWithoutId = container.querySelectorAll('button:not([id])')
    buttonsWithoutId.forEach((button, index) => {
      button.id = `button-${index}`
      fixes.buttonIdentifiersFixed++
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

    const tableFixes = fixes.tableStructureFixed || 0
    if (tableFixes > 0) {
      log(`Fixed table structure for ${tableFixes} tables`, 'info')
    }

    const ariaLabelFixes = fixes.ariaLabelsAdded || 0
    if (ariaLabelFixes > 0) {
      log(`Added ARIA labels to ${ariaLabelFixes} buttons`, 'info')
    }

    const buttonIdFixes = fixes.buttonIdentifiersFixed || 0
    if (buttonIdFixes > 0) {
      log(`Added identifiers to ${buttonIdFixes} buttons`, 'info')
    }

    return fixes
  },

  // TODO: Implement a new function to handle focus trap for keyboard navigation
  focusTrap: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    let activeElementIndex = focusableElements.length - 1

    function setActiveElement (index) {
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

    function nextFocusableElement () {
      setActiveElement(activeElementIndex + 1)
    }

    function prevFocusableElement () {
      setActiveElement(activeElementIndex - 1)
    }

    function moveFocusToFirst () {
      setActiveElement(0)
    }

    function moveFocusToLast () {
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
  createInPageButton,

  // TODO: Create a utility function to create a web resource button suitable for accessibility (e.g., Github, Stack Overflow, etc.)
  createWebResourceButton,

  // TODO: Validate the table structure for accessibility issues
  validateTableAccessibility,
  validateTableStructure,

  // TODO: Validate the landmark structure for accessibility issues
  validateLandmark,
  validateLandmarkStructure,

  // TODO: Extract the accessible name for an SVG from its content
  getSvgAccessibleName,

  // TODO: Add a language attribute to the HTML element
  getLangAttribute,

  // TODO: Validate the accessibility report for issues
  validateAccessibilityReport,

  // TODO: Address new accessibility issues from insight report ( implement new functions and fixes as needed)

  // Credential response handling
  async handleCredentialResponse (response) {
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
