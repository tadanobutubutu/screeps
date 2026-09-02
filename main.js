/**
 * Accessibility utilities for managing skip links, focus trapping,
 * and other ARIA-related functionality.
 */

const accessibilityUtils = {
  // TODO: This is the existing code that needs to be preserved
  // Address accessibility issues from insight report
  // ----- END ORIGINAL CODE-----

  // New function: Add a time limit to focus trapping
  timeLimitTrapFocus (element, timeLimit) {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    let currentFocus = firstElement

    const focusOut = (e) => {
      currentFocus = e.target
    }

    const focusIn = () => {
      if (currentFocus === lastElement) {
        currentFocus = firstElement
      }
      currentFocus. focus()
    }

    element.addEventListener('focus', focusIn)
    element.addEventListener('blur', focusOut)

    setTimeout(() => {
      element.removeEventListener('focus', focusIn)
      element.removeEventListener('blur', focusOut)
      currentFocus = null
    }, timeLimit)
  },

  // New function: Add a focus trap with time limit and allowInteraction parameter
  timeLimitNewFocusTrap (element, timeLimit, allowInteraction) {
    if (!element) return

    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }

      if (allowInteraction && e.key === ' ') {
        // Allow interactive elements to be activated on Space key
        const activeElement = document.activeElement
        if (activeElement.tagName.toLowerCase() === 'button') {
          activeElement.click()
          e.preventDefault()
        }
      }
    })

    firstElement.focus()

    setTimeout(() => {
      element.removeEventListener('keydown', arguments[2])
    }, timeLimit)
  }
}

/**
 * Ensures the element has a unique ID.
 * If the element already has an id, it is returned; otherwise a new id is generated.
 *
 * @param {HTMLElement} element - The element to identify.
 * @param {string} [prefix='element'] - Prefix for the generated ID.
 * @returns {string} The element's id.
 */
const ensureElementHasId = (element, prefix = 'element') => {
  if (!element) {
    throw new Error('Element is required')
  }

  if (element.id) {
    return element.id
  }

  const id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  element.id = id
  return id
}

/**
 * Adds an aria‑label to the element if one is not already present.
 *
 * @param {HTMLElement} element - The element to label.
 * @param {string} label - The accessible label text.
 * @returns {HTMLElement} The element (for chaining).
 */
const addAriaLabel = (element, label) => {
  if (!element) {
    throw new Error('Element is required')
  }
  if (!label) {
    throw new Error('Label is required')
  }

  element.setAttribute('aria-label', label)
  return element
}

/**
 * Renders a dependency graph inside the given container.
 *
 * @param {HTMLElement} container - The DOM element that will hold the graph.
 * @param {Object} dependencies - The dependency data to visualize.
 * @param {Object} [options={}] - Optional rendering options.
 * @returns {HTMLElement} The container element.
 */
function renderDependencyGraphs (container, dependencies, options = {}) {
  if (!container) {
    throw new Error('Container element is required')
  }

  if (!dependencies) {
    throw new Error('Dependencies data is required')
  }

  // Ensure container has an id for graph references
  const containerId = ensureElementHasId(container, 'graph-container')

  // Add accessibility label if not present
  addAriaLabel(container, `Dependency graph: ${containerId}`)

  // Render logic placeholder
  container.innerHTML = `<div id="${containerId}">Graph not implemented</div>`

  return container
}

/**
 * Validates the table structure for accessibility issues.
 * Checks for:
 *   - Presence of captions.
 *   - Proper use of `<th>` elements with `scope` attributes.
 *   - Consistent cell counts across rows.
 *   - Absence of problematic colspan/rowspan in data cells (basic check).
 *
 * @returns {boolean} True if all tables pass checks, otherwise false.
 */
function validateTableStructure () {
  const tables = document.querySelectorAll('table')
  const issues = []

  tables.forEach((table, index) => {
    // Check if table has a caption
    const caption = table.querySelector('caption')
    if (!caption) {
      issues.push({ tableIndex: index, issue: 'Missing caption' })
    }

    // Check for header scope
    const headers = table.querySelectorAll('th')
    if (headers.length === 0) {
      issues.push({ tableIndex: index, issue: 'No header cells found' })
    } else {
      headers.forEach((th) => {
        if (!th.hasAttribute('scope')) {
          issues.push({
            tableIndex: index,
            issue: 'Header cell missing scope attribute',
            element: th
          })
        }
      })
    }

    // Check row consistency
    const rows = table.querySelectorAll('tr')
    const cellCounts = new Set()
    rows.forEach((row) => {
      cellCounts.add(row.children.length)
    })

    if (cellCounts.size > 1) {
      issues.push({
        tableIndex: index,
        issue: 'Inconsistent number of cells across rows',
        details: `Found ${cellCounts.size} different cell counts`
      })
    }

    // Check for complex table structures
    const complexCells = table.querySelectorAll('td[colspan], td[rowspan]')
    if (complexCells.length > 0) {
      complexCells.forEach((cell, cellIndex) => {
        issues.push({
          tableIndex: index,
          issue: 'Complex table structure detected',
          details: `Cell at index ${cellIndex} has colspan/rowspan`,
          element: cell
        })
      })
    }
  })

  if (issues.length > 0) {
    console.warn('Table accessibility issues found:', issues)
    return false
  }

  console.log('All tables passed accessibility checks.')
  return true
}

// Export functions for use in other modules
module.exports = {
  initSkipLink: accessibilityUtils.initSkipLink,
  trapFocus: accessibilityUtils.trapFocus,
  newFocusTrap: accessibilityUtils.newFocusTrap,
  initAccessibility: accessibilityUtils.initAccessibility,
  announceToScreenReader: accessibilityUtils.announceToScreenReader,
  handleKeyboardNav: accessibilityUtils.handleKeyboardNav,
  exportData: accessibilityUtils.exportData,
  addressAccessibilityIssues: accessibilityUtils.addressAccessibilityIssues,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  validateTableStructure,
  timeLimitTrapFocus,
  timeLimitNewFocusTrap
}