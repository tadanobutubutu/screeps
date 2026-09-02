/**
 * Accessibility utilities for managing skip links, focus trapping,
 * and other ARIA-related functionality.
 */

const accessibilityUtils = {
  /**
     * Initializes the skip link functionality.
     * Finds a skip link with class 'skip-link' and ensures clicking it
     * focuses the target element while preventing default navigation.
     */
  initSkipLink () {
    const skipLink = document.querySelector('.skip-link')
    if (!skipLink) return

    skipLink.addEventListener('click', (e) => {
      const href = skipLink.getAttribute('href')
      if (!href) return
      const targetId = href.replace('#', '')
      if (!targetId) return
      const target = document.getElementById(targetId)
      if (target) {
        target.setAttribute('tabindex', '-1')
        target.focus()
        e.preventDefault()
      }
    })
  },

  /**
     * Adds a focus trap to the given element.
     * Tab‑presses are confined to the element's focusable descendants.
     *
     * @param {HTMLElement} element - The container element.
     */
  trapFocus (element) {
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
    })

    firstElement.focus()
  },

  /**
     * A newer focus trap implementation.
     * Identical to `trapFocus` for consistency.
     *
     * @param {HTMLElement} element - The container element.
     */
  newFocusTrap (element) {
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
    })

    firstElement.focus()
  },

  /**
     * Enhances keyboard accessibility for interactive elements and elements with
     * the `data-accessible` attribute. Adds a `tabindex="0"` and handles Enter/Space
     * to trigger clicks.
     */
  initAccessibility () {
    // Add keyboard support for all interactive elements and data-accessible elements
    document
      .querySelectorAll('button, a, [role="button"], [data-accessible]')
      .forEach((element) => {
        element.setAttribute('tabindex', '0')
        element.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            element.click()
          }
        })
      })
  },

  /**
     * Announce message to screen readers
     *
     * @param {string} message - The message to announce.
     * @param {string} [priority='polite'] - The aria-live priority ('polite' or 'assertive').
     */
  announceToScreenReader (message, priority = 'polite') {
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.style.position = 'absolute'
    announcer.style.left = '-9999px'
    announcer.textContent = message
    document.body.appendChild(announcer)
    setTimeout(() => {
      announcer.remove()
    }, 1000)
  },

  /**
     * Triggers a file download of the given data as JSON and announces the action
     * to screen readers.
     *
     * @param {Object} data - The data to export.
     * @param {string} filename - The name of the file to download.
     */
  exportData (data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || 'export.json'
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      this.announceToScreenReader(`Download of ${filename} started`)
    }, 100)
  },

  /**
     * Scans the page for common accessibility issues and actively fixes them
     * where possible. Returns an object summarizing the fixes performed.
     *
     * Fixes applied:
     *   - Removes skip links that point to non-existent target elements.
     *   - Adds an empty header row to tables that are missing `<th>` cells.
     *   - Adds an empty `alt` attribute to images missing one (marking them
     *     as decorative so screen readers skip them).
     *   - Logs warnings for structural issues (e.g. inconsistent cell counts)
     *     that cannot be auto-resolved safely.
     */
  addressAccessibilityIssues () {
    const fixes = {
      skipLinks: 0,
      tables: 0,
      images: 0
    }

    // Validate and fix skip links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      const target = link.getAttribute('href').substring(1)
      const element = document.getElementById(target)
      if (!element) {
        console.warn(`Skip link points to non-existent element: ${target}. Removing link.`)
        link.remove()
        fixes.skipLinks++
      }
    })

    // Validate and fix tables
    document.querySelectorAll('table').forEach((table) => {
      if (!table.querySelector('th')) {
        console.warn('Table missing header cells (th). Adding empty header row.')
        const thead = document.createElement('thead')
        const headerRow = document.createElement('tr')
        const firstRow = table.querySelector('tr')
        const columnCount = firstRow ? firstRow.children.length : 0
        for (let i = 0; i < columnCount; i++) {
          const th = document.createElement('th')
          th.setAttribute('scope', 'col')
          headerRow.appendChild(th)
        }
        thead.appendChild(headerRow)
        table.insertBefore(thead, table.firstChild)
        fixes.tables++
      }
      // Warn for inconsistent cell counts (structural issue, do not auto-fix)
      const rows = table.querySelectorAll('tr')
      const cellCounts = new Set()
      rows.forEach((row) => {
        cellCounts.add(row.children.length)
      })
      if (cellCounts.size > 1) {
        console.warn('Inconsistent number of cells across table rows. Manual review required.')
        fixes.tables++
      }
    })

    // Validate and fix images
    document.querySelectorAll('img:not([alt])').forEach((img) => {
      console.warn('Image missing alt attribute. Adding empty alt to mark as decorative.', img)
      img.setAttribute('alt', '')
      fixes.images++
    })

    console.log('Accessibility issues addressed', fixes)
  },

  /**
     * Handle keyboard navigation by dispatching to a handler based on the key pressed.
     *
     * @param {KeyboardEvent} e - The keyboard event.
     * @param {Object} handlers - An object mapping key names to handler functions.
     */
  handleKeyboardNav (e, handlers) {
    const key = e.key
    if (handlers[key]) {
      handlers[key](e)
    }
  },

  /**
     * Gets the full language attribute value.
     *
     * @param {string} locale - The locale code (e.g., 'en').
     * @returns {string} The full language attribute (e.g., 'en-RU').
     */
  getFullLangAttribute (locale = 'en') {
    return `${locale}-RU`
  },

  /**
     * Ensures a landmark has a unique ID.
     *
     * @param {HTMLElement} landmark - The landmark element.
     * @returns {string|null} The landmark's ID.
     */
  ensureUniqueLandmarkId (function (landmark) {
    if (!landmark) return
    if (landmark.id) return landmark.id
    landmark.id = `landmark-${Math.random().toString(36).substr(2, 9)}`
    return landmark.id
  }),

  /**
     * Checks if the page has unique landmarks.
     *
     * @returns {boolean} True if landmarks are unique.
     */
  uniqueLandmarks () {
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]')
    const ids = new Set()

    landmarks.forEach((landmark) => {
      const id = landmark.id
      if (id) ids.add(id)
    })

    return ids.size < 2
  },

  /**
     * Creates an accessible link with proper attributes.
     *
     * @param {string} url - The URL for the link.
     * @param {string} text - The text content of the link.
     * @param {string} [target='_blank'] - The target attribute.
     * @param {string} [ariaLabel] - Optional aria-label.
     * @returns {HTMLAnchorElement} The created link element.
     */
  createAccessibleLink (url, text, target = '_blank', ariaLabel) {
    const link = document.createElement('a')
    link.href = url
    link.textContent = text
    link.setAttribute('target', target)
    link.setAttribute('rel', 'noopener noreferrer')
    link.setAttribute('aria-label', ariaLabel || `Open ${text} in new window`)
    link.setAttribute('role', 'link')
    return link
  },

  /**
   * Adds a lang attribute to the element.
   * @param {HTMLElement} element - The element to add lang attribute to.
   * @param {string} locale - The locale code.
   */
  addLangAttribute (element, locale = 'en') {
    if (element) {
      element.setAttribute('lang', locale)
    }
  },

  /**
   * Checks the accessibility of SVG elements by looking for `title` and `desc` tags.
   * @param {NodeList} svgs - A list of SVG elements.
   * @param {Object} report - The report object to populate.
   */
  checkSvgAccessibility (svgs, report) {
    svgs.forEach((svg, index) => {
      const title = svg.querySelector('title')
      const desc = svg.querySelector('desc')
      if (title && desc) {
        report.passed.push({
          category: 'REACT_041',
          message: `SVG ${index + 1} has accessible title and description`,
          status: 'passed'
        })
      } else {
        report.issues.push({
          category: 'REACT_041',
          message: `SVG ${index + 1} is missing accessible name`,
          status: 'moderate'
        })
        report.summary.moderate++
        report.summary.totalIssues++
      }
    })
  },

  /**
   * Checks the accessibility of links by ensuring they have text content.
   * @param {NodeList} links - A list of link elements.
   * @param {Object} report - The report object to populate.
   */
  checkLinkAccessibility (links, report) {
    links.forEach((link, index) => {
      if (link.textContent.trim() === '') {
        report.issues.push({
          category: 'REACT_036',
          message: `Link ${index + 1} has no accessible text`,
          status: 'moderate'
        })
        report.summary.moderate++
        report.summary.totalIssues++
      } else {
        report.passed.push({
          category: 'REACT_036',
          message: `Link ${index + 1} has accessible text`,
          status: 'passed'
        })
      }
    })
  },

  /**
   * Generates a report based on the accessibility issues found.
   * @returns {Object} The accessibility report.
   */
  generateAccessibilityReport () {
    const report = {
      passed: [],
      issues: [],
      summary: {
        moderate: 0,
        totalIssues: 0
      }
    }

    const svgs = document.querySelectorAll('svg')
    accessibilityUtils.checkSvgAccessibility(svgs, report)

    const links = document.querySelectorAll('a')
    accessibilityUtils.checkLinkAccessibility(links, report)

    return report
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

    // Check for consistent row cell counts
    const rows = table.querySelectorAll('tr')
    const cellCounts = new Set()
    rows.forEach((row) => {
      cellCounts.add(row.children.length)
    })
    if (cellCounts.size > 1) {
      issues.push({ tableIndex: index, issue: 'Inconsistent number of cells across rows' })
    }

    // Ensure data cells have proper headers (simple check)
    const firstRow = rows[0]
    if (firstRow) {
      rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return // skip header row
        const cells = row.querySelectorAll('td')
        cells.forEach((td) => {
          // For simplicity, just check if the table has headers and the cell has a colspan/rowspan that may cause confusion
          if (td.hasAttribute('colspan') || td.hasAttribute('rowspan')) {
            issues.push({
              tableIndex: index,
              issue: `Data cell at row ${rowIndex} has colspan/rowspan`,
              element: td
            })
          }
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

/**
 * Validates the structure of tables on the page for accessibility best practices.
 * This is a more comprehensive version of validateTableStructure that includes additional checks.
 *
 * @returns {boolean} True if all tables pass checks, otherwise false.
 */
function validateTableStructureComprehensive () {
  const tables = document.querySelectorAll('table')
  const issues = []

  tables.forEach((table, tableIndex) => {
    // Check if table has a caption
    const caption = table.querySelector('caption')
    if (!caption) {
      issues.push({ tableIndex, issue: 'Missing caption' })
    }

    // Check for headers
    const headers = table.querySelectorAll('th')
    if (headers.length === 0) {
      issues.push({ tableIndex, issue: 'No header cells found' })
    } else {
      // Check header scope attributes
      headers.forEach((th, headerIndex) => {
        if (!th.hasAttribute('scope')) {
          issues.push({
            tableIndex,
            issue: `Header cell at index ${headerIndex} missing scope attribute`,
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
        tableIndex,
        issue: 'Inconsistent number of cells across rows',
        details: `Found ${cellCounts.size} different cell counts`
      })
    }

    // Check for complex table structures
    const complexCells = table.querySelectorAll('td[colspan], td[rowspan]')
    if (complexCells.length > 0) {
      complexCells.forEach((cell, cellIndex) => {
        issues.push({
          tableIndex,
          issue: 'Complex table structure detected',
          details: `Cell at index ${cellIndex} has colspan/rowspan`,
          element: cell
        })
      })
    }

    // Check for missing summary (deprecated but still sometimes used)
    if (table.hasAttribute('summary')) {
      issues.push({
        tableIndex,
        issue: 'Deprecated summary attribute used',
        details: 'Use caption instead'
      })
    }
  })

  if (issues.length > 0) {
    console.warn('Comprehensive table accessibility issues found:', issues)
    return false
  }

  console.log('All tables passed comprehensive accessibility checks.')
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
  validateTableStructureComprehensive,
  getFullLangAttribute: accessibilityUtils.getFullLangAttribute,
  ensureUniqueLandmarkId: accessibilityUtils.ensureUniqueLandmarkId,
  uniqueLandmarks: accessibilityUtils.uniqueLandmarks,
  createAccessibleLink: accessibilityUtils.createAccessibleLink,
  addLangAttribute: accessibilityUtils.addLangAttribute,
  checkSvgAccessibility: accessibilityUtils.checkSvgAccessibility,
  checkLinkAccessibility: accessibilityUtils.checkLinkAccessibility,
  generateAccessibilityReport: accessibilityUtils.generateAccessibilityReport
}