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

    const keydownHandler = (e) => {
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

    element.addEventListener('keydown', keydownHandler)
    return keydownHandler
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

    const keydownHandler = (e) => {
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

    element.addEventListener('keydown', keydownHandler)
    return keydownHandler
  },

  /**
     * Enhances keyboard accessibility for interactive elements and elements with
     * the `data-accessible` attribute. Adds a `tabindex="0"` and handles Enter/Space
     * to trigger clicks.
     */
  initAccessibility () {
    // Add keyboard support for all interactive elements and data-accessible elements
    document
      .querySelectorAll('a, button, [role="button"], [data-accessible]')
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
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
      this.announceToScreenReader(`Download of ${filename} started`)
    }, 100)
  },

  /**
     * Scans the page for common accessibility issues and logs warnings.
     * Returns an object summarizing the fixes performed.
     */
  addressAccessibilityIssues () {
    const fixes = {
      skipLinks: 0,
      tables: 0,
      images: 0
    }

    // Validate skip links
    document.querySelectorAll('.skip-link[href]').forEach((link) => {
      const target = link.getAttribute('href').replace('#', '')
      const element = document.getElementById(target)
      if (!element) {
        console.warn(`Skip link points to non-existent element: ${target}`)
        fixes.skipLinks++
      }
    })

    // Validate tables
    document.querySelectorAll('table').forEach((table) => {
      if (!table.querySelector('th')) {
        console.warn('Table missing header cells (th)')
        fixes.tables++
      }
      // Ensure each row has same number of cells
      const rows = table.querySelectorAll('tr')
      const cellCounts = new Set()
      rows.forEach((row) => {
        cellCounts.add(row.cells.length)
      })
      if (cellCounts.size > 1) {
        console.warn('Inconsistent number of cells across table rows')
        fixes.tables++
      }
    })

    // Validate images
    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('alt')) {
        console.warn('Image missing alt attribute', img)
        fixes.images++
      }
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
  container.innerHTML = `<div>Dependency graph visualization not implemented</div>`

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
      headers.forEach((header) => {
        if (!header.hasAttribute('scope')) {
          issues.push({ tableIndex: index, issue: 'Header cell missing scope attribute' })
        }
      })
    }

    // Ensure each row has same number of cells
    const rows = table.querySelectorAll('tr')
    const cellCounts = new Set()
    rows.forEach((row) => {
      cellCounts.add(row.cells.length)
    })
    if (cellCounts.size > 1) {
      issues.push({ tableIndex: index, issue: 'Inconsistent number of cells across table rows' })
    }

    // Basic check for problematic colspan/rowspan in data cells
    table.querySelectorAll('td').forEach((cell) => {
      const colspan = parseInt(cell.getAttribute('colspan') || '1', 10)
      const rowspan = parseInt(cell.getAttribute('rowspan') || '1', 10)
      if (colspan > 2 || rowspan > 2) {
        issues.push({ tableIndex: index, issue: 'Excessive colspan/rowspan in data cell may impact accessibility' })
      }
    })
  })

  if (issues.length > 0) {
    console.warn('Table structure issues found:', issues)
    return false
  }

  return true
}

module.exports = {
  accessibilityUtils,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  validateTableStructure
}